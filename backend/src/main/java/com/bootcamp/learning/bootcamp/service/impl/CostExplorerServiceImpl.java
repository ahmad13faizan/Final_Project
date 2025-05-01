package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.dto.ColumnNamesDTO;
import com.bootcamp.learning.bootcamp.dto.CostExplorerDTO;
import com.bootcamp.learning.bootcamp.dto.GroupCostDto;
import com.bootcamp.learning.bootcamp.dto.PivotCostDto;
import com.bootcamp.learning.bootcamp.entity.CostExplorerEntity;
import com.bootcamp.learning.bootcamp.repository.repositoryImpl.SnowflakeRepository;
import com.bootcamp.learning.bootcamp.service.CostExplorerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CostExplorerServiceImpl implements CostExplorerService {

    private final SnowflakeRepository snowflakeRepository;

    @Autowired
    public CostExplorerServiceImpl(SnowflakeRepository snowflakeRepository) {
        this.snowflakeRepository = snowflakeRepository;
    }

    private CostExplorerDTO mapToDTO(CostExplorerEntity entity) {
        return new CostExplorerDTO(
                entity.getLinkedAccountId(),
                entity.getMyCloudStartDay(),
                entity.getMyCloudStartMonth(),
                entity.getMyCloudStartYear(),
                entity.getLineItemOperation(),
                entity.getLineItemUsageType(),
                entity.getMyCloudInstanceType(),
                entity.getMyCloudOperatingSystem(),
                entity.getMyCloudPricingType(),
                entity.getMyCloudRegionName(),
                entity.getUsageStartDate(),
                entity.getProductDatabaseEngine(),
                entity.getProductProductName(),
                entity.getLineItemUnblendedCost(),
                entity.getLineItemUsageAmount(),
                entity.getMyCloudCostExplorerUsageGroupType(),
                entity.getPricingUnit(),
                entity.getChargeType(),
                entity.getAvailabilityZone(),
                entity.getTenancy()
        );
    }


    @Override
    public List<CostExplorerDTO> getAllCostExplorerData() {
        return snowflakeRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CostExplorerDTO getCostExplorerDataById(String linkedAccountId) {
        CostExplorerEntity entity = snowflakeRepository.findById(linkedAccountId);
        return mapToDTO(entity);
    }

    public void saveCostExplorerData(CostExplorerEntity entity) {
        snowflakeRepository.save(entity);
    }

    public void deleteCostExplorerData(String linkedAccountId) {
        snowflakeRepository.delete(linkedAccountId);
    }

    @Override
    public ColumnNamesDTO getAllColumnNames() {
        List<String> names = snowflakeRepository.getColumnNames();
        return new ColumnNamesDTO(names);
    }


    @Override
    public List<String> getValuesForColumn(String columnName) {
        List<String> values = snowflakeRepository.getDistinctValuesByColumn(columnName);
        return values.stream()
                .filter(Objects::nonNull) // remove nulls
                .collect(Collectors.toList());
    }


    //for cost-explorer

    @Override
    public List<GroupCostDto> dynamicCosts(
            String groupBy,
            Map<String,String> allRequestParams,
            LocalDate start,
            LocalDate end) {

        // build Map<String,List<Object>> filters here
        Map<String, List<Object>> filters = new LinkedHashMap<>();
        allRequestParams.forEach((k,v) -> {
            if (!k.equals("groupBy") && !k.equals("start") && !k.equals("end")) {
                List<Object> vals = Arrays.stream(v.split(","))
                        .map(String::trim)
                        .collect(Collectors.toList());
                filters.put(k, vals);
            }
        });

        // delegate to repository
        return snowflakeRepository.getCostsByGroupAndFilters(groupBy, filters, start, end);
    }


    @Override
    public List<PivotCostDto> dynamicPivotedCosts(
            String groupBy,
            Map<String,String> allRequestParams,
            LocalDate start,
            LocalDate end) {

        // 1. build filters map (column → list of values)
        Map<String, List<Object>> filters = new LinkedHashMap<>();
        allRequestParams.forEach((k, v) -> {
            if (!k.equals("groupBy") && !k.equals("start") && !k.equals("end")) {
                List<Object> vals = Arrays.stream(v.split(","))
                        .map(String::trim)
                        .collect(Collectors.toList());
                filters.put(k, vals);
            }
        });

        // 2. fetch the raw (group, year, month, cost) rows
        List<GroupCostDto> rows = snowflakeRepository
                .getCostsByGroupAndFilters(groupBy, filters, start, end);

        // 3. discover all distinct year-month keys (e.g. "2025-04")
        LinkedHashSet<String> allMonths = rows.stream()
                .map(r -> r.getYear() + "-" + String.format("%02d", r.getMonth()))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        // 4. group rows by the groupValue
        Map<String, List<GroupCostDto>> byGroup = rows.stream()
                .collect(Collectors.groupingBy(GroupCostDto::getGrp, LinkedHashMap::new, Collectors.toList()));

        // 5. pivot into wide DTOs
        List<PivotCostDto> pivoted = new ArrayList<>();
        for (var entry : byGroup.entrySet()) {
            String grp = entry.getKey();
            PivotCostDto pDto = new PivotCostDto();
            pDto.setGroupValue(grp);

            // initialize every month column to 0.0
            for (String m : allMonths) {
                pDto.getMonthToCost().put(m, 0.0);
            }

            // fill actual totals
            for (GroupCostDto r : entry.getValue()) {
                String key = r.getYear() + "-" + String.format("%02d", r.getMonth());
                pDto.getMonthToCost().put(key, r.getTotal_cost());
            }

            pivoted.add(pDto);
        }

        return pivoted;
    }


}

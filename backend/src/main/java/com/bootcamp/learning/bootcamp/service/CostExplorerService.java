package com.bootcamp.learning.bootcamp.service;


import com.bootcamp.learning.bootcamp.dto.ColumnNamesDTO;
import com.bootcamp.learning.bootcamp.dto.CostExplorerDTO;
import com.bootcamp.learning.bootcamp.dto.GroupCostDto;
import com.bootcamp.learning.bootcamp.dto.PivotCostDto;
import com.bootcamp.learning.bootcamp.entity.CostExplorerEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public interface CostExplorerService {


     List<CostExplorerDTO> getAllCostExplorerData();

    CostExplorerDTO getCostExplorerDataById(String linkedAccountId);

    void saveCostExplorerData(CostExplorerEntity entity);

    void deleteCostExplorerData(String linkedAccountId) ;

    ColumnNamesDTO getAllColumnNames();

    List<String> getValuesForColumn(String columnName);

    // for cost-explorer main
    List<GroupCostDto> dynamicCosts(
            String groupBy,
            Map<String,String> allRequestParams,
            LocalDate start,
            LocalDate end);

    List<PivotCostDto> dynamicPivotedCosts(String groupBy,
                                           Map<String,String> allRequestParams,
                                           LocalDate start,
                                           LocalDate end);


}

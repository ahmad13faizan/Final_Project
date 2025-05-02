package com.bootcamp.learning.bootcamp.repository.repositoryImpl;

import com.bootcamp.learning.bootcamp.dto.GroupCostDto;
import com.bootcamp.learning.bootcamp.entity.CostExplorerEntity;
import com.bootcamp.learning.bootcamp.repository.BaseRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Map;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class SnowflakeRepository implements BaseRepository<CostExplorerEntity> {

    // 1) whitelist your grouping & filter columns
    Set<String> allowed = Set.of(
            "PRODUCT_PRODUCTNAME",
            "LINEITEM_OPERATION",
            "LINEITEM_USAGETYPE",
            "MYCLOUD_REGIONNAME",
            "LINKEDACCOUNTID",
            "MYCLOUD_STARTDAY",
            "MYCLOUD_STARTMONTH",
            "MYCLOUD_STARTYEAR",
            "MYCLOUD_INSTANCETYPE",
            "MYCLOUD_OPERATINGSYSTEM",
            "MYCLOUD_PRICINGTYPE",
            "USAGESTARTDATE",
            "PRODUCT_DATABASEENGINE",
            "LINEITEM_UNBLENDEDCOST",
            "LINEITEM_USAGEAMOUNT",
            "MYCLOUD_COST_EXPLORER_USAGE_GROUP_TYPE",
            "PRICING_UNIT",
            "CHARGE_TYPE",
            "AVAILABILITYZONE",
            "TENANCY"
    );
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SnowflakeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<CostExplorerEntity> findAll() {
        String sql = "SELECT * FROM cost_explorer limit 1000";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new CostExplorerEntity(
                rs.getString("LINKEDACCOUNTID"),
                rs.getInt("MYCLOUD_STARTDAY"),
                rs.getInt("MYCLOUD_STARTMONTH"),
                rs.getInt("MYCLOUD_STARTYEAR"),
                rs.getString("LINEITEM_OPERATION"),
                rs.getString("LINEITEM_USAGETYPE"),
                rs.getString("MYCLOUD_INSTANCETYPE"),
                rs.getString("MYCLOUD_OPERATINGSYSTEM"),
                rs.getString("MYCLOUD_PRICINGTYPE"),
                rs.getString("MYCLOUD_REGIONNAME"),
                rs.getTimestamp("USAGESTARTDATE"),
                rs.getString("PRODUCT_DATABASEENGINE"),
                rs.getString("PRODUCT_PRODUCTNAME"),
                rs.getDouble("LINEITEM_UNBLENDEDCOST"),
                rs.getDouble("LINEITEM_USAGEAMOUNT"),
                rs.getString("MYCLOUD_COST_EXPLORER_USAGE_GROUP_TYPE"),
                rs.getString("PRICING_UNIT"),
                rs.getString("CHARGE_TYPE"),
                rs.getString("AVAILABILITYZONE"),
                rs.getString("TENANCY")
        ));
    }

    @Override
    public CostExplorerEntity findById(String id) {
        String sql = "SELECT * FROM cost_explorer limit 1";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) -> new CostExplorerEntity(
                rs.getString("LINKEDACCOUNTID"),
                rs.getInt("MYCLOUD_STARTDAY"),
                rs.getInt("MYCLOUD_STARTMONTH"),
                rs.getInt("MYCLOUD_STARTYEAR"),
                rs.getString("LINEITEM_OPERATION"),
                rs.getString("LINEITEM_USAGETYPE"),
                rs.getString("MYCLOUD_INSTANCETYPE"),
                rs.getString("MYCLOUD_OPERATINGSYSTEM"),
                rs.getString("MYCLOUD_PRICINGTYPE"),
                rs.getString("MYCLOUD_REGIONNAME"),
                rs.getTimestamp("USAGESTARTDATE"),
                rs.getString("PRODUCT_DATABASEENGINE"),
                rs.getString("PRODUCT_PRODUCTNAME"),
                rs.getDouble("LINEITEM_UNBLENDEDCOST"),
                rs.getDouble("LINEITEM_USAGEAMOUNT"),
                rs.getString("MYCLOUD_COST_EXPLORER_USAGE_GROUP_TYPE"),
                rs.getString("PRICING_UNIT"),
                rs.getString("CHARGE_TYPE"),
                rs.getString("AVAILABILITYZONE"),
                rs.getString("TENANCY")
        ));
    }

    @Override
    public void save(CostExplorerEntity entity) {
        String sql = "INSERT INTO cost_explorer (" +
                "LINKEDACCOUNTID, MYCLOUD_STARTDAY, MYCLOUD_STARTMONTH, MYCLOUD_STARTYEAR, " +
                "LINEITEM_OPERATION, LINEITEM_USAGETYPE, MYCLOUD_INSTANCETYPE, MYCLOUD_OPERATINGSYSTEM, " +
                "MYCLOUD_PRICINGTYPE, MYCLOUD_REGIONNAME, USAGESTARTDATE, PRODUCT_DATABASEENGINE, " +
                "PRODUCT_PRODUCTNAME, LINEITEM_UNBLENDEDCOST, LINEITEM_USAGEAMOUNT, " +
                "MYCLOUD_COST_EXPLORER_USAGE_GROUP_TYPE, PRICING_UNIT, CHARGE_TYPE, " +
                "AVAILABILITYZONE, TENANCY) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
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
                entity.getTenancy());
    }

    @Override
    public void delete(String id) {
        String sql = "DELETE FROM cost_explorer WHERE LINKEDACCOUNTID = ?";
        jdbcTemplate.update(sql, id);
    }


    // In SnowflakeRepository.java
    public List<String> getColumnNames() {
        String sql =
                "SELECT COLUMN_NAME  " +
                        "FROM INFORMATION_SCHEMA.COLUMNS  " +
                        "WHERE TABLE_NAME = 'COST_EXPLORER'  " +    // must match your table’s name in uppercase
                        "  AND TABLE_SCHEMA = CURRENT_SCHEMA()";     // ensure you’re in the right schema
        return jdbcTemplate.queryForList(sql, String.class);
    }


    /**
     * Return the distinct values of the given column
     * in the cost_explorer table.
     */
    public List<String> getDistinctValuesByColumn(String columnName) {
        if (!allowed.contains(columnName)) {
            throw new IllegalArgumentException("Invalid column name: " + columnName);
        }

        String sql = "SELECT DISTINCT " + columnName + " FROM cost_explorer";
        return jdbcTemplate.queryForList(sql, String.class);
    }




    /**
     * @param groupByColumn   the column to GROUP BY (must be whitelisted)
     * @param filters         map of “filterColumn → list of filterValues” (all columns AND-ed; values within a column OR-ed)
     * @param startDate       inclusive start date
     * @param endDate         inclusive end date
     */
    public List<GroupCostDto> getCostsByGroupAndFilters(
            String groupByColumn,
            Map<String, List<Object>> filters,
            LocalDate startDate,
            LocalDate endDate) {

        if (!allowed.contains(groupByColumn)) {
            throw new IllegalArgumentException("Invalid groupByColumn: " + groupByColumn);
        }
        for (String col : filters.keySet()) {
            if (!allowed.contains(col)) {
                throw new IllegalArgumentException("Invalid filter column: " + col);
            }
        }

        // 2) build SQL coalesce NULL→'Unknown'
        String grpExpr = "COALESCE(" + groupByColumn + ",'Unknown')";
        StringBuilder sql = new StringBuilder()
                .append("SELECT ")
                .append(grpExpr).append(" AS grp, ")
                .append("MYCLOUD_STARTYEAR, MYCLOUD_STARTMONTH, ")
                .append("SUM(LINEITEM_USAGEAMOUNT * LINEITEM_UNBLENDEDCOST) as Total_Cost ")
                .append("FROM cost_explorer ")
                .append("WHERE ")
                // date-range logic
                .append("(MYCLOUD_STARTYEAR > ? OR (MYCLOUD_STARTYEAR = ? AND MYCLOUD_STARTMONTH >= ?)) ")
                .append("AND (MYCLOUD_STARTYEAR < ? OR (MYCLOUD_STARTYEAR = ? AND MYCLOUD_STARTMONTH <= ?)) ");

        // 3) add IN-clauses for each filter column
        for (Map.Entry<String,List<Object>> e : filters.entrySet()) {
            String col = e.getKey();
            List<Object> vals = e.getValue();
            if (vals.isEmpty()) continue;
            sql.append("AND ").append(col)
                    .append(" IN (")
                    .append(vals.stream().map(v->"?").collect(Collectors.joining(",")))
                    .append(") ");
        }

        sql.append("GROUP BY ")
                .append(grpExpr)
                .append(", MYCLOUD_STARTYEAR, MYCLOUD_STARTMONTH ")
                .append("ORDER BY MYCLOUD_STARTYEAR, MYCLOUD_STARTMONTH");

        // 4) build params
        List<Object> params = new ArrayList<>();
        int sy = startDate.getYear(), sm = startDate.getMonthValue();
        int ey = endDate.getYear(),   em = endDate.getMonthValue();
        params.add(sy); params.add(sy); params.add(sm);
        params.add(ey); params.add(ey); params.add(em);
        filters.values().forEach(list -> params.addAll(list));

        // 5) execute
        return jdbcTemplate.query(
                sql.toString(),
                params.toArray(),
                (rs, rn) -> new GroupCostDto(
                        rs.getString("GRP"),
                        rs.getInt("MYCLOUD_STARTYEAR"),
                        rs.getInt("MYCLOUD_STARTMONTH"),
                        rs.getDouble("TOTAL_COST")
                )
        );
    }



}

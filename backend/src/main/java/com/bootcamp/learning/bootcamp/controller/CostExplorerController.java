package com.bootcamp.learning.bootcamp.controller;

import com.bootcamp.learning.bootcamp.dto.ColumnNamesDTO;
import com.bootcamp.learning.bootcamp.dto.CostExplorerDTO;
import com.bootcamp.learning.bootcamp.dto.GroupCostDto;
import com.bootcamp.learning.bootcamp.dto.PivotCostDto;
import com.bootcamp.learning.bootcamp.service.CostExplorerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/costExplorer")
public class CostExplorerController {

    private final CostExplorerService costExplorerService;

    @Autowired
    public CostExplorerController(CostExplorerService costExplorerService) {
        this.costExplorerService = costExplorerService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<CostExplorerDTO>> getAll() {
        List<CostExplorerDTO> costExplorerList = costExplorerService.getAllCostExplorerData();
        return ResponseEntity.ok(costExplorerList);
    }

    @GetMapping("/{linkedAccountId}")
    public ResponseEntity<CostExplorerDTO> getById(@PathVariable String linkedAccountId) {
        CostExplorerDTO costExplorerDTO = costExplorerService.getCostExplorerDataById(linkedAccountId);
        return ResponseEntity.ok(costExplorerDTO);
    }

    // in CostExplorerController.java
    @GetMapping("/columns")
    public ResponseEntity<ColumnNamesDTO> getColumnNames() {
        ColumnNamesDTO dto = costExplorerService.getAllColumnNames();
        return ResponseEntity.ok(dto);
    }


    @GetMapping("/values/{columnName}")
    public ResponseEntity<List<String>> getValuesForColumn(@PathVariable String columnName) {
        List<String> values = costExplorerService.getValuesForColumn(columnName);
        return ResponseEntity.ok(values);
    }


    /**
     * Returns one row per (group,year,month)
     */
    @GetMapping("/dynamic-costs")
    public ResponseEntity<List<GroupCostDto>> dynamicCosts(
            @RequestParam String groupBy,
            @RequestParam Map<String,String> allRequestParams,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        List<GroupCostDto> result = costExplorerService.dynamicCosts(groupBy, allRequestParams, start, end);
        return ResponseEntity.ok(result);
    }

    //how to call GET /cost-explorer/dynamic-costs?
    //  groupBy=PRODUCT_PRODUCTNAME
    //  &LINEITEM_OPERATION=CreateSnapshot,Storage
    //  &start=2025-04-01
    //  &end=2025-04-30

    /**
     * Returns one row per group, with each month turned into a column
     */
    @GetMapping("/dynamic-costs-pivoted")
    public ResponseEntity<List<PivotCostDto>> dynamicPivotedCosts(
            @RequestParam String groupBy,
            @RequestParam Map<String,String> allRequestParams,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        List<PivotCostDto> result = costExplorerService.dynamicPivotedCosts(groupBy, allRequestParams, start, end);
        return ResponseEntity.ok(result);
    }

    //how to call pivoted form
    //    GET /cost-explorer/dynamic-costs-pivoted?
    //    groupBy=PRODUCT_PRODUCTNAME
    //    &LINEITEM_OPERATION=CreateSnapshot,Storage
    //    &start=2025-04-01p
    //    &end=2025-04-30




}

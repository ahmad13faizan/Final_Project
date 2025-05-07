import React, { useEffect, useState } from "react";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { FaSlidersH } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchColumns } from "../redux/costExplorerSlice";
import formatColumn from "../utils/Formatter";
import api from "../api/axios";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";

ReactFC.fcRoot(FusionCharts, Charts);

const Cost_Explorer = () => {
  const dispatch = useDispatch();
  const { columns, loading } = useSelector((state) => state.costExplorer);

  const [selectedGroup, setSelectedGroup] = useState("PRODUCT_PRODUCTNAME");
  const [checkedValues, setCheckedValues] = useState({}); // { col: [vals] }
  const [columnValues, setColumnValues] = useState({}); // { col: [all vals] }
  const [openValues, setOpenValues] = useState({}); // { col: bool }
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState([]);

  const [startDate, setStartDate] = useState(dayjs("2025-04-01"));

  const [endDate, setEndDate] = useState(dayjs());

  const [anchorEl, setAnchorEl] = useState(null);
  const maxButtons = 8;

  useEffect(() => {
    dispatch(fetchColumns());
  }, [dispatch]);

  // re-fetch when anything changes
  useEffect(() => {
    if (!selectedGroup) return;

    const params = new URLSearchParams();
    params.set("groupBy", selectedGroup);
    params.set("start", startDate.format("YYYY-MM-DD"));
    params.set("end", endDate.format("YYYY-MM-DD"));

    // … inside your effect that builds params …
    Object.entries(checkedValues)
      .filter(([, vals]) => vals.length > 0)
      .forEach(([col, vals]) => {
        params.set(col, vals.join(",")); // ← no .map(v => `"${v}"`)
      });

    api
      .get(`/api/costExplorer/dynamic-costs-pivoted?${params.toString()}`)
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [selectedGroup, checkedValues, startDate, endDate]);

  // group-by handlers
  const handleGroupClick = (col) => {
    setSelectedGroup(col);
    setAnchorEl(null);
  };
  const handleMoreClick = (e) => setAnchorEl(e.currentTarget);
  const handleMoreClose = () => setAnchorEl(null);

  // toggle filters panel
  const handleFilterToggle = () => setShowFilters((f) => !f);

  // toggle a filter column open/closed and load its values
  const toggleFilterOpen = (col) => {
    setOpenValues((o) => {
      const isOpen = !o[col];
      if (isOpen && !columnValues[col]) {
        api
          .get(`/api/costExplorer/values/${col}`)
          .then((r) => setColumnValues((v) => ({ ...v, [col]: r.data })))
          .catch(console.error);
      }
      return { ...o, [col]: isOpen };
    });
  };

  // toggle individual value in a filter column
  const handleValueCheck = (col, val) => {
    setCheckedValues((prev) => {
      const list = prev[col] || [];
      const next = list.includes(val)
        ? list.filter((x) => x !== val)
        : [...list, val];
      return { ...prev, [col]: next };
    });
  };

  // build group-by button lists
  const ordered = selectedGroup
    ? [selectedGroup, ...columns.filter((c) => c !== selectedGroup)]
    : columns;
  const visibleButtons = ordered.slice(0, maxButtons);
  const overflowButtons = ordered.slice(maxButtons);

  // derive sorted list of month‑keys across all data rows:
  const monthKeys = React.useMemo(() => {
    const set = new Set();
    data.forEach((r) => {
      Object.keys(r.monthToCost || {}).forEach((m) => set.add(m));
    });
    return Array.from(set).sort(); // e.g. ["2025-04","2025-05",…]
  }, [data]);

  // helper to sum all month values for a row:
  const sumRow = (row) =>
    monthKeys.reduce((acc, m) => acc + (row.monthToCost[m] || 0), 0);

  // 1) figure out the top‑5 groups by TOTAL cost across all months:
  //
  const totals = data.map((r) => ({
    group: r.groupValue,
    total: monthKeys.reduce((sum, m) => sum + (r.monthToCost[m] || 0), 0),
  }));
  const top5 = totals
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((r) => r.group);

  const lineDataSource = {
    chart: {
      caption: "Top 5 Groups Cost Trend",
      xAxisName: "Month",
      yAxisName: "Cost",
      theme: "fusion",
    },
    categories: [
      {
        category: monthKeys.map((m) => ({ label: m })),
      },
    ],
    dataset: data
      .filter((r) => top5.includes(r.groupValue))
      .map((r) => ({
        seriesname: r.groupValue,
        data: monthKeys.map((m) => ({
          value: (r.monthToCost[m] || 0).toFixed(2),
        })),
      })),
  };

  const barDataSources = monthKeys.map((m) => {
    // for this month, sort groups by that month’s cost:
    const topThisMonth = [...data]
      .sort((a, b) => (b.monthToCost[m] || 0) - (a.monthToCost[m] || 0))
      .slice(0, 5);
    return {
      month: m,
      dataSource: {
        chart: {
          caption: `Top 5 for ${m}`,
          xAxisName: "Group",
          yAxisName: "Cost",
          theme: "fusion",
        },
        data: topThisMonth.map((r) => ({
          label: r.groupValue,
          value: (r.monthToCost[m] || 0).toFixed(2),
        })),
      },
    };
  });

  return (
    <Box m={2} bgcolor="#f0f0f0" p={2} borderRadius={2}>
      <Typography sx={{ fontWeight: "600", fontSize: "33px" }} gutterBottom>
        Cost Explorer
      </Typography>
      {loading && <CircularProgress />}

      {/* Group-by + More */}
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            overflowX: "auto",
            py: 1,
          }}
        >
          {visibleButtons.map((col) => (
            <Button
              key={col}
              variant={col === selectedGroup ? "contained" : "outlined"}
              sx={{
                bgcolor: col === selectedGroup ? "#0056b3" : "white",
                color: col === selectedGroup ? "white" : "#0056b3",
                borderColor: "#0056b3",
                textTransform: "none",
              }}
              onClick={() => handleGroupClick(col)}
            >
              {formatColumn(col)}
            </Button>
          ))}
          {overflowButtons.length > 0 && (
            <>
              <Button
                variant="outlined"
                onClick={handleMoreClick}
                sx={{
                  bgcolor: anchorEl ? "#0056b3" : "white",
                  color: anchorEl ? "white" : "#0056b3",
                  borderColor: "#0056b3",
                  textTransform: "none",
                }}
                endIcon={<MoreHorizIcon />}
              >
                More
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMoreClose}
              >
                {overflowButtons.map((col) => (
                  <MenuItem
                    key={col}
                    onClick={() => handleGroupClick(col)}
                    sx={{ color: "#0056b3" }}
                  >
                    {formatColumn(col)}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
        <FaSlidersH
          onClick={handleFilterToggle}
          style={{
            cursor: "pointer",
            marginLeft: 8,
            padding: 8,
            backgroundColor: "#0056b3",
            color: "white",
            borderRadius: 4,
          }}
        />
      </Box>

      {/* Date pickers */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{ background: "white" }}
            label="Start Date"
            value={startDate}
            onChange={(d) => setStartDate(d)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{ "& .MuiInputBase-root": { height: 32 }, minWidth: 120 }}
              />
            )}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{ background: "white" }}
            label="End Date"
            value={endDate}
            onChange={(d) => setEndDate(d)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{ "& .MuiInputBase-root": { height: 32 }, minWidth: 120 }}
              />
            )}
          />
        </LocalizationProvider>
      </Box>

      {/* Charts + Filters */}
      <Box
        sx={{ display: "flex", gap: 2, bgcolor: "#fff", p: 2, borderRadius: 2 }}
      >
        <Box sx={{ flexGrow: 1, flexDirection: "column" }}>
          {" "}
          Charts
          <Box sx={{ margin: "22px 0px" }}>
            {/* Multi‑series line chart */}

            <ReactFC
              type="msline"
              width="95%"
              height="400"
              dataFormat="json"
              dataSource={lineDataSource}
            />

            {<b>LineChart</b>}
          </Box>
          <Box>
            {/* Bar charts per month */}
            {barDataSources.map((b) => (
              <ReactFC
                key={b.month}
                type="column2d"
                width="95%"
                height="300"
                dataFormat="json"
                dataSource={b.dataSource}
              />
            ))}

            {<b>BarChart</b>}
          </Box>
        </Box>

        {showFilters && (
          <Paper
            elevation={2}
            sx={{ maxWidth: 300, maxHeight: 400, overflowY: "auto" }}
          >
            <Typography
              sx={{
                fontSize: "19px",
                fontWeight: "600",
                zIndex: "100",
                color: "white",
                padding: "6px 8px",
                background: "#0056b3;",
                position: "sticky",
                top: "0",
              }}
              variant="h6"
              gutterBottom
            >
              Filters
            </Typography>
            {columns.map((col) => (
              <Box key={col} mb={1}>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={openValues[col] || false}
                    onChange={() => toggleFilterOpen(col)}
                    color="primary"
                  />
                  <Typography
                    onClick={() => toggleFilterOpen(col)}
                    sx={{ cursor: "pointer" }}
                  >
                    {formatColumn(col)}
                  </Typography>
                </Box>
                {openValues[col] && columnValues[col] && (
                  <Box ml={3} mt={0.5} p={1} borderLeft="2px solid #ccc">
                    {columnValues[col].map((val) => (
                      <Box key={val} display="flex" alignItems="center">
                        <Checkbox
                          size="small"
                          checked={checkedValues[col]?.includes(val) || false}
                          onChange={() => handleValueCheck(col, val)}
                        />
                        <Typography variant="body2">{val}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      {/* Results */}
      <TableContainer
        elevation={2}
        component={Paper}
        sx={{ marginBottom: 6, maxHeight: 400, flex: 1 }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "white",
                  borderRight: "solid grey 1px",
                  fontWeight: "bold",
                  background: "#0056b3",
                }}
              >
                {formatColumn(selectedGroup)}
              </TableCell>
              {monthKeys.map((m) => (
                <TableCell
                  sx={{
                    color: "white",
                    borderRight: "solid grey 1px",
                    fontWeight: "bold",
                    background: "#0056b3",
                  }}
                  key={m}
                  align="right"
                >
                  {m}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  color: "white",
                  background: "#0056b3",
                  fontWeight: "bold",
                }}
                align="right"
              >
                Total Cost
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, i) => {
              const total = sumRow(row);
              return (
                <TableRow key={i}>
                  <TableCell sx={{ borderRight: "solid grey 1px" }}>
                    {row.groupValue}
                  </TableCell>
                  {monthKeys.map((m) => (
                    <TableCell
                      sx={{ borderRight: "solid grey 1px" }}
                      key={m}
                      align="right"
                    >
                      {(row.monthToCost[m] || 0).toFixed(2)}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{ color: "#0056b3", fontWeight: "bold" }}
                    align="right"
                  >
                    {total.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}

            {/* ─────────────── Grand‑Total Row ─────────────── */}
            <TableRow sx={{ position: "sticky", bottom: "0" }}>
              <TableCell
                sx={{
                  color: "#0056b3",
                  borderRight: "solid grey 1px",
                  background: "#c5e0fc",
                  fontWeight: "bold",
                }}
              >
                Grand Total
              </TableCell>

              {monthKeys.map((m) => {
                const monthSum = data.reduce(
                  (sum, r) => sum + (r.monthToCost[m] || 0),
                  0
                );
                return (
                  <TableCell
                    key={m}
                    align="right"
                    sx={{
                      color: "#0056b3",
                      borderRight: "solid grey 1px",
                      fontWeight: "bold",
                      background: "#c5e0fc",
                    }}
                  >
                    {monthSum.toFixed(2)}
                  </TableCell>
                );
              })}

              {/* overall total of all months & all groups */}
              <TableCell
                align="right"
                sx={{
                  color: "#0056b3",
                  fontWeight: "bold",
                  background: "#c5e0fc",
                }}
              >
                {data
                  .reduce(
                    (grand, r) =>
                      grand +
                      monthKeys.reduce(
                        (s, m) => s + (r.monthToCost[m] || 0),
                        0
                      ),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Cost_Explorer;

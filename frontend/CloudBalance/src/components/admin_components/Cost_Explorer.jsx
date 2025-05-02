// src/components/Cost_Explorer.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { FaSlidersH } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchColumns } from "../../redux/costExplorerSlice";
import formatColumn from "../../utils/Formatter";
import api from "../../api/axios";

const Cost_Explorer = () => {
  const dispatch = useDispatch();
  const { columns, loading } = useSelector((state) => state.costExplorer);

  const [selectedGroup, setSelectedGroup] = useState("PRODUCT_PRODUCTNAME");
  const [checkedValues, setCheckedValues] = useState({});   // { col: [vals] }
  const [columnValues, setColumnValues] = useState({});     // { col: [all vals] }
  const [openValues, setOpenValues] = useState({});         // { col: bool }
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState([]);

  const [startDate, setStartDate] = useState(dayjs('2025-04-01'));

  const [endDate, setEndDate] = useState(dayjs());

  const [anchorEl, setAnchorEl] = useState(null);
  const maxButtons = 8;

  // load column names
  useEffect(() => {
    dispatch(fetchColumns());
  }, [dispatch]);

  // re-fetch when anything changes
  useEffect(() => {
    if (!selectedGroup) return;
  
    const params = new URLSearchParams();
    params.set("groupBy", selectedGroup);
    params.set("start", startDate.format("YYYY-MM-DD"));
    params.set("end",   endDate.format("YYYY-MM-DD"));
  
    // Only add filters for columns whose array has length>0
    Object.entries(checkedValues)
      .filter(([, vals]) => vals.length > 0)            // ← skip empty lists
      .forEach(([col, vals]) => {
        // quote any with spaces
        const encoded = vals
          .map(v => (v.includes(" ") ? `"${v}"` : v))
          .join(",");
        params.set(col, encoded);
      });
  
    api
      .get(`/api/costExplorer/dynamic-costs-pivoted?${params.toString()}`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, [selectedGroup, checkedValues, startDate, endDate]);
  
  // group-by handlers
  const handleGroupClick = col => { setSelectedGroup(col); setAnchorEl(null); };
  const handleMoreClick = e => setAnchorEl(e.currentTarget);
  const handleMoreClose = () => setAnchorEl(null);

  // toggle filters panel
  const handleFilterToggle = () => setShowFilters(f => !f);

  // toggle a filter column open/closed and load its values
  const toggleFilterOpen = col => {
    setOpenValues(o => {
      const isOpen = !o[col];
      if (isOpen && !columnValues[col]) {
        api.get(`/api/costExplorer/values/${col}`)
          .then(r => setColumnValues(v => ({ ...v, [col]: r.data })))
          .catch(console.error);
      }
      return { ...o, [col]: isOpen };
    });
  };

  // toggle individual value in a filter column
  const handleValueCheck = (col, val) => {
    setCheckedValues(prev => {
      const list = prev[col] || [];
      const next = list.includes(val)
        ? list.filter(x => x !== val)
        : [...list, val];
      return { ...prev, [col]: next };
    });
  };

  // build group-by button lists
  const ordered = selectedGroup
    ? [selectedGroup, ...columns.filter(c => c !== selectedGroup)]
    : columns;
  const visibleButtons = ordered.slice(0, maxButtons);
  const overflowButtons = ordered.slice(maxButtons);

  return (
    <Box m={2} bgcolor="#f0f0f0" p={2} borderRadius={2}>
      <Typography variant="h4" gutterBottom>Cost Explorer</Typography>
      {loading && <CircularProgress />}

      {/* Group-by + More */}
      <Box display="flex" alignItems="center" mb={2}>
        <Box sx={{ flex:1, display:"flex", gap:1, flexWrap:"wrap", overflowX:"auto", py:1 }}>
          {visibleButtons.map(col => (
            <Button
              key={col}
              variant={col===selectedGroup ? "contained" : "outlined"}
              sx={{
                bgcolor: col===selectedGroup ? "#0056b3" : "white",
                color: col===selectedGroup ? "white" : "#0056b3",
                borderColor: "#0056b3",
                textTransform: "none"
              }}
              onClick={()=>handleGroupClick(col)}
            >
              {formatColumn(col)}
            </Button>
          ))}
          {overflowButtons.length>0 && (
            <>
              <Button
                variant="outlined"
                onClick={handleMoreClick}
                sx={{
                  bgcolor: anchorEl ? "#0056b3" : "white",
                  color: anchorEl ? "white" : "#0056b3",
                  borderColor: "#0056b3",
                  textTransform: "none"
                }}
                endIcon={<MoreHorizIcon />}
              >More</Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMoreClose}>
                {overflowButtons.map(col => (
                  <MenuItem key={col} onClick={()=>handleGroupClick(col)} sx={{ color:"#0056b3" }}>
                    {formatColumn(col)}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
        <FaSlidersH
          onClick={handleFilterToggle}
          style={{ cursor:"pointer", marginLeft:8, padding:8, backgroundColor:"#0056b3", color:"white", borderRadius:4 }}
        />
      </Box>

      {/* Date pickers */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={d=>setStartDate(d)}
            renderInput={params => (
              <TextField {...params} size="small" sx={{ "& .MuiInputBase-root":{height:32}, minWidth:120 }} />
            )}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={d=>setEndDate(d)}
            renderInput={params => (
              <TextField {...params} size="small" sx={{ "& .MuiInputBase-root":{height:32}, minWidth:120 }} />
            )}
          />
        </LocalizationProvider>
      </Box>

      {/* Charts + Filters */}
      <Box sx={{ display:"flex", gap:2, bgcolor:"#fff", p:2, borderRadius:2 }}>
        <Box sx={{ flexGrow:1 }}> charts boxes area </Box>



        {showFilters && (
          <Paper variant="outlined" sx={{ p:2, maxWidth:300, maxHeight:400, overflowY:"auto" }}>
            <Typography sx={{background:"white", position:"sticky",top:"0"}} variant="h6" gutterBottom>Filters</Typography>
            {columns.map(col => (
              <Box key={col} mb={1}>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={openValues[col]||false}
                    onChange={()=>toggleFilterOpen(col)}
                    color="primary"
                  />
                  <Typography onClick={()=>toggleFilterOpen(col)} sx={{ cursor:"pointer" }}>
                    {formatColumn(col)}
                  </Typography>
                </Box>
                {openValues[col] && columnValues[col] && (
                  <Box ml={3} mt={0.5} p={1} borderLeft="2px solid #ccc">
                    {columnValues[col].map(val => (
                      <Box key={val} display="flex" alignItems="center">
                        <Checkbox
                          size="small"
                          checked={checkedValues[col]?.includes(val)||false}
                          onChange={()=>handleValueCheck(col,val)}
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
      {data.length>0 && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>Results</Typography>
          {data.map((row,i)=>(
            <Paper key={i} variant="outlined" sx={{ p:1, mb:1 }}>
              <pre style={{ margin:0 }}>{JSON.stringify(row,null,2)}</pre>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Cost_Explorer;

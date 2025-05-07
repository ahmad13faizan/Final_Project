import React, { useEffect, useState, useMemo } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Popover,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FaLock, FaCloud } from "react-icons/fa";
import api from "../api/axios";

const getAccountIcon = (name) => {
  const key = name.toLowerCase();
  if (key.includes(""))
    return (
      <FaCloud
        size={16}
        style={{ marginRight: 8, color: "rgb(62, 147, 243)" }}
      />
    );
  return <FaLock size={16} style={{ marginRight: 8 }} />;
};

const AWSDashboard = ({ onAccountChange, selectedAccountId = "" }) => {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(selectedAccountId);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [tab, setTab] = useState("ec2");
  const [filters, setFilters] = useState({});

  // filter popover state
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        
        const response = await api.get("/api/accounts");
        setAccounts(response.data);
        setSelectedAccount(response.data[5].accountId);
        fetchResources(response.data[5].accountId, "ec2");

      } catch (error) {
        console.error("Failed to fetch accounts", error);
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetchAccounts();
  }, []);

  const fetchResources = async (accountId, type) => {
    if (!accountId) return;
    setLoadingResources(true);
    try {
      const response = await api.get(`/api/AWSAccount/${type}/${accountId}`);
      setResources(response.data);
      // initialize filters
      const initial = {};
      (response.data[0] ? Object.keys(response.data[0]) : []).forEach((key) => {
        initial[key] = "";
      });
      setFilters(initial);
    } catch (error) {
      console.error(`Failed to fetch ${type.toUpperCase()} resources`, error);
      setResources([]);
      setFilters({});
    } finally {
      setLoadingResources(false);
    }
  };

  const handleAccountChange = (event) => {
    const accountId = event.target.value;
    setSelectedAccount(accountId);
    setTab("ec2");
    fetchResources(accountId, "ec2");
    if (onAccountChange) onAccountChange(accountId);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    fetchResources(selectedAccount, newValue);
  };

  const handleFilterOpen = (column, target) => {
    setActiveColumn(column);
    setAnchorEl(target);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
    setActiveColumn(null);
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [activeColumn]: e.target.value }));
  };

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      return Object.entries(filters).every(([key, val]) => {
        if (!val) return true;
        const cell = String(item[key] ?? "").toLowerCase();
        return cell.includes(val.toLowerCase());
      });
    });
  }, [resources, filters]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <FormControl sx={{ minWidth: 220 }} size="small" variant="outlined">
          <InputLabel id="account-select-label">Select Account</InputLabel>
          {loadingAccounts ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 1.5 }}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            <Select
              sx={{ backgroundColor: "#fff" }}
              labelId="account-select-label"
              value={selectedAccount}
              label="Select Account"
              onChange={handleAccountChange}
            >
              {accounts.map((account) => (
                <MenuItem key={account.accountId} value={account.accountId}>
                  <Grid container alignItems="center">
                    <Grid item>{getAccountIcon(account.accountName)}</Grid>
                    <Grid item>
                      <Typography variant="body2">
                        {account.accountName}
                        <br />
                        ID-{account.accountId}
                      </Typography>
                    </Grid>
                  </Grid>
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      </Box>

      <Box
        sx={{
          height: "75vh",
          boxShadow: 2,
          m: 2,
          px: 2,
          borderRadius: 2,
          backgroundColor: "#fff",
          p: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          AWS Resources
        </Typography>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="EC2" value="ec2" />
          <Tab label="RDS" value="rds" />
          <Tab label="ASG" value="asg" />
        </Tabs>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {tab.toUpperCase()} Resources
        </Typography>

        {loadingResources ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {Object.keys(resources[0] || filters).map((key) => (
                    <TableCell
                      sx={{ backgroundColor: "#1976b2", color: "white" }}
                      key={key}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2">
                          <b>{key}</b>
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) =>
                            handleFilterOpen(key, e.currentTarget)
                          }
                          sx={{ color: "white", ml: 1 }}
                        >
                          <FilterListIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResources.length > 0 ? (
                  filteredResources.map((res, i) => (
                    <TableRow key={i}>
                      {Object.values(res).map((val, j) => (
                        <TableCell key={j}>{val}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={Object.keys(filters).length}>
                      No resource found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Box sx={{ p: 1, width: 200 }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder={`Filter ${activeColumn}`}
              value={filters[activeColumn] || ""}
              onChange={handleFilterChange}
              InputProps={{ disableUnderline: true }}
            />
          </Box>
        </Popover>
      </Box>
    </Box>
  );
};

export default AWSDashboard;

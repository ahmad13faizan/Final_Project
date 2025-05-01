// src/store/costExplorerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchColumns = createAsyncThunk(
  "costExplorer/fetchColumns",
  async () => {
    const resp = await api.get("/api/costExplorer/columns");
    return resp.data.columnNames;
  }
  
);

const costExplorerSlice = createSlice({
  name: "costExplorer",
  initialState: {
    columns: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.columns = action.payload;
        state.loading = false;
      })
      .addCase(fetchColumns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default costExplorerSlice.reducer;

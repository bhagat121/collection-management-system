import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCustomers = createAsyncThunk("customers/fetch", async () => {
  const response = await axios.get("http://localhost:5000/api/customers");
  return response.data;
});

const customerSlice = createSlice({
  name: "customers",
  initialState: { customers: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;

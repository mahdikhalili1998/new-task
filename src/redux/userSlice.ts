import { IUsersState } from "@/types/redux";
import axiosClient from "@/utils/axiosClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: IUsersState = {
  users: [],
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

// گرفتن لیست کاربران از API
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page: number) => {
    const response = await axiosClient.get(`/users?page=${page}`);
    return response.data;
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers(state) {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.data;
        state.page = action.payload.page;
        state.totalPages = action.payload.total_pages;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "خطا در دریافت کاربران";
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;

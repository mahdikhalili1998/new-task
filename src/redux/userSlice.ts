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

// getting user info
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page: number) => {
    const response = await axiosClient.get(`/users?page=${page}`);
    return response.data;
  },
);

// editing user info
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }: { id: number; data}) => {
    const response = await axiosClient.put(`/users/${id}`, data);
    return response.data;
  },
);

// deleting user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number) => {
    await axiosClient.delete(`/users/${id}`);
    return id;
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
      })
      //  editing user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.users.findIndex((u) => u.id === updated.id);
        if (index !== -1) {
          state.users[index] = updated;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "خطا در ویرایش کاربر";
      })
      // deleting user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.users = state.users.filter((user) => user.id !== id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "خطا در حذف کاربر";
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;

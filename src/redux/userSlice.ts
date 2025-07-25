import { IUser, IUsersState } from "@/types/redux";
import axiosClient from "@/utils/axiosClient";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const initialState: IUsersState = {
  users: [],
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

// Helper: ذخیره همزمان ریداکس و localStorage
const saveUsersToLocalStorage = (data: {
  data: IUser[];
  page: number;
  total_pages: number;
}) => {
  try {
    localStorage.setItem("users", JSON.stringify(data));
  } catch (error) {
    console.error("خطا در ذخیره‌سازی در localStorage", error);
  }
};

// Get users
export const fetchUsers = createAsyncThunk<
  { data: IUser[]; page: number; total_pages: number },
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const cached = localStorage.getItem("users");
    if (cached) {
      return JSON.parse(cached);
    }
    const response = await axiosClient.get("/users?page=1");
    saveUsersToLocalStorage(response.data);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "خطا در دریافت کاربران";
    return rejectWithValue(errorMessage);
  }
});

// Update user
export const updateUser = createAsyncThunk<
  IUser,
  { id: number; data: Partial<IUser> },
  { rejectValue: string }
>("users/updateUser", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put(`/users/${id}`, data);
    return { id, ...response.data }; // فرض: API داده جدید را برمی‌گرداند
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "خطا در به‌روزرسانی کاربر";
    return rejectWithValue(errorMessage);
  }
});

// Create user
export const createUser = createAsyncThunk<
  IUser,
  { name: string; email: string },
  { rejectValue: string }
>("users/createUser", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post("/users", data);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "خطا در ایجاد کاربر";
    return rejectWithValue(errorMessage);
  }
});

// Delete user
export const deleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/users/${id}`);
    return id;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "خطا در حذف کاربر";
    return rejectWithValue(errorMessage);
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers(state) {
      state.users = [];
      saveUsersToLocalStorage({
        data: [],
        page: 1,
        total_pages: 1,
      });
    },
    // بارگذاری مستقیم از localStorage (اگر بخواهی دستی)
    setUsersFromLocal(
      state,
      action: PayloadAction<{
        data: IUser[];
        page: number;
        total_pages: number;
      }>,
    ) {
      state.users = action.payload.data;
      state.page = action.payload.page;
      state.totalPages = action.payload.total_pages;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch users
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
        state.error = action.payload ?? "خطا در دریافت کاربران";
      })

      // update user
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
          saveUsersToLocalStorage({
            data: state.users,
            page: state.page,
            total_pages: state.totalPages,
          });
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "خطا در به‌روزرسانی کاربر";
      })

      // create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // اطمینان از عدم تکراری بودن (درصورت نیاز)
        if (!state.users.find((u) => u.id === action.payload.id)) {
          state.users.unshift(action.payload);
          saveUsersToLocalStorage({
            data: state.users,
            page: state.page,
            total_pages: state.totalPages,
          });
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "خطا در ایجاد کاربر";
      })

      // delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.users = state.users.filter((user) => user.id !== id);
        saveUsersToLocalStorage({
          data: state.users,
          page: state.page,
          total_pages: state.totalPages,
        });
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "خطا در حذف کاربر";
      });
  },
});

export const { clearUsers, setUsersFromLocal } = userSlice.actions;
export default userSlice.reducer;

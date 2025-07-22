import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axiosClient";
import { IAuthState } from "@/types/redux";

const initialState: IAuthState = {
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosClient.post("/login", { email, password });
      return response.data.token;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "خطا در ورود");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axiosClient";
import { IAuthState } from "@/types/redux";

// initial state for auth
const initialState: IAuthState = {
  token: null, // user token after login
  loading: false, // loading status for login request
  error: null, // error message if login fails
};

// async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser", // action name
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      // send login request to API
      const response = await axiosClient.post("/login", { email, password });
      return response.data.token; // return token if success
    } catch (err) {
      // return error message if fail
      return rejectWithValue(err.response?.data?.error || "Login failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth", // slice name
  initialState,
  reducers: {
    // logout action to clear token
    logout: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // when login starts
      .addCase(loginUser.pending, (state) => {
        state.loading = true; // set loading true
        state.error = null; // clear errors
      })
      // when login succeeds
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; // stop loading
        state.token = action.payload; // save token
      })
      // when login fails
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; // stop loading
        state.error = action.payload as string; // save error message
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

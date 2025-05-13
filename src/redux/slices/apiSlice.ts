import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/utils/api";

interface UserState {
  userInfo: {
    first_name: string;
    last_name: string;
    address: string;
    email: string;
    contact_number: string;
  } | null;
  loading: boolean;
  error: string | null;
  passwordChangeSuccess: boolean; // Flag for password change success
}

// Initial state
const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
  passwordChangeSuccess: false,
};

// Async thunk for fetching user info
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/u/customer/index");
      return response.data.customer;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user info"
      );
    }
  }
);

// Async thunk for updating user info
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (updatedInfo: Partial<UserState["userInfo"]>, { rejectWithValue }) => {
    try {
      const response = await api.patch("/u/customer/details", updatedInfo);
      return response.data.customer;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user info"
      );
    }
  }
);

// Async thunk for changing password
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (
    { password, new_password, conf_password }: { password: string; new_password: string; conf_password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch("/u/customer/password", {
        password,
        new_password,
        conf_password,
      });
      return response.data.message; // Assuming the backend returns a success message
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);

// Slice
const apiSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPasswordChangeSuccess: (state) => {
      state.passwordChangeSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch user info
    builder.addCase(fetchUserInfo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(fetchUserInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update user info
    builder.addCase(updateUserInfo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(updateUserInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Change password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.passwordChangeSuccess = false;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
      state.passwordChangeSuccess = true;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// Export actions and reducer
export const { clearError, resetPasswordChangeSuccess } = apiSlice.actions;
export default apiSlice.reducer;
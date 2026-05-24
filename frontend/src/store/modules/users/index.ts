import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { changePassword, requestPasswordOtp, verifyChangePassword } from "@/api/users";
import type { ChangePasswordPayload } from "@/api/users";

export interface UsersState {
    isChangingPassword: boolean;
    errorChangePassword: string | null;
    changePasswordSuccess: boolean;
    // OTP flow
    isRequestingOtp: boolean;
    otpRequested: boolean;
    maskedEmail: string | null;
    errorRequestOtp: string | null;
    isVerifyingOtp: boolean;
    errorVerifyOtp: string | null;
}

export const fetchChangePassword = createAsyncThunk<
    { message: string },
    ChangePasswordPayload,
    { rejectValue: string }
>(
    "users/changePassword",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await changePassword(payload);
            return response;
        } catch (error: unknown) {
            const message =
                (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
                (error as { message?: string }).message ||
                "Đổi mật khẩu thất bại";
            return rejectWithValue(message);
        }
    }
);

export const fetchRequestPasswordOtp = createAsyncThunk<
    { message: string; maskedEmail: string },
    ChangePasswordPayload,
    { rejectValue: string }
>(
    "users/requestPasswordOtp",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await requestPasswordOtp(payload);
            return response;
        } catch (error: unknown) {
            const message =
                (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
                (error as { message?: string }).message ||
                "Không thể gửi OTP";
            return rejectWithValue(message);
        }
    }
);

export const fetchVerifyChangePassword = createAsyncThunk<
    { message: string },
    string,
    { rejectValue: string }
>(
    "users/verifyChangePassword",
    async (otp, { rejectWithValue }) => {
        try {
            const response = await verifyChangePassword(otp);
            return response;
        } catch (error: unknown) {
            const message =
                (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
                (error as { message?: string }).message ||
                "Xác thực OTP thất bại";
            return rejectWithValue(message);
        }
    }
);

const initialState: UsersState = {
    isChangingPassword: false,
    errorChangePassword: null,
    changePasswordSuccess: false,
    isRequestingOtp: false,
    otpRequested: false,
    maskedEmail: null,
    errorRequestOtp: null,
    isVerifyingOtp: false,
    errorVerifyOtp: null,
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearChangePasswordState(state) {
            state.isChangingPassword = false;
            state.errorChangePassword = null;
            state.changePasswordSuccess = false;
            state.isRequestingOtp = false;
            state.otpRequested = false;
            state.maskedEmail = null;
            state.errorRequestOtp = null;
            state.isVerifyingOtp = false;
            state.errorVerifyOtp = null;
        },
    },
    extraReducers: (builder) => {
        // Legacy change password
        builder.addCase(fetchChangePassword.pending, (state) => {
            state.isChangingPassword = true;
            state.errorChangePassword = null;
            state.changePasswordSuccess = false;
        });
        builder.addCase(fetchChangePassword.fulfilled, (state) => {
            state.isChangingPassword = false;
            state.changePasswordSuccess = true;
        });
        builder.addCase(fetchChangePassword.rejected, (state, action) => {
            state.isChangingPassword = false;
            state.errorChangePassword = typeof action.payload === "string" ? action.payload : "Đổi mật khẩu thất bại";
        });

        // Step 1 – Request OTP
        builder.addCase(fetchRequestPasswordOtp.pending, (state) => {
            state.isRequestingOtp = true;
            state.errorRequestOtp = null;
            state.otpRequested = false;
        });
        builder.addCase(fetchRequestPasswordOtp.fulfilled, (state, action) => {
            state.isRequestingOtp = false;
            state.otpRequested = true;
            state.maskedEmail = action.payload.maskedEmail;
        });
        builder.addCase(fetchRequestPasswordOtp.rejected, (state, action) => {
            state.isRequestingOtp = false;
            state.errorRequestOtp = typeof action.payload === "string" ? action.payload : "Không thể gửi OTP";
        });

        // Step 2 – Verify OTP & change password
        builder.addCase(fetchVerifyChangePassword.pending, (state) => {
            state.isVerifyingOtp = true;
            state.errorVerifyOtp = null;
        });
        builder.addCase(fetchVerifyChangePassword.fulfilled, (state) => {
            state.isVerifyingOtp = false;
            state.changePasswordSuccess = true;
            state.otpRequested = false;
        });
        builder.addCase(fetchVerifyChangePassword.rejected, (state, action) => {
            state.isVerifyingOtp = false;
            state.errorVerifyOtp = typeof action.payload === "string" ? action.payload : "Xác thực OTP thất bại";
        });
    },
});

export const { clearChangePasswordState } = usersSlice.actions;
export default usersSlice.reducer;

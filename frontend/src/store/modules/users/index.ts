import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { changePassword } from "@/api/users";
import type { ChangePasswordPayload } from "@/api/users";

export interface UsersState {
    isChangingPassword: boolean;
    errorChangePassword: string | null;
    changePasswordSuccess: boolean;
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

const initialState: UsersState = {
    isChangingPassword: false,
    errorChangePassword: null,
    changePasswordSuccess: false,
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearChangePasswordState(state) {
            state.isChangingPassword = false;
            state.errorChangePassword = null;
            state.changePasswordSuccess = false;
        },
    },
    extraReducers: (builder) => {
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
    },
});

export const { clearChangePasswordState } = usersSlice.actions;
export default usersSlice.reducer;

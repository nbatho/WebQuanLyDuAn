import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signIn, signUp,signOut, refreshToken } from "../../../api/auth";
import type { SignInRequest, SignInResponse, SignUpRequest,SignUpResponse, AuthState } from "../../../types/auth";
import { getAccessToken } from "@/utils/localStorage";
export const fetchSignIn = createAsyncThunk<SignInResponse, SignInRequest, { rejectValue: string }>(
    "auth/fetchSignIn",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await signIn(email, password);
            return response;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Failed to sign in";
            return rejectWithValue(message);
        }
    }
);
export const fetchSignUp = createAsyncThunk<SignUpResponse, SignUpRequest, { rejectValue: string }>(
    "auth/fetchSignUp",
    async ({ email, password, username, name }, { rejectWithValue }) => {
        try {
            const response = await signUp(email, password, username, name);
            return response;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Failed to sign up";
            return rejectWithValue(message);
        }
    }
);
export const fetchSignOut = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/fetchSignOut",
    async (_, { rejectWithValue }) => { 
        try {
            await signOut();
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Failed to sign out";
            return rejectWithValue(message);
        }
    }
);
export const fetchRefreshToken = createAsyncThunk<SignInResponse, void, { rejectValue: string }>(
    "auth/fetchRefreshToken",
    async (_, { rejectWithValue }) => {
        try {
            const response = await refreshToken();
            return response;
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Failed to refresh token";
            return rejectWithValue(message);
        }
    }
);

const initialState : AuthState = {
    signIn : null,
    signUp : null,
    access_token : getAccessToken(),
    isLoadingSignIn: false,
    isLoadingSignUp: false,
    isLoadingSignOut: false,
    errorSignIn: null,
    errorSignUp: null,
    errorSignOut: null,
};
const authSlice = createSlice({ 
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSignIn.pending, (state) => {
            state.isLoadingSignIn = true;
            state.errorSignIn = null;
        });
        builder.addCase(fetchSignIn.fulfilled, (state, action) => {
            state.isLoadingSignIn = false;
            state.signIn = action.payload;
            const access_token = action.payload?.user?.access_token;

            if (!access_token) {
                state.errorSignIn = "Invalid sign in response: missing access token";
                state.access_token = null;
                return;
            }

            state.access_token = access_token;
            localStorage.setItem('access_token', access_token);
        });
        builder.addCase(fetchSignIn.rejected, (state, action) => {
            state.isLoadingSignIn = false;
            state.errorSignIn = typeof action.payload === "string" ? action.payload : "Failed to sign in";
        });
        builder.addCase(fetchSignUp.pending, (state) => {
            state.isLoadingSignUp = true;
            state.errorSignUp = null;
        });
        builder.addCase(fetchSignUp.fulfilled, (state, action) => {
            state.isLoadingSignUp = false;
            state.signUp = action.payload;
        });
        builder.addCase(fetchSignUp.rejected, (state, action) => {
            state.isLoadingSignUp = false;
            state.errorSignUp = typeof action.payload === "string" ? action.payload : "Failed to sign up";
        });
        builder.addCase(fetchSignOut.pending, (state) => {
            state.isLoadingSignOut = true;
            state.errorSignOut = null;
        });
        builder.addCase(fetchSignOut.fulfilled, (state) => {
            state.isLoadingSignOut = false;
            state.signIn = null;
            state.signUp = null;
            state.access_token = null;
            localStorage.removeItem('access_token');
        });
        builder.addCase(fetchSignOut.rejected, (state, action) => {
            state.isLoadingSignOut = false;
            state.errorSignOut = typeof action.payload === "string" ? action.payload : "Failed to sign out";
        });
        builder.addCase(fetchRefreshToken.pending, (state) => {
            state.isLoadingSignIn = true;
            state.errorSignIn = null;
        });
        builder.addCase(fetchRefreshToken.fulfilled, (state, action) => {
            state.isLoadingSignIn = false;
            const access_token = action.payload?.user?.access_token;

            if (!access_token) {
                state.errorSignIn = "Invalid refresh token response: missing access token";
                state.access_token = null;
                return;
            }

            state.access_token = access_token;
            localStorage.setItem('access_token', access_token);
        });
        builder.addCase(fetchRefreshToken.rejected, (state, action) => {
            state.isLoadingSignIn = false;
            state.errorSignIn = typeof action.payload === "string" ? action.payload : "Failed to refresh token";
        });
    }
});
export const {


} = authSlice.actions;
export default authSlice.reducer;
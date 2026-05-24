import { beApi } from "../callApi";

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}

export interface RequestOtpResponse {
    message: string;
    maskedEmail: string;
}

export const changePassword = async (
    payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
    return beApi.put("/users/change-password", payload);
};

export const requestPasswordOtp = async (
    payload: ChangePasswordPayload
): Promise<RequestOtpResponse> => {
    return beApi.post("/users/request-password-otp", payload);
};

export const verifyChangePassword = async (otp: string): Promise<ChangePasswordResponse> => {
    return beApi.post("/users/verify-change-password", { otp });
};

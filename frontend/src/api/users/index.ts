import { beApi } from "../callApi";

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}

export const changePassword = async (
    payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
    return beApi.put("/users/change-password", payload);
};

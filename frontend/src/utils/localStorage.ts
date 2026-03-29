const ACCESS_TOKEN_KEY = 'accessToken';

export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
};

export const removeAccessToken = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};
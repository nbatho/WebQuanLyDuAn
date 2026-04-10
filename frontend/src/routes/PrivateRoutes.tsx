import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { JSX } from "react/jsx-runtime";
import type { AppDispatch, RootState } from "@/store/configureStore";
import { Navigate } from "react-router";
import { fetchRefreshToken, fetchSignOut } from "@/store/modules/auth";
import { isTokenExpired } from "@/api/auth";
import { getAccessToken } from "@/utils/localStorage";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const access_token = useSelector((state: RootState) => state.auth.access_token);
    const isRefreshing = useSelector((state: RootState) => state.auth.isLoadingSignIn);
    const dispatch = useDispatch<AppDispatch>();
    const [hasCheckedRefresh, setHasCheckedRefresh] = useState(false);
    const effectiveToken = access_token ?? getAccessToken();

    useEffect(() => {
        let isUnmounted = false;

        const ensureValidAuth = async () => {
            if (!effectiveToken) {
                if (!isUnmounted) setHasCheckedRefresh(true);
                return;
            }

            const expired = isTokenExpired();

            if (!expired) {
                if (!isUnmounted) setHasCheckedRefresh(true);
                return;
            }

            try {
                await dispatch(fetchRefreshToken()).unwrap();
            } catch {
                await dispatch(fetchSignOut());
            } finally {
                if (!isUnmounted) setHasCheckedRefresh(true);
            }
        };

        void ensureValidAuth();

        return () => {
            isUnmounted = true;
        };
    }, [dispatch, effectiveToken]);

    if (!hasCheckedRefresh || isRefreshing) {
        return null;
    }

    if (!effectiveToken || isTokenExpired()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

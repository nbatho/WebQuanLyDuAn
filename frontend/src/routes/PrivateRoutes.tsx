import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { JSX } from "react/jsx-runtime";
import type { AppDispatch, RootState } from "@/store/configureStore";
import { Navigate } from "react-router";
import { fetchRefreshToken, fetchSignOut } from "@/store/modules/auth";
import { isTokenExpired } from "@/api/auth";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const access_token = useSelector((state: RootState) => state.auth.access_token);
    const isRefreshing = useSelector((state: RootState) => state.auth.isLoadingSignIn);
    const dispatch = useDispatch<AppDispatch>();
    const [hasCheckedRefresh, setHasCheckedRefresh] = useState(false);

    useEffect(() => {
        let isUnmounted = false;

        const ensureValidAuth = async () => {
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
    }, [access_token, dispatch]);

    if (!hasCheckedRefresh || isRefreshing) {
        return null;
    }

    if (!access_token || isTokenExpired()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

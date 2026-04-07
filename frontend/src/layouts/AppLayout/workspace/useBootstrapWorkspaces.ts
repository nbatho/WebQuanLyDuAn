import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/configureStore';
import { fetchWorkspaces } from '../../../store/modules/workspaces';

export function useBootstrapWorkspaces() {
    const dispatch = useDispatch<AppDispatch>();
    const accessToken = useSelector((s: RootState) => s.auth.accessToken);

    useEffect(() => {
        if (accessToken) {
            void dispatch(fetchWorkspaces());
        }
    }, [accessToken, dispatch]);
}

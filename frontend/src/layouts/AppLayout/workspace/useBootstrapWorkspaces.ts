import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/configureStore';
import { fetchWorkspaces } from '../../../store/modules/workspaces';

export function useBootstrapWorkspaces() {
    const dispatch = useDispatch<AppDispatch>();
    const access_token = useSelector((s: RootState) => s.auth.access_token);

    useEffect(() => {
        if (access_token) {
            void dispatch(fetchWorkspaces());
        }
    }, [access_token, dispatch]);
}

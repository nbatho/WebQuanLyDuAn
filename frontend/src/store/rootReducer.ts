import appReducer from './modules/app/index.ts';
import workspacesReducer from './modules/workspaces/index.ts';
import authReducer from './modules/auth/index.ts';
const rootReducer = {
    app: appReducer,
    auth : authReducer,
    workspaces: workspacesReducer,
};

export default rootReducer;

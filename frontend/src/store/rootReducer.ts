import appReducer from './modules/app/index.ts';
import workspacesReducer from './modules/workspaces/index.ts';
const rootReducer = {
    app: appReducer,
    workspaces: workspacesReducer,
};

export default rootReducer;

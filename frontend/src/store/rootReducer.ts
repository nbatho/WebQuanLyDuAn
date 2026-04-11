import appReducer from './modules/app/index.ts';
import workspacesReducer from './modules/workspaces/index.ts';
import authReducer from './modules/auth/index.ts';
import spacesReducer from './modules/spaces/index.ts';
import tasksReducer from './modules/tasks/index.ts';
import treeReducer from './modules/tree/index.ts';

const rootReducer = {
    app: appReducer,
    auth: authReducer,
    workspaces: workspacesReducer,
    spaces: spacesReducer,
    tasks: tasksReducer,
    tree: treeReducer,
};

export default rootReducer;

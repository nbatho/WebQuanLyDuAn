import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';

const AppRouter = () => {
    return useRoutes(routes);
};

const App = () => {
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
};

export default App;
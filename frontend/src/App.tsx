import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { Suspense } from 'react';
import { App as AntdApp } from 'antd';
const router = createBrowserRouter(routes);
const App = () => {
    return (
        <AntdApp>
            <Suspense fallback={null}>
                <RouterProvider router={router} />
            </Suspense>
        </AntdApp>
    );
};

export default App;
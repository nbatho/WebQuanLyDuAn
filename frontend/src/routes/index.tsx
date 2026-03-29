import { type RouteObject } from "react-router-dom";
import { lazy } from 'react';
const Home = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/AuthPage/LoginPage'));
const RegisterPage = lazy(() => import('../pages/AuthPage/RegisterPage'));
export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home />
    },
    {
        path : '/login',
        element: <LoginPage />
    },
    {
        path : '/register',
        element: <RegisterPage />
    }
    // Ví dụ thêm một route khác
    // {
    //     path: '/about',
    //     element: <About />
    // }
];
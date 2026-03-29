import Home from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import GoogleLoginPage from "../pages/GoogleLoginPage";
import WorkspaceSetupPage from "../pages/WorkspaceSetupPage";
import WorkspaceBrandingPage from "../pages/WorkspaceBrandingPage";
import InviteTeamPage from "../pages/InviteTeamPage";
import DashboardPage from "../pages/DashboardPage";
import InboxPage from "../pages/InboxPage";
import MyTasksPage from "../pages/MyTasksPage";
import AppLayout from "../layouts/AppLayout";
import type { RouteConfig } from "../types/app";
export const routes: RouteConfig[] = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <LoginPage />
    },
    {
        path: '/google-login',
        element: <GoogleLoginPage />
    },
    {
        path: '/workspace-setup',
        element: <WorkspaceSetupPage />
    },
    {
        path: '/workspace-branding',
        element: <WorkspaceBrandingPage />
    },
    {
        path: '/invite-team',
        element: <InviteTeamPage />
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: '/home',
                element: <DashboardPage />
            },
            {
                path: '/inbox',
                element: <InboxPage />
            },
            {
                path: '/my-tasks',
                element: <MyTasksPage />
            }
        ]
    }
];


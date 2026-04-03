import Home from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import GoogleLoginPage from "../pages/auth/GoogleLoginPage";
import WorkspaceSetupPage from "../pages/workspace/WorkspaceSetupPage";
import WorkspaceBrandingPage from "../pages/workspace/WorkspaceBrandingPage";
import InviteTeamPage from "../pages/workspace/InviteTeamPage";
import DashboardPage from "../pages/app/DashboardPage";
import InboxPage from "../pages/app/InboxPage";
import MyTasksPage from "../pages/app/MyTasksPage";
import SpaceViewPage from '../pages/app/SpaceViewPage';
import TimeTrackingPage from '../pages/app/TimeTrackingPage';
import DashboardsPage from '../pages/app/DashboardsPage';
import SettingsPage from '../pages/app/SettingsPage';
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
            },
            {
                path: 'space/:spaceId',
                element: <SpaceViewPage />
            },
            {
                path: '/time-tracking',
                element: <TimeTrackingPage />
            },
            {
                path: '/dashboards',
                element: <DashboardsPage />
            },
            {
                path: '/settings',
                element: <SettingsPage />
            }
        ]
    }
];

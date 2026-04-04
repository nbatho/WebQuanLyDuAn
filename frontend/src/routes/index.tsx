import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/AuthPage/LoginPage";
import GoogleLoginPage from "../pages/AuthPage/GoogleLoginPage";
import WorkspaceSetupPage from "../pages/WorkspaceSetupPage";
import WorkspaceBrandingPage from "../pages/WorkspaceBrandingPage";
import InviteTeamPage from "../pages/InviteTeamPage";
import HomePage from "../pages/HomePage";
import InboxPage from "../pages/InboxPage";
import MyTasksPage from "../pages/MyTasksPage";
import SpaceViewPage from '../pages/SpaceViewPage';
import TimeTrackingPage from '../pages/TimeTrackingPage';
import DashboardsPage from '../pages/DashboardsPage';
import SettingsPage from '../pages/SettingsPage';
import AppLayout from "../layouts/AppLayout";
import type { RouteConfig } from "../types/app";
export const routes: RouteConfig[] = [
    {
        path: '/',
        element: <LandingPage />
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
                element: <HomePage />
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

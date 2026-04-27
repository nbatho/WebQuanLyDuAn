import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/AuthPage/LoginPage";
import GoogleLoginPage from "../pages/AuthPage/GoogleLoginPage";
import WorkspaceSetupPage from "../pages/WorkspaceSetupPage";
import InviteTeamPage from "../pages/InviteTeamPage";
import InboxPage from "../pages/InboxPage";
import MyTasksPage from "../pages/MyTasksPage";
import SpaceViewPage from '../pages/SpaceViewPage';
import ListViewPage from '../pages/ListViewPage';
import TimeTrackingPage from '../pages/TimeTrackingPage';
import SettingsPage from '../pages/SettingsPage';
import AIPage from '../pages/AIPage';
import AppLayout from "../layouts/AppLayout";
import type { RouteConfig } from "../types/app";
import PrivateRoute from "./PrivateRoutes";
import InvitationPage from "@/pages/InvitationPage";
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
        path: '/invite-team',
        element: <InviteTeamPage />
    },
    {
        element: <PrivateRoute><AppLayout /></PrivateRoute>,
        children: [
            {
                path: '/home',
                element: <MyTasksPage />
            },
            {
                path: '/inbox',
                element: <InboxPage />
            },
            {
                path: '/ai',
                element: <AIPage />
            },
            {
                path: 'space/:spaceId',
                element: <SpaceViewPage />
            },
            {
                path: 'space/:spaceId/list/:listId',
                element: <ListViewPage />
            },
            {
                path: '/time-tracking',
                element: <TimeTrackingPage />
            },
            {
                path: '/settings',
                element: <SettingsPage />
            }
        ]
    },
    {
        path: '/join-workspace',
        element: <InvitationPage />
    }
];

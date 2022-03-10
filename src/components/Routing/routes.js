import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from '../Dashboard';
import Login from '../Login';

const privateRoutes = [
    {
        path: 'dashboard',
        component: Dashboard,
        exact: true
    },
];
const publicRoutes = [
    {
        path: 'login',
        component: Login,
        exact: true
    },
];

export {publicRoutes, privateRoutes};
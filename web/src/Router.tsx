import { BrowserRouter, Routes as SwitchRouter, Route } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import React, { Suspense } from 'react'

import { AuthenticatedLayout } from '@/components/templates/AuthenticatedLayout'
import { GuestLayout } from '@/components/templates/GuestLayout'
import { Routes } from '@types'

const DashboardPage = React.lazy(() => import('@/pages/Dashboard'));
const NotificationsPage = React.lazy(() => import('@/pages/Notifications'));
const RegisterPage = React.lazy(() => import('@/pages/Register'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));
const ArchivePage = React.lazy(() => import('@/pages/Archive'));
const ProfilePage = React.lazy(() => import('@/pages/Profile'));
const TasksPage = React.lazy(() => import('@/pages/Tasks'));
const LoginPage = React.lazy(() => import('@/pages/Login'));

export const Router: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<LinearProgress />}>
      <SwitchRouter>
        <Route element={<AuthenticatedLayout />}>
          <Route path={Routes.DASHBOARD} element={<DashboardPage />} />
          <Route path={Routes.TASKS} element={<TasksPage />} />
          <Route path={Routes.ARCHIVE} element={<ArchivePage />} />
          <Route path={Routes.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path={Routes.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route element={<GuestLayout />}>
          <Route path={Routes.LOGIN} element={<LoginPage />} />
          <Route path={Routes.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </SwitchRouter>
    </Suspense>
  </BrowserRouter>
)

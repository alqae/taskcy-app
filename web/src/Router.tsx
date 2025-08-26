import { BrowserRouter, Routes as SwitchRouter, Route } from 'react-router-dom'

import { NotificationsPage } from '@/pages/Notifications'
import { DashboardPage } from '@/pages/Dashboard'
import { RegisterPage } from '@/pages/Register'
import { NotFoundPage } from '@/pages/NotFound'
import { ArchivePage } from '@/pages/Archive'
import { ProfilePage } from '@/pages/Profile'
import { TasksPage } from '@/pages/Tasks'
import { LoginPage } from '@/pages/Login'

import { AuthenticatedLayout } from '@/components/templates/AuthenticatedLayout'
import { GuestLayout } from '@/components/templates/GuestLayout'
import { Routes } from '@types'

export const Router: React.FC = () => (
  <BrowserRouter>
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
  </BrowserRouter>
)

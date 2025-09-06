import { Navigate, Outlet } from 'react-router-dom'
import React from 'react'

import { Sidebar } from '@/components/organisms/Sidebar'
import { isLoggedIn } from '@store/reducers/authSlice'
import { useAppSelector } from '@store/store'
import { Routes } from '@types'

export const AuthenticatedLayout: React.FC = () => {
  const isAuthenticated = useAppSelector(isLoggedIn)

  if (!isAuthenticated) {
    return <Navigate to={Routes.LOGIN} />
  }

  return (
    <main>
      <Sidebar>
        <Outlet />
      </Sidebar>
    </main>
  )
}

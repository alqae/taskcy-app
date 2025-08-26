import { Navigate, Outlet } from 'react-router-dom'
import React from 'react'

import { Sidebar } from '@/components/organisms/Sidebar'
import { useAuth } from '@/context/AuthContext'

export const AuthenticatedLayout: React.FC = () => {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <main>
      <Sidebar>
        <Outlet />
      </Sidebar>
    </main>
  )
}

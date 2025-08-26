import { Helmet } from 'react-helmet-async'
import { Button } from '@mui/material'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'
import { useAuth } from '@/context/AuthContext'

export const DashboardPage: React.FC = () => {
  const { logout } = useAuth()

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Home | Taskcy</title>
        <meta name="description" content="This is the home page of Taskcy." />
      </Helmet>

      <h1>Welcome!</h1>
      <Button variant="contained" color="error" onClick={logout}>Logout</Button>
    </ErrorBoundary>
  )
}

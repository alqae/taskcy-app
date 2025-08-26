import { Helmet } from 'react-helmet-async'
import { Button } from '@mui/material'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'
import { useAuth } from '@/context/AuthContext'

const ProfilePage: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Profile | Taskcy</title>
        <meta name="description" content="This is the profile page of Taskcy." />
      </Helmet>

      <div>{isLoggedIn ? `${user?.firstName} ${user?.lastName}` : 'You are not logged in'}</div>

      <Button variant="contained" color="error" onClick={logout}>Logout</Button>
    </ErrorBoundary>
  )
}

export default ProfilePage

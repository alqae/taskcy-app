import { Helmet } from 'react-helmet-async'
import { Button } from '@mui/material'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'

export const DashboardPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Home | Taskcy</title>
        <meta name="description" content="This is the home page of Taskcy." />
      </Helmet>

      <h1>Welcome!</h1>
      <Button variant="contained" color="error" onClick={() => alert('Implement me!')}>Logout</Button>
    </ErrorBoundary>
  )
}

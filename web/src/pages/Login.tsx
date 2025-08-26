import { Helmet } from 'react-helmet-async'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'

export const LoginPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Login | Taskcy</title>
        <meta name="description" content="This is the login page of Taskcy." />
      </Helmet>

      <div>Login</div>
    </ErrorBoundary>
  )
}

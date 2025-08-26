import { Helmet } from 'react-helmet-async'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'

export const RegisterPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Register | Taskcy</title>
        <meta name="description" content="This is the register page of Taskcy." />
      </Helmet>

      <div>Register</div>
    </ErrorBoundary>
  )
}

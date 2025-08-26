import { Helmet } from 'react-helmet-async'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'

export const ProfilePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Profile | Taskcy</title>
        <meta name="description" content="This is the profile page of Taskcy." />
      </Helmet>

      <div>Profile</div>
    </ErrorBoundary>
  )
}

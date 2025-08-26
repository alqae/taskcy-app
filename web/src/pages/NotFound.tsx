import { Helmet } from 'react-helmet-async'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'

export const NotFoundPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>404 Not Found | Taskcy</title>
        <meta name="description" content="This is the 404 not found page of Taskcy." />
      </Helmet>

      <div>NotFound</div>
    </ErrorBoundary>
  )
}

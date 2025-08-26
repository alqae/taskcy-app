import { Helmet } from 'react-helmet-async'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'

export const TasksPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Tasks | Taskcy</title>
        <meta name="description" content="This is the tasks page of Taskcy." />
      </Helmet>

      <div>Tasks</div>
    </ErrorBoundary>
  )
}

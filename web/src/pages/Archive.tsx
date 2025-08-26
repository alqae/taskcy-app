import { Helmet } from 'react-helmet-async'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'

export const ArchivePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Archive | Taskcy</title>
        <meta name="description" content="This is the archive page of Taskcy." />
      </Helmet>

      <div>Archive</div>
    </ErrorBoundary>
  )
}

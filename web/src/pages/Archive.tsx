import { Helmet } from 'react-helmet-async'
import React from 'react'

import { TaskTable } from '@/components/organisms/TaskTable'
import ErrorBoundary from '@/wrappers/ErrorBoundary'
import { TaskState } from '@types'

const ArchivePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Archive | Taskcy</title>
        <meta name="description" content="This is the archive page of Taskcy." />
      </Helmet>

      <TaskTable allowedStates={[TaskState.ARCHIVED]} title="Archive" />
    </ErrorBoundary>
  )
}

export default ArchivePage

import { enqueueSnackbar } from 'notistack'
import { Helmet } from 'react-helmet-async'
import React from 'react'

import { TaskTable } from '@/components/organisms/TaskTable'
import ErrorBoundary from '@/wrappers/ErrorBoundary'
import { useApi } from '@/hooks/useApi'
import { TaskState } from '@types'

const ArchivePage: React.FC = () => {
  const archiveRequest = useApi('/tasks', {
    method: 'DELETE',
    skip: true,
  })

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Archive | Taskcy</title>
        <meta name="description" content="This is the archive page of Taskcy." />
      </Helmet>

      <TaskTable
        allowedStates={[TaskState.ARCHIVED]}
        title="Archive"
        onActionClick={async (selectedIds, refetch) => {
          try {
            await archiveRequest.refetch({ body: { taskIds: selectedIds } })
            enqueueSnackbar('Tasks archived successfully', { variant: 'success' })
          } finally {
            refetch()
          }
          refetch()
        }}
      />
    </ErrorBoundary>
  )
}

export default ArchivePage

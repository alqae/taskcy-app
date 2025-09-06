import { Helmet } from 'react-helmet-async'
import { enqueueSnackbar } from 'notistack'
import React from 'react'

import { TaskTable } from '@/components/organisms/TaskTable'
import ErrorBoundary from '@/wrappers/ErrorBoundary'
import { useApi } from '@/hooks/useApi'

const TasksPage: React.FC = () => {
  const archiveRequest = useApi('/tasks/archive', {
    method: 'PATCH',
    skip: true,
  })

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Tasks | Taskcy</title>
        <meta name="description" content="This is the tasks page of Taskcy." />
      </Helmet>

      <TaskTable
        showAddModal
        onActionClick={async (selectedIds, refetch) => {
          try {
            await archiveRequest.refetch({ body: { taskIds: selectedIds } })
            enqueueSnackbar('Tasks archived successfully', { variant: 'success' })
          } finally {
            refetch()
          }
        }}
      />
    </ErrorBoundary>
  )
}

export default TasksPage

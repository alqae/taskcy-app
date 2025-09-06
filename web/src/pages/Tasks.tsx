import { Helmet } from 'react-helmet-async'
import { enqueueSnackbar } from 'notistack'
import React from 'react'

import { useArchiveManyTasksMutation } from '@store/apis/taskApi'
import { TaskTable } from '@/components/organisms/TaskTable'
import ErrorBoundary from '@/wrappers/ErrorBoundary'

const TasksPage: React.FC = () => {
  const [archiveTasks] = useArchiveManyTasksMutation()

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
            await archiveTasks(selectedIds)
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

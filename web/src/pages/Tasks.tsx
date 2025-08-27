import { Helmet } from 'react-helmet-async'
import React from 'react'

import { TaskTable } from '@/components/organisms/TaskTable'
import ErrorBoundary from '@/wrappers/ErrorBoundary'

const TasksPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Tasks | Taskcy</title>
        <meta name="description" content="This is the tasks page of Taskcy." />
      </Helmet>

      <TaskTable />
    </ErrorBoundary>
  )
}

export default TasksPage

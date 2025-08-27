import React from 'react'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'

import type { CreateTaskRequest, Task, TaskPriority, TaskState } from '@types'
import { TaskForm } from '@/components/molecules/TaskForm'
import { Puller } from '@/components/atoms/Puller'
import { useApi } from '@/hooks/useApi'

interface TaskModalProps {
  renderLauncher: (toggle: () => void) => React.ReactNode
  onSubmit: () => void
}

export const TaskModal: React.FC<TaskModalProps> = ({ renderLauncher, onSubmit }) => {
  const createRequest = useApi<Task, CreateTaskRequest>('/tasks', {
    method: 'POST',
    skip: true,
  })

  const [open, setOpen] = React.useState(false)

  return (
    <>
      {renderLauncher(() => setOpen(true))}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={createRequest.isLoading ? undefined : () => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              padding: 2,
              maxHeight: '80vh',
              margin: '0 auto',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              width: { xs: '100%', sm: '75%', md: '50%' },
            }
          }
        }}
      >
        <Puller />

        <Typography variant="h6" sx={{ mb: 2 }}>New Task</Typography>
        <TaskForm
          isLoading={createRequest.isLoading}
          onCancel={() => setOpen(false)}
          onSubmit={async (data) => {
            await createRequest.refetch({
              body: {
                ...data,
                state: data.state as TaskState,
                priority: data.priority as TaskPriority,
                expiryDate: data.expiryDate.toISOString(),
              }
            })
            setOpen(false)
            onSubmit()
          }}
        />
      </Drawer>
    </>
  )
}

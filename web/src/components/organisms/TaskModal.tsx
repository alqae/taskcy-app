import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import CategoryIcon from '@mui/icons-material/Category'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import React, { useMemo, useState } from 'react'
import ListItem from '@mui/material/ListItem'
import { RichTextReadOnly } from 'mui-tiptap'
import Divider from '@mui/material/Divider'
import { capitalize } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'

import type { CreateTaskRequest, Task, TaskPriority, TaskState } from '@types'
import { TaskForm } from '@/components/molecules/TaskForm'
import { Puller } from '@/components/atoms/Puller'
import useExtensions from '@/hooks/useExtensions'
import { useApi } from '@/hooks/useApi'

interface TaskModalProps {
  renderLauncher: (toggle: () => void) => React.ReactNode
  onSubmit: () => void
  task?: Task
}

export const TaskModal: React.FC<TaskModalProps> = ({ renderLauncher, onSubmit, task }) => {
  const [isEditable, setIsEditable] = useState(task !== undefined ? false : true)

  const createRequest = useApi<Task, CreateTaskRequest>('/tasks', {
    method: 'POST',
    skip: true,
  })

  const updateRequest = useApi<Task, CreateTaskRequest>(`/tasks/${task?.id}`, {
    method: 'PUT',
    skip: true,
  })

  const [open, setOpen] = React.useState(false)

  const title = useMemo(() => {
    if (isEditable) {
      return 'Edit Task'
    }

    if (task) {
      return task.name
    }

    return 'New Task'
  }, [task, isEditable])

  const extensions = useExtensions({
    placeholder: 'Add your own content here...',
  })

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

        <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>

        {isEditable ? (
          <TaskForm
            defaultValue={task}
            isLoading={createRequest.isLoading}
            onCancel={() => {
              if (task) {
                setIsEditable(false)
              } else {
                setOpen(false)
              }
            }}
            onSubmit={async (data) => {
              const action = task ? updateRequest.refetch : createRequest.refetch
              await action({
                body: {
                  ...data,
                  state: data.state as TaskState,
                  priority: data.priority as TaskPriority,
                  expiryDate: data.expiryDate.toISOString(),
                  description: data.description ?? '',
                },
              })

              setIsEditable(false)
              setOpen(false)
              onSubmit()
            }}
          />
        ) : (
          <Grid container spacing={{ xs: 0, sm: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <List dense disablePadding>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <TimelapseIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Duration" secondary={task?.duration} />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <MonitorHeartIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="State" secondary={capitalize(task?.state?.replace('_', ' ') ?? '')} />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PriorityHighIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Priority" secondary={task?.priority} />
                </ListItem>
              </List>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <List dense disablePadding>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <LocalOfferIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Tags" secondary={task?.tags?.map((tag) => tag.name).join(', ')} />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <CategoryIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Category" secondary={task?.category?.name} />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <EventAvailableIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Expiry Date" secondary={task?.expiryDate} />
                </ListItem>
              </List>
            </Grid>

            <Grid size={12}>
              <RichTextReadOnly content={task?.description} extensions={extensions} />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => setOpen(false)}>Close</Button>
                <Button variant="contained" type="button" onClick={() => setIsEditable(true)}>
                  Edit
                </Button>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Drawer>
    </>
  )
}

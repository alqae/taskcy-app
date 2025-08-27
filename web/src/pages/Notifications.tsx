import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ListItemText from '@mui/material/ListItemText'
import CircleIcon from '@mui/icons-material/Circle'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import { Helmet } from 'react-helmet-async'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import React, { useState } from 'react'
import List from '@mui/material/List'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

// import { EmptyState } from '@/components/molecules/EmptyState'
import ErrorBoundary from '@/wrappers/ErrorBoundary'

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New message received",
      description: "You have a new message from Sarah Johnson about the quarterly report.",
      timestamp: "2 minutes ago",
      isRead: false,
      type: "message"
    },
    {
      id: 2,
      title: "Task completed",
      description: "Your task 'Update user documentation' has been completed successfully.",
      timestamp: "1 hour ago",
      isRead: false,
      type: "success"
    },
    {
      id: 3,
      title: "System maintenance scheduled",
      description: "Server maintenance will occur tonight from 11 PM to 2 AM EST.",
      timestamp: "3 hours ago",
      isRead: true,
      type: "info"
    },
    {
      id: 4,
      title: "Payment processed",
      description: "Your monthly subscription payment of $29.99 has been processed.",
      timestamp: "1 day ago",
      isRead: false,
      type: "payment"
    },
    {
      id: 5,
      title: "New team member added",
      description: "Alex Rodriguez has been added to the Marketing Team.",
      timestamp: "2 days ago",
      isRead: true,
      type: "team"
    },
    {
      id: 6,
      title: "Security alert",
      description: "New login detected from Chrome on Windows in New York, NY.",
      timestamp: "3 days ago",
      isRead: true,
      type: "security"
    },
    {
      id: 7,
      title: "Project deadline reminder",
      description: "The Project Alpha deadline is approaching in 3 days.",
      timestamp: "5 days ago",
      isRead: false,
      type: "reminder"
    },
    {
      id: 8,
      title: "File shared with you",
      description: "Emma Thompson shared 'Q4 Analytics Report.pdf' with you.",
      timestamp: "1 week ago",
      isRead: true,
      type: "file"
    },
    {
      id: 9,
      title: "Account settings updated",
      description: "Your email preferences have been updated successfully.",
      timestamp: "1 week ago",
      isRead: true,
      type: "settings"
    },
    {
      id: 10,
      title: "Welcome to the platform!",
      description: "Thanks for joining us. Explore our features and get started with your first project.",
      timestamp: "2 weeks ago",
      isRead: true,
      type: "welcome"
    }
  ])

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: !notification.isRead }
          : notification
      )
    )
  }

  const getTypeColor = (type: string) => {
    const colors = {
      message: '#2196f3',
      success: '#4caf50',
      info: '#ff9800',
      payment: '#9c27b0',
      team: '#00bcd4',
      security: '#f44336',
      reminder: '#ff5722',
      file: '#607d8b',
      settings: '#795548',
      welcome: '#e91e63'
    }
    return colors[type as keyof typeof colors] || '#757575'
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    )
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Notifications | Taskcy</title>
        <meta name="description" content="This is the notifications page of Taskcy." />
      </Helmet>

      <Paper component={Stack} gap={2} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Typography>
          </Box>

          <Button variant="contained" size="small" onClick={markAllAsRead}>Mark all as read</Button>
        </Box>

        <Divider />

        <List sx={{ p: 0 }}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  py: 2,
                  px: 2,
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => toggleRead(notification.id)}
              >
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  {notification.isRead ? (
                    <CheckCircleIcon sx={{ fontSize: 8, color: 'text.disabled' }} />
                  ) : (
                    <CircleIcon sx={{ fontSize: 8, color: getTypeColor(notification.type) }} />
                  )}
                </Box>

                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: notification.isRead ? 400 : 600,
                        color: notification.isRead ? 'text.secondary' : 'text.primary',
                        mb: 0.5
                      }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 0.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {notification.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.disabled">{notification.timestamp}</Typography>

                        <Chip
                          label={notification.type}
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: '0.65rem',
                            bgcolor: getTypeColor(notification.type),
                            color: 'white',
                            '& .MuiChip-label': {
                              px: 0.5
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {/* <EmptyState
          showActions
          title="All caught up!"
          subtitle="You're all up to date. New notifications will appear here."
        /> */}
      </Paper>
    </ErrorBoundary>
  )
}

export default NotificationsPage

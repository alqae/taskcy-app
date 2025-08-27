import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import RefreshIcon from '@mui/icons-material/Refresh'
import NotificationsIcon from '@mui/icons-material/NotificationsNone'

interface EmptyStateProps {
  title?: string
  subtitle?: string
  showActions?: boolean
  actionText?: string
  actionIcon?: React.ElementType
  icon?: React.ElementType
  onAction?: () => void
  borderLess?: boolean
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data yet",
  subtitle = "When you have data, they'll appear here",
  showActions = false,
  actionText = "Refresh",
  actionIcon: ActionIcon = RefreshIcon,
  icon: Icon = NotificationsIcon,
  onAction,
  borderLess = false,
}) => (
  <Paper
    elevation={0}
    sx={{
      width: '100%',
      p: 6,
      textAlign: 'center',
      bgcolor: 'background.paper',
      borderRadius: 2,
      border: borderLess ? 'none' : '1px solid',
      borderColor: 'divider'
    }}
  >
    <Stack spacing={3} alignItems="center">
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1
        }}
      >
        <Icon sx={{ fontSize: 40, color: 'grey.400' }} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
          {subtitle}
        </Typography>
      </Box>

      {showActions && (
        <Button
          variant="outlined"
          startIcon={<ActionIcon />}
          onClick={onAction}
          sx={{ borderColor: 'grey.300', color: 'text.secondary', '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' } }}
        >
          {actionText}
        </Button>
      )}
    </Stack>
  </Paper>
)

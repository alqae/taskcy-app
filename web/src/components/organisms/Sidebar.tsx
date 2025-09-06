import React, { useCallback, useState } from 'react'

import { styled, useTheme, type Theme, type CSSObject } from '@mui/material/styles'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useLocation, useNavigate } from 'react-router-dom'
import ListItemButton from '@mui/material/ListItemButton'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ArchiveIcon from '@mui/icons-material/Archive'
import ProfileIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import TaskIcon from '@mui/icons-material/Task'
import ListItem from '@mui/material/ListItem'
import MuiDrawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Box from '@mui/material/Box'

import { useSignOutMutation } from '@store/apis/authApi'
import { Appbar } from '@/components/molecules/Appbar'
import { Routes } from '@types'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
)

export const Sidebar: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [logOut, { isLoading }] = useSignOutMutation()

  const [open, setOpen] = useState(false)

  const theme = useTheme()
  const path = useLocation()
  const navigate = useNavigate()

  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), [])

  const ListItemIconProps = [
    {
      minWidth: 0,
      justifyContent: 'center',
    },
    {
      mr: open ? 3 : 'auto',
    },
  ]

  const ListItemButtonProps = [
    {
      minHeight: 48,
      px: 2.5,
    },
    open
      ? {
          justifyContent: 'initial',
        }
      : {
          justifyContent: 'center',
        },
  ]

  const ListItemTextProps = [
    open
      ? {
          opacity: 1,
        }
      : {
          opacity: 0,
        },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Appbar open={open} drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton sx={ListItemButtonProps} selected={path.pathname === Routes.DASHBOARD} onClick={() => navigate(Routes.DASHBOARD)}>
              <ListItemIcon sx={ListItemIconProps}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={ListItemTextProps} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton sx={ListItemButtonProps} selected={path.pathname === Routes.ARCHIVE} onClick={() => navigate(Routes.ARCHIVE)}>
              <ListItemIcon sx={ListItemIconProps}>
                <ArchiveIcon />
              </ListItemIcon>
              <ListItemText primary="Archive" sx={ListItemTextProps} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton sx={ListItemButtonProps} selected={path.pathname === Routes.TASKS} onClick={() => navigate(Routes.TASKS)}>
              <ListItemIcon sx={ListItemIconProps}>
                <TaskIcon />
              </ListItemIcon>
              <ListItemText primary="Tasks" sx={ListItemTextProps} />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton sx={ListItemButtonProps} selected={path.pathname === Routes.PROFILE} onClick={() => navigate(Routes.PROFILE)}>
              <ListItemIcon sx={ListItemIconProps}>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" sx={ListItemTextProps} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton sx={ListItemButtonProps} selected={path.pathname === Routes.NOTIFICATIONS} onClick={() => navigate(Routes.NOTIFICATIONS)}>
              <ListItemIcon sx={ListItemIconProps}>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" sx={ListItemTextProps} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton sx={ListItemButtonProps} selected={path.pathname === Routes.SETTINGS} onClick={() => navigate(Routes.SETTINGS)} disabled={isLoading}>
              <ListItemIcon sx={ListItemIconProps}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" sx={ListItemTextProps} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton sx={ListItemButtonProps} onClick={() => logOut()} disabled={isLoading}>
              <ListItemIcon sx={ListItemIconProps}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={ListItemTextProps} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, py: 2, overflowX: 'auto' }}>
        <DrawerHeader />
        <Container>{children}</Container>
      </Box>
    </Box>
  )
}

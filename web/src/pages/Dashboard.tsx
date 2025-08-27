import { Helmet } from 'react-helmet-async'
import { useTheme } from '@mui/material'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import React from 'react'

import { WeeklyDurationGraph } from '@/components/organisms/WeeklyDurationGraph'
import { ExpiredTasksTable } from '@/components/organisms/ExpiredTasksTable'
import { AnimatedCounterCard } from '@/components/molecules/AnimatedCounterCard'
import ErrorBoundary from '@/wrappers/ErrorBoundary'

const DashboardPage: React.FC = () => {
  const theme = useTheme()

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Dashboard | Taskcy</title>
        <meta name="description" content="This is the dashboard page of Taskcy." />
      </Helmet>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <AnimatedCounterCard color={theme.palette.warning.main} value={1000} legend="Todo" caption="Last updated 2 days ago" />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <AnimatedCounterCard color={theme.palette.info.main} value={1000} legend="In Progress" caption="Last updated 2 days ago" />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <AnimatedCounterCard color={theme.palette.success.main} value={1000} legend="Completed" caption="Last updated 2 days ago" />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <AnimatedCounterCard color={theme.palette.error.main} value={1000} legend="Archived" caption="Last updated 2 days ago" />
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <WeeklyDurationGraph />
          </Paper>
        </Grid>

        <Grid size={12}>
          <ExpiredTasksTable />
        </Grid>
      </Grid>
    </ErrorBoundary>
  )
}

export default DashboardPage

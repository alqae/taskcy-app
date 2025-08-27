import { Helmet } from 'react-helmet-async'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import React from 'react'

import { UpdateBasicInformation } from '@/components/molecules/UpdateBasicInformation'
import { DeleteAccountBanner } from '@/components/molecules/DeleteAccountBanner'
import { UpdatePasswordForm } from '@/components/molecules/UpdatePasswordForm'
import ErrorBoundary from '@/wrappers/ErrorBoundary'

const ProfilePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Profile | Taskcy</title>
        <meta name="description" content="This is the profile page of Taskcy." />
      </Helmet>

      <Stack gap={2}>
        <Paper sx={{ p: 2 }}>
          <UpdateBasicInformation />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <UpdatePasswordForm />
        </Paper>

        <DeleteAccountBanner />
      </Stack>
    </ErrorBoundary>
  )
}

export default ProfilePage

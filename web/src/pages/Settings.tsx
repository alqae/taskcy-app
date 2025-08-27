import React from 'react'
import Stack from '@mui/material/Stack'
import { Helmet } from 'react-helmet-async'
import SellIcon from '@mui/icons-material/Sell'
import SpeedDial from '@mui/material/SpeedDial'
import CategoryIcon from '@mui/icons-material/Category'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'

import ErrorBoundary from '@/wrappers/ErrorBoundary'
import { TagTable } from '@/components/organisms/TagTable'
import { CategoryTable } from '@/components/organisms/CategoryTable'

const Settings: React.FC = () => (
  <ErrorBoundary>
    <Helmet>
      <title>Settings | Taskcy</title>
      <meta name="description" content="This is the settings page of Taskcy." />
    </Helmet>

    <Stack gap={2}>
      <TagTable />
      <CategoryTable />
    </Stack>

    <SpeedDial
      ariaLabel="Settings Actions"
      icon={<SpeedDialIcon />}
      sx={{
        position: 'fixed',
        bottom: { xs: 16, sm: 32 },
        right: { xs: 16, sm: 32 },
      }}
    >
      <SpeedDialAction
        icon={<SellIcon />}
        slotProps={{
          tooltip: {
            title: 'Tag',
          },
        }}
      />

      <SpeedDialAction
        icon={<CategoryIcon />}
        slotProps={{
          tooltip: {
            title: 'Category',
          },
        }}
      />
    </SpeedDial>
  </ErrorBoundary>
)

export default Settings

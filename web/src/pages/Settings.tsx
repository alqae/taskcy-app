import React from 'react'
import Stack from '@mui/material/Stack'
import { Helmet } from 'react-helmet-async'
import SellIcon from '@mui/icons-material/Sell'
import SpeedDial from '@mui/material/SpeedDial'
import CategoryIcon from '@mui/icons-material/Category'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'

import { CategoryTable } from '@/components/organisms/CategoryTable'
import { CategoryModal } from '@/components/organisms/CategoryModal'
import { useCreateCategoryMutation } from '@/store/apis/categoryApi'
import { TagTable } from '@/components/organisms/TagTable'
import { TagModal } from '@/components/organisms/TagModal'
import { useCreateTagMutation } from '@/store/apis/tagApi'
import ErrorBoundary from '@/wrappers/ErrorBoundary'
import { useModal } from '@/context/ModalContext'

const Settings: React.FC = () => {
  const modal = useModal()

  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation()
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation()

  const handleAddTag = () => {
    modal.showModal(TagModal, {
      title: 'Add Tag',
      description: 'Please fill in the form below to add a new tag.',
      onSubmit: async (data) => {
        await createTag(data)
        modal.hideModal()
      },
      isLoading: isCreatingTag,
    })
  }

  const handleAddCategory = () => {
    modal.showModal(CategoryModal, {
      title: 'Add Category',
      description: 'Please fill in the form below to add a new category.',
      onSubmit: async (data) => {
        await createCategory(data)
        modal.hideModal()
      },
      isLoading: isCreatingCategory,
    })
  }

  return (
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
          onClick={handleAddTag}
          slotProps={{
            tooltip: {
              title: 'Tag',
            },
          }}
        />

        <SpeedDialAction
          icon={<CategoryIcon />}
          onClick={handleAddCategory}
          slotProps={{
            tooltip: {
              title: 'Category',
            },
          }}
        />
      </SpeedDial>
    </ErrorBoundary>
  )
}

export default Settings

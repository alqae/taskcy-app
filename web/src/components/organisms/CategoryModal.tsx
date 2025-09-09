import React, { useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import { CategoryForm, type CategoryFormProps } from '@/components/molecules/CategoryForm'
import type { ModalOptions } from '@/context/ModalContext'
import type { Category } from '@/types'

export interface CategoryModalProps extends ModalOptions {
  title: string
  description: string
  defaultValue?: Category
  onSubmit: CategoryFormProps['onSubmit']
  isLoading: boolean
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  defaultValue,
  onClose,
  title,
  description,
  isClosing,
  onSubmit,
  isLoading,
}) => {
  const formRef = useRef<HTMLFormElement>(null)

  const handleClose = isLoading ? undefined : onClose

  return (
    <Dialog open={!isClosing} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{description}</DialogContentText>
        <CategoryForm
          ref={formRef}
          defaultValue={defaultValue}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>

      <DialogActions>
        <Button disabled={isLoading} onClick={handleClose}>Cancel</Button>
        <Button disabled={isLoading} onClick={() => formRef.current?.requestSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

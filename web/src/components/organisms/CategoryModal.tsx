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
  defaultValue?: Category
  title: string
  description: string
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ defaultValue, onClose, title, description, isClosing }) => {
  const formRef = useRef<HTMLFormElement>(null)

  const onSubmit: CategoryFormProps['onSubmit'] = (data) => {
    console.log(data)
    onClose?.()
  }

  return (
    <Dialog open={!isClosing} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{description}</DialogContentText>
        <CategoryForm ref={formRef} defaultValue={defaultValue} onSubmit={onSubmit} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => formRef.current?.requestSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

import React, { useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import { TagForm, type TagFormProps } from '@/components/molecules/TagForm'
import type { ModalOptions } from '@/context/ModalContext'
import type { Tag } from '@/types'

export interface TagModalProps extends ModalOptions {
  title: string
  description: string
  defaultValue?: Tag
  onSubmit: TagFormProps['onSubmit']
  isLoading: boolean
}

export const TagModal: React.FC<TagModalProps> = ({
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
        <TagForm
          ref={formRef}
          defaultValue={defaultValue}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </DialogContent>

      <DialogActions>
        <Button disabled={isLoading} onClick={handleClose}>Cancel</Button>
        <Button disabled={isLoading} onClick={() => formRef.current?.requestSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

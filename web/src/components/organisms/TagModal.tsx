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
  defaultValue?: Tag
  title: string
  description: string
}

export const TagModal: React.FC<TagModalProps> = ({ defaultValue, onClose, title, description, isClosing }) => {
  const formRef = useRef<HTMLFormElement>(null)

  const onSubmit: TagFormProps['onSubmit'] = (data) => {
    console.log(data)
    onClose?.()
  }

  return (
    <Dialog open={!isClosing} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{description}</DialogContentText>
        <TagForm ref={formRef} defaultValue={defaultValue} onSubmit={onSubmit} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => formRef.current?.requestSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

import React from 'react'
import Button, { type ButtonOwnProps } from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

import type { ModalOptions } from '@/context/ModalContext'

export interface ConfirmModalProps extends ModalOptions {
  title: string
  description: string
  onConfirm?: () => void
  cancelButtonText?: string
  confirmButtonText?: string
  confirmButtonColor?: ButtonOwnProps['color']
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  description,
  onClose,
  onConfirm,
  isClosing,
  cancelButtonText = 'Disagree',
  confirmButtonText = 'Agree',
  confirmButtonColor = 'primary',
}) => {
  const handleConfirm = () => {
    onClose?.()
    onConfirm?.()
  }

  return (
    <Dialog fullScreen={false} onClose={onClose} open={!isClosing} closeAfterTransition={false}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{cancelButtonText}</Button>
        <Button onClick={handleConfirm} color={confirmButtonColor} autoFocus>{confirmButtonText}</Button>
      </DialogActions>
    </Dialog>
  )
}

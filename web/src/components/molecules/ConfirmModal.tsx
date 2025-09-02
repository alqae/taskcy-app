import React from 'react'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Dialog from '@mui/material/Dialog'

import type { ModalOptions } from '@/context/ModalContext'

export interface ConfirmModalProps extends ModalOptions {
  title: string
  description: string
  onConfirm?: () => void
  isClosing?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, description, onClose, onConfirm, isClosing }) => (
  <Dialog fullScreen={false} onClose={onClose} open={!isClosing} closeAfterTransition={false}>
    <DialogTitle id="responsive-dialog-title">
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        {description}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={onClose}>
        Disagree
      </Button>
      <Button
        onClick={() => {
          onClose?.();
          onConfirm?.();
        }}
        autoFocus
      >
        Agree
      </Button>
    </DialogActions>
  </Dialog>
)

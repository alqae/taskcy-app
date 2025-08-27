import React from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AlertTitle from '@mui/material/AlertTitle'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

export const DeleteAccountBanner: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Alert severity="error" sx={{ p: 2, border: '1px solid', borderColor: 'error.main' }}>
        <AlertTitle>Delete Account</AlertTitle>
        <p>You are about to permanently delete your account. This action cannot be undone.</p>
        <Button color="error" variant="contained" size="small" onClick={() => setOpen(true)}>
          Delete account
        </Button>
      </Alert>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Account Deletion</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you absolutely sure you want to delete your account? All your data,
            settings, and history will be permanently removed and cannot be recovered
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)} autoFocus variant="contained" color="error">
            Yes, Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

import React from 'react'

import { Alert, AlertTitle, Button, Box } from '@mui/material'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(error: Error | null): State {
    return { hasError: error !== null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <Alert
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
            action={
              <Button color="inherit" variant="outlined" size="small" onClick={this.handleReset}>
                Try again
              </Button>
            }
          >
            <AlertTitle>Something went wrong</AlertTitle>
            An unexpected error occurred. Please try again.
          </Alert>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

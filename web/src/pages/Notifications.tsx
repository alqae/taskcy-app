import { Helmet } from 'react-helmet-async'
import React from 'react'

import ErrorBoundary from '@/wrappers/ErrorBoundary'

const NotificationsPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Notifications | Taskcy</title>
        <meta name="description" content="This is the notifications page of Taskcy." />
      </Helmet>

      <div>Notifications</div>
    </ErrorBoundary>
  )
}

export default NotificationsPage

import { Outlet } from 'react-router-dom'
import React from 'react'

export const AuthenticatedLayout: React.FC = () => (
  <div>
    <Outlet />
  </div>
)
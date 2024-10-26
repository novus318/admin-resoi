import React from 'react'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'

const OnlineOrdersToggle = () => {
  return (
    <div className="flex items-center space-x-2">
    <Switch
      id="online-toggle"
    />
    <Label htmlFor="online-toggle">Online orders</Label>
  </div>
  )
}

export default OnlineOrdersToggle

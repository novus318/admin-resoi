'use client'

import React, { useState } from 'react'
import { Clock, X, Loader2, Clock1, Clock3, Check } from 'lucide-react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from '@/hooks/use-toast'

const ChangeTableStatusWaiter = ({ order,
  refreshOrders,
  refreshAssets
}: any) => {
  const [status, setStatus] = useState(order.status)
  const [loading, setLoading] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const statusConfig: any = {
    'pending': { label: 'Pending', icon: Clock1, color: 'text-primary' },
    'confirmed': { label: 'Confirmed', icon: Clock, color: 'text-yellow-600' },
    'in-progress': { label: 'In Progress', icon: Clock3, color: 'text-blue-600' },
    'cancelled': { label: 'Cancelled', icon: X, color: 'text-red-600' },
    'completed': { label: 'Completed', icon: Check, color: 'text-green-600' },
  }

  const handleStatusChange = async (newStatus: 'pending' | 'confirmed' | 'in-progress' | 'cancelled') => {
    setLoading(true)
    try {
      const response = await axios.put(`${apiUrl}/api/tableOrder/update/table-order-status/${order.orderId}`, {
        status: newStatus,
      })

      if (response.data.success) {
        setStatus(newStatus)
        refreshOrders()
        if (refreshAssets) {
          refreshAssets()
        }
      }
    } catch (error: any) {
      toast({
        title: 'Failed to update status',
        variant: 'destructive',
        description: error?.response?.data?.message || error.message || 'Something went wrong.',
      })
    } finally {
      setLoading(false)
    }
  }

  const CurrentStatusIcon = statusConfig[status]?.icon


  const getAvailableStatuses = () => {
    if (status === 'pending') return ['confirmed', 'in-progress', 'cancelled']
    if (status === 'confirmed') return ['in-progress', 'cancelled']
    return []
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="justify-start" disabled={loading || ['completed', 'cancelled'].includes(status)}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CurrentStatusIcon className={`mr-2 h-4 w-4 ${statusConfig[status]?.color}`} />
            )}
            {loading ? '...' : statusConfig[status]?.label}
          </Button>
        </DropdownMenuTrigger>
        {getAvailableStatuses().length > 0 && (
          <DropdownMenuContent>
            {getAvailableStatuses().map((availableStatus) => {
              const StatusIcon = statusConfig[availableStatus].icon
              return (
                <DropdownMenuItem
                  key={availableStatus}
                  onClick={() => handleStatusChange(availableStatus as 'pending' | 'confirmed' | 'in-progress' | 'cancelled')}
                >
                  <StatusIcon className={`mr-2 h-4 w-4 ${statusConfig[availableStatus].color}`} />
                  <span>{statusConfig[availableStatus].label}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}

export default ChangeTableStatusWaiter;
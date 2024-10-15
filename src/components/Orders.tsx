'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const Orders = () => {
  return (
    <div className="w-full md:w-5/6 p-4 space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Donation & Expense Trends</CardTitle>
              <CardDescription>A line chart showing the trend of donations & expenses over time.</CardDescription>
            </CardHeader>
            <CardContent>
              
            </CardContent>
          </Card>
          </div>
         
    </div>
  )
}

export default Orders

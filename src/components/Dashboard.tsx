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

const Dashboard = () => {
  return (
    <div className="w-full md:w-5/6 p-4 space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Accounts</CardTitle>
              <CardDescription>The total number of assets managed by the accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹23</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Donations</CardTitle>
              <CardDescription>The total amount of donations received this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹32</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
              <CardDescription>The total Expenses of the month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹{34}</div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-gray-600">
                {4 > 0? '+': ''}{4}%  from last month
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Asset Distribution</CardTitle>
              <CardDescription>A breakdown the assets of month by category.</CardDescription>
            </CardHeader>
            <CardContent>
            
            </CardContent>
          </Card>
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

export default Dashboard

'use client'

import * as React from 'react'
import { Bar, Line } from 'recharts'
import { Banknote, CalendarIcon, ContactRound, Logs, Ticket } from 'lucide-react'
import { addDays, format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const orderData = [
  { name: 'Jan', storeOrders: 65, onlineOrders: 28 },
  { name: 'Feb', storeOrders: 59, onlineOrders: 48 },
  { name: 'Mar', storeOrders: 80, onlineOrders: 40 },
  { name: 'Apr', storeOrders: 81, onlineOrders: 19 },
  { name: 'May', storeOrders: 56, onlineOrders: 86 },
  { name: 'Jun', storeOrders: 55, onlineOrders: 27 },
]

const expenseData = [
  { name: 'Jan', expenses: 12000 },
  { name: 'Feb', expenses: 19000 },
  { name: 'Mar', expenses: 3000 },
  { name: 'Apr', expenses: 5000 },
  { name: 'May', expenses: 2000 },
  { name: 'Jun', expenses: 3000 },
]
const ReportOverview = () => {
    const [date, setDate] = React.useState<any>({
        from: new Date(2023, 0, 20),
        to: addDays(new Date(2023, 0, 20), 20),
      })
 
  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <Banknote/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Store Orders
                  </CardTitle>
                  <Logs/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online Orders</CardTitle>
                  <Ticket/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Staff
                  </CardTitle>
                  <ContactRound/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      storeOrders: {
                        label: 'Store Orders',
                        color: 'hsl(var(--chart-1))',
                      },
                      onlineOrders: {
                        label: 'Online Orders',
                        color: 'hsl(var(--chart-2))',
                      },
                    }}
                    className="h-[300px]"
                  >
                  
                      <ChartTooltip content={<ChartTooltipContent />} />
                   
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Recent sales content here */}
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Olivia Martin</p>
                        <p className="text-sm text-muted-foreground">
                          olivia.martin@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$1,999.00</div>
                    </div>
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Jackson Lee</p>
                        <p className="text-sm text-muted-foreground">
                          jackson.lee@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$39.00</div>
                    </div>
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                        <p className="text-sm text-muted-foreground">
                          isabella.nguyen@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$299.00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Expenses Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      expenses: {
                        label: 'Expenses',
                        color: 'hsl(var(--chart-3))',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <Line
                      data={expenseData}
                    >
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </Line>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Staff Overview</CardTitle>
                  <CardDescription>
                    Total 56 staff members.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="ml-2 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Chefs
                        </p>
                        <p className="text-sm text-muted-foreground">
                          12 members
                        </p>
                      </div>
                      <div className="ml-auto font-medium">21%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-2 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Waiters
                        </p>
                        <p className="text-sm text-muted-foreground">
                          28 members
                        </p>
                      </div>
                      <div className="ml-auto font-medium">50%</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-2 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Kitchen Staff
                        </p>
                        <p className="text-sm text-muted-foreground">
                          16 members
                        </p>
                      </div>
                      <div className="ml-auto font-medium">29%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ReportOverview

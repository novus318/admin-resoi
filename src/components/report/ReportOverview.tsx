'use client'

import React, { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Label, Line, Pie, PieChart, XAxis } from 'recharts'
import { Banknote, ChevronLeft, ChevronRight, Loader2, Logs, ReceiptIndianRupee, Ticket } from 'lucide-react'
import { addDays, } from 'date-fns'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import axios from 'axios'
import { formatCurrency } from '@/lib/currencyFormat'
import { Button } from '../ui/button'


const monthNames = ["October", "September", "August", "July", "June", "May"];
const ReportOverview = () => {
  const [data, setData] = useState<any>({})
  const [itemdata, setItemData] = useState<any>([])
  const [RevenueExpense, setRevenueExpense] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [loadingRE, setLoadingRE] = useState(true)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [uniqueMonths, setUniqueMonths] = useState([]);

  // Filter itemdata based on the current month
  const currentMonth = uniqueMonths[currentMonthIndex];

  // Filter item data by current month
  const filteredData = itemdata.filter((item:any) => item.month === currentMonth);

  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex === 0 ? uniqueMonths.length - 1 : prevIndex - 1
    );
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex === uniqueMonths.length - 1 ? 0 : prevIndex + 1
    );
  };


  const fetchRevenueExpense = async () => {
    setLoadingRE(true)
    try {
      const response = await axios.get(`${apiUrl}/api/report/revenue-expenses/last-6-months`)
      if (response.data.success) {
        setRevenueExpense(response.data.data)
        setLoadingRE(false)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoadingRE(false)
    }
  }
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/api/report/totalof-month`)
      if (response.data.success) {
        setData(response.data.data)
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
    fetchRevenueExpense()
  }, [])



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
                    <p className="text-xs text-muted-foreground">
                      of the month
                    </p>
                  </CardTitle>
                  <Banknote />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ?
                    <Loader2 className='animate-spin' /> : `${formatCurrency(data?.totalRevenue || 0)}`
                  }</div>
                  <p className="text-xs text-muted-foreground">
                    {loading ?
                      <Loader2 className='animate-spin' /> : `${data?.revenuePercentageChange && (data?.revenuePercentageChange).toFixed(2)}%`
                    } from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Store Orders
                    <p className="text-xs text-muted-foreground">
                      of the month
                    </p>
                  </CardTitle>
                  <Logs />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ?
                      <Loader2 className='animate-spin' /> : `${formatCurrency(data?.currentTableOrderTotal || 0)}`
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ?
                      <Loader2 className='animate-spin' /> : `${data?.tableOrderPercentageChange && (data?.tableOrderPercentageChange).toFixed(2)}%`
                    }  from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online Orders
                    <p className="text-xs text-muted-foreground">
                      of the month
                    </p>
                  </CardTitle>
                  <Ticket />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ?
                      <Loader2 className='animate-spin' /> : `${formatCurrency(data?.currentOnlineOrderTotal || 0)}`
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ?
                      <Loader2 className='animate-spin' /> : `${data?.onlineOrderPercentageChange && (data?.onlineOrderPercentageChange).toFixed(2)}%`
                    } from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Expense
                    <p className="text-xs text-muted-foreground">
                      of the month
                    </p>
                  </CardTitle>
                  <ReceiptIndianRupee />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ?
                      <Loader2 className='animate-spin' /> : `${formatCurrency(data?.totalExpenses || 0)}`
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ?
                      <Loader2 className='animate-spin' /> : `${data?.expensePercentageChange && (data?.expensePercentageChange).toFixed(2)}%`
                    } from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
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
                      revenue: {
                        label: 'Revenue',
                        color: 'hsl(var(--chart-3))',
                      },
                      expense: {
                        label: 'Expense',
                        color: 'hsl(var(--chart-4))',
                      },
                    }}
                  >
                    <AreaChart
                      accessibilityLayer
                      data={RevenueExpense.slice().reverse()}  // Reversed for chronological order
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Area
                        dataKey="StoreOrders"
                        type="natural"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.4}
                        stroke="hsl(var(--chart-1))"
                        stackId="a"
                      />
                      <Area
                        dataKey="OnlineOrders"
                        type="natural"
                        fill="hsl(var(--chart-2))"
                        fillOpacity={0.4}
                        stroke="hsl(var(--chart-2))"
                        stackId="a"
                      />
                      <Area
                        dataKey="revenue"
                        type="natural"
                        fill="hsl(var(--chart-3))"
                        fillOpacity={0.4}
                        stroke="hsl(var(--chart-3))"
                        stackId="a"
                      />
                      <Area
                        dataKey="expense"
                        type="natural"
                        fill="hsl(var(--chart-4))"
                        fillOpacity={0.4}
                        stroke="hsl(var(--chart-4))"
                        stackId="a"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Revenue and Expenses</CardTitle>
                  <CardDescription>
                    of last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-start font-semibold border-b pb-2">
                    <div>Month</div>
                    <div>Revenue</div>
                    <div>Expense</div>
                  </div>
                  {RevenueExpense.map((exp: any, index: any) => (
                    <div key={index} className="grid grid-cols-3 gap-4 text-start py-2 border-b">
                      <div className="text-sm font-medium">{exp.month}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(exp.revenue || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(exp.expense || 0)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Sale of Items</CardTitle>
        <CardDescription>of {currentMonth}</CardDescription>
      </CardHeader>
      <div className="flex items-center justify-between mb-4 mx-3">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{currentMonth}</h2>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            saleOfItems: {
              label: 'Sale of Items',
              color: 'hsl(var(--chart-1))',
            },

          }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={filteredData}
              dataKey="totalSold"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {currentMonth}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Items Sold
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
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

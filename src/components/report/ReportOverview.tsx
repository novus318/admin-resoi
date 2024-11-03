'use client'

import React, { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Legend, Line, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Banknote, ChevronLeft, ChevronRight, Loader2, Logs, ReceiptIndianRupee, Ticket, TrendingDown, TrendingUp } from 'lucide-react'
import { addDays, } from 'date-fns'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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


const ReportOverview = () => {
  const [data, setData] = useState<any>({})
  const [itemdata, setItemData] = useState<any>([])
  const [saleTime, setSaleTime] = useState<any>([])
  const [RevenueExpense, setRevenueExpense] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [loadingRE, setLoadingRE] = useState(true)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [months, setMonths] = useState([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const now = new Date();
  const currentYear = now.getFullYear();



  const fetchItemData = async () => {
      try {
          const response = await axios.get(`${apiUrl}/api/report/analytics/items-sold/last-six-months`);
          const data = response.data;

          setItemData(data.data);
          setMonths(data.months); // Assuming the backend sends an array of months
          setCurrentMonthIndex(data.months.length - 1); // Start with the last month in the received array
      } catch (error) {
          console.error('Failed to fetch data:', error);
      }
  };
  const fetchSaleTime = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/report/analytics/average-sale-time/last-three-months`);
        const data = response.data;

        setSaleTime(data.data);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
};

  const handlePreviousMonth = () => {
      setCurrentMonthIndex(prev => Math.max(prev - 1, 0)); // Prevent going below 0
  };

  const handleNextMonth = () => {
      setCurrentMonthIndex(prev => Math.min(prev + 1, months.length - 1)); // Prevent going beyond the last month
  };

  const currentMonth = months[currentMonthIndex] ? months[currentMonthIndex] : '';
  const currentData = itemdata.filter((data:any) => data.month === currentMonth);

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
    fetchItemData()
    fetchSaleTime()
  }, [])


  const convertTime = (time: number) => {
    const hours = Math.floor(time * 24)
    const minutes = Math.floor((time * 24 * 60) % 60)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }


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
            <div className="grid gap-4 grid-cols-2 md:grid-cols-7">
          <div className="col-span-2 md:col-span-4">
          <Card>
          <CardHeader>
        <CardTitle>Weekly Sales Overview</CardTitle>
        <CardDescription>Average sales, amounts, and peak time by day of the week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            averageSale: {
              label: "Average Sales",
              color: "hsl(var(--chart-1))",
            },
            averageAmount: {
              label: "Average Amount",
              color: "hsl(var(--chart-2))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={saleTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" orientation="left" stroke="var(--color-averageSale)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-averageAmount)" />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-2 border rounded shadow">
                        <p className="font-bold">{payload[0].payload.day}</p>
                        <p>Peak Time: {convertTime(payload[0].payload.time)}</p>
                        <p>Average Sales: {payload[0].payload.averageSale}</p>
                        <p>Average Amount: {formatCurrency(payload[0].payload.averageAmount)}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="averageSale" fill="var(--color-averageSale)" name="Average Sales" />
              <Bar yAxisId="right" dataKey="averageAmount" fill="var(--color-averageAmount)" name="Average Amount" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
              </Card>
          </div>
              <div className="col-span-2 md:col-span-3 min-h-[433px]">
            <Card className="min-h-[433px]">
                <CardHeader>
                    <CardTitle>Item Overview - {currentMonth} {currentYear}</CardTitle>
                    <CardDescription>
                        Total {currentData.reduce((acc:any, item:any) => acc + item.totalSold, 0)} items sold in {currentMonth} {currentYear}
                    </CardDescription>
                </CardHeader>
                <div className="flex items-center justify-between mb-4 mx-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePreviousMonth}
                        disabled={currentMonthIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextMonth}
                        disabled={currentMonthIndex === months.length - 1}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <CardContent>
                    <div className="space-y-4">
                        {currentData.length > 0 ? (
                            currentData.map((item:any) => (
                                <div key={item.item} className="flex items-center">
                                    <div className="ml-2 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.item}</p>
                                        <p className="text-sm text-muted-foreground">{item.totalSold} items</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No items sold in this month.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ReportOverview

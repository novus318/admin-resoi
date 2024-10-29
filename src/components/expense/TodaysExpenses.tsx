"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Edit, Loader2, Trash } from "lucide-react"
import { format, isToday, subDays, addDays } from "date-fns"
import { formatCurrency } from "@/lib/currencyFormat"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


type ExpenseItem = {
  _id: string
  name: string
  category: any
  amount: number
  date: any
}

type DailyExpense = {
  _id: string
  date: string
  expenses: ExpenseItem[]
}

const TodaysExpenses = ({ refresh, categories }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [weeklyExpenses, setWeeklyExpenses] = useState<DailyExpense[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editExpense, setEditExpense] = useState<ExpenseItem | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchWeeklyExpenses = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/expense/get-expense/forWeek?date=${format(new Date(), 'yyyy-MM-dd')}`)
      const data = await response.json()
      setWeeklyExpenses(data.weeklyExpenses || [])
    } catch (error) {
      console.error("Failed to fetch expenses:", error)
    }
  }

  useEffect(() => {
    fetchWeeklyExpenses()
  }, [refresh])

  const formatDate = (date: Date) => format(date, 'MMMM d, yyyy')

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => (direction === 'prev' ? subDays(prevDate, 1) : addDays(prevDate, 1)))
  }

  const handleDelete = async (expenseId: string,date:any) => {
    const confirmation = window.confirm("Are you sure you want to delete this expense?")
    if (!confirmation) return
    try {
      const response =await axios.delete(`${apiUrl}/api/expense/delete-expense/${date}/${expenseId}`)
      if (response.data.success) {
      fetchWeeklyExpenses()
      toast({
        title: 'Success',
        description: 'Expense deleted successfully',
        variant: 'default',
      })
      }
    } catch (error:any) {
      console.error("Failed to delete expense:", error)
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = async () => {
    if (!editExpense) return
    setLoading(true)
    try {
      const { _id, name, category, amount, date } = editExpense
      const response = await axios.put(`${apiUrl}/api/expense/edit-expense/${date}/${_id}`, {
        name, category, amount
      })
      if (response.data.success) {
        setEditExpense(null)
        setDialogOpen(false)
        fetchWeeklyExpenses()
        setLoading(false)
        toast({
          title: 'Success',
          description: 'Expense updated successfully',
          variant: 'default',
        })
      }
    } catch (error: any) {
      setLoading(false)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to edit expense',
        variant: 'destructive',
      })
    }
  }

  const currentDayExpenses = weeklyExpenses.find(
    dailyExpense => format(new Date(dailyExpense.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
  )?.expenses || []

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Weekly Expense Viewer</CardTitle>
        <CardDescription>View your expenses for the past 7 days</CardDescription>
      </CardHeader>
        <div className="flex items-center justify-between mb-4 mx-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDay('prev')}
            disabled={currentDate.getTime() <= new Date().setDate(new Date().getDate() - 6)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {isToday(currentDate) ? "Today" : formatDate(currentDate)}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDay('next')}
            disabled={isToday(currentDate)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Card className="m-2">
          <CardHeader>
            <CardDescription className="font-extrabold tracking-wide text-base">
              Total: {formatCurrency(currentDayExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
            </CardDescription>
          </CardHeader>
            <ScrollArea className="h-[300px] w-full p-4">
              {currentDayExpenses.length > 0 ? (
                currentDayExpenses.map(expense => (
                  <div key={expense._id} className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarFallback>{expense.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{expense.name}</p>
                      <p className="text-sm text-muted-foreground">{expense.category.name}</p>
                    </div>
                    <div className="font-medium">{formatCurrency(expense.amount)}</div>
                    <Button variant="outline" size="icon" onClick={() => {
                      setEditExpense({
                        _id: expense._id,
                        name: expense.name,
                        category: expense.category._id,
                        amount: expense.amount,
                        date: currentDate
                      }); setDialogOpen(true)
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(expense._id,currentDate)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No expenses for this day.</p>
              )}
            </ScrollArea>
        </Card>

 
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <h3>Edit Expense</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
            <div className="col-span-2">
              <Input
                value={editExpense?.name || ''}
                onChange={(e) => setEditExpense(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Expense name"
                className="w-full"
              />
            </div>

            <div className="col-span-1">
              <Select
                value={editExpense?.category || ''}
                onValueChange={(value) => {
                  setEditExpense(prev => prev? {...prev, category: value } : null)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1">
              <Input
                placeholder="Amount"
                type="number"
                value={editExpense?.amount || 0}
                onChange={(e) => setEditExpense(prev => prev ? { ...prev, amount: parseFloat(e.target.value) } : null)}
              />
            </div>
          </div>
          <Button onClick={handleEdit} disabled={loading}>{
            loading ? <Loader2 className='animate-spin' /> : 'Save'
          }</Button>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default TodaysExpenses

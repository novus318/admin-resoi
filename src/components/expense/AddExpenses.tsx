'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, PlusIcon, TrashIcon } from 'lucide-react'
import { DateTimePicker } from '../ui/datetime-picker'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'

interface Expense {
  name: string
  category: string
  amount: string
}

interface Category {
  _id: string
  name: string
}

interface AddExpensesProps {
  categories: Category[]
}

const AddExpenses = ({categories,onExpenseAdded}:any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [expenses, setExpenses] = useState<Expense[]>([{ name: '', category: '', amount: '' }])
  const [loading, setLoading] = useState(false)


  const handleExpenseChange = (index: number, field: keyof Expense, value: string) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense, i) => i === index ? { ...expense, [field]: value } : expense)
    )
  }
  const addExpense = () => setExpenses([...expenses, { name: '', category: '', amount: '' }])

  const removeExpense = (index: number) => setExpenses(expenses.filter((_, i) => i !== index))

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post(`${apiUrl}/api/expense/create-daily/expense`, { date, expenses })
     if(response.data.success){
      setExpenses([{ name: '', category: '', amount: '' }])
      onExpenseAdded();
      toast({
        title: 'Expenses added successfully!',
        description: 'Your daily expenses have been added.',
        variant: 'default',
      })
      setLoading(false)
     }
    } catch (error:any) {
      setLoading(false)
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'An error occurred while submitting your expenses',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-2">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Add Daily Expenses</CardTitle>
        <CardDescription className="text-sm md:text-base">Enter your expenses for a specific date.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <DateTimePicker value={date} onChange={setDate} />
          </div>

          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-md relative">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeExpense(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                  <div className="col-span-2">
                    <Label htmlFor={`expense-name-${index}`}>Name</Label>
                    <Input
                      id={`expense-name-${index}`}
                      value={expense.name}
                      onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
                      required
                      placeholder="Expense name"
                      className="w-full"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label htmlFor={`expense-category-${index}`}>Category</Label>
                    <Select
                      value={expense.category}
                      onValueChange={(value) => handleExpenseChange(index, 'category', value)}
                    >
                      <SelectTrigger id={`expense-category-${index}`} className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category:any) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-1">
                    <Label htmlFor={`expense-amount-${index}`}>Amount</Label>
                    <Input
                      id={`expense-amount-${index}`}
                      type="number"
                      value={expense.amount}
                      onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                      required
                      placeholder="0.00"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={addExpense}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Another Expense
          </Button>
        </CardContent>

        <CardFooter className="mt-4">
          <Button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-2 text-base">{
            loading? <Loader2 className='animate-spin'/> : 'Submit Expenses'
            }</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default AddExpenses

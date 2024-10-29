'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { Loader2 } from "lucide-react"

// This type represents the shape of our ExpenseCategory document
type ExpenseCategory = {
  name: string
  description?: string
}

const AddExpenseCategory = ({fetchCategories}:any) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newCategory: ExpenseCategory = { name, description }
    try {
      setLoading(true)
      const response = await axios.post(`${apiUrl}/api/expense/create-expense/category`, newCategory)
      if(response.data.success){
        setName("")
        setDescription("")
        setOpen(false)
        setLoading(false)
        fetchCategories()
        toast({
          title: "Category added",
          description: "Your new expense category has been created.",
        })
      }
    } catch (error:any) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || 'An error occurred try again',
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Category</Button>
      </DialogTrigger>
      <DialogContent className="w-full p-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Add Expense Category</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Create a new category for your expenses.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Label htmlFor="name" className="sm:w-1/4">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full sm:w-3/4"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Label htmlFor="description" className="sm:w-1/4">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full sm:w-3/4"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2">{
              loading? <Loader2 className="animate-spin"/> : 'Submit'
              }</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddExpenseCategory

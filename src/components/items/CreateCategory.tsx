'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import {Loader2 } from 'lucide-react'
import EditCategory from './EditCategory'

type Category = {
  _id: string
  name: string
}


const CreateCategory = ({allcategories,fetchAllCategories}:any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newSubcategory, setNewSubcategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [addcategoryLoding, setAddcategoryLoding] = useState(false)
  const [addsubcategoryLoding, setAddsubcategoryLoding] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/category/get-categories`)
      if (response.data.success) { }
      setCategories(response.data.categories)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      })
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive',
      })
      return
    }
    setAddcategoryLoding(true)
    try {
      const response = await axios.post(`${apiUrl}/api/category/create-category`,
        { name: newCategory })
      if (response.data.success) {
        setNewCategory('')
        fetchCategories()
        fetchAllCategories()
        setAddcategoryLoding(false)
        toast({
          title: 'Success',
          description: 'Category added successfully',
          variant: 'default',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to add category',
        variant: 'destructive',
      })
      setAddcategoryLoding(false)
    }
  }
  const handleAddSubcategory = async () => {
    if (!newSubcategory) {
      toast({
        title: 'Error',
        description: 'Subcategory name is required',
        variant: 'destructive',
      })
      return
    }
    if (!selectedCategory) {
      toast({
        title: 'Error',
        description: 'Category is required please select one',
        variant: 'destructive',
      })
      return
    }
    setAddsubcategoryLoding(true)
    try {
      const response = await axios.post(`${apiUrl}/api/category/create-subcategory`,
        { categoryId: selectedCategory, name: newSubcategory })
      if (response.data.success) {
        setNewSubcategory('')
        fetchCategories()
        fetchAllCategories()
        setAddsubcategoryLoding(false)
        toast({
          title: 'Success',
          description: 'Subcategory added successfully',
          variant: 'default',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to add subcategory',
        variant: 'destructive',
      })
      setAddsubcategoryLoding(false)
    }
  }
  return (
    <div className='w-full'>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="newCategory">Category Name</Label>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
              />
            </div>
            {addcategoryLoding ?
              <Button disabled><Loader2 className='animate-spin' /></Button> :
              <Button disabled={addcategoryLoding} onClick={handleAddCategory}>Add Category</Button>}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Subcategory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
          <div>
      <Label htmlFor="categorySelect">Select Category</Label>
      <Select 
        onValueChange={(value) => {
          setSelectedCategory(value)}} 
        value={selectedCategory} 
      >
        <SelectTrigger id="categorySelect">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem key="none" disabled value="nil">
              No categories, create one
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="newSubcategory">Subcategory Name</Label>
                <Input
                  id="newSubcategory"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  placeholder="Enter new subcategory"
                />
              </div>
            {addsubcategoryLoding ?
              <Button disabled><Loader2 className='animate-spin'/></Button>:
              <Button disabled={addsubcategoryLoding} onClick={handleAddSubcategory}>Add Subcategory</Button>}
            </div>
          </div>
        </CardContent>
      </Card>
    <EditCategory categories={allcategories} fetchAllCategories={fetchAllCategories}/>
</div>
)}


export default CreateCategory

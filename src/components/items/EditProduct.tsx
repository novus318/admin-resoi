'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'
import DeleteItem from './DeleteItem'
import { useRouter } from 'next/navigation'

type Category = {
  _id: string
  name: string
  subcategories: string[]
}

const EditProduct = ({ Id }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router =useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [initialCategory, setInitialCategory] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    price: null
    image: File | null
    description: string
    ingredients: string[]
    category: string
    subcategory: string
  }>({
    name: '',
    price: null,
    image: null,
    description: '',
    ingredients: [''],
    category: '',
    subcategory: '',
  })

  useEffect(() => {
    if (Id) {
      fetchCategories()
      fetchItem()
    }
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/category/get-subcategories`)
      if (response.data.success) {
        setCategories(response.data.categories)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      })
    }
  }

  const fetchItem = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/item/get-item/${Id}`)
      if (response.data.success) {
        const item = response.data.item
        setFormData({
          name: item.name,
          price: item.price,
          image: null,
          description: item.description,
          ingredients: item.ingredients,
          category: item.category,
          subcategory: item.subcategory,
        })
        setPreviewImage(`${apiUrl}${item.image}`)
        setInitialCategory(item.category) // Store initial category for comparison
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch item details',
        variant: 'destructive',
      })
    }
  }


  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value, subcategory: '' }) // Reset subcategory if category changes
  }
  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleAddIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] })
  }

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = formData.ingredients.filter((_, i) => i !== index)
    setFormData({ ...formData, ingredients: updatedIngredients })
  }

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...formData.ingredients]
    updatedIngredients[index] = value
    setFormData({ ...formData, ingredients: updatedIngredients })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (formData.category !== initialCategory && !formData.subcategory) {
      toast({
        title: 'Validation Error',
        description: 'Please select a subcategory after changing the category',
        variant: 'destructive',
      })
      return
    }
    try {
      setLoading(true)
      const formDataObj = new FormData()
      formDataObj.append('name', formData.name)
      formDataObj.append('price', formData.price || '')
      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image)
      }
      formDataObj.append('description', formData.description)
      formDataObj.append('ingredients', JSON.stringify(formData.ingredients))
      formDataObj.append('category', formData.category)
      formDataObj.append('subcategory', formData.subcategory)

      const response = await axios.put(`${apiUrl}/api/item/edit-item/${Id}`, formDataObj)
      if (response.data.success) {
        setFormData({
          name: '',
          price: null,
          image: null,
          description: '',
          ingredients: [''],
          category: '',
          subcategory: '',
        })
        setPreviewImage(null)
        fetchCategories()
        router.push('/items')
        toast({
          title: 'Success',
          description: 'Item updated successfully',
          variant: 'default',
        })
        setLoading(false)
      }
    } catch (error: any) {
      setLoading(false)
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'An error occurred while creating the item',
        variant: 'destructive',
      })
    }
  }

  const subcategories = formData.category
    ? categories.find(cat => cat._id === formData.category)?.subcategories || []
    : []

  return (
    <>
      <div className='flex justify-between items-center'>
        <Button variant="default" onClick={() => window.history.back()} className="mb-4 md:mb-0 m-2">
          Go Back
        </Button>
        <DeleteItem Id={Id} />
      </div>
      <div className="flex flex-col md:flex-row min-h-screen p-2 md:p-8 justify-center">
        <div className="w-full md:w-5/6 bg-white">
          <div className="flex flex-col lg:flex-row justify-between mb-6 gap-4">
            <div className='max-w-2xl w-full'>
              <div className="p-4 bg-white rounded-lg border mx-auto lg:mx-0">
                <h2 className="text-2xl font-semibold mb-6 text-center lg:text-left">Edit Item</h2>
                <div className="space-y-4">
                  <Input
                    placeholder="Item Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <Input
                    placeholder="Price"
                    name="price"
                    value={formData.price || ''}
                    type="number"
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <div>
                    <Label htmlFor="categorySelect">Select Category</Label>
                    <Select
                      onValueChange={handleCategoryChange}
                      value={formData.category}
                    >
                      <SelectTrigger id="categorySelect">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategorySelect">Select Subcategory</Label>
                    <Select
                      onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                      value={formData.subcategory}
                      disabled={!formData.category}
                    >
                      <SelectTrigger id="subcategorySelect">
                        <SelectValue placeholder="Select a Subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.length > 0 ? (
                          subcategories.map((subcat: any) => (
                            <SelectItem key={subcat._id} value={subcat._id}>{subcat.name}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value='none' disabled>No subcategories found, create one</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  {previewImage && (
                    <div className="mb-4">
                      <img src={previewImage} alt="Item preview" className="w-1/3 rounded-lg" />
                    </div>
                  )}
                  <Input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  <div>
                    <h3 className="font-semibold mb-2">Ingredients</h3>
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Input
                          placeholder={`Ingredient ${index + 1}`}
                          value={ingredient}
                          onChange={(e) => handleIngredientChange(index, e.target.value)}
                          className="w-full"
                        />
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveIngredient(index)}
                          className="flex-shrink-0"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button size='sm' variant="outline" onClick={handleAddIngredient}>
                      Add Ingredient
                    </Button>
                  </div>
                  <Button onClick={handleSubmit} variant="default" className="w-full">
                    Save Item
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditProduct

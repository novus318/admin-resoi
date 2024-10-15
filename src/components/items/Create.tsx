'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import CreateCategory from './CreateCategory'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'

type Category = {
    _id: string
    name: string
    subcategories: string[]
}

const Create = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [categories, setCategories] = useState<Category[]>([])
  const [Loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: null,
    image: null,
    description: '',
    ingredients: [''],
    category: '',
    subcategory: '',
  })

  useEffect(() => {
    fetchCategories()
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

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e: any) => {
    setFormData({ ...formData, image: e.target.files[0] })
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

  const validate = () => {
    let isValid = true;

    if (!formData.name) {
      toast({
        title: "Please fill item name",
        variant: "destructive",
      });
      isValid = false;
    }
    if (!formData.price) {
      toast({
        title: "Please fill item price",
        variant: "destructive",
      });
      isValid = false;
    }
    if (!formData.description) {
      toast({
        title: "Please fill item description",
        variant: "destructive",
      });
      isValid = false;
    }
    if (!formData.category) {
      toast({
        title: "Please select a category",
        variant: "destructive",
      });
      isValid = false;
    }
    if ((formData.price||0) <= 0) {
      toast({
        title: "Please enter a positive price",
        variant: "destructive",
      });
      isValid = false;
    }
    if (!formData.image) {
      toast({
        title: "Please select an image",
        variant: "destructive",
      });
      isValid = false;
    }
    return isValid;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      if (!validate()) return;
      setLoading(true)
      const formDataObj = new FormData()
      formDataObj.append('name', formData.name)
      formDataObj.append('price', formData.price || '')
      formDataObj.append('image', formData?.image ? formData?.image as Blob : '')
      formDataObj.append('description', formData.description)
      formDataObj.append('ingredients', JSON.stringify(formData.ingredients))
      formDataObj.append('category', formData.category)
      formDataObj.append('subcategory', formData.subcategory)

      const response = await axios.post(`${apiUrl}/api/item/create-item`, formDataObj)
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
        fetchCategories()
        toast({
          title: 'Success',
          description: 'Item created successfully',
          variant: 'default',
        })
        setLoading(false)
      } 
    } catch (error:any) {
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
      <Button variant="default" onClick={() => window.history.back()} className="mb-4 md:mb-0 m-2">
        Go Back
      </Button>
      <div className="flex flex-col md:flex-row min-h-screen p-2 md:p-8 justify-center">
        <div className="w-full md:w-5/6 bg-white">
          <div className="flex flex-col lg:flex-row justify-between mb-6 gap-4">
            <div className='max-w-2xl w-full'>
              <div className="p-4 bg-white rounded-lg border mx-auto lg:mx-0">
                <h2 className="text-2xl font-semibold mb-6 text-center lg:text-left">New Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={formData.price||''}
                    type="number"
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <div>
                    <Label htmlFor="categorySelect">Select Category</Label>
                    <Select 
                      onValueChange={(value) => setFormData({ ...formData, category: value })} 
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
                  <Button type="submit" variant="default" className="w-full">
                    Save Item
                  </Button>
                </form>
              </div>
            </div>
            <CreateCategory allcategories={categories} fetchAllCategories={fetchCategories}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Create

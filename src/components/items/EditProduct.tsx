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
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [initialCategory, setInitialCategory] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    price: null
    offer:null,
    image: File | null
    description: string
    ingredients: string[]
    category: string
    subcategory: string
    variants: { name: string; price: number; isAvailable: boolean }[]
    isVeg: boolean
  }>({
    name: '',
    price: null,
    offer:null,
    image: null,
    description: '',
    ingredients: [''],
    category: '',
    subcategory: '',
    variants: [{ name: '', price: 0, isAvailable: true }],
    isVeg: false,
  })

  useEffect(() => {
    if (Id) {
      fetchCategories()
      fetchItem()
    }
  }, [Id])

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
          offer: item.offer,
          image: null,
          description: item.description,
          ingredients: item.ingredients,
          category: item.category,
          subcategory: item.subcategory,
          variants: item.variants || [{ name: '', price: 0, isAvailable: true }],
          isVeg: item.isVeg,
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

  const handleAddVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { name: '', price: 0, isAvailable: true }] })
  }

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants]
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }
    setFormData({ ...formData, variants: updatedVariants })
  }

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index)
    setFormData({ ...formData, variants: updatedVariants })
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
    if((formData.offer||0) < 0 || (formData.offer||0) > 100){
      toast({
        title: 'Validation Error',
        description: 'Offer must be between 0 and 100',
        variant: 'destructive',
      })
      return
    }
    try {
      setLoading(true)
      const formDataObj = new FormData()
      formDataObj.append('name', formData.name)
      formDataObj.append('price', formData.price || '')
      formDataObj.append('offer', formData.offer || '')
      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image)
      }
      formDataObj.append('description', formData.description)
      formDataObj.append('ingredients', JSON.stringify(formData.ingredients))
      formDataObj.append('category', formData.category)
     if(formData.subcategory){
      formDataObj.append('subcategory', formData.subcategory)
     }
      formDataObj.append('variants', JSON.stringify(formData.variants))
      formDataObj.append('isVeg', formData.isVeg.toString())

      const response = await axios.put(`${apiUrl}/api/item/edit-item/${Id}`, formDataObj)
      if (response.data.success) {
        setFormData({
          name: '',
          price: null,
          offer:null,
          image: null,
          description: '',
          ingredients: [''],
          category: '',
          subcategory: '',
          variants: [{ name: '', price: 0, isAvailable: true }],
          isVeg: false,
        })
        setPreviewImage(null)
        fetchCategories()
        router.push('/items')
        toast({
          title: 'Success',
          description: 'Item updated successfully',
          variant: 'default',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'An error occurred while updating the item',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
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
                  <div>
                    <Label>Item Name</Label>
                    <Input
                      placeholder="Item Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <Label>Item Price</Label>
                      <Input
                        placeholder="Price"
                        name="price"
                        onWheel={(e:any) => e.target.blur()}
                        value={formData.price || ''}
                        type="number"
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label>Item Offer</Label>
                      <Input
                        placeholder="Offer"
                        name="offer"
                        onWheel={(e:any) => e.target.blur()}
                        value={formData.offer || ''}
                        max={100}
                        type="number"
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
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
                  <div>
                    <h3 className="font-semibold mb-2">Variants</h3>
                    {formData.variants.map((variant, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Select
                          onValueChange={(value) => handleVariantChange(index, 'name', value)}
                          value={variant.name}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Variant Name ${index + 1}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quater">quater</SelectItem>
                            <SelectItem value="half">half</SelectItem>
                            <SelectItem value="3/4">3/4</SelectItem>
                            <SelectItem value="full">full</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Variant Price"
                          value={variant.price || ''}
                          onWheel={(e:any) => e.target.blur()}
                          type="number"
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="w-full"
                        />
                        <Select
                          onValueChange={(value) => handleVariantChange(index, 'isAvailable', value === 'true')}
                          value={variant.isAvailable.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Available?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveVariant(index)}
                          className="flex-shrink-0"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button size='sm' variant="outline" onClick={handleAddVariant}>
                      Add Variant
                    </Button>
                  </div>
                  <div>
                    <Label>
                      <input
                        type="checkbox"
                        checked={formData.isVeg}
                        onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      />
                      Vegetarian
                    </Label>
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

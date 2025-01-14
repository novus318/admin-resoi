'use client'
import React, { useEffect, useRef, useState } from 'react'
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
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: null,
        offer:null,
        image: null,
        description: '',
        ingredients: [''],
        category: '',
        subcategory: '',
        variants: [{ name: '', price: null, isAvailable: true }], // New field for variants
        isVeg: false, // New field for vegetarian status
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleVariantChange = (index: number, field: string, value: any) => {
        const updatedVariants:any = [...formData.variants]
        updatedVariants[index][field] = value
        setFormData({ ...formData, variants: updatedVariants })
    }

    const handleAddVariant = () => {
        setFormData({ ...formData, variants: [...formData.variants, { name: '', price: null, isAvailable: true }] })
    }

    const handleRemoveVariant = (index: number) => {
        const updatedVariants = formData.variants.filter((_, i) => i !== index)
        setFormData({ ...formData, variants: updatedVariants })
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
        if (!formData.price && formData.variants.length === 0 || formData.price && formData.variants.length > 0) {
            toast({
                title: "Please fill either item price or add variants, but not both",
                variant: "destructive",
            });
            isValid = false;
        }
        if((formData.offer||0) < 0 || (formData.offer||0) > 100){
            toast({
              title: 'Validation Error',
              description: 'Offer must be between 0 and 100',
              variant: 'destructive',
            })
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
        if (!formData.image) {
            toast({
                title: "Please select an image",
                variant: "destructive",
            });
            isValid = false;
        }

        // Validate variants
        for (const variant of formData.variants) {
            if (!variant.name) {
                toast({
                    title: "Please fill all variant names",
                    variant: "destructive",
                });
                isValid = false;
                break;
            }
            if ((variant.price || 0) <= 0) {
                toast({
                    title: "Please enter a positive price for all variants",
                    variant: "destructive",
                });
                isValid = false;
                break;
            }
        }
        return isValid;
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault()
        try {
            if (!validate()) return;
            setLoading(true)
            const formDataObj = new FormData()
            formDataObj.append('name', formData.name)
            formDataObj.append('price', formData.price || '')
            formDataObj.append('offer', formData.offer || '')
            formDataObj.append('image', formData?.image ? formData?.image as Blob : '')
            formDataObj.append('description', formData.description)
            formDataObj.append('ingredients', JSON.stringify(formData.ingredients))
            formDataObj.append('category', formData.category)
            formDataObj.append('subcategory', formData.subcategory)
            formDataObj.append('isVeg', formData.isVeg ? 'true' : 'false') // Add isVeg to the form data
            formDataObj.append('variants', JSON.stringify(formData.variants)) // Add variants to the form data

            const response = await axios.post(`${apiUrl}/api/item/create-item`, formDataObj)
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
                    variants: [{ name: '', price: null, isAvailable: true }],
                    isVeg: false, // Reset isVeg
                })
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clear the input value
                }
                fetchCategories()
                toast({
                    title: 'Success',
                    description: 'Item created successfully',
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
            <Button variant="default" onClick={() => window.history.back()} className="mb-4 md:mb-0 m-2">
                Go Back
            </Button>
            <div className="flex flex-col md:flex-row min-h-screen p-2 md:p-8 justify-center">
                <div className="w-full md:w-5/6 bg-white">
                    <div className="flex flex-col lg:flex-row justify-between mb-6 gap-4">
                        <div className='max-w-2xl w-full'>
                            <div className="p-4 bg-white rounded-lg border mx-auto lg:mx-0">
                                <h2 className="text-2xl font-semibold mb-6 text-center lg:text-left">New Item</h2>
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
                                        type="number"
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                   </div>
                              </div>
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
                                        ref={fileInputRef}
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
                                                        <SelectValue   placeholder={`Variant Name ${index + 1}`} />
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
                                                    type="number"
                                                    onWheel={(e:any) => e.target.blur()}
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
                        <CreateCategory allcategories={categories} fetchAllCategories={fetchCategories} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Create

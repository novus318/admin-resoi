import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowRight } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const EditCategory = ({ categories, fetchAllCategories }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [subCategoryName, setSubCategoryName] = useState<string>('');
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
  const [loadingSubCategoryId, setLoadingSubCategoryId] = useState<string | null>(null);

  const handleEditCategory = async (categoryId: string) => {
    setLoadingCategoryId(categoryId); // Set loading state
    try {
      const response = await axios.put(`${apiUrl}/api/category/edit-category/${categoryId}`, { name: categoryName });
      if (response.data.success) {
        fetchAllCategories();
        toast({
          title: 'Success',
          description: 'Category updated successfully',
          variant: 'default',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to update category',
        variant: 'destructive',
      });
    } finally {
      setLoadingCategoryId(null); // Reset loading state
      setEditingCategoryId(null);
      setCategoryName('');
    }
  };

  const handleEditSubCategory = async (subCategoryId: string) => {
    setLoadingSubCategoryId(subCategoryId); // Set loading state
    try {
      const response = await axios.put(`${apiUrl}/api/category/edit-subcategory/${subCategoryId}`, { name: subCategoryName });
      if (response.data.success) {
        fetchAllCategories();
        toast({
          title: 'Success',
          description: 'Subcategory updated successfully',
          variant: 'default',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to update subcategory',
        variant: 'destructive',
      });
    } finally {
      setLoadingSubCategoryId(null); // Reset loading state
      setEditingSubCategoryId(null);
      setSubCategoryName('');
    }
  };

  return (
    <>
      {categories && categories.length > 0 && (
        <div>
          <Card className="mb-2">
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-none">
                {categories.map((cat: any) => (
                  <li key={cat._id}>
                    {editingCategoryId === cat._id ? (
                      <div className="flex gap-2">
                        <Input
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                        />
                        <Button
                          onClick={() => handleEditCategory(cat._id)}
                          size='sm'
                          disabled={loadingCategoryId === cat._id} // Disable button when loading
                        >
                          {loadingCategoryId === cat._id ? 'Updating...' : 'Save'} {/* Loading indicator */}
                        </Button>
                        <Button
                          onClick={() => setEditingCategoryId(null)}
                          size='sm' variant='outline'
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <p
                        className="font-bold underline flex gap-1 items-center cursor-pointer"
                        onClick={() => {
                          setEditingCategoryId(cat._id);
                          setCategoryName(cat.name);
                        }}
                      >
                        <ArrowRight className="h-4" />
                        {cat.name}
                      </p>
                    )}

                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <ul className="ml-10 list-disc">
                        {cat.subcategories.map((subcat: any) => (
                          <li key={subcat._id}>
                            {editingSubCategoryId === subcat._id ? (
                              <div className="flex gap-2">
                                <Input 
                                  value={subCategoryName}
                                  onChange={(e) => setSubCategoryName(e.target.value)}
                                />
                                <Button
                                  onClick={() => handleEditSubCategory(subcat._id)}
                                  size='sm'
                                  disabled={loadingSubCategoryId === subcat._id}>
                                  {loadingSubCategoryId === subcat._id ? 'Updating...' : 'Save'}
                                </Button>
                                <Button
                                  onClick={() => setEditingSubCategoryId(null)}
                                  size='sm' variant='outline'
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <p
                                className="cursor-pointer"
                                onClick={() => {
                                  setEditingSubCategoryId(subcat._id);
                                  setSubCategoryName(subcat.name);
                                }}
                              >
                                {subcat.name}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default EditCategory;

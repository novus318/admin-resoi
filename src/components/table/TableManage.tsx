'use client'
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import Tablecard from './Tablecard';
import { Skeleton } from '../ui/skeleton';

const TableManage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [tableName, setTableName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [tables, setTables] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [categories, setCategories] = useState([]);

  const fetchTables = async () => {
    try {
      setLoadingData(true);
      const response = await axios.get(`${apiUrl}/api/table/get-tables`);
      setTables(response.data.tables);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to fetch tables',
        variant: 'destructive',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/category/get-categories`);
      if (response.data.success) {
        setCategories(
          response.data.categories.map((category: any) => ({
            value: category._id,
            label: category.name,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTablesAgain = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/table/get-tables`);
      setTables(response.data.tables);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to fetch tables',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchTables();
    fetchCategories();
  }, []);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if(selectedCategories < 1){
      toast({
        title: 'Error',
        description: 'Please select at least one category',
        variant: 'destructive',
      });
      return;
    }
    if (!tableName) {
      toast({
        title: 'Error',
        description: 'Table name is required',
        variant: 'destructive',
      });
      return;
      }
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/table/create-table`, {
        name: tableName,
        categories: selectedCategories,
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Table created successfully',
          variant: 'default',
        });
        setTableName('');
        setSelectedCategories([]);
        fetchTablesAgain();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to create table',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-2'>
      <form onSubmit={handleCreateTable} className="mb-4">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Table Name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            required
          />
          <Select
            isMulti
            options={categories}
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Select Categories"
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Table'}
          </Button>
        </div>
      </form>
      <div className="container mx-auto p-4">
        {loadingData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-40" />
            ))}
          </div>
        ) : (
          <>
            {tables.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tables.map((table: any, index: number) => (
                  <Tablecard key={table?._id} table={table} fetchTables={fetchTablesAgain} categories={categories} />
                ))}
              </div>
            ) : (
              <div className="text-center">No tables found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TableManage;

'use client'
import React, { useEffect, useState } from 'react';
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

   const fetchTables =async()=>{
    try{
      setLoadingData(true)
      const response = await axios.get(`${apiUrl}/api/table/get-tables`);
      setTables(response.data.tables);
    }catch(error:any){
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to fetch tables',
        variant: 'destructive',
      });
    }finally{
      setLoadingData(false);
    }
   }

   const fetchTablesAgain =async()=>{
    try{
      const response = await axios.get(`${apiUrl}/api/table/get-tables`);
      setTables(response.data.tables);
    }catch(error:any){
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to fetch tables',
        variant: 'destructive',
      });
    }
   }

   useEffect(()=>{
     fetchTables();
   },[]);
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${apiUrl}/api/table/create-table`, {
        name: tableName,
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Table created successfully',
          variant: 'default',
        });
        setTableName('');
        fetchTablesAgain()
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
    <div>
      <form onSubmit={handleCreateTable} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Table Name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            required
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
                <Tablecard key={table?._id} table={table} fetchTables={fetchTablesAgain} />
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

'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const TableSelection = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [tables, setTables] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(false);


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

      useEffect(() => {
        fetchTables();
      }, []);

  return (
    <div className='mx-2'>
    <h2 className="text-2xl font-sans font-semibold mb-6 text-gray-700">Select a Table</h2>
    <div className="grid grid-cols-2 gap-4 md:flex md:gap-6">
    <Button
        onClick={() => {
            window.location.href = `/waiter-order/parcel`
          }}
          variant='secondary'
          className="text-xl font-normal rounded-2xl  shadow-sm  transition-colors p-10 hover:bg-primary hover:border-2 border-dashed border-2 border-primary"
        >
          Parcel
        </Button>
      {tables.map((table) => (
        <Button
          key={table}
          onClick={() => {
            window.location.href = `/waiter-order/table/${table?._id}`
          }}
          variant='secondary'
          className="text-xl font-normal rounded-2xl  shadow-sm  transition-colors p-10 hover:bg-primary hover:border-2 border-dashed border-2 border-primary"
        >
          {table?.tableName}
        </Button>
      ))}
    </div>
  </div>
  )
}

export default TableSelection


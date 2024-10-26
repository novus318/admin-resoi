'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import Select from 'react-select';
import { toast } from '@/hooks/use-toast';
import { Input } from '../ui/input';

const Tablecard = ({ table, fetchTables,categories }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const qrValue = `${baseUrl}/table/${table?._id}`;
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTableName, setEditedTableName] = useState(table?.tableName || '');
  const [selectedCategories, setSelectedCategories] = useState<any>([]);

  useEffect(() => {
    // Pre-fill selected categories when editing starts
    if (isEditing) {
      const preSelected = table?.categories.map((category:any) => ({
        value: category.value,
        label: category.label,
      }));
      setSelectedCategories(preSelected || []);
    }
  }, [isEditing, table]);

  const downloadCard = (): void => {
    if (!cardRef.current) return; // Ensure cardRef is not null before proceeding

    setLoading(true);
    // Temporarily show the element to capture
    cardRef.current.classList.remove('hidden'); 

    html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      logging: true,
    })
      .then((canvas) => {
        // Create a downloadable link for the captured image
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `table-${table?.tableName || 'unknown'}.png`;
        link.click();
      })
      .catch((error: Error) => {
        console.error('Error capturing the card:', error);
      })
      .finally(() => {
        // Hide the card again after capturing it
        if (cardRef.current) {
          cardRef.current.classList.add('hidden'); // Use class to hide
        }
        setLoading(false);
      });
  };

  const handleUpdateTable = async () => {
    if (!editedTableName) {
      toast({
        title: 'Error',
        description: 'Table name is required',
        variant: 'default',
      });
      return;
      }

      if (!selectedCategories.length) {
        toast({
          title: 'Error',
          description: 'Please select at least one category',
          variant: 'default',
        });
      return;
      }
    setLoading(true);
    try {
      await axios.put(`${apiUrl}/api/table/update-table/${table._id}`, {
        tableName: editedTableName,
        categories: selectedCategories,
      });
      await fetchTables();
      toast({
        title: 'Success',
        description: 'Table updated successfully',
        variant: 'default',
      })
      setIsEditing(false);
    } catch (error:any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to update table',
        variant: 'destructive',
      })
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async () => {
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/table/delete-table/${table._id}`);
      fetchTables();
    } catch (error) {
      console.error('Failed to delete table', error);
    } finally {
      setLoading(false);
    }
  };
if(loading){
  return (
    <div className="w-full p-4 border rounded-md bg-primary-foreground animate-pulse h-[350px]">
    <div className="h-8 bg-orange-100 rounded mb-2" />
    <div className="flex justify-between mb-2">
      <div className="h-8 bg-orange-100 rounded w-1/3" />
      <div className="h-8 bg-orange-100 rounded w-1/3" />
    </div>
    <div className="h-48 bg-orange-100 rounded mb-4" />
  </div>
  )
}
  return (
    <div>
        <Card key={table?._id} className="w-full">
        <CardTitle className="text-2xl font-bold text-center">
          {isEditing ? (
            <Input
              value={editedTableName}
              onChange={(e) => setEditedTableName(e.target.value)}
              className="text-center"
            />
          ) : (
            table?.tableName
          )}
        </CardTitle>
        <CardContent className="flex flex-col items-center p-2">
          <div className="flex justify-between w-full px-5 mb-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleUpdateTable} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button size="sm" onClick={() => setIsEditing(false)} disabled={loading}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={() => setIsEditing(true)} disabled={loading}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={handleDeleteTable}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
              </>
            )}
          </div>
          {isEditing ? (
            <Select
              isMulti
              options={categories}
              value={selectedCategories}
              onChange={(selected) => setSelectedCategories(selected)}
              placeholder="Select Categories"
              className="w-full mb-2"
            />
          ) : (
            <div className="mb-2">
              {table?.categories.map((category:any) => (
                <span key={category.value} className="badge">
                  {category.label},
                </span>
              ))}
            </div>
          )}
          <div className="mb-4">
            <QRCodeCanvas value={qrValue} size={200} />
          </div>
          <div className="flex space-x-4">
            <Button onClick={downloadCard} disabled={loading}>
              {loading ? 'Downloading...' : 'Download QR'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div ref={cardRef} className='hidden w-[850px]'>
        <div
          className="grid justify-center p-4 bg-white"
          style={{
            backgroundImage: "url('/qrbg.svg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#fff',
            padding: '20px',
          }}
        >
          <p className="text-7xl font-extrabold text-center mb-10">
            Scan to <span>ORDER</span>
          </p>
          <div
            className='outline outline-primary p-5 rounded-xl mx-auto bg-white'
            style={{
              border:'solid #f97316 6px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <QRCodeCanvas value={qrValue} size={650}/>
          </div>
          <p className="my-2 text-6xl font-bold text-center">{table?.tableName}</p>
          <img src='/logo.svg' alt='logo' className='w-auto h-auto mx-auto mt-2' />
        </div>
      </div>
    </div>
  );
};

export default Tablecard;

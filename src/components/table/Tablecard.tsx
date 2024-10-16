'use client';
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';

const Tablecard = ({ table, fetchTables }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;
  const qrValue = `${baseUrl}/table/${table?._id}`;
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    setEditLoading(true);
    try {
      await axios.put(`/update-table/${table._id}`, {
        // Add the data you want to update here
        tableName: table?.tableName,
      });
      await fetchTables(); // Refresh the list after update
    } catch (error) {
      console.error('Failed to update table', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteTable = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/delete-table/${table._id}`);
      await fetchTables(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete table', error);
    } finally {
      setDeleteLoading(false);
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
            {table?.tableName}
          </CardTitle>
        <CardContent className="flex flex-col items-center p-2">
      <div className='flex justify-between w-full px-5 mb-2'>
      <Button size='sm' onClick={handleUpdateTable} disabled={editLoading}>
              {editLoading ? 'Updating...' : 'Edit'}
            </Button>
            <Button
            size='sm'
              onClick={handleDeleteTable}
              disabled={deleteLoading}
              variant="destructive"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
      </div>
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

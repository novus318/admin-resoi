'use client';
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

const Tablecard = ({ table, fetchTables }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;
  const qrValue = `${baseUrl}/table/${table?._id}`;

  const downloadCard = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, { scale: 2 }).then((canvas) => {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `table-${table?.tableName}.png`;
        link.click();
      });
    }
  };

  return (
    <div >
      <Card key={table?._id} className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {table?.tableName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-2">
          <div className="mb-4">
            <QRCodeCanvas value={qrValue} size={200} /> 
          </div>
          <Button onClick={downloadCard}>Download QR</Button>
        </CardContent>
      </Card>
      <div ref={cardRef} className='hidden w-[600px]'>
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
          <p className="text-6xl font-extrabold text-center mb-8">
            Scan to <span>ORDER</span>
          </p>
          <div
            className='outline outline-primary p-5 rounded-xl mx-auto bg-white'
            style={{
              border:'solid #f97316 6px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <QRCodeCanvas value={qrValue} size={450}/>
          </div>
          <p className="my-2 text-4xl font-bold text-center">{table?.tableName}</p>
          <img src='/logo.svg' alt='logo' className='w-auto h-auto mx-auto mt-2' />
        </div>
      </div>
    </div>
  );
};

export default Tablecard;

'use client';
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';

const Tablecard = ({ table, fetchTables }: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_APP_URL;
  const qrRef = useRef<HTMLDivElement>(null);
  const qrValue = `${baseUrl}/table/${table?._id}`;

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `table-${table?.tableName}.png`;
        link.click();
      }
    }
  };

  return (
    <Card key={table?._id} className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {table?.tableName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-2">
        <div ref={qrRef} className="mb-4">
          <QRCodeCanvas value={qrValue} size={200} /> {/* Display QR Code */}
        </div>
        <Button onClick={downloadQRCode}>Download QR Code</Button>
      </CardContent>
    </Card>
  );
};

export default Tablecard;

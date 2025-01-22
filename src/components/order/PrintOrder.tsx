import React from 'react';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';

const PrintOrder = ({ order }: any) => {
  const handlePrint = async () => {
    // Prepare the JSON data for printing
    const printData = [
      {
        type: 0, // Text
        content: `Order ID: ${order.orderId}`,
        bold: 1, // Bold
        align: 1, // Center
        format: 0, // Normal
      },
      {
        type: 0, // Text
        content: `User Type: ${order.userType}`,
        bold: 0, // Not bold
        align: 0, // Left
        format: 0, // Normal
      },
      {
        type: 0, // Text
        content: `Payment Status: ${order.paymentStatus}`,
        bold: 0, // Not bold
        align: 0, // Left
        format: 0, // Normal
      },
      {
        type: 0, // Text
        content: `Order Status: ${order.status}`,
        bold: 0, // Not bold
        align: 0, // Left
        format: 0, // Normal
      },
      {
        type: 0, // Text
        content: `Order Type: ${order.orderType}`,
        bold: 0, // Not bold
        align: 0, // Left
        format: 0, // Normal
      },
      {
        type: 0, // Text
        content: '--------------------------------',
        bold: 0, // Not bold
        align: 0, // Left
        format: 0, // Normal
      },
      {
        type: 0, // Text
        content: 'Cart Items:',
        bold: 1, // Bold
        align: 1, // Center
        format: 0, // Normal
      },
      ...order.cartItems.map((item: any) => ({
        type: 0, // Text
        content: `${item.name} (${item.variant}) - ${item.quantity} x ₹${item.price}`,
        bold: 0, // Not bold
        align: 0, // Left
        format: 0, // Normal
      })),
      {
        type: 0, // Text
        content: '--------------------------------',
        bold: 0, // Not bold
        align: 0, // Left
        format: 0, // Normal
      },
      {
        type: 0, // Text
        content: `Total Amount: ₹${order.totalAmount}`,
        bold: 1, // Bold
        align: 2, // Right
        format: 0, // Normal
      },
    ];

    // Convert the print data to JSON
    const jsonData = JSON.stringify(printData, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Open the Bluetooth Print app with the JSON data
    window.location.href = `my.bluetoothprint.scheme://${url}`;
  };

  return (
    <Button onClick={handlePrint}>
      <Printer />
      Print Order
    </Button>
  );
};

export default PrintOrder;
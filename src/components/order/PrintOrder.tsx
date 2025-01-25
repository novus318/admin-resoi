import React, { useState } from "react";
import { Button } from "../ui/button";
import { Printer } from "lucide-react";

const PrintOrder = ({ order }: any) => {
  const [message, setMessage] = useState(""); // State to manage success/error messages

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
        content: "--------------------------------",
        bold: 0, // Not bold
        align: 0, // Left
        format: 0, // Normal
      },
      {
        type: 0, // Text
        content: "Cart Items:",
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
        content: "--------------------------------",
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

    try {
      // Convert the print data to JSON
      const jsonData = JSON.stringify(printData);

      // Create a Blob with the JSON data
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create a URL for the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Construct the print URL using the Bluetooth Print app scheme
      const printUrl = `my.bluetoothprint.scheme://https://server.malabarresoi.in/api/online/get-online/ordersToday`;

      // Redirect to the print URL
      window.location.href = printUrl;

      // Display success message
      setMessage("Print request sent successfully!");
    } catch (error:any) {
      // Display error message
      setMessage(`Error sending print request: ${error.message}`);
    }
  };

  return (
    <div>
      <Button onClick={handlePrint}>
        <Printer />
        Print Order
      </Button>

      {/* Display success/error messages below the button */}
      {message && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: message.includes("Error") ? "#ffebee" : "#e8f5e9",
            color: message.includes("Error") ? "#c62828" : "#2e7d32",
            borderRadius: "5px",
            border: `1px solid ${
              message.includes("Error") ? "#c62828" : "#2e7d32"
            }`,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default PrintOrder;
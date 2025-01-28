import React, { useState } from "react";
import { Button } from "../ui/button";
import { Printer } from "lucide-react";

const PrintOrder = ({ order }: any) => {
  const [message, setMessage] = useState(""); // State to manage success/error messages

  const handlePrint = async () => {
    try {

      // Construct the print URL using the Bluetooth Print app scheme
      const printUrl = `my.bluetoothprint.scheme://https://server.malabarresoi.in/api/print/get-order/${order._id}`;

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
      <Button size='sm' onClick={handlePrint}>
        <Printer />
        Print Order
      </Button>

      {/* Display success/error messages below the button */}
      {message && (
        <div
          style={{
            marginTop: "5px",
            padding: "5px",
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


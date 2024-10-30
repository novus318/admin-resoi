'use client'
import AdminLayout from '@/components/AdminLayout';
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import React, { useEffect, useRef, useState } from 'react'
import CryptoJS from 'crypto-js';
import Spinner from '@/components/Spinner';
import RecentStoreOrders from '@/components/order/RecentStoreOrders';
import axios from 'axios';

const Orders = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const wsUrl:any = process.env.NEXT_PUBLIC_WS_URL;
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;
  const [orders, setOrders] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/tableOrder/get-store/ordersToday`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    const storedEncryptedRole: any = localStorage.getItem('userRole');
    if (storedEncryptedRole) {
      const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
      const decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
      setIsAdmin(decryptedRole === 'admin');
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();

    if (!wsRef.current) {
      // Only establish the WebSocket connection if it doesn't already exist
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const { type, order } = JSON.parse(event.data);
        if (type === 'tableOrder') {
          setOrders((prevOrders:any) => [...prevOrders, order]);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        setTimeout(() => {
          wsRef.current = null; // Reset ref before attempting to reconnect
          connectWebSocket();
        }, 5000); // Adjust delay as necessary
      };

      wsRef.current = ws; // Store the WebSocket instance in the ref
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close(); // Cleanup on unmount
        wsRef.current = null;
      }
    };
  }, []);

  const connectWebSocket = () => {
    if (!wsRef.current) {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
    }
  };
  if (loading) {
    return <Spinner />;
  }

  return isAdmin ? (
    <AdminLayout>
   <div className='p-2 md:p-6'>
   <RecentStoreOrders
        orders={orders} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
   </div>
    </AdminLayout>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Orders)

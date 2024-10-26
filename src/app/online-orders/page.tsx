'use client';
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import AdminLayout from '@/components/AdminLayout';
import Unauthorised from '@/components/Middleware/Unauthorised';
import { withAuth } from '@/components/Middleware/withAuth';
import Spinner from '@/components/Spinner';
import RecentOrders from '@/components/order/RecentOrders';
import axios from 'axios';

const Online = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const wsUrl:any = process.env.NEXT_PUBLIC_WS_URL;
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const encryptionKey: any = process.env.NEXT_PUBLIC_KEY;
  const [orders, setOrders] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Fetch initial orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/online/get-online/ordersToday`);
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

    const connectWebSocket = () => {
      const ws = new WebSocket(wsUrl); // Use the WebSocket URL from environment variables
      setSocket(ws);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const newOrder = JSON.parse(event.data);
        setOrders((prevOrders:any) => [...prevOrders, newOrder]);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        setTimeout(() => {
          connectWebSocket(); // Attempt to reconnect after a delay
        }, 5000); // Adjust delay as necessary
      };
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close(); // Cleanup on unmount
      }
    };
  }, [wsUrl]);

  if (loading) {
    return <Spinner />;
  }

  return isAdmin ? (
    <AdminLayout>
      <RecentOrders 
        orders={orders} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
    </AdminLayout>
  ) : (
    <Unauthorised />
  );
};

export default withAuth(Online);

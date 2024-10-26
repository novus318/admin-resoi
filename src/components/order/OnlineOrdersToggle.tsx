'use client'
import React, { useState, useEffect } from 'react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const OnlineOrdersToggle = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch initial status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/store/status`);
        if(response.data.success){
          setIsOnline(response.data.status === 'open');
        }
      } catch (error) {
        console.error('Error fetching store status', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  // Handle toggle switch
  const handleToggle = async () => {
    setUpdating(true);
    const newStatus = isOnline ? 'closed' : 'open';

    try {
      await axios.put(`${apiUrl}/api/store/status`, { status: newStatus });
      setIsOnline(!isOnline);
    } catch (error) {
      console.error('Error updating store status', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="online-toggle"
        checked={isOnline}
        onChange={handleToggle}
        onClick={handleToggle} // Add onClick as a backup in case onChange is not triggering
        disabled={updating}
      />
      {loading ? (
        <Loader2 className='animate-spin'/>
      ) : (
        <Label htmlFor="online-toggle">
          {updating ? 'Updating...' : 'Online orders'}
        </Label>
      )}
    </div>
  );
};

export default OnlineOrdersToggle;

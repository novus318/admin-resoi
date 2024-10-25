'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from 'next/link'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Input } from '../ui/input'
import { format } from 'date-fns'

const ListUsers = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      setLoadingData(true);
      const response = await axios.get(`${apiUrl}/api/user/get-users`);
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to fetch tables',
        variant: 'destructive',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.mobileNumber.includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setSelectAll(selectedUsers.length === filteredUsers.length && filteredUsers.length > 0);
  }, [selectedUsers, filteredUsers]);

  return (
    <Card className="w-full max-w-3xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>User List</CardTitle>
        <p className='text-sm font-bold text-muted-foreground'>
          Number of users: {loadingData ? <Loader2 className='animate-spin' /> : users.length}
        </p>
        <Input
          type="text"
          placeholder="Search by name or number"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full mt-2 border"
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                  />
                </TableCell>
                <TableCell className="p-2 text-gray-500">
                <p className='text-xs font-bold'> {format(new Date(user.createdAt), 'dd MMM yyyy')}</p>
                <span className='text-xs font-medium'> {format(new Date(user.createdAt), 'hh:mm a')}</span>
                </TableCell><TableCell>{user.name}</TableCell>
                <TableCell>+91 {user.mobileNumber}</TableCell>
                <TableCell>
                  <Link href={`/users/details/${user._id}`} className='underline'>view</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ListUsers;

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2,UserPlus } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'



const AddUsers = ({fetchUsers}:any) => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('waiter')
    const [isLoading, setIsLoading] = useState(false)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!name || !username || !password) {
        toast({
          title: "Error",
          description: "Please fill in all fields.",
          variant: "destructive",
        })
        return
      }
      setIsLoading(true)
try {
  const response = await axios.post(`${apiUrl}/api/auth/create/admin-user`,{
    name, role, username, password 
  })
if(response.data.success){
  toast({
    title: "User added successfully",
    description: `${name} has been added as a ${role}.`,
  })
  setName('')
  setUsername('')
  setPassword('')
  setRole('waiter')
  fetchUsers()
  setIsLoading(false)
}
} catch (error:any) {
  setIsLoading(false)
  toast({
    title: "Error",
    description: error?.response?.data?.message || error.message || "An error occurred while adding the user.",
    variant: "destructive",
  })
}
    }

  return (
    <Card className="w-[350px]">
    <CardHeader>
      <CardTitle className="text-2xl">Add New User</CardTitle>
      <CardDescription>Create a new waiter or delivery user</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="johndoe" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label>Role</Label>
            <RadioGroup defaultValue="waiter" onValueChange={(value) => setRole(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="waiter" id="waiter" />
                <Label htmlFor="waiter">Waiter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery">Delivery</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={() => {
        setName(''); setUsername(''); setPassword(''); setRole('waiter');
      }}>
        Clear
      </Button>
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="mr-2 h-4 w-4" />
        )}
        Add User
      </Button>
    </CardFooter>
  </Card>
  )
}

export default AddUsers

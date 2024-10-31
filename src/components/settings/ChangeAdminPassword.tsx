'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, RefreshCw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'

const ChangeAdminPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (newPassword !== confirmPassword) {
        toast({
          title: "Error",
          description: "New password and confirmation do not match.",
          variant: "destructive",
        })
        return
      }
      if (!newPassword) {
        toast({
          title: "Error",
          description: "Please enter a new password.",
          variant: "destructive",
        })
        return
      }
      setIsLoading(true)
    try {
      const response = await axios.put(`${apiUrl}/api/auth/update/password/roleAdmin`,{
     newPassword
      })
    if(response.data.success){
      toast({
        title: "Password changed successfully",
        description: "Your admin password has been updated.",
      })
      setNewPassword('')
      setConfirmPassword('')
      setIsLoading(false)
    }
    } catch (error:any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to change admin password.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
    }

  return (
    <Card className="w-[350px]">
    <CardHeader>
      <CardTitle className="text-2xl">Change Admin Password</CardTitle>
      <CardDescription>Update your admin account password</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={() => {
  setNewPassword(''); setConfirmPassword('');
      }}>
        Clear
      </Button>
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Lock className="mr-2 h-4 w-4" />
        )}
        Change Password
      </Button>
    </CardFooter>
  </Card>
  )
}

export default ChangeAdminPassword

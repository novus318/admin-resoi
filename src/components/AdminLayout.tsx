'use client'
import { Button } from '@/components/ui/button';
import { Book, LayoutDashboard, LogOut, LucideListOrdered, MenuIcon, Outdent, PlusSquareIcon, QrCode, Receipt, Settings, StoreIcon, User2, Users2, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useState } from 'react';
import CryptoJS from 'crypto-js'

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const encryptionKey:any = process.env.NEXT_PUBLIC_KEY;


    const CurrentPage = (path: string): boolean => {
      const pathname = usePathname()
      return pathname === path;
    };
    const handleLogout = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      router.push('/login');
    };
    const storedEncryptedRole:any = localStorage.getItem('userRole');
    let decryptedRole
// Decrypt the user role
if(storedEncryptedRole){
  const bytes = CryptoJS.AES.decrypt(storedEncryptedRole, encryptionKey);
 decryptedRole = bytes.toString(CryptoJS.enc.Utf8);
}

const isAdmin = decryptedRole === 'admin';
const isDelevery =decryptedRole === 'delivery'
const isWaiter =decryptedRole === 'waiter'
  return (
    <div>
      {/* Side panel */}
      <div className="flex">
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center p-1 w-full bg-secondary">
        <Link href="/">
        <img src='/logobell.svg' height={100} width={100} alt='' className='w-11'/>
        </Link>
        <Button  variant='default' onClick={() => setIsOpen(!isOpen)}
            size='icon' className="flex items-center rounded px-2  transition duration-300 ease-in-out transform hover:scale-105"
            >
         {isOpen ?  <X /> :  <MenuIcon />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-secondary-foreground text-primary-foreground p-4 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 md:w-1/5`}
      >
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <div className="flex items-center justify-center px-4">
              <img src='/logobell.svg' height={100} width={100} alt='' className='w-11'/>
            </div>
          </Link>
          <Button
          size='icon'
          onClick={handleLogout}
            className="flex items-center rounded px-2  transition duration-300 ease-in-out transform hover:scale-105"
          >
            <LogOut className="mr-1" />
          </Button>
        </div>
        <ul>
     {isAdmin  && <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <LayoutDashboard className="mr-3" />
                <span className="text-lg">Dashboard</span>
              </div>
            </Link>
          </li>}
          {isWaiter &&
          <>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <LucideListOrdered className="mr-3" />
                <span className="text-lg">Orders</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/waiter-order">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/waiter-order') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <PlusSquareIcon className="mr-3" />
                <span className="text-lg">Take Order</span>
              </div>
            </Link>
          </li></>}
          {isDelevery &&
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/online-orders') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <StoreIcon className="mr-3" />
                <span className="text-lg">Online orders</span>
              </div>
            </Link>
          </li>}
          {isAdmin && <>
            <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/orders">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/orders') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <LucideListOrdered className="mr-3" />
                <span className="text-lg">Orders</span>
              </div>
            </Link>
          </li>
            <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/online-orders">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/online-orders') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <StoreIcon className="mr-3" />
                <span className="text-lg">Online orders</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/users">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/users') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <User2 className="mr-3" />
                <span className="text-lg">Users</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/staffs">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/staffs') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <Users2 className="mr-3" />
                <span className="text-lg">Staff</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/table">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/table') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <QrCode className="mr-3" />
                <span className="text-lg">Table</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/items">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/items') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <Outdent className="mr-3" />
                <span className="text-lg">Items</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/expense">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/expense') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <Receipt className="mr-3" />
                <span className="text-lg">Expense</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/reports">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/reports') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <Book className="mr-3" />
                <span className="text-lg">Reports</span>
              </div>
            </Link>
          </li>
          <li className="mb-4 transition duration-300 ease-in-out transform hover:scale-105">
            <Link href="/settings">
              <div
                className={`flex items-center py-1 px-2 rounded-md  hover:bg-primary hover:text-primary-foreground  ${
                  CurrentPage('/settings') ? 'bg-secondary text-secondary-foreground': 'bg-primary text-primary-foreground'
                }`}
              >
                <Settings className="mr-3" />
                <span className="text-lg">Settings</span>
              </div>
            </Link>
          </li>
          </>}
        </ul>
      </div>

      {isOpen && <div className="fixed inset-0 bg-current opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </div>

      {/* Main content area */}
      <div className="ml-0 md:ml-[20%] w-full md:w-4/5">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;

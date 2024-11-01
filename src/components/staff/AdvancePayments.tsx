'use client'
import React from 'react'
import { Card,CardHeader,CardDescription,CardTitle,CardContent } from '@/components/ui/card'
import { Table,TableBody,TableCell,TableHeader,TableRow,TableHead } from '@/components/ui/table'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/currencyFormat'

const AdvancePayments = ({staff}:any) => {
  return (
    <div>
         <Card>
    <CardHeader>
      <CardTitle>Advance Transactions</CardTitle>
      <CardDescription>View and manage advance payments made to staff.</CardDescription>
    </CardHeader>
    <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Advance Amount</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff?.transactions?.map((detail:any) => (
          <TableRow
            key={detail?._id}
          >
            <TableCell>{format(new Date(detail?.date), 'yyyy-MM-dd')}</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>
              {detail?.type === 'Advance Payment' ? `- ${formatCurrency(detail?.amount)}` : formatCurrency(detail?.amount)}
            </TableCell>
            <TableCell>
              {detail?.type}
            </TableCell>
          </TableRow>
        ))}
        {staff?.transactions?.length === 0 && (
          <TableRow>
            <TableCell colSpan={3}>No transactions found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    </CardContent>
  </Card>
    </div>
  )
}

export default AdvancePayments

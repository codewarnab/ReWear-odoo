"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SwipeableTabs from "@/components/ui/swipable-tabs";
import { Transaction } from "@/lib/data/dashboard";
import { Grid3x3Icon, TableIcon } from "lucide-react";
import { useState } from "react";
import TransactionCard from "./TransactionCard";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants, tableRowVariants, buttonHoverProps, createStaggeredTransition } from "@/lib/animations";

interface TransactionsSectionProps {
  transactions: Transaction[];
}

const getStatusVariant = (status: string): "success" | "warning" | "info" | "purple" | "neutral" => {
  switch (status) {
    case 'Listed':
      return 'success';
    case 'Swapped':
      return 'purple';
    case 'Pending':
      return 'warning';
    case 'In Progress':
      return 'info';
    case 'Completed':
      return 'neutral';
    default:
      return 'neutral';
  }
};

export default function TransactionsSection({ transactions }: TransactionsSectionProps) {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const ongoingTransactions = transactions.filter(t => t.type === 'ongoing');
  const completedTransactions = transactions.filter(t => t.type === 'completed');

  const renderTableContent = (transactionList: Transaction[], emptyMessage: string) => (
    <motion.div
      key="table-view"
      className="overflow-x-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {transactionList.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Item</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Details</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactionList.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                className="border-b"
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
                transition={createStaggeredTransition(index)}
              >
                <td className="py-4 px-4">
                  {transaction.images && transaction.images.length > 0 ? (
                    <img
                      src={transaction.images[0]}
                      alt={transaction.itemTitle}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className={`w-12 h-12 ${transaction.bgColor} rounded-lg flex items-center justify-center`}>
                      <span className="text-2xl">{transaction.emoji}</span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-900">{transaction.itemTitle}</span>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={getStatusVariant(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <Button variant="link" size="sm" className="text-blue-600 p-0">
                    View Details
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      ) : (
        <motion.div
          className="text-center py-8 text-gray-500"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <p>{emptyMessage}</p>
        </motion.div>
      )}
    </motion.div>
  );

  const renderCardContent = (transactionList: Transaction[], emptyMessage: string) => (
    <motion.div
      key="grid-view"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {transactionList.length > 0 ? (
        transactionList.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={createStaggeredTransition(index)}
          >
            <TransactionCard transaction={transaction} />
          </motion.div>
        ))
      ) : (
        <motion.div
          className="col-span-full text-center py-8 text-gray-500"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <p>{emptyMessage}</p>
        </motion.div>
      )}
    </motion.div>
  );

  const tabs = [
    {
      label: "Ongoing",
      content: (
        <AnimatePresence mode="wait">
          {viewMode === 'table' 
            ? renderTableContent(ongoingTransactions, "No ongoing transactions yet.")
            : renderCardContent(ongoingTransactions, "No ongoing transactions yet.")
          }
        </AnimatePresence>
      )
    },
    {
      label: "Completed",
      content: (
        <AnimatePresence mode="wait">
          {viewMode === 'table'
            ? renderTableContent(completedTransactions, "No completed transactions yet.")
            : renderCardContent(completedTransactions, "No completed transactions yet.")
          }
        </AnimatePresence>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transactions</CardTitle>
          <div className="flex items-center gap-2">
            <motion.div {...buttonHoverProps}>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center gap-1.5">
                <TableIcon className="size-4" />
                Table
              </Button>
            </motion.div>
            <motion.div {...buttonHoverProps}>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-1.5">
                <Grid3x3Icon className="size-4" />
                Cards
              </Button>
            </motion.div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SwipeableTabs tabs={tabs} />
      </CardContent>
    </Card>
  );
} 
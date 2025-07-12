"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadedItem, getStatusColor } from "@/lib/data/dashboard";
import { Grid3x3Icon, TableIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ItemCard from "./ItemCard";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants, tableRowVariants, buttonHoverProps, createStaggeredTransition } from "@/lib/animations";

interface UploadedItemsOverviewProps {
  uploadedItems: UploadedItem[];
}

export default function UploadedItemsOverview({ uploadedItems }: UploadedItemsOverviewProps) {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const renderTableContent = () => (
    <motion.div
      key="table-view"
      className="overflow-x-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Item</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {uploadedItems.map((item, index) => (
            <motion.tr
              key={item.id}
              className="border-b"
              variants={tableRowVariants}
              initial="hidden"
              animate="visible"
              transition={createStaggeredTransition(index)}
            >
              <td className="py-4 px-4">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                )}
              </td>
              <td className="py-4 px-4">
                <span className="text-gray-900">{item.title}</span>
              </td>
              <td className="py-4 px-4">
                <Badge className={`rounded-md ${getStatusColor(item.status)}`}>
                  {item.status}
                </Badge>
              </td>
              <td className="py-4 px-4">
                <Link href={item.status === 'Swapped' ? `/swapped-item/${item.id}` : `/manage-item/${item.id}`}>
                  <Button variant="link" size="sm" className="text-blue-600 p-0">
                    {item.status === 'Swapped' ? 'View' : 'Manage'}
                  </Button>
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );

  const renderGridContent = () => (
    <motion.div
      key="grid-view"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {uploadedItems.map((item, index) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={createStaggeredTransition(index)}
        >
          <ItemCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-900">Items You've Listed</CardTitle>
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
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? renderTableContent() : renderGridContent()}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
} 
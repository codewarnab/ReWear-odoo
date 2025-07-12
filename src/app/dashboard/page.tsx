import { 
  Header, 
  ProfileSection, 
  UploadedItemsOverview, 
  TransactionsSection 
} from "@/components/dashboard";

import { 
  mockUserProfile, 
  mockUploadedItems, 
  mockTransactions 
} from "@/lib/data/dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <ProfileSection userProfile={mockUserProfile} />
        
        <UploadedItemsOverview uploadedItems={mockUploadedItems} />
        
        <TransactionsSection transactions={mockTransactions} />
      </main>
    </div>
  );
}

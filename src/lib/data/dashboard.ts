export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  pointsBalance: number;
}

export interface UploadedItem {
  id: string;
  title: string;
  emoji: string;
  status: 'Listed' | 'Swapped' | 'Pending';
  bgColor: string;
  images?: string[];
}

export interface DetailedItem extends UploadedItem {
  category: string;
  size: string;
  condition: string;
  listedDate: string;
  description?: string;
  isAvailable: boolean;
}

export interface SwapHistoryItem {
  id: string;
  date: string;
  type: 'Swap' | 'Redeemed';
  counterparty: string;
  status: 'Completed' | 'Cancelled' | 'Pending';
}

export interface Transaction {
  id: string;
  itemTitle: string;
  emoji: string;
  bgColor: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  type: 'ongoing' | 'completed';
  images?: string[];
}

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Sophia Carter',
  avatar: '/api/placeholder/64/64',
  pointsBalance: 1500,
};

export const mockUploadedItems: UploadedItem[] = [
  {
    id: '1',
    title: 'Floral Summer Dress',
    emoji: '👗',
    status: 'Listed',
    bgColor: 'bg-yellow-100',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '2',
    title: 'Classic Blue Jeans',
    emoji: '👖',
    status: 'Swapped',
    bgColor: 'bg-blue-100',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '3',
    title: 'Cozy Wool Sweater',
    emoji: '🧥',
    status: 'Listed',
    bgColor: 'bg-gray-100',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
    ],
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    itemTitle: 'Floral Summer Dress',
    emoji: '👗',
    bgColor: 'bg-yellow-100',
    status: 'In Progress',
    type: 'ongoing',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '2',
    itemTitle: 'Vintage Leather Jacket',
    emoji: '🧥',
    bgColor: 'bg-amber-100',
    status: 'In Progress',
    type: 'ongoing',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '3',
    itemTitle: 'Classic Blue Jeans',
    emoji: '👖',
    bgColor: 'bg-blue-100',
    status: 'Completed',
    type: 'completed',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '4',
    itemTitle: 'Cozy Wool Sweater',
    emoji: '🧥',
    bgColor: 'bg-gray-100',
    status: 'Completed',
    type: 'completed',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '5',
    itemTitle: 'Running Sneakers',
    emoji: '👟',
    bgColor: 'bg-green-100',
    status: 'Completed',
    type: 'completed',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop',
    ],
  },
];

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Listed':
      return 'bg-green-100 text-green-800';
    case 'Swapped':
      return 'bg-purple-100 text-purple-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 

// Mock data for detailed item management
export const mockDetailedItems: DetailedItem[] = [
  {
    id: '1',
    title: 'Floral Summer Dress',
    emoji: '👗',
    status: 'Listed',
    bgColor: 'bg-yellow-100',
    category: 'Dresses',
    size: 'Medium',
    condition: 'Excellent',
    listedDate: 'June 20, 2025',
    description: 'Beautiful floral print dress perfect for summer occasions.',
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '2',
    title: 'Classic Blue Jeans',
    emoji: '👖',
    status: 'Swapped',
    bgColor: 'bg-blue-100',
    category: 'Jeans',
    size: 'Large',
    condition: 'Good',
    listedDate: 'May 15, 2025',
    description: 'Comfortable classic blue jeans.',
    isAvailable: false,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '3',
    title: 'Cozy Wool Sweater',
    emoji: '🧥',
    status: 'Listed',
    bgColor: 'bg-gray-100',
    category: 'Sweaters',
    size: 'Small',
    condition: 'Very Good',
    listedDate: 'June 18, 2025',
    description: 'Warm and cozy wool sweater for cold weather.',
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
    ],
  },
];

export const mockSwapHistory: SwapHistoryItem[] = [
  {
    id: '1',
    date: 'June 15, 2025',
    type: 'Swap',
    counterparty: 'Emma Johnson',
    status: 'Completed',
  },
  {
    id: '2',
    date: 'May 20, 2025',
    type: 'Redeemed',
    counterparty: 'ReWear Store',
    status: 'Completed',
  },
];

export const getDetailedItemById = (id: string): DetailedItem | undefined => {
  return mockDetailedItems.find(item => item.id === id);
}; 
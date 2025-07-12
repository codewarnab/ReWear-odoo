CREATE TABLE users_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    location JSONB, -- Changed to JSONB for flexible location data
    phone TEXT,
    points_balance INTEGER DEFAULT 0,
    total_items_listed INTEGER DEFAULT 0,
    total_swaps_completed INTEGER DEFAULT 0,
    member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Single categories table (combining categories and types)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    emoji TEXT,
    parent_id UUID REFERENCES categories(id), -- For hierarchical structure if needed
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Clothing items table (with images as JSONB)
CREATE TABLE clothing_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    size TEXT,
    condition TEXT,
    brand TEXT,
    color TEXT,
    material TEXT,
    tags TEXT[],
    images JSONB, -- Images stored as JSONB array
    points_value INTEGER,
    exchange_preference TEXT DEFAULT 'both' CHECK (exchange_preference IN ('swap_only', 'points_only', 'both')),
    status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'listed', 'swapped', 'redeemed', 'removed')),
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approval_date TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users_profiles(id),
    rejection_reason TEXT,
    listed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Swap transactions table
CREATE TABLE swap_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES users_profiles(id) ON DELETE CASCADE,
    requester_item_id UUID REFERENCES clothing_items(id),
    owner_id UUID REFERENCES users_profiles(id) ON DELETE CASCADE,
    owner_item_id UUID REFERENCES clothing_items(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
    message TEXT,
    shipping_details_requester JSONB,
    shipping_details_owner JSONB,
    tracking_info_requester JSONB,
    tracking_info_owner JSONB,
    completion_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Point transactions table
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users_profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES clothing_items(id),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('redemption', 'earned', 'bonus', 'refund')),
    points_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User favorites table
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users_profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES clothing_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- 7. Admin actions table
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users_profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('approve_item', 'reject_item', 'remove_item', 'suspend_user')),
    target_type TEXT NOT NULL CHECK (target_type IN ('item', 'user', 'transaction')),
    target_id UUID NOT NULL,
    reason TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Reported items table
CREATE TABLE reported_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users_profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES clothing_items(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (reason IN ('inappropriate_content', 'fake_item', 'spam', 'other')),
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    reviewed_by UUID REFERENCES users_profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_clothing_items_owner_id ON clothing_items(owner_id);
CREATE INDEX idx_clothing_items_status ON clothing_items(status);
CREATE INDEX idx_clothing_items_category_id ON clothing_items(category_id);
CREATE INDEX idx_clothing_items_created_at ON clothing_items(created_at);
CREATE INDEX idx_clothing_items_images ON clothing_items USING GIN (images); -- GIN index for JSONB
CREATE INDEX idx_swap_transactions_requester_id ON swap_transactions(requester_id);
CREATE INDEX idx_swap_transactions_owner_id ON swap_transactions(owner_id);
CREATE INDEX idx_swap_transactions_status ON swap_transactions(status);
CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_item_id ON user_favorites(item_id);
CREATE INDEX idx_users_profiles_location ON users_profiles USING GIN (location); -- GIN index for location JSONB
# ReWear - Community Clothing Exchange

**🌐 Live Demo:** [https://rewear-main.vercel.app/](https://rewear-main.vercel.app/)

**📹 Video Demo:** [Watch the Demo](https://drive.google.com/file/d/1tVTGLqA6cuWhN7EIr_WND1DODuhUrId9/view?usp=sharing)

## Problem Statement 3

Develop ReWear, a web-based platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## Overview

ReWear is a Next.js-based community platform focused on sustainable fashion through clothing exchange. The platform allows users to swap clothes directly or use a point-based system to redeem items, promoting environmental consciousness and reducing textile waste.

## Features

### 🔐 User Authentication
- Email/password signup and login
- Secure session management

### 🏠 Landing Page
- Platform introduction and mission
- Call-to-action buttons: "Start Swapping", "Browse Items", "List an Item"
- Featured items carousel showcasing popular exchanges
- Sustainable fashion messaging

### 📊 User Dashboard
- Personal profile details and points balance
- Uploaded items overview with status tracking
- Ongoing and completed swaps history
- Transaction management

### 🔍 Item Detail Page
- Comprehensive image gallery
- Full item description with specifications
- Uploader information and ratings
- Interactive options: "Swap Request" or "Redeem via Points"
- Real-time availability status

### ➕ Add New Item Page
- Multi-image upload functionality
- Detailed item information form:
  - Title and description
  - Category and type classification
  - Size and condition assessment
  - Tags for better discoverability
- Item submission and listing process

### 👮 Admin Role
- Content moderation system
- Approve/reject item listings
- Remove inappropriate or spam content
- Lightweight admin panel for platform oversight
- User management capabilities

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **UI Components:** Custom component library
- **Package Manager:** pnpm
- **TypeScript:** Full type safety

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/codewarnab/skill-swap-oddo.git
cd skill-swap-oddo
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Supabase credentials and other environment variables
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── contexts/           # React context providers
```

## Key Features Implementation

- **Point System:** Users earn points for listing items and can redeem them for desired clothing
- **Direct Swaps:** Peer-to-peer clothing exchange without point involvement
- **Image Management:** Multi-image upload with optimization
- **Search & Filter:** Advanced filtering by category, size, condition, and location
- **User Ratings:** Community-driven trust system
- **Admin Moderation:** Content approval workflow

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Sustainability Impact

ReWear contributes to environmental sustainability by:
- Reducing textile waste in landfills
- Promoting circular economy in fashion
- Encouraging conscious consumption
- Building community around sustainable practices

---

Built with ❤️ for a more sustainable future

# Dashboard and Admin Dashboard Analysis

This document outlines the data requirements and suggested components for the User Dashboard and Admin Dashboard.

## Available UI Components

Here is a list of existing UI components that can be reused:

- `accordion.tsx`
- `aspect-ratio.tsx`
- `avatar.tsx`
- `badge.tsx`
- `breadcrumb.tsx`
- `button.tsx`
- `card.tsx`
- `carousel.tsx`
- `checkbox.tsx`
- `collapsible.tsx`
- `context-menu.tsx`
- `dialog.tsx`
- `drawer.tsx`
- `dropdown-menu.tsx`
- `fluid-tabs.tsx`
- `form.tsx`
- `input-otp.tsx`
- `input.tsx`
- `label.tsx`
- `location-picker.tsx`
- `menubar.tsx`
- `popover.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `sidebar.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `sonner.tsx` (for notifications)
- `table.tsx`
- `tabs.tsx`
- `tooltip.tsx`

## Available Dashboard-Specific Components

- `Header.tsx`
- `ItemCard.tsx`
- `ProfileSection.tsx`
- `TransactionCard.tsx`
- `TransactionsSection.tsx`
- `UploadedItemsOverview.tsx`

---

## User Dashboard (`/dashboard`)

The user dashboard provides an overview of the user's profile, their items, and their transaction history.

### Data Requirements and Component Suggestions

| Data Point | Description | Suggested Component(s) | Existing Component |
| --- | --- | --- | --- |
| **User Profile** | | | `ProfileSection.tsx` |
| User's Name | The full name of the user. | `CardTitle`, `p` | Yes |
| User's Profile Picture | The user's avatar. | `Avatar` | Yes |
| User's Location | The location of the user. | `p` with an icon | Yes |
| Profile completion status | A progress bar indicating profile completeness. | `Progress` or a similar custom component. | No |
| **Uploaded Items** | | | `UploadedItemsOverview.tsx` |
| List of Uploaded Items | A list of items the user has for swapping. | A `Carousel` of `ItemCard` components. | Yes |
| Item Image | Image of the item. | `AspectRatio` inside `Card` | Yes (`ItemCard.tsx`) |
| Item Title | Name of the item. | `CardTitle` | Yes (`ItemCard.tsx`) |
| Item Status | e.g., 'Available', 'In Transaction', 'Swapped'. | `Badge` | Yes (`ItemCard.tsx`) |
| **Transactions** | | | `TransactionsSection.tsx` |
| List of Transactions | History of swaps. | A list of `TransactionCard` components, potentially within `Tabs` for filtering. | Yes |
| Transaction Details | Details of a single swap. | `TransactionCard` | Yes |
| Transaction Status | e.g., 'Pending', 'Completed', 'Cancelled'. | `Badge` | Yes (`TransactionCard.tsx`) |
| Other User in Transaction | The other party in the swap. | `Avatar` and name. | Yes (`TransactionCard.tsx`) |

---

## Admin Dashboard (`/admin/dashboard`)

The admin dashboard is for moderating items uploaded by users and viewing site statistics.

### Data Requirements and Component Suggestions

| Data Point | Description | Suggested Component(s) | Existing Component |
| --- | --- | --- | --- |
| **Statistics** | | | |
| Pending Items Count | Number of items awaiting moderation. | `Card` with `CardTitle` and a large number display. | Yes |
| Approved Items Today Count | Number of items approved today. | `Card` with `CardTitle` and a large number display. | Yes |
| Rejected Items Today Count | Number of items rejected today. | `Card` with `CardTitle` and a large number display. | Yes |
| **Pending Listings** | | | |
| Table of Pending Items | A table to display all items needing moderation. | `Table` | Yes |
| Item Details (in table) | Column for item image, title. | `TableCell` with `Avatar` or `img`, and text. | Yes |
| Category (in table) | The category of the item. | `TableCell` with `Badge`. | Yes |
| Uploader (in table) | The user who uploaded the item. | `TableCell` with user's name (and maybe link to profile).| Yes |
| Price (in table) | The estimated price/value of the item. | `TableCell` with text. | Yes |
| Date Uploaded (in table) | The date the item was uploaded. | `TableCell` with text. | Yes |
| Moderation Actions | Buttons to approve or reject an item. | `TableCell` with `Button`s (Approve, Remove/Reject). | Yes | 
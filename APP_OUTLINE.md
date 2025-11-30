# Game & Expense Tracker - Complete App Outline

## Project Overview
A social finance app that combines expense splitting, game session tracking, friends/groups management, settlement system, and analytics. Built with React, Express.js, and in-memory storage using Neumorphism 2.0 design.

**Target Users**: Friends and gaming groups who want to split expenses and track game results fairly

---

## Core Features

### 1. **Expense Management**
- **Log Loans**: Split expenses with friends using equal or unequal distribution
- **1-Decimal Precision**: All amounts rounded to 1 decimal place (e.g., $42.5)
- **Category Support**: Restaurant, Shopping, Rent, Travel, Games, Other
- **Notes Support**: Add descriptions to transactions
- **Date Tracking**: Manual date selection for when transactions occurred
- **Group Splitting**: Split expenses among both individual friends and pre-defined groups

### 2. **Game Session Tracking**
- **Supported Games**: Poker, Mahjong, Blackjack
- **Score Recording**: Individual player scores for each game
- **Balance Validation**: Scores must balance (total = 0) before saving
- **Historical Records**: All games stored with date and player results

### 3. **Friends & Groups Management**
- **Individual Friends**: Add, view, and remove individual friends
- **Groups**: Create groups with multiple members (e.g., "Poker Night", "Roommates")
- **Avatars**: Each user has a unique avatar from DiceBear API
- **Balance Tracking**: Real-time balance calculation for each friend
  - Positive: They owe you money
  - Negative: You owe them money
  - Zero: Settled up

### 4. **Settlement System**
- **Settle Up**: Pay friends to clear debts or collect payments
- **Payment Transactions**: Recorded as "payment" type transactions
- **Balance Updates**: Automatic balance adjustment after settlement

### 5. **Analytics & Leaderboards**
- **Hall of Fame**: Ranked leaderboard of friends by balance (who won most money)
- **Trends**: 30-day balance trend chart
- **Achievements**: 
  - Biggest Winner (highest balance)
  - Win Streak (top player)
  - Most Played (most game sessions)
- **Filters**: By time period (week/month) and game type (all/poker/mahjong/blackjack)

---

## Pages & Navigation

### **1. Dashboard (Home)**
**Route**: `/` or `home`
**Bottom Nav Access**: Home tab

**Components**:
- Header with notifications
- Stat Cards (4 cards, 2x2 grid):
  - You Owe (total debts)
  - Owed to You (total credits)
  - Net Balance (overall position)
  - Last Game (most recent game name and result)
- Friends Section:
  - Horizontal scroll carousel of friend avatars
  - Sorted by balance magnitude
  - "View All" button to Friends page
- Recent Activity Section:
  - Last 5 transactions
  - "View All" button to Transaction History

**Interactions**:
- Click stat cards → Transaction History (filtered by type)
- Click friend avatar → Friend Detail page
- Click transaction item → Transaction Detail page
- Click "View All" under Friends → Friends page
- Click "View All" under Recent Activity → Transaction History (all)

**Floating Action Button**: "+" button with Log Loan and Log Game options

---

### **2. Log Loan**
**Route**: `log-loan`
**Purpose**: Record expense split with friends

**Form Fields**:
- Category selector (6 options with icons)
- Amount input (decimal support)
- Date picker
- Split type toggle (Equal / Unequal)
  - Equal: Auto-calculates per person
  - Unequal: Manual amount entry per person
- Participant selector:
  - Individual friends
  - Groups (selecting group auto-selects all members)
- Notes textarea
- Save button with validation

**Validation**:
- Amount must be > 0
- At least one participant selected
- For unequal splits: total must equal main amount ± 0.1

**On Save**:
- Creates transaction with type: "loan" or "expense"
- Updates all participant balances
- Returns to dashboard
- Shows success toast

---

### **3. Log Game**
**Route**: `log-game`
**Purpose**: Record game session results

**Form Fields**:
- Game type selector (Poker, Mahjong, Blackjack)
- Player score inputs (one per friend)
- Date (auto-set to today)

**Validation**:
- At least 2 players with non-zero scores
- Total score must equal 0 (balanced game)

**On Save**:
- Creates transaction with type: "game"
- Updates all player balances based on scores
- Returns to dashboard
- Shows success toast with game type and player count

---

### **4. Friends**
**Route**: `friends`
**Bottom Nav Access**: Friends tab

**Display**:
- List of all friends (sorted by balance magnitude)
- For each friend:
  - Avatar
  - Name
  - Balance display (with color: green if owed to you, red if you owe)
  - Quick action buttons: Call, Message, Delete

**Interactions**:
- Click friend card → Friend Detail page
- Click Call/Message → Console log (placeholder)
- Click Delete → Remove friend from app

**Floating Action Button**: Add Friend modal

---

### **5. Friend Detail**
**Route**: `friend-detail` (dynamic)
**Purpose**: View detailed friend information and shared history

**Header**:
- Back button
- "Friend Details" title

**Main Card**:
- Friend avatar (large, centered)
- Friend name
- Balance display with descriptive text:
  - Positive: "Owes you $X"
  - Negative: "You owe $X"
  - Zero: "Settled up"
- Action buttons: Call, Message, Delete

**Transaction History**:
- All transactions involving this friend
- Amount shows only this friend's portion
- Each transaction clickable to see full details

---

### **6. Transaction History**
**Route**: `transaction-history`
**Purpose**: View filtered or all transactions

**Header**:
- Back button
- Dynamic title based on filter (Loans, Expenses, Games, Payments, All Transactions)

**Display**:
- Scrollable list of transactions
- Filtered by type if accessed from stat card
- Shows all if accessed from "View All" button

**Interactions**:
- Click any transaction → Transaction Detail page

---

### **7. Transaction Detail**
**Route**: `transaction-detail` (dynamic)
**Purpose**: View complete transaction information

**Header**:
- Back button
- "Transaction Details" title

**Display**:
- Title with type badge
- Category or game type
- Date
- Total amount (if applicable)
- Notes (if present)

**Participants Section**:
- Card for each person involved
- Shows their name, avatar
- Shows their portion of the transaction (+ or -)

---

### **8. Analytics**
**Route**: `analytics`
**Bottom Nav Access**: Analytics tab

**Tabs**:

**Leaderboard Tab**:
- Filter badges:
  - Time: This Week, This Month
  - Game Type: All Games, Poker, Mahjong, Blackjack
- Hall of Fame section:
  - Ranked list of all friends by balance
  - Shows rank number, avatar, name, balance amount
- Achievements section:
  - Three cards showing:
    - Biggest Winner (name + amount)
    - Win Streak (name + streak count)
    - Most Played (name + game count)

**Trends Tab**:
- 30-day balance trend chart
- Area chart showing net balance over time
- Interactive tooltip on hover

---

### **9. Profile**
**Route**: `profile`
**Bottom Nav Access**: Profile tab

**Display**:
- User profile information
- Settings options
- Dark mode toggle (stored in localStorage)

**Interactions**:
- Toggle dark mode on/off

---

### **10. Not Found**
**Route**: Any undefined route
**Display**: 404 error page

---

## Data Models & Type Definitions

### **User**
```typescript
interface User {
  id: string;                    // Unique identifier (auto-generated)
  name: string;                  // User's name
  avatar: string;                // DiceBear avatar type
  balance: number;               // Current balance (1 decimal precision)
  isGroup?: boolean;             // True if this is a group
  members?: string[];            // Array of user IDs in group
}
```

**Sample Users**:
- Alex (individual, balance: +45.5)
- Sarah (individual, balance: -32.0)
- Mike (individual, balance: +120.0)
- Emma (individual, balance: -15.5)
- Chris (individual, balance: 0)
- Poker Night (group, members: [1, 2, 3])
- Roommates (group, members: [2, 4, 5])

### **Transaction**
```typescript
interface Transaction {
  id: string;                              // Unique identifier (auto-generated)
  type: 'loan' | 'expense' | 'game' | 'payment';  // Transaction type
  title: string;                           // Description
  category?: string;                       // For loan/expense (restaurant, shopping, etc.)
  date: string;                            // YYYY-MM-DD format
  totalAmount: number;                     // Total amount (1 decimal precision)
  involvedUsers: TransactionUser[];        // Array of user involvements
  notes?: string;                          // Optional description
  gameType?: 'poker' | 'mahjong' | 'blackjack';  // For games
}

interface TransactionUser {
  userId: string;                          // User ID
  amount: number;                          // Amount owed/owed to (can be negative)
}
```

**Sample Transactions**:
- Dinner at Olive Garden (loan, $85 split 2 ways)
- Poker Night (game, balanced scores)
- Grocery Shopping (expense, $120.5 split 3 ways)
- Settled up with Alex (payment, $20)
- Mahjong Session (game, varied scores)

---

## State Management

### **DataContext (React Context)**
**Purpose**: Centralized state for all app data

**State**:
- `currentUser`: The logged-in user ("You")
- `users`: Array of all users (friends and groups)
- `transactions`: Array of all transactions

**Functions**:
- `addUser()`: Create new friend/group
- `removeUser()`: Delete friend/group
- `addTransaction()`: Record transaction and update balances
- `removeTransaction()`: Delete transaction and reverse balance changes
- `settleUp()`: Create payment transaction
- `getBalance()`: Get specific user's balance
- `getTotalOwed()`: Sum of negative balances (you owe)
- `getTotalOwedToYou()`: Sum of positive balances (owed to you)
- `getNetBalance()`: Overall balance across all friends
- `getLastGame()`: Most recent game transaction

**Balance Calculation Logic**:
- When transaction added: Each involved user's balance updates by their amount in the transaction
- When transaction removed: Each involved user's balance reverts by their amount
- Rounding: All amounts use 1-decimal precision (Math.round(x * 10) / 10)

**Session State (App Component)**:
- `currentView`: Current page being displayed
- `activeTab`: Current bottom nav tab
- `isDarkMode`: Dark mode on/off (synced to localStorage)
- `selectedFriendId`: Friend selected for detail page
- `selectedTransactionId`: Transaction selected for detail page
- `transactionFilterType`: Current filter for transaction history

---

## UI Components Library

### **Custom Components**

**1. StatCard**
- Shows financial statistic with icon and value
- Accepts: type (owe/owed/net/game), amount, label, onClick
- Displays with neumorphic styling and colored glow
- Interactive on click

**2. FriendAvatar**
- Circular avatar image from DiceBear
- Shows friend name and balance
- Clickable to navigate to friend detail
- Neumorphic ring styling

**3. TransactionItem**
- Compact transaction display
- Shows type badge, title, date, amount, category icon
- Clickable to view transaction detail

**4. FloatingActionButton**
- "+" button with dropdown menu
- Options: Log Loan, Log Game
- Positioned at bottom-right
- Neumorphic styling with color glow

**5. BottomNavigation**
- 4-tab navigation bar: Home, Friends, Analytics, Profile
- Sticky at bottom
- Active tab shows pressed state
- Changes app view on tab click

**6. GameCard**
- Selectable card for choosing game type
- Shows game name and icon
- Neumorphic raised/pressed states

**7. LeaderboardItem**
- Displays ranked player
- Shows rank number, avatar, name, balance
- Highlight for top positions

**8. AchievementCard**
- Shows achievement stat (e.g., "Biggest Winner")
- Displays value and holder name
- Neumorphic card styling

**9. SettleUpModal**
- Modal for paying/collecting from friend
- Amount input
- Confirm/cancel buttons

**10. AddFriendModal**
- Modal for adding new friend
- Name input
- Avatar selector
- Confirm/cancel buttons

**11. AmountInput**
- Specialized input for currency amounts
- Keyboard triggers number pad
- 1-decimal precision support
- Clear button

### **Shadcn UI Components Used**
- Avatar & AvatarFallback
- Badge
- Button
- Card, CardContent, CardHeader, CardFooter
- Dialog & DialogContent
- Input
- Textarea
- Tabs, TabsContent, TabsList, TabsTrigger
- ScrollArea
- Checkbox
- Separator
- Tooltip & TooltipProvider
- Toaster (notifications)

---

## Design System: Neumorphism 2.0

### **Color Palette**

**Light Mode**:
- Background: #E8ECEF (soft gray)
- Foreground: #2D3748 (dark text)
- Primary: #14B8A6 (teal)
- Positive: #10B981 (green)
- Negative: #EF4444 (red)
- Game: #F59E0B (amber)
- Coral: #F78B78

**Dark Mode**:
- Background: #1A1D21 (deep charcoal)
- Foreground: #E2E8F0 (light text)
- Primary: Adjusted teal for contrast
- Colors adapted with higher saturation for visibility

### **Shadows (Dual Shadow Neumorphism)**

**Raised Elements** (Cards, Buttons, Raised Buttons):
- Light shadow from top-left
- Dark shadow from bottom-right
- Creates convex 3D appearance

**Pressed Elements** (Active buttons, inputs):
- Inset light and dark shadows
- Creates concave pushed-in appearance

**Smooth Transitions**: 200-300ms on interaction

### **Typography**
- Font: Spline Sans (Google Fonts)
- Hero text: 16-24px bold
- Headers: 18-20px semibold
- Body: 14-16px regular
- Muted: 12-14px, reduced opacity

### **Border Radius**
- Cards: rounded-2xl (16px)
- Buttons: rounded-xl (12px)
- Small elements: rounded-lg (8px)
- Perfect circles: w-full h-full (avatars)

### **Spacing**
- Padding: 12px, 16px, 20px, 24px
- Gaps: 8px, 12px, 16px, 24px
- Section spacing: 24px

### **Interactive States**
- **Hover**: Subtle elevation, shadow change
- **Active/Pressed**: Inset shadow, scale 0.98
- **Focus**: Accent color ring
- **Disabled**: Reduced opacity

---

## User Flows

### **Adding an Expense**
1. Home → Click "+" FAB → Select "Log Loan"
2. Select category
3. Enter amount
4. Select split type (Equal/Unequal)
5. Choose participants
6. Enter date and notes
7. Save → Balances update, return to home

### **Recording a Game**
1. Home → Click "+" FAB → Select "Log Game"
2. Select game type
3. Enter scores for each player
4. Verify balance (must = 0)
5. Save → Balances update, return to home

### **Settling with a Friend**
1. Home → Click friend avatar
2. On Friend Detail → Click action button (implied settle up)
3. Enter payment amount
4. Confirm → Payment transaction created, balance updates

### **Viewing Analytics**
1. Bottom Nav → Analytics tab
2. Choose Leaderboard or Trends
3. Apply filters if on Leaderboard
4. View results

### **Checking Detailed History**
1. Home → Click stat card
2. View filtered transactions
3. Click transaction → See details and participants
4. Back to return

---

## Technical Stack

### **Frontend**
- **Framework**: React 18
- **Routing**: Wouter
- **State**: React Context API
- **Data Fetching**: TanStack React Query (v5)
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Icons**: Lucide React, React Icons
- **Charts**: Recharts
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Avatars**: DiceBear API

### **Backend**
- **Framework**: Express.js
- **Language**: TypeScript
- **State Management**: In-memory storage (MemStorage)
- **Task Runner**: tsx

### **Development**
- **Build Tool**: Vite
- **Package Manager**: npm
- **TypeScript**: Full type safety

---

## API Routes (Backend)

### **Structure**
All routes are RESTful endpoints serving JSON

### **Loan/Expense Routes**
- `POST /api/loans` - Create loan
- `GET /api/loans` - Get all loans
- `DELETE /api/loans/:id` - Delete loan

### **Game Routes**
- `POST /api/games` - Create game
- `GET /api/games` - Get all games
- `DELETE /api/games/:id` - Delete game

### **User Routes**
- `POST /api/users` - Add user
- `GET /api/users` - Get all users
- `DELETE /api/users/:id` - Delete user

### **Settlement Routes**
- `POST /api/settle` - Create payment

### **Statistics Routes**
- `GET /api/stats/balance` - Get balance info
- `GET /api/stats/leaderboard` - Get ranked users

---

## Storage Interface

### **MemStorage Implementation**
Provides CRUD operations for:
- Users (create, read, delete, list)
- Transactions (create, read, delete, list by type)
- Balance calculations
- Game statistics

All data persists in memory during session

---

## Features Not Yet Implemented

1. **Backend Integration**: API endpoints stubbed, DataContext handles all logic
2. **Database Persistence**: Uses in-memory storage only
3. **User Authentication**: No login system
4. **Export/Import**: No data backup functionality
5. **Real Payments**: Settlement is recorded but not processed
6. **Social Features**: No sharing or invite system
7. **Push Notifications**: No notification system
8. **Recurring Expenses**: No subscription/recurring transactions
9. **Receipt Scanning**: No OCR for receipt upload
10. **Multi-language**: English only

---

## Accessibility Features

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators with accent colors
- Color contrast WCAG AA compliant
- High contrast in dark mode
- Form validation with clear error messages

---

## Performance Optimizations

- React Context for state (no unnecessary re-renders with proper memo)
- Lazy loading with React Router
- CSS-in-JS minimized (Tailwind used)
- No large dependencies
- In-memory storage (no network latency)

---

## Mobile Responsive Design

- Mobile-first approach
- Touch-friendly button sizes (48x48px minimum)
- Bottom navigation for thumb reach
- Vertical scrolling for most pages
- Horizontal scroll for friend carousel
- Responsive grid layouts

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript support
- CSS Grid and Flexbox support
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancement Ideas

1. **Multi-user Profiles**: Support multiple users per app
2. **Cloud Sync**: Sync across devices
3. **Settlement Automation**: Suggest optimal payoff order
4. **Photo Attachments**: Attach receipt photos to transactions
5. **Expense Categories Insights**: Spending breakdown by category
6. **Recurring Expenses**: Automatic monthly splits
7. **Social Sharing**: Share leaderboards with friends
8. **Currency Support**: Multiple currencies with conversion
9. **Expense Templates**: Saved split patterns for common expenses
10. **Advanced Analytics**: Trends, predictions, spending patterns

---

## Notes

- All data is demo/mock during development
- No real money transfers or payments
- Balances are for tracking purposes only
- This is a front-end heavy app - most logic is in React
- Backend API exists but is not yet integrated with frontend UI
- localStorage used for dark mode preference only

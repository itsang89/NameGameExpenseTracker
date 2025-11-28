# Design Guidelines: Game & Expense Tracker

## Design Approach
**Reference-Based Approach**: Drawing inspiration from social finance apps like Splitwise combined with playful gaming interfaces. The design prioritizes vibrant, cartoon-inspired aesthetics with a focus on clarity and quick interactions for mobile-web use.

## Core Design Principles
- **Playful Finance**: Balance serious financial tracking with fun, approachable visuals
- **Visual Hierarchy through Color**: Use color to communicate financial status immediately
- **Touch-Optimized**: Large interactive elements for mobile-first experience
- **Instant Feedback**: Clear visual states for all actions

## Typography
**Font Family**: Spline Sans (Google Fonts)

**Scale**:
- Hero Numbers: text-4xl to text-6xl (Amount displays, stat cards)
- Section Titles: text-2xl font-semibold
- Card Headers: text-lg font-medium
- Body Text: text-base
- Labels/Meta: text-sm text-gray-600

## Color System

**Status Colors**:
- Positive/Owed to You: #7ED321 (green-500)
- Negative/You Owe: #D0021B (red-600)
- Neutral/Net Balance: #4A90E2 (blue-500)

**Primary Actions**:
- General UI: #14B8A6 (teal-500)
- Financial Actions: #0df20d (bright green)
- Game Actions: #FBBF24 (yellow-400), #F78B78 (coral)

**Backgrounds**:
- Light Mode: #F8F9FA (gray-50)
- Cards: White with shadow-sm
- Dark Accents: #111827 (gray-900)

## Layout System

**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Card padding: p-6
- Section spacing: space-y-6
- Grid gaps: gap-4
- List item spacing: py-4

**Container Strategy**:
- Dashboard: Full-width with px-4 inner padding
- Modals: max-w-lg centered
- Detail Views: max-w-2xl

## Component Library

**Cards**:
- Border radius: rounded-2xl
- Background: bg-white
- Shadow: shadow-sm
- Padding: p-6

**Stat Cards** (Dashboard):
- Grid layout: grid-cols-2 gap-4
- Click-to-navigate functionality
- Icon + Label + Large Number + Status Color
- Status colors: Red (You Owe), Green (Owed), Blue (Net), Teal (Last Game)

**Avatars**:
- Source: DiceBear API for cartoon avatars
- Sizes: w-12 h-12 (list), w-16 h-16 (detail), w-24 h-24 (profile)
- Shape: rounded-full
- Winner Highlight: ring-4 ring-yellow-400 with crown icon overlay

**Friends Carousel**:
- Horizontal scroll: flex overflow-x-auto
- Winner gets gold border treatment
- Sorted by balance magnitude

**Inputs**:
- Amount Entry: text-6xl font-bold, borderless, focus:ring-2 focus:ring-teal-500
- Text Fields: border-b-2 border-gray-200, focus:border-teal-500
- Clean, minimal styling with prominent focus states

**Buttons**:
- Primary: bg-teal-500 text-white rounded-xl px-6 py-3 active:scale-95
- Destructive: bg-red-600 text-white
- Secondary: bg-gray-100 text-gray-700
- FAB: fixed bottom-20 right-4, w-14 h-14, rounded-full, shadow-lg

**Icons**:
- Library: Material Symbols (via CDN)
- Category Icons: Food (restaurant), Money (payments), Game (casino), Travel (flight), etc.
- Status Icons: Arrow indicators for debt direction

**Navigation**:
- Bottom Nav: Sticky, 5 icons (Home, Friends, Analytics, Profile, +)
- Active State: text-teal-500 with indicator dot
- Background: White with shadow-md

**Modals**:
- Entry: animate-fadeIn + animate-slideUp
- Overlay: bg-black/50
- Content: rounded-t-3xl (bottom sheet style)
- Close: X button top-right

**Transaction Lists**:
- Row structure: Avatar + [Title, Date, Amount]
- Amount color-coded by type
- Tap to view detail
- Icons indicate type (loan/game/payment)

**Game Selection Grid**:
- 3-column grid: grid-cols-3 gap-4
- Cards with game icons (Poker: ♠️, Mahjong: 🀄, Blackjack: 🂡)
- Active selection: ring-2 ring-teal-500

**Splitting Interface**:
- Toggle: Equal/Unequal with pill switch
- Participant rows with adjustable amounts
- Live total calculation display
- Validation: Red text for mismatches

**Charts** (Analytics):
- Library: Recharts
- Area charts for 30-day trends
- Color: Teal gradient fill
- Responsive: h-64

## Images
**No Hero Images**: This is a utility-focused mobile web app. All visual interest comes from:
- Cartoon avatars throughout
- Colorful stat cards
- Icon-based category selections
- Chart visualizations

**Avatar Strategy**: Heavy use of DiceBear cartoon avatars for personalization and visual warmth

## Animations
**Sparingly Applied**:
- Button press: active:scale-95
- Modal entry: Slide-up + fade-in
- Card tap: Brief scale feedback
- NO scroll animations or complex transitions

## Accessibility
- Color is supplemented with icons and text labels
- Touch targets minimum 44x44px
- Clear focus states on all interactive elements
- Balance amounts include directional context ("You owe" vs "Owes you")

This design creates a vibrant, approachable financial tool that feels more like a social app than accounting software, while maintaining clarity for serious money tracking.
# Design Guidelines: Game & Expense Tracker - Neumorphism 2.0

## Design Approach
**Neumorphism 2.0 Style**: Soft, tactile UI with elements that appear to extrude from or press into the background. Uses dual shadows (light + dark) to create depth while maintaining improved accessibility over classic neumorphism.

## Core Design Principles
- **Soft & Tactile**: Elements feel like soft clay or plastic, touchable and 3D
- **Monochromatic Base**: Off-white/off-black backgrounds with same-color elements
- **Dual Shadows**: Light source from top-left creates convex (raised) or concave (pressed) effects
- **Accent Colors Sparingly**: Bold colors only for important actions and status indicators
- **Improved Accessibility**: Strategic contrast for interactive elements

## Typography
**Font Family**: Spline Sans (Google Fonts)

**Scale**:
- Hero Numbers: text-4xl to text-6xl font-bold
- Section Titles: text-xl font-semibold
- Card Headers: text-lg font-medium
- Body Text: text-base
- Labels/Meta: text-sm text-muted-foreground

## Color System

### Base Colors (Monochromatic)
**Light Mode**:
- Background: #E8ECEF (soft gray)
- Surface: #E8ECEF (same as background)
- Foreground: #2D3748 (dark gray for text)

**Dark Mode**:
- Background: #1A1D21 (deep charcoal)
- Surface: #1A1D21 (same as background)
- Foreground: #E2E8F0 (light gray for text)

### Neumorphic Shadows
**Light Mode (Convex/Raised)**:
- Light shadow: -6px -6px 14px rgba(255, 255, 255, 0.7)
- Dark shadow: 6px 6px 14px rgba(166, 180, 200, 0.5)

**Light Mode (Concave/Pressed)**:
- Inset light: inset -3px -3px 7px rgba(255, 255, 255, 0.7)
- Inset dark: inset 3px 3px 7px rgba(166, 180, 200, 0.5)

**Dark Mode (Convex/Raised)**:
- Light shadow: -6px -6px 14px rgba(40, 44, 52, 0.5)
- Dark shadow: 6px 6px 14px rgba(0, 0, 0, 0.4)

**Dark Mode (Concave/Pressed)**:
- Inset light: inset -3px -3px 7px rgba(40, 44, 52, 0.5)
- Inset dark: inset 3px 3px 7px rgba(0, 0, 0, 0.4)

### Accent Colors (Used Sparingly)
- Primary/Teal: #14B8A6 - Main actions
- Positive/Green: #10B981 - Owed to you, wins
- Negative/Red: #EF4444 - You owe, losses
- Game/Amber: #F59E0B - Game-related
- Coral: #F78B78 - Secondary accent

## Layout System

**Spacing Units**: 4, 6, 8, 12, 16, 20, 24
- Card padding: p-5 to p-6
- Section spacing: space-y-6
- Grid gaps: gap-4 to gap-6
- Element gaps: gap-3

**Border Radius**: Large for soft feel
- Cards: rounded-2xl (16px)
- Buttons: rounded-xl (12px)
- Inputs: rounded-xl (12px)
- Small elements: rounded-lg (8px)

## Component Styling

### Neumorphic Cards (Raised)
```css
background: var(--neu-surface);
border-radius: 16px;
box-shadow: var(--neu-shadow-raised);
```

### Neumorphic Buttons (Raised → Pressed on click)
- Default: Raised shadow
- Hover: Slightly elevated
- Active/Pressed: Inset shadow (concave)

### Neumorphic Inputs (Concave/Inset)
```css
background: var(--neu-surface);
border-radius: 12px;
box-shadow: var(--neu-shadow-inset);
```

### Interactive States
- **Raised elements**: Cards, buttons, toggles in "off" state
- **Pressed elements**: Active buttons, toggles in "on" state, input fields
- **Flat elements**: Text, icons (no shadow)

## Component Library

### Stat Cards
- Raised neumorphic style
- Subtle colored glow for status indication
- Large rounded corners (rounded-2xl)
- Icon with soft colored background

### Avatars
- Raised circular elements
- Source: DiceBear API
- Neumorphic ring for winner highlight

### Friends Carousel
- Horizontal scroll with soft shadows
- Each avatar is a raised element

### Buttons
- Primary: Raised with teal accent color
- Secondary: Raised, monochromatic
- Ghost: Flat with hover elevation
- Active state: Pressed/inset shadow

### Navigation
- Bottom nav: Raised bar with pressed active state
- Active indicator: Pressed/inset style with accent color

### Modals
- Raised card style
- Soft overlay background
- Large border radius

### Inputs
- Inset/concave shadow (appears pressed into surface)
- Focus: Subtle accent glow
- Large border radius

### Toggle/Switch
- Track: Inset shadow
- Thumb: Raised shadow

### Charts
- Soft container with raised shadow
- Gradient fills with low opacity

## Animations
- **Button press**: Scale down slightly + shadow transition to inset
- **Card tap**: Subtle scale + shadow intensity change
- **Transitions**: 200-300ms ease for shadow changes

## Accessibility (Neumorphism 2.0 Improvements)
- Text maintains WCAG contrast ratios
- Interactive elements have clear focus states with accent color rings
- Status colors supplement shadows for visual hierarchy
- Active/inactive states clearly distinguishable
- Accent colors ensure CTAs stand out

## Images
**No Hero Images**: Visual interest comes from:
- 3D neumorphic depth effects
- Cartoon avatars (DiceBear)
- Soft colored accent glows
- Chart visualizations

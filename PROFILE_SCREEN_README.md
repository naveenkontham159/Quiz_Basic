# Profile Screen - Quiz App

## Overview
The Profile Screen is an elegant black-gold themed screen that displays user information and statistics in a premium, minimalist design.

## Features

### 🎨 Design Elements
- **Black Background**: Pure black (#000000) background for premium feel
- **Gold Accents**: Elegant gold (#CBA656) color for highlights and important elements
- **Serif Typography**: Premium serif font for the header title
- **Rounded Cards**: Modern card-based layout for statistics

### 👤 User Information
- **Avatar**: Circular placeholder with person icon
- **Editable Name**: Users can edit their display name with inline editing
- **User ID**: Unique identifier displayed in monospace font (e.g., #UXA294)

### 📊 Statistics Section
Three main statistics displayed in elegant card format:

1. **Games Played**
   - Icon: Game controller
   - Shows total number of quizzes completed
   - Current value: 47

2. **Average Accuracy**
   - Icon: Analytics chart
   - Shows percentage of correct answers across all games
   - Current value: 78.5%

3. **Best Score**
   - Icon: Trophy
   - Shows highest score achieved
   - Current value: 95%

### 🎯 Interactive Features
- **Name Editing**: Tap the pencil icon to edit username
- **Inline Editing**: Edit name directly with save/cancel options
- **Validation**: Prevents empty names
- **Bottom Navigation**: Integrated with app's bottom navbar

### 🎨 UI Components
- **Header**: Centered gold title with elegant typography
- **Avatar Section**: Circular user avatar with gold border and shadow
- **Stats Cards**: Dark cards with gold accents and icons
- **Edit Controls**: Intuitive save/cancel buttons during name editing

### 📱 Navigation
- Accessible via bottom navbar "Profile" tab
- No back button needed - uses bottom navigation for all screen transitions
- Maintains active tab state

### 🔧 Technical Details
- Built with React Native CLI
- Uses react-native-vector-icons for icons
- Responsive design with Flexbox
- TypeScript implementation
- Integrated with existing app navigation system

## Usage
Users can access the Profile Screen by tapping the Profile icon in the bottom navigation bar. The screen provides a comprehensive view of their quiz performance and allows for basic profile customization.
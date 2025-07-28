# Quiz Screen - Dark Elegant Gameplay

## 🎯 Overview
A sophisticated quiz gameplay screen that maintains the luxury dark theme with:
- Deep black background with gold accents
- Large serif question typography in white/gold
- Elegant multiple-choice answer options
- Interactive progress tracking and timer
- Smooth navigation and completion flow

## 📱 Features Implemented

### 1. **Header Section**
- **Exit Button**: Gold-accented close icon with confirmation dialog
- **Category & Mode Info**: Selected category and mode display
- **Timer**: Real-time countdown for timed modes (Quick/Timed)
- **Clean Layout**: Centered information with proper spacing

### 2. **Progress Tracking**
- **Progress Bar**: Gold-filled progress indicator
- **Question Counter**: "X of Y" format with elegant typography
- **Visual Feedback**: Clear indication of quiz completion status

### 3. **Question Display**
- **Question Number**: Gold-accented question indicator
- **Question Text**: Large serif typography (24px) in white
- **Centered Layout**: Elegant spacing and alignment
- **Scrollable Content**: Handles long questions gracefully

### 4. **Answer Options**
- **Multiple Choice**: A, B, C, D lettered options
- **Interactive Cards**: Dark gray cards with gold selection states
- **Visual Feedback**: Glowing gold shadows on selected answers
- **Letter Indicators**: Circular badges with option letters
- **Smooth Animations**: Elegant selection transitions

### 5. **Navigation Controls**
- **Previous Button**: Navigate to previous questions
- **Next Button**: Move forward through quiz
- **Submit Button**: Complete quiz on final question
- **Smart States**: Disabled states for first/last questions

### 6. **Timer System**
- **Mode-Based Timing**: 
  - Quick: 10 questions × 30 seconds each
  - Timed: 20 questions × 45 seconds each
  - Classic: No time limit
- **Real-Time Display**: MM:SS format countdown
- **Auto-Submit**: Automatic completion when time expires

## 🎨 Design Elements

### Color Scheme
- **Background**: Deep Black (#000000)
- **Question Cards**: Dark Gray (#1A1A1A)
- **Selected Options**: Gold-tinted (#CBA656 with transparency)
- **Text**: White (#FFFFFF) for questions, Gold (#CBA656) for accents
- **Progress**: Gold (#CBA656) fill on dark background

### Typography Hierarchy
- **Question Text**: 24px serif, weight 300, white (elegant and readable)
- **Option Text**: 16px, white with proper line height
- **Navigation**: 16px, weight 600, gold for buttons
- **Headers**: 16px category, 12px mode info
- **Timer**: 14px, weight 600, gold

### Interactive Elements
- **Answer Selection**: 
  - Default: Dark gray (#1A1A1A) with subtle borders
  - Selected: Gold-tinted background with glowing shadow
  - Letter badges: Circular indicators with A/B/C/D
- **Navigation Buttons**:
  - Previous/Next: Gold outline style
  - Submit: Gold-filled with black text
  - Disabled: Muted gray appearance

### Animation & Feedback
- **Selection Animation**: Smooth transition to selected state
- **Shadow Effects**: Gold glowing shadows on selected options
- **Button States**: Active/disabled visual feedback
- **Progress Animation**: Smooth progress bar updates

## 🔧 Technical Implementation

### Component Structure
```
QuizScreen.tsx
├── Header (Exit + Category/Mode + Timer)
├── Progress Bar (Visual progress + counter)
├── ScrollView Content
│   ├── Question Container
│   │   ├── Question Number
│   │   └── Question Text
│   └── Options Container
│       └── Answer Option Cards
└── Navigation (Previous + Next/Submit)
```

### Props Interface
```typescript
interface QuizScreenProps {
  onExit: () => void;
  onComplete: (score: number, answers: number[]) => void;
  selectedCategory: { title: string; subtitle: string };
  selectedMode: { title: string; questions: number; duration?: string };
}
```

### Question Data Structure
```typescript
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}
```

### State Management
- **Current Question**: Track active question index
- **Selected Answers**: Array of user selections
- **Timer State**: Countdown and active status
- **Progress Calculation**: Real-time completion percentage

## 🎯 User Experience Features

### 1. **Intuitive Navigation**
- Clear Previous/Next button states
- Smart Submit button on final question
- Exit confirmation to prevent accidental loss
- Smooth question transitions

### 2. **Visual Clarity**
- High contrast text for readability
- Clear selection states with gold highlighting
- Progress indication at all times
- Consistent spacing and alignment

### 3. **Accessibility Features**
- Large touch targets for answer options
- Clear visual feedback on selection
- Readable typography with proper sizing
- Color contrast compliance

### 4. **Performance Optimizations**
- Efficient state management
- Smooth animations with native driver
- Optimized re-rendering
- Memory-efficient timer implementation

## 🚀 Quiz Flow Experience

### Complete User Journey
1. **Entry**: User selects mode from previous screen
2. **Initialization**: Timer starts (if applicable), progress resets
3. **Question Display**: First question loads with options
4. **Answer Selection**: User taps option, visual feedback provided
5. **Navigation**: Previous/Next buttons for question movement
6. **Progress Tracking**: Visual progress bar updates
7. **Completion**: Submit button on final question
8. **Exit Options**: Confirmation dialog for early exit

### Timer Behavior
- **Quick Mode**: 5-minute total (30 seconds per question)
- **Timed Mode**: 15-minute total (45 seconds per question)
- **Classic Mode**: No time pressure
- **Auto-Submit**: Quiz completes when timer reaches zero

### Answer Management
- **Selection Persistence**: Answers saved when navigating
- **Visual States**: Clear selected/unselected indicators
- **Multiple Attempts**: Can change answers before submission
- **Score Calculation**: Automatic scoring on completion

## 🎨 Luxury Design Features

### Premium Visual Elements
- **Elegant Typography**: Serif fonts for sophistication
- **Gold Accent System**: Consistent luxury color scheme
- **Soft Shadows**: Subtle depth effects throughout
- **Generous Spacing**: Premium white space usage

### Interactive Polish
- **Smooth Transitions**: Fluid state changes
- **Visual Feedback**: Immediate response to interactions
- **Professional Animations**: Subtle but effective
- **Consistent Theming**: Maintains dark luxury aesthetic

### Attention to Detail
- **Progress Visualization**: Clear completion indication
- **Timer Integration**: Seamless time management
- **Exit Handling**: Thoughtful user protection
- **State Persistence**: Maintains user progress

## 🔮 Sample Questions Included

The screen includes 5 sample questions covering:
1. **Geography**: Capital of France
2. **Astronomy**: Red Planet identification
3. **Art History**: Mona Lisa painter
4. **Geography**: Largest ocean
5. **History**: World War II end date

Each question includes:
- Multiple choice options (A, B, C, D)
- Correct answer tracking
- Optional explanations for learning

## 📊 Completion & Scoring

### Quiz Completion
- **Score Calculation**: Automatic correct answer counting
- **Results Handling**: Score and answers passed to completion handler
- **Navigation**: Returns to home screen (ready for results screen)
- **Data Persistence**: User selections maintained throughout

### Ready for Enhancement
- Results screen integration
- Detailed explanations display
- Performance analytics
- Achievement system
- Question bank expansion

The quiz screen successfully delivers an engaging, elegant gameplay experience that maintains the luxury aesthetic while providing intuitive, accessible quiz functionality.
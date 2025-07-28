# Quiz Basic - React Native Quiz Application

A luxurious dark-themed quiz application built with React Native CLI, featuring elegant gold accents, sophisticated typography, and smooth user experience. The app provides a premium quiz-taking experience with multiple categories and game modes.

## 🎯 App Features

- **Dark Luxury Theme**: Deep black backgrounds with gold accents
- **Multiple Quiz Categories**: General Knowledge, IQ & Logic, Entertainment, Sports, Science & Tech, History
- **Three Quiz Modes**: Quick Mode (10 questions), Timed Mode (20 questions), Classic Mode (30 questions)
- **Elegant Navigation**: Top and bottom navigation bars with smooth transitions
- **Interactive Gameplay**: Real-time timer, progress tracking, and answer selection feedback
- **Premium UI Design**: Sophisticated typography, shadows, and animations

## 📱 App Screens

- **Home Screen**: Main hub with navigation and statistics
- **Categories Screen**: Six quiz categories with search functionality
- **Quiz Mode Screen**: Three modes with animations and duration info
- **Quiz Screen**: Interactive gameplay with timer and navigation
- **Results Screen**: Score display and performance analytics (ready for enhancement)

## 🚀 Getting Started

This is a [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/naveenkontham159/Quiz_Basic.git
cd Quiz_Basic
```

2. Install dependencies:
```bash
npm install
```

3. For iOS (macOS only), install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

## 🏃‍♂️ Running the App

### Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```bash
# Using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

#### Android

```bash
# Using npm
npm run android

# OR using Yarn
yarn android
```

#### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```bash
bundle install
```

Then, and every time you update your native dependencies, run:

```bash
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```bash
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

## 🔧 Building APK

To build a standalone APK for Android:

```bash
# Navigate to android directory
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease
```

The APK will be generated in `android/app/build/outputs/apk/debug/` or `android/app/build/outputs/apk/release/`

## 📁 Project Structure

```
Quiz_Basic/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx (Top navigation)
│   │   ├── BottomNavbar.tsx (Bottom navigation)
│   │   └── PlayButton.tsx (Main CTA button)
│   ├── screens/
│   │   ├── HomeScreen.tsx (Main hub)
│   │   ├── CategoriesScreen.tsx (Topic selection)
│   │   ├── QuizModeScreen.tsx (Mode selection)
│   │   ├── QuizScreen.tsx (Gameplay)
│   │   └── ResultsScreen.tsx (Score display)
│   └── services/
│       ├── quizService.ts (Quiz logic)
│       └── userDataService.ts (User data management)
├── android/ (Android configuration)
├── ios/ (iOS configuration)
└── Documentation files
```

## 🎨 Design System

### Color Palette
- Primary Background: #000000 (Deep Black)
- Secondary Background: #1A1A1A (Charcoal)
- Card Background: #F8F8F8 / #FAFAFA (Light Gray)
- Primary Gold: #CBA656 (Warm Gold)
- Highlight Gold: #FFD700 (Bright Gold)
- Text White: #FFFFFF (Pure White)

### Typography
- App Title: 48px serif, weight 300, gold
- Section Headers: 24px serif, weight 300, gold
- Question Text: 24px serif, weight 300, white
- Button Text: 16-22px, weight 600, gold/black

## 🔧 Technical Stack

- **React Native CLI**: Native performance and capabilities
- **TypeScript**: Full type safety throughout
- **react-native-vector-icons**: Ionicons for elegant icons
- **react-native-linear-gradient**: Gold gradient effects

## 📚 Documentation

For detailed information about each screen and component, check out these documentation files:

- [APP_OVERVIEW_README.md](./APP_OVERVIEW_README.md) - Complete app overview
- [HOME_SCREEN_README.md](./HOME_SCREEN_README.md) - Home screen details
- [CATEGORIES_SCREEN_README.md](./CATEGORIES_SCREEN_README.md) - Categories screen
- [QUIZ_MODE_SCREEN_README.md](./QUIZ_MODE_SCREEN_README.md) - Quiz mode selection
- [QUIZ_SCREEN_README.md](./QUIZ_SCREEN_README.md) - Gameplay screen
- [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) - Database integration

## 🚀 Ready for Enhancement

- **Results Screen**: Score display and performance analytics
- **Question Database**: Dynamic question loading from API
- **User Profiles**: Authentication and progress tracking
- **Leaderboards**: Social features and competition
- **Settings**: Theme customization and preferences
- **Achievements**: Gamification and rewards system

## 🐛 Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

### Common Issues

1. **Metro bundler issues**: Try `npx react-native start --reset-cache`
2. **Android build issues**: Clean and rebuild with `cd android && ./gradlew clean && cd ..`
3. **iOS build issues**: Clean build folder in Xcode or run `cd ios && xcodebuild clean && cd ..`

## 📖 Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created by [naveenkontham159](https://github.com/naveenkontham159)

---

**Quiz Basic** - A premium quiz experience that combines elegant design with smooth functionality! 🎯✨
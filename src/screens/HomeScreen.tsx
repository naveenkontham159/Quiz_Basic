import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import PlayButton from '../components/PlayButton';
import BottomNavbar from '../components/BottomNavbar';
import CategoriesScreen from './CategoriesScreen';
import QuizModeScreen from './QuizModeScreen';
import QuizScreen from './QuizScreen';
import ResultsScreen from './ResultsScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import { getHomeScreenStats, saveQuizResult, UserProfile } from '../services/userDataService';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedMode, setSelectedMode] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    answers: (number | null)[];
    questions: any[];
  } | null>(null);
  const [homeStats, setHomeStats] = useState({
    quizzesPlayed: 0,
    bestScore: 0,
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load stats when component mounts or when returning to home
  useEffect(() => {
    loadHomeStats();
  }, []);

  // Reload stats when returning to home screen
  useEffect(() => {
    if (currentScreen === 'home') {
      loadHomeStats();
    }
  }, [currentScreen]);

  const loadHomeStats = async () => {
    try {
      const stats = await getHomeScreenStats();
      setHomeStats(stats);
    } catch (error) {
      console.error('Error loading home stats:', error);
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    // Handle navigation logic here
    if (tab === 'Profile') {
      setCurrentScreen('profile');
    } else if (tab === 'Settings') {
      setCurrentScreen('settings');
    } else if (tab === 'Home') {
      setCurrentScreen('home');
    }
    console.log(`Navigating to ${tab}`);
  };

  const handlePlayPress = () => {
    setCurrentScreen('categories');
    console.log('Navigating to categories...');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setActiveTab('Home');
    setSelectedCategory(null);
    setSelectedMode(null);
    setQuizResults(null);
  };

  const handleBackToCategories = () => {
    setCurrentScreen('categories');
    setSelectedMode(null);
  };

  const handleBackToModes = () => {
    setCurrentScreen('quizMode');
  };

  const handleCategorySelect = (category: any) => {
    console.log('Selected category:', category.title);
    setSelectedCategory(category);
    setCurrentScreen('quizMode');
  };

  const handleModeSelect = (mode: any) => {
    console.log('Selected mode:', mode.title, 'for category:', selectedCategory?.title);
    setSelectedMode(mode);
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = async (score: number, answers: (number | null)[], questions: any[]) => {
    console.log('Quiz completed! Score:', score, 'Answers:', answers);
    setQuizResults({ score, answers, questions });
    
    // Save quiz result to local storage
    if (selectedCategory && selectedMode) {
      try {
        const updatedProfile = await saveQuizResult(
          selectedCategory.title,
          selectedMode.title,
          score,
          questions.length
        );
        setUserProfile(updatedProfile);
        // Reload home stats to reflect the new quiz result
        await loadHomeStats();
        console.log('✅ Quiz result saved successfully');
      } catch (error) {
        console.error('❌ Error saving quiz result:', error);
      }
    }
    
    setCurrentScreen('results');
  };

  const handleQuizExit = () => {
    console.log('Quiz exited');
    handleBackToHome();
  };

  if (currentScreen === 'categories') {
    return (
      <CategoriesScreen
        onBack={handleBackToHome}
        onCategorySelect={handleCategorySelect}
      />
    );
  }

  if (currentScreen === 'quizMode' && selectedCategory) {
    return (
      <QuizModeScreen
        onBack={handleBackToCategories}
        onModeSelect={handleModeSelect}
        selectedCategory={selectedCategory}
      />
    );
  }

  if (currentScreen === 'quiz' && selectedCategory && selectedMode) {
    return (
      <QuizScreen
        onExit={handleQuizExit}
        onComplete={handleQuizComplete}
        selectedCategory={selectedCategory}
        selectedMode={selectedMode}
      />
    );
  }

  if (currentScreen === 'results' && quizResults && selectedCategory && selectedMode) {
    return (
      <ResultsScreen
        onBackToHome={handleBackToHome}
        score={quizResults.score}
        totalQuestions={quizResults.questions.length}
        userAnswers={quizResults.answers}
        questions={quizResults.questions}
        selectedCategory={selectedCategory}
        selectedMode={selectedMode}
      />
    );
  }

  if (currentScreen === 'profile') {
    return (
      <ProfileScreen
        activeTab={activeTab}
        onTabPress={handleTabPress}
        userProfile={userProfile}
        onProfileUpdate={setUserProfile}
      />
    );
  }

  if (currentScreen === 'settings') {
    return (
      <SettingsScreen
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onDataReset={async () => {
          await loadHomeStats();
          setUserProfile(null);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.background}>
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.appTitle}>Quiz</Text>
            <Text style={styles.welcomeSubtitle}>
              Elevate your knowledge with elegance
            </Text>
          </View>
          
          <View style={styles.playSection}>
            <PlayButton onPress={handlePlayPress} />
          </View>
          
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{homeStats.quizzesPlayed}</Text>
              <Text style={styles.statLabel}>Quizzes Played</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{homeStats.bestScore}%</Text>
              <Text style={styles.statLabel}>Best Score</Text>
            </View>
          </View>
        </View>
        
        <BottomNavbar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '300',
    color: '#CBA656',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 2,
    fontFamily: 'serif', // Elegant serif for title
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#B8B8B8',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  playSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: width * 0.38,
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(203, 166, 86, 0.1)',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#CBA656',
    marginBottom: 6,
    letterSpacing: 1,
  },
  statLabel: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default HomeScreen;
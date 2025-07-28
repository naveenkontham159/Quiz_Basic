import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserStats {
  gamesPlayed: number;
  totalQuestions: number;
  totalCorrectAnswers: number;
  bestScore: number; // percentage
  avgAccuracy: number; // percentage
  lastUpdated: string;
}

export interface QuizResult {
  id: string;
  category: string;
  mode: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  duration?: number; // in seconds
}

export interface UserProfile {
  name: string;
  userId: string;
  profileImage?: string; // Base64 encoded image or file path
  stats: UserStats;
  recentQuizzes: QuizResult[];
}

const USER_PROFILE_KEY = 'user_profile';
const QUIZ_RESULTS_KEY = 'quiz_results';

// Default user profile
const getDefaultProfile = (): UserProfile => ({
  name: 'Quiz Master',
  userId: generateUserId(),
  stats: {
    gamesPlayed: 0,
    totalQuestions: 0,
    totalCorrectAnswers: 0,
    bestScore: 0,
    avgAccuracy: 0,
    lastUpdated: new Date().toISOString(),
  },
  recentQuizzes: [],
});

// Generate a unique user ID
const generateUserId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const profileData = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (profileData) {
      const profile = JSON.parse(profileData);
      // Ensure all required fields exist (for backward compatibility)
      return {
        ...getDefaultProfile(),
        ...profile,
        stats: {
          ...getDefaultProfile().stats,
          ...profile.stats,
        },
      };
    }
    
    // Create and save default profile
    const defaultProfile = getDefaultProfile();
    await saveUserProfile(defaultProfile);
    return defaultProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return getDefaultProfile();
  }
};

// Save user profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Update user name
export const updateUserName = async (newName: string): Promise<UserProfile> => {
  try {
    const profile = await getUserProfile();
    const updatedProfile = {
      ...profile,
      name: newName.trim(),
    };
    await saveUserProfile(updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Error updating user name:', error);
    throw error;
  }
};

// Update profile image
export const updateProfileImage = async (imageUri: string): Promise<UserProfile> => {
  try {
    const profile = await getUserProfile();
    const updatedProfile = {
      ...profile,
      profileImage: imageUri,
    };
    await saveUserProfile(updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile image:', error);
    throw error;
  }
};

// Save quiz result and update stats
export const saveQuizResult = async (
  category: string,
  mode: string,
  score: number,
  totalQuestions: number,
  duration?: number
): Promise<UserProfile> => {
  try {
    const profile = await getUserProfile();
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Create new quiz result
    const newResult: QuizResult = {
      id: Date.now().toString(),
      category,
      mode,
      score,
      totalQuestions,
      percentage,
      date: new Date().toISOString(),
      duration,
    };

    // Update stats
    const newGamesPlayed = profile.stats.gamesPlayed + 1;
    const newTotalQuestions = profile.stats.totalQuestions + totalQuestions;
    const newTotalCorrectAnswers = profile.stats.totalCorrectAnswers + score;
    const newBestScore = Math.max(profile.stats.bestScore, percentage);
    const newAvgAccuracy = Math.round((newTotalCorrectAnswers / newTotalQuestions) * 100);

    // Update recent quizzes (keep last 10)
    const updatedRecentQuizzes = [newResult, ...profile.recentQuizzes].slice(0, 10);

    const updatedProfile: UserProfile = {
      ...profile,
      stats: {
        gamesPlayed: newGamesPlayed,
        totalQuestions: newTotalQuestions,
        totalCorrectAnswers: newTotalCorrectAnswers,
        bestScore: newBestScore,
        avgAccuracy: newAvgAccuracy,
        lastUpdated: new Date().toISOString(),
      },
      recentQuizzes: updatedRecentQuizzes,
    };

    await saveUserProfile(updatedProfile);
    
    // Also save to quiz results for detailed history
    await saveQuizResultToHistory(newResult);
    
    console.log('✅ Quiz result saved successfully:', {
      category,
      mode,
      score: `${score}/${totalQuestions}`,
      percentage: `${percentage}%`,
      newStats: updatedProfile.stats,
    });

    return updatedProfile;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
};

// Save quiz result to detailed history
const saveQuizResultToHistory = async (result: QuizResult): Promise<void> => {
  try {
    const existingResults = await getQuizHistory();
    const updatedResults = [result, ...existingResults];
    
    // Keep last 100 results
    const trimmedResults = updatedResults.slice(0, 100);
    
    await AsyncStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(trimmedResults));
  } catch (error) {
    console.error('Error saving quiz result to history:', error);
  }
};

// Get quiz history
export const getQuizHistory = async (): Promise<QuizResult[]> => {
  try {
    const historyData = await AsyncStorage.getItem(QUIZ_RESULTS_KEY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Error getting quiz history:', error);
    return [];
  }
};

// Reset all user data
export const resetUserData = async (): Promise<UserProfile> => {
  try {
    const currentProfile = await getUserProfile();
    const resetProfile: UserProfile = {
      ...currentProfile,
      stats: {
        gamesPlayed: 0,
        totalQuestions: 0,
        totalCorrectAnswers: 0,
        bestScore: 0,
        avgAccuracy: 0,
        lastUpdated: new Date().toISOString(),
      },
      recentQuizzes: [],
    };

    await saveUserProfile(resetProfile);
    await AsyncStorage.removeItem(QUIZ_RESULTS_KEY);
    
    console.log('✅ User data reset successfully');
    return resetProfile;
  } catch (error) {
    console.error('Error resetting user data:', error);
    throw error;
  }
};

// Get stats for home screen
export const getHomeScreenStats = async (): Promise<{
  quizzesPlayed: number;
  bestScore: number;
}> => {
  try {
    const profile = await getUserProfile();
    return {
      quizzesPlayed: profile.stats.gamesPlayed,
      bestScore: profile.stats.bestScore,
    };
  } catch (error) {
    console.error('Error getting home screen stats:', error);
    return {
      quizzesPlayed: 0,
      bestScore: 0,
    };
  }
};

// Get category-specific stats
export const getCategoryStats = async (category: string): Promise<{
  gamesPlayed: number;
  bestScore: number;
  avgAccuracy: number;
}> => {
  try {
    const history = await getQuizHistory();
    const categoryResults = history.filter(result => result.category === category);
    
    if (categoryResults.length === 0) {
      return { gamesPlayed: 0, bestScore: 0, avgAccuracy: 0 };
    }

    const bestScore = Math.max(...categoryResults.map(r => r.percentage));
    const totalCorrect = categoryResults.reduce((sum, r) => sum + r.score, 0);
    const totalQuestions = categoryResults.reduce((sum, r) => sum + r.totalQuestions, 0);
    const avgAccuracy = Math.round((totalCorrect / totalQuestions) * 100);

    return {
      gamesPlayed: categoryResults.length,
      bestScore,
      avgAccuracy,
    };
  } catch (error) {
    console.error('Error getting category stats:', error);
    return { gamesPlayed: 0, bestScore: 0, avgAccuracy: 0 };
  }
};
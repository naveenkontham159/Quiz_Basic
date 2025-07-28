import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getQuizQuestions, getFallbackQuestions } from '../services/quizService';

const { width, height } = Dimensions.get('window');

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizScreenProps {
  onExit: () => void;
  onComplete: (score: number, answers: (number | null)[], questions: Question[]) => void;
  selectedCategory: {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    questionsCount: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  };
  selectedMode: {
    title: string;
    questions: number;
    duration?: string;
  };
}

const QuizScreen: React.FC<QuizScreenProps> = ({ 
  onExit, 
  onComplete, 
  selectedCategory, 
  selectedMode 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 Loading questions for:', selectedCategory.title, selectedMode.title);
        const fetchedQuestions = await getQuizQuestions(selectedCategory, selectedMode);
        
        if (fetchedQuestions.length === 0) {
          throw new Error('No questions available for this category');
        }
        
        console.log('✅ Successfully loaded', fetchedQuestions.length, 'questions from Supabase');
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error('❌ Failed to load questions:', err);
        setError('Failed to load questions. Using offline questions.');
        
        // Use fallback questions if Supabase fails
        const fallbackQuestions = getFallbackQuestions(selectedMode.questions);
        console.log('⚠️ Using', fallbackQuestions.length, 'fallback questions');
        setQuestions(fallbackQuestions);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [selectedCategory, selectedMode]);

  // Initialize selected answers array and timer when questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      setSelectedAnswers(new Array(questions.length).fill(null));
      
      // Initialize timer for timed modes
      if (selectedMode.title === 'Quick') {
        setTimeRemaining(questions.length * 30); // questions × 30 seconds
        setIsTimerActive(true);
      } else if (selectedMode.title === 'Timed') {
        setTimeRemaining(questions.length * 45); // questions × 45 seconds
        setIsTimerActive(true);
      }
    }
  }, [questions, selectedMode.title]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            setIsTimerActive(false);
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizComplete = () => {
    setIsTimerActive(false);
    
    // Calculate score
    let score = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        score++;
      }
    });

    onComplete(score, selectedAnswers, questions);
  };

  const handleExit = () => {
    Alert.alert(
      "Exit Quiz",
      "Are you sure you want to exit? Your progress will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", style: "destructive", onPress: onExit }
      ]
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#CBA656" />
          <Text style={styles.loadingText}>Loading Quiz Questions...</Text>
          <Text style={styles.loadingSubtext}>
            Preparing {selectedMode.questions} questions for {selectedCategory.title}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.errorContainer}>
          <Icon name="warning-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>Failed to Load Questions</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onExit}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={handleExit}
            activeOpacity={0.7}
          >
            <Icon name="close" size={24} color="#CBA656" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.categoryText}>{selectedCategory.title}</Text>
            <Text style={styles.modeText}>{selectedMode.title} Mode</Text>
          </View>

          {timeRemaining !== null && (
            <View style={styles.timerContainer}>
              <Icon name="timer-outline" size={20} color="#CBA656" />
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            </View>
          )}
        </View>

        {/* Warning Banner for Fallback Questions */}
        {error && (
          <View style={styles.warningBanner}>
            <Icon name="warning-outline" size={16} color="#FF9500" />
            <Text style={styles.warningText}>Using offline questions</Text>
          </View>
        )}

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        {/* Question Section */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>Question {currentQuestion + 1}</Text>
            <Text style={styles.questionText}>{currentQ.question}</Text>
          </View>

          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption
                ]}
                onPress={() => handleAnswerSelect(index)}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionIndicator,
                    selectedAnswer === index && styles.selectedIndicator
                  ]}>
                    <Text style={[
                      styles.optionLetter,
                      selectedAnswer === index && styles.selectedOptionLetter
                    ]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.previousButton]}
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
            activeOpacity={0.8}
          >
            <Icon 
              name="chevron-back" 
              size={20} 
              color={currentQuestion === 0 ? "#666666" : "#CBA656"} 
            />
            <Text style={[
              styles.navButtonText,
              currentQuestion === 0 && styles.disabledButtonText
            ]}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentQuestion === questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton]}
              onPress={handleQuizComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Submit Quiz</Text>
              <Icon name="checkmark" size={20} color="#000000" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <Icon name="chevron-forward" size={20} color="#CBA656" />
            </TouchableOpacity>
          )}
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  exitButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
  },
  headerInfo: {
    alignItems: 'center',
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  modeText: {
    fontSize: 12,
    color: '#CBA656',
    fontStyle: 'italic',
    marginTop: 2,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBA656',
    letterSpacing: 0.5,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1A1A1A',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#CBA656',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#B8B8B8',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: 14,
    color: '#CBA656',
    fontWeight: '500',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.5,
    fontFamily: 'serif',
  },
  optionsContainer: {
    paddingBottom: 30,
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  selectedOption: {
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    borderColor: '#CBA656',
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  selectedIndicator: {
    backgroundColor: '#CBA656',
    borderColor: '#FFD700',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B8B8B8',
    letterSpacing: 0.5,
  },
  selectedOptionLetter: {
    color: '#000000',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 2,
    borderTopColor: '#1A1A1A',
    gap: 20,
    backgroundColor: '#000000',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    minHeight: 56,
  },
  previousButton: {
    backgroundColor: 'rgba(203, 166, 86, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(203, 166, 86, 0.4)',
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButton: {
    backgroundColor: 'rgba(203, 166, 86, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(203, 166, 86, 0.4)',
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButton: {
    backgroundColor: '#CBA656',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    // Add gradient-like effect with additional styling
    position: 'relative',
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#CBA656',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  disabledButtonText: {
    color: '#666666',
    opacity: 0.5,
  },
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#CBA656',
    marginTop: 24,
    textAlign: 'center',
    fontFamily: 'serif',
    letterSpacing: 1,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#B8B8B8',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#B8B8B8',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: 'rgba(203, 166, 86, 0.15)',
    borderWidth: 2,
    borderColor: '#CBA656',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#CBA656',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // Warning banner styles
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default QuizScreen;
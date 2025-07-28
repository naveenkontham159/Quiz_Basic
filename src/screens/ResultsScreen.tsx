import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ResultsScreenProps {
  onBackToHome: () => void;
  score: number;
  totalQuestions: number;
  userAnswers: (number | null)[];
  questions: Question[];
  selectedCategory: {
    title: string;
    subtitle: string;
  };
  selectedMode: {
    title: string;
    duration?: string;
  };
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  onBackToHome,
  score,
  totalQuestions,
  userAnswers,
  questions,
  selectedCategory,
  selectedMode,
}) => {
  const [progressAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  const percentage = Math.round((score / totalQuestions) * 100);
  const circumference = 2 * Math.PI * 60; // radius = 60

  useEffect(() => {
    // Animate the progress ring and fade in content
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: percentage,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding!", icon: "trophy", color: "#FFD700" };
    if (percentage >= 80) return { message: "Excellent!", icon: "star", color: "#CBA656" };
    if (percentage >= 70) return { message: "Well Done!", icon: "thumbs-up", color: "#4ADE80" };
    if (percentage >= 60) return { message: "Good Effort!", icon: "checkmark-circle", color: "#60A5FA" };
    return { message: "Keep Trying!", icon: "refresh", color: "#F87171" };
  };

  const performance = getPerformanceMessage();

  const renderQuestionReview = (question: Question, index: number) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const wasAnswered = userAnswer !== null && userAnswer !== undefined;

    return (
      <View key={question.id} style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.questionNumber}>Question {index + 1}</Text>
          <View style={[
            styles.resultBadge,
            isCorrect ? styles.correctBadge : wasAnswered ? styles.incorrectBadge : styles.skippedBadge
          ]}>
            <Icon 
              name={isCorrect ? "checkmark" : wasAnswered ? "close" : "remove"} 
              size={16} 
              color="#FFFFFF" 
            />
            <Text style={styles.badgeText}>
              {isCorrect ? "Correct" : wasAnswered ? "Incorrect" : "Skipped"}
            </Text>
          </View>
        </View>

        <Text style={styles.reviewQuestion}>{question.question}</Text>

        <View style={styles.answersContainer}>
          {question.options.map((option, optionIndex) => {
            const isUserAnswer = userAnswer === optionIndex;
            const isCorrectAnswer = optionIndex === question.correctAnswer;
            
            return (
              <View
                key={optionIndex}
                style={[
                  styles.answerOption,
                  isCorrectAnswer && styles.correctAnswer,
                  isUserAnswer && !isCorrectAnswer && styles.userIncorrectAnswer,
                ]}
              >
                <View style={[
                  styles.answerIndicator,
                  isCorrectAnswer && styles.correctIndicator,
                  isUserAnswer && !isCorrectAnswer && styles.incorrectIndicator,
                ]}>
                  <Text style={[
                    styles.answerLetter,
                    (isCorrectAnswer || (isUserAnswer && !isCorrectAnswer)) && styles.highlightedLetter
                  ]}>
                    {String.fromCharCode(65 + optionIndex)}
                  </Text>
                </View>
                <Text style={[
                  styles.answerText,
                  isCorrectAnswer && styles.correctAnswerText,
                  isUserAnswer && !isCorrectAnswer && styles.userIncorrectAnswerText,
                ]}>
                  {option}
                </Text>
                {isCorrectAnswer && (
                  <Icon name="checkmark-circle" size={20} color="#4ADE80" />
                )}
                {isUserAnswer && !isCorrectAnswer && (
                  <Icon name="close-circle" size={20} color="#F87171" />
                )}
              </View>
            );
          })}
        </View>

        {question.explanation && (
          <View style={styles.explanationContainer}>
            <Icon name="information-circle-outline" size={16} color="#CBA656" />
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToHome}
            activeOpacity={0.7}
          >
            <Icon name="home" size={24} color="#CBA656" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Quiz Results</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Score Section */}
          <Animated.View style={[styles.scoreSection, { opacity: fadeAnim }]}>
            <Text style={styles.categoryTitle}>{selectedCategory.title}</Text>
            <Text style={styles.modeTitle}>{selectedMode.title} Mode</Text>

            {/* Circular Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.circularProgress}>
                <Animated.View
                  style={[
                    styles.progressRing,
                    {
                      transform: [{
                        rotate: progressAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0deg', '360deg'],
                        })
                      }]
                    }
                  ]}
                />
                <View style={styles.progressContent}>
                  <Text style={styles.percentageText}>{percentage}%</Text>
                  <Text style={styles.scoreText}>{score}/{totalQuestions}</Text>
                </View>
              </View>
            </View>

            {/* Performance Message */}
            <View style={styles.performanceContainer}>
              <Icon name={performance.icon} size={32} color={performance.color} />
              <Text style={[styles.performanceText, { color: performance.color }]}>
                {performance.message}
              </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{score}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalQuestions - score}</Text>
                <Text style={styles.statLabel}>Incorrect</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{percentage}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </View>
          </Animated.View>

          {/* Question Review */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Question Review</Text>
            {questions.map((question, index) => renderQuestionReview(question, index))}
          </View>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={onBackToHome}
              activeOpacity={0.8}
            >
              <Icon name="home" size={24} color="#000000" />
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#CBA656',
    fontFamily: 'serif',
    letterSpacing: 1,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  modeTitle: {
    fontSize: 14,
    color: '#CBA656',
    fontStyle: 'italic',
    marginBottom: 30,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  circularProgress: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#CBA656',
    borderRightColor: '#CBA656',
  },
  progressContent: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 36,
    fontWeight: '300',
    color: '#CBA656',
    fontFamily: 'serif',
    letterSpacing: 1,
  },
  scoreText: {
    fontSize: 16,
    color: '#B8B8B8',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  performanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  performanceText: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#CBA656',
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#B8B8B8',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  reviewSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  reviewCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    color: '#CBA656',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  correctBadge: {
    backgroundColor: '#4ADE80',
  },
  incorrectBadge: {
    backgroundColor: '#F87171',
  },
  skippedBadge: {
    backgroundColor: '#6B7280',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  reviewQuestion: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  answersContainer: {
    gap: 8,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    gap: 12,
  },
  correctAnswer: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderWidth: 1,
    borderColor: '#4ADE80',
  },
  userIncorrectAnswer: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  answerIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctIndicator: {
    backgroundColor: '#4ADE80',
  },
  incorrectIndicator: {
    backgroundColor: '#F87171',
  },
  answerLetter: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B8B8B8',
  },
  highlightedLetter: {
    color: '#FFFFFF',
  },
  answerText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    letterSpacing: 0.2,
  },
  correctAnswerText: {
    fontWeight: '500',
  },
  userIncorrectAnswerText: {
    opacity: 0.8,
  },
  explanationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    borderRadius: 8,
    gap: 8,
  },
  explanationText: {
    fontSize: 13,
    color: '#B8B8B8',
    flex: 1,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CBA656',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    gap: 12,
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default ResultsScreen;
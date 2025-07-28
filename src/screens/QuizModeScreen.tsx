import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface QuizMode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  duration?: string;
  questions?: number;
}

interface QuizModeScreenProps {
  onBack: () => void;
  onModeSelect: (mode: QuizMode) => void;
  selectedCategory: {
    title: string;
    subtitle: string;
  };
}

const QuizModeScreen: React.FC<QuizModeScreenProps> = ({ 
  onBack, 
  onModeSelect, 
  selectedCategory 
}) => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scrollY] = useState(new Animated.Value(0));
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const quizModes: QuizMode[] = [
    {
      id: 'quick',
      title: 'Quick',
      subtitle: 'Fast & Fun',
      description: '10 questions • 30 seconds each',
      icon: 'flash-outline',
      duration: '5 min',
      questions: 10,
    },
    {
      id: 'timed',
      title: 'Timed',
      subtitle: 'Beat the Clock',
      description: '20 questions • 45 seconds each',
      icon: 'timer-outline',
      duration: '15 min',
      questions: 20,
    },
    {
      id: 'classic',
      title: 'Classic',
      subtitle: 'Take Your Time',
      description: '30 questions • No time limit',
      icon: 'library-outline',
      duration: 'Unlimited',
      questions: 30,
    },
  ];

  const [cardAnimations] = useState(
    quizModes.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  );

  useEffect(() => {
    // Animate content fade-in and slide-up on component mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered animation for cards
    const cardAnimationSequence = cardAnimations.map((cardAnim, index) =>
      Animated.parallel([
        Animated.timing(cardAnim.opacity, {
          toValue: 1,
          duration: 600,
          delay: index * 200 + 400, // Start after main animation
          useNativeDriver: true,
        }),
        Animated.timing(cardAnim.translateY, {
          toValue: 0,
          duration: 600,
          delay: index * 200 + 400,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel(cardAnimationSequence).start();
  }, [fadeAnim, slideAnim, cardAnimations]);

  const handleModePress = (mode: QuizMode) => {
    setSelectedMode(mode.id);
    
    // Animate button press with pulse effect
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Navigate after animation
    setTimeout(() => {
      onModeSelect(mode);
    }, 300);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowScrollTop(offsetY > 200);
      }
    }
  );

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const onRefresh = () => {
    setRefreshing(true);
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    cardAnimations.forEach(cardAnim => {
      cardAnim.opacity.setValue(0);
      cardAnim.translateY.setValue(30);
    });

    // Restart animations after a brief delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      const cardAnimationSequence = cardAnimations.map((cardAnim, index) =>
        Animated.parallel([
          Animated.timing(cardAnim.opacity, {
            toValue: 1,
            duration: 400,
            delay: index * 150 + 200,
            useNativeDriver: true,
          }),
          Animated.timing(cardAnim.translateY, {
            toValue: 0,
            duration: 400,
            delay: index * 150 + 200,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.parallel(cardAnimationSequence).start();
      setRefreshing(false);
    }, 500);
  };

  const renderModeCard = (mode: QuizMode, index: number) => (
    <Animated.View
      key={mode.id}
      style={[
        styles.modeCard,
        selectedMode === mode.id && styles.selectedModeCard,
        { 
          opacity: cardAnimations[index]?.opacity || 1,
          transform: [
            { translateY: cardAnimations[index]?.translateY || 0 },
            { scale: selectedMode === mode.id ? Animated.multiply(scaleAnim, pulseAnim) : 1 }
          ] 
        }
      ]}
    >
      <TouchableOpacity
        style={styles.modeButton}
        onPress={() => handleModePress(mode)}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Icon name={mode.icon} size={32} color="#CBA656" />
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{mode.duration}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.modeTitle}>{mode.title}</Text>
          <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
          <Text style={styles.modeDescription}>{mode.description}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.questionsInfo}>
            <Icon name="help-circle-outline" size={16} color="#CBA656" />
            <Text style={styles.questionsText}>{mode.questions} Questions</Text>
          </View>
          <Icon 
            name="chevron-forward" 
            size={24} 
            color={selectedMode === mode.id ? "#FFD700" : "#CBA656"} 
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#CBA656" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Quiz Mode</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Category Info */}
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryTitle}>{selectedCategory.title}</Text>
          <Text style={styles.categorySubtitle}>{selectedCategory.subtitle}</Text>
        </View>

        {/* Scrollable Content */}
        <Animated.ScrollView 
          ref={scrollViewRef}
          style={[
            styles.scrollView,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#CBA656"
              colors={["#CBA656"]}
              progressBackgroundColor="#1A1A1A"
            />
          }
        >
          {/* Mode Selection */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Choose Your Challenge</Text>
            
            <View style={styles.modesContainer}>
              {quizModes.map((mode, index) => renderModeCard(mode, index))}
            </View>
          </View>

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <View style={styles.infoRow}>
              <Icon name="trophy-outline" size={20} color="#CBA656" />
              <Text style={styles.infoText}>Earn points based on speed and accuracy</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="star-outline" size={20} color="#CBA656" />
              <Text style={styles.infoText}>Track your progress and achievements</Text>
            </View>
          </View>
        </Animated.ScrollView>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Animated.View style={styles.scrollTopButton}>
            <TouchableOpacity
              style={styles.scrollTopButtonInner}
              onPress={scrollToTop}
              activeOpacity={0.8}
            >
              <Icon name="chevron-up" size={24} color="#000000" />
            </TouchableOpacity>
          </Animated.View>
        )}
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
  categoryInfo: {
    alignItems: 'center',
    paddingVertical: 24,
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
  categorySubtitle: {
    fontSize: 14,
    color: '#B8B8B8',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#B8B8B8',
    marginBottom: 30,
    fontStyle: 'italic',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  modesContainer: {
    gap: 20,
    paddingBottom: 20,
  },
  modeCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 24,
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(203, 166, 86, 0.2)',
  },
  selectedModeCard: {
    borderColor: '#CBA656',
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  modeButton: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(203, 166, 86, 0.3)',
  },
  durationBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(203, 166, 86, 0.3)',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBA656',
    letterSpacing: 0.5,
  },
  cardContent: {
    marginBottom: 20,
  },
  modeTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1A1A1A',
    marginBottom: 6,
    letterSpacing: 1,
    fontFamily: 'serif',
  },
  modeSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CBA656',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  questionsText: {
    fontSize: 13,
    color: '#CBA656',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  bottomInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#B8B8B8',
    letterSpacing: 0.2,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  scrollTopButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#CBA656',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default QuizModeScreen;
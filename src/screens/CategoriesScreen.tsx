import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  questionsCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface CategoriesScreenProps {
  onBack: () => void;
  onCategorySelect: (category: Category) => void;
}

const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ onBack, onCategorySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Category[] = [
    {
      id: '1',
      title: 'General Knowledge',
      subtitle: 'Test your overall knowledge',
      icon: 'library-outline',
      questionsCount: 50,
      difficulty: 'Medium',
    },
    {
      id: '2',
      title: 'IQ & Logic',
      subtitle: 'Challenge your reasoning',
      icon: 'bulb-outline',
      questionsCount: 40,
      difficulty: 'Hard',
    },
    {
      id: '3',
      title: 'Entertainment India',
      subtitle: 'Bollywood & Indian cinema',
      icon: 'film-outline',
      questionsCount: 35,
      difficulty: 'Easy',
    },
    {
      id: '4',
      title: 'Sports',
      subtitle: 'Athletic knowledge test',
      icon: 'trophy-outline',
      questionsCount: 45,
      difficulty: 'Medium',
    },
    {
      id: '5',
      title: 'Science & Tech',
      subtitle: 'Modern innovations',
      icon: 'rocket-outline',
      questionsCount: 38,
      difficulty: 'Hard',
    },
    {
      id: '6',
      title: 'History',
      subtitle: 'Past events & civilizations',
      icon: 'time-outline',
      questionsCount: 42,
      difficulty: 'Medium',
    },
  ];

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4ADE80';
      case 'Medium': return '#CBA656';
      case 'Hard': return '#EF4444';
      default: return '#CBA656';
    }
  };

  const renderCategoryCard = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => onCategorySelect(category)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon name={category.icon} size={28} color="#CBA656" />
        </View>
        <View style={styles.difficultyBadge}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(category.difficulty) }]}>
            {category.difficulty}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.questionsCount}>{category.questionsCount} Questions</Text>
          <Icon name="chevron-forward" size={20} color="#CBA656" />
        </View>
      </View>
    </TouchableOpacity>
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
          
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#666666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.categoriesContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Choose Your Challenge</Text>
          
          <View style={styles.categoriesGrid}>
            {filteredCategories.map(renderCategoryCard)}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#B8B8B8',
    marginBottom: 20,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#CBA656',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(203, 166, 86, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(203, 166, 86, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionsCount: {
    fontSize: 13,
    color: '#CBA656',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default CategoriesScreen;
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rhndmofzdwxgseawxdwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobmRtb2Z6ZHd4Z3NlYXd4ZHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MTQ0MjcsImV4cCI6MjA2OTE5MDQyN30.JqEz7RTuMqWurvq7-HW_JGi_P5biWPAu6tHpbMy6Evk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types - Updated to match your actual table structure
export interface DatabaseQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string; // 'A', 'B', 'C', or 'D'
  category?: string; // Optional category field
}

// Transformed question type for the app
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, or 3
  explanation?: string;
}

// Function to transform database question to app question format
export const transformQuestion = (dbQuestion: DatabaseQuestion): Question => {
  const options = [
    dbQuestion.option_a,
    dbQuestion.option_b,
    dbQuestion.option_c,
    dbQuestion.option_d
  ];

  // Convert letter answer to index (A=0, B=1, C=2, D=3)
  const correctAnswerIndex = dbQuestion.correct_option.charCodeAt(0) - 65;

  return {
    id: dbQuestion.id,
    question: dbQuestion.question,
    options,
    correctAnswer: correctAnswerIndex,
  };
};

// Map category titles to table names
const categoryTableMap: { [key: string]: string } = {
  'General Knowledge': 'general_knowledge',
  'History': 'history',
  'Sports': 'sports',
  'Science & Tech': 'science_tech',
  'IQ & Logic': 'iq_logic',
  'Entertainment': 'entertainment_india'
};

// Function to get table name from category title
const getTableName = (categoryTitle: string): string => {
  const tableName = categoryTableMap[categoryTitle];
  if (!tableName) {
    console.warn('⚠️ Unknown category:', categoryTitle, 'defaulting to general_knowledge');
    return 'general_knowledge';
  }
  return tableName;
};

// Generic function to fetch questions from any category table
export const fetchQuestionsByCategory = async (categoryTitle: string, limit: number = 10): Promise<Question[]> => {
  try {
    const tableName = getTableName(categoryTitle);
    console.log('🔗 Connecting to Supabase...');
    console.log('📊 Fetching', limit, 'questions from', tableName, 'table for category:', categoryTitle);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(limit * 2); // Fetch more questions to allow for randomization

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No questions found in', tableName, 'table');
      throw new Error(`No questions found for category: ${categoryTitle}`);
    }

    console.log('✅ Raw data from Supabase:', data.length, 'questions from', tableName);
    console.log('📝 Sample question:', data[0]);

    // Shuffle the questions for randomness and take only the required amount
    const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, limit);

    // Transform database questions to app format
    const transformedQuestions = shuffled.map(transformQuestion);
    console.log('🔄 Transformed questions:', transformedQuestions.length);
    
    return transformedQuestions;
  } catch (error) {
    console.error('❌ Failed to fetch questions for category:', categoryTitle, error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const fetchGeneralKnowledgeQuestions = async (limit: number = 10): Promise<Question[]> => {
  return fetchQuestionsByCategory('General Knowledge', limit);
};

// Function to fetch random questions from any category
export const fetchRandomQuestionsByCategory = async (categoryTitle: string, limit: number = 10): Promise<Question[]> => {
  try {
    const tableName = getTableName(categoryTitle);
    console.log('🎲 Fetching random questions from', tableName, 'table');
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('id', { ascending: false }) // You can implement random ordering in different ways
      .limit(limit * 2); // Fetch more to allow for better randomization

    if (error) {
      console.error('Error fetching random questions:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`No questions found in ${tableName} table`);
    }

    // Shuffle the questions for randomness
    const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, limit);
    
    // Transform database questions to app format
    return shuffled.map(transformQuestion);
  } catch (error) {
    console.error('Failed to fetch random questions from', categoryTitle, ':', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const fetchRandomGeneralKnowledgeQuestions = async (limit: number = 10): Promise<Question[]> => {
  return fetchRandomQuestionsByCategory('General Knowledge', limit);
};
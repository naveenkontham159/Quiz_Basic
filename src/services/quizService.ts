import { fetchGeneralKnowledgeQuestions, fetchQuestionsByCategory, Question } from '../config/supabase';

export interface QuizMode {
  title: string;
  questions: number;
  duration?: string;
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  questionsCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Function to get questions based on category and mode
export const getQuizQuestions = async (
  category: Category,
  mode: QuizMode
): Promise<Question[]> => {
  try {
    let questions: Question[] = [];
    let questionCount = mode.questions;

    // Determine question count based on mode
    if (mode.title === 'Quick') {
      questionCount = 10;
    } else if (mode.title === 'Timed') {
      questionCount = 20;
    } else if (mode.title === 'Practice') {
      questionCount = 15;
    }

    // Fetch questions from the appropriate category table
    console.log('🎯 Fetching questions for category:', category.title, 'Mode:', mode.title, 'Count:', questionCount);
    questions = await fetchQuestionsByCategory(category.title, questionCount);

    // Ensure we don't exceed the requested number of questions
    if (questions.length > questionCount) {
      questions = questions.slice(0, questionCount);
    }

    console.log('✅ Successfully fetched', questions.length, 'questions for', category.title);
    return questions;
  } catch (error) {
    console.error('❌ Error fetching quiz questions for', category.title, ':', error);
    throw error;
  }
};

// Function to validate if questions are available for a category
export const validateCategoryAvailability = async (category: Category): Promise<boolean> => {
  try {
    console.log('🔍 Validating availability for category:', category.title);
    const questions = await fetchQuestionsByCategory(category.title, 1);
    const isAvailable = questions.length > 0;
    console.log('✅ Category', category.title, 'availability:', isAvailable);
    return isAvailable;
  } catch (error) {
    console.error('❌ Error validating category availability for', category.title, ':', error);
    return false;
  }
};

// Sample questions as fallback (in case of network issues)
export const getFallbackQuestions = (count: number = 5): Question[] => {
  const sampleQuestions: Question[] = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      explanation: "Paris is the capital and most populous city of France."
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      explanation: "Mars is called the Red Planet due to its reddish appearance."
    },
    {
      id: 3,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2,
      explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519."
    },
    {
      id: 4,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: 3,
      explanation: "The Pacific Ocean is the largest and deepest ocean on Earth."
    },
    {
      id: 5,
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1,
      explanation: "World War II ended in 1945 with the surrender of Japan."
    }
  ];

  return sampleQuestions.slice(0, count);
};
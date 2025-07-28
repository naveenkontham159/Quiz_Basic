// Test file to verify Supabase connection
import { fetchGeneralKnowledgeQuestions } from '../config/supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const questions = await fetchGeneralKnowledgeQuestions(5);
    console.log('✅ Supabase connection successful!');
    console.log(`✅ Fetched ${questions.length} questions`);
    console.log('Sample question:', questions[0]);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

// You can call this function from your component to test
// testSupabaseConnection();
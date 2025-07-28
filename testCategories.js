// Test script to verify all category tables work
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rhndmofzdwxgseawxdwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobmRtb2Z6ZHd4Z3NlYXd4ZHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MTQ0MjcsImV4cCI6MjA2OTE5MDQyN30.JqEz7RTuMqWurvq7-HW_JGi_P5biWPAu6tHpbMy6Evk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categoryTables = [
  { title: 'General Knowledge', table: 'general_knowledge' },
  { title: 'History', table: 'history' },
  { title: 'Sports', table: 'sports' },
  { title: 'Science & Tech', table: 'science_tech' },
  { title: 'IQ & Logic', table: 'iq_logic' },
  { title: 'Entertainment', table: 'entertainment_india' }
];

async function testAllCategories() {
  console.log('🧪 Testing all category tables...\n');
  
  for (const category of categoryTables) {
    try {
      console.log(`📊 Testing ${category.title} (${category.table})...`);
      
      const { data, error } = await supabase
        .from(category.table)
        .select('*')
        .limit(2);

      if (error) {
        console.error(`❌ Error for ${category.title}:`, error.message);
        continue;
      }

      if (!data || data.length === 0) {
        console.warn(`⚠️ No questions found in ${category.table}`);
        continue;
      }

      console.log(`✅ ${category.title}: Found ${data.length} questions`);
      console.log(`   Sample: ${data[0].question}`);
      console.log(`   Correct: ${data[0].correct_option}\n`);
      
    } catch (err) {
      console.error(`❌ Failed to test ${category.title}:`, err.message);
    }
  }
}

testAllCategories();
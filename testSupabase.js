// Simple Node.js test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rhndmofzdwxgseawxdwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobmRtb2Z6ZHd4Z3NlYXd4ZHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MTQ0MjcsImV4cCI6MjA2OTE5MDQyN30.JqEz7RTuMqWurvq7-HW_JGi_P5biWPAu6tHpbMy6Evk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    console.log('📡 URL:', supabaseUrl);
    
    const { data, error } = await supabase
      .from('general_knowledge')
      .select('*')
      .limit(3);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Connection successful!');
    console.log('📊 Found', data.length, 'questions');
    
    if (data.length > 0) {
      console.log('📝 Sample question:');
      console.log('   ID:', data[0].id);
      console.log('   Question:', data[0].question);
      console.log('   Option A:', data[0].option_a);
      console.log('   Option B:', data[0].option_b);
      console.log('   Option C:', data[0].option_c);
      console.log('   Option D:', data[0].option_d);
      console.log('   Correct Option:', data[0].correct_option);
      console.log('   Category:', data[0].category);
      
      // Test transformation
      const correctIndex = data[0].correct_option.charCodeAt(0) - 65;
      console.log('   Correct Index:', correctIndex, '(should be 0 for A, 1 for B, etc.)');
    }
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
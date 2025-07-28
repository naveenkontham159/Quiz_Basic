# Supabase Integration Guide

## Overview
This document explains how the quiz app integrates with Supabase to fetch questions from your database.

## Database Setup
You have created a `general_knowledge` table with the following structure:
- `id` (integer) - Unique identifier
- `question` (text) - The question text
- `option_a` (text) - First option
- `option_b` (text) - Second option  
- `option_c` (text) - Third option
- `option_d` (text) - Fourth option
- `correct_answer` (text) - Correct answer ('A', 'B', 'C', or 'D')

## Configuration
The Supabase configuration is located in `src/config/supabase.ts`:
- **URL**: https://rhndmofzdwxgseawxdwr.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## How It Works

### 1. Question Fetching
- Questions are fetched from the `general_knowledge` table
- The app transforms database format to app format automatically
- Database answers ('A', 'B', 'C', 'D') are converted to indices (0, 1, 2, 3)

### 2. Quiz Modes
- **Quick Mode**: 10 random questions
- **Timed Mode**: 20 random questions  
- **Practice Mode**: 15 random questions

### 3. Error Handling
- If Supabase fails, the app falls back to offline questions
- Users see a warning banner when using offline questions
- Loading states are shown while fetching data

### 4. Category Support
Currently implemented:
- ✅ **General Knowledge** - Fully integrated with Supabase
- ⏳ **Other Categories** - Will use general knowledge questions until their tables are created

## Files Modified
1. `src/config/supabase.ts` - Supabase client and data transformation
2. `src/services/quizService.ts` - Quiz logic and question fetching
3. `src/screens/QuizScreen.tsx` - Updated to use dynamic questions
4. `package.json` - Added @supabase/supabase-js dependency

## Testing
You can test the Supabase connection using the test file:
```typescript
import { testSupabaseConnection } from './src/test/supabaseTest';
testSupabaseConnection();
```

## Future Enhancements
To add more categories:
1. Create new tables in Supabase (e.g., `sports`, `science_tech`, etc.)
2. Add cases in `quizService.ts` to handle the new categories
3. Update the fetching logic in `supabase.ts`

## Sample Database Entry
```sql
INSERT INTO general_knowledge (id, question, option_a, option_b, option_c, option_d, correct_answer)
VALUES (6041, 'The Treaty of Versailles officially ended which war?', 'World War I', 'World War II', 'Cold War', 'Napoleonic Wars', 'A');
```

## Troubleshooting
- Check network connection if questions fail to load
- Verify Supabase URL and key are correct
- Check browser console for detailed error messages
- Fallback questions will be used if Supabase is unavailable
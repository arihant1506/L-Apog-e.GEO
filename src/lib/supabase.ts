import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client using the provided Project URL and Anon Key
const supabaseUrl = 'https://qsxdwnwkkgbqzqnntqhh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzeGR3bndra2dicXpxbm50cWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTMwMzIsImV4cCI6MjA5MTkyOTAzMn0.e6rBcZLj5nbUgOUFDFifDMO4B1rdZ6brR7ME_4go9U0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://merfmjvjghrvniqcxhgs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jMQ8rZDedeK_3ZghGz1Axg_dfF63zkg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl ="https://nbqxypxuwozrkdlwevye.supabase.co";
const supabaseAnonKey ="sb_secret_W-olhaQ8pOlro6imWFRnTA_oVePkyc4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

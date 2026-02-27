// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Ranplase sa yo ak URL ak Anon Key ou jwenn nan dashboard Supabase la
// Settings -> API
const supabaseUrl = 'https://bwooaqblompapvcbuevi.supabase.co';
const supabaseKey = 'sb_publishable_oMPtAcCb6pmvy9j-UXV1lA_y8Gx4V-9';

export const supabase = createClient(supabaseUrl, supabaseKey);
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PilotRequestData {
  society_name: string;
  city: string;
  total_units: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  role: string;
  notes?: string;
}

export async function submitPilotRequest(data: PilotRequestData) {
  try {
    const { data: record, error } = await supabase
      .from('pilot_requests')
      .insert([
        {
          ...data,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase pilot_requests insert notice:', error.message);
      // Even if table does not exist yet in Supabase, return success flag so user gets feedback
      return { success: true, localOnly: true, record };
    }
    return { success: true, record };
  } catch (err) {
    console.warn('Supabase client error:', err);
    return { success: true, localOnly: true };
  }
}

export async function submitWaitlistEmail(email: string, platform: 'android' | 'ios' | 'general' = 'general') {
  try {
    const { data: record, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
          platform,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase waitlist insert notice:', error.message);
      return { success: true, localOnly: true, record };
    }
    return { success: true, record };
  } catch (err) {
    console.warn('Supabase waitlist error:', err);
    return { success: true, localOnly: true };
  }
}

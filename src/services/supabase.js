import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are provided
let isConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn(
    '⚠️ SUPABASE NOT CONFIGURED\n' +
    'Database features will NOT work.\n' +
    'To enable persistence, create .env.local with:\n' +
    'VITE_SUPABASE_URL=your-url\n' +
    'VITE_SUPABASE_ANON_KEY=your-key'
  );
}

const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);
export const isSupabaseConfigured = isConfigured;

// Wrapper to check configuration before database operations
export const validateSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    console.error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
    return false;
  }
  return true;
};

// Auth Functions
export const authService = {
  // Sign up with email and password
  async signup(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    return { data, error };
  },

  // Login with email and password
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // On auth state change
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database Functions
export const databaseService = {
  // Save interview record
  async saveInterview(userId, interviewData) {
    const { data, error } = await supabase
      .from('interviews')
      .insert([{
        user_id: userId,
        role: interviewData.role,
        problem: interviewData.problem,
        difficulty: interviewData.difficulty,
        score: interviewData.score,
        technical_score: interviewData.technicalScore,
        communication_score: interviewData.communicationScore,
        is_behavioral: interviewData.isBehavioral,
        actual_duration: interviewData.actualDuration,
        code_quality_score: interviewData.codeQualityScore,
        strengths: interviewData.strengths,
        improvements: interviewData.improvements,
        transcript: interviewData.transcript,
        created_at: new Date().toISOString()
      }]);
    return { data, error };
  },

  // Get user's interviews
  async getUserInterviews(userId) {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get single interview
  async getInterview(interviewId) {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .single();
    return { data, error };
  },

  // Delete interview
  async deleteInterview(interviewId) {
    const { error } = await supabase
      .from('interviews')
      .delete()
      .eq('id', interviewId);
    return { error };
  },

  // Save user preferences/settings
  async saveSettings(userId, settings) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert([{
        user_id: userId,
        settings: settings,
        updated_at: new Date().toISOString()
      }], { onConflict: 'user_id' });
    return { data, error };
  },

  // Get user settings
  async getSettings(userId) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single();
    return { data: data?.settings, error };
  },

  // Save user profile
  async saveUserProfile(userId, profile) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([{
        user_id: userId,
        full_name: profile.fullName,
        resume: profile.resume,
        avatar_url: profile.avatarUrl,
        updated_at: new Date().toISOString()
      }], { onConflict: 'user_id' });
    return { data, error };
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  }
};

// Storage Functions (for recordings)
export const storageService = {
  // Upload recording
  async uploadRecording(userId, fileName, file) {
    const filePath = `${userId}/${fileName}`;
    const { data, error } = await supabase.storage
      .from('recordings')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    return { data, error };
  },

  // Get recording URL
  async getRecordingUrl(userId, fileName) {
    const filePath = `${userId}/${fileName}`;
    const { data } = supabase.storage
      .from('recordings')
      .getPublicUrl(filePath);
    return data.publicUrl;
  },

  // Delete recording
  async deleteRecording(userId, fileName) {
    const filePath = `${userId}/${fileName}`;
    const { error } = await supabase.storage
      .from('recordings')
      .remove([filePath]);
    return { error };
  },

  // Upload avatar
  async uploadAvatar(userId, file) {
    // NOTE: This requires an 'avatars' storage bucket to be created in Supabase
    // Current status: Not implemented/tested
    // To enable: Create a storage bucket named 'avatars' in Supabase dashboard
    const filePath = `avatars/${userId}/${file.name}`;
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (error) {
        console.warn('⚠️ Avatar upload failed - bucket may not exist:', error);
        return { data: null, error };
      }
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return { data: urlData, error: null };
    } catch (err) {
      console.warn('⚠️ Avatar upload error:', err);
      return { data: null, error: err };
    }
  }
};

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to interview updates
  subscribeToInterviews(userId, callback) {
    return supabase
      .channel(`interviews:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'interviews',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  },

  // Unsubscribe
  async unsubscribe(subscription) {
    await supabase.removeChannel(subscription);
  }
};

export default supabase;

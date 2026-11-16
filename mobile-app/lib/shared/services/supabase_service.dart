import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static const String supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
  static const String supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

  static bool _isInitialized = false;
  static bool get isInitialized => _isInitialized;

  static SupabaseClient? get client {
    if (_isInitialized) {
      try {
        return Supabase.instance.client;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  static Future<void> initialize() async {
    try {
      await Supabase.initialize(
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
      );
      _isInitialized = true;
    } catch (e) {
      // In offline mode or local preview without internet, flag remains false
      // Services will seamlessly utilize robust local cache and seed models.
      _isInitialized = false;
    }
  }
}

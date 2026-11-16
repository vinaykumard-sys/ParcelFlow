import 'package:flutter/foundation.dart';

class AppVersionInfo {
  final String version;
  final int buildNumber;
  final String releaseDate;
  final String downloadUrl;
  final List<String> changelog;

  AppVersionInfo({
    required this.version,
    required this.buildNumber,
    required this.releaseDate,
    required this.downloadUrl,
    required this.changelog,
  });
}

class UpdateService extends ChangeNotifier {
  static const String currentVersion = '0.1.0';
  static const int currentBuildNumber = 1;
  static const String releaseDate = '2026-11-16';

  bool _isChecking = false;
  bool get isChecking => _isChecking;

  final AppVersionInfo _latestVersion = AppVersionInfo(
    version: '0.1.0',
    buildNumber: 1,
    releaseDate: '2026-11-16',
    downloadUrl: '/downloads/android/ParcelFlow.apk',
    changelog: [
      'Initial release of ParcelFlow unified cross-platform mobile application',
      'All-in-one role-based navigation: Resident, Staff, and Admin',
      'Dynamic OTP generation with 5-minute countdown and cryptographic QR verification',
      'High-speed camera barcode scanner for courier parcel ingestion',
      'Storage rack tracking (Racks A, B, Cold Storage) and evening slot booking',
      '100% offline resilience and Supabase real-time cloud sync',
    ],
  );

  AppVersionInfo get latestVersion => _latestVersion;

  bool get hasUpdate => false; // Up to date with v0.1.0

  Future<void> checkForUpdates() async {
    _isChecking = true;
    notifyListeners();
    await Future.delayed(const Duration(milliseconds: 800));
    _isChecking = false;
    notifyListeners();
  }
}

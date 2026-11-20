// ============================================================================
// PARCELFLOW ANDROID APP VERSION CONFIGURATION
// (src/mobile/version.ts)
//
// Matches the native AndroidManifest.xml package identity:
// package: in.parcelflow.app
// versionCode: 4
// versionName: 1.1.0
// ============================================================================

export interface AppVersionInfo {
  versionName: string;
  versionCode: number;
  packageId: string;
  buildDate: string;
  channel: 'production' | 'beta';
}

export const CURRENT_APP_VERSION: AppVersionInfo = {
  versionName: '1.1.0',
  versionCode: 4,
  packageId: 'in.parcelflow.app',
  buildDate: '2026-11-20',
  channel: 'production',
};

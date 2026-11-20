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
  versionName: '1.2.0',
  versionCode: 5,
  packageId: 'in.parcelflow.app',
  buildDate: '2026-11-20',
  channel: 'production',
};

/**
 * Returns the effective app version info, taking into account any locally installed updates
 * or native container properties.
 */
export function getEffectiveAppVersion(): AppVersionInfo {
  if (typeof window === 'undefined') return CURRENT_APP_VERSION;

  try {
    const installedCode = localStorage.getItem('parcelflow_installed_version_code');
    const installedName = localStorage.getItem('parcelflow_installed_version_name');

    if (installedCode) {
      const codeNum = parseInt(installedCode, 10);
      if (!isNaN(codeNum) && codeNum > CURRENT_APP_VERSION.versionCode) {
        return {
          ...CURRENT_APP_VERSION,
          versionCode: codeNum,
          versionName: installedName || CURRENT_APP_VERSION.versionName,
        };
      }
    }
  } catch {
    // ignore
  }

  return CURRENT_APP_VERSION;
}

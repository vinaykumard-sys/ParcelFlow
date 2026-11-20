import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { DownloadPage } from './pages/DownloadPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { MobileApp } from './mobile/MobileApp';
import { Forbidden403Page } from './components/Forbidden403';
import { useMobileStore } from './mobile/services/mobileState';
import { useState, useEffect } from 'react';
import { verifyAdminStatus } from './services/authService';
import { supabase } from './services/supabaseClient';

// ============================================================================
// ADMIN ROUTE GUARD — strictly DB-verified. Local store role alone is NOT enough.
// Steps:
//  1. Supabase auth.getUser() — requires a live server-verified JWT.
//  2. verifyAdminStatus(uid) — queries public.profiles in Supabase DB.
//  3. Only if DB confirms SUPER_ADMIN or SOCIETY_ADMIN is MobileApp rendered.
// ============================================================================
function AdminRouteGuard() {
  const { currentRole } = useMobileStore();
  const [checking, setChecking] = useState(true);
  const [dbVerifiedAdmin, setDbVerifiedAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      try {
        // Step 1: Get server-verified authenticated user (not from cache alone)
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          if (!cancelled) { setDbVerifiedAdmin(false); setChecking(false); }
          return;
        }
        // Step 2: Query public.profiles for SUPER_ADMIN or SOCIETY_ADMIN role
        const isAdmin = await verifyAdminStatus(user.id);
        if (!cancelled) { setDbVerifiedAdmin(isAdmin); setChecking(false); }
      } catch {
        if (!cancelled) { setDbVerifiedAdmin(false); setChecking(false); }
      }
    }
    verify();
    return () => { cancelled = true; };
  }, []);

  if (checking) {
    // Brief loading state while DB check runs — show nothing (or spinner)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F2EB]">
        <div className="text-sm text-slate-500 font-semibold animate-pulse">Verifying access…</div>
      </div>
    );
  }

  if (!dbVerifiedAdmin) {
    return (
      <Forbidden403Page
        currentRole={currentRole}
        requiredRole="SOCIETY_ADMIN"
        attemptedPath="/admin"
      />
    );
  }

  return <MobileApp />;
}

export function App() {
  // If running inside native Android APK or native webview wrapper, render mobile app directly
  const isNativeApp =
    typeof window !== 'undefined' &&
    ((window as any).__PARCELFLOW_NATIVE_APP__ === true ||
      navigator.userAgent.includes('ParcelFlowApp') ||
      window.location.protocol === 'file:' ||
      window.location.pathname.startsWith('/app') ||
      window.location.search.includes('view=app'));

  if (isNativeApp) {
    return <MobileApp />;
  }

  return (
    <ModalProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRouteGuard />} />
          <Route path="/admin/*" element={<AdminRouteGuard />} />

          {/* Direct Mobile Application Route */}
          <Route path="/app" element={<MobileApp />} />
          <Route path="/app/*" element={<MobileApp />} />

          {/* Marketing Website Routes */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/download" element={<DownloadPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}

export default App;

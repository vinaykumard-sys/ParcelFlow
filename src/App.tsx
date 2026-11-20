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

function AdminRouteGuard() {
  const { currentRole, isAuthenticated } = useMobileStore();
  const isAdmin =
    isAuthenticated &&
    (currentRole === 'ADMIN' ||
      currentRole === 'SOCIETY_ADMIN' ||
      currentRole === 'SUPER_ADMIN');

  if (!isAdmin) {
    return (
      <Forbidden403Page
        currentRole={isAuthenticated ? currentRole : 'RESIDENT'}
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

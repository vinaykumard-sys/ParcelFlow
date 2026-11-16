import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Legal & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Last Updated: November 15, 2026 • ParcelFlow Technologies Pvt. Ltd.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-slate-300 text-sm sm:text-base leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Our Privacy Commitment
            </h2>
            <p>
              ParcelFlow is built on a core philosophy: <strong>your package details and personal routines are your private business.</strong> We do not sell your personal data, track your location when outside the app, or disclose your telephone number to delivery couriers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
            <p>To operate the parcel management service securely within your residential community, we collect:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong>Resident Identity:</strong> Name, registered flat/apartment number, and mobile phone number for authentication and OTP delivery.</li>
              <li><strong>Parcel Metadata:</strong> Courier carrier name (e.g. Amazon, Bluedart), tracking barcode string, package size tier, gate intake timestamp, and handover timestamp.</li>
              <li><strong>Handover Verification:</strong> Encrypted single-use QR and OTP tokens generated during pickup authorization.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">3. How Your Data is Used</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>To notify you promptly when a package matching your flat arrives at the society hub.</li>
              <li>To enforce cryptographic QR/OTP verification and prevent unauthorized collection or theft.</li>
              <li>To maintain an immutable, tamper-evident audit log for society safety and dispute resolution.</li>
              <li>To provide aggregate, anonymized delivery volume metrics to your society management committee.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">4. Strict Data Non-Disclosure</h2>
            <p>
              We never share your personal contact details with third-party delivery personnel. Couriers simply scan or log the package at the society entrance terminal; all resident matching and push notifications are handled within our secure, encrypted backend.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">5. Security & Encryption Standards</h2>
            <p>
              All communications between your mobile device, society gate tablets, and our cloud infrastructure are encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Access to society parcel records is strictly role-gated and restricted to verified security staff on active shift.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">6. Your Rights & Data Retention</h2>
            <p>
              You have the right to request access to your parcel pickup history or request the deletion of your account upon moving out of a participating society. Parcel handover verification logs are retained for a rolling 90-day period for security dispute safety before automatic anonymization.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">7. Contact Data Protection Officer</h2>
            <p>
              If you have any questions regarding this Privacy Policy or wish to exercise your rights under the Digital Personal Data Protection Act, contact our team at:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-blue-400">
              privacy@parcelflow.app • Attention: Data Privacy Officer
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

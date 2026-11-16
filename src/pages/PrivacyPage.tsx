import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileCheck2, ArrowLeft } from 'lucide-react';
import { Sticker } from '../components/Sticker';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FEF9F3] text-[#0A1128] pt-28 pb-20 selection:bg-amber-300 selection:text-[#0A1128]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-[2px] border-[#0A1128] text-xs font-black text-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            Back to Home
          </a>
        </div>

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-wrap items-center gap-2 mb-4 justify-center sm:justify-start">
            <Sticker color="mint" rotate="slight-left" size="sm">
              <Lock className="w-3.5 h-3.5 inline mr-1 text-[#0A1128]" />
              Data Privacy & Security
            </Sticker>
            <Sticker color="yellow" rotate="none" size="sm">
              DPDP Act Ready (India)
            </Sticker>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1128] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500">
            Last Updated: November 15, 2026 • ParcelFlow Technologies Pvt. Ltd. (Bengaluru, India)
          </p>
        </div>

        {/* Main Document Card */}
        <div className="rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-7 sm:p-12 space-y-10">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border-[2px] border-[#0A1128] flex items-center justify-center text-emerald-800 shadow-[1px_1px_0px_#0A1128]">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#0A1128]">
                1. Our Privacy Commitment
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              ParcelFlow is built on a core philosophy: <strong>your package details and personal routines are your private business.</strong> We do not sell your personal data, track your location when outside the app, or disclose your telephone number to delivery couriers.
            </p>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0A1128]">
              2. Information We Collect
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              To operate the parcel management service securely within your residential community, we collect:
            </p>
            <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1 shrink-0 stroke-[2.5]" />
                <span><strong>Resident Identity:</strong> Name, registered flat/apartment number, and mobile phone number for authentication and OTP delivery.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1 shrink-0 stroke-[2.5]" />
                <span><strong>Parcel Metadata:</strong> Carrier name (Amazon, Flipkart, Bluedart, etc.), tracking barcode string, package size tier, intake timestamp, and handover timestamp.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1 shrink-0 stroke-[2.5]" />
                <span><strong>Handover Verification:</strong> Encrypted single-use QR and OTP tokens generated during pickup authorization.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0A1128]">
              3. How Your Data is Used
            </h2>
            <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#0A1128] mt-2 shrink-0" />
                <span>To notify you promptly when a package matching your flat arrives at the society hub.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#0A1128] mt-2 shrink-0" />
                <span>To enforce cryptographic QR/OTP verification and prevent unauthorized collection or theft.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#0A1128] mt-2 shrink-0" />
                <span>To maintain an immutable, tamper-evident audit log for society safety and dispute resolution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#0A1128] mt-2 shrink-0" />
                <span>To provide aggregate, anonymized delivery volume metrics to your society management committee.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0A1128]">
              4. Strict Contact Non-Disclosure
            </h2>
            <div className="p-4 rounded-2xl bg-amber-50 border-[2px] border-amber-300 text-amber-950 text-xs sm:text-sm font-semibold">
              🔒 <strong>Guaranteed:</strong> We never share your telephone number with external delivery couriers. Couriers simply scan or log the package at the entrance terminal; resident routing and push alerts are processed entirely within our encrypted backend.
            </div>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0A1128]">
              5. Security & Encryption Standards
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              All communications between your mobile device, society gate tablets, and our cloud infrastructure are encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Access to society parcel records is strictly role-gated and restricted to verified security staff on active shift.
            </p>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0A1128]">
              6. Your Rights & Data Retention
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              You have the right to request access to your parcel pickup history or request the deletion of your account upon moving out of a participating society. Parcel handover verification logs are retained for a rolling 90-day period for security dispute safety before automatic anonymization.
            </p>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0A1128]">
              7. Contact Data Privacy Officer
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              If you have any questions regarding this Privacy Policy or wish to exercise your rights under the Digital Personal Data Protection Act, contact our team at:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border-[2px] border-[#0A1128] text-xs sm:text-sm font-mono font-bold text-blue-700 shadow-[2px_2px_0px_#0A1128]">
              privacy@parcelflow.app • Attention: Data Privacy Officer
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

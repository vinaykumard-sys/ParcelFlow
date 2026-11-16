import React from 'react';
import { FileText, Scale, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Sticker } from '../components/Sticker';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] pt-28 pb-20 selection:bg-amber-300 selection:text-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-[2px] border-[#0F172A] text-xs font-black text-[#0F172A] shadow-[2px_2px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            Back to Home
          </a>
        </div>

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-wrap items-center gap-2 mb-4 justify-center sm:justify-start">
            <Sticker color="blue" rotate="slight-left" size="sm">
              <Scale className="w-3.5 h-3.5 inline mr-1 text-white" />
              User Agreement
            </Sticker>
            <Sticker color="yellow" rotate="none" size="sm">
              Bengaluru, Karnataka
            </Sticker>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500">
            Effective Date: November 15, 2026 • ParcelFlow Technologies Pvt. Ltd.
          </p>
        </div>

        {/* Main Document Card */}
        <div className="rounded-3xl bg-white border-[3px] border-[#0F172A] shadow-[6px_6px_0px_#0F172A] p-7 sm:p-12 space-y-10">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 border-[2px] border-[#0F172A] flex items-center justify-center text-blue-800 shadow-[1px_1px_0px_#0F172A]">
                <FileText className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              By downloading, installing, or accessing the ParcelFlow mobile application or web portal, you agree to be bound by these Terms of Service. If you are using ParcelFlow on behalf of a residential apartment society or Resident Welfare Association (RWA), you represent that you have authority to bind that entity.
            </p>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
              2. Scope of Service
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              ParcelFlow provides digital parcel intake, resident notifications, temporary society hub storage management, and verified QR/OTP handover workflows. ParcelFlow does not operate an independent inter-city shipping network; our platform acts as the smart intake and collection layer within partner residential premises.
            </p>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
              3. Society Hub Storage & Responsibility
            </h2>
            <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#0F172A] mt-2 shrink-0" />
                <span><strong>Temporary Storage:</strong> Packages logged into the society Parcel Hub are intended for short-term resident pickup (typically within 48 to 72 hours).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#0F172A] mt-2 shrink-0" />
                <span><strong>Verification Tokens:</strong> Residents are responsible for safeguarding their QR code and 4-digit pickup OTP. Sharing your token constitutes full authorization for that individual to collect your parcel.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#0F172A] mt-2 shrink-0" />
                <span><strong>Prohibited Items:</strong> Flammable substances, hazardous materials, illegal contraband, and unsealed perishable meats or unpacked ice cream are not accepted for long-term hub storage.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
              4. Courier Interactions
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              When couriers deposit packages at your society hub, physical custody is logged with a time-stamped barcode scan. While ParcelFlow coordinates secure physical handover through verified security personnel, damage originating with the original third-party carrier before gate intake remains governed by that carrier’s merchant policy.
            </p>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
              5. Pilot Software Disclaimer
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              Software builds marked with "Pilot" or "Beta" (including Android build v0.1.0) are actively undergoing community refinement. While fully tested for operational security and verification accuracy, features may be updated regularly to improve reliability.
            </p>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
              6. Termination
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              Residents may discontinue use at any time by uninstalling the application. RWAs may terminate society pilot agreements pursuant to the written pilot MOU entered into with ParcelFlow Technologies.
            </p>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
              7. Governing Law & Jurisdiction
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
            </p>
          </section>

          <section className="space-y-3 border-t-[2px] border-slate-100 pt-8">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
              8. Contact Us
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              For legal inquiries regarding these terms:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border-[2px] border-[#0F172A] text-xs sm:text-sm font-mono font-bold text-blue-700 shadow-[2px_2px_0px_#0F172A]">
              legal@parcelflow.app • Legal Department
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

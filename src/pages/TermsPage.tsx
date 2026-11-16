import React from 'react';
import { FileText, Scale } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Effective Date: November 15, 2026 • ParcelFlow Technologies Pvt. Ltd.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-10 text-slate-300 text-sm sm:text-base leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By downloading, installing, or accessing the ParcelFlow mobile application or web portal, you agree to be bound by these Terms of Service. If you are using ParcelFlow on behalf of a residential apartment society or Resident Welfare Association (RWA), you represent that you have authority to bind that entity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. Scope of Service</h2>
            <p>
              ParcelFlow provides digital parcel intake, notification, temporary society hub storage management, and verified QR/OTP handover workflows. ParcelFlow does not operate an independent inter-city shipping network; our platform acts as the smart intake and collection layer within partner residential premises.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">3. Society Hub Storage & Responsibility</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong>Temporary Storage:</strong> Packages logged into the society Parcel Hub are intended for short-term resident pickup (typically within 48 to 72 hours).</li>
              <li><strong>Verification Tokens:</strong> Residents are responsible for safeguarding their QR code and 4-digit pickup OTP. Sharing your token constitutes full authorization for that individual to collect your parcel.</li>
              <li><strong>Prohibited Items:</strong> Flammable substances, hazardous materials, illegal contraband, and unsealed perishable meats or unpacked ice cream are not accepted for long-term hub storage.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">4. Courier Interactions</h2>
            <p>
              When couriers deposit packages at your society hub, physical custody is logged with a time-stamped barcode scan. While ParcelFlow coordinates secure physical handover through verified security personnel, damage originating with the original third-party carrier before gate intake remains governed by that carrier’s merchant policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">5. Pilot Software Disclaimer</h2>
            <p>
              Software builds marked with "Pilot" or "Beta" (including Android build v0.1.0) are actively undergoing community refinement. While fully tested for operational security and verification accuracy, features may be updated regularly to improve reliability.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">6. Termination</h2>
            <p>
              Residents may discontinue use at any time by uninstalling the application. RWAs may terminate society pilot agreements pursuant to the written pilot MOU entered into with ParcelFlow Technologies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">7. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">8. Contact Us</h2>
            <p>
              For legal inquiries regarding these terms:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-blue-400">
              legal@parcelflow.app • Legal Department
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

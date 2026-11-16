import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

type PickupState = 'idle' | 'selecting' | 'scheduled';

interface TimeOption {
  id: string;
  time: string;
  label: string;
  spotsLeft: number;
}

const TIME_OPTIONS: TimeOption[] = [
  { id: 't1', time: '5:00 PM – 5:30 PM', label: 'Early Evening', spotsLeft: 6 },
  { id: 't2', time: '6:30 PM – 7:00 PM', label: 'Work Return Slot', spotsLeft: 4 },
  { id: 't3', time: '8:00 PM – 8:30 PM', label: 'Recommended', spotsLeft: 12 },
  { id: 't4', time: '9:15 PM – 9:45 PM', label: 'Night Owl Slot', spotsLeft: 8 },
];

export const AppPreview: React.FC = () => {
  const [pickupState, setPickupState] = useState<PickupState>('scheduled');
  const [selectedTimeId, setSelectedTimeId] = useState<string>('t3');

  const phoneRef = useRef<HTMLDivElement>(null);
  const stickerScheduledRef = useRef<HTMLDivElement>(null);
  const stickerSecureRef = useRef<HTMLDivElement>(null);
  const stickerReadyRef = useRef<HTMLDivElement>(null);
  const stickerGateRef = useRef<HTMLDivElement>(null);
  const stickerSpeedRef = useRef<HTMLDivElement>(null);

  const selectedTime = TIME_OPTIONS.find((t) => t.id === selectedTimeId) || TIME_OPTIONS[2];

  // Subtle floating GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (phoneRef.current) {
        gsap.to(phoneRef.current, {
          y: -10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (stickerScheduledRef.current) {
        gsap.to(stickerScheduledRef.current, {
          y: -8,
          rotation: -8,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (stickerSecureRef.current) {
        gsap.to(stickerSecureRef.current, {
          y: 8,
          rotation: 8,
          duration: 2.9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (stickerReadyRef.current) {
        gsap.to(stickerReadyRef.current, {
          y: -7,
          rotation: -5,
          duration: 2.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (stickerGateRef.current) {
        gsap.to(stickerGateRef.current, {
          y: 6,
          rotation: 6,
          duration: 3.1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (stickerSpeedRef.current) {
        gsap.to(stickerSpeedRef.current, {
          y: -6,
          rotation: -4,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="app-preview" className="relative py-20 sm:py-28 bg-[#FEF9F3] text-[#0A1128] overflow-hidden">
      {/* Decorative Cartoon Blobs & Accents */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-blue-100/70 border-2 border-dashed border-blue-300 pointer-events-none -rotate-12" />
      <div className="absolute bottom-16 right-10 w-40 h-40 rounded-3xl bg-amber-100/70 border-2 border-dashed border-amber-300 pointer-events-none rotate-6" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#0A1128] text-xs font-black uppercase tracking-wider mb-4 shadow-cartoon-sm -rotate-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse" />
            Designed For Real Life 📱
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1128]">
            Meet <span className="text-[#2563EB]">ParcelFlow.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Take complete command of your society deliveries. Schedule pickups in 2 taps, receive zero spam calls, and experience secure handover using OTP/QR verification through the ParcelFlow app.
          </p>
        </div>

        {/* Centerpiece Phone Mockup with Floating Stickers */}
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          
          {/* ========================================================= */}
          {/* FLOATING CARTOON STICKERS SURROUNDING THE PHONE           */}
          {/* ========================================================= */}

          {/* Sticker 1: 'Scheduled ✓' (Top-Left) */}
          <div
            ref={stickerScheduledRef}
            className="hidden lg:flex absolute -left-12 top-28 z-30 items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#DCFCE7] border-2 border-[#0A1128] shadow-cartoon text-emerald-950 font-black text-sm select-none"
            style={{ transform: 'rotate(-6deg)' }}
          >
            <span className="w-6 h-6 rounded-full bg-[#10B981] border border-[#0A1128] text-white flex items-center justify-center text-xs font-black shadow-sm">
              ✓
            </span>
            <span>Scheduled ✓</span>
          </div>

          {/* Sticker 2: 'Secure 🔐' (Top-Right) */}
          <div
            ref={stickerSecureRef}
            className="hidden lg:flex absolute -right-10 top-24 z-30 items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#EDE9FE] border-2 border-[#0A1128] shadow-cartoon text-purple-950 font-black text-sm select-none"
            style={{ transform: 'rotate(5deg)' }}
          >
            <span className="text-base">🔐</span>
            <span>Secure 🔐</span>
          </div>

          {/* Sticker 3: 'Ready 📦' (Bottom-Left) */}
          <div
            ref={stickerReadyRef}
            className="hidden lg:flex absolute -left-10 bottom-32 z-30 items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FEF9C3] border-2 border-[#0A1128] shadow-cartoon text-amber-950 font-black text-sm select-none"
            style={{ transform: 'rotate(-4deg)' }}
          >
            <span className="text-base">📦</span>
            <span>Ready 📦</span>
          </div>

          {/* Sticker 4: 'Zero Gate Calls 🚫📞' (Bottom-Right) */}
          <div
            ref={stickerGateRef}
            className="hidden lg:flex absolute -right-12 bottom-36 z-30 items-center gap-2 px-4 py-2 rounded-2xl bg-[#FEE2E2] border-2 border-[#0A1128] shadow-cartoon text-rose-950 font-black text-xs select-none"
            style={{ transform: 'rotate(4deg)' }}
          >
            <span>🚫📞</span>
            <span>Zero Gate Calls</span>
          </div>

          {/* Sticker 5: '< 15s Pickup ⚡' (Middle-Left) */}
          <div
            ref={stickerSpeedRef}
            className="hidden lg:flex absolute -left-16 top-1/2 z-30 items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border-2 border-[#0A1128] shadow-cartoon text-[#0A1128] font-black text-xs select-none"
            style={{ transform: 'rotate(-3deg)' }}
          >
            <span>⚡</span>
            <span>&lt; 15s Pickup</span>
          </div>

          {/* ========================================================= */}
          {/* LARGE SMARTPHONE MOCKUP (CLEAN BRIGHT PARCELFLOW APP UI)  */}
          {/* ========================================================= */}
          <div
            ref={phoneRef}
            className="relative w-[340px] sm:w-[380px] rounded-[52px] p-3.5 sm:p-4 bg-white border-4 border-[#0A1128] shadow-cartoon-xl"
          >
            {/* Phone Buttons on frame sides */}
            <div className="absolute -left-[9px] top-28 w-[5px] h-10 bg-[#0A1128] rounded-l-md" />
            <div className="absolute -left-[9px] top-42 w-[5px] h-14 bg-[#0A1128] rounded-l-md" />
            <div className="absolute -left-[9px] top-60 w-[5px] h-14 bg-[#0A1128] rounded-l-md" />
            <div className="absolute -right-[9px] top-36 w-[5px] h-16 bg-[#0A1128] rounded-r-md" />

            {/* Inner Phone Screen */}
            <div className="relative w-full rounded-[42px] bg-[#FEF9F3] overflow-hidden border-2 border-[#0A1128] flex flex-col min-h-[640px] select-none shadow-inner">
              
              {/* Dynamic Island / Notch Status Bar */}
              <div className="pt-3 px-6 flex items-center justify-between text-[11px] font-mono text-[#0A1128] font-black z-20">
                <span>7:24</span>
                {/* Dynamic Island Pill */}
                <div className="w-24 h-5 rounded-full bg-[#0A1128] flex items-center justify-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-[10px]">5G</span>
                  {/* Battery Icon */}
                  <div className="w-5 h-2.5 rounded-sm border border-[#0A1128] p-0.5 flex items-center">
                    <div className="h-full w-3.5 bg-[#10B981] rounded-xs" />
                  </div>
                </div>
              </div>

              {/* CLEAN BRIGHT ParcelFlow App Header */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold">Good evening 👋</span>
                    <h3 className="text-base font-black text-[#0A1128]">Alex Sharma</h3>
                    <span className="text-[10px] text-[#2563EB] font-black">Apartment B-402 • Tower 2</span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#FBBF24] border-2 border-[#0A1128] flex items-center justify-center text-xs font-black text-[#0A1128] shadow-cartoon-sm">
                    AS
                  </div>
                </div>

                {/* 2 Parcels Waiting Friendly Pill */}
                <div className="mt-4 px-3.5 py-2 rounded-2xl bg-white border-2 border-[#0A1128] shadow-cartoon-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse" />
                    <span className="text-xs font-black text-[#0A1128]">2 Parcels Waiting</span>
                  </div>
                  <span className="text-[10px] font-black text-[#2563EB] px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                    Gate 2 Hub
                  </span>
                </div>
              </div>

              {/* Scrollable Parcel Cards Area */}
              <div className="flex-1 px-5 pb-4 space-y-3 overflow-y-auto">
                
                {/* Main Featured Parcel: Amazon */}
                <div className="p-4 rounded-3xl bg-white border-2 border-[#0A1128] shadow-cartoon">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] border-2 border-[#0A1128] flex items-center justify-center text-xl shrink-0 shadow-cartoon-sm">
                        📦
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#0A1128]">Amazon • Echo Dot Gen 5</div>
                        <div className="text-[10px] text-slate-500 font-bold">#PF-94821 • Arrived 10 mins ago</div>
                      </div>
                    </div>
                  </div>

                  {/* Shelf & Weight meta */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 border-t-2 border-[#0A1128]/10 pt-2 font-bold">
                    <span>Gate 2 Hub • Shelf B-08</span>
                    <span className="text-[#0A1128]">0.9 kg Box</span>
                  </div>

                  {/* Pickup Window info badge */}
                  <div className="mt-3 p-2.5 rounded-2xl bg-blue-50 border-2 border-[#0A1128] flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase text-blue-900">
                      Pickup Window:
                    </div>
                    <div className="text-xs font-black font-mono text-[#2563EB]">
                      {selectedTime.time}
                    </div>
                  </div>

                  {/* Scheduled Status or Schedule Button */}
                  {pickupState === 'scheduled' ? (
                    <div className="mt-3 p-3 rounded-2xl bg-[#DCFCE7] border-2 border-[#0A1128]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                          ✓ Pickup Scheduled
                        </span>
                        <span className="text-[10px] font-black text-emerald-800">Ready at Hub</span>
                      </div>

                      {/* App Handover Token Info */}
                      <div className="p-2.5 rounded-xl bg-white border-2 border-[#0A1128] shadow-cartoon-sm">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide">In-App Verification</span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600 leading-snug">
                          Secure handover using OTP/QR verification through the ParcelFlow app.
                        </div>
                      </div>

                      {/* Change time slot button */}
                      <div className="mt-2.5 pt-2 border-t border-emerald-900/20 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-900 font-bold">
                          Flash in-app pass at counter
                        </span>
                        <button
                          type="button"
                          onClick={() => setPickupState('selecting')}
                          className="text-[10px] font-black text-[#2563EB] hover:underline"
                        >
                          Change Slot
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPickupState('selecting')}
                      className="mt-3 w-full py-2.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs border-2 border-[#0A1128] shadow-cartoon flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>[ View Parcel / Schedule ]</span>
                      <span>→</span>
                    </button>
                  )}
                </div>

                {/* Second Parcel Card: Myntra */}
                <div className="p-3 rounded-2xl bg-white border-2 border-[#0A1128] shadow-cartoon-sm flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] border-2 border-[#0A1128] flex items-center justify-center text-lg shrink-0">
                    👟
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-[#0A1128] truncate">Myntra • Urban Sneakers</div>
                    <div className="text-[10px] text-slate-500 font-bold">Arrived 45 mins ago • Shelf C-02</div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FEF9F3] text-slate-700 border border-[#0A1128]">
                    Stored
                  </span>
                </div>

                {/* Bottom App Navigation Bar */}
                <div className="pt-2 flex items-center justify-around border-t-2 border-[#0A1128]/10 text-slate-600 text-[10px] font-black">
                  <div className="flex flex-col items-center text-[#2563EB]">
                    <span className="text-sm">📦</span>
                    Parcels
                  </div>
                  <div className="flex flex-col items-center hover:text-[#0A1128] transition-colors">
                    <span className="text-sm">📅</span>
                    Schedule
                  </div>
                  <div className="flex flex-col items-center hover:text-[#0A1128] transition-colors">
                    <span className="text-sm">🎟️</span>
                    Passes
                  </div>
                  <div className="flex flex-col items-center hover:text-[#0A1128] transition-colors">
                    <span className="text-sm">👤</span>
                    Profile
                  </div>
                </div>
              </div>

              {/* IN-PHONE BOTTOM SHEET MODAL (TIME SELECTOR) */}
              {pickupState === 'selecting' && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-30 flex flex-col justify-end">
                  <div className="rounded-t-[32px] bg-white border-t-2 border-[#0A1128] p-5 shadow-cartoon-xl">
                    {/* Drawer handle */}
                    <div className="w-10 h-1.5 bg-[#0A1128] rounded-full mx-auto mb-3" />

                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-black text-[#0A1128]">Choose Pickup Window</h4>
                      <button
                        type="button"
                        onClick={() => setPickupState('scheduled')}
                        className="text-slate-400 hover:text-[#0A1128] text-xs font-black"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mb-3">
                      Select when you would like to collect from Gate 2 Hub today.
                    </p>

                    {/* Time Options list */}
                    <div className="space-y-2 mb-3">
                      {TIME_OPTIONS.map((slot) => {
                        const isChosen = selectedTimeId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedTimeId(slot.id)}
                            className={`w-full p-2.5 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                              isChosen
                                ? 'bg-blue-50 border-[#0A1128] text-[#0A1128] shadow-cartoon-sm font-black'
                                : 'bg-white border-[#0A1128]/30 text-slate-700 hover:border-[#0A1128]'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-black">{slot.time}</div>
                              <div className="text-[10px] text-slate-500 font-medium">{slot.label}</div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                                {slot.spotsLeft} left
                              </span>
                              {isChosen ? (
                                <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-black">
                                  ✓
                                </span>
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Confirm Button */}
                    <button
                      type="button"
                      onClick={() => setPickupState('scheduled')}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs border-2 border-[#0A1128] shadow-cartoon transition-all"
                    >
                      Confirm Today at {selectedTime.time.split(' – ')[0]}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Home Indicator Line */}
            <div className="w-28 h-1 bg-[#0A1128] rounded-full mx-auto mt-2" />
          </div>

          {/* Mobile view fallback: stickers row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 lg:hidden">
            <span className="px-3 py-1.5 rounded-xl bg-[#DCFCE7] border-2 border-[#0A1128] text-emerald-950 font-black text-xs shadow-cartoon-sm">
              Scheduled ✓
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#EDE9FE] border-2 border-[#0A1128] text-purple-950 font-black text-xs shadow-cartoon-sm">
              Secure 🔐
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#FEF9C3] border-2 border-[#0A1128] text-amber-950 font-black text-xs shadow-cartoon-sm">
              Ready 📦
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppPreview;

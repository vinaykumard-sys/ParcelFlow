# PARCELFLOW — SYSTEM ARCHITECTURE & TECHNICAL MANUAL
**Your parcel. Your time.**

---

## 1. Executive Summary

ParcelFlow is a secure parcel-management and scheduled-handover platform engineered specifically for gated residential communities and apartment societies. It bridges the gap between couriers arriving at society gates and residents collecting packages at their convenience without waiting around or suffering corridor package theft.

The project is structured into 4 decoupled, production-grade applications:
1. **Public Marketing Website (`website/` & root):**
   - Built with React 19, TypeScript, Vite, Tailwind CSS, GSAP.
   - Purpose: Explain value proposition to residents, society management committees, and couriers.
   - Deployed at: `https://parcelflow-blush.vercel.app`.
2. **Mobile Application (`mobile-app/`):**
   - Built with **Flutter + Dart** (clean architecture).
   - Unified single APK MVP architecture supporting Role-Based Dynamic UI:
     - **Resident Portal:** 14 screens for tracking, 30-min slot scheduling, dynamic OTP, and cryptographic QR code pass.
     - **Staff Portal:** 16 screens for camera barcode scanning, intake, storage racks A/B assignment, and 15-second handover.
     - **Admin Portal:** 14 screens for society configuration, pickup window capacity, issue tracking, and audit reporting.
3. **Admin Management Dashboard (`admin-dashboard/`):**
   - Standalone web portal matching the reference visual identity sheet.
   - Real-time society metrics, resident directory, staff shifts, locker inventory, and dispute resolution.
4. **Backend & Database (`database/` & `backend/`):**
   - Supabase PostgreSQL with 16 normalized tables, strict Row Level Security (RLS), real-time subscriptions, and domain APIs.

---

## 2. Project Directory Structure

```text
ParcelFlow/
├── website/ (or root production website)
│   ├── public/
│   │   ├── downloads/android/ParcelFlow.apk
│   │   ├── parcelflow-brand-logo.png
│   │   └── rider-hero-perfect.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── AppPreview.tsx
│   │   └── pages/DownloadPage.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── mobile-app/
│   ├── pubspec.yaml
│   ├── assets/
│   ├── versions/
│   │   └── v0.1.0.json
│   ├── changelog/
│   │   └── CHANGELOG.md
│   └── lib/
│       ├── main.dart
│       ├── shared/
│       │   ├── models/ (User, Parcel, Resident, Staff, Token, etc.)
│       │   ├── services/ (Supabase, Auth, Storage, Notification, Update)
│       │   ├── theme/ (Colors, Typography, Retro cartoon styles)
│       │   └── widgets/ (Button, Badge, Card, Scanner, OtpTimer)
│       ├── resident_app/ (14 Screens)
│       ├── staff_app/ (16 Screens)
│       └── admin_app/ (14 Screens)
│
├── admin-dashboard/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/ (Modals, Navigation, Badges, Illustrations)
│       ├── screens/ (14 full tabs matching design reference)
│       └── services/ (adminService.ts, supabase_client.ts)
│
├── backend/
│   ├── supabase_client.ts
│   └── types.ts
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── ARCHITECTURE.md
│   └── API_DOCUMENTATION.md
│
└── downloads/
    └── android/
        └── ParcelFlow.apk
```

---

## 3. End-to-End Operational Lifecycle

```text
1. Courier Delivery:
   Courier arrives at Society Gate 1 -> Hands parcels over to Society Parcel Hub staff.

2. Staff Ingestion (Staff App):
   Staff opens Staff App -> Taps "Receive Parcel" -> Scans Courier Barcode ->
   Assigns Resident (Flat #) -> Assigns Storage Location (e.g. Rack B, Shelf 17) -> Confirms.

3. Automated Notification:
   Resident receives push notification & SMS alert:
   "📦 Amazon package arrived at Society Hub! Tap to schedule pickup."

4. Resident Scheduling (Resident App):
   Resident selects preferred 30-minute window (e.g., 8:00 PM – 8:30 PM).
   Database status updates to `SCHEDULED`. Hub reserves package in evening queue.

5. Secure Handover (At Hub):
   Resident arrives at Society Hub during their slot ->
   Taps "Generate OTP" (or shows dynamic QR code).
   Staff scans QR or enters single-use 6-digit OTP on Staff terminal.

6. Verification & Chain of Custody:
   Backend cryptographic check -> Confirms active token -> Marks `HANDED_OVER`.
   Immutable audit log created with timestamp, staff ID, resident ID, and verification method.
```

---

## 4. Controlled Parcel Status Lifecycle

```text
CREATED ──────────► RECEIVED ──────────► STORED ──────────► NOTIFIED
                                                              │
                                                              ▼
COMPLETED ◄─── HANDED_OVER ◄─── VERIFIED ◄─── READY_FOR_PICKUP ◄─── SCHEDULED
    │
    ├──► CANCELLED (Resident requested return or cancellation)
    └──► EXPIRED (Pickup window elapsed without collection)
```

---

## 5. Security & Row Level Security (RLS)

- **Residents:** Can only read and update parcels assigned to their own `resident_id` / apartment. Cannot see hub locker allocation details or staff shift logs.
- **Staff:** Authorized to scan barcodes, create parcel intake records, assign storage racks, and execute OTP/QR verifications. Cannot alter society configuration or delete audit logs.
- **Admins:** Full society oversight, ability to toggle pickup slots, adjust max capacity, resolve resident disputes, and export audit compliance logs.
- **Tokens:** Single-use, valid for 10 minutes maximum, tied strictly to `(parcel_id, resident_id)`. Automatically invalidated post-handover. Plaintext passwords or secrets are never exposed.

---

## 6. Versioning & Update Protocol

The mobile application implements in-app semantic update detection:
- Version specification: `mobile-app/versions/v0.1.0.json`.
- Current release: `0.1.0 (Build 1)`.
- If an update is detected, the app presents a non-intrusive modal informing users of the new feature rollout and pointing them to the verified APK download source.

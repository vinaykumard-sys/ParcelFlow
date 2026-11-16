# ParcelFlow Mobile App Changelog

## [0.1.0] - 2026-11-16

### Added
- **Unified Role-Based Architecture**: Single APK/IPA catering to Residents, Hub Staff, and Society Admins with instant role-switching and persistent secure tokens.
- **Design System & Theme**:
  - Cream background (`#FEF9F3`), Dark Navy borders (`#0A1128`), Royal Blue accents (`#1D4ED8` & `#2563EB`), Vibrant Orange (`#F97316`), and Mint Green (`#10B981`).
  - Tactile cartoon buttons, 2px borders, 4px solid shadow offsets, and playful status pills.
- **Resident Experience (14 Screens)**:
  1. Splash Screen & Brand Intro
  2. Quick Login / Mobile OTP Onboarding
  3. Resident Dashboard with active shipment count & quick pickup card
  4. Parcel List with categorized tabs (Incoming, Ready, Collected)
  5. Detailed Parcel view with tracking timeline and courier metadata
  6. Two-tap Pickup Slot Scheduler (30-minute intervals)
  7. High-security 4-digit OTP Screen with 5-minute countdown timer
  8. Cryptographic Handover QR Code display
  9. Parcel Collection History with delivery timestamps
  10. Resident Profile & Notification Preferences
  11. Authorized Collectors (Family, Maid, Neighbor delegation)
  12. Notification Center with society alerts
  13. Issue & Dispute Reporting modal (Damaged box, Wrong recipient)
  14. Gate Pass & Hub Security Help Guide
- **Staff Experience (16 Screens)**:
  1. Staff Secure Login & Hub Location Selector
  2. Live Hub Operator Dashboard with Today's Intake & Handover counters
  3. Receive Parcel form with auto-populating fields
  4. Integrated Barcode / AWB Camera Scanner (`mobile_scanner`)
  5. Instant Resident Directory search by flat number, name, or phone
  6. Storage Rack & Shelf Assignment (Rack A1-C12, Oversized bay)
  7. Hub Inventory List with multi-filter sorting
  8. Real-time Scheduled Pickups Queue for evening rush hours
  9. Handover Scanner for scanning Resident QR codes
  10. 4-digit OTP Manual Verification pad
  11. Handover Success confirmation screen with signature log
  12. Courier Partner Log (Amazon, Flipkart, Bluedart, Delhivery intake)
  13. Rack Capacity & Visual Shelf Heatmap
  14. Staff Shift Activity & Audit Trail
  15. Overdue / Long-uncollected Parcel Manager
  16. Staff Profile, Device Status & Offline Sync Manager
- **Admin Management Portal (14 Screens)**:
  1. Admin Splash & Society Switcher
  2. Society Selector (Lakeview Residency, Greenwood Heights, etc.)
  3. Executive KPI Dashboard (Today's Parcels, Collected, Scheduled, Pending)
  4. Role & Permission Manager
  5. Resident Directory Management with Flat # search & CSV Export
  6. Staff Roster & Access Control
  7. Parcel Hub Inventory Control & Storage capacity
  8. Real-time Tracking & Audit logs
  9. Pickup Slot Configuration & capacity throttles
  10. OTP/QR Verification Sandbox
  11. Society Broadcast & Notifications Center
  12. Analytics & Peak-hour Reports with bar graphs
  13. Resident Issue Resolution & Dispute Dashboard
  14. Society Settings & RWA Hub Configuration
- **Supabase Integration**:
  - Full client setup with resilient offline state fallback.
  - Models for User, Society, Resident, Staff, Parcel, Slot, Token, Audit, and Issues.

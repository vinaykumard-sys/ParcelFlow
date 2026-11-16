import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/app_scaffold.dart';
import '../shared/widgets/stat_card.dart';
import '../shared/widgets/parcel_card.dart';
import '../shared/widgets/cartoon_badge.dart';
import '../shared/services/auth_service.dart';
import '../shared/services/parcel_service.dart';
import '../shared/models/parcel_model.dart';
import 'parcel_details_screen.dart';
import 'schedule_pickup_screen.dart';
import 'otp_screen.dart';
import 'qr_display_screen.dart';

class ResidentDashboardScreen extends StatelessWidget {
  final Function(int) onNavigateTab;

  const ResidentDashboardScreen({super.key, required this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final parcelService = Provider.of<ParcelService>(context);

    final flatNumber = auth.currentUser?.flatNumber ?? 'A-402';
    final readyParcels = parcelService.getReadyParcels(flatNumber);
    final incomingParcels = parcelService.getIncomingParcels(flatNumber);
    final allResidentParcels = parcelService.getResidentParcels(flatNumber);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting & Society Hub Status
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.royalBlue,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.borderDark, width: AppColors.borderWidth),
              boxShadow: AppColors.cartoonShadow(offset: 4),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Hello, ${auth.currentUser?.fullName.split(' ').first ?? 'Arjun'} 👋',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${auth.currentUser?.tower} • Flat $flatNumber',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Colors.white.withOpacity(0.9),
                          ),
                        ),
                      ],
                    ),
                    const CartoonBadge(
                      text: 'Hub Open 🟢',
                      backgroundColor: AppColors.mintGreen,
                      textColor: AppColors.darkNavy,
                      rotationAngle: 0.05,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.location_on, color: Colors.white, size: 16),
                      SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'Gate 1 Hub Open • Pickups until 10:00 PM',
                          style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Quick KPI Cards
          Row(
            children: [
              Expanded(
                child: StatCard(
                  label: 'Ready for Pickup',
                  value: '${readyParcels.length}',
                  subtext: 'In Gate 1 Hub',
                  icon: Icons.mark_email_read_outlined,
                  accentColor: AppColors.mintGreen,
                  onTap: () => onNavigateTab(1),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: StatCard(
                  label: 'Incoming / In Storage',
                  value: '${incomingParcels.length}',
                  subtext: 'Delivered at Gate',
                  icon: Icons.inventory_2_outlined,
                  accentColor: AppColors.vibrantOrange,
                  onTap: () => onNavigateTab(1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Primary Action Box: Quick Pickup Voucher
          if (readyParcels.isNotEmpty) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Priority Pickup Ready ✨',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                ),
                TextButton(
                  onPressed: () => onNavigateTab(1),
                  child: const Text('View All', style: TextStyle(fontWeight: FontWeight.w800, color: AppColors.royalBlue)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            _readyHeroVoucher(context, readyParcels.first),
            const SizedBox(height: 24),
          ],

          // Recent Parcels Section
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Recent Society Parcels',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
              ),
              InkWell(
                onTap: () => onNavigateTab(1),
                child: const Text(
                  'Manage',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.royalBlue),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          if (allResidentParcels.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderDark, width: 2),
              ),
              child: const Center(
                child: Text('No parcels currently on record for your flat.'),
              ),
            )
          else
            ...allResidentParcels.take(3).map((parcel) {
              return ParcelCard(
                parcel: parcel,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => ParcelDetailsScreen(parcel: parcel)),
                  );
                },
                actionLabel: parcel.status == ParcelStatus.readyForPickup || parcel.status == ParcelStatus.scheduled
                    ? 'Show Pickup OTP / QR Code'
                    : 'Schedule Pickup Slot',
                onActionTap: () {
                  if (parcel.status == ParcelStatus.readyForPickup || parcel.status == ParcelStatus.scheduled) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => OtpScreen(parcel: parcel)),
                    );
                  } else {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => SchedulePickupScreen(parcel: parcel)),
                    );
                  }
                },
              );
            }),
        ],
      ),
    );
  }

  Widget _readyHeroVoucher(BuildContext context, ParcelModel parcel) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.mintLight,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderDark, width: AppColors.borderWidth),
        boxShadow: AppColors.cartoonShadow(offset: 4),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.pureWhite,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.borderDark, width: 1.5),
                    ),
                    child: Text(
                      parcel.courierName,
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    parcel.trackingNumber,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.mintGreen,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'READY',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'Stored in ${parcel.storageRack ?? "Rack A-12"} • Scheduled for ${parcel.pickupSlotTime ?? "8:00 PM – 8:30 PM"}',
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.slate800),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => OtpScreen(parcel: parcel)),
                    );
                  },
                  icon: const Icon(Icons.pin_rounded, size: 18),
                  label: const Text('Show OTP Code'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.royalBlue,
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: AppColors.borderDark, width: 1.5),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => QrDisplayScreen(parcel: parcel)),
                    );
                  },
                  icon: const Icon(Icons.qr_code_rounded, size: 18),
                  label: const Text('Show QR Pass'),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.darkNavy,
                    side: const BorderSide(color: AppColors.borderDark, width: 2),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

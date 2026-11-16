import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/stat_card.dart';
import '../shared/widgets/custom_button.dart';
import '../shared/widgets/cartoon_badge.dart';
import '../shared/services/auth_service.dart';
import '../shared/services/parcel_service.dart';
import '../shared/services/storage_service.dart';
import 'receive_parcel_screen.dart';
import 'barcode_scanner_screen.dart';
import 'otp_verification_screen.dart';
import 'handover_scanner_screen.dart';
import 'scheduled_pickups_screen.dart';
import 'storage_capacity_screen.dart';
import 'courier_log_screen.dart';

class StaffDashboardScreen extends StatelessWidget {
  final Function(int) onNavigateTab;

  const StaffDashboardScreen({super.key, required this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final parcelService = Provider.of<ParcelService>(context);
    final storageService = Provider.of<StorageService>(context);

    final totalParcels = parcelService.parcels.length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Operator shift status banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.darkNavy,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.borderDark, width: 2),
              boxShadow: AppColors.cartoonShadow(offset: 4),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.vibrantOrange,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Center(child: Text('👷‍♂️', style: TextStyle(fontSize: 22))),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          auth.currentUser?.fullName ?? 'Ramesh Kumar',
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Colors.white),
                        ),
                        Text(
                          'Hub Operator • Gate 1 Desk',
                          style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12, fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  ],
                ),
                const CartoonBadge(
                  text: 'ON SHIFT 🟢',
                  backgroundColor: AppColors.mintGreen,
                  textColor: AppColors.darkNavy,
                  rotationAngle: 0.04,
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // Primary Quick Action Buttons (Receive & Handover)
          Row(
            children: [
              Expanded(
                child: CustomButton(
                  text: '📥 Ingest Parcel',
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ReceiveParcelScreen()),
                    );
                  },
                  backgroundColor: AppColors.royalBlue,
                  height: 48,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: CustomButton(
                  text: '📲 Scan Resident QR',
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const HandoverScannerScreen()),
                    );
                  },
                  backgroundColor: AppColors.mintGreen,
                  textColor: AppColors.darkNavy,
                  height: 48,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const OtpVerificationScreen()),
                    );
                  },
                  icon: const Icon(Icons.dialpad_rounded, size: 18),
                  label: const Text('Verify 4-Digit OTP', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.darkNavy,
                    side: const BorderSide(color: AppColors.borderDark, width: 2),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const BarcodeScannerScreen()),
                    );
                  },
                  icon: const Icon(Icons.qr_code_scanner_rounded, size: 18),
                  label: const Text('Camera Barcode', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.darkNavy,
                    side: const BorderSide(color: AppColors.borderDark, width: 2),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Hub KPIs matching official reference sheet
          const Text(
            'Today\'s Hub Metrics',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
          ),
          const SizedBox(height: 12),

          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.45,
            children: [
              StatCard(
                label: 'Today Intake',
                value: '87',
                subtext: 'Couriers processed',
                icon: Icons.all_inbox_rounded,
                accentColor: AppColors.royalBlue,
                onTap: () => onNavigateTab(1),
              ),
              StatCard(
                label: 'Collected',
                value: '61',
                subtext: 'Verified by OTP/QR',
                icon: Icons.check_circle_outline_rounded,
                accentColor: AppColors.mintGreen,
                onTap: () => onNavigateTab(1),
              ),
              StatCard(
                label: 'Evening Queue',
                value: '18',
                subtext: 'Scheduled for tonight',
                icon: Icons.schedule_rounded,
                accentColor: AppColors.vibrantOrange,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ScheduledPickupsScreen()),
                  );
                },
              ),
              StatCard(
                label: 'Storage Racks',
                value: '${storageService.freeSlots} Free',
                subtext: '${storageService.occupiedSlots}/${storageService.totalSlots} Slots in use',
                icon: Icons.shelves,
                accentColor: AppColors.purple,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const StorageCapacityScreen()),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Quick Navigation Panels
          _quickHubActionTile(
            title: 'Courier Partner Log',
            subtitle: 'Amazon (42), Flipkart (23), BlueDart (11), Delhivery (7)',
            icon: Icons.local_shipping_outlined,
            color: AppColors.vibrantOrange,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CourierLogScreen()),
              );
            },
          ),
          const SizedBox(height: 10),
          _quickHubActionTile(
            title: 'Visual Rack Heatmap (Racks A & B)',
            subtitle: 'Inspect shelf assignments & cold storage capacity',
            icon: Icons.grid_view_rounded,
            color: AppColors.royalBlue,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StorageCapacityScreen()),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _quickHubActionTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderDark, width: 2),
        boxShadow: AppColors.cartoonShadow(offset: 3),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.12),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderDark, width: 1.5),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppColors.darkNavy)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.slate600)),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.slate400),
      ),
    );
  }
}

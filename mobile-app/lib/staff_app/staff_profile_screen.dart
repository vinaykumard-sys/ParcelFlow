import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/auth_service.dart';
import '../shared/services/supabase_service.dart';
import '../shared/widgets/custom_button.dart';

class StaffProfileScreen extends StatelessWidget {
  const StaffProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final user = auth.currentUser;

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Staff ID Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderDark, width: 2),
                boxShadow: AppColors.cartoonShadow(offset: 4),
              ),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: AppColors.vibrantOrange,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderDark, width: 2),
                    ),
                    child: const Center(
                      child: Text('👷‍♂️', style: TextStyle(fontSize: 30)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.fullName ?? 'Ramesh Kumar',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'Hub Operator (ID: STF-01)',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.vibrantOrange),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          user?.staffShift ?? 'Evening Shift (2 PM - 10 PM)',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.slate600),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Society Hub Station Info
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderDark, width: 2),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('STATION DETAILS', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: AppColors.slate600)),
                  const SizedBox(height: 10),
                  _detailRow('Society', auth.currentSociety?.name ?? 'Lakeview Residency'),
                  _detailRow('Terminal', 'Gate 1 Hub Operator Desk'),
                  _detailRow('Camera Device', 'Hardware Barcode Imager Ready'),
                  _detailRow('Cloud Sync', SupabaseService.isInitialized ? 'Connected (Supabase Cloud)' : 'Offline Resilient Cache Active'),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Shift End Action
            CustomButton(
              text: 'End Shift & Clock Out 🛑',
              onPressed: () {
                auth.logout();
              },
              backgroundColor: AppColors.slate200,
              textColor: AppColors.darkNavy,
              height: 48,
            ),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.slate600)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.darkNavy)),
        ],
      ),
    );
  }
}

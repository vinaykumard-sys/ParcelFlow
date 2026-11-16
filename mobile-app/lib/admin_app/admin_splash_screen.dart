import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';
import '../shared/widgets/cartoon_badge.dart';
import '../shared/services/auth_service.dart';

class AdminSplashScreen extends StatelessWidget {
  final VoidCallback onContinue;

  const AdminSplashScreen({super.key, required this.onContinue});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  CartoonBadge(
                    text: 'Admin Console 🛡️',
                    backgroundColor: AppColors.purple,
                    textColor: Colors.white,
                  ),
                ],
              ),
              Column(
                children: [
                  Container(
                    width: 110,
                    height: 110,
                    decoration: BoxDecoration(
                      color: AppColors.darkNavy,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppColors.borderDark, width: 2.5),
                      boxShadow: AppColors.cartoonShadow(offset: 5),
                    ),
                    child: const Center(
                      child: Icon(Icons.admin_panel_settings_rounded, size: 54, color: Colors.white),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'ParcelFlow Admin',
                    style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Executive Society Hub Oversight & Governance',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.royalBlue),
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Configure hub racks, manage resident directory, dispatch staff shifts, and audit secure deliveries with end-to-end transparency.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13, color: AppColors.slate600, height: 1.4),
                  ),
                ],
              ),
              CustomButton(
                text: 'Launch Admin Control Hub 🚀',
                onPressed: onContinue,
                backgroundColor: AppColors.royalBlue,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

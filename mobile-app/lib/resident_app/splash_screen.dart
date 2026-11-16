import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';
import '../shared/widgets/cartoon_badge.dart';
import '../shared/services/auth_service.dart';
import '../shared/models/user_model.dart';

class ResidentSplashScreen extends StatelessWidget {
  final VoidCallback onGetStarted;

  const ResidentSplashScreen({super.key, required this.onGetStarted});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Top Bar with society badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.pureWhite,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.borderDark, width: 1.5),
                    ),
                    child: const Row(
                      children: [
                        Text('⚡ ', style: TextStyle(fontSize: 14)),
                        Text(
                          'Version 0.1.0 • Live',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: AppColors.darkNavy,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const CartoonBadge(
                    text: 'Gated Hub 🚀',
                    backgroundColor: AppColors.vibrantOrange,
                    textColor: AppColors.pureWhite,
                    rotationAngle: 0.05,
                  ),
                ],
              ),

              // Hero Illustration & Slogan
              Column(
                children: [
                  Container(
                    width: 140,
                    height: 140,
                    decoration: BoxDecoration(
                      color: AppColors.royalBlue,
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: AppColors.borderDark, width: AppColors.thickBorderWidth),
                      boxShadow: AppColors.cartoonShadow(offset: 6),
                    ),
                    child: const Center(
                      child: Text('📦', style: TextStyle(fontSize: 70)),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'ParcelFlow',
                    style: TextStyle(
                      fontSize: 38,
                      fontWeight: FontWeight.w900,
                      color: AppColors.darkNavy,
                      letterSpacing: -1,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.mintLight,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.mintGreen, width: 1.5),
                    ),
                    child: const Text(
                      'Zero Spam Calls. 100% Secure Handover.',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF065F46),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'The smart parcel hub app for gated residential societies. Couriers drop at gate, you pick up on your schedule with OTP verification.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppColors.slate600,
                      height: 1.4,
                    ),
                  ),
                ],
              ),

              // Action Buttons
              Column(
                children: [
                  CustomButton(
                    text: 'Enter Resident Portal 🔑',
                    onPressed: onGetStarted,
                    backgroundColor: AppColors.royalBlue,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            Provider.of<AuthService>(context, listen: false).switchRole(UserRole.staff);
                          },
                          style: OutlinedButton.styleFrom(
                            backgroundColor: AppColors.pureWhite,
                            foregroundColor: AppColors.darkNavy,
                            side: const BorderSide(color: AppColors.borderDark, width: 2),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          child: const Text('Staff Login', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            Provider.of<AuthService>(context, listen: false).switchRole(UserRole.admin);
                          },
                          style: OutlinedButton.styleFrom(
                            backgroundColor: AppColors.pureWhite,
                            foregroundColor: AppColors.darkNavy,
                            side: const BorderSide(color: AppColors.borderDark, width: 2),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          child: const Text('Admin Login', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

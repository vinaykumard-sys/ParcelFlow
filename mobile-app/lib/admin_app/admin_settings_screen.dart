import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/auth_service.dart';
import '../shared/services/supabase_service.dart';
import '../shared/widgets/custom_button.dart';

class AdminSettingsScreen extends StatefulWidget {
  const AdminSettingsScreen({super.key});

  @override
  State<AdminSettingsScreen> createState() => _AdminSettingsScreenState();
}

class _AdminSettingsScreenState extends State<AdminSettingsScreen> {
  int _otpExpiryMinutes = 5;
  int _freeDemurrageHours = 72;
  bool _requireStaffSignature = true;
  bool _allowCollectorDelegation = true;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Society Identity Header
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderDark, width: 2),
                boxShadow: AppColors.cartoonShadow(offset: 4),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    auth.currentSociety?.name ?? 'Lakeview Residency',
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.darkNavy),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${auth.currentSociety?.address ?? "Outer Ring Road, Bellandur, Bengaluru"}',
                    style: const TextStyle(fontSize: 12, color: AppColors.slate600),
                  ),
                  const SizedBox(height: 12),
                  const Divider(color: AppColors.slate200),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Supabase Backend', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      Text(
                        SupabaseService.isInitialized ? 'Live Cloud Connected' : 'Resilient Offline State',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: SupabaseService.isInitialized ? AppColors.mintGreen : AppColors.royalBlue),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Hub Security & Handover Rules',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
            ),
            const SizedBox(height: 10),

            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderDark, width: 2),
              ),
              child: Column(
                children: [
                  ListTile(
                    title: const Text('OTP PIN Lifetime', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: Text('Expires after $_otpExpiryMinutes minutes for security'),
                    trailing: DropdownButton<int>(
                      value: _otpExpiryMinutes,
                      underline: const SizedBox(),
                      items: [3, 5, 10, 15].map((m) => DropdownMenuItem(value: m, child: Text('$m min'))).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _otpExpiryMinutes = val);
                      },
                    ),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    title: const Text('Locker Demurrage Grace Period', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: Text('Free storage up to $_freeDemurrageHours hours before penalty'),
                    trailing: DropdownButton<int>(
                      value: _freeDemurrageHours,
                      underline: const SizedBox(),
                      items: [24, 48, 72, 96].map((h) => DropdownMenuItem(value: h, child: Text('$h hrs'))).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _freeDemurrageHours = val);
                      },
                    ),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('Require Staff Verification Sign-Off', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    subtitle: const Text('Enforce employee badge ID check during physical release'),
                    value: _requireStaffSignature,
                    activeColor: AppColors.royalBlue,
                    onChanged: (val) => setState(() => _requireStaffSignature = val),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('Allow Resident Collector Delegation', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    subtitle: const Text('Permit household help and relatives to collect on resident\'s behalf'),
                    value: _allowCollectorDelegation,
                    activeColor: AppColors.mintGreen,
                    onChanged: (val) => setState(() => _allowCollectorDelegation = val),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Export Actions
            CustomButton(
              text: '📥 Export Full Society Audit Logs (CSV)',
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Audit log CSV exported to device storage')),
                );
              },
              backgroundColor: AppColors.slate800,
              height: 48,
            ),
            const SizedBox(height: 12),

            // Exit Admin
            CustomButton(
              text: 'Sign Out Of Admin Console',
              onPressed: () => auth.logout(),
              backgroundColor: AppColors.slate200,
              textColor: AppColors.darkNavy,
              height: 48,
            ),
          ],
        ),
      ),
    );
  }
}

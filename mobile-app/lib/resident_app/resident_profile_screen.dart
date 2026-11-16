import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/auth_service.dart';
import '../shared/services/update_service.dart';
import '../shared/widgets/custom_button.dart';
import 'authorized_collectors_screen.dart';
import 'society_help_screen.dart';

class ResidentProfileScreen extends StatefulWidget {
  const ResidentProfileScreen({super.key});

  @override
  State<ResidentProfileScreen> createState() => _ResidentProfileScreenState();
}

class _ResidentProfileScreenState extends State<ResidentProfileScreen> {
  bool _smsAlerts = true;
  bool _whatsappAlerts = true;
  bool _perishableUrgentAlert = true;
  bool _quietHours = false;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final user = auth.currentUser;
    final updateService = Provider.of<UpdateService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Card
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
                      color: AppColors.royalBlue,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderDark, width: 2),
                    ),
                    child: const Center(
                      child: Text('👨‍💼', style: TextStyle(fontSize: 30)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.fullName ?? 'Arjun Kumar',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${user?.tower ?? "Tower A"} • Unit ${user?.flatNumber ?? "A-402"}',
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.royalBlue),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          user?.phone ?? '+91 98765 43210',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.slate600),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Navigation Options
            _menuTile(
              title: 'Authorized Collectors (Delegation)',
              subtitle: 'Manage family members & house staff with pickup access',
              icon: Icons.group_outlined,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const AuthorizedCollectorsScreen()),
                );
              },
            ),
            _menuTile(
              title: 'Society Hub Guide & Gate Rules',
              subtitle: 'Locker hours, contact numbers & cold storage rules',
              icon: Icons.help_outline_rounded,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SocietyHelpScreen()),
                );
              },
            ),
            const SizedBox(height: 20),

            // Notification Preferences
            const Text(
              'Notification Preferences',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
            ),
            const SizedBox(height: 10),
            Container(
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderDark, width: 2),
              ),
              child: Column(
                children: [
                  SwitchListTile(
                    title: const Text('SMS Arrival Alerts', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                    subtitle: const Text('Direct SMS when courier drops box at Gate 1', style: TextStyle(fontSize: 11)),
                    value: _smsAlerts,
                    activeColor: AppColors.royalBlue,
                    onChanged: (val) => setState(() => _smsAlerts = val),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('WhatsApp Notifications', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                    subtitle: const Text('OTP & QR pass sent directly to WhatsApp', style: TextStyle(fontSize: 11)),
                    value: _whatsappAlerts,
                    activeColor: AppColors.mintGreen,
                    onChanged: (val) => setState(() => _whatsappAlerts = val),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('Perishable / Fresh Urgent Ping', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                    subtitle: const Text('Immediate alert for groceries & milk packages', style: TextStyle(fontSize: 11)),
                    value: _perishableUrgentAlert,
                    activeColor: AppColors.vibrantOrange,
                    onChanged: (val) => setState(() => _perishableUrgentAlert = val),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('Quiet Hours (10 PM - 7 AM)', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                    subtitle: const Text('Mute non-urgent delivery notifications at night', style: TextStyle(fontSize: 11)),
                    value: _quietHours,
                    activeColor: AppColors.purple,
                    onChanged: (val) => setState(() => _quietHours = val),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // App Version & Diagnostics
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.slate100,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.slate200, width: 1.5),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('ParcelFlow Mobile v0.1.0', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppColors.darkNavy)),
                      Text('Build 1 • Supabase Realtime Sync', style: TextStyle(fontSize: 11, color: AppColors.slate600)),
                    ],
                  ),
                  TextButton(
                    onPressed: () {
                      updateService.checkForUpdates();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Your ParcelFlow app is up to date (v0.1.0)')),
                      );
                    },
                    child: const Text('Check Update', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.royalBlue)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Sign Out
            CustomButton(
              text: 'Sign Out Of Resident Portal',
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

  Widget _menuTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderDark, width: 2),
        boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
      ),
      child: ListTile(
        onTap: onTap,
        leading: Icon(icon, color: AppColors.royalBlue),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppColors.darkNavy)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.slate600)),
        trailing: const Icon(Icons.chevron_right, color: AppColors.slate400),
      ),
    );
  }
}

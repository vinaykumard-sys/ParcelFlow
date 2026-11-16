import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/models/user_model.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/auth_service.dart';

class RoleSwitcherScreen extends StatelessWidget {
  const RoleSwitcherScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Role-Based Access Switcher'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.royalBlue, width: 2),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.security, color: AppColors.royalBlue, size: 24),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'ParcelFlow uses a unified cross-platform mobile architecture. Switch identities to test permissions for each society persona:',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF1E3A8A)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              _roleCard(
                title: 'Resident Portal',
                identity: 'Arjun Kumar (Flat A-402, Lakeview)',
                description: 'Schedule pickups, generate secure OTP & QR passes, view delivery history and delegate family members.',
                icon: Icons.person_rounded,
                color: AppColors.royalBlue,
                isSelected: auth.currentRole == UserRole.resident,
                onTap: () {
                  auth.switchRole(UserRole.resident);
                  Navigator.pop(context);
                },
              ),
              const SizedBox(height: 14),

              _roleCard(
                title: 'Hub Staff Portal',
                identity: 'Ramesh Kumar (Gate 1 Hub Operator)',
                description: 'Scan incoming courier barcodes, assign storage shelves (Rack A/B/Cold), and verify resident OTP/QR codes.',
                icon: Icons.badge_rounded,
                color: AppColors.vibrantOrange,
                isSelected: auth.currentRole == UserRole.staff,
                onTap: () {
                  auth.switchRole(UserRole.staff);
                  Navigator.pop(context);
                },
              ),
              const SizedBox(height: 14),

              _roleCard(
                title: 'Society Admin Portal',
                identity: 'Dr. Vikram Malhotra (RWA President)',
                description: 'Configure pickup slot throttles, inspect society metrics, oversee staff roster and resolve disputes.',
                icon: Icons.admin_panel_settings_rounded,
                color: AppColors.purple,
                isSelected: auth.currentRole == UserRole.admin,
                onTap: () {
                  auth.switchRole(UserRole.admin);
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _roleCard({
    required String title,
    required String identity,
    required String description,
    required IconData icon,
    required Color color,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: isSelected ? color.withOpacity(0.08) : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isSelected ? color : AppColors.borderDark,
          width: isSelected ? 2.5 : 2,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.borderDark,
            offset: Offset(isSelected ? 2 : 3.5, isSelected ? 2 : 3.5),
            blurRadius: 0,
          ),
        ],
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.borderDark, width: 1.5),
          ),
          child: Icon(icon, color: color, size: 26),
        ),
        title: Row(
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(6)),
                child: const Text('ACTIVE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ],
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(identity, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: color)),
            const SizedBox(height: 4),
            Text(description, style: const TextStyle(fontSize: 11, color: AppColors.slate600, height: 1.3)),
          ],
        ),
      ),
    );
  }
}

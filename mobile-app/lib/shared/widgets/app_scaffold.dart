import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/notification_service.dart';
import '../models/user_model.dart';
import '../models/society_model.dart';
import '../theme/app_colors.dart';

class AppScaffold extends StatelessWidget {
  final String title;
  final Widget body;
  final Widget? floatingActionButton;
  final List<Widget>? actions;
  final int? currentNavIndex;
  final Function(int)? onNavIndexChanged;
  final List<BottomNavigationBarItem>? navItems;

  const AppScaffold({
    super.key,
    required this.title,
    required this.body,
    this.floatingActionButton,
    this.actions,
    this.currentNavIndex,
    this.onNavIndexChanged,
    this.navItems,
  });

  void _showRoleSwitcher(BuildContext context) {
    final auth = Provider.of<AuthService>(context, listen: false);
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.creamBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        side: BorderSide(color: AppColors.borderDark, width: 2),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Switch Portal Role',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: AppColors.darkNavy,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'ParcelFlow unified architecture lets you preview Resident, Staff, and Admin experiences seamlessly:',
                  style: TextStyle(fontSize: 13, color: AppColors.slate600, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 16),
                _roleTile(
                  context: ctx,
                  role: UserRole.resident,
                  title: 'Resident Portal',
                  subtitle: 'Arjun Kumar • Flat A-402',
                  icon: Icons.person_rounded,
                  color: AppColors.royalBlue,
                  isSelected: auth.currentRole == UserRole.resident,
                  onTap: () {
                    auth.switchRole(UserRole.resident);
                    Navigator.pop(ctx);
                  },
                ),
                const SizedBox(height: 10),
                _roleTile(
                  context: ctx,
                  role: UserRole.staff,
                  title: 'Hub Staff Portal',
                  subtitle: 'Ramesh K • Evening Shift Operator',
                  icon: Icons.badge_rounded,
                  color: AppColors.vibrantOrange,
                  isSelected: auth.currentRole == UserRole.staff,
                  onTap: () {
                    auth.switchRole(UserRole.staff);
                    Navigator.pop(ctx);
                  },
                ),
                const SizedBox(height: 10),
                _roleTile(
                  context: ctx,
                  role: UserRole.admin,
                  title: 'Society Admin Portal',
                  subtitle: 'Dr. Vikram M • RWA President',
                  icon: Icons.admin_panel_settings_rounded,
                  color: AppColors.purple,
                  isSelected: auth.currentRole == UserRole.admin,
                  onTap: () {
                    auth.switchRole(UserRole.admin);
                    Navigator.pop(ctx);
                  },
                ),
                const SizedBox(height: 16),
                // Society Switcher
                const Text(
                  'Active Society',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.darkNavy),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: auth.availableSocieties.map((soc) {
                    final isSel = auth.currentSociety?.id == soc.id;
                    return ChoiceChip(
                      label: Text(soc.name),
                      selected: isSel,
                      selectedColor: AppColors.mintLight,
                      labelStyle: TextStyle(
                        color: isSel ? AppColors.darkNavy : AppColors.slate600,
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                      ),
                      onSelected: (_) {
                        auth.selectSociety(soc);
                        Navigator.pop(ctx);
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _roleTile({
    required BuildContext context,
    required UserRole role,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.12) : AppColors.pureWhite,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? color : AppColors.borderDark,
            width: isSelected ? 2 : 1.5,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppColors.darkNavy),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 12, color: AppColors.slate600, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Icon(Icons.check_circle_rounded, color: color, size: 22),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final notifs = Provider.of<NotificationService>(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            // Brand Cube Icon / Logo
            Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                color: AppColors.royalBlue,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.borderDark, width: 1.5),
              ),
              child: const Center(
                child: Text('📦', style: TextStyle(fontSize: 16)),
              ),
            ),
            const SizedBox(width: 8),
            Text(title),
          ],
        ),
        actions: [
          // Society & Role Pill Button
          InkWell(
            onTap: () => _showRoleSwitcher(context),
            borderRadius: BorderRadius.circular(20),
            child: Container(
              margin: const EdgeInsets.symmetric(vertical: 10),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderDark, width: 1.5),
                boxShadow: const [
                  BoxShadow(color: AppColors.borderDark, offset: Offset(1.5, 1.5), blurRadius: 0),
                ],
              ),
              child: Row(
                children: [
                  Icon(
                    auth.currentRole == UserRole.resident
                        ? Icons.person
                        : auth.currentRole == UserRole.staff
                            ? Icons.badge
                            : Icons.admin_panel_settings,
                    size: 14,
                    color: AppColors.royalBlue,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    auth.currentRole.displayName,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: AppColors.darkNavy,
                    ),
                  ),
                  const Icon(Icons.arrow_drop_down, size: 16, color: AppColors.darkNavy),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Notification Bell
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_none_rounded, color: AppColors.darkNavy),
                onPressed: () {
                  // Opens Notifications Center
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('${notifs.unreadCount} unread society notifications'),
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
              ),
              if (notifs.unreadCount > 0)
                Positioned(
                  top: 10,
                  right: 10,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: AppColors.vibrantOrange,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '${notifs.unreadCount}',
                      style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
            ],
          ),
          if (actions != null) ...actions!,
          const SizedBox(width: 6),
        ],
      ),
      body: body,
      floatingActionButton: floatingActionButton,
      bottomNavigationBar: navItems != null
          ? Container(
              decoration: const BoxDecoration(
                color: AppColors.pureWhite,
                border: Border(top: BorderSide(color: AppColors.borderDark, width: 2)),
              ),
              child: BottomNavigationBar(
                currentIndex: currentNavIndex ?? 0,
                onTap: onNavIndexChanged,
                backgroundColor: AppColors.pureWhite,
                selectedItemColor: AppColors.royalBlue,
                unselectedItemColor: AppColors.slate400,
                selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12),
                unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 11),
                type: BottomNavigationBarType.fixed,
                elevation: 0,
                items: navItems!,
              ),
            )
          : null,
    );
  }
}

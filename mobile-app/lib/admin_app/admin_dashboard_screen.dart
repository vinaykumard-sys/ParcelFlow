import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/stat_card.dart';
import '../shared/widgets/cartoon_badge.dart';
import '../shared/services/auth_service.dart';
import '../shared/services/parcel_service.dart';
import 'resident_management_screen.dart';
import 'staff_management_screen.dart';
import 'parcel_hub_inventory_screen.dart';
import 'parcel_tracking_screen.dart';
import 'pickup_slot_config_screen.dart';
import 'otp_scan_verify_screen.dart';
import 'admin_notifications_screen.dart';
import 'reports_screen.dart';
import 'issue_resolution_screen.dart';
import 'admin_settings_screen.dart';
import 'society_selection_screen.dart';
import 'role_switcher_screen.dart';
import '../staff_app/receive_parcel_screen.dart';

class AdminDashboardScreen extends StatelessWidget {
  final Function(int)? onNavigateTab;

  const AdminDashboardScreen({super.key, this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final society = auth.currentSociety;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Society Header Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.pureWhite,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.borderDark, width: 2),
              boxShadow: AppColors.cartoonShadow(offset: 4),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          society?.name ?? 'Lakeview Residency',
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.darkNavy),
                        ),
                        const SizedBox(width: 8),
                        InkWell(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const SocietySelectionScreen()),
                            );
                          },
                          child: const Icon(Icons.swap_horiz_rounded, color: AppColors.royalBlue, size: 20),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${society?.city ?? "Bengaluru"} • ${society?.totalUnits ?? 420} Units • Gate 1 Hub',
                      style: const TextStyle(fontSize: 12, color: AppColors.slate600, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const CartoonBadge(
                  text: 'ADMIN MODE 👑',
                  backgroundColor: AppColors.purple,
                  textColor: Colors.white,
                  rotationAngle: 0.04,
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // Reference Image Top KPIs: 87 Today, 61 Collected, 18 Scheduled, 8 Pending
          const Text(
            'Live Hub Metrics',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
          ),
          const SizedBox(height: 10),

          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 1.45,
            children: [
              StatCard(
                label: 'Today Total',
                value: '87',
                subtext: 'Incoming flow',
                icon: Icons.all_inbox_rounded,
                accentColor: AppColors.royalBlue,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ParcelHubInventoryScreen()),
                  );
                },
              ),
              StatCard(
                label: 'Collected',
                value: '61',
                subtext: 'Released via OTP',
                icon: Icons.check_circle_rounded,
                accentColor: AppColors.mintGreen,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ParcelHubInventoryScreen()),
                  );
                },
              ),
              StatCard(
                label: 'Scheduled',
                value: '18',
                subtext: 'Evening rush',
                icon: Icons.access_time_filled_rounded,
                accentColor: AppColors.vibrantOrange,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const PickupSlotConfigScreen()),
                  );
                },
              ),
              StatCard(
                label: 'Pending In Hub',
                value: '8',
                subtext: 'In Rack A & B',
                icon: Icons.shelves,
                accentColor: AppColors.purple,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ParcelHubInventoryScreen()),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 18),

          // Quick Action Buttons matching reference image
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const OtpScanVerifyScreen()),
                    );
                  },
                  icon: const Icon(Icons.qr_code_scanner, size: 16),
                  label: const Text('Scan OTP / QR', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.royalBlue,
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: AppColors.borderDark, width: 2),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ReceiveParcelScreen()),
                    );
                  },
                  icon: const Icon(Icons.add_box, size: 16),
                  label: const Text('Receive Parcel', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.mintGreen,
                    foregroundColor: AppColors.darkNavy,
                    side: const BorderSide(color: AppColors.borderDark, width: 2),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ResidentManagementScreen()),
                    );
                  },
                  icon: const Icon(Icons.person_add, size: 16),
                  label: const Text('Add Resident', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                  style: ElevatedButton.styleFrom(
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
          const SizedBox(height: 22),

          // Admin Management Modules Navigation
          const Text(
            'Society Administration Modules',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
          ),
          const SizedBox(height: 12),

          _adminModuleTile(
            title: 'Resident Management & Directory',
            subtitle: 'Directory of 420 units, active residents, phone search',
            icon: Icons.people_alt_rounded,
            color: AppColors.royalBlue,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ResidentManagementScreen()),
              );
            },
          ),
          _adminModuleTile(
            title: 'Staff Management & Shifts',
            subtitle: '12 team members: Hub operators, security, maintenance',
            icon: Icons.badge_rounded,
            color: AppColors.vibrantOrange,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StaffManagementScreen()),
              );
            },
          ),
          _adminModuleTile(
            title: 'Parcel Hub Inventory (112 Total)',
            subtitle: '61 Ready, 18 Scheduled, 33 in Racks A & B',
            icon: Icons.inventory_rounded,
            color: AppColors.purple,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ParcelHubInventoryScreen()),
              );
            },
          ),
          _adminModuleTile(
            title: 'Pickup-Slot Configuration',
            subtitle: 'Toggle 6:00-9:30 intervals, throttle hourly capacities',
            icon: Icons.tune_rounded,
            color: AppColors.mintGreen,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const PickupSlotConfigScreen()),
              );
            },
          ),
          _adminModuleTile(
            title: 'Analytics & Peak Hour Reports',
            subtitle: 'Daily, weekly, and monthly delivery distribution graphs',
            icon: Icons.bar_chart_rounded,
            color: Colors.indigo,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ReportsScreen()),
              );
            },
          ),
          _adminModuleTile(
            title: 'Issue Resolution & Disputes',
            subtitle: 'Open and resolved resident tickets & courier damage claims',
            icon: Icons.gavel_rounded,
            color: AppColors.warningRed,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const IssueResolutionScreen()),
              );
            },
          ),
          _adminModuleTile(
            title: 'Society Settings & Audit Logs',
            subtitle: 'Locker rules, OTP timeouts, RLS policies, export CSV',
            icon: Icons.settings_suggest_rounded,
            color: AppColors.slate800,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AdminSettingsScreen()),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _adminModuleTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderDark, width: 2),
        boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
      ),
      child: ListTile(
        onTap: onTap,
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.12),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppColors.borderDark, width: 1.5),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppColors.darkNavy)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.slate600)),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.slate400),
      ),
    );
  }
}

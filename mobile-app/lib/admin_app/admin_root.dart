import 'package:flutter/material.dart';
import '../shared/widgets/app_scaffold.dart';
import 'admin_dashboard_screen.dart';
import 'parcel_hub_inventory_screen.dart';
import 'reports_screen.dart';
import 'admin_settings_screen.dart';

class AdminRootScreen extends StatefulWidget {
  const AdminRootScreen({super.key});

  @override
  State<AdminRootScreen> createState() => _AdminRootScreenState();
}

class _AdminRootScreenState extends State<AdminRootScreen> {
  int _navIndex = 0;

  void _setNavIndex(int index) {
    setState(() => _navIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      AdminDashboardScreen(onNavigateTab: _setNavIndex),
      const ParcelHubInventoryScreen(),
      const ReportsScreen(),
      const AdminSettingsScreen(),
    ];

    final List<String> titles = [
      'Admin Executive Hub',
      'Inventory Control',
      'Delivery Reports',
      'Society Settings',
    ];

    return AppScaffold(
      title: titles[_navIndex],
      currentNavIndex: _navIndex,
      onNavIndexChanged: _setNavIndex,
      navItems: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard_outlined),
          activeIcon: Icon(Icons.dashboard_rounded),
          label: 'Overview',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.inventory_2_outlined),
          activeIcon: Icon(Icons.inventory_2_rounded),
          label: 'Inventory',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.analytics_outlined),
          activeIcon: Icon(Icons.analytics_rounded),
          label: 'Reports',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.tune_outlined),
          activeIcon: Icon(Icons.tune_rounded),
          label: 'Settings',
        ),
      ],
      body: IndexedStack(
        index: _navIndex,
        children: pages,
      ),
    );
  }
}

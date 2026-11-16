import 'package:flutter/material.dart';
import '../shared/widgets/app_scaffold.dart';
import 'staff_dashboard_screen.dart';
import 'staff_parcel_list_screen.dart';
import 'receive_parcel_screen.dart';
import 'staff_profile_screen.dart';

class StaffRootScreen extends StatefulWidget {
  const StaffRootScreen({super.key});

  @override
  State<StaffRootScreen> createState() => _StaffRootScreenState();
}

class _StaffRootScreenState extends State<StaffRootScreen> {
  int _navIndex = 0;

  void _setNavIndex(int index) {
    setState(() => _navIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      StaffDashboardScreen(onNavigateTab: _setNavIndex),
      const StaffParcelListScreen(),
      const StaffProfileScreen(),
    ];

    final List<String> titles = [
      'Hub Operator Desk',
      'Hub Inventory',
      'Staff Operator Profile',
    ];

    return AppScaffold(
      title: titles[_navIndex],
      currentNavIndex: _navIndex,
      onNavIndexChanged: _setNavIndex,
      navItems: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard_outlined),
          activeIcon: Icon(Icons.dashboard_rounded),
          label: 'Desk',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.inventory_2_outlined),
          activeIcon: Icon(Icons.inventory_2_rounded),
          label: 'Inventory',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.badge_outlined),
          activeIcon: Icon(Icons.badge_rounded),
          label: 'Staff ID',
        ),
      ],
      floatingActionButton: _navIndex == 0
          ? FloatingActionButton.extended(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ReceiveParcelScreen()),
                );
              },
              backgroundColor: const Color(0xFF1D4ED8),
              foregroundColor: Colors.white,
              icon: const Icon(Icons.add_box_rounded),
              label: const Text('Ingest Parcel', style: TextStyle(fontWeight: FontWeight.w900)),
            )
          : null,
      body: IndexedStack(
        index: _navIndex,
        children: pages,
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../shared/widgets/app_scaffold.dart';
import 'resident_dashboard_screen.dart';
import 'parcel_list_screen.dart';
import 'parcel_history_screen.dart';
import 'resident_profile_screen.dart';

class ResidentRootScreen extends StatefulWidget {
  const ResidentRootScreen({super.key});

  @override
  State<ResidentRootScreen> createState() => _ResidentRootScreenState();
}

class _ResidentRootScreenState extends State<ResidentRootScreen> {
  int _navIndex = 0;

  void _setNavIndex(int index) {
    setState(() => _navIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      ResidentDashboardScreen(onNavigateTab: _setNavIndex),
      const ParcelListScreen(),
      const ParcelHistoryScreen(),
      const ResidentProfileScreen(),
    ];

    final List<String> titles = [
      'ParcelFlow Hub',
      'My Parcels',
      'Collection History',
      'Resident Profile',
    ];

    return AppScaffold(
      title: titles[_navIndex],
      currentNavIndex: _navIndex,
      onNavIndexChanged: _setNavIndex,
      navItems: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard_outlined),
          activeIcon: Icon(Icons.dashboard_rounded),
          label: 'Hub',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.inventory_2_outlined),
          activeIcon: Icon(Icons.inventory_2_rounded),
          label: 'Parcels',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.history_outlined),
          activeIcon: Icon(Icons.history_rounded),
          label: 'History',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          activeIcon: Icon(Icons.person),
          label: 'Profile',
        ),
      ],
      body: IndexedStack(
        index: _navIndex,
        children: pages,
      ),
    );
  }
}

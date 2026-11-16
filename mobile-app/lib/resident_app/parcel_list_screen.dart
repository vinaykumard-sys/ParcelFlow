import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/auth_service.dart';
import '../shared/services/parcel_service.dart';
import '../shared/widgets/parcel_card.dart';
import '../shared/models/parcel_model.dart';
import 'parcel_details_screen.dart';
import 'schedule_pickup_screen.dart';
import 'otp_screen.dart';

class ParcelListScreen extends StatefulWidget {
  const ParcelListScreen({super.key});

  @override
  State<ParcelListScreen> createState() => _ParcelListScreenState();
}

class _ParcelListScreenState extends State<ParcelListScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  List<ParcelModel> _filterParcels(List<ParcelModel> list) {
    if (_searchQuery.isEmpty) return list;
    return list.where((p) =>
      p.trackingNumber.toLowerCase().contains(_searchQuery.toLowerCase()) ||
      p.courierName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
      p.recipientName.toLowerCase().contains(_searchQuery.toLowerCase())
    ).toList();
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final parcelService = Provider.of<ParcelService>(context);
    final flatNumber = auth.currentUser?.flatNumber ?? 'A-402';

    final readyList = _filterParcels(parcelService.getReadyParcels(flatNumber));
    final incomingList = _filterParcels(parcelService.getIncomingParcels(flatNumber));
    final collectedList = _filterParcels(parcelService.getCollectedParcels(flatNumber));

    return Column(
      children: [
        // Search & Filter header
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: TextField(
            controller: _searchController,
            onChanged: (val) => setState(() => _searchQuery = val),
            decoration: InputDecoration(
              hintText: 'Search by tracking # or courier...',
              prefixIcon: const Icon(Icons.search_rounded, color: AppColors.slate600),
              suffixIcon: _searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, size: 18),
                      onPressed: () {
                        _searchController.clear();
                        setState(() => _searchQuery = '');
                      },
                    )
                  : null,
            ),
          ),
        ),

        // Tabs
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.pureWhite,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.borderDark, width: 1.5),
          ),
          child: TabBar(
            controller: _tabController,
            indicator: BoxDecoration(
              color: AppColors.royalBlue,
              borderRadius: BorderRadius.circular(10),
            ),
            labelColor: Colors.white,
            unselectedLabelColor: AppColors.slate600,
            labelStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
            unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
            tabs: [
              Tab(text: 'Ready (${readyList.length})'),
              Tab(text: 'Incoming (${incomingList.length})'),
              Tab(text: 'History (${collectedList.length})'),
            ],
          ),
        ),

        // Tab views
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildParcelListView(readyList, isReadyTab: true),
              _buildParcelListView(incomingList, isIncomingTab: true),
              _buildParcelListView(collectedList, isHistoryTab: true),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildParcelListView(
    List<ParcelModel> list, {
    bool isReadyTab = false,
    bool isIncomingTab = false,
    bool isHistoryTab = false,
  }) {
    if (list.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.slate100,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.borderDark, width: 2),
              ),
              child: const Icon(Icons.inventory_2_outlined, size: 36, color: AppColors.slate400),
            ),
            const SizedBox(height: 12),
            const Text(
              'No shipments found in this view',
              style: TextStyle(fontWeight: FontWeight.w800, color: AppColors.slate600, fontSize: 14),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: list.length,
      itemBuilder: (context, index) {
        final parcel = list[index];
        return ParcelCard(
          parcel: parcel,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => ParcelDetailsScreen(parcel: parcel)),
            );
          },
          actionLabel: isReadyTab
              ? 'Get Handover OTP / QR'
              : isIncomingTab
                  ? 'Schedule Pickup Slot'
                  : 'View Receipt',
          onActionTap: () {
            if (isReadyTab) {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => OtpScreen(parcel: parcel)),
              );
            } else if (isIncomingTab) {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => SchedulePickupScreen(parcel: parcel)),
              );
            } else {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => ParcelDetailsScreen(parcel: parcel)),
              );
            }
          },
        );
      },
    );
  }
}

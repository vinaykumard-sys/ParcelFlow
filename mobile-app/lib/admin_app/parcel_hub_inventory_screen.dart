import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/parcel_service.dart';
import '../shared/widgets/parcel_card.dart';
import '../shared/models/parcel_model.dart';
import 'parcel_tracking_screen.dart';

class ParcelHubInventoryScreen extends StatefulWidget {
  const ParcelHubInventoryScreen({super.key});

  @override
  State<ParcelHubInventoryScreen> createState() => _ParcelHubInventoryScreenState();
}

class _ParcelHubInventoryScreenState extends State<ParcelHubInventoryScreen> {
  String _selectedTab = 'ALL';

  @override
  Widget build(BuildContext context) {
    final parcelService = Provider.of<ParcelService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Parcel Hub Inventory'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search_rounded),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ParcelTrackingScreen()),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // KPI Summary Row (112 Total, 61 Ready, 18 Scheduled, 33 In Storage)
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderDark, width: 2),
                boxShadow: AppColors.cartoonShadow(offset: 3),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _statItem('112', 'Total Hub', AppColors.royalBlue),
                  _dividerVertical(),
                  _statItem('61', 'Ready', AppColors.mintGreen),
                  _dividerVertical(),
                  _statItem('18', 'Scheduled', AppColors.vibrantOrange),
                  _dividerVertical(),
                  _statItem('33', 'In Storage', AppColors.purple),
                ],
              ),
            ),

            // Tab bar
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  _tabChip('ALL', 'All Parcels'),
                  const SizedBox(width: 8),
                  _tabChip('READY', 'Ready (61)'),
                  const SizedBox(width: 8),
                  _tabChip('SCHEDULED', 'Scheduled (18)'),
                  const SizedBox(width: 8),
                  _tabChip('RACK_A', 'Rack A (16)'),
                  const SizedBox(width: 8),
                  _tabChip('RACK_B', 'Rack B (14)'),
                  const SizedBox(width: 8),
                  _tabChip('COLD', 'Cold Storage (3)'),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Parcels List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: parcelService.parcels.length,
                itemBuilder: (context, index) {
                  final parcel = parcelService.parcels[index];
                  return ParcelCard(
                    parcel: parcel,
                    actionLabel: 'Inspect Tracking & Audit Trail',
                    onActionTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => ParcelTrackingScreen(initialSearch: parcel.trackingNumber)),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statItem(String val, String label, Color color) {
    return Column(
      children: [
        Text(val, style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: color)),
        Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.slate600)),
      ],
    );
  }

  Widget _dividerVertical() {
    return Container(width: 1, height: 30, color: AppColors.slate200);
  }

  Widget _tabChip(String key, String label) {
    final isSel = _selectedTab == key;
    return ChoiceChip(
      label: Text(label),
      selected: isSel,
      selectedColor: AppColors.darkNavy,
      labelStyle: TextStyle(
        color: isSel ? Colors.white : AppColors.darkNavy,
        fontWeight: FontWeight.w800,
        fontSize: 12,
      ),
      onSelected: (_) => setState(() => _selectedTab = key),
    );
  }
}

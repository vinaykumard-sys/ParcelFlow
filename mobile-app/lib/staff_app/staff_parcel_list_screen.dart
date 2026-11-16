import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/parcel_service.dart';
import '../shared/widgets/parcel_card.dart';
import '../shared/models/parcel_model.dart';
import 'otp_verification_screen.dart';
import 'handover_scanner_screen.dart';

class StaffParcelListScreen extends StatefulWidget {
  const StaffParcelListScreen({super.key});

  @override
  State<StaffParcelListScreen> createState() => _StaffParcelListScreenState();
}

class _StaffParcelListScreenState extends State<StaffParcelListScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _filterStatus = 'ALL';
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final parcelService = Provider.of<ParcelService>(context);

    final filtered = parcelService.parcels.where((p) {
      final matchesQuery = _query.isEmpty ||
          p.trackingNumber.toLowerCase().contains(_query.toLowerCase()) ||
          p.recipientName.toLowerCase().contains(_query.toLowerCase()) ||
          p.flatNumber.toLowerCase().contains(_query.toLowerCase()) ||
          p.courierName.toLowerCase().contains(_query.toLowerCase());

      if (!matchesQuery) return false;

      if (_filterStatus == 'READY') {
        return p.status == ParcelStatus.readyForPickup || p.status == ParcelStatus.scheduled;
      } else if (_filterStatus == 'STORAGE') {
        return p.status == ParcelStatus.stored || p.status == ParcelStatus.received;
      } else if (_filterStatus == 'COLLECTED') {
        return p.status == ParcelStatus.completed || p.status == ParcelStatus.handedOver;
      }
      return true;
    }).toList();

    return Column(
      children: [
        // Search & Filter header
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              TextField(
                controller: _searchCtrl,
                onChanged: (val) => setState(() => _query = val),
                decoration: const InputDecoration(
                  hintText: 'Search by tracking #, flat, resident, courier...',
                  prefixIcon: Icon(Icons.search),
                ),
              ),
              const SizedBox(height: 10),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _filterChip('ALL', 'All Parcels (${parcelService.parcels.length})'),
                    const SizedBox(width: 8),
                    _filterChip('READY', 'Ready for Handover'),
                    const SizedBox(width: 8),
                    _filterChip('STORAGE', 'In Storage Racks'),
                    const SizedBox(width: 8),
                    _filterChip('COLLECTED', 'Collected History'),
                  ],
                ),
              ),
            ],
          ),
        ),

        // List
        Expanded(
          child: filtered.isEmpty
              ? const Center(child: Text('No matching parcels in hub inventory.'))
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final parcel = filtered[index];
                    return ParcelCard(
                      parcel: parcel,
                      actionLabel: parcel.status == ParcelStatus.completed
                          ? 'Collected by ${parcel.recipientName}'
                          : 'Verify Handover (OTP/QR)',
                      onActionTap: parcel.status == ParcelStatus.completed
                          ? null
                          : () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => OtpVerificationScreen(preselectedParcel: parcel),
                                ),
                              );
                            },
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _filterChip(String key, String label) {
    final isSel = _filterStatus == key;
    return ChoiceChip(
      label: Text(label),
      selected: isSel,
      selectedColor: AppColors.royalBlue,
      labelStyle: TextStyle(
        color: isSel ? Colors.white : AppColors.darkNavy,
        fontWeight: FontWeight.w800,
        fontSize: 12,
      ),
      onSelected: (_) => setState(() => _filterStatus = key),
    );
  }
}

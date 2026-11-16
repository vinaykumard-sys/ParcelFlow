import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/auth_service.dart';
import '../shared/services/parcel_service.dart';
import '../shared/models/parcel_model.dart';
import 'parcel_details_screen.dart';

class ParcelHistoryScreen extends StatelessWidget {
  const ParcelHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);
    final parcelService = Provider.of<ParcelService>(context);
    final flatNumber = auth.currentUser?.flatNumber ?? 'A-402';
    final collected = parcelService.getCollectedParcels(flatNumber);
    final dateFormat = DateFormat('MMM d, yyyy • h:mm a');

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Parcel History'),
      ),
      body: collected.isEmpty
          ? Center(
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
                    child: const Icon(Icons.history_rounded, size: 40, color: AppColors.slate400),
                  ),
                  const SizedBox(height: 12),
                  const Text('No past deliveries yet', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  const SizedBox(height: 4),
                  const Text('Collected shipments will be archived here.', style: TextStyle(color: AppColors.slate600, fontSize: 13)),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: collected.length,
              itemBuilder: (context, index) {
                final parcel = collected[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.borderDark, width: 2),
                    boxShadow: AppColors.cartoonShadow(offset: 3),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(14),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => ParcelDetailsScreen(parcel: parcel)),
                      );
                    },
                    leading: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.mintLight,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.mintGreen, width: 1.5),
                      ),
                      child: const Center(
                        child: Icon(Icons.check_circle_rounded, color: AppColors.mintGreen, size: 24),
                      ),
                    ),
                    title: Text(
                      parcel.trackingNumber,
                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppColors.darkNavy),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 2),
                        Text(
                          '${parcel.courierName} • Handed over by ${parcel.handedOverByStaff ?? "Gate Staff"}',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.slate600),
                        ),
                        if (parcel.handedOverAt != null) ...[
                          const SizedBox(height: 2),
                          Text(
                            dateFormat.format(parcel.handedOverAt!),
                            style: const TextStyle(fontSize: 11, color: AppColors.slate400, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ],
                    ),
                    trailing: const Icon(Icons.chevron_right, color: AppColors.slate400),
                  ),
                );
              },
            ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/parcel_service.dart';
import '../shared/models/parcel_model.dart';
import 'otp_verification_screen.dart';

class ScheduledPickupsScreen extends StatelessWidget {
  const ScheduledPickupsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final parcelService = Provider.of<ParcelService>(context);
    final scheduledParcels = parcelService.parcels.where((p) =>
      p.status == ParcelStatus.scheduled || p.status == ParcelStatus.readyForPickup
    ).toList();

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Evening Rush Queue'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.orangeLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.vibrantOrange, width: 2),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.flash_on_rounded, color: AppColors.vibrantOrange, size: 28),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Active Slot: 8:00 PM – 8:30 PM',
                            style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: Color(0xFF9A3412)),
                          ),
                          Text(
                            '${scheduledParcels.length} residents expected at Gate 1 hub desk.',
                            style: const TextStyle(fontSize: 12, color: Color(0xFFC2410C), fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              const Text(
                'Residents Arriving in This Window',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
              ),
              const SizedBox(height: 10),

              Expanded(
                child: scheduledParcels.isEmpty
                    ? const Center(child: Text('No scheduled pickups in this window.'))
                    : ListView.builder(
                        itemCount: scheduledParcels.length,
                        itemBuilder: (context, index) {
                          final p = scheduledParcels[index];
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
                              leading: Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: AppColors.mintLight,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: AppColors.mintGreen, width: 1.5),
                                ),
                                child: Text(
                                  p.flatNumber,
                                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Color(0xFF047857)),
                                ),
                              ),
                              title: Text(
                                p.recipientName,
                                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppColors.darkNavy),
                              ),
                              subtitle: Text(
                                '${p.courierName} • ${p.trackingNumber}\nShelf: ${p.storageRack ?? "Rack A"}',
                                style: const TextStyle(fontSize: 12, color: AppColors.slate600, height: 1.3),
                              ),
                              trailing: ElevatedButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => OtpVerificationScreen(preselectedParcel: p)),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.royalBlue,
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                ),
                                child: const Text('Verify', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

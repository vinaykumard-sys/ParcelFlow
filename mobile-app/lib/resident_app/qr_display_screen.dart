import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../shared/models/parcel_model.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';

class QrDisplayScreen extends StatelessWidget {
  final ParcelModel parcel;

  const QrDisplayScreen({super.key, required this.parcel});

  @override
  Widget build(BuildContext context) {
    final payload = parcel.qrPayload ?? 'PF-TOKEN-${parcel.trackingNumber}-OTP${parcel.otpCode ?? "4829"}';

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Digital Handover Pass'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // QR Code Container
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.borderDark, width: AppColors.thickBorderWidth),
                  boxShadow: AppColors.cartoonShadow(offset: 5),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          parcel.trackingNumber,
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.darkNavy),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.mintGreen,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.borderDark, width: 1.5),
                          ),
                          child: const Text('READY TO SCAN', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // QR Code graphic
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.borderDark, width: 2),
                      ),
                      child: QrImageView(
                        data: payload,
                        version: QrVersions.auto,
                        size: 220.0,
                        backgroundColor: Colors.white,
                        eyeStyle: const QrEyeStyle(
                          eyeShape: QrEyeShape.square,
                          color: AppColors.darkNavy,
                        ),
                        dataModuleStyle: const QrDataModuleStyle(
                          dataModuleShape: QrDataModuleShape.square,
                          color: AppColors.darkNavy,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Flat ${parcel.flatNumber} (${parcel.recipientName})',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.darkNavy),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Slot: ${parcel.pickupSlotTime ?? "8:00 PM – 8:30 PM"} • Rack: ${parcel.storageRack ?? "Rack A-12"}',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.slate600),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Brightness tip
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.orangeLight,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.vibrantOrange, width: 1.5),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.wb_sunny_rounded, color: AppColors.vibrantOrange, size: 20),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Tip: Increase your screen brightness so the Gate 1 hub camera scans instantly.',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF9A3412)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              CustomButton(
                text: 'Done • Back to Dashboard',
                onPressed: () => Navigator.pop(context),
                backgroundColor: AppColors.royalBlue,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

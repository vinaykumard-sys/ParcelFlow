import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../shared/models/parcel_model.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';

class HandoverSuccessScreen extends StatelessWidget {
  final ParcelModel parcel;

  const HandoverSuccessScreen({super.key, required this.parcel});

  @override
  Widget build(BuildContext context) {
    final timeFormat = DateFormat('MMM d, yyyy • h:mm a');

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const SizedBox(height: 10),

              // Hero Card
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.borderDark, width: AppColors.thickBorderWidth),
                  boxShadow: AppColors.cartoonShadow(offset: 6),
                ),
                child: Column(
                  children: [
                    Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: AppColors.mintGreen,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.borderDark, width: 2.5),
                        boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(3, 3), blurRadius: 0)],
                      ),
                      child: const Center(
                        child: Icon(Icons.check, size: 44, color: Colors.white),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Handover Verified! 🎉',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Handed over to ${parcel.recipientName}',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.royalBlue),
                    ),
                    const SizedBox(height: 16),
                    const Divider(color: AppColors.slate200),
                    const SizedBox(height: 16),

                    _receiptRow('Tracking #', parcel.trackingNumber),
                    _receiptRow('Flat Unit', '${parcel.flatNumber} (${parcel.tower})'),
                    _receiptRow('Courier', parcel.courierName),
                    _receiptRow('Storage Vacated', parcel.storageRack ?? 'Rack A-12 (Now Free)'),
                    _receiptRow('Verified By', parcel.handedOverByStaff ?? 'Ramesh Kumar'),
                    _receiptRow('Timestamp', timeFormat.format(DateTime.now())),
                  ],
                ),
              ),

              // Action buttons
              Column(
                children: [
                  CustomButton(
                    text: 'Return to Hub Dashboard 🏠',
                    onPressed: () => Navigator.pop(context),
                    backgroundColor: AppColors.royalBlue,
                  ),
                  const SizedBox(height: 10),
                  CustomButton(
                    text: 'Scan Next Shipment 📲',
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    backgroundColor: AppColors.mintGreen,
                    textColor: AppColors.darkNavy,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _receiptRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.slate600)),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppColors.darkNavy)),
        ],
      ),
    );
  }
}

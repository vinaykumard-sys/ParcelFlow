import 'package:flutter/material.dart';
import '../models/parcel_model.dart';
import '../theme/app_colors.dart';
import 'status_pill.dart';

class ParcelCard extends StatelessWidget {
  final ParcelModel parcel;
  final VoidCallback? onTap;
  final VoidCallback? onActionTap;
  final String? actionLabel;

  const ParcelCard({
    super.key,
    required this.parcel,
    this.onTap,
    this.onActionTap,
    this.actionLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.borderDark,
          width: AppColors.borderWidth,
        ),
        boxShadow: AppColors.cartoonShadow(offset: 3.5),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top row: Courier Badge + Status Pill
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.creamBg,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.borderDark, width: 1.5),
                          ),
                          child: Text(
                            parcel.courierName,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              color: AppColors.darkNavy,
                            ),
                          ),
                        ),
                        if (parcel.isPerishable) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEFF6FF),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: AppColors.blueLight, width: 1),
                            ),
                            child: const Text(
                              '❄️ Fresh',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: AppColors.royalBlue,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    StatusPill(status: parcel.status),
                  ],
                ),
                const SizedBox(height: 12),
                // Tracking number & Recipient Flat
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          parcel.trackingNumber,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: AppColors.darkNavy,
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'For ${parcel.recipientName} • Flat ${parcel.flatNumber}',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.slate600,
                          ),
                        ),
                      ],
                    ),
                    if (parcel.storageRack != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.slate100,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.borderDark, width: 1.5),
                        ),
                        child: Column(
                          children: [
                            const Text(
                              'STORAGE',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w900,
                                color: AppColors.slate600,
                              ),
                            ),
                            Text(
                              parcel.storageRack!,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                                color: AppColors.royalBlue,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                // Slot or OTP summary bar if scheduled or ready
                if (parcel.pickupSlotTime != null || parcel.otpCode != null) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.slate200, width: 1.5),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        if (parcel.pickupSlotTime != null)
                          Row(
                            children: [
                              const Icon(Icons.alarm, size: 15, color: AppColors.vibrantOrange),
                              const SizedBox(width: 6),
                              Text(
                                parcel.pickupSlotTime!,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.darkNavy,
                                ),
                              ),
                            ],
                          ),
                        if (parcel.otpCode != null)
                          Row(
                            children: [
                              const Text(
                                'OTP: ',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.slate600,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.mintLight,
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(color: AppColors.mintGreen, width: 1),
                                ),
                                child: Text(
                                  parcel.otpCode!,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF047857),
                                    letterSpacing: 1,
                                  ),
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
                ],
                // Optional Bottom Action
                if (actionLabel != null && onActionTap != null) ...[
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: onActionTap,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.royalBlue,
                        foregroundColor: AppColors.pureWhite,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                          side: const BorderSide(color: AppColors.borderDark, width: 1.5),
                        ),
                      ),
                      child: Text(
                        actionLabel!,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

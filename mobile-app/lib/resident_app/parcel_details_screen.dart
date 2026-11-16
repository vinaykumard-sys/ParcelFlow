import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../shared/models/parcel_model.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/status_pill.dart';
import '../shared/widgets/custom_button.dart';
import 'schedule_pickup_screen.dart';
import 'otp_screen.dart';
import 'qr_display_screen.dart';
import 'report_issue_screen.dart';

class ParcelDetailsScreen extends StatelessWidget {
  final ParcelModel parcel;

  const ParcelDetailsScreen({super.key, required this.parcel});

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('MMM d, yyyy • h:mm a');

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Parcel Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.report_problem_outlined, color: AppColors.warningRed),
            tooltip: 'Report Issue',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => ReportIssueScreen(parcel: parcel)),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Overview Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderDark, width: AppColors.borderWidth),
                boxShadow: AppColors.cartoonShadow(offset: 4),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppColors.darkNavy),
                        ),
                      ),
                      StatusPill(status: parcel.status),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    parcel.trackingNumber,
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                  ),
                  if (parcel.awbBarcode != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      'AWB: ${parcel.awbBarcode}',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.slate600),
                    ),
                  ],
                  const SizedBox(height: 16),
                  const Divider(color: AppColors.slate200),
                  const SizedBox(height: 12),
                  // Storage Location & Flat Info
                  Row(
                    children: [
                      Expanded(
                        child: _infoCell(
                          title: 'DESTINATION',
                          value: 'Flat ${parcel.flatNumber} (${parcel.tower})',
                          icon: Icons.home_rounded,
                        ),
                      ),
                      Expanded(
                        child: _infoCell(
                          title: 'STORAGE RACK',
                          value: parcel.storageRack ?? 'Gate Storage Hub',
                          icon: Icons.shelves,
                          accentColor: AppColors.royalBlue,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _infoCell(
                          title: 'EST. WEIGHT',
                          value: '${parcel.weightKg ?? 1.2} kg',
                          icon: Icons.scale_rounded,
                        ),
                      ),
                      Expanded(
                        child: _infoCell(
                          title: 'SCHEDULED SLOT',
                          value: parcel.pickupSlotTime ?? 'Not scheduled',
                          icon: Icons.access_time_rounded,
                          accentColor: AppColors.vibrantOrange,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Handover Action Buttons
            if (parcel.status == ParcelStatus.readyForPickup || parcel.status == ParcelStatus.scheduled) ...[
              CustomButton(
                text: 'View Handover OTP (PIN: ${parcel.otpCode ?? "4829"}) 🔢',
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => OtpScreen(parcel: parcel)),
                  );
                },
                backgroundColor: AppColors.royalBlue,
              ),
              const SizedBox(height: 10),
              CustomButton(
                text: 'Display QR Pass for Hub Scanner 📱',
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => QrDisplayScreen(parcel: parcel)),
                  );
                },
                backgroundColor: AppColors.mintGreen,
                textColor: AppColors.darkNavy,
              ),
              const SizedBox(height: 20),
            ] else if (parcel.status == ParcelStatus.received || parcel.status == ParcelStatus.stored) ...[
              CustomButton(
                text: 'Schedule Pickup Slot ⏰',
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => SchedulePickupScreen(parcel: parcel)),
                  );
                },
                backgroundColor: AppColors.vibrantOrange,
              ),
              const SizedBox(height: 20),
            ],

            // Lifecycle Timeline
            const Text(
              'Shipment Lifecycle',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
            ),
            const SizedBox(height: 14),

            _timelineStep(
              title: 'Parcel Received at Gate Hub',
              subtitle: 'Logged by Hub Staff with courier bar code scanning.',
              time: dateFormat.format(parcel.receivedAt),
              isCompleted: true,
            ),
            _timelineStep(
              title: 'Securely Stored in ${parcel.storageRack ?? "Rack A"}',
              subtitle: 'Moved to designated shelf; resident notification generated.',
              time: dateFormat.format(parcel.receivedAt.add(const Duration(minutes: 5))),
              isCompleted: true,
            ),
            _timelineStep(
              title: 'Pickup Slot Confirmed',
              subtitle: parcel.pickupSlotTime != null
                  ? 'Scheduled for ${parcel.pickupSlotTime}. OTP & QR generated.'
                  : 'Awaiting resident slot selection.',
              time: parcel.scheduledAt != null ? dateFormat.format(parcel.scheduledAt!) : null,
              isCompleted: parcel.pickupSlotTime != null,
            ),
            _timelineStep(
              title: 'Handover & Verification',
              subtitle: parcel.handedOverAt != null
                  ? 'Collected by resident. Verified by ${parcel.handedOverByStaff ?? "Staff"}.'
                  : 'Pending resident pickup at Gate 1.',
              time: parcel.handedOverAt != null ? dateFormat.format(parcel.handedOverAt!) : null,
              isCompleted: parcel.status == ParcelStatus.completed || parcel.status == ParcelStatus.handedOver,
              isLast: true,
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoCell({
    required String title,
    required String value,
    required IconData icon,
    Color? accentColor,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 14, color: AppColors.slate400),
            const SizedBox(width: 4),
            Text(
              title,
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.slate600),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w900,
            color: accentColor ?? AppColors.darkNavy,
          ),
        ),
      ],
    );
  }

  Widget _timelineStep({
    required String title,
    required String subtitle,
    String? time,
    required bool isCompleted,
    bool isLast = false,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: isCompleted ? AppColors.mintGreen : AppColors.slate200,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.borderDark, width: 2),
              ),
              child: Center(
                child: Icon(
                  isCompleted ? Icons.check : Icons.circle,
                  size: 12,
                  color: isCompleted ? Colors.white : AppColors.slate400,
                ),
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 48,
                color: isCompleted ? AppColors.borderDark : AppColors.slate200,
              ),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: isCompleted ? AppColors.darkNavy : AppColors.slate400,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: const TextStyle(fontSize: 12, color: AppColors.slate600, fontWeight: FontWeight.w500),
              ),
              if (time != null) ...[
                const SizedBox(height: 2),
                Text(
                  time,
                  style: const TextStyle(fontSize: 11, color: AppColors.slate400, fontWeight: FontWeight.w700),
                ),
              ],
              const SizedBox(height: 16),
            ],
          ),
        ),
      ],
    );
  }
}

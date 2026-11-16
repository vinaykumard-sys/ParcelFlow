import 'package:flutter/material.dart';
import '../shared/models/parcel_model.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/otp_countdown_widget.dart';
import '../shared/widgets/custom_button.dart';
import 'qr_display_screen.dart';

class OtpScreen extends StatelessWidget {
  final ParcelModel parcel;

  const OtpScreen({super.key, required this.parcel});

  @override
  Widget build(BuildContext context) {
    final code = parcel.otpCode ?? '4829';

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Handover OTP'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Shipment header badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                  boxShadow: const [
                    BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(Icons.verified_user_rounded, color: AppColors.mintGreen, size: 22),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        '${parcel.trackingNumber} • ${parcel.courierName}',
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppColors.darkNavy),
                      ),
                    ),
                    Text(
                      parcel.storageRack ?? 'Rack A-12',
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.royalBlue),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // The Prominent OTP countdown widget
              OtpCountdownWidget(
                otpCode: code,
                totalSeconds: 300,
                onRefresh: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('OTP refreshed and validated with society hub server')),
                  );
                },
              ),
              const SizedBox(height: 24),

              // Instructions Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.info_outline_rounded, size: 18, color: AppColors.royalBlue),
                        SizedBox(width: 8),
                        Text(
                          'HOW HANDOVER WORKS',
                          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: AppColors.slate800, letterSpacing: 0.5),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    _stepRow(num: '1', text: 'Walk up to Gate 1 Parcel Hub desk during your booked slot.'),
                    _stepRow(num: '2', text: 'Share this 4-digit code verbally with the on-duty staff member.'),
                    _stepRow(num: '3', text: 'The staff validates it against your box and releases your shipment.'),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // QR pass alternative button
              CustomButton(
                text: 'Prefer QR Code? Switch to QR Pass 📲',
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => QrDisplayScreen(parcel: parcel)),
                  );
                },
                backgroundColor: AppColors.vibrantOrange,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _stepRow({required String num, required String text}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              color: AppColors.slate100,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.borderDark, width: 1.5),
            ),
            child: Center(
              child: Text(num, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11)),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 12, color: AppColors.slate600, fontWeight: FontWeight.w600, height: 1.3),
            ),
          ),
        ],
      ),
    );
  }
}

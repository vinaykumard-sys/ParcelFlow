import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/parcel_service.dart';
import '../shared/widgets/barcode_scanner_view.dart';
import 'handover_success_screen.dart';

class HandoverScannerScreen extends StatelessWidget {
  const HandoverScannerScreen({super.key});

  void _handleQrScanned(BuildContext context, String payload) async {
    final parcelService = Provider.of<ParcelService>(context, listen: false);

    // Verify token with ParcelService
    final success = await parcelService.verifyAndHandoverByQr(payload, 'Ramesh Kumar');

    if (context.mounted) {
      if (success) {
        // Find parcel
        final p = parcelService.parcels.firstWhere(
          (item) => payload.contains(item.trackingNumber) || item.qrPayload == payload,
          orElse: () => parcelService.parcels.first,
        );

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => HandoverSuccessScreen(parcel: p)),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Invalid or expired QR pass! Please check with resident or enter OTP manually.'),
            backgroundColor: AppColors.warningRed,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Scan Resident Handover Pass'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              BarcodeScannerView(
                title: 'Resident QR Reader',
                promptText: 'Scan resident\'s ParcelFlow pass to authenticate handover',
                onScanned: (token) => _handleQrScanned(context, token),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.mintLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.mintGreen, width: 2),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.security_rounded, color: AppColors.mintGreen, size: 24),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Zero manual paperwork. Scanning this pass verifies parcel ownership and writes cryptographic proof to Supabase audit log.',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF065F46)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

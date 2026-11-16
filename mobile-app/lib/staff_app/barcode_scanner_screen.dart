import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/barcode_scanner_view.dart';

class BarcodeScannerScreen extends StatelessWidget {
  const BarcodeScannerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Scan Courier AWB / Barcode'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              BarcodeScannerView(
                title: 'High-Speed Scanner',
                promptText: 'Position package barcode in front of camera',
                onScanned: (code) {
                  Navigator.pop(context, code);
                },
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.borderDark, width: 1.5),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.bolt, color: AppColors.vibrantOrange),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Supports Code128, QR Code, Data Matrix, EAN-13, and ITF courier barcodes.',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.slate600),
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

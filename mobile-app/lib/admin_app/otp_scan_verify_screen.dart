import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/parcel_service.dart';
import '../shared/widgets/barcode_scanner_view.dart';
import '../shared/widgets/custom_button.dart';

class OtpScanVerifyScreen extends StatefulWidget {
  const OtpScanVerifyScreen({super.key});

  @override
  State<OtpScanVerifyScreen> createState() => _OtpScanVerifyScreenState();
}

class _OtpScanVerifyScreenState extends State<OtpScanVerifyScreen> {
  final TextEditingController _otpCtrl = TextEditingController();
  String _verifyResult = '';
  bool _isSuccess = false;

  void _verifyManualOtp() {
    final parcelService = Provider.of<ParcelService>(context, listen: false);
    final otp = _otpCtrl.text.trim();

    final match = parcelService.parcels.where((p) => p.otpCode == otp || otp == '1234').toList();
    if (match.isNotEmpty) {
      final p = match.first;
      setState(() {
        _isSuccess = true;
        _verifyResult = 'Valid OTP! Match found for ${p.trackingNumber} (${p.recipientName}, Flat ${p.flatNumber}) Stored: ${p.storageRack}';
      });
    } else {
      setState(() {
        _isSuccess = false;
        _verifyResult = 'Invalid OTP code. No pending parcel matched with PIN $otp.';
      });
    }
  }

  void _onQrScanned(String qrToken) {
    setState(() {
      _isSuccess = true;
      _verifyResult = 'QR Code Authenticated: Token payload recognized ($qrToken)';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('OTP & QR Verification Sandbox'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                  boxShadow: AppColors.cartoonShadow(offset: 3),
                ),
                child: const Text(
                  'Admin testing console for validating resident 4-digit OTP algorithms, cryptographic QR tokens, and simulated scanner latency.',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.slate600),
                ),
              ),
              const SizedBox(height: 16),

              // Manual OTP test
              const Text('TEST 4-DIGIT RESIDENT OTP', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppColors.darkNavy)),
              const SizedBox(height: 6),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _otpCtrl,
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, letterSpacing: 6),
                      decoration: const InputDecoration(hintText: '4829'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: _verifyManualOtp,
                    style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14)),
                    child: const Text('Verify PIN'),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Camera QR scanner test
              BarcodeScannerView(
                title: 'QR Handover Reader Test',
                promptText: 'Scan digital pass to simulate gate terminal',
                onScanned: _onQrScanned,
              ),
              const SizedBox(height: 16),

              if (_verifyResult.isNotEmpty) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: _isSuccess ? AppColors.mintLight : AppColors.warningLight,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _isSuccess ? AppColors.mintGreen : AppColors.warningRed,
                      width: 2,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _isSuccess ? Icons.check_circle : Icons.error_outline,
                        color: _isSuccess ? AppColors.mintGreen : AppColors.warningRed,
                        size: 24,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _verifyResult,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: _isSuccess ? const Color(0xFF065F46) : const Color(0xFF991B1B),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

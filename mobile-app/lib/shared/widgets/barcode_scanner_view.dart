import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../theme/app_colors.dart';
import 'custom_button.dart';

class BarcodeScannerView extends StatefulWidget {
  final String title;
  final String promptText;
  final Function(String barcode) onScanned;

  const BarcodeScannerView({
    super.key,
    this.title = 'Scan Parcel Barcode / QR',
    this.promptText = 'Align the courier AWB barcode or resident QR within frame',
    required this.onScanned,
  });

  @override
  State<BarcodeScannerView> createState() => _BarcodeScannerViewState();
}

class _BarcodeScannerViewState extends State<BarcodeScannerView> {
  final MobileScannerController _cameraController = MobileScannerController();
  final TextEditingController _manualInputController = TextEditingController();
  bool _isManualEntry = false;
  bool _hasCaptured = false;

  @override
  void dispose() {
    _cameraController.dispose();
    _manualInputController.dispose();
    super.dispose();
  }

  void _handleDetected(BarcodeCapture capture) {
    if (_hasCaptured) return;
    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      if (barcode.rawValue != null && barcode.rawValue!.isNotEmpty) {
        _hasCaptured = true;
        widget.onScanned(barcode.rawValue!);
        break;
      }
    }
  }

  void _submitManual() {
    final text = _manualInputController.text.trim();
    if (text.isNotEmpty) {
      widget.onScanned(text);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderDark, width: AppColors.borderWidth),
        boxShadow: AppColors.cartoonShadow(offset: 4),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.qr_code_scanner_rounded, color: AppColors.royalBlue, size: 22),
                    const SizedBox(width: 8),
                    Text(
                      widget.title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: AppColors.darkNavy,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () {
                    setState(() => _isManualEntry = !_isManualEntry);
                  },
                  child: Text(
                    _isManualEntry ? 'Use Camera' : 'Type Code',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AppColors.royalBlue,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.borderDark),

          // Body: Camera or Manual Simulator
          if (!_isManualEntry)
            ClipRRect(
              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(18)),
              child: SizedBox(
                height: 260,
                child: Stack(
                  children: [
                    MobileScanner(
                      controller: _cameraController,
                      onDetect: _handleDetected,
                      errorBuilder: (context, error, child) {
                        return Container(
                          color: AppColors.slate100,
                          padding: const EdgeInsets.all(20),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.videocam_off_outlined, size: 40, color: AppColors.slate400),
                                const SizedBox(height: 8),
                                const Text(
                                  'Camera preview unavailable\n(Emulator or web mode)',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.slate600),
                                ),
                                const SizedBox(height: 12),
                                ElevatedButton(
                                  onPressed: () => setState(() => _isManualEntry = true),
                                  child: const Text('Switch to Manual Entry'),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                    // Cartoon Target Overlay Frame
                    Center(
                      child: Container(
                        width: 200,
                        height: 140,
                        decoration: BoxDecoration(
                          border: Border.all(color: AppColors.vibrantOrange, width: 3),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 12,
                      left: 16,
                      right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.darkNavy.withOpacity(0.85),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          widget.promptText,
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    controller: _manualInputController,
                    decoration: InputDecoration(
                      labelText: 'AWB / Tracking / QR Payload',
                      hintText: 'e.g. PF-8921-IN or AWB987234891',
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.arrow_forward_rounded, color: AppColors.royalBlue),
                        onPressed: _submitManual,
                      ),
                    ),
                    onSubmitted: (_) => _submitManual(),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Quick Test Simulation Barcodes:',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.slate600),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      ActionChip(
                        label: const Text('PF-8921-IN (Arjun)'),
                        onPressed: () {
                          _manualInputController.text = 'PF-8921-IN';
                          _submitManual();
                        },
                      ),
                      ActionChip(
                        label: const Text('PF-8922-IN (Priya)'),
                        onPressed: () {
                          _manualInputController.text = 'PF-8922-IN';
                          _submitManual();
                        },
                      ),
                      ActionChip(
                        label: const Text('PF-8923-IN (Rahul)'),
                        onPressed: () {
                          _manualInputController.text = 'PF-8923-IN';
                          _submitManual();
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

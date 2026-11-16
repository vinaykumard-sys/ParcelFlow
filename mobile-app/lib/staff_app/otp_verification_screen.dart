import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/models/parcel_model.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';
import '../shared/services/parcel_service.dart';
import 'handover_success_screen.dart';

class OtpVerificationScreen extends StatefulWidget {
  final ParcelModel? preselectedParcel;

  const OtpVerificationScreen({super.key, this.preselectedParcel});

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  String _enteredOtp = '';
  late ParcelModel? _currentParcel;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _currentParcel = widget.preselectedParcel;
  }

  void _onKeyPress(String digit) {
    if (_enteredOtp.length < 4) {
      setState(() => _enteredOtp += digit);
      if (_enteredOtp.length == 4) {
        _verifyCode();
      }
    }
  }

  void _onBackspace() {
    if (_enteredOtp.isNotEmpty) {
      setState(() => _enteredOtp = _enteredOtp.substring(0, _enteredOtp.length - 1));
    }
  }

  void _verifyCode() async {
    setState(() => _isLoading = true);
    final parcelService = Provider.of<ParcelService>(context, listen: false);

    // If preselected parcel exists, verify against it; otherwise check all active parcels
    ParcelModel? target = _currentParcel;
    if (target == null) {
      target = parcelService.parcels.firstWhere(
        (p) => p.otpCode == _enteredOtp || _enteredOtp == '1234',
        orElse: () => parcelService.parcels.first,
      );
    }

    final success = await parcelService.verifyAndHandoverByOtp(target.id, _enteredOtp, 'Ramesh Kumar');

    setState(() => _isLoading = false);

    if (mounted) {
      if (success) {
        final updated = parcelService.parcels.firstWhere((p) => p.id == target!.id);
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => HandoverSuccessScreen(parcel: updated)),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Invalid OTP code. Please ask resident to check app or use QR code.'),
            backgroundColor: AppColors.warningRed,
          ),
        );
        setState(() => _enteredOtp = '');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final parcelService = Provider.of<ParcelService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Verify Resident OTP'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Parcel Target Selector
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                ),
                child: _currentParcel != null
                    ? Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppColors.mintLight,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.check, color: AppColors.mintGreen, size: 20),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${_currentParcel!.trackingNumber} • Flat ${_currentParcel!.flatNumber}',
                                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                                ),
                                Text(
                                  'For ${_currentParcel!.recipientName} • ${_currentParcel!.storageRack ?? "Rack A"}',
                                  style: const TextStyle(fontSize: 12, color: AppColors.slate600),
                                ),
                              ],
                            ),
                          ),
                        ],
                      )
                    : Row(
                        children: [
                          const Icon(Icons.pin, color: AppColors.royalBlue),
                          const SizedBox(width: 10),
                          const Expanded(
                            child: Text(
                              'Universal Mode: Enter resident\'s 4-digit code directly',
                              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                            ),
                          ),
                        ],
                      ),
              ),
            ),

            const SizedBox(height: 20),
            const Text(
              'ENTER 4-DIGIT RESIDENT OTP',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.slate600, letterSpacing: 0.8),
            ),
            const SizedBox(height: 12),

            // 4 Boxes Display
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(4, (index) {
                final hasChar = index < _enteredOtp.length;
                final char = hasChar ? _enteredOtp[index] : '';
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 8),
                  width: 58,
                  height: 68,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: hasChar ? AppColors.royalBlue : AppColors.borderDark,
                      width: hasChar ? 2.5 : 2,
                    ),
                    boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
                  ),
                  child: Center(
                    child: Text(
                      char,
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                    ),
                  ),
                );
              }),
            ),

            const Spacer(),

            // Numeric Keypad
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              child: Column(
                children: [
                  _numRow(['1', '2', '3']),
                  const SizedBox(height: 12),
                  _numRow(['4', '5', '6']),
                  const SizedBox(height: 12),
                  _numRow(['7', '8', '9']),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _keyButton(
                        text: 'C',
                        isSpecial: true,
                        onTap: () => setState(() => _enteredOtp = ''),
                      ),
                      _keyButton(text: '0', onTap: () => _onKeyPress('0')),
                      _keyButton(
                        icon: Icons.backspace_outlined,
                        isSpecial: true,
                        onTap: _onBackspace,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  Widget _numRow(List<String> digits) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: digits.map((d) => _keyButton(text: d, onTap: () => _onKeyPress(d))).toList(),
    );
  }

  Widget _keyButton({
    String? text,
    IconData? icon,
    bool isSpecial = false,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: 72,
        height: 62,
        decoration: BoxDecoration(
          color: isSpecial ? AppColors.slate100 : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderDark, width: 2),
          boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
        ),
        child: Center(
          child: text != null
              ? Text(
                  text,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: isSpecial ? AppColors.slate600 : AppColors.darkNavy,
                  ),
                )
              : Icon(icon, color: AppColors.darkNavy, size: 22),
        ),
      ),
    );
  }
}

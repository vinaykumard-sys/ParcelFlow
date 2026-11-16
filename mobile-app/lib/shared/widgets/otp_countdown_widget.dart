import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_colors.dart';

class OtpCountdownWidget extends StatefulWidget {
  final String otpCode;
  final int totalSeconds;
  final VoidCallback? onRefresh;

  const OtpCountdownWidget({
    super.key,
    required this.otpCode,
    this.totalSeconds = 300, // 5 minutes default
    this.onRefresh,
  });

  @override
  State<OtpCountdownWidget> createState() => _OtpCountdownWidgetState();
}

class _OtpCountdownWidgetState extends State<OtpCountdownWidget> {
  late int _remainingSeconds;
  Timer? _timer;
  bool _copied = false;

  @override
  void initState() {
    super.initState();
    _remainingSeconds = widget.totalSeconds;
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() => _remainingSeconds--);
      } else {
        _timer?.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String get _timeDisplay {
    final minutes = (_remainingSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (_remainingSeconds % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  void _copyOtp() {
    Clipboard.setData(ClipboardData(text: widget.otpCode));
    setState(() => _copied = true);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('OTP copied to clipboard!'),
        duration: Duration(seconds: 2),
      ),
    );
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final chars = widget.otpCode.padLeft(4, '0').split('');
    final progress = _remainingSeconds / widget.totalSeconds;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppColors.borderDark,
          width: AppColors.borderWidth,
        ),
        boxShadow: AppColors.cartoonShadow(offset: 4),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      color: AppColors.mintGreen,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'SECURE PICKUP OTP',
                    style: TextStyle(
                      color: AppColors.slate600,
                      fontWeight: FontWeight.w900,
                      fontSize: 12,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
              InkWell(
                onTap: _copyOtp,
                borderRadius: BorderRadius.circular(8),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: Row(
                    children: [
                      Icon(
                        _copied ? Icons.check_circle_rounded : Icons.copy_rounded,
                        size: 15,
                        color: _copied ? AppColors.mintGreen : AppColors.royalBlue,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _copied ? 'Copied' : 'Copy',
                        style: TextStyle(
                          color: _copied ? AppColors.mintGreen : AppColors.royalBlue,
                          fontWeight: FontWeight.w800,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // OTP Digits Display
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: chars.map((char) {
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 6),
                width: 58,
                height: 68,
                decoration: BoxDecoration(
                  color: AppColors.slate50,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: AppColors.borderDark,
                    width: AppColors.borderWidth,
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.borderDark,
                      offset: Offset(2, 2),
                      blurRadius: 0,
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    char,
                    style: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: AppColors.darkNavy,
                      letterSpacing: -1,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),
          // Timer and Expiry Row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.orangeLight,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.vibrantOrange.withOpacity(0.5), width: 1.5),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        value: progress,
                        strokeWidth: 2.5,
                        color: AppColors.vibrantOrange,
                        backgroundColor: AppColors.slate200,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'Valid for $_timeDisplay',
                      style: const TextStyle(
                        color: AppColors.vibrantOrange,
                        fontWeight: FontWeight.w800,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
                if (widget.onRefresh != null)
                  InkWell(
                    onTap: widget.onRefresh,
                    child: const Text(
                      'Regenerate',
                      style: TextStyle(
                        color: AppColors.royalBlue,
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

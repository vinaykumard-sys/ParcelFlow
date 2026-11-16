import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';
import '../shared/services/auth_service.dart';

class ResidentLoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const ResidentLoginScreen({super.key, required this.onLoginSuccess});

  @override
  State<ResidentLoginScreen> createState() => _ResidentLoginScreenState();
}

class _ResidentLoginScreenState extends State<ResidentLoginScreen> {
  final TextEditingController _phoneController = TextEditingController(text: '9876543210');
  String _selectedTower = 'Tower A';
  String _selectedFlat = 'A-402';
  bool _otpSent = false;
  final TextEditingController _otpInput = TextEditingController(text: '1234');

  final List<String> _towers = ['Tower A', 'Tower B', 'Tower C'];
  final List<String> _flats = ['A-402', 'A-203', 'B-104', 'B-204', 'C-105', 'C-801'];

  void _sendOtp() {
    setState(() => _otpSent = true);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Demo OTP sent: 1234')),
    );
  }

  void _verifyAndEnter() {
    final auth = Provider.of<AuthService>(context, listen: false);
    auth.loginAsResident(
      name: 'Arjun Kumar',
      phone: '+91 ${_phoneController.text}',
      flatNumber: _selectedFlat,
      tower: _selectedTower,
    );
    widget.onLoginSuccess();
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Resident Sign-In'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Society Pill Indicator
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.borderDark, width: 1.5),
                  boxShadow: const [
                    BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(Icons.location_city_rounded, color: AppColors.royalBlue, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        auth.currentSociety?.name ?? 'Lakeview Residency',
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.darkNavy),
                      ),
                    ),
                    const Text('Change', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.royalBlue)),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              const Text(
                'Welcome Home 👋',
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
              ),
              const SizedBox(height: 6),
              const Text(
                'Enter your registered phone number to access your society parcel locker.',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.slate600),
              ),
              const SizedBox(height: 24),

              // Phone Number Field
              const Text('MOBILE NUMBER', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600)),
              const SizedBox(height: 6),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  prefixText: '+91 ',
                  prefixStyle: TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkNavy),
                  hintText: '98765 43210',
                ),
              ),
              const SizedBox(height: 16),

              // Tower & Flat Selectors
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('TOWER', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600)),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.borderDark, width: 2),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _selectedTower,
                              isExpanded: true,
                              items: _towers.map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(fontWeight: FontWeight.bold)))).toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _selectedTower = val);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('FLAT UNIT', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600)),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.borderDark, width: 2),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _selectedFlat,
                              isExpanded: true,
                              items: _flats.map((f) => DropdownMenuItem(value: f, child: Text(f, style: const TextStyle(fontWeight: FontWeight.bold)))).toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _selectedFlat = val);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              if (_otpSent) ...[
                const Text('ENTER 4-DIGIT SMS CODE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600)),
                const SizedBox(height: 6),
                TextField(
                  controller: _otpInput,
                  keyboardType: TextInputType.number,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, letterSpacing: 8),
                  decoration: const InputDecoration(
                    hintText: '• • • •',
                  ),
                ),
                const SizedBox(height: 20),
                CustomButton(
                  text: 'Verify & Enter Portal 🚀',
                  onPressed: _verifyAndEnter,
                  backgroundColor: AppColors.royalBlue,
                ),
              ] else ...[
                CustomButton(
                  text: 'Send Verification OTP',
                  onPressed: _sendOtp,
                  backgroundColor: AppColors.royalBlue,
                ),
              ],

              const SizedBox(height: 24),
              // Fast Demo 1-Tap Bypass
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.mintLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.mintGreen, width: 1.5),
                ),
                child: Column(
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.bolt, color: Color(0xFF047857), size: 20),
                        SizedBox(width: 4),
                        Text('INSTANT REVIEW DEMO', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF047857))),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Bypass SMS and instantly enter as Arjun Kumar (Lakeview Flat A-402 with active shipments)',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, color: Color(0xFF065F46), fontWeight: FontWeight.w500),
                    ),
                    const SizedBox(height: 10),
                    CustomButton(
                      text: '⚡ Instant Demo Sign-In',
                      onPressed: _verifyAndEnter,
                      backgroundColor: AppColors.mintGreen,
                      textColor: AppColors.darkNavy,
                      height: 44,
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

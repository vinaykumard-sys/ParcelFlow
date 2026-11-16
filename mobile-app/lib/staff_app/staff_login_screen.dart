import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';
import '../shared/services/auth_service.dart';

class StaffLoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const StaffLoginScreen({super.key, required this.onLoginSuccess});

  @override
  State<StaffLoginScreen> createState() => _StaffLoginScreenState();
}

class _StaffLoginScreenState extends State<StaffLoginScreen> {
  final TextEditingController _staffIdController = TextEditingController(text: 'STF-01');
  final TextEditingController _pinController = TextEditingController(text: '8921');
  String _shift = 'Evening Shift (2:00 PM – 10:00 PM)';

  final List<String> _shifts = [
    'Morning Shift (6:00 AM – 2:00 PM)',
    'Evening Shift (2:00 PM – 10:00 PM)',
    'Night Security Shift (10:00 PM – 6:00 AM)',
  ];

  void _loginStaff() {
    final auth = Provider.of<AuthService>(context, listen: false);
    auth.loginAsStaff(
      name: 'Ramesh Kumar',
      phone: '+91 98111 22334',
      staffShift: _shift,
    );
    widget.onLoginSuccess();
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Hub Staff Portal Sign-In'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.darkNavy,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: AppColors.cartoonShadow(offset: 4),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.vibrantOrange,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.badge_rounded, color: Colors.white, size: 28),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Gate 1 Parcel Hub Terminal',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            auth.currentSociety?.name ?? 'Lakeview Residency',
                            style: const TextStyle(color: AppColors.slate400, fontSize: 12, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              const Text(
                'STAFF BADGE ID',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _staffIdController,
                decoration: const InputDecoration(
                  hintText: 'e.g. STF-01',
                  prefixIcon: Icon(Icons.person_pin_rounded),
                ),
              ),
              const SizedBox(height: 16),

              const Text(
                'ACTIVE SHIFT',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _shift,
                    isExpanded: true,
                    items: _shifts.map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)))).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _shift = val);
                    },
                  ),
                ),
              ),
              const SizedBox(height: 16),

              const Text(
                'SECURITY PIN',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _pinController,
                obscureText: true,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  hintText: '••••',
                  prefixIcon: Icon(Icons.lock_rounded),
                ),
              ),
              const SizedBox(height: 24),

              CustomButton(
                text: 'Launch Hub Operator Desk 🚀',
                onPressed: _loginStaff,
                backgroundColor: AppColors.vibrantOrange,
              ),
              const SizedBox(height: 16),

              // Instant bypass
              Center(
                child: TextButton.icon(
                  onPressed: _loginStaff,
                  icon: const Icon(Icons.bolt, color: AppColors.royalBlue),
                  label: const Text('Quick Login as Ramesh Kumar (Operator)', style: TextStyle(fontWeight: FontWeight.w800, color: AppColors.royalBlue)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

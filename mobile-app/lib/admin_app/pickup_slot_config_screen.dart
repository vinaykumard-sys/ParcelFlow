import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';

class PickupSlotConfigScreen extends StatefulWidget {
  const PickupSlotConfigScreen({super.key});

  @override
  State<PickupSlotConfigScreen> createState() => _PickupSlotConfigScreenState();
}

class _PickupSlotConfigScreenState extends State<PickupSlotConfigScreen> {
  // Slots matching the exact prompt and reference image: 6:00-6:30, 6:30-7:00, 7:00-7:30, 8:00-8:30, 9:00-9:30
  final List<Map<String, dynamic>> _slots = [
    {'time': '6:00 PM – 6:30 PM', 'label': 'Early Commute Slot', 'capacity': 15, 'booked': 4, 'enabled': true},
    {'time': '6:30 PM – 7:00 PM', 'label': 'Work Return Slot', 'capacity': 20, 'booked': 9, 'enabled': true},
    {'time': '7:00 PM – 7:30 PM', 'label': 'Peak Evening Rush', 'capacity': 25, 'booked': 18, 'enabled': true},
    {'time': '8:00 PM – 8:30 PM', 'label': 'Dinner Hours Slot', 'capacity': 20, 'booked': 12, 'enabled': true},
    {'time': '9:00 PM – 9:30 PM', 'label': 'Late Evening Gate Slot', 'capacity': 15, 'booked': 6, 'enabled': true},
  ];

  void _saveSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Pickup slot capacity rules synced across society hub!'),
        backgroundColor: AppColors.mintGreen,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Pickup-Slot Configuration'),
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
                child: const Row(
                  children: [
                    Icon(Icons.tune_rounded, color: AppColors.royalBlue, size: 24),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Set resident pickup slot throttles to prevent gate congestion during peak hours (6:00 PM - 9:30 PM).',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.slate600),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              const Text(
                'Configured Time Windows',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
              ),
              const SizedBox(height: 12),

              ..._slots.map((slot) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.borderDark, width: 2),
                    boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(slot['time'], style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppColors.darkNavy)),
                              Text(slot['label'], style: const TextStyle(fontSize: 11, color: AppColors.slate600, fontWeight: FontWeight.w600)),
                            ],
                          ),
                          Switch(
                            value: slot['enabled'],
                            activeColor: AppColors.mintGreen,
                            onChanged: (val) {
                              setState(() => slot['enabled'] = val);
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Capacity: ${slot['capacity']} residents max', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          Text('${slot['booked']} Booked today', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.royalBlue)),
                        ],
                      ),
                    ],
                  ),
                );
              }),

              const SizedBox(height: 16),
              CustomButton(
                text: 'Save Slot Configuration 💾',
                onPressed: _saveSettings,
                backgroundColor: AppColors.royalBlue,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

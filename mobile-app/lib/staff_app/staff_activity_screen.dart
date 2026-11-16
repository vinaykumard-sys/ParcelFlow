import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';

class StaffActivityScreen extends StatelessWidget {
  const StaffActivityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> logs = [
      {'time': '8:14 PM', 'action': 'OTP Handover Verified', 'detail': 'PF-8921-IN handed to Arjun Kumar (A-402)'},
      {'time': '7:42 PM', 'action': 'Parcel Ingestion', 'detail': 'PF-8926-IN stored in Cold Rack C-02 (Zepto)'},
      {'time': '7:15 PM', 'action': 'QR Code Pass Scanned', 'detail': 'PF-8924-IN handed to Sneha Iyer (A-301)'},
      {'time': '6:30 PM', 'action': 'Evening Shift Check-In', 'detail': 'Ramesh Kumar started shift at Gate 1'},
      {'time': '5:20 PM', 'action': 'Bulk Intake', 'detail': 'BlueDart delivered 8 parcels into Rack A'},
    ];

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Staff Shift Activity Log'),
      ),
      body: SafeArea(
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: logs.length,
          itemBuilder: (context, index) {
            final log = logs[index];
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.borderDark, width: 1.5),
                boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.slate100,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(log['time']!, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(log['action']!, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                        const SizedBox(height: 2),
                        Text(log['detail']!, style: const TextStyle(fontSize: 12, color: AppColors.slate600)),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

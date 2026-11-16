import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';

class OverdueParcelsScreen extends StatelessWidget {
  const OverdueParcelsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> overdue = [
      {'tracking': 'PF-8702-IN', 'flat': 'B-104', 'resident': 'Priya Sharma', 'rack': 'Rack B-08', 'days': '3 days in hub', 'courier': 'Flipkart'},
      {'tracking': 'PF-8691-IN', 'flat': 'C-801', 'resident': 'Ananya Deshmukh', 'rack': 'Rack A-05', 'days': '4 days in hub', 'courier': 'Amazon'},
    ];

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Uncollected / Overdue Parcels'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.warningRed, width: 1.5),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.warning_amber_rounded, color: AppColors.warningRed, size: 24),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Parcels uncollected for > 48 hours occupy hub shelf space. Staff can send an automated WhatsApp reminder ping.',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF991B1B)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              Expanded(
                child: ListView.builder(
                  itemCount: overdue.length,
                  itemBuilder: (context, index) {
                    final item = overdue[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.borderDark, width: 2),
                        boxShadow: AppColors.cartoonShadow(offset: 3),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(item['tracking']!, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppColors.warningLight,
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: AppColors.warningRed, width: 1),
                                ),
                                child: Text(item['days']!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.warningRed)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text('For ${item['resident']} • Flat ${item['flat']} • ${item['courier']}'),
                          Text('Currently occupying: ${item['rack']}', style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.royalBlue)),
                          const SizedBox(height: 12),
                          ElevatedButton.icon(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Automated WhatsApp reminder sent to ${item['resident']} (${item['flat']})')),
                              );
                            },
                            icon: const Icon(Icons.send_rounded, size: 16),
                            label: const Text('Send Urgent Reminder WhatsApp', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.vibrantOrange,
                              minimumSize: const Size.fromHeight(40),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

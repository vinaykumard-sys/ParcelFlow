import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';

class CourierLogScreen extends StatelessWidget {
  const CourierLogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> partners = [
      {'name': 'Amazon Prime', 'today': 42, 'pending': 4, 'color': AppColors.vibrantOrange, 'icon': '📦'},
      {'name': 'Flipkart Logistics', 'today': 23, 'pending': 2, 'color': AppColors.royalBlue, 'icon': '🛍️'},
      {'name': 'Blue Dart Express', 'today': 11, 'pending': 1, 'color': AppColors.purple, 'icon': '✈️'},
      {'name': 'Delhivery Direct', 'today': 7, 'pending': 1, 'color': AppColors.mintGreen, 'icon': '🚚'},
      {'name': 'Myntra Fast', 'today': 4, 'pending': 0, 'color': Colors.pink, 'icon': '👗'},
    ];

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Courier Partner Intake Log'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                  boxShadow: AppColors.cartoonShadow(offset: 3),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('87 Parcels Today', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.darkNavy)),
                        Text('Delivered across 5 major partner networks', style: TextStyle(fontSize: 12, color: AppColors.slate600)),
                      ],
                    ),
                    Icon(Icons.pie_chart_rounded, color: AppColors.royalBlue, size: 28),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              Expanded(
                child: ListView.builder(
                  itemCount: partners.length,
                  itemBuilder: (context, index) {
                    final item = partners[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.borderDark, width: 1.5),
                      ),
                      child: Row(
                        children: [
                          Text(item['icon'], style: const TextStyle(fontSize: 24)),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item['name'], style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                                Text('${item['pending']} uncollected in hub', style: const TextStyle(fontSize: 11, color: AppColors.slate600)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.slate100,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.borderDark, width: 1),
                            ),
                            child: Text(
                              '${item['today']} Delivered',
                              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: AppColors.darkNavy),
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

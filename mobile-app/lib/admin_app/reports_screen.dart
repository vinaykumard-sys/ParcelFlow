import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String _timeRange = 'Daily';

  // Peak hourly delivery distribution matching prompt section 12
  final List<Map<String, dynamic>> _hourlyStats = [
    {'hour': '10 AM', 'count': 8, 'pct': 0.3},
    {'hour': '12 PM', 'count': 14, 'pct': 0.5},
    {'hour': '2 PM', 'count': 19, 'pct': 0.7},
    {'hour': '4 PM', 'count': 26, 'pct': 0.9},
    {'hour': '6 PM', 'count': 28, 'pct': 1.0}, // Peak
    {'hour': '8 PM', 'count': 22, 'pct': 0.8},
    {'hour': '10 PM', 'count': 5, 'pct': 0.2},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Society Delivery Analytics'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Range Switcher
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: ['Daily', 'Weekly', 'Monthly'].map((range) {
                  final isSel = _timeRange == range;
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: ChoiceChip(
                      label: Text(range),
                      selected: isSel,
                      selectedColor: AppColors.royalBlue,
                      labelStyle: TextStyle(
                        color: isSel ? Colors.white : AppColors.darkNavy,
                        fontWeight: FontWeight.bold,
                      ),
                      onSelected: (_) => setState(() => _timeRange = range),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // KPI highlight card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                  boxShadow: AppColors.cartoonShadow(offset: 4),
                ),
                child: const Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Average Daily Intake', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.slate600)),
                        Text('87 Parcels', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.royalBlue)),
                      ],
                    ),
                    SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Average Pickup Time', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.slate600)),
                        Text('14.2 minutes', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.mintGreen)),
                      ],
                    ),
                    SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Demurrage Fee Avoidance', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.slate600)),
                        Text('98.6% On-Time', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.vibrantOrange)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              const Text(
                'Peak Hour Distribution (Arrivals)',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
              ),
              const SizedBox(height: 12),

              // Interactive Bar Graph
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                ),
                child: Column(
                  children: _hourlyStats.map((item) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 50,
                            child: Text(
                              item['hour'],
                              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: AppColors.slate600),
                            ),
                          ),
                          Expanded(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(6),
                              child: LinearProgressIndicator(
                                value: item['pct'],
                                minHeight: 18,
                                color: (item['pct'] >= 0.9) ? AppColors.vibrantOrange : AppColors.royalBlue,
                                backgroundColor: AppColors.slate100,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          SizedBox(
                            width: 32,
                            child: Text(
                              '${item['count']}',
                              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppColors.darkNavy),
                              textAlign: TextAlign.end,
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

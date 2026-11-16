import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';

class IssueResolutionScreen extends StatefulWidget {
  const IssueResolutionScreen({super.key});

  @override
  State<IssueResolutionScreen> createState() => _IssueResolutionScreenState();
}

class _IssueResolutionScreenState extends State<IssueResolutionScreen> {
  final List<Map<String, dynamic>> _tickets = [
    {
      'id': 'TKT-89201',
      'title': 'Damaged Package Box',
      'resident': 'Arjun Kumar',
      'flat': 'A-402',
      'courier': 'Amazon (PF-8921-IN)',
      'status': 'OPEN',
      'detail': 'Outer box corner torn. Resident requested hub inspection before OTP sign-off.',
    },
    {
      'id': 'TKT-89194',
      'title': 'Wrong Recipient Delivery',
      'resident': 'Rahul Verma',
      'flat': 'C-105',
      'courier': 'Delhivery',
      'status': 'IN_PROGRESS',
      'detail': 'Package addressed to Flat C-106 accidentally tagged to C-105 shelf.',
    },
    {
      'id': 'TKT-89100',
      'title': 'Delayed Cold Storage Pickup',
      'resident': 'Sneha Iyer',
      'flat': 'A-301',
      'courier': 'Zepto',
      'status': 'RESOLVED',
      'detail': 'Cold bag kept in chilled rack; collected without spoilage.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Dispute & Issue Resolution'),
      ),
      body: SafeArea(
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: _tickets.length,
          itemBuilder: (context, index) {
            final t = _tickets[index];
            final isOpen = t['status'] == 'OPEN';
            final isProgress = t['status'] == 'IN_PROGRESS';

            Color statusColor = AppColors.mintGreen;
            if (isOpen) statusColor = AppColors.warningRed;
            if (isProgress) statusColor = AppColors.vibrantOrange;

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
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
                      Text(t['id'], style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppColors.royalBlue)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: statusColor, width: 1),
                        ),
                        child: Text(
                          t['status'],
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: statusColor),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(t['title'], style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                  const SizedBox(height: 4),
                  Text('Raised by ${t['resident']} • Unit ${t['flat']} • ${t['courier']}', style: const TextStyle(fontSize: 12, color: AppColors.slate600)),
                  const SizedBox(height: 8),
                  Text(t['detail'], style: const TextStyle(fontSize: 12, height: 1.3)),
                  if (isOpen || isProgress) ...[
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        ElevatedButton(
                          onPressed: () {
                            setState(() => t['status'] = 'RESOLVED');
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Ticket ${t['id']} marked as Resolved!')),
                            );
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: AppColors.mintGreen, foregroundColor: AppColors.darkNavy),
                          child: const Text('Mark Resolved ✓', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

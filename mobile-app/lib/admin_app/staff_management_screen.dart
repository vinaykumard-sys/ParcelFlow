import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';

class StaffManagementScreen extends StatelessWidget {
  const StaffManagementScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // 12 staff members matching DB seed & reference image
    final List<Map<String, String>> staffList = [
      {'name': 'Ramesh Kumar', 'code': 'STF-01', 'role': 'Hub Supervisor', 'dept': 'Gate 1 Hub', 'shift': 'Evening Shift', 'status': 'Active On-Duty'},
      {'name': 'Suresh Patel', 'code': 'STF-02', 'role': 'Gate Dispatch', 'dept': 'Security Desk', 'shift': 'Morning Shift', 'status': 'Active'},
      {'name': 'Manoj Tiwari', 'code': 'STF-03', 'role': 'Parcel Specialist', 'dept': 'Hub Operations', 'shift': 'Day Shift', 'status': 'Active'},
      {'name': 'Deepak Sharma', 'code': 'STF-04', 'role': 'Security Officer', 'dept': 'Gate 2 Security', 'shift': 'Night Shift', 'status': 'Off-Duty'},
      {'name': 'Anil Nair', 'code': 'STF-05', 'role': 'Hub Associate', 'dept': 'Tower A Hub', 'shift': 'Morning Shift', 'status': 'Active'},
      {'name': 'Pooja Verma', 'code': 'STF-06', 'role': 'Customer Support', 'dept': 'Resident Desk', 'shift': 'Day Shift', 'status': 'Active'},
      {'name': 'Rajesh Singh', 'code': 'STF-07', 'role': 'Facility Tech', 'dept': 'Maintenance', 'shift': 'Day Shift', 'status': 'Active'},
      {'name': 'Vikas Yadav', 'code': 'STF-08', 'role': 'Security Guard', 'dept': 'Main Entry Gate', 'shift': 'Evening Shift', 'status': 'Active'},
      {'name': 'Kavita Joshi', 'code': 'STF-09', 'role': 'Inventory Assistant', 'dept': 'Parcel Bay', 'shift': 'Evening Shift', 'status': 'Active'},
      {'name': 'Ganesh Hegde', 'code': 'STF-10', 'role': 'Locker Maintenance', 'dept': 'Facilities', 'shift': 'Day Shift', 'status': 'Active'},
      {'name': 'Mohan Das', 'code': 'STF-11', 'role': 'Dispatch Runner', 'dept': 'Clubhouse Desk', 'shift': 'Day Shift', 'status': 'Active'},
      {'name': 'Santosh Rao', 'code': 'STF-12', 'role': 'Night Watchman', 'dept': 'Gate 1 Security', 'shift': 'Night Shift', 'status': 'Off-Duty'},
    ];

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Staff & Operator Roster (12)'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderDark, width: 2),
                boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('12 Registered Staff', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                  Text('8 On-Duty Now', style: TextStyle(fontWeight: FontWeight.w900, color: AppColors.mintGreen, fontSize: 14)),
                ],
              ),
            ),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: staffList.length,
                itemBuilder: (context, index) {
                  final staff = staffList[index];
                  final isOnDuty = staff['status']!.contains('Active');

                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.borderDark, width: 1.5),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isOnDuty ? AppColors.mintLight : AppColors.slate100,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: isOnDuty ? AppColors.mintGreen : AppColors.slate400, width: 1.5),
                        ),
                        child: Icon(Icons.badge, color: isOnDuty ? const Color(0xFF047857) : AppColors.slate600, size: 22),
                      ),
                      title: Text(staff['name']!, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                      subtitle: Text('${staff['code']} • ${staff['role']} (${staff['dept']})\n${staff['shift']}', style: const TextStyle(fontSize: 11, color: AppColors.slate600)),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isOnDuty ? AppColors.mintGreen : AppColors.slate200,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          staff['status']!,
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isOnDuty ? AppColors.darkNavy : AppColors.slate600),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

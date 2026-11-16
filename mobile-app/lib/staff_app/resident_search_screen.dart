import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';

class ResidentSearchScreen extends StatefulWidget {
  const ResidentSearchScreen({super.key});

  @override
  State<ResidentSearchScreen> createState() => _ResidentSearchScreenState();
}

class _ResidentSearchScreenState extends State<ResidentSearchScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _query = '';

  final List<Map<String, String>> _allResidents = [
    {'name': 'Arjun Kumar', 'flat': 'A-402', 'tower': 'Tower A', 'phone': '+91 98765 43210', 'status': 'Active Resident'},
    {'name': 'Priya Sharma', 'flat': 'B-204', 'tower': 'Tower B', 'phone': '+91 98234 56789', 'status': 'Active Resident'},
    {'name': 'Rahul Verma', 'flat': 'C-105', 'tower': 'Tower C', 'phone': '+91 99123 45678', 'status': 'Active Resident'},
    {'name': 'Sneha Iyer', 'flat': 'A-301', 'tower': 'Tower A', 'phone': '+91 97654 32109', 'status': 'Active Resident'},
    {'name': 'Vikram Shah', 'flat': 'B-502', 'tower': 'Tower B', 'phone': '+91 98450 11223', 'status': 'Active Resident'},
    {'name': 'Ananya Deshmukh', 'flat': 'C-801', 'tower': 'Tower C', 'phone': '+91 98999 12345', 'status': 'Active Resident'},
    {'name': 'Kunal Singhal', 'flat': 'A-203', 'tower': 'Tower A', 'phone': '+91 97000 88776', 'status': 'Active Resident'},
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _allResidents.where((r) {
      final q = _query.toLowerCase();
      return r['name']!.toLowerCase().contains(q) ||
             r['flat']!.toLowerCase().contains(q) ||
             r['phone']!.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Resident Directory'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _searchCtrl,
                autofocus: true,
                onChanged: (val) => setState(() => _query = val),
                decoration: InputDecoration(
                  hintText: 'Search by Flat (e.g. A-402), Name or Phone...',
                  prefixIcon: const Icon(Icons.search, color: AppColors.slate600),
                  suffixIcon: _query.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear),
                          onPressed: () {
                            _searchCtrl.clear();
                            setState(() => _query = '');
                          },
                        )
                      : null,
                ),
              ),
            ),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: filtered.length,
                itemBuilder: (context, index) {
                  final res = filtered[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    decoration: BoxDecoration(
                      color: AppColors.pureWhite,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.borderDark, width: 2),
                      boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
                    ),
                    child: ListTile(
                      onTap: () {
                        Navigator.pop(context, res);
                      },
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.slate100,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.borderDark, width: 1.5),
                        ),
                        child: Text(
                          res['flat']!,
                          style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.royalBlue, fontSize: 13),
                        ),
                      ),
                      title: Text(res['name']!, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                      subtitle: Text('${res['tower']} • ${res['phone']}', style: const TextStyle(fontSize: 12, color: AppColors.slate600)),
                      trailing: const Icon(Icons.check_circle_outline, color: AppColors.royalBlue),
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

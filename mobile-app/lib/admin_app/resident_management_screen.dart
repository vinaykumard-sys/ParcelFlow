import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';

class ResidentManagementScreen extends StatefulWidget {
  const ResidentManagementScreen({super.key});

  @override
  State<ResidentManagementScreen> createState() => _ResidentManagementScreenState();
}

class _ResidentManagementScreenState extends State<ResidentManagementScreen> {
  final List<Map<String, dynamic>> _residents = [
    {'name': 'Arjun Kumar', 'flat': 'A-402', 'tower': 'Tower A', 'phone': '+91 98765 43210', 'parcels': 2, 'status': 'Active'},
    {'name': 'Priya Sharma', 'flat': 'B-204', 'tower': 'Tower B', 'phone': '+91 98234 56789', 'parcels': 1, 'status': 'Active'},
    {'name': 'Rahul Verma', 'flat': 'C-105', 'tower': 'Tower C', 'phone': '+91 99123 45678', 'parcels': 1, 'status': 'Active'},
    {'name': 'Sneha Iyer', 'flat': 'A-301', 'tower': 'Tower A', 'phone': '+91 97654 32109', 'parcels': 0, 'status': 'Active'},
    {'name': 'Vikram Shah', 'flat': 'B-502', 'tower': 'Tower B', 'phone': '+91 98450 11223', 'parcels': 1, 'status': 'Active'},
    {'name': 'Ananya Deshmukh', 'flat': 'C-801', 'tower': 'Tower C', 'phone': '+91 98999 12345', 'parcels': 0, 'status': 'Active'},
    {'name': 'Kunal Singhal', 'flat': 'A-203', 'tower': 'Tower A', 'phone': '+91 97000 88776', 'parcels': 0, 'status': 'Active'},
  ];

  final TextEditingController _searchCtrl = TextEditingController();
  String _query = '';

  void _showAddResidentDialog() {
    final nameCtrl = TextEditingController();
    final flatCtrl = TextEditingController();
    final towerCtrl = TextEditingController(text: 'Tower A');
    final phoneCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.creamBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: AppColors.borderDark, width: 2)),
        title: const Text('Enroll New Resident', style: TextStyle(fontWeight: FontWeight.w900)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Resident Full Name')),
            const SizedBox(height: 10),
            TextField(controller: flatCtrl, decoration: const InputDecoration(labelText: 'Flat Unit (e.g. B-302)')),
            const SizedBox(height: 10),
            TextField(controller: towerCtrl, decoration: const InputDecoration(labelText: 'Tower (e.g. Tower B)')),
            const SizedBox(height: 10),
            TextField(controller: phoneCtrl, keyboardType: TextInputType.phone, decoration: const InputDecoration(labelText: 'Phone Number')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (nameCtrl.text.isNotEmpty && flatCtrl.text.isNotEmpty) {
                setState(() {
                  _residents.insert(0, {
                    'name': nameCtrl.text,
                    'flat': flatCtrl.text,
                    'tower': towerCtrl.text,
                    'phone': '+91 ${phoneCtrl.text}',
                    'parcels': 0,
                    'status': 'Active',
                  });
                });
                Navigator.pop(ctx);
              }
            },
            child: const Text('Add to Society Hub'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _residents.where((r) {
      final q = _query.toLowerCase();
      return r['name'].toString().toLowerCase().contains(q) ||
             r['flat'].toString().toLowerCase().contains(q) ||
             r['phone'].toString().toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Resident Directory'),
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined),
            tooltip: 'Export CSV',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Resident directory exported to CSV')),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _searchCtrl,
                onChanged: (val) => setState(() => _query = val),
                decoration: const InputDecoration(
                  hintText: 'Search resident by name, flat #, or phone...',
                  prefixIcon: Icon(Icons.search),
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
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderDark, width: 2),
                      boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      leading: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.slate100,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.borderDark, width: 1.5),
                        ),
                        child: Text(
                          res['flat'],
                          style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.royalBlue, fontSize: 13),
                        ),
                      ),
                      title: Text(res['name'], style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15)),
                      subtitle: Text('${res['tower']} • ${res['phone']}', style: const TextStyle(fontSize: 12, color: AppColors.slate600)),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.mintLight,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.mintGreen, width: 1),
                        ),
                        child: Text(
                          '${res['parcels']} In Hub',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF047857)),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: CustomButton(
                text: '+ Enroll New Resident',
                onPressed: _showAddResidentDialog,
                backgroundColor: AppColors.royalBlue,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

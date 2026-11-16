import 'package:flutter/material.dart';
import '../shared/models/resident_model.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';

class AuthorizedCollectorsScreen extends StatefulWidget {
  const AuthorizedCollectorsScreen({super.key});

  @override
  State<AuthorizedCollectorsScreen> createState() => _AuthorizedCollectorsScreenState();
}

class _AuthorizedCollectorsScreenState extends State<AuthorizedCollectorsScreen> {
  final List<AuthorizedCollector> _collectors = [
    AuthorizedCollector(
      id: 'col-1',
      name: 'Pooja Kumar',
      relationship: 'Spouse',
      phone: '+91 98765 43211',
      hasQrAccess: true,
    ),
    AuthorizedCollector(
      id: 'col-2',
      name: 'Sunita Bai',
      relationship: 'House Help',
      phone: '+91 98450 99881',
      hasQrAccess: true,
    ),
  ];

  void _showAddCollectorDialog() {
    final nameCtrl = TextEditingController();
    final relationCtrl = TextEditingController(text: 'Family Member');
    final phoneCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: AppColors.creamBg,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: AppColors.borderDark, width: 2),
          ),
          title: const Text('Add Authorized Collector', style: TextStyle(fontWeight: FontWeight.w900)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: 'Full Name', hintText: 'e.g. Pooja Kumar'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: relationCtrl,
                decoration: const InputDecoration(labelText: 'Relationship', hintText: 'e.g. Spouse / Brother'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'Phone Number', hintText: '98765 00000'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: AppColors.slate600, fontWeight: FontWeight.bold)),
            ),
            ElevatedButton(
              onPressed: () {
                if (nameCtrl.text.isNotEmpty && phoneCtrl.text.isNotEmpty) {
                  setState(() {
                    _collectors.add(
                      AuthorizedCollector(
                        id: 'col-${DateTime.now().millisecondsSinceEpoch}',
                        name: nameCtrl.text,
                        relationship: relationCtrl.text,
                        phone: '+91 ${phoneCtrl.text}',
                        hasQrAccess: true,
                      ),
                    );
                  });
                  Navigator.pop(ctx);
                }
              },
              child: const Text('Add Collector'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Authorized Collectors'),
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
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.royalBlue, width: 1.5),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.shield_outlined, color: AppColors.royalBlue, size: 22),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Authorized members can present their own phone number or delegated QR code at Gate 1 hub to collect your deliveries.',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF1E3A8A)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              Expanded(
                child: ListView.builder(
                  itemCount: _collectors.length,
                  itemBuilder: (context, index) {
                    final col = _collectors[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.borderDark, width: 2),
                        boxShadow: AppColors.cartoonShadow(offset: 3),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        leading: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: AppColors.mintLight,
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.borderDark, width: 1.5),
                          ),
                          child: const Center(
                            child: Icon(Icons.person, color: AppColors.darkNavy),
                          ),
                        ),
                        title: Text(col.name, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15)),
                        subtitle: Text('${col.relationship} • ${col.phone}', style: const TextStyle(fontSize: 12, color: AppColors.slate600)),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete_outline, color: AppColors.warningRed),
                          onPressed: () {
                            setState(() => _collectors.removeAt(index));
                          },
                        ),
                      ),
                    );
                  },
                ),
              ),

              CustomButton(
                text: '+ Add Trusted Collector',
                onPressed: _showAddCollectorDialog,
                backgroundColor: AppColors.royalBlue,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

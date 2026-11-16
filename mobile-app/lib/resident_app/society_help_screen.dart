import 'package:flutter/material.dart';
import '../shared/theme/app_colors.dart';

class SocietyHelpScreen extends StatelessWidget {
  const SocietyHelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Society Hub Guide'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hub Operating Hours Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.borderDark, width: 2),
                boxShadow: AppColors.cartoonShadow(offset: 4),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.storefront_rounded, color: AppColors.royalBlue, size: 24),
                      SizedBox(width: 10),
                      Text(
                        'Gate 1 Parcel Hub',
                        style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.darkNavy),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _ruleRow('Hub Operating Hours', '6:00 AM – 10:30 PM Daily'),
                  _ruleRow('Supervisor on Duty', 'Ramesh Kumar (+91 98111 22334)'),
                  _ruleRow('Cold Storage Retention', 'Maximum 24 hours for perishable groceries'),
                  _ruleRow('Standard Shelf Retention', 'Up to 72 hours without demurrage'),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text('Frequently Asked Questions', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.darkNavy)),
            const SizedBox(height: 12),

            _faqTile(
              question: 'Why does ParcelFlow eliminate spam courier calls?',
              answer: 'Delivery riders drop shipments at the Gate 1 hub directly. The hub staff scan the package barcode once, which alerts your app and lets you pick it up securely on your schedule.',
            ),
            _faqTile(
              question: 'What if I am out of town for a week?',
              answer: 'You can delegate an authorized collector (neighbor, relative, or house help) via your Profile tab, or flag the shipment as "Vacation Hold" in the app.',
            ),
            _faqTile(
              question: 'Can someone else pick up my parcel?',
              answer: 'Yes! Simply forward your 4-digit OTP or share the digital QR code from the app. Once verified by the hub operator, the status updates in real-time.',
            ),
            _faqTile(
              question: 'What happens to Cash on Delivery (COD) orders?',
              answer: 'Prepaid orders are recommended for instant automated locker deposit. For COD packages, hub staff can hold the package at the desk until payment is made at pickup.',
            ),
          ],
        ),
      ),
    );
  }

  Widget _ruleRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('• ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.royalBlue)),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: const TextStyle(fontSize: 13, color: AppColors.slate800),
                children: [
                  TextSpan(text: '$title: ', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkNavy)),
                  TextSpan(text: value),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _faqTile({required String question, required String answer}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderDark, width: 1.5),
      ),
      child: ExpansionTile(
        title: Text(question, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.darkNavy)),
        childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
        children: [
          Text(answer, style: const TextStyle(fontSize: 12, color: AppColors.slate600, height: 1.4)),
        ],
      ),
    );
  }
}

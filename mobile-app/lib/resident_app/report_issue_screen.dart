import 'package:flutter/material.dart';
import '../shared/models/parcel_model.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';

class ReportIssueScreen extends StatefulWidget {
  final ParcelModel? parcel;

  const ReportIssueScreen({super.key, this.parcel});

  @override
  State<ReportIssueScreen> createState() => _ReportIssueScreenState();
}

class _ReportIssueScreenState extends State<ReportIssueScreen> {
  String _issueType = 'Damaged Package Box';
  final TextEditingController _descController = TextEditingController();
  bool _submitted = false;
  String _ticketNumber = '';

  final List<String> _issueTypes = [
    'Damaged Package Box',
    'Wrong Recipient / Flat Mismatch',
    'Perishable Item Left Unrefrigerated',
    'OTP Not Accepted at Hub Desk',
    'Courier Left Without Depositing',
    'Other Query / Dispute',
  ];

  void _submitTicket() {
    if (_descController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please provide a brief description of the issue.')),
      );
      return;
    }

    setState(() {
      _submitted = true;
      _ticketNumber = 'TKT-${DateTime.now().millisecondsSinceEpoch % 100000}';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Report Delivery Dispute'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: _submitted
              ? Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.borderDark, width: 2),
                    boxShadow: AppColors.cartoonShadow(offset: 4),
                  ),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.mintLight,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.mintGreen, width: 2),
                        ),
                        child: const Icon(Icons.check_circle_rounded, size: 48, color: AppColors.mintGreen),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Dispute Ticket Raised!',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Ticket ID: $_ticketNumber',
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.royalBlue),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Hub Operator Ramesh K and Society RWA have been alerted. You will receive an SMS resolution update within 4 hours.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 13, color: AppColors.slate600, height: 1.4),
                      ),
                      const SizedBox(height: 24),
                      CustomButton(
                        text: 'Return to Hub',
                        onPressed: () => Navigator.pop(context),
                        backgroundColor: AppColors.royalBlue,
                      ),
                    ],
                  ),
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (widget.parcel != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.pureWhite,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.borderDark, width: 1.5),
                        ),
                        child: Row(
                          children: [
                            const Text('📦 ', style: TextStyle(fontSize: 18)),
                            Expanded(
                              child: Text(
                                '${widget.parcel!.trackingNumber} • ${widget.parcel!.courierName}',
                                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                              ),
                            ),
                            Text(widget.parcel!.storageRack ?? 'Rack A', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    const Text(
                      'ISSUE CATEGORY',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.borderDark, width: 2),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _issueType,
                          isExpanded: true,
                          items: _issueTypes.map((type) {
                            return DropdownMenuItem(value: type, child: Text(type, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)));
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _issueType = val);
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    const Text(
                      'EXPLAIN WHAT HAPPENED',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _descController,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        hintText: 'e.g. Package was dented and opened when collected at Gate 1.',
                      ),
                    ),
                    const SizedBox(height: 24),

                    CustomButton(
                      text: 'Submit Dispute to Society Hub 🚨',
                      onPressed: _submitTicket,
                      backgroundColor: AppColors.warningRed,
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}

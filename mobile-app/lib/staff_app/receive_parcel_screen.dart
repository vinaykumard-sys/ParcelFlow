import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/widgets/custom_button.dart';
import '../shared/services/parcel_service.dart';
import '../shared/services/notification_service.dart';
import 'barcode_scanner_screen.dart';
import 'resident_search_screen.dart';
import 'storage_assignment_screen.dart';

class ReceiveParcelScreen extends StatefulWidget {
  final String? initialTrackingNumber;

  const ReceiveParcelScreen({super.key, this.initialTrackingNumber});

  @override
  State<ReceiveParcelScreen> createState() => _ReceiveParcelScreenState();
}

class _ReceiveParcelScreenState extends State<ReceiveParcelScreen> {
  final TextEditingController _trackingController = TextEditingController();
  final TextEditingController _recipientNameController = TextEditingController(text: 'Arjun Kumar');
  final TextEditingController _phoneController = TextEditingController(text: '+91 98765 43210');
  final TextEditingController _weightController = TextEditingController(text: '1.4');
  final TextEditingController _notesController = TextEditingController();

  String _courier = 'Amazon Prime';
  String _tower = 'Tower A';
  String _flatNumber = 'A-402';
  String _storageRack = 'Rack A-12';
  bool _isPerishable = false;
  bool _isSubmitting = false;

  final List<String> _couriers = [
    'Amazon Prime',
    'Flipkart',
    'Blue Dart',
    'Delhivery',
    'Myntra',
    'Shadowfax',
    'Zepto Café & Fresh',
    'Swiggy Instamart',
    'Blinkit',
    'DTDC',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialTrackingNumber != null) {
      _trackingController.text = widget.initialTrackingNumber!;
    } else {
      _trackingController.text = 'PF-${(8900 + DateTime.now().millisecond % 99)}-IN';
    }
  }

  void _openCameraScan() async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (_) => const BarcodeScannerScreen()),
    );
    if (result != null && result.isNotEmpty) {
      setState(() => _trackingController.text = result);
    }
  }

  void _openResidentSearch() async {
    final result = await Navigator.push<Map<String, String>>(
      context,
      MaterialPageRoute(builder: (_) => const ResidentSearchScreen()),
    );
    if (result != null) {
      setState(() {
        _recipientNameController.text = result['name'] ?? '';
        _phoneController.text = result['phone'] ?? '';
        _flatNumber = result['flat'] ?? 'A-402';
        _tower = result['tower'] ?? 'Tower A';
      });
    }
  }

  void _openRackPicker() async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (_) => StorageAssignmentScreen(currentRack: _storageRack)),
    );
    if (result != null) {
      setState(() => _storageRack = result);
    }
  }

  void _submitIngest() async {
    if (_trackingController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter tracking ID')));
      return;
    }

    setState(() => _isSubmitting = true);

    final parcelService = Provider.of<ParcelService>(context, listen: false);
    final notifService = Provider.of<NotificationService>(context, listen: false);

    final parcel = await parcelService.receiveNewParcel(
      trackingNumber: _trackingController.text.trim(),
      courierName: _courier,
      recipientName: _recipientNameController.text.trim(),
      recipientPhone: _phoneController.text.trim(),
      flatNumber: _flatNumber,
      tower: _tower,
      storageRack: _storageRack,
      weightKg: double.tryParse(_weightController.text),
      isPerishable: _isPerishable,
      notes: _notesController.text.isNotEmpty ? _notesController.text : null,
    );

    notifService.addNotification(
      title: '📦 New Parcel Ingested',
      message: 'Parcel ${_trackingController.text} for Flat $_flatNumber stored in $_storageRack.',
      type: 'parcel_arrival',
      parcelId: parcel.id,
    );

    setState(() => _isSubmitting = false);

    if (mounted) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          backgroundColor: AppColors.creamBg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: AppColors.borderDark, width: 2)),
          title: const Text('Parcel Ingested! 🎉', style: TextStyle(fontWeight: FontWeight.w900)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Tracking: ${parcel.trackingNumber}', style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text('Assigned to: $_storageRack'),
              Text('Recipient: ${_recipientNameController.text} (Flat $_flatNumber)'),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AppColors.mintLight, borderRadius: BorderRadius.circular(8)),
                child: Text('Auto-Generated OTP: ${parcel.otpCode}', style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF065F46))),
              ),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                Navigator.pop(context);
              },
              child: const Text('Done'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Receive & Ingest Parcel'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // AWB Tracking Barcode Section
              const Text('COURIER AWB / TRACKING #', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600)),
              const SizedBox(height: 6),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _trackingController,
                      decoration: const InputDecoration(
                        hintText: 'e.g. PF-8927-IN',
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: _openCameraScan,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.royalBlue,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    ),
                    child: const Icon(Icons.qr_code_scanner, color: Colors.white),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Courier Partner Dropdown
              const Text('COURIER SERVICE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600)),
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
                    value: _courier,
                    isExpanded: true,
                    items: _couriers.map((c) => DropdownMenuItem(value: c, child: Text(c, style: const TextStyle(fontWeight: FontWeight.bold)))).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _courier = val);
                    },
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Resident Match & Search Trigger
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('RECIPIENT & FLAT DESTINATION', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600)),
                  TextButton.icon(
                    onPressed: _openResidentSearch,
                    icon: const Icon(Icons.search, size: 16, color: AppColors.royalBlue),
                    label: const Text('Find Resident', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.royalBlue)),
                  ),
                ],
              ),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _recipientNameController,
                      decoration: const InputDecoration(labelText: 'Name'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  SizedBox(
                    width: 110,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 14),
                      decoration: BoxDecoration(
                        color: AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.borderDark, width: 2),
                      ),
                      child: Text(
                        _flatNumber,
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.royalBlue),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Storage Rack Selection
              const Text('STORAGE SHELF LOCATION', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.slate600)),
              const SizedBox(height: 6),
              InkWell(
                onTap: _openRackPicker,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.borderDark, width: 2),
                    boxShadow: const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.shelves, color: AppColors.royalBlue),
                          const SizedBox(width: 10),
                          Text(
                            _storageRack,
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppColors.darkNavy),
                          ),
                        ],
                      ),
                      const Text('Change Shelf', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.royalBlue)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Perishable Checkbox
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Perishable / Fresh Grocery (Requires Cold Storage)', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                value: _isPerishable,
                activeColor: AppColors.vibrantOrange,
                onChanged: (val) {
                  setState(() {
                    _isPerishable = val ?? false;
                    if (_isPerishable) {
                      _storageRack = 'Cold Rack C-01';
                    }
                  });
                },
              ),
              const SizedBox(height: 20),

              CustomButton(
                text: 'Store Parcel & Alert Resident 📲',
                onPressed: _submitIngest,
                isLoading: _isSubmitting,
                backgroundColor: AppColors.royalBlue,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

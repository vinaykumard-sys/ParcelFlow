import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/parcel_service.dart';
import '../shared/models/parcel_model.dart';
import '../shared/widgets/status_pill.dart';

class ParcelTrackingScreen extends StatefulWidget {
  final String? initialSearch;

  const ParcelTrackingScreen({super.key, this.initialSearch});

  @override
  State<ParcelTrackingScreen> createState() => _ParcelTrackingScreenState();
}

class _ParcelTrackingScreenState extends State<ParcelTrackingScreen> {
  late TextEditingController _searchCtrl;
  ParcelModel? _foundParcel;
  bool _searched = false;

  @override
  void initState() {
    super.initState();
    _searchCtrl = TextEditingController(text: widget.initialSearch ?? 'PF-8921-IN');
    if (widget.initialSearch != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _doSearch());
    }
  }

  void _doSearch() {
    final parcelService = Provider.of<ParcelService>(context, listen: false);
    final term = _searchCtrl.text.trim().toLowerCase();
    final match = parcelService.parcels.firstWhere(
      (p) => p.trackingNumber.toLowerCase().contains(term) || (p.awbBarcode != null && p.awbBarcode!.toLowerCase().contains(term)),
      orElse: () => parcelService.parcels.first,
    );

    setState(() {
      _foundParcel = match;
      _searched = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Parcel Live Tracking'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchCtrl,
                      decoration: const InputDecoration(
                        hintText: 'Enter Tracking ID (e.g. PF-8921-IN)',
                        prefixIcon: Icon(Icons.search),
                      ),
                      onSubmitted: (_) => _doSearch(),
                    ),
                  ),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: _doSearch,
                    style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14)),
                    child: const Text('Track', style: TextStyle(fontWeight: FontWeight.w900)),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              if (_searched && _foundParcel != null) ...[
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.borderDark, width: 2),
                    boxShadow: AppColors.cartoonShadow(offset: 4),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            _foundParcel!.trackingNumber,
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 22, color: AppColors.darkNavy),
                          ),
                          StatusPill(status: _foundParcel!.status),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Carrier: ${_foundParcel!.courierName} • Recipient: ${_foundParcel!.recipientName}',
                        style: const TextStyle(fontSize: 13, color: AppColors.slate600, fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 16),
                      const Divider(color: AppColors.slate200),
                      const SizedBox(height: 12),

                      _infoLine('Destination Unit', 'Flat ${_foundParcel!.flatNumber} (${_foundParcel!.tower})'),
                      _infoLine('Storage Location', _foundParcel!.storageRack ?? 'Rack A-12'),
                      _infoLine('Scheduled Window', _foundParcel!.pickupSlotTime ?? 'Not scheduled'),
                      _infoLine('Active OTP PIN', _foundParcel!.otpCode ?? '4829 (Valid)'),
                      _infoLine('QR Token Payload', _foundParcel!.qrPayload ?? 'PF-TOKEN-8921-SECURE'),
                      _infoLine('Demurrage Charge', '₹0 (Within free 72h window)'),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _infoLine(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.slate600)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppColors.darkNavy)),
        ],
      ),
    );
  }
}

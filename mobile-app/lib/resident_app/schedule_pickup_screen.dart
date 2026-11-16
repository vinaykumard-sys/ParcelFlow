import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/models/parcel_model.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/parcel_service.dart';
import '../shared/widgets/custom_button.dart';
import 'otp_screen.dart';

class SchedulePickupScreen extends StatefulWidget {
  final ParcelModel parcel;

  const SchedulePickupScreen({super.key, required this.parcel});

  @override
  State<SchedulePickupScreen> createState() => _SchedulePickupScreenState();
}

class _SchedulePickupScreenState extends State<SchedulePickupScreen> {
  String _selectedSlot = '8:00 PM – 8:30 PM';
  DateTime _selectedDate = DateTime.now();

  final List<Map<String, dynamic>> _slots = [
    {'time': '5:00 PM – 5:30 PM', 'label': 'Early Evening Slot', 'spots': 6},
    {'time': '6:30 PM – 7:00 PM', 'label': 'Work Return Slot', 'spots': 4},
    {'time': '8:00 PM – 8:30 PM', 'label': 'Recommended Popular', 'spots': 12},
    {'time': '9:15 PM – 9:45 PM', 'label': 'Night Owl Slot', 'spots': 8},
  ];

  void _confirmBooking() async {
    final parcelService = Provider.of<ParcelService>(context, listen: false);
    final success = await parcelService.schedulePickup(
      widget.parcel.id,
      _selectedSlot,
      _selectedDate,
    );

    if (mounted && success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Pickup slot booked for $_selectedSlot!')),
      );

      // Fetch the updated parcel model
      final updated = parcelService.parcels.firstWhere((p) => p.id == widget.parcel.id);

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => OtpScreen(parcel: updated)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Schedule Pickup'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Parcel Banner
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                  boxShadow: const [
                    BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.creamBg,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.borderDark, width: 1.5),
                      ),
                      child: const Text('📦', style: TextStyle(fontSize: 22)),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.parcel.trackingNumber,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
                          ),
                          Text(
                            '${widget.parcel.courierName} • Stored in ${widget.parcel.storageRack ?? "Rack A"}',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.slate600),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              const Text(
                'Select Pickup Window',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkNavy),
              ),
              const SizedBox(height: 4),
              const Text(
                'Pick a convenient 30-minute interval to avoid congestion at the gate locker bay.',
                style: TextStyle(fontSize: 13, color: AppColors.slate600, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 16),

              // Slots List
              ..._slots.map((slot) {
                final isSelected = _selectedSlot == slot['time'];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFFEFF6FF) : AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected ? AppColors.royalBlue : AppColors.borderDark,
                      width: isSelected ? 2.5 : 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.borderDark,
                        offset: Offset(isSelected ? 1.5 : 3, isSelected ? 1.5 : 3),
                        blurRadius: 0,
                      ),
                    ],
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    onTap: () {
                      setState(() => _selectedSlot = slot['time']);
                    },
                    leading: Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isSelected ? AppColors.royalBlue : Colors.transparent,
                        border: Border.all(
                          color: isSelected ? AppColors.royalBlue : AppColors.borderDark,
                          width: 2,
                        ),
                      ),
                      child: isSelected
                          ? const Center(child: Icon(Icons.check, size: 14, color: Colors.white))
                          : null,
                    ),
                    title: Text(
                      slot['time'],
                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppColors.darkNavy),
                    ),
                    subtitle: Text(
                      slot['label'],
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.slate600),
                    ),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.mintGreen : AppColors.slate100,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.borderDark, width: 1),
                      ),
                      child: Text(
                        '${slot['spots']} spots left',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: isSelected ? AppColors.darkNavy : AppColors.slate600,
                        ),
                      ),
                    ),
                  ),
                );
              }),

              const SizedBox(height: 20),
              CustomButton(
                text: 'Confirm Slot & Generate Handover OTP 🚀',
                onPressed: _confirmBooking,
                backgroundColor: AppColors.royalBlue,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

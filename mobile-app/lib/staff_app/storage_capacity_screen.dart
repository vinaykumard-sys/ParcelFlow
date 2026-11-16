import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/storage_service.dart';

class StorageCapacityScreen extends StatelessWidget {
  const StorageCapacityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final storage = Provider.of<StorageService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Storage Rack Heatmap'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Capacity Header Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderDark, width: 2),
                  boxShadow: AppColors.cartoonShadow(offset: 4),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Overall Hub Capacity', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                        Text(
                          '${(storage.occupancyRate * 100).toInt()}% Used',
                          style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.royalBlue, fontSize: 15),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: storage.occupancyRate,
                        minHeight: 12,
                        color: AppColors.royalBlue,
                        backgroundColor: AppColors.slate200,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _metricMini('Total Slots', '${storage.totalSlots}'),
                        _metricMini('Occupied', '${storage.occupiedSlots}'),
                        _metricMini('Available', '${storage.freeSlots}'),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Rack A Section
              _sectionHeader('Rack A — Standard Boxes (16 Shelves)'),
              const SizedBox(height: 8),
              _rackGrid(storage.getSlotsBySection('Rack A')),
              const SizedBox(height: 20),

              // Rack B Section
              _sectionHeader('Rack B — Heavy & Large Packages (16 Shelves)'),
              const SizedBox(height: 8),
              _rackGrid(storage.getSlotsBySection('Rack B')),
              const SizedBox(height: 20),

              // Cold Storage Section
              _sectionHeader('Cold Locker — Refrigerated Fresh (6 Shelves)'),
              const SizedBox(height: 8),
              _rackGrid(storage.getSlotsBySection('Cold Storage')),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionHeader(String title) {
    return Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppColors.darkNavy));
  }

  Widget _metricMini(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.darkNavy)),
        Text(label, style: const TextStyle(fontSize: 11, color: AppColors.slate600)),
      ],
    );
  }

  Widget _rackGrid(List<RackSlot> slots) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
        childAspectRatio: 1.2,
      ),
      itemCount: slots.length,
      itemBuilder: (context, index) {
        final slot = slots[index];
        final isOcc = slot.isOccupied;

        return Container(
          decoration: BoxDecoration(
            color: isOcc ? const Color(0xFFFEE2E2) : const Color(0xFFDCFCE7),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isOcc ? AppColors.warningRed : AppColors.mintGreen,
              width: 1.5,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                slot.rackCode.replaceAll('Rack ', '').replaceAll('Cold ', ''),
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppColors.darkNavy),
              ),
              Text(
                isOcc ? (slot.recipientFlat ?? 'Occ') : 'Free',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: isOcc ? AppColors.warningRed : const Color(0xFF047857),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/storage_service.dart';

class StorageAssignmentScreen extends StatefulWidget {
  final String currentRack;

  const StorageAssignmentScreen({super.key, required this.currentRack});

  @override
  State<StorageAssignmentScreen> createState() => _StorageAssignmentScreenState();
}

class _StorageAssignmentScreenState extends State<StorageAssignmentScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late String _selectedRack;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _selectedRack = widget.currentRack;
  }

  @override
  Widget build(BuildContext context) {
    final storage = Provider.of<StorageService>(context);

    final rackASlots = storage.getSlotsBySection('Rack A');
    final rackBSlots = storage.getSlotsBySection('Rack B');
    final coldSlots = storage.getSlotsBySection('Cold Storage');

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Assign Storage Rack & Shelf'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.borderDark, width: 2),
              ),
              child: TabBar(
                controller: _tabController,
                indicator: BoxDecoration(
                  color: AppColors.royalBlue,
                  borderRadius: BorderRadius.circular(8),
                ),
                labelColor: Colors.white,
                unselectedLabelColor: AppColors.slate600,
                labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                tabs: const [
                  Tab(text: 'Rack A (Standard)'),
                  Tab(text: 'Rack B (Heavy)'),
                  Tab(text: 'Cold Storage'),
                ],
              ),
            ),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildShelfGrid(rackASlots),
                  _buildShelfGrid(rackBSlots),
                  _buildShelfGrid(coldSlots),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context, _selectedRack),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.royalBlue,
                  minimumSize: const Size.fromHeight(50),
                ),
                child: Text('Confirm Assignment: $_selectedRack'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShelfGrid(List<RackSlot> slots) {
    return GridView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 1.1,
      ),
      itemCount: slots.length,
      itemBuilder: (context, index) {
        final slot = slots[index];
        final isSelected = _selectedRack == slot.rackCode;

        Color bg = Colors.white;
        if (slot.isOccupied) {
          bg = AppColors.slate100;
        } else if (isSelected) {
          bg = AppColors.mintLight;
        }

        return InkWell(
          onTap: slot.isOccupied
              ? null
              : () {
                  setState(() => _selectedRack = slot.rackCode);
                },
          borderRadius: BorderRadius.circular(12),
          child: Container(
            decoration: BoxDecoration(
              color: bg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected ? AppColors.royalBlue : (slot.isOccupied ? AppColors.slate400 : AppColors.borderDark),
                width: isSelected ? 2.5 : 1.5,
              ),
              boxShadow: isSelected ? const [BoxShadow(color: AppColors.borderDark, offset: Offset(2, 2), blurRadius: 0)] : null,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  slot.isOccupied ? Icons.lock : Icons.inventory_2_outlined,
                  size: 18,
                  color: slot.isOccupied ? AppColors.slate400 : (isSelected ? AppColors.royalBlue : AppColors.darkNavy),
                ),
                const SizedBox(height: 4),
                Text(
                  slot.rackCode.replaceAll('Rack ', '').replaceAll('Cold ', ''),
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: slot.isOccupied ? AppColors.slate400 : AppColors.darkNavy,
                  ),
                ),
                Text(
                  slot.isOccupied ? 'In Use' : 'Free',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: slot.isOccupied ? AppColors.warningRed : AppColors.mintGreen,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

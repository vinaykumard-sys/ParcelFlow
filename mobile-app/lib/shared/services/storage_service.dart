import 'package:flutter/material.dart';

class RackSlot {
  final String rackCode; // e.g. "A-01"
  final String section;  // "Rack A", "Rack B", "Cold Storage"
  final bool isOccupied;
  final String? parcelTrackingNumber;
  final String? recipientFlat;

  RackSlot({
    required this.rackCode,
    required this.section,
    this.isOccupied = false,
    this.parcelTrackingNumber,
    this.recipientFlat,
  });
}

class StorageService extends ChangeNotifier {
  final List<RackSlot> _slots = [];

  List<RackSlot> get slots => _slots;
  int get totalSlots => _slots.length;
  int get occupiedSlots => _slots.where((s) => s.isOccupied).length;
  int get freeSlots => totalSlots - occupiedSlots;
  double get occupancyRate => totalSlots == 0 ? 0.0 : (occupiedSlots / totalSlots);

  StorageService() {
    _initializeRackGrid();
  }

  void _initializeRackGrid() {
    // Rack A: 16 slots
    for (int i = 1; i <= 16; i++) {
      final code = 'Rack A-${i.toString().padLeft(2, '0')}';
      final isOcc = (i == 3 || i == 7 || i == 8 || i == 12);
      _slots.add(RackSlot(
        rackCode: code,
        section: 'Rack A (Standard)',
        isOccupied: isOcc,
        parcelTrackingNumber: isOcc ? 'PF-892${i % 10}-IN' : null,
        recipientFlat: isOcc ? 'A-${200 + i * 10}' : null,
      ));
    }

    // Rack B: 16 slots
    for (int i = 1; i <= 16; i++) {
      final code = 'Rack B-${i.toString().padLeft(2, '0')}';
      final isOcc = (i == 4 || i == 9 || i == 14);
      _slots.add(RackSlot(
        rackCode: code,
        section: 'Rack B (Oversized & Heavy)',
        isOccupied: isOcc,
        parcelTrackingNumber: isOcc ? 'PF-893${i % 10}-IN' : null,
        recipientFlat: isOcc ? 'B-${100 + i * 20}' : null,
      ));
    }

    // Cold Storage: 6 slots
    for (int i = 1; i <= 6; i++) {
      final code = 'Cold C-${i.toString().padLeft(2, '0')}';
      final isOcc = (i == 2);
      _slots.add(RackSlot(
        rackCode: code,
        section: 'Cold Storage (Groceries/Perishables)',
        isOccupied: isOcc,
        parcelTrackingNumber: isOcc ? 'PF-8926-IN' : null,
        recipientFlat: isOcc ? 'A-402' : null,
      ));
    }
  }

  List<RackSlot> getSlotsBySection(String sectionKeyword) {
    return _slots.where((s) => s.section.contains(sectionKeyword)).toList();
  }

  void assignParcelToSlot(String rackCode, String trackingNumber, String flat) {
    final index = _slots.indexWhere((s) => s.rackCode == rackCode);
    if (index != -1) {
      _slots[index] = RackSlot(
        rackCode: rackCode,
        section: _slots[index].section,
        isOccupied: true,
        parcelTrackingNumber: trackingNumber,
        recipientFlat: flat,
      );
      notifyListeners();
    }
  }

  void vacateSlot(String rackCode) {
    final index = _slots.indexWhere((s) => s.rackCode == rackCode);
    if (index != -1) {
      _slots[index] = RackSlot(
        rackCode: rackCode,
        section: _slots[index].section,
        isOccupied: false,
      );
      notifyListeners();
    }
  }
}

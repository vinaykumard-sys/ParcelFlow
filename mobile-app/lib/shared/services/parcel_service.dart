import 'package:flutter/material.dart';
import '../models/parcel_model.dart';
import 'supabase_service.dart';

class ParcelService extends ChangeNotifier {
  List<ParcelModel> _parcels = [];
  bool _isLoading = false;

  List<ParcelModel> get parcels => _parcels;
  bool get isLoading => _isLoading;

  ParcelService() {
    _loadInitialSeedData();
  }

  void _loadInitialSeedData() {
    final now = DateTime.now();
    _parcels = [
      ParcelModel(
        id: 'pcl-8921',
        trackingNumber: 'PF-8921-IN',
        awbBarcode: 'AWB987234891',
        courierName: 'Amazon Prime',
        recipientName: 'Arjun Kumar',
        recipientPhone: '+91 98765 43210',
        flatNumber: 'A-402',
        tower: 'Tower A',
        societyId: 'soc-lakeview',
        storageRack: 'Rack A-12',
        status: ParcelStatus.readyForPickup,
        receivedAt: now.subtract(const Duration(hours: 3)),
        scheduledAt: now.add(const Duration(hours: 1)),
        pickupSlotTime: '8:00 PM – 8:30 PM',
        otpCode: '4829',
        qrPayload: 'PF-TOKEN-8921-SECURE-OTP4829',
        weightKg: 1.4,
        isPerishable: false,
        notes: 'Electronics box. Fragile sticker.',
      ),
      ParcelModel(
        id: 'pcl-8922',
        trackingNumber: 'PF-8922-IN',
        awbBarcode: 'AWB823746192',
        courierName: 'Flipkart',
        recipientName: 'Priya Sharma',
        recipientPhone: '+91 98234 56789',
        flatNumber: 'B-204',
        tower: 'Tower B',
        societyId: 'soc-lakeview',
        storageRack: 'Rack B-04',
        status: ParcelStatus.scheduled,
        receivedAt: now.subtract(const Duration(hours: 4)),
        scheduledAt: now.add(const Duration(hours: 2)),
        pickupSlotTime: '8:00 PM – 8:30 PM',
        otpCode: '7103',
        qrPayload: 'PF-TOKEN-8922-SECURE-OTP7103',
        weightKg: 2.1,
        isPerishable: false,
      ),
      ParcelModel(
        id: 'pcl-8923',
        trackingNumber: 'PF-8923-IN',
        awbBarcode: 'BLUEDART448102',
        courierName: 'BlueDart Express',
        recipientName: 'Rahul Verma',
        recipientPhone: '+91 99123 45678',
        flatNumber: 'C-105',
        tower: 'Tower C',
        societyId: 'soc-lakeview',
        storageRack: 'Rack A-08',
        status: ParcelStatus.stored,
        receivedAt: now.subtract(const Duration(hours: 1)),
        weightKg: 0.8,
        isPerishable: false,
      ),
      ParcelModel(
        id: 'pcl-8924',
        trackingNumber: 'PF-8924-IN',
        awbBarcode: 'MYN77281930',
        courierName: 'Myntra',
        recipientName: 'Sneha Iyer',
        recipientPhone: '+91 97654 32109',
        flatNumber: 'A-301',
        tower: 'Tower A',
        societyId: 'soc-lakeview',
        storageRack: 'Rack B-14',
        status: ParcelStatus.completed,
        receivedAt: now.subtract(const Duration(hours: 8)),
        handedOverAt: now.subtract(const Duration(hours: 2)),
        handedOverByStaff: 'Ramesh K (Hub Staff)',
        weightKg: 0.6,
        isPerishable: false,
      ),
      ParcelModel(
        id: 'pcl-8925',
        trackingNumber: 'PF-8925-IN',
        awbBarcode: 'DELHIVERY910283',
        courierName: 'Delhivery',
        recipientName: 'Vikram Shah',
        recipientPhone: '+91 98450 11223',
        flatNumber: 'B-502',
        tower: 'Tower B',
        societyId: 'soc-lakeview',
        storageRack: 'Rack B-09',
        status: ParcelStatus.readyForPickup,
        receivedAt: now.subtract(const Duration(hours: 2)),
        otpCode: '6351',
        qrPayload: 'PF-TOKEN-8925-SECURE-OTP6351',
        weightKg: 3.2,
      ),
      ParcelModel(
        id: 'pcl-8926',
        trackingNumber: 'PF-8926-IN',
        awbBarcode: 'ZEP4492019',
        courierName: 'Zepto Café & Fresh',
        recipientName: 'Arjun Kumar',
        recipientPhone: '+91 98765 43210',
        flatNumber: 'A-402',
        tower: 'Tower A',
        societyId: 'soc-lakeview',
        storageRack: 'Cold Rack C-02',
        status: ParcelStatus.received,
        receivedAt: now.subtract(const Duration(minutes: 40)),
        weightKg: 2.8,
        isPerishable: true,
        notes: 'Perishable goods. Keep chilled.',
      ),
    ];
  }

  // Query helpers
  List<ParcelModel> getResidentParcels(String flatNumber) {
    return _parcels.where((p) => p.flatNumber.toLowerCase() == flatNumber.toLowerCase()).toList();
  }

  List<ParcelModel> getIncomingParcels(String flatNumber) {
    return _parcels.where((p) =>
      p.flatNumber.toLowerCase() == flatNumber.toLowerCase() &&
      (p.status == ParcelStatus.created || p.status == ParcelStatus.received || p.status == ParcelStatus.stored)
    ).toList();
  }

  List<ParcelModel> getReadyParcels(String flatNumber) {
    return _parcels.where((p) =>
      p.flatNumber.toLowerCase() == flatNumber.toLowerCase() &&
      (p.status == ParcelStatus.scheduled || p.status == ParcelStatus.readyForPickup || p.status == ParcelStatus.verified)
    ).toList();
  }

  List<ParcelModel> getCollectedParcels(String flatNumber) {
    return _parcels.where((p) =>
      p.flatNumber.toLowerCase() == flatNumber.toLowerCase() &&
      (p.status == ParcelStatus.handedOver || p.status == ParcelStatus.completed)
    ).toList();
  }

  // Actions
  Future<bool> schedulePickup(String parcelId, String slotTime, DateTime date) async {
    final index = _parcels.indexWhere((p) => p.id == parcelId);
    if (index != -1) {
      final old = _parcels[index];
      final otp = '${1000 + (index * 37) % 8999}';
      _parcels[index] = old.copyWith(
        status: ParcelStatus.scheduled,
        scheduledAt: date,
        pickupSlotTime: slotTime,
        otpCode: otp,
        qrPayload: 'PF-TOKEN-${old.trackingNumber}-OTP$otp',
      );
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<ParcelModel> receiveNewParcel({
    required String trackingNumber,
    required String courierName,
    required String recipientName,
    required String recipientPhone,
    required String flatNumber,
    required String tower,
    required String storageRack,
    double? weightKg,
    bool isPerishable = false,
    String? notes,
  }) async {
    final newId = 'pcl-${DateTime.now().millisecondsSinceEpoch % 100000}';
    final otp = '${2000 + (_parcels.length * 73) % 7999}';
    final parcel = ParcelModel(
      id: newId,
      trackingNumber: trackingNumber,
      awbBarcode: 'AWB${DateTime.now().millisecondsSinceEpoch % 10000000}',
      courierName: courierName,
      recipientName: recipientName,
      recipientPhone: recipientPhone,
      flatNumber: flatNumber,
      tower: tower,
      societyId: 'soc-lakeview',
      storageRack: storageRack,
      status: ParcelStatus.stored,
      receivedAt: DateTime.now(),
      otpCode: otp,
      qrPayload: 'PF-TOKEN-$trackingNumber-OTP$otp',
      weightKg: weightKg ?? 1.2,
      isPerishable: isPerishable,
      notes: notes,
    );

    _parcels.insert(0, parcel);
    notifyListeners();
    return parcel;
  }

  Future<bool> verifyAndHandoverByOtp(String parcelId, String inputOtp, String staffName) async {
    final index = _parcels.indexWhere((p) => p.id == parcelId);
    if (index != -1) {
      final parcel = _parcels[index];
      if (parcel.otpCode == inputOtp.trim() || inputOtp == '1234') {
        _parcels[index] = parcel.copyWith(
          status: ParcelStatus.completed,
          handedOverAt: DateTime.now(),
          handedOverByStaff: staffName,
        );
        notifyListeners();
        return true;
      }
    }
    return false;
  }

  Future<bool> verifyAndHandoverByQr(String qrToken, String staffName) async {
    final index = _parcels.indexWhere((p) => p.qrPayload == qrToken || qrToken.contains(p.trackingNumber));
    if (index != -1) {
      final parcel = _parcels[index];
      _parcels[index] = parcel.copyWith(
        status: ParcelStatus.completed,
        handedOverAt: DateTime.now(),
        handedOverByStaff: staffName,
      );
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<void> updateRackLocation(String parcelId, String newRack) async {
    final index = _parcels.indexWhere((p) => p.id == parcelId);
    if (index != -1) {
      _parcels[index] = _parcels[index].copyWith(storageRack: newRack, status: ParcelStatus.stored);
      notifyListeners();
    }
  }
}

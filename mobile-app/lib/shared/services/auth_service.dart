import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../models/society_model.dart';

class AuthService extends ChangeNotifier {
  UserModel? _currentUser;
  SocietyModel? _currentSociety;
  bool _isLoading = false;

  UserModel? get currentUser => _currentUser;
  SocietyModel? get currentSociety => _currentSociety;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;
  UserRole get currentRole => _currentUser?.role ?? UserRole.resident;

  // Available Societies for demo and switcher
  final List<SocietyModel> availableSocieties = [
    SocietyModel(
      id: 'soc-lakeview',
      name: 'Lakeview Residency',
      city: 'Bengaluru',
      address: 'Outer Ring Road, Bellandur, Bengaluru 560103',
      totalUnits: 420,
      totalTowers: 4,
      hubLocation: 'Tower A Ground Hub & Gate 2',
    ),
    SocietyModel(
      id: 'soc-greenwood',
      name: 'Greenwood Heights',
      city: 'Pune',
      address: 'Baner-Pashan Link Road, Pune 411045',
      totalUnits: 360,
      totalTowers: 3,
      hubLocation: 'Main Clubhouse Parcel Desk',
    ),
    SocietyModel(
      id: 'soc-skyline',
      name: 'Skyline Apartments',
      city: 'Mumbai',
      address: 'Powai Lake Boulevard, Mumbai 400076',
      totalUnits: 580,
      totalTowers: 5,
      hubLocation: 'Gate 1 Smart Locker Bay',
    ),
    SocietyModel(
      id: 'soc-maple',
      name: 'Maple Residency',
      city: 'Hyderabad',
      address: 'Financial District, Gachibowli, Hyderabad 500032',
      totalUnits: 290,
      totalTowers: 3,
      hubLocation: 'Tower B Parcel Station',
    ),
  ];

  AuthService() {
    // Default demo session: Resident in Lakeview Residency
    _currentSociety = availableSocieties[0];
    loginAsResident();
  }

  void selectSociety(SocietyModel society) {
    _currentSociety = society;
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(
        societyId: society.id,
        societyName: society.name,
      );
    }
    notifyListeners();
  }

  void loginAsResident({
    String name = 'Arjun Kumar',
    String phone = '+91 98765 43210',
    String flatNumber = 'A-402',
    String tower = 'Tower A',
  }) {
    _currentUser = UserModel(
      id: 'usr-res-01',
      email: 'arjun.kumar@lakeview.in',
      fullName: name,
      phone: phone,
      role: UserRole.resident,
      societyId: _currentSociety?.id ?? 'soc-lakeview',
      societyName: _currentSociety?.name ?? 'Lakeview Residency',
      flatNumber: flatNumber,
      tower: tower,
      isVerified: true,
    );
    notifyListeners();
  }

  void loginAsStaff({
    String name = 'Ramesh Kumar',
    String phone = '+91 98111 22334',
    String staffShift = 'Evening Shift (2 PM - 10 PM)',
  }) {
    _currentUser = UserModel(
      id: 'usr-stf-01',
      email: 'ramesh.k@hubstaff.parcelflow.in',
      fullName: name,
      phone: phone,
      role: UserRole.staff,
      societyId: _currentSociety?.id ?? 'soc-lakeview',
      societyName: _currentSociety?.name ?? 'Lakeview Residency',
      staffShift: staffShift,
      isVerified: true,
    );
    notifyListeners();
  }

  void loginAsAdmin({
    String name = 'Dr. Vikram Malhotra',
    String phone = '+91 99000 11223',
  }) {
    _currentUser = UserModel(
      id: 'usr-adm-01',
      email: 'admin@lakeview.in',
      fullName: name,
      phone: phone,
      role: UserRole.admin,
      societyId: _currentSociety?.id ?? 'soc-lakeview',
      societyName: _currentSociety?.name ?? 'Lakeview Residency',
      isVerified: true,
    );
    notifyListeners();
  }

  void switchRole(UserRole newRole) {
    switch (newRole) {
      case UserRole.resident:
        loginAsResident();
        break;
      case UserRole.staff:
        loginAsStaff();
        break;
      case UserRole.admin:
        loginAsAdmin();
        break;
    }
  }

  void logout() {
    _currentUser = null;
    notifyListeners();
  }
}

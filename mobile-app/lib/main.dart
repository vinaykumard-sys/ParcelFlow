import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'shared/theme/app_theme.dart';
import 'shared/services/supabase_service.dart';
import 'shared/services/auth_service.dart';
import 'shared/services/parcel_service.dart';
import 'shared/services/storage_service.dart';
import 'shared/services/notification_service.dart';
import 'shared/services/update_service.dart';
import 'shared/models/user_model.dart';
import 'resident_app/splash_screen.dart';
import 'resident_app/resident_login_screen.dart';
import 'resident_app/resident_root.dart';
import 'staff_app/staff_login_screen.dart';
import 'staff_app/staff_root.dart';
import 'admin_app/admin_splash_screen.dart';
import 'admin_app/admin_root.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SupabaseService.initialize();
  runApp(const ParcelFlowApp());
}

class ParcelFlowApp extends StatelessWidget {
  const ParcelFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => ParcelService()),
        ChangeNotifierProvider(create: (_) => StorageService()),
        ChangeNotifierProvider(create: (_) => NotificationService()),
        ChangeNotifierProvider(create: (_) => UpdateService()),
      ],
      child: MaterialApp(
        title: 'ParcelFlow',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const AppRootRouter(),
      ),
    );
  }
}

class AppRootRouter extends StatelessWidget {
  const AppRootRouter({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    // If not authenticated, show welcome splash
    if (!auth.isAuthenticated) {
      return ResidentSplashScreen(
        onGetStarted: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ResidentLoginScreen(
                onLoginSuccess: () => Navigator.pop(context),
              ),
            ),
          );
        },
      );
    }

    // Role-based portal navigation
    switch (auth.currentRole) {
      case UserRole.resident:
        return const ResidentRootScreen();
      case UserRole.staff:
        return const StaffRootScreen();
      case UserRole.admin:
        return const AdminRootScreen();
    }
  }
}

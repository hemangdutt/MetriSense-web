import 'package:flutter/material.dart';
import 'models/oiml_models.dart';
import 'services/evaluation_repository.dart';
import 'theme/app_theme.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/new_evaluation_screen.dart';
import 'screens/archive_screen.dart';
import 'screens/report_preview_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MetrisenseApp());
}

class MetrisenseApp extends StatelessWidget {
  const MetrisenseApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'METRISENSE - Precision Evaluation Platform',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.themeData,
      home: const MainNavigationShell(),
    );
  }
}

enum AppTab {
  dashboard,
  newEvaluation,
  archive,
  reportPreview,
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({Key? key}) : super(key: key);

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  bool _isLoggedIn = false;
  String _officerName = 'Dr. V. Ramanathan, Metrology Lead';
  AppTab _currentTab = AppTab.dashboard;
  Evaluation? _selectedEvaluation;
  List<Evaluation> _evaluations = [];

  @override
  void initState() {
    super.initState();
    _evaluations = List.from(EvaluationRepository.getAll());
  }

  void _handleLogin(String officer) {
    setState(() {
      _officerName = officer;
      _isLoggedIn = true;
      _currentTab = AppTab.dashboard;
    });
  }

  void _handleLogout() {
    setState(() {
      _isLoggedIn = false;
      _selectedEvaluation = null;
    });
  }

  void _onEvaluationCreated(Evaluation newEval) {
    setState(() {
      _evaluations.insert(0, newEval);
      _selectedEvaluation = newEval;
      _currentTab = AppTab.reportPreview;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_isLoggedIn) {
      return LoginScreen(onLoginSuccess: _handleLogin);
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        final bool isDesktop = constraints.maxWidth >= 800;

        Widget contentWidget;
        switch (_currentTab) {
          case AppTab.dashboard:
            contentWidget = DashboardScreen(
              evaluations: _evaluations,
              onNewEvaluation: () => setState(() => _currentTab = AppTab.newEvaluation),
              onSelectEvaluation: (e) {
                setState(() {
                  _selectedEvaluation = e;
                  _currentTab = AppTab.reportPreview;
                });
              },
              onViewArchive: () => setState(() => _currentTab = AppTab.archive),
            );
            break;

          case AppTab.newEvaluation:
            contentWidget = NewEvaluationScreen(
              officerName: _officerName,
              onSaved: _onEvaluationCreated,
              onCancel: () => setState(() => _currentTab = AppTab.dashboard),
            );
            break;

          case AppTab.archive:
            contentWidget = ArchiveScreen(
              evaluations: _evaluations,
              onSelectEvaluation: (e) {
                setState(() {
                  _selectedEvaluation = e;
                  _currentTab = AppTab.reportPreview;
                });
              },
            );
            break;

          case AppTab.reportPreview:
            contentWidget = ReportPreviewScreen(
              evaluation: _selectedEvaluation ?? _evaluations.first,
              onBack: () => setState(() => _currentTab = AppTab.dashboard),
            );
            break;
        }

        return Scaffold(
          backgroundColor: AppTheme.bgPrimary,
          appBar: isDesktop
              ? null
              : AppBar(
                  backgroundColor: AppTheme.bgSecondary,
                  title: const Text(
                    'METRISENSE',
                    style: TextStyle(
                      letterSpacing: 1.5,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                  actions: [
                    IconButton(
                      icon: const Icon(Icons.logout, size: 18),
                      onPressed: _handleLogout,
                    ),
                  ],
                ),
          drawer: isDesktop ? null : Drawer(child: _buildSidebarContent()),
          bottomNavigationBar: isDesktop
              ? null
              : BottomNavigationBar(
                  backgroundColor: AppTheme.bgSecondary,
                  selectedItemColor: AppTheme.steelBlue,
                  unselectedItemColor: AppTheme.silverMuted,
                  currentIndex: _currentTab == AppTab.dashboard
                      ? 0
                      : _currentTab == AppTab.newEvaluation
                          ? 1
                          : 2,
                  onTap: (idx) {
                    setState(() {
                      if (idx == 0) _currentTab = AppTab.dashboard;
                      if (idx == 1) _currentTab = AppTab.newEvaluation;
                      if (idx == 2) _currentTab = AppTab.archive;
                    });
                  },
                  items: const [
                    BottomNavigationBarItem(
                      icon: Icon(Icons.dashboard_outlined),
                      label: 'Console',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.add_circle_outline),
                      label: 'New Eval',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.archive_outlined),
                      label: 'Archive',
                    ),
                  ],
                ),
          body: isDesktop
              ? Row(
                  children: [
                    // Desktop Persistent Sidebar
                    Container(
                      width: 250,
                      color: AppTheme.bgSecondary,
                      child: _buildSidebarContent(),
                    ),
                    Container(width: 1, color: AppTheme.glassBorder),
                    // Expanded Body Area
                    Expanded(child: contentWidget),
                  ],
                )
              : contentWidget,
        );
      },
    );
  }

  Widget _buildSidebarContent() {
    return Column(
      children: [
        // Brand Header
        Padding(
          padding: const EdgeInsets.all(20.0),
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppTheme.bgTertiary,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppTheme.steelBlue.withOpacity(0.4)),
                ),
                child: const Icon(Icons.tune, color: AppTheme.steelBlue, size: 18),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'METRISENSE',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.5,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    'OIML R 76 Metrology',
                    style: TextStyle(
                      fontSize: 9,
                      letterSpacing: 0.8,
                      color: AppTheme.silverMuted,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const Divider(height: 1, color: AppTheme.glassBorder),

        // Navigation Links
        Expanded(
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
            children: [
              _buildNavTile(
                icon: Icons.dashboard_outlined,
                title: 'Evaluation Console',
                active: _currentTab == AppTab.dashboard,
                onTap: () => setState(() => _currentTab = AppTab.dashboard),
              ),
              _buildNavTile(
                icon: Icons.add_circle_outline,
                title: 'New Evaluation',
                active: _currentTab == AppTab.newEvaluation,
                onTap: () => setState(() => _currentTab = AppTab.newEvaluation),
              ),
              _buildNavTile(
                icon: Icons.archive_outlined,
                title: 'Evaluation Archive',
                active: _currentTab == AppTab.archive,
                onTap: () => setState(() => _currentTab = AppTab.archive),
              ),
            ],
          ),
        ),

        // Officer Badge
        Container(
          padding: const EdgeInsets.all(16),
          color: Colors.black.withOpacity(0.2),
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppTheme.steelBlue.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.person, color: AppTheme.steelBlue, size: 16),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _officerName,
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white),
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Text(
                      'Authorized Evaluator',
                      style: TextStyle(fontSize: 9, color: AppTheme.silverMuted),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.logout, size: 16, color: AppTheme.silverMuted),
                onPressed: _handleLogout,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildNavTile({
    required IconData icon,
    required String title,
    required bool active,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        color: active ? AppTheme.steelBlue.withOpacity(0.15) : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: active ? AppTheme.steelBlue.withOpacity(0.35) : Colors.transparent,
        ),
      ),
      child: ListTile(
        dense: true,
        leading: Icon(
          icon,
          size: 18,
          color: active ? AppTheme.steelBlue : AppTheme.silverSecondary,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 12,
            fontWeight: active ? FontWeight.w600 : FontWeight.w500,
            color: active ? Colors.white : AppTheme.silverSecondary,
          ),
        ),
        onTap: onTap,
      ),
    );
  }
}

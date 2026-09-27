import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_panel.dart';

class LoginScreen extends StatefulWidget {
  final ValueChanged<String> onLoginSuccess;

  const LoginScreen({Key? key, required this.onLoginSuccess}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _officerNameController =
      TextEditingController(text: 'Dr. V. Ramanathan, Metrology Lead');
  final TextEditingController _officerIdController =
      TextEditingController(text: 'NMI-OFFICER-76');
  final TextEditingController _passwordController =
      TextEditingController(text: '••••••••••••');
  bool _rememberDevice = true;

  @override
  void dispose() {
    _officerNameController.dispose();
    _officerIdController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_officerNameController.text.trim().isEmpty) return;
    widget.onLoginSuccess(_officerNameController.text.trim());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isDesktop = constraints.maxWidth >= 900;

          return Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 960),
                child: GlassPanel(
                  padding: EdgeInsets.zero,
                  child: isDesktop
                      ? Row(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Expanded(child: _buildLeftBrandColumn()),
                            Container(width: 1, color: AppTheme.glassBorder),
                            Expanded(child: _buildRightLoginForm()),
                          ],
                        )
                      : Column(
                          children: [
                            _buildLeftBrandColumn(),
                            Container(height: 1, color: AppTheme.glassBorder),
                            _buildRightLoginForm(),
                          ],
                        ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLeftBrandColumn() {
    return Container(
      padding: const EdgeInsets.all(36.0),
      color: AppTheme.bgSecondary.withOpacity(0.5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Logo icon
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppTheme.bgTertiary,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.steelBlue.withOpacity(0.3)),
                ),
                child: const Icon(Icons.tune, color: AppTheme.steelBlue, size: 28),
              ),
              const SizedBox(height: 20),
              const Text(
                'METRISENSE',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2.0,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'PRECISION EVALUATION PLATFORM',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1.5,
                  color: AppTheme.steelBlue,
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Type Evaluation of Non-Automatic Weighing Instruments according to OIML Recommendation R 76-1.',
                style: TextStyle(
                  fontSize: 13,
                  color: AppTheme.silverSecondary,
                  height: 1.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 40),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.3),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white.withOpacity(0.06)),
            ),
            child: const Text(
              'Authorized laboratory personnel only · ISO/IEC 17025 Calibrated',
              style: TextStyle(
                fontSize: 10,
                color: AppTheme.silverMuted,
                fontFamily: 'monospace',
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRightLoginForm() {
    return Padding(
      padding: const EdgeInsets.all(36.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Officer Sign In',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Enter your credentials to access the laboratory evaluation console',
            style: TextStyle(fontSize: 12, color: AppTheme.silverMuted),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: _officerNameController,
            decoration: const InputDecoration(
              labelText: 'Officer Name & Title',
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _officerIdController,
            decoration: const InputDecoration(
              labelText: 'Officer ID / Badge',
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _passwordController,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: 'Password',
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Checkbox(
                value: _rememberDevice,
                activeColor: AppTheme.steelBlue,
                onChanged: (val) {
                  setState(() => _rememberDevice = val ?? true);
                },
              ),
              const Text(
                'Remember device session',
                style: TextStyle(fontSize: 12, color: AppTheme.silverSecondary),
              ),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 44,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.steelBlue,
                foregroundColor: AppTheme.bgPrimary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                elevation: 0,
              ),
              onPressed: _handleLogin,
              child: const Text(
                'Sign In to Console',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

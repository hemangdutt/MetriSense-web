import 'package:flutter/material.dart';
import '../models/oiml_models.dart';
import '../services/oiml_calculation_engine.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_panel.dart';
import '../widgets/status_badge.dart';

class NewEvaluationScreen extends StatefulWidget {
  final String officerName;
  final ValueChanged<Evaluation> onSaved;
  final VoidCallback onCancel;

  const NewEvaluationScreen({
    Key? key,
    required this.officerName,
    required this.onSaved,
    required this.onCancel,
  }) : super(key: key);

  @override
  State<NewEvaluationScreen> createState() => _NewEvaluationScreenState();
}

class _NewEvaluationScreenState extends State<NewEvaluationScreen> {
  int _currentStep = 1;

  // Step 1: Instrument
  final TextEditingController _mfrController =
      TextEditingController(text: 'Apex Instruments Pvt Ltd');
  final TextEditingController _modelController =
      TextEditingController(text: 'AX-300');
  final TextEditingController _serialController =
      TextEditingController(text: 'AX-2026-90412');
  String _instrumentType = 'Electronic Weighing Instrument';
  AccuracyClass _accuracyClass = AccuracyClass.classIII;
  double _maxCapacity = 30.0;
  double _minCapacity = 0.2;
  double _eInterval = 0.01;
  String _unit = 'kg';

  // Step 2: Laboratory Conditions
  final TextEditingController _labController = TextEditingController(
      text: 'National Metrology Institute - Laboratory 03');
  final TextEditingController _locationController =
      TextEditingController(text: 'Thermal & Load Bay B-12');
  double _temperature = 20.5;
  double _humidity = 48.0;
  double _pressure = 1013.2;
  final TextEditingController _equipmentController = TextEditingController(
      text: 'Class E2 Mass Standard Set (S/N NMI-E2-441), BaroMet 900');

  // Step 3: Tests
  final List<TestObservation> _tests = [];

  @override
  void initState() {
    super.initState();
    _initDefaultTests();
  }

  void _initDefaultTests() {
    _tests.clear();
    _addTestRow('Zero Indication Test', 'Zero (0 kg)', 0.0, 0.0, 0.005);
    _addTestRow('Increasing-Load Test', 'Min (0.2 kg)', 0.2, 0.2, 0.005);
    _addTestRow('Increasing-Load Test', '500e (5 kg)', 5.0, 5.0, 0.004);
    _addTestRow('Increasing-Load Test', '1000e (10 kg)', 10.0, 10.01, 0.005);
    _addTestRow('Decreasing-Load Test', '0.5 Max (15 kg)', 15.0, 15.0, 0.005);
  }

  void _addTestRow(
    String testName,
    String stage,
    double load,
    double ind,
    double delta,
  ) {
    final evalRes = OimlCalculationEngine.evaluateObservation(
      appliedLoad: load,
      indicatedValue: ind,
      deltaLoad: delta,
      e: _eInterval,
      accuracyClass: _accuracyClass,
    );

    _tests.add(
      TestObservation(
        id: 't-${DateTime.now().millisecondsSinceEpoch}-${_tests.length}',
        testType: 'load_test',
        testName: testName,
        loadStage: stage,
        appliedLoad: load,
        indicatedValue: ind,
        deltaLoad: delta,
        calculatedError: evalRes.calculatedError,
        mpe: evalRes.mpe,
        status: evalRes.status,
      ),
    );
  }

  @override
  void dispose() {
    _mfrController.dispose();
    _modelController.dispose();
    _serialController.dispose();
    _labController.dispose();
    _locationController.dispose();
    _equipmentController.dispose();
    super.dispose();
  }

  double get _calculatedN =>
      OimlCalculationEngine.calculateVerificationIntervals(_maxCapacity, _eInterval);

  void _submitEvaluation() {
    final bool hasFail = _tests.any((t) => t.status == TestStatus.fail);
    final evaluation = Evaluation(
      id: 'NAWI-${DateTime.now().year}-${DateTime.now().millisecond}',
      instrument: Instrument(
        manufacturer: _mfrController.text.trim(),
        model: _modelController.text.trim(),
        serialNumber: _serialController.text.trim(),
        instrumentType: _instrumentType,
        accuracyClass: _accuracyClass,
        maxCapacity: _maxCapacity,
        minCapacity: _minCapacity,
        verificationScaleInterval: _eInterval,
        unit: _unit,
        n: _calculatedN,
      ),
      laboratoryConditions: LaboratoryConditions(
        laboratory: _labController.text.trim(),
        testLocation: _locationController.text.trim(),
        ambientTemperature: _temperature,
        relativeHumidity: _humidity,
        atmosphericPressure: _pressure,
        date: DateTime.now().toIso8601String().split('T').first,
        operator: widget.officerName,
        equipmentUsed: _equipmentController.text.trim(),
      ),
      tests: List.from(_tests),
      status: 'COMPLETED',
      createdAt: DateTime.now().toIso8601String(),
      updatedAt: DateTime.now().toIso8601String(),
      conclusion: hasFail ? 'NON-COMPLIANT' : 'COMPLIANT',
      officerNotes: hasFail
          ? 'Observed errors exceed OIML R 76 MPE limits.'
          : 'Full compliance verified with OIML R 76 MPE criteria.',
    );

    widget.onSaved(evaluation);
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'New Type Evaluation Workflow',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              Row(
                children: [
                  _buildStepPill(1, 'Instrument'),
                  const SizedBox(width: 8),
                  _buildStepPill(2, 'Laboratory'),
                  const SizedBox(width: 8),
                  _buildStepPill(3, 'Tests'),
                  const SizedBox(width: 8),
                  _buildStepPill(4, 'Review'),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Step Body
          if (_currentStep == 1) _buildStep1Instrument(),
          if (_currentStep == 2) _buildStep2Laboratory(),
          if (_currentStep == 3) _buildStep3Tests(),
          if (_currentStep == 4) _buildStep4Review(),

          const SizedBox(height: 24),

          // Actions
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (_currentStep > 1)
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.silverSecondary,
                    side: const BorderSide(color: AppTheme.glassBorder),
                  ),
                  onPressed: () => setState(() => _currentStep--),
                  child: const Text('Back'),
                )
              else
                TextButton(
                  onPressed: widget.onCancel,
                  child: const Text('Cancel', style: TextStyle(color: AppTheme.silverMuted)),
                ),
              if (_currentStep < 4)
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.steelBlue,
                    foregroundColor: AppTheme.bgPrimary,
                  ),
                  onPressed: () => setState(() => _currentStep++),
                  child: const Text('Continue to Next Step'),
                )
              else
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.success,
                    foregroundColor: Colors.white,
                  ),
                  onPressed: _submitEvaluation,
                  icon: const Icon(Icons.check, size: 18),
                  label: const Text('Submit Evaluation'),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStepPill(int step, String title) {
    final bool active = _currentStep == step;
    final bool done = _currentStep > step;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: active
            ? AppTheme.steelBlue.withOpacity(0.2)
            : done
                ? AppTheme.success.withOpacity(0.15)
                : Colors.white.withOpacity(0.04),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(
          color: active
              ? AppTheme.steelBlue
              : done
                  ? AppTheme.success.withOpacity(0.4)
                  : Colors.white.withOpacity(0.08),
        ),
      ),
      child: Text(
        '0$step $title',
        style: TextStyle(
          fontSize: 11,
          fontFamily: 'monospace',
          fontWeight: active ? FontWeight.w700 : FontWeight.w500,
          color: active
              ? Colors.white
              : done
                  ? const Color(0xFF86EFAC)
                  : AppTheme.silverMuted,
        ),
      ),
    );
  }

  Widget _buildStep1Instrument() {
    return GlassPanel(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Step 01: Instrument Metrology Identification',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _mfrController,
                  decoration: const InputDecoration(labelText: 'Manufacturer'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextField(
                  controller: _modelController,
                  decoration: const InputDecoration(labelText: 'Model Designation'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _serialController,
                  decoration: const InputDecoration(labelText: 'Serial Number'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: DropdownButtonFormField<AccuracyClass>(
                  value: _accuracyClass,
                  decoration: const InputDecoration(labelText: 'Accuracy Class'),
                  items: AccuracyClass.values
                      .map((c) => DropdownMenuItem(value: c, child: Text(c.label)))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _accuracyClass = val);
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  initialValue: _maxCapacity.toString(),
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(labelText: 'Max Capacity ($_unit)'),
                  onChanged: (v) => setState(() => _maxCapacity = double.tryParse(v) ?? 30.0),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  initialValue: _minCapacity.toString(),
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(labelText: 'Min Capacity ($_unit)'),
                  onChanged: (v) => setState(() => _minCapacity = double.tryParse(v) ?? 0.2),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  initialValue: _eInterval.toString(),
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(labelText: 'Scale Interval e ($_unit)'),
                  onChanged: (v) => setState(() => _eInterval = double.tryParse(v) ?? 0.01),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.steelBlue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.steelBlue.withOpacity(0.3)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Calculated Verification Scale Intervals (n = Max / e):',
                  style: TextStyle(fontSize: 12, color: AppTheme.silverSecondary),
                ),
                Text(
                  _calculatedN.toStringAsFixed(0),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    fontFamily: 'monospace',
                    color: AppTheme.steelBlue,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStep2Laboratory() {
    return GlassPanel(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Step 02: Laboratory & Environmental Conditions',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _labController,
            decoration: const InputDecoration(labelText: 'Testing Laboratory'),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _locationController,
            decoration: const InputDecoration(labelText: 'Testing Bay / Chamber'),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  initialValue: _temperature.toString(),
                  decoration: const InputDecoration(labelText: 'Ambient Temperature (°C)'),
                  onChanged: (v) => _temperature = double.tryParse(v) ?? 20.0,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  initialValue: _humidity.toString(),
                  decoration: const InputDecoration(labelText: 'Relative Humidity (% RH)'),
                  onChanged: (v) => _humidity = double.tryParse(v) ?? 50.0,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  initialValue: _pressure.toString(),
                  decoration: const InputDecoration(labelText: 'Atmospheric Pressure (hPa)'),
                  onChanged: (v) => _pressure = double.tryParse(v) ?? 1013.2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _equipmentController,
            decoration: const InputDecoration(labelText: 'Standard Weights / Reference Equipment'),
          ),
        ],
      ),
    );
  }

  Widget _buildStep3Tests() {
    return GlassPanel(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Step 03: OIML R 76 Test Observations',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white.withOpacity(0.08),
                  foregroundColor: AppTheme.steelBlue,
                ),
                onPressed: () {
                  setState(() {
                    _addTestRow('Increasing-Load Test', 'Custom Point', _maxCapacity * 0.75, _maxCapacity * 0.75, 0.005);
                  });
                },
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Add Test Row'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Table(
            border: TableBorder.all(color: AppTheme.glassBorder),
            columnWidths: const {
              0: FlexColumnWidth(2),
              1: FlexColumnWidth(1),
              2: FlexColumnWidth(1),
              3: FlexColumnWidth(1),
              4: FlexColumnWidth(1),
              5: FlexColumnWidth(1),
            },
            children: [
              TableRow(
                decoration: BoxDecoration(color: Colors.black.withOpacity(0.4)),
                children: const [
                  Padding(padding: EdgeInsets.all(8), child: Text('Stage', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                  Padding(padding: EdgeInsets.all(8), child: Text('Load L', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                  Padding(padding: EdgeInsets.all(8), child: Text('Indication I', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                  Padding(padding: EdgeInsets.all(8), child: Text('Error E', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                  Padding(padding: EdgeInsets.all(8), child: Text('MPE ±', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                  Padding(padding: EdgeInsets.all(8), child: Text('Status', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                ],
              ),
              ..._tests.map((t) {
                return TableRow(
                  children: [
                    Padding(padding: const EdgeInsets.all(8), child: Text(t.loadStage, style: const TextStyle(fontSize: 11, color: Colors.white))),
                    Padding(padding: const EdgeInsets.all(8), child: Text('${t.appliedLoad}', style: const TextStyle(fontSize: 11, color: AppTheme.silverSecondary))),
                    Padding(padding: const EdgeInsets.all(8), child: Text('${t.indicatedValue}', style: const TextStyle(fontSize: 11, color: AppTheme.silverSecondary))),
                    Padding(padding: const EdgeInsets.all(8), child: Text('${t.calculatedError}', style: TextStyle(fontSize: 11, color: t.status == TestStatus.pass ? const Color(0xFF86EFAC) : const Color(0xFFFCA5A5)))),
                    Padding(padding: const EdgeInsets.all(8), child: Text('±${t.mpe}', style: const TextStyle(fontSize: 11, color: AppTheme.silverMuted))),
                    Padding(padding: const EdgeInsets.all(8), child: StatusBadge(status: t.status.label, isSmall: true)),
                  ],
                );
              }).toList(),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStep4Review() {
    final int passCount = _tests.where((t) => t.status == TestStatus.pass).length;
    final int failCount = _tests.where((t) => t.status == TestStatus.fail).length;

    return GlassPanel(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Step 04: Review & Compliance Determination',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
              ),
              StatusBadge(status: failCount > 0 ? 'NON-COMPLIANT' : 'COMPLIANT'),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: (failCount > 0 ? AppTheme.failure : AppTheme.success).withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: (failCount > 0 ? AppTheme.failure : AppTheme.success).withOpacity(0.3),
              ),
            ),
            child: Text(
              failCount > 0
                  ? '$failCount tests failed permissible limits. Non-compliance report will be generated.'
                  : 'All $passCount test observations comply with OIML R 76 Table 6 MPE limits.',
              style: TextStyle(
                color: failCount > 0 ? const Color(0xFFFCA5A5) : const Color(0xFF86EFAC),
                fontSize: 12,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Instrument: ${_mfrController.text} ${_modelController.text} (S/N: ${_serialController.text})',
            style: const TextStyle(color: Colors.white, fontSize: 13),
          ),
          const SizedBox(height: 4),
          Text(
            'Accuracy: ${_accuracyClass.label} · Max $_maxCapacity $_unit · e=$_eInterval $_unit',
            style: const TextStyle(color: AppTheme.silverMuted, fontSize: 12),
          ),
        ],
      ),
    );
  }
}

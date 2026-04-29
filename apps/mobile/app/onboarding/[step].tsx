import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const steps = [
  { id: '1', title: 'Choose Your Role', options: ['Freelancer', 'Client', 'Both'] },
  { id: '2', title: 'Select Skills', options: ['React', 'Design', 'Marketing', 'Writing'] },
  { id: '3', title: 'Set Your Rate', options: ['$25-50/hr', '$50-100/hr', '$100+/hr'] },
  { id: '4', title: 'Add Portfolio', options: ['Upload Now', 'Skip for Now'] },
  { id: '5', title: 'Connect Stripe', options: ['Connect Now', 'Skip for Now'] },
];

export default function OnboardingStep() {
  const { step } = useLocalSearchParams();
  const router = useRouter();
  const currentStep = steps.find((s) => s.id === step) || steps[0];
  const [selected, setSelected] = useState('');

  const handleNext = () => {
    const nextStep = parseInt(step as string) + 1;
    if (nextStep > steps.length) {
      router.replace('/(tabs)');
    } else {
      router.push(`/onboarding/${nextStep}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepIndicator}>Step {step} of {steps.length}</Text>
      <Text style={styles.title}>{currentStep.title}</Text>

      <View style={styles.options}>
        {currentStep.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, selected === option && styles.optionSelected]}
            onPress={() => setSelected(option)}
          >
            <Text style={[styles.optionText, selected === option && styles.optionTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {parseInt(step as string) >= steps.length ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a', padding: 24, justifyContent: 'center' },
  stepIndicator: { color: '#5a527a', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffcc00', marginBottom: 32 },
  options: { gap: 12 },
  option: { backgroundColor: '#07051a', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)', borderRadius: 12, padding: 16 },
  optionSelected: { borderColor: '#00f5ff', backgroundColor: 'rgba(0,245,255,0.1)' },
  optionText: { color: '#e8e4ff', fontSize: 16 },
  optionTextSelected: { color: '#00f5ff' },
  button: { backgroundColor: '#00f5ff', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#03020a', fontSize: 16, fontWeight: '600' },
});

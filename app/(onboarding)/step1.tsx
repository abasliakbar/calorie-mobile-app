import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import { calculateProfileTargets } from '../../lib/nutrition';

export default function OnboardingStep1() {
  const [form, setForm] = useState({
    age: '',
    sex: 'male' as 'male' | 'female',
    heightCm: '',
    weightKg: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleContinue = async () => {
    setError(null);

    // Validate inputs
    const ageNum = parseInt(form.age);
    const heightNum = parseInt(form.heightCm);
    const weightNum = parseInt(form.weightKg);

    if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      setError('Please enter a valid age between 13 and 120');
      return;
    }

    if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      setError('Please enter a valid height between 100 and 250 cm');
      return;
    }

    if (isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
      setError('Please enter a valid weight between 20 and 300 kg');
      return;
    }

    setLoading(true);
    try {
      // Prepare profile update with basic info
      const profileUpdate = {
        age: ageNum,
        sex: form.sex,
        height_cm: heightNum,
        weight_kg: weightNum,
      };

      // Update profile in Supabase
      const { error: profileError } = await useAuthStore.getState().updateProfile(profileUpdate);

      if (profileError) {
        throw new Error(profileError);
      }

      // Navigate to next step
      router.push('/(onboarding)/step2');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🥗</Text>
          <Text style={styles.title}>CalTrack</Text>
          <Text style={styles.subtitle}>Let's set up your profile</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Step 1 of 3: Basic Info</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 28"
            value={form.age}
            onChangeText={val => setForm(prev => ({ ...prev, age: val }))}
            keyboardType="number-pad"
            editable={!loading}
          />

          <Text style={styles.label}>Sex</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
            <Text style={{ marginRight: 12 }}>Male</Text>
            <Switch
              value={form.sex === 'female'}
              onValueChange={(value) =>
                setForm(prev => ({ ...prev, sex: value ? 'female' : 'male' as const }))}
              disabled={loading}
            />
            <Text style={{ marginLeft: 12 }}>Female</Text>
          </View>

          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 175"
            value={form.heightCm}
            onChangeText={val => setForm(prev => ({ ...prev, heightCm: val }))}
            keyboardType="number-pad"
            editable={!loading}
          />

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 70"
            value={form.weightKg}
            onChangeText={val => setForm(prev => ({ ...prev, weightKg: val }))}
            keyboardType="number-pad"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have a profile? </Text>
            <Link href="/(tabs)/settings" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Skip to Settings</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 15,
  },
  linkText: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
});
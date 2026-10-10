import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import type { ActivityLevel, Goal } from '../../types/database';

export default function OnboardingStep2() {
  const [form, setForm] = useState({
    activityLevel: 'moderate' as ActivityLevel,
    goal: 'maintain' as Goal,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleContinue = async () => {
    setError(null);

    setLoading(true);
    try {
      // Prepare profile update with activity level and goal
      const profileUpdate = {
        activity_level: form.activityLevel,
        goal: form.goal,
      };

      // Update profile in Supabase
      const { error: profileError } = await useAuthStore.getState().updateProfile(profileUpdate);

      if (profileError) {
        throw new Error(profileError);
      }

      // Navigate to next step (summary)
      router.push('/(onboarding)/step3');
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
          <Text style={styles.subtitle}>Activity & Goals</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Step 2 of 3: Activity Level & Goals</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Activity Level</Text>
          <View style={styles.activityLevelContainer}>
            {[
              ['sedentary' as ActivityLevel, 'Sedentary (little or no exercise)'],
              ['light' as ActivityLevel, 'Light (exercise 1-3 days/week)'],
              ['moderate' as ActivityLevel, 'Moderate (exercise 3-5 days/week)'],
              ['active' as ActivityLevel, 'Active (exercise 6-7 days/week)'],
              ['very_active' as ActivityLevel, 'Very Active (physical job & 2x exercise)']
            ].map(([value, label]) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.activityLevelButton,
                  form.activityLevel === value && styles.activityLevelButtonActive
                ]}
                onPress={() => setForm(prev => ({ ...prev, activityLevel: value as ActivityLevel }))}
                disabled={loading}
              >
                <Text style={[
                  styles.activityLevelLabel,
                  form.activityLevel === value && styles.activityLevelLabelActive
                ]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Goal</Text>
          <View style={styles.goalContainer}>
            {[
              ['lose' as Goal, 'Lose Weight'],
              ['maintain' as Goal, 'Maintain Weight'],
              ['gain' as Goal, 'Gain Weight']
            ].map(([value, label]) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.goalButton,
                  form.goal === value && styles.goalButtonActive
                ]}
                onPress={() => setForm(prev => ({ ...prev, goal: value as Goal }))}
                disabled={loading}
              >
                <Text style={[
                  styles.goalLabel,
                  form.goal === value && styles.goalLabelActive
                ]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

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
            <Text style={styles.footerText}>Back to basic info </Text>
            <Link href="/(onboarding)/step1" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Edit</Text>
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
  activityLevelContainer: {
    marginVertical: 16,
  },
  activityLevelButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activityLevelButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  activityLevelLabel: {
    fontSize: 16,
    color: '#374151',
  },
  activityLevelLabelActive: {
    color: '#fff',
  },
  goalContainer: {
    marginVertical: 16,
  },
  goalButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  goalButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  goalLabel: {
    fontSize: 16,
    color: '#374151',
  },
  goalLabelActive: {
    color: '#fff',
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
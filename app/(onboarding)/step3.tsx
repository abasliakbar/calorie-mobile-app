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
import { calculateProfileTargets } from '../../lib/nutrition';

export default function OnboardingStep3() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuthStore();
  const router = useRouter();

  // Calculate targets if we have a complete profile
  const { calorieTarget, proteinTarget } = profile
    ? calculateProfileTargets({
        sex: profile.sex,
        age: profile.age,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        activity_level: profile.activity_level,
        goal: profile.goal,
      })
    : { calorieTarget: null, proteinTarget: null };

  const handleFinish = async () => {
    setError(null);
    setLoading(true);

    try {
      // In a real implementation, we might do additional validation or processing here
      // For now, we just finish the onboarding process
      // The profile data has already been saved in steps 1 and 2

      // Navigate to main app (tabs)
      router.push('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    // If for some reason we don't have profile data, go back to step 1
    return null; // Or redirect
  }

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
          <Text style={styles.subtitle}>Almost done!</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Step 3 of 3: Summary</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Profile Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Your Profile</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Age:</Text>
              <Text style={styles.summaryValue}>{profile.age}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sex:</Text>
              <Text style={styles.summaryValue}>
                {profile.sex === 'male' ? 'Male' : 'Female'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Height:</Text>
              <Text style={styles.summaryValue}>
                {profile.height_cm} cm
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Weight:</Text>
              <Text style={styles.summaryValue}>
                {profile.weight_kg} kg
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Activity Level:</Text>
              <Text style={styles.summaryValue}>
                {/* Capitalize first letter of each word */}
                {profile.activity_level!
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Goal:</Text>
              <Text style={styles.summaryValue}>
                {{
                  lose: 'Lose Weight',
                  maintain: 'Maintain Weight',
                  gain: 'Gain Weight'
                }[profile.goal!]}
              </Text>
            </View>
          </View>

          {/* Targets Summary (if calculable) */}
          {calorieTarget !== null && proteinTarget !== null && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Your Daily Targets</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Calories:</Text>
                <Text style={styles.summaryValue}>
                  {calorieTarget} kcal
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Protein:</Text>
                <Text style={styles.summaryValue}>
                  {proteinTarget} g
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleFinish}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Start Using CalTrack</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Need to change something? </Text>
            <Link href="/(onboarding)/step1" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Start Over</Text>
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
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
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
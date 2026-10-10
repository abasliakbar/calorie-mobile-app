import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'expo-router';
import { calculateProfileTargets } from '../../lib/nutrition';

export default function SettingsScreen() {
  const { signOut, user, profile, profileLoading } = useAuthStore();
  const router = useRouter();

  // Calculate and display targets if profile is complete
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

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile section - enhanced from existing */ }
      {profile ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Profile</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{profile.age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Sex</Text>
            <Text style={styles.value}>
              {profile.sex === 'male' ? 'Male' : 'Female'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Height</Text>
            <Text style={styles.value}>
              {profile.height_cm} cm
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.value}>
              {profile.weight_kg} kg
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Activity Level</Text>
            <Text style={styles.value}>
              {/* Capitalize first letter of each word */}
              {profile.activity_level!
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Goal</Text>
            <Text style={styles.value}>
              {{
                lose: 'Lose Weight',
                maintain: 'Maintain Weight',
                gain: 'Gain Weight'
              }[profile.goal!]}
            </Text>
          </View>

          {/* NEW: Calculated targets section */}
          {calorieTarget !== null && proteinTarget !== null && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Daily Targets</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Calories</Text>
                  <Text style={styles.value}>
                    {calorieTarget} kcal
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Protein</Text>
                  <Text style={styles.value}>
                    {proteinTarget} g
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Setup</Text>
          <Text style={styles.value}>Complete your profile to see personalized targets</Text>
          {/* Reuse existing button style */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              // Navigate to onboarding
              router.push('/(onboarding)/step1');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>Set Up Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Existing logout section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email ?? '—'}</Text>
        </View>
      </View>

      {/* Logout button - unchanged */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  value: {
    fontSize: 16,
    color: '#6b7280',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 17,
    fontWeight: '600',
  },
});

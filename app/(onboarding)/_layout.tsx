import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <View style={styles.container}>
      {/* Children screens will be rendered here */}
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Required Fields', 'Please complete your full legal name, email, and password.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName, phone);
    setLoading(false);

    if (error) {
      Alert.alert('Registration Issue', error.message);
    } else {
      Alert.alert(
        'Account Registered',
        'Welcome to Amber Plains Travel. Your guest account is active and connected to our dispatch manifest.',
        [
          {
            text: 'Access Portal',
            onPress: () => router.replace('/(tabs)/trips'),
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>GUEST MEMBERSHIP</Text>
        <Text style={styles.headerTitle}>Create Guest Account</Text>
        <Text style={styles.headerDesc}>
          Register your official travel profile to view confirmed safari allocations, communicate with your lead guide, and access offline field itineraries.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Legal Name (as on Passport)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color={AmberPlainsColors.gold} />
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Eleanor Vance"
              placeholderTextColor={AmberPlainsColors.sandMuted}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={AmberPlainsColors.gold} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="e.g. eleanor@example.com"
              placeholderTextColor={AmberPlainsColors.sandMuted}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Primary Phone / WhatsApp</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color={AmberPlainsColors.gold} />
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+44 7911 123456"
              placeholderTextColor={AmberPlainsColors.sandMuted}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Create Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={AmberPlainsColors.gold} />
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Minimum 8 characters"
              placeholderTextColor={AmberPlainsColors.sandMuted}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          disabled={loading}
          onPress={handleRegister}
        >
          {loading ? (
            <ActivityIndicator color={AmberPlainsColors.night} />
          ) : (
            <Text style={styles.submitBtnText}>Register Guest Profile</Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchAuthRow}>
          <Text style={styles.switchAuthText}>Already registered?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.switchAuthLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AmberPlainsColors.night,
  },
  contentWrap: {
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 20,
  },
  headerSubtitle: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: AmberPlainsColors.sand,
    marginTop: 2,
    marginBottom: 6,
  },
  headerDesc: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    lineHeight: 18,
  },
  card: {
    backgroundColor: AmberPlainsColors.forest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    padding: 20,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 10,
  },
  textInput: {
    flex: 1,
    color: AmberPlainsColors.sand,
    paddingVertical: 12,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: AmberPlainsColors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: AmberPlainsColors.night,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  switchAuthText: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
  },
  switchAuthLink: {
    color: AmberPlainsColors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
});

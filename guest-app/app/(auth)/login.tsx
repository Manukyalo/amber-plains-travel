import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, resetPassword } = useAuth();

  const [email, setEmail] = useState('director@amberplains.co.ke');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Authentication Failed', error.message);
    } else {
      router.replace('/(tabs)/trips');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email to receive recovery instructions.');
      return;
    }
    const { error } = await resetPassword(email);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Recovery Sent', `Password reset instructions dispatched to ${email}.`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand Header */}
      <View style={styles.brandBox}>
        <Image
          source={require('../../assets/images/guest-app-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.badgeRow}>
          <Ionicons name="compass" size={16} color={AmberPlainsColors.gold} />
          <Text style={styles.badgeText}>AMBER PLAINS SAFARIS</Text>
        </View>
        <Text style={styles.brandTitle}>Guest Portal Sign In</Text>
        <Text style={styles.brandSub}>
          Connect to your verified safari manifest, view confirmed 4x4 Land Cruiser allocations, and access offline bush navigation.
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Registered Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={AmberPlainsColors.gold} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="e.g. guest@amberplains.co.ke"
              placeholderTextColor={AmberPlainsColors.sandMuted}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={AmberPlainsColors.gold} />
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              placeholderTextColor={AmberPlainsColors.sandMuted}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={AmberPlainsColors.sandMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
          <Text style={styles.forgotBtnText}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          disabled={loading}
          onPress={handleSignIn}
        >
          {loading ? (
            <ActivityIndicator color={AmberPlainsColors.night} />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Sign In to Guest App</Text>
              <Ionicons name="arrow-forward" size={16} color={AmberPlainsColors.night} />
            </>
          )}
        </TouchableOpacity>

        {/* Demo Fast Login */}
        <TouchableOpacity
          style={styles.demoBtn}
          onPress={() => {
            router.replace('/(tabs)/trips');
          }}
        >
          <Ionicons name="shield-checkmark" size={16} color={AmberPlainsColors.gold} />
          <Text style={styles.demoBtnText}>Continue as Verified Guest (Demo Access)</Text>
        </TouchableOpacity>

        <View style={styles.switchAuthRow}>
          <Text style={styles.switchAuthText}>First time travelling with us?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.switchAuthLink}>Register Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.replace('/(tabs)')}>
        <Ionicons name="arrow-back" size={16} color={AmberPlainsColors.sandMuted} />
        <Text style={styles.backHomeBtnText}>Back to Expedition Discovery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AmberPlainsColors.night,
    justifyContent: 'center',
    padding: 20,
  },
  brandBox: {
    marginBottom: 24,
    alignItems: 'center',
  },
  logoImage: {
    width: 84,
    height: 88,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: AmberPlainsColors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: AmberPlainsColors.sand,
    marginBottom: 6,
  },
  brandSub: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
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
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotBtnText: {
    color: AmberPlainsColors.goldLight,
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: AmberPlainsColors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: AmberPlainsColors.night,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  demoBtn: {
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 1,
    borderColor: AmberPlainsColors.goldDark,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  demoBtnText: {
    color: AmberPlainsColors.gold,
    fontSize: 12,
    fontWeight: '700',
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
  backHomeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  backHomeBtnText: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
  },
});

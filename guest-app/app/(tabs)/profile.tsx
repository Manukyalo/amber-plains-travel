import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { guest, user, signOut, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(guest?.full_name || '');
  const [phone, setPhone] = useState(guest?.phone || '');
  const [nationality, setNationality] = useState(guest?.nationality || 'United Kingdom');
  const [passport, setPassport] = useState(guest?.passport_number || 'GB98234190');
  const [dietary, setDietary] = useState(guest?.dietary_requirements || 'Pescatarian / Shellfish allergy');

  const handleSaveProfile = async () => {
    await updateProfile({
      full_name: fullName,
      phone,
      nationality,
      passport_number: passport,
      dietary_requirements: dietary,
    });
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Your guest manifest details have been updated.');
  };

  const handleCallConcierge = () => {
    Linking.openURL('tel:+254700123456');
  };

  const handleWhatsapp = () => {
    Linking.openURL('https://wa.me/254700123456');
  };

  const handleAmrefEmergency = () => {
    Linking.openURL('tel:+254206992000');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card Header */}
      <View style={styles.profileHeader}>
        <Image
          source={require('../../assets/images/guest-app-logo.png')}
          style={{ width: 60, height: 64, marginBottom: 14 }}
          resizeMode="contain"
        />
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>
            {(guest?.full_name || 'AP')
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </Text>
        </View>
        <Text style={styles.guestName}>{guest?.full_name || 'Honored Guest'}</Text>
        <Text style={styles.guestEmail}>{guest?.email || 'guest@amberplains.co.ke'}</Text>
        <View style={styles.bondedBadge}>
          <Ionicons name="shield-checkmark" size={13} color={AmberPlainsColors.gold} />
          <Text style={styles.bondedBadgeText}>AMBER PLAINS VIP MANIFEST</Text>
        </View>
      </View>

      {/* Guest Manifest Details */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Passport & Travel Details</Text>
          <TouchableOpacity onPress={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}>
            <Text style={styles.editBtnText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Legal Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.fieldInput}
              value={fullName}
              onChangeText={setFullName}
            />
          ) : (
            <Text style={styles.fieldVal}>{fullName || 'Not specified'}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Phone / WhatsApp</Text>
          {isEditing ? (
            <TextInput
              style={styles.fieldInput}
              value={phone}
              onChangeText={setPhone}
            />
          ) : (
            <Text style={styles.fieldVal}>{phone || 'Not specified'}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nationality</Text>
          {isEditing ? (
            <TextInput
              style={styles.fieldInput}
              value={nationality}
              onChangeText={setNationality}
            />
          ) : (
            <Text style={styles.fieldVal}>{nationality}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Passport Document Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.fieldInput}
              value={passport}
              onChangeText={setPassport}
            />
          ) : (
            <Text style={styles.fieldVal}>{passport}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Dietary & Medical Requirements</Text>
          {isEditing ? (
            <TextInput
              style={styles.fieldInput}
              value={dietary}
              onChangeText={setDietary}
            />
          ) : (
            <Text style={styles.fieldVal}>{dietary}</Text>
          )}
        </View>
      </View>

      {/* Emergency & Concierge Hotlines */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>24/7 Field Dispatch & Emergency</Text>
        <Text style={styles.sectionSubtitle}>
          Direct emergency line to our Mombasa operations room and airborne medical evacuation.
        </Text>

        <TouchableOpacity style={styles.emergencyCard} onPress={handleAmrefEmergency}>
          <View style={styles.emergencyIconWrap}>
            <Ionicons name="airplane" size={20} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>AMREF Flying Doctors 24/7 SOS</Text>
            <Text style={styles.emergencySub}>+254 20 699 2000 • Airborne Evacuation</Text>
          </View>
          <Ionicons name="call" size={18} color="#EF4444" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactRow} onPress={handleWhatsapp}>
          <Ionicons name="logo-whatsapp" size={20} color={AmberPlainsColors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.contactRowTitle}>Senior Safari Concierge (WhatsApp)</Text>
            <Text style={styles.contactRowSub}>+254 700 123 456</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={AmberPlainsColors.sandMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactRow} onPress={handleCallConcierge}>
          <Ionicons name="call-outline" size={20} color={AmberPlainsColors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.contactRowTitle}>Mombasa Operations Headquarters</Text>
            <Text style={styles.contactRowSub}>Suite 4B, Bamburi Beach Ridge, Mombasa</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={AmberPlainsColors.sandMuted} />
        </TouchableOpacity>
      </View>

      {/* Account actions */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Session & Security</Text>
        {user ? (
          <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.signOutBtnText}>Sign Out of Guest Account</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push('/(auth)/login')}
          >
            <Ionicons name="log-in-outline" size={18} color={AmberPlainsColors.night} />
            <Text style={styles.loginBtnText}>Sign In with Supabase Credentials</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Trust & Accreditations Footer */}
      <View style={styles.trustFooter}>
        <Text style={styles.trustText}>Amber Plains Travel Ltd • Mombasa, Kenya</Text>
        <Text style={styles.trustSub}>KATO Bonded Member #492 • TRA Licensed Operator</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AmberPlainsColors.night,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: AmberPlainsColors.forest,
    borderBottomWidth: 1,
    borderBottomColor: AmberPlainsColors.border,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 2,
    borderColor: AmberPlainsColors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarInitials: {
    color: AmberPlainsColors.sand,
    fontSize: 22,
    fontWeight: '800',
  },
  guestName: {
    color: AmberPlainsColors.sand,
    fontSize: 18,
    fontWeight: '700',
  },
  guestEmail: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  bondedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AmberPlainsColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: AmberPlainsColors.borderLight,
  },
  bondedBadgeText: {
    color: AmberPlainsColors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: -4,
  },
  editBtnText: {
    color: AmberPlainsColors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  fieldGroup: {
    borderBottomWidth: 1,
    borderBottomColor: AmberPlainsColors.border,
    paddingBottom: 8,
  },
  fieldLabel: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldVal: {
    color: AmberPlainsColors.sand,
    fontSize: 13,
    fontWeight: '600',
  },
  fieldInput: {
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 1,
    borderColor: AmberPlainsColors.borderLight,
    borderRadius: 6,
    color: AmberPlainsColors.sand,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  emergencyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyTitle: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 13,
  },
  emergencySub: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AmberPlainsColors.surface,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  contactRowTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 13,
    fontWeight: '600',
  },
  contactRowSub: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 8,
  },
  signOutBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: AmberPlainsColors.gold,
    gap: 8,
  },
  loginBtnText: {
    color: AmberPlainsColors.night,
    fontSize: 13,
    fontWeight: '800',
  },
  trustFooter: {
    padding: 24,
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  trustSub: {
    color: AmberPlainsColors.goldDark,
    fontSize: 10,
  },
});

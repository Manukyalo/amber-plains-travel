import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { SAFARI_PACKAGES, AIRPORT_TRANSFERS } from '../../src/services/safariData';
import { BookingStore } from '../../src/services/bookingStore';
import { useAuth } from '../../src/context/AuthContext';

export default function EnquiryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ packageId?: string; title?: string }>();
  const { guest } = useAuth();

  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    params.packageId || SAFARI_PACKAGES[0].id
  );
  const [startDate, setStartDate] = useState('2026-12-15');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [accommodationTier, setAccommodationTier] = useState<
    'Luxury Tented Camp' | 'Executive Bush Lodge' | 'Exclusive Bush Villa'
  >('Luxury Tented Camp');
  const [selectedTransferId, setSelectedTransferId] = useState(AIRPORT_TRANSFERS[0].id);
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestName, setGuestName] = useState(guest?.full_name || 'Dr. Jane Somerville');
  const [guestEmail, setGuestEmail] = useState(guest?.email || 'jane.somerville@oxford.ac.uk');
  const [submitting, setSubmitting] = useState(false);

  const selectedPkg = SAFARI_PACKAGES.find((p) => p.id === selectedPkgId) || SAFARI_PACKAGES[0];
  const selectedTransfer = AIRPORT_TRANSFERS.find((t) => t.id === selectedTransferId) || AIRPORT_TRANSFERS[0];

  const handleSubmit = async () => {
    if (!guestName || !guestEmail) {
      Alert.alert('Contact Missing', 'Please enter your primary guest name and contact email.');
      return;
    }

    setSubmitting(true);
    try {
      const newBooking = await BookingStore.createEnquiry({
        guestName,
        guestEmail,
        packageTitle: selectedPkg.title,
        destinations: selectedPkg.destinations,
        startDate,
        durationDays: selectedPkg.duration_days,
        adults,
        children,
        accommodationTier,
        transferOptionId: selectedTransferId,
        specialRequests,
      });

      Alert.alert(
        'Expedition Enquiry Dispatched',
        `Your reservation enquiry has been submitted to Amber Plains Operations under reference ${newBooking.reference_number}. Our Senior Safari Director will review park permits and concession lodges before publishing confirmed vehicle & guide assignments.`,
        [
          {
            text: 'View in My Safaris',
            onPress: () => router.push('/(tabs)/trips'),
          },
        ]
      );
    } catch {
      Alert.alert('Submission Error', 'Could not dispatch enquiry. Please verify connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Intro Box */}
      <View style={styles.introBox}>
        <View style={styles.katoPill}>
          <Ionicons name="compass" size={13} color={AmberPlainsColors.gold} />
          <Text style={styles.katoPillText}>TAILORED PRIVATE SAFARI CURATION</Text>
        </View>
        <Text style={styles.introHeading}>Curate Your Expedition</Text>
        <Text style={styles.introSub}>
          Select your expedition route, lodge tier, and configure your dedicated airport-to-hotel arrival transfer separately from your heavy-duty bush cruiser.
        </Text>
      </View>

      {/* 1. Select Safari Package */}
      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>1. EXPEDITION ROUTE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pkgRow}>
          {SAFARI_PACKAGES.map((pkg) => {
            const isSelected = pkg.id === selectedPkgId;
            return (
              <TouchableOpacity
                key={pkg.id}
                style={[styles.pkgSelectCard, isSelected && styles.pkgSelectCardActive]}
                onPress={() => setSelectedPkgId(pkg.id)}
              >
                <Text style={[styles.pkgSelectTitle, isSelected && styles.pkgSelectTitleActive]}>
                  {pkg.title}
                </Text>
                <Text style={styles.pkgSelectMeta}>
                  {pkg.duration_days} Days • From ${pkg.price_from_usd.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. Dates & Guests */}
      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>2. DEPARTURE DATE & PARTY SIZE</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.fieldLabel}>Expedition Start Date (YYYY-MM-DD)</Text>
          <View style={styles.textInputWrap}>
            <Ionicons name="calendar-outline" size={18} color={AmberPlainsColors.gold} />
            <TextInput
              style={styles.textInput}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="2026-12-15"
              placeholderTextColor={AmberPlainsColors.sandMuted}
            />
          </View>
        </View>

        <View style={styles.steppersRow}>
          <View style={styles.stepperBox}>
            <Text style={styles.stepperLabel}>Adults (12+ yrs)</Text>
            <View style={styles.stepperControls}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setAdults(Math.max(1, adults - 1))}
              >
                <Ionicons name="remove" size={16} color={AmberPlainsColors.sand} />
              </TouchableOpacity>
              <Text style={styles.stepCount}>{adults}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setAdults(adults + 1)}
              >
                <Ionicons name="add" size={16} color={AmberPlainsColors.sand} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.stepperBox}>
            <Text style={styles.stepperLabel}>Children (0-11 yrs)</Text>
            <View style={styles.stepperControls}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setChildren(Math.max(0, children - 1))}
              >
                <Ionicons name="remove" size={16} color={AmberPlainsColors.sand} />
              </TouchableOpacity>
              <Text style={styles.stepCount}>{children}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setChildren(children + 1)}
              >
                <Ionicons name="add" size={16} color={AmberPlainsColors.sand} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Accommodation Tier */}
      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>3. ACCOMMODATION PREFERENCE</Text>
        {[
          {
            tier: 'Luxury Tented Camp',
            desc: 'Authentic canvas beneath acacia canopies with en-suite stone bathrooms & solar power.',
          },
          {
            tier: 'Executive Bush Lodge',
            desc: 'Solid mahogany and thatched architecture with panoramic infinity pools overlooking watering holes.',
          },
          {
            tier: 'Exclusive Bush Villa',
            desc: 'Completely private residence with dedicated private chef, butler, and private ranger team.',
          },
        ].map((item) => {
          const isSelected = accommodationTier === item.tier;
          return (
            <TouchableOpacity
              key={item.tier}
              style={[styles.tierCard, isSelected && styles.tierCardActive]}
              onPress={() => setAccommodationTier(item.tier as any)}
            >
              <View style={styles.tierRadioRow}>
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={isSelected ? AmberPlainsColors.gold : AmberPlainsColors.sage}
                />
                <Text style={[styles.tierTitle, isSelected && styles.tierTitleActive]}>
                  {item.tier}
                </Text>
              </View>
              <Text style={styles.tierDesc}>{item.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. Airport Transfer (Separately Configured) */}
      <View style={styles.formSection}>
        <View style={styles.transferSectionHeader}>
          <Text style={styles.sectionLabel}>4. AIRPORT-TO-HOTEL ARRIVAL TRANSFER</Text>
          <View style={styles.transferNoticeBadge}>
            <Text style={styles.transferNoticeText}>SEPARATE FROM BUSH CRUISER</Text>
          </View>
        </View>
        <Text style={styles.fieldSubNotice}>
          Your custom 4x4 game-drive cruiser meets you at safari departure. Choose your arrival transit between Moi Airport (MBA) / SGR and coastal hotels below:
        </Text>

        {AIRPORT_TRANSFERS.map((trf) => {
          const isSelected = trf.id === selectedTransferId;
          return (
            <TouchableOpacity
              key={trf.id}
              style={[styles.transferCard, isSelected && styles.transferCardActive]}
              onPress={() => setSelectedTransferId(trf.id)}
            >
              <View style={styles.transferTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.transferName, isSelected && styles.transferNameActive]}>
                    {trf.name}
                  </Text>
                  <Text style={styles.transferType}>{trf.vehicle_type}</Text>
                </View>
                <View style={styles.transferPriceBox}>
                  <Text style={styles.transferPrice}>+${trf.price_usd}</Text>
                </View>
              </View>
              <Text style={styles.transferDesc}>{trf.description}</Text>
              <View style={styles.transferSpecsRow}>
                <Text style={styles.transferSpecPill}>👥 {trf.passenger_capacity}</Text>
                <Text style={styles.transferSpecPill}>🧳 {trf.luggage_capacity}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 5. Guest Contact Info */}
      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>5. PRIMARY GUEST INFORMATION</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.fieldLabel}>Full Legal Name (as on Passport)</Text>
          <TextInput
            style={styles.textInputFull}
            value={guestName}
            onChangeText={setGuestName}
            placeholder="e.g. Dr. Jane Somerville"
            placeholderTextColor={AmberPlainsColors.sandMuted}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.fieldLabel}>Confirmation Email</Text>
          <TextInput
            style={styles.textInputFull}
            value={guestEmail}
            onChangeText={setGuestEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="e.g. jane@domain.com"
            placeholderTextColor={AmberPlainsColors.sandMuted}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.fieldLabel}>Dietary, Medical or Flight Details</Text>
          <TextInput
            style={[styles.textInputFull, { height: 70, textAlignVertical: 'top' }]}
            value={specialRequests}
            onChangeText={setSpecialRequests}
            multiline
            placeholder="e.g. Arrival on Kenya Airways KQ604. Vegetarian preference."
            placeholderTextColor={AmberPlainsColors.sandMuted}
          />
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.6 }]}
          disabled={submitting}
          onPress={handleSubmit}
        >
          <Ionicons name="shield-checkmark-outline" size={18} color={AmberPlainsColors.night} />
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting to Operations...' : 'Submit Expedition Enquiry'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.guaranteeNote}>
          🔒 KATO Bonded Protection • Direct Concierge Confirmation • No Payment Required to Enquire
        </Text>
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
  introBox: {
    padding: 20,
    backgroundColor: AmberPlainsColors.forest,
    borderBottomWidth: 1,
    borderBottomColor: AmberPlainsColors.border,
  },
  katoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  katoPillText: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  introHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
    marginBottom: 6,
  },
  introSub: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    lineHeight: 18,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionLabel: {
    color: AmberPlainsColors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  pkgRow: {
    gap: 10,
    paddingBottom: 4,
  },
  pkgSelectCard: {
    width: 220,
    padding: 14,
    backgroundColor: AmberPlainsColors.forest,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
  },
  pkgSelectCardActive: {
    borderColor: AmberPlainsColors.gold,
    backgroundColor: AmberPlainsColors.surface,
  },
  pkgSelectTitle: {
    color: AmberPlainsColors.sand,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 4,
  },
  pkgSelectTitleActive: {
    color: AmberPlainsColors.gold,
  },
  pkgSelectMeta: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 10,
  },
  textInput: {
    flex: 1,
    color: AmberPlainsColors.sand,
    paddingVertical: 10,
    fontSize: 14,
  },
  textInputFull: {
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: AmberPlainsColors.sand,
    fontSize: 14,
  },
  steppersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepperBox: {
    flex: 1,
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 8,
    padding: 12,
  },
  stepperLabel: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 1,
    borderColor: AmberPlainsColors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCount: {
    color: AmberPlainsColors.sand,
    fontSize: 16,
    fontWeight: '700',
  },
  tierCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  tierCardActive: {
    borderColor: AmberPlainsColors.gold,
    backgroundColor: AmberPlainsColors.surface,
  },
  tierRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tierTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 14,
    fontWeight: '700',
  },
  tierTitleActive: {
    color: AmberPlainsColors.gold,
  },
  tierDesc: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    lineHeight: 16,
    paddingLeft: 26,
  },
  transferSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transferNoticeBadge: {
    backgroundColor: AmberPlainsColors.goldDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  transferNoticeText: {
    color: AmberPlainsColors.sand,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  fieldSubNotice: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  transferCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  transferCardActive: {
    borderColor: AmberPlainsColors.gold,
    backgroundColor: AmberPlainsColors.surface,
  },
  transferTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  transferName: {
    color: AmberPlainsColors.sand,
    fontSize: 14,
    fontWeight: '700',
  },
  transferNameActive: {
    color: AmberPlainsColors.gold,
  },
  transferType: {
    color: AmberPlainsColors.goldLight,
    fontSize: 11,
    marginTop: 1,
  },
  transferPriceBox: {
    backgroundColor: AmberPlainsColors.night,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
  },
  transferPrice: {
    color: AmberPlainsColors.gold,
    fontSize: 13,
    fontWeight: '800',
  },
  transferDesc: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  transferSpecsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  transferSpecPill: {
    backgroundColor: AmberPlainsColors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 11,
    color: AmberPlainsColors.sand,
  },
  submitContainer: {
    padding: 20,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: AmberPlainsColors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: AmberPlainsColors.night,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  guaranteeNote: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 14,
  },
});

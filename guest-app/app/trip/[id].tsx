import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { BookingStore } from '../../src/services/bookingStore';
import { SafariBooking, DayItinerary } from '../../src/types';

export default function TripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<SafariBooking | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'vehicle' | 'photos' | 'invoices'>('itinerary');
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [changeType, setChangeType] = useState<'date_change' | 'cancellation'>('date_change');
  const [changeReason, setChangeReason] = useState('');
  const [submittingChange, setSubmittingChange] = useState(false);

  useEffect(() => {
    if (id) {
      const found = BookingStore.getById(id);
      if (found) setBooking(found);
    }
  }, [id]);

  if (!booking) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="compass" size={40} color={AmberPlainsColors.gold} />
        <Text style={styles.loadingText}>Loading expedition manifest...</Text>
      </View>
    );
  }

  const isVehicleConfirmed = booking.assigned_vehicle?.assignment_confirmed;
  const isGuideConfirmed = booking.assigned_guide?.assignment_confirmed;
  const balanceDue = booking.total_amount_usd - booking.paid_amount_usd;

  const handleEmergencyAmref = () => {
    Alert.alert(
      'AMREF Flying Doctors 24/7 Dispatch',
      'Amber Plains maintains full airborne medical evacuation coverage with AMREF Flying Doctors for every guest in the field.\n\nEmergency Control Center: +254 20 699 2000',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dial Emergency Hotline',
          onPress: () => Linking.openURL('tel:+254206992000'),
        },
      ]
    );
  };

  const handleWhatsappConcierge = () => {
    const text = encodeURIComponent(
      `Hello Amber Plains Concierge, I am inquiring regarding my expedition ${booking.reference_number} (${booking.package_title}).`
    );
    Linking.openURL(`https://wa.me/254700123456?text=${text}`);
  };

  const handleSubmitChangeRequest = async () => {
    if (!changeReason.trim()) {
      Alert.alert('Reason Required', 'Please explain the nature of your requested modification.');
      return;
    }

    setSubmittingChange(true);
    await BookingStore.requestChange(booking.id, changeType, changeReason);
    setSubmittingChange(false);
    setChangeModalVisible(false);
    setChangeReason('');

    Alert.alert(
      'Request Registered',
      'Your request has been forwarded to Amber Plains Operations Dispatch. In accordance with booking policy, lodge and flight cancellation policies apply and submission does not imply automatic approval.'
    );
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Expedition Status Banner */}
        <View style={styles.headerHero}>
          <View style={styles.heroRefRow}>
            <Text style={styles.heroRef}>{booking.reference_number}</Text>
            <View style={styles.heroStatusBadge}>
              <Text style={styles.heroStatusText}>{booking.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{booking.package_title}</Text>
          <Text style={styles.heroDates}>
            📅 {booking.start_date} to {booking.end_date} ({booking.duration_days} Days)
          </Text>
          <Text style={styles.heroParty}>
            👥 {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ''} • {booking.accommodation_tier}
          </Text>

          {/* Quick Emergency / Concierge Bar */}
          <View style={styles.actionPillsRow}>
            <TouchableOpacity style={styles.sosButton} onPress={handleEmergencyAmref}>
              <Ionicons name="medkit" size={14} color="#F87171" />
              <Text style={styles.sosButtonText}>AMREF SOS Evac</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.conciergeButton} onPress={handleWhatsappConcierge}>
              <Ionicons name="logo-whatsapp" size={14} color={AmberPlainsColors.gold} />
              <Text style={styles.conciergeButtonText}>Guide / Concierge</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabBar}>
          {[
            { key: 'itinerary', label: 'Itinerary' },
            { key: 'vehicle', label: 'Vehicle & Guide' },
            { key: 'photos', label: 'Private Media' },
            { key: 'invoices', label: 'Invoices & Pay' },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Text style={[styles.tabItemText, isActive && styles.tabItemTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TAB 1: ITINERARY & PICKUP */}
        {activeTab === 'itinerary' && (
          <View style={styles.tabContent}>
            {/* Arrival & Pickup instructions */}
            <View style={styles.pickupCard}>
              <View style={styles.pickupHeader}>
                <Ionicons name="airplane-outline" size={16} color={AmberPlainsColors.gold} />
                <Text style={styles.pickupTitle}>Arrival & Pickup Protocol</Text>
              </View>
              <Text style={styles.pickupBody}>{booking.pickup_instructions}</Text>

              {booking.transfer_option && (
                <View style={styles.transferSummary}>
                  <Text style={styles.transferSummaryTitle}>
                    Airport Transfer: {booking.transfer_option.name}
                  </Text>
                  <Text style={styles.transferSummarySub}>
                    {booking.transfer_option.vehicle_type} • {booking.transfer_option.luggage_capacity}
                  </Text>
                </View>
              )}
            </View>

            {/* Daily schedule */}
            <Text style={styles.sectionHeaderTitle}>Day-by-Day Field Itinerary</Text>
            {booking.itinerary.map((day: DayItinerary) => (
              <View key={day.day} style={styles.dayCard}>
                <View style={styles.dayBadgeRow}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>DAY {day.day}</Text>
                  </View>
                  <Text style={styles.dayLocation}>📍 {day.location}</Text>
                </View>

                <Text style={styles.dayTitle}>{day.title}</Text>

                <View style={styles.daySegment}>
                  <Text style={styles.segmentLabel}>🌅 Morning:</Text>
                  <Text style={styles.segmentText}>{day.morning}</Text>
                </View>

                <View style={styles.daySegment}>
                  <Text style={styles.segmentLabel}>☀️ Afternoon:</Text>
                  <Text style={styles.segmentText}>{day.afternoon}</Text>
                </View>

                <View style={styles.daySegment}>
                  <Text style={styles.segmentLabel}>🌌 Evening:</Text>
                  <Text style={styles.segmentText}>{day.evening}</Text>
                </View>

                <View style={styles.dayFooter}>
                  <Text style={styles.dayFooterText}>🍴 {day.meals}</Text>
                  <Text style={styles.dayFooterText}>🏨 {day.accommodation}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 2: ASSIGNED VEHICLE & GUIDE (Explicit L6 Security Rule) */}
        {activeTab === 'vehicle' && (
          <View style={styles.tabContent}>
            {!isVehicleConfirmed || !isGuideConfirmed ? (
              <View style={styles.lockedStateCard}>
                <View style={styles.lockIconCircle}>
                  <Ionicons name="lock-closed" size={32} color={AmberPlainsColors.gold} />
                </View>
                <Text style={styles.lockedTitle}>Assignment Confirmation in Progress</Text>
                <Text style={styles.lockedDescription}>
                  Per Amber Plains Operations Dispatch protocols, your custom 4x4 Land Cruiser vehicle registration and certified Master Guide profile will be published here as soon as national park permits and lodge vouchers are fully locked.
                </Text>
                <View style={styles.lockedStandardBox}>
                  <Text style={styles.lockedStandardHeading}>YOUR COMMITTED SPECIFICATIONS:</Text>
                  <Text style={styles.lockedStandardItem}>✓ Heavy-duty custom 4x4 Toyota Land Cruiser</Text>
                  <Text style={styles.lockedStandardItem}>✓ 360-degree hydraulic pop-up game-viewing roof</Text>
                  <Text style={styles.lockedStandardItem}>✓ Onboard refrigerated cooler & long-range VHF radio</Text>
                  <Text style={styles.lockedStandardItem}>✓ KPSGA Silver or Gold certified professional guide</Text>
                </View>
              </View>
            ) : (
              <View style={styles.confirmedAssignmentContainer}>
                {/* Vehicle Section */}
                <View style={styles.detailCard}>
                  <Text style={styles.cardSectionBadge}>ASSIGNED EXPEDITION CRUISER</Text>
                  <Text style={styles.vehicleTitle}>{booking.assigned_vehicle?.model}</Text>
                  <View style={styles.plateBadge}>
                    <Text style={styles.plateText}>{booking.assigned_vehicle?.plate_number}</Text>
                  </View>

                  {booking.assigned_vehicle?.photo_url ? (
                    <Image
                      source={{ uri: booking.assigned_vehicle.photo_url }}
                      style={styles.vehiclePhoto}
                    />
                  ) : null}

                  <View style={styles.featuresList}>
                    {booking.assigned_vehicle?.features.map((feat, idx) => (
                      <View key={idx} style={styles.featRow}>
                        <Ionicons name="shield-checkmark" size={14} color={AmberPlainsColors.gold} />
                        <Text style={styles.featText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Guide Section */}
                <View style={styles.detailCard}>
                  <Text style={styles.cardSectionBadge}>ASSIGNED MASTER GUIDE</Text>
                  <View style={styles.guideHeaderRow}>
                    {booking.assigned_guide?.avatar_url ? (
                      <Image
                        source={{ uri: booking.assigned_guide.avatar_url }}
                        style={styles.guideAvatar}
                      />
                    ) : (
                      <View style={styles.guideAvatarFallback}>
                        <Ionicons name="person" size={24} color={AmberPlainsColors.gold} />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.guideName}>{booking.assigned_guide?.name}</Text>
                      <Text style={styles.guideKpsga}>
                        KPSGA {booking.assigned_guide?.kpsga_badge} Badge Naturalist
                      </Text>
                      <Text style={styles.guideExp}>
                        {booking.assigned_guide?.experience_years} Years Bush Experience
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.guideBio}>{booking.assigned_guide?.bio}</Text>

                  <View style={styles.guideLanguagesRow}>
                    <Text style={styles.langLabel}>Languages:</Text>
                    {booking.assigned_guide?.languages.map((lang, i) => (
                      <View key={i} style={styles.langBadge}>
                        <Text style={styles.langBadgeText}>{lang}</Text>
                      </View>
                    ))}
                  </View>

                  {booking.assigned_guide?.phone ? (
                    <TouchableOpacity
                      style={styles.guideCallBtn}
                      onPress={() => Linking.openURL(`tel:${booking.assigned_guide?.phone}`)}
                    >
                      <Ionicons name="call-outline" size={16} color={AmberPlainsColors.night} />
                      <Text style={styles.guideCallBtnText}>Call Guide ({booking.assigned_guide?.phone})</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )}
          </View>
        )}

        {/* TAB 3: PRIVATE PHOTO GALLERY */}
        {activeTab === 'photos' && (
          <View style={styles.tabContent}>
            <View style={styles.galleryIntroCard}>
              <Ionicons name="camera" size={20} color={AmberPlainsColors.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.galleryIntroTitle}>Private Expedition Gallery</Text>
                <Text style={styles.galleryIntroDesc}>
                  High-resolution bush photography captured by your guide and Amber Plains media team during your safari.
                </Text>
              </View>
            </View>

            {booking.private_photos.length === 0 ? (
              <View style={styles.emptyGalleryBox}>
                <Ionicons name="images-outline" size={40} color={AmberPlainsColors.sage} />
                <Text style={styles.emptyGalleryTitle}>Gallery In Production</Text>
                <Text style={styles.emptyGallerySub}>
                  Expedition photos will appear here as your safari commences and our media rangers upload daily bush captures.
                </Text>
              </View>
            ) : (
              <View style={styles.photosGrid}>
                {booking.private_photos.map((photo) => (
                  <View key={photo.id} style={styles.photoCard}>
                    <Image source={{ uri: photo.image_url }} style={styles.galleryImage} />
                    <View style={styles.photoMeta}>
                      <Text style={styles.photoCaption}>{photo.caption}</Text>
                      <Text style={styles.photoSub}>
                        📍 {photo.location} • By {photo.photographer}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* TAB 4: INVOICES & PAYMENTS */}
        {activeTab === 'invoices' && (
          <View style={styles.tabContent}>
            <View style={styles.invoiceCard}>
              <Text style={styles.invoiceHeadTitle}>OFFICIAL EXPEDITION STATEMENT</Text>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceKey}>Total Expedition Package</Text>
                <Text style={styles.invoiceVal}>${booking.total_amount_usd.toLocaleString()} USD</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceKey}>Deposits / Paid to Date</Text>
                <Text style={[styles.invoiceVal, { color: AmberPlainsColors.emerald }]}>
                  ${booking.paid_amount_usd.toLocaleString()} USD
                </Text>
              </View>
              <View style={[styles.invoiceRow, styles.invoiceBalanceRow]}>
                <Text style={styles.invoiceBalanceKey}>Remaining Balance Due</Text>
                <Text style={styles.invoiceBalanceVal}>${balanceDue.toLocaleString()} USD</Text>
              </View>

              {balanceDue > 0 ? (
                <TouchableOpacity
                  style={styles.payNowButton}
                  onPress={() => router.push({ pathname: '/payment/[bookingId]', params: { bookingId: booking.id } })}
                >
                  <Ionicons name="card-outline" size={18} color={AmberPlainsColors.night} />
                  <Text style={styles.payNowButtonText}>Pay Outstanding Balance (${balanceDue.toLocaleString()})</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.paidFullBanner}>
                  <Ionicons name="checkmark-circle" size={18} color={AmberPlainsColors.emerald} />
                  <Text style={styles.paidFullBannerText}>Expedition is 100% Fully Settled</Text>
                </View>
              )}
            </View>

            {/* Change & Cancellation Request Trigger */}
            <View style={styles.changeRequestCard}>
              <Text style={styles.changeRequestTitle}>Modifications or Cancellation</Text>
              <Text style={styles.changeRequestSub}>
                Need to adjust dates, party members, or file a cancellation? Requests are reviewed by Amber Plains Dispatch subject to KATO terms.
              </Text>
              <TouchableOpacity
                style={styles.changeRequestBtn}
                onPress={() => setChangeModalVisible(true)}
              >
                <Ionicons name="create-outline" size={16} color={AmberPlainsColors.sand} />
                <Text style={styles.changeRequestBtnText}>Submit Modification / Cancel Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal for Change / Cancellation Requests */}
      <Modal visible={changeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Expedition Modification</Text>
              <TouchableOpacity onPress={() => setChangeModalVisible(false)}>
                <Ionicons name="close" size={24} color={AmberPlainsColors.sand} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalNotice}>
              Notice: Lodge cancellation penalties and Kenya Wildlife Service conservation fees apply in accordance with your signed safari contract.
            </Text>

            <View style={styles.modalTypeRow}>
              <TouchableOpacity
                style={[styles.modalTypeBtn, changeType === 'date_change' && styles.modalTypeBtnActive]}
                onPress={() => setChangeType('date_change')}
              >
                <Text style={[styles.modalTypeBtnText, changeType === 'date_change' && styles.modalTypeBtnTextActive]}>
                  Date Modification
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalTypeBtn, changeType === 'cancellation' && styles.modalTypeBtnActive]}
                onPress={() => setChangeType('cancellation')}
              >
                <Text style={[styles.modalTypeBtnText, changeType === 'cancellation' && styles.modalTypeBtnTextActive]}>
                  Trip Cancellation
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputModalLabel}>Reason for Request:</Text>
            <TextInput
              style={styles.modalTextArea}
              value={changeReason}
              onChangeText={setChangeReason}
              placeholder="Please describe your requested date adjustments or reason for cancellation..."
              placeholderTextColor={AmberPlainsColors.sandMuted}
              multiline
            />

            <TouchableOpacity
              style={[styles.modalSubmitBtn, submittingChange && { opacity: 0.6 }]}
              disabled={submittingChange}
              onPress={handleSubmitChangeRequest}
            >
              <Text style={styles.modalSubmitBtnText}>
                {submittingChange ? 'Submitting...' : 'Submit Request to Dispatch'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: AmberPlainsColors.night,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AmberPlainsColors.night,
  },
  loadingText: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 14,
    marginTop: 12,
  },
  headerHero: {
    backgroundColor: AmberPlainsColors.forest,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: AmberPlainsColors.border,
  },
  heroRefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroRef: {
    color: AmberPlainsColors.gold,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroStatusBadge: {
    backgroundColor: AmberPlainsColors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: AmberPlainsColors.borderLight,
  },
  heroStatusText: {
    color: AmberPlainsColors.sand,
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: AmberPlainsColors.sand,
    marginBottom: 4,
  },
  heroDates: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    marginBottom: 2,
  },
  heroParty: {
    color: AmberPlainsColors.goldLight,
    fontSize: 12,
    marginBottom: 14,
  },
  actionPillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  sosButtonText: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 11,
  },
  conciergeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 1,
    borderColor: AmberPlainsColors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  conciergeButtonText: {
    color: AmberPlainsColors.sand,
    fontWeight: '600',
    fontSize: 11,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: AmberPlainsColors.night,
    borderBottomWidth: 1,
    borderBottomColor: AmberPlainsColors.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: AmberPlainsColors.gold,
  },
  tabItemText: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  tabItemTextActive: {
    color: AmberPlainsColors.gold,
    fontWeight: '700',
  },
  tabContent: {
    padding: 16,
    gap: 16,
  },
  pickupCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 10,
    padding: 14,
  },
  pickupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  pickupTitle: {
    color: AmberPlainsColors.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  pickupBody: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
    lineHeight: 18,
  },
  transferSummary: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AmberPlainsColors.border,
  },
  transferSummaryTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
    fontWeight: '700',
  },
  transferSummarySub: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeaderTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  dayCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 10,
    padding: 14,
  },
  dayBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayBadge: {
    backgroundColor: AmberPlainsColors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  dayBadgeText: {
    color: AmberPlainsColors.night,
    fontSize: 10,
    fontWeight: '800',
  },
  dayLocation: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
    marginBottom: 8,
  },
  daySegment: {
    marginBottom: 6,
  },
  segmentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AmberPlainsColors.goldLight,
  },
  segmentText: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    lineHeight: 17,
  },
  dayFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: AmberPlainsColors.border,
    gap: 4,
  },
  dayFooterText: {
    color: AmberPlainsColors.sand,
    fontSize: 11,
  },
  lockedStateCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  lockIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 1,
    borderColor: AmberPlainsColors.goldDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockedTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedDescription: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  lockedStandardBox: {
    width: '100%',
    backgroundColor: AmberPlainsColors.surface,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    gap: 6,
  },
  lockedStandardHeading: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  lockedStandardItem: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
  },
  confirmedAssignmentContainer: {
    gap: 16,
  },
  detailCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 12,
    padding: 16,
  },
  cardSectionBadge: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
    marginBottom: 6,
  },
  plateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FACC15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 12,
  },
  plateText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  vehiclePhoto: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  featuresList: {
    gap: 6,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featText: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
  },
  guideHeaderRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  guideAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: AmberPlainsColors.gold,
  },
  guideAvatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AmberPlainsColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideName: {
    fontSize: 16,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
  },
  guideKpsga: {
    fontSize: 12,
    color: AmberPlainsColors.gold,
    fontWeight: '600',
    marginTop: 2,
  },
  guideExp: {
    fontSize: 11,
    color: AmberPlainsColors.sandMuted,
  },
  guideBio: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  guideLanguagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  langLabel: {
    fontSize: 11,
    color: AmberPlainsColors.sandMuted,
  },
  langBadge: {
    backgroundColor: AmberPlainsColors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  langBadgeText: {
    color: AmberPlainsColors.sand,
    fontSize: 10,
    fontWeight: '600',
  },
  guideCallBtn: {
    backgroundColor: AmberPlainsColors.gold,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  guideCallBtnText: {
    color: AmberPlainsColors.night,
    fontWeight: '700',
    fontSize: 12,
  },
  galleryIntroCard: {
    flexDirection: 'row',
    backgroundColor: AmberPlainsColors.forest,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    gap: 12,
    alignItems: 'center',
  },
  galleryIntroTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 14,
    fontWeight: '700',
  },
  galleryIntroDesc: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  emptyGalleryBox: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: AmberPlainsColors.forest,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
  },
  emptyGalleryTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyGallerySub: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  photosGrid: {
    gap: 14,
  },
  photoCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  photoMeta: {
    padding: 10,
  },
  photoCaption: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
    fontWeight: '600',
  },
  photoSub: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 10,
    marginTop: 2,
  },
  invoiceCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    padding: 16,
    gap: 10,
  },
  invoiceHeadTitle: {
    color: AmberPlainsColors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceKey: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 13,
  },
  invoiceVal: {
    color: AmberPlainsColors.sand,
    fontSize: 14,
    fontWeight: '600',
  },
  invoiceBalanceRow: {
    borderTopWidth: 1,
    borderTopColor: AmberPlainsColors.border,
    paddingTop: 10,
    marginTop: 4,
  },
  invoiceBalanceKey: {
    color: AmberPlainsColors.sand,
    fontSize: 14,
    fontWeight: '700',
  },
  invoiceBalanceVal: {
    color: AmberPlainsColors.gold,
    fontSize: 18,
    fontWeight: '800',
  },
  payNowButton: {
    backgroundColor: AmberPlainsColors.gold,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  payNowButtonText: {
    color: AmberPlainsColors.night,
    fontWeight: '800',
    fontSize: 13,
  },
  paidFullBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
    marginTop: 8,
  },
  paidFullBannerText: {
    color: '#34D399',
    fontWeight: '700',
    fontSize: 12,
  },
  changeRequestCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    padding: 16,
  },
  changeRequestTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  changeRequestSub: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  changeRequestBtn: {
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 1,
    borderColor: AmberPlainsColors.borderLight,
    paddingVertical: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  changeRequestBtnText: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AmberPlainsColors.forest,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: AmberPlainsColors.borderLight,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
  },
  modalNotice: {
    fontSize: 11,
    color: AmberPlainsColors.amber,
    lineHeight: 16,
  },
  modalTypeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    alignItems: 'center',
    backgroundColor: AmberPlainsColors.surface,
  },
  modalTypeBtnActive: {
    borderColor: AmberPlainsColors.gold,
    backgroundColor: AmberPlainsColors.goldDark,
  },
  modalTypeBtnText: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  modalTypeBtnTextActive: {
    color: AmberPlainsColors.sand,
    fontWeight: '700',
  },
  inputModalLabel: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
    fontWeight: '600',
  },
  modalTextArea: {
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 8,
    padding: 10,
    height: 90,
    color: AmberPlainsColors.sand,
    textAlignVertical: 'top',
    fontSize: 13,
  },
  modalSubmitBtn: {
    backgroundColor: AmberPlainsColors.gold,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  modalSubmitBtnText: {
    color: AmberPlainsColors.night,
    fontWeight: '800',
    fontSize: 13,
  },
});

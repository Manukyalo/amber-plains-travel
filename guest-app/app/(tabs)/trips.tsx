import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { BookingStore } from '../../src/services/bookingStore';
import { SafariBooking, BookingStatus } from '../../src/types';

export default function TripsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<SafariBooking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = BookingStore.subscribe((updated) => {
      setBookings(updated);
    });
    return unsubscribe;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setBookings(BookingStore.getAll());
    setTimeout(() => setRefreshing(false), 500);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return { label: 'CONFIRMED', bg: '#064E3B', text: '#34D399', icon: 'checkmark-circle' };
      case 'in_safari':
        return { label: 'IN EXPEDITION', bg: '#1E3A8A', text: '#60A5FA', icon: 'compass' };
      case 'enquiry':
        return { label: 'ENQUIRY UNDER REVIEW', bg: '#78350F', text: '#FBBF24', icon: 'time-outline' };
      case 'completed':
        return { label: 'COMPLETED', bg: '#27272A', text: '#A1A1AA', icon: 'archive-outline' };
      default:
        return { label: status.toUpperCase(), bg: AmberPlainsColors.surface, text: AmberPlainsColors.sand, icon: 'alert-circle' };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AmberPlainsColors.gold} />}
    >
      <View style={styles.topHeader}>
        <Text style={styles.headerSubtitle}>GUEST TRAVEL MANIFEST</Text>
        <Text style={styles.headerTitle}>Your Safari Expeditions</Text>
        <Text style={styles.headerDesc}>
          Access verified itineraries, track assigned bush cruisers and master guides, and manage trip invoices.
        </Text>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="compass-outline" size={48} color={AmberPlainsColors.gold} />
          <Text style={styles.emptyTitle}>No Expeditions On File</Text>
          <Text style={styles.emptyDesc}>
            You do not currently have any active safari enquiries or confirmed bookings with Amber Plains.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/enquiry')}
          >
            <Text style={styles.emptyBtnText}>Plan Your First Safari</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {bookings.map((booking) => {
            const badge = getStatusBadge(booking.status);
            const balanceDue = booking.total_amount_usd - booking.paid_amount_usd;
            const isVehicleConfirmed = booking.assigned_vehicle?.assignment_confirmed;

            return (
              <TouchableOpacity
                key={booking.id}
                style={styles.card}
                activeOpacity={0.88}
                onPress={() => router.push({ pathname: '/trip/[id]', params: { id: booking.id } })}
              >
                {/* Header row */}
                <View style={styles.cardHeader}>
                  <View style={styles.refWrap}>
                    <Text style={styles.refText}>{booking.reference_number}</Text>
                    <Text style={styles.dateRange}>
                      {booking.start_date} → {booking.end_date}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon as any} size={11} color={badge.text} />
                    <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.cardTitle}>{booking.package_title}</Text>
                <Text style={styles.cardDestinations}>
                  📍 {booking.destinations.join(' • ')}
                </Text>

                {/* Assignment Banner (Crucial Requirement) */}
                <View style={styles.assignmentRow}>
                  <View style={styles.assignmentCol}>
                    <Text style={styles.assignmentMetaLabel}>BUSH VEHICLE</Text>
                    <View style={styles.assignmentValueRow}>
                      <Ionicons
                        name={isVehicleConfirmed ? 'shield-checkmark' : 'lock-closed-outline'}
                        size={13}
                        color={isVehicleConfirmed ? AmberPlainsColors.emerald : AmberPlainsColors.amber}
                      />
                      <Text
                        style={[
                          styles.assignmentValue,
                          !isVehicleConfirmed && { color: AmberPlainsColors.amber },
                        ]}
                      >
                        {isVehicleConfirmed ? booking.assigned_vehicle?.model : 'Awaiting Confirmation'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.assignmentCol}>
                    <Text style={styles.assignmentMetaLabel}>LEAD GUIDE</Text>
                    <View style={styles.assignmentValueRow}>
                      <Ionicons
                        name={isVehicleConfirmed ? 'person-circle' : 'lock-closed-outline'}
                        size={13}
                        color={isVehicleConfirmed ? AmberPlainsColors.emerald : AmberPlainsColors.amber}
                      />
                      <Text
                        style={[
                          styles.assignmentValue,
                          !isVehicleConfirmed && { color: AmberPlainsColors.amber },
                        ]}
                      >
                        {isVehicleConfirmed ? booking.assigned_guide?.name : 'Allocation Pending'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Financial Summary */}
                <View style={styles.financeFooter}>
                  <View>
                    <Text style={styles.financeLabel}>Total Expedition Cost</Text>
                    <Text style={styles.financeVal}>${booking.total_amount_usd.toLocaleString()} USD</Text>
                  </View>

                  {balanceDue > 0 ? (
                    <View style={styles.payActionWrap}>
                      <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
                        <Text style={styles.balanceLabel}>Balance Due</Text>
                        <Text style={styles.balanceVal}>${balanceDue.toLocaleString()}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.payBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push({ pathname: '/payment/[bookingId]', params: { bookingId: booking.id } });
                        }}
                      >
                        <Text style={styles.payBtnText}>Pay</Text>
                        <Ionicons name="card-outline" size={13} color={AmberPlainsColors.night} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.fullyPaidBadge}>
                      <Ionicons name="checkmark-done" size={14} color={AmberPlainsColors.emerald} />
                      <Text style={styles.fullyPaidText}>Fully Paid</Text>
                    </View>
                  )}
                </View>

                {/* Card CTA */}
                <View style={styles.cardNavRow}>
                  <Text style={styles.cardNavText}>Open Trip Hub & Daily Itinerary</Text>
                  <Ionicons name="chevron-forward" size={16} color={AmberPlainsColors.gold} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AmberPlainsColors.night,
  },
  topHeader: {
    padding: 20,
    backgroundColor: AmberPlainsColors.forest,
    borderBottomWidth: 1,
    borderBottomColor: AmberPlainsColors.border,
  },
  headerSubtitle: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  headerTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 4,
  },
  headerDesc: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  refWrap: {
    flex: 1,
  },
  refText: {
    color: AmberPlainsColors.gold,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  dateRange: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
    marginBottom: 4,
  },
  cardDestinations: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    marginBottom: 14,
  },
  assignmentRow: {
    flexDirection: 'row',
    backgroundColor: AmberPlainsColors.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    gap: 12,
    marginBottom: 14,
  },
  assignmentCol: {
    flex: 1,
  },
  assignmentMetaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: AmberPlainsColors.sandMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  assignmentValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assignmentValue: {
    fontSize: 11,
    fontWeight: '600',
    color: AmberPlainsColors.sand,
    flex: 1,
  },
  financeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: AmberPlainsColors.border,
    paddingTop: 12,
    paddingBottom: 10,
  },
  financeLabel: {
    fontSize: 10,
    color: AmberPlainsColors.sandMuted,
    textTransform: 'uppercase',
  },
  financeVal: {
    fontSize: 14,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
    marginTop: 1,
  },
  payActionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 9,
    color: AmberPlainsColors.amber,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  balanceVal: {
    fontSize: 13,
    fontWeight: '800',
    color: AmberPlainsColors.amber,
  },
  payBtn: {
    backgroundColor: AmberPlainsColors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  payBtnText: {
    color: AmberPlainsColors.night,
    fontWeight: '800',
    fontSize: 12,
  },
  fullyPaidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fullyPaidText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  cardNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  cardNavText: {
    color: AmberPlainsColors.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
    marginTop: 14,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: AmberPlainsColors.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyBtnText: {
    color: AmberPlainsColors.night,
    fontWeight: '700',
    fontSize: 13,
  },
});

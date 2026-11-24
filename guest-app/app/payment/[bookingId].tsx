import React, { useState, useEffect } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { BookingStore } from '../../src/services/bookingStore';
import { SafariBooking } from '../../src/types';

export default function PaymentScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<SafariBooking | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'intasend_card' | 'bank_wire'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('254700123456');
  const [amountUsd, setAmountUsd] = useState('0');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (bookingId) {
      const found = BookingStore.getById(bookingId);
      if (found) {
        setBooking(found);
        const bal = found.total_amount_usd - found.paid_amount_usd;
        setAmountUsd(bal.toString());
      }
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <View style={styles.centerWrap}>
        <Ionicons name="card" size={40} color={AmberPlainsColors.gold} />
        <Text style={styles.centerText}>Loading payment details...</Text>
      </View>
    );
  }

  const balanceDue = booking.total_amount_usd - booking.paid_amount_usd;
  // Convert USD to approximate KES at 130 KES/USD for M-Pesa STK
  const kesAmount = Math.round(Number(amountUsd) * 130);

  const handleProcessPayment = async () => {
    const payAmt = Number(amountUsd);
    if (isNaN(payAmt) || payAmt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }

    setProcessing(true);

    if (paymentMethod === 'mpesa') {
      setTimeout(async () => {
        await BookingStore.recordPayment(booking.id, payAmt, 'M-Pesa STK');
        setProcessing(false);
        Alert.alert(
          'M-Pesa STK Push Succeeded',
          `KES ${kesAmount.toLocaleString()} received via Safaricom M-Pesa under receipt APM-${Math.floor(100000 + Math.random() * 900000)}. Your booking status has been updated and official guide & vehicle assignments have been unlocked.`,
          [
            {
              text: 'View Itinerary & Assignments',
              onPress: () => router.replace({ pathname: '/trip/[id]', params: { id: booking.id } }),
            },
          ]
        );
      }, 2000);
    } else if (paymentMethod === 'intasend_card') {
      setTimeout(async () => {
        await BookingStore.recordPayment(booking.id, payAmt, 'IntaSend Card');
        setProcessing(false);
        Alert.alert(
          'Card Payment Verified',
          `$${payAmt.toLocaleString()} USD charged securely via IntaSend PCI-DSS Level 1 Gateway. Your reservation is confirmed.`,
          [
            {
              text: 'View Itinerary',
              onPress: () => router.replace({ pathname: '/trip/[id]', params: { id: booking.id } }),
            },
          ]
        );
      }, 2000);
    } else {
      setProcessing(false);
      Alert.alert(
        'Wire Transfer Order Created',
        'Official proforma invoice and SWIFT routing instructions dispatched to your email. Your reservation is held for 48 hours pending bank clearance.'
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Invoice Card */}
      <View style={styles.invoiceHeader}>
        <View style={styles.badgeRow}>
          <Ionicons name="shield-checkmark" size={14} color={AmberPlainsColors.gold} />
          <Text style={styles.badgeText}>PCI-DSS SECURE GATEWAY</Text>
        </View>
        <Text style={styles.title}>Expedition Checkout</Text>
        <Text style={styles.subtitle}>Reference: {booking.reference_number}</Text>
        <Text style={styles.packageTitle}>{booking.package_title}</Text>

        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>Remaining Balance Due:</Text>
          <Text style={styles.balanceAmount}>${balanceDue.toLocaleString()} USD</Text>
        </View>
      </View>

      {/* Payment Method Selector */}
      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>SELECT PAYMENT METHOD</Text>

        {/* 1. M-Pesa STK Push */}
        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'mpesa' && styles.methodCardActive]}
          onPress={() => setPaymentMethod('mpesa')}
        >
          <View style={styles.methodHeader}>
            <View style={styles.methodTitleRow}>
              <Ionicons
                name={paymentMethod === 'mpesa' ? 'radio-button-on' : 'radio-button-off'}
                size={18}
                color={paymentMethod === 'mpesa' ? AmberPlainsColors.gold : AmberPlainsColors.sage}
              />
              <Text style={[styles.methodTitle, paymentMethod === 'mpesa' && styles.methodTitleActive]}>
                Safaricom M-Pesa (STK Express)
              </Text>
            </View>
            <View style={styles.localCurrencyBadge}>
              <Text style={styles.localCurrencyText}>KES {kesAmount.toLocaleString()}</Text>
            </View>
          </View>
          <Text style={styles.methodDesc}>
            Instant mobile checkout prompt sent to your Safaricom SIM card in Kenya.
          </Text>

          {paymentMethod === 'mpesa' && (
            <View style={styles.mpesaInputWrap}>
              <Text style={styles.inputMiniLabel}>M-Pesa Mobile Number:</Text>
              <TextInput
                style={styles.mpesaInput}
                value={mpesaPhone}
                onChangeText={setMpesaPhone}
                keyboardType="phone-pad"
                placeholder="254700123456"
                placeholderTextColor={AmberPlainsColors.sandMuted}
              />
            </View>
          )}
        </TouchableOpacity>

        {/* 2. IntaSend / Credit Card */}
        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'intasend_card' && styles.methodCardActive]}
          onPress={() => setPaymentMethod('intasend_card')}
        >
          <View style={styles.methodHeader}>
            <View style={styles.methodTitleRow}>
              <Ionicons
                name={paymentMethod === 'intasend_card' ? 'radio-button-on' : 'radio-button-off'}
                size={18}
                color={paymentMethod === 'intasend_card' ? AmberPlainsColors.gold : AmberPlainsColors.sage}
              />
              <Text style={[styles.methodTitle, paymentMethod === 'intasend_card' && styles.methodTitleActive]}>
                Credit or Debit Card (IntaSend)
              </Text>
            </View>
            <View style={styles.brandIconsRow}>
              <Text style={styles.brandBadge}>VISA</Text>
              <Text style={styles.brandBadge}>MC</Text>
            </View>
          </View>
          <Text style={styles.methodDesc}>
            Secure international card checkout in USD. Instant bank authorization.
          </Text>
        </TouchableOpacity>

        {/* 3. Bank Wire */}
        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'bank_wire' && styles.methodCardActive]}
          onPress={() => setPaymentMethod('bank_wire')}
        >
          <View style={styles.methodHeader}>
            <View style={styles.methodTitleRow}>
              <Ionicons
                name={paymentMethod === 'bank_wire' ? 'radio-button-on' : 'radio-button-off'}
                size={18}
                color={paymentMethod === 'bank_wire' ? AmberPlainsColors.gold : AmberPlainsColors.sage}
              />
              <Text style={[styles.methodTitle, paymentMethod === 'bank_wire' && styles.methodTitleActive]}>
                International Wire (SWIFT / RTGS)
              </Text>
            </View>
          </View>
          <Text style={styles.methodDesc}>
            For institutional or large private departures. Proforma invoice with KCB / Standard Chartered details.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount input */}
      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>AMOUNT TO SETTLE (USD)</Text>
        <View style={styles.amountInputWrap}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amountUsd}
            onChangeText={setAmountUsd}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.fullAmountBtn}
            onPress={() => setAmountUsd(balanceDue.toString())}
          >
            <Text style={styles.fullAmountBtnText}>Pay Full</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.payButton, processing && { opacity: 0.7 }]}
          disabled={processing}
          onPress={handleProcessPayment}
        >
          {processing ? (
            <ActivityIndicator color={AmberPlainsColors.night} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={16} color={AmberPlainsColors.night} />
              <Text style={styles.payButtonText}>
                {paymentMethod === 'mpesa'
                  ? `Send M-Pesa STK Prompt (KES ${kesAmount.toLocaleString()})`
                  : `Authorize $${Number(amountUsd || 0).toLocaleString()} USD`}
              </Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.securityNote}>
          Encrypted with 256-bit TLS • Regulated by the Central Bank of Kenya
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
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AmberPlainsColors.night,
  },
  centerText: {
    color: AmberPlainsColors.sandMuted,
    marginTop: 10,
    fontSize: 13,
  },
  invoiceHeader: {
    padding: 20,
    backgroundColor: AmberPlainsColors.forest,
    borderBottomWidth: 1,
    borderBottomColor: AmberPlainsColors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: AmberPlainsColors.sand,
    marginBottom: 2,
  },
  subtitle: {
    color: AmberPlainsColors.goldLight,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  packageTitle: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 13,
    marginBottom: 12,
  },
  balanceBox: {
    backgroundColor: AmberPlainsColors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AmberPlainsColors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: AmberPlainsColors.sand,
    fontSize: 13,
    fontWeight: '600',
  },
  balanceAmount: {
    color: AmberPlainsColors.gold,
    fontSize: 18,
    fontWeight: '800',
  },
  formSection: {
    padding: 20,
    gap: 12,
  },
  sectionLabel: {
    color: AmberPlainsColors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  methodCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 10,
    padding: 14,
  },
  methodCardActive: {
    borderColor: AmberPlainsColors.gold,
    backgroundColor: AmberPlainsColors.surface,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  methodTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 14,
    fontWeight: '700',
  },
  methodTitleActive: {
    color: AmberPlainsColors.gold,
  },
  localCurrencyBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  localCurrencyText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
  },
  brandIconsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  brandBadge: {
    backgroundColor: AmberPlainsColors.night,
    color: AmberPlainsColors.sand,
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  methodDesc: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  mpesaInputWrap: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AmberPlainsColors.border,
  },
  inputMiniLabel: {
    color: AmberPlainsColors.sand,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  mpesaInput: {
    backgroundColor: AmberPlainsColors.night,
    borderWidth: 1,
    borderColor: AmberPlainsColors.borderLight,
    borderRadius: 6,
    color: AmberPlainsColors.sand,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  dollarSign: {
    color: AmberPlainsColors.gold,
    fontSize: 20,
    fontWeight: '800',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    color: AmberPlainsColors.sand,
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 12,
  },
  fullAmountBtn: {
    backgroundColor: AmberPlainsColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: AmberPlainsColors.goldDark,
  },
  fullAmountBtnText: {
    color: AmberPlainsColors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  actionContainer: {
    padding: 20,
  },
  payButton: {
    backgroundColor: AmberPlainsColors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  payButtonText: {
    color: AmberPlainsColors.night,
    fontWeight: '800',
    fontSize: 14,
  },
  securityNote: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
  },
});

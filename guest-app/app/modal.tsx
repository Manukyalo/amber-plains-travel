import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../constants/Colors';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/guest-app-logo.png')}
        style={{ width: 64, height: 68, alignSelf: 'center', marginBottom: 16 }}
        resizeMode="contain"
      />
      <View style={styles.badgeRow}>
        <Ionicons name="compass" size={18} color={AmberPlainsColors.gold} />
        <Text style={styles.badgeText}>OPERATIONS CONCIERGE</Text>
      </View>
      <Text style={styles.title}>24/7 Dispatch Control</Text>
      <Text style={styles.desc}>
        Need immediate assistance with bush radio links, lodge vouchers, flight transfers, or AMREF air evacuation? Connect with our duty dispatch officer directly.
      </Text>

      <View style={styles.contactsCard}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Linking.openURL('tel:+254700123456')}
        >
          <Ionicons name="call" size={18} color={AmberPlainsColors.night} />
          <Text style={styles.actionBtnText}>Dial Duty Dispatch (+254 700 123 456)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.whatsappBtn]}
          onPress={() => Linking.openURL('https://wa.me/254700123456')}
        >
          <Ionicons name="logo-whatsapp" size={18} color={AmberPlainsColors.sand} />
          <Text style={[styles.actionBtnText, { color: AmberPlainsColors.sand }]}>
            Chat on WhatsApp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.amrefBtn]}
          onPress={() => Linking.openURL('tel:+254206992000')}
        >
          <Ionicons name="airplane" size={18} color="#FFF" />
          <Text style={[styles.actionBtnText, { color: '#FFF' }]}>
            AMREF Flying Doctors SOS (+254 20 699 2000)
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerNote}>
        Mombasa Headquarters: Suite 4B, Bamburi Beach Ridge, Mombasa, Kenya.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AmberPlainsColors.forest,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: AmberPlainsColors.sand,
    marginBottom: 8,
    textAlign: 'center',
  },
  desc: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  contactsCard: {
    width: '100%',
    gap: 12,
  },
  actionBtn: {
    backgroundColor: AmberPlainsColors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnText: {
    color: AmberPlainsColors.night,
    fontWeight: '800',
    fontSize: 13,
  },
  whatsappBtn: {
    backgroundColor: '#075E54',
  },
  amrefBtn: {
    backgroundColor: '#DC2626',
  },
  footerNote: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
  },
});

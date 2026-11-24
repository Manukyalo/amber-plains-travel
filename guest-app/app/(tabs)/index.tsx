import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { SAFARI_PACKAGES } from '../../src/services/safariData';
import { SafariPackage } from '../../src/types';

const { width } = Dimensions.get('window');

const DESTINATIONS = [
  'All Wilds',
  'Tsavo East & West',
  'Amboseli',
  'Maasai Mara',
  'Mombasa Coast',
];

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedDest, setSelectedDest] = useState('All Wilds');

  const filteredPackages =
    selectedDest === 'All Wilds'
      ? SAFARI_PACKAGES
      : SAFARI_PACKAGES.filter((p) =>
        p.destinations.some((d) =>
          d.toLowerCase().includes(selectedDest.toLowerCase().replace(' & west', '').replace(' coast', ''))
        )
      );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Brand Header Banner */}
      <View style={styles.heroBanner}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroBadge}>KATO BONDED #492 • TRA LICENSED</Text>
          <Text style={styles.heroTitle}>Bespoke Private Expeditions</Text>
          <Text style={styles.heroSubtitle}>
            Bridging the historic coral coast of Mombasa with Tsavo, Amboseli, and the Great Migration theaters.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/enquiry')}
          >
            <Text style={styles.ctaButtonText}>Design Custom Safari</Text>
            <Ionicons name="arrow-forward" size={16} color={AmberPlainsColors.night} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Destination Pills */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionSubtitle}>EXPEDITIONS</Text>
        <Text style={styles.sectionTitle}>Curated Itineraries</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {DESTINATIONS.map((dest) => {
          const isSelected = selectedDest === dest;
          return (
            <TouchableOpacity
              key={dest}
              style={[
                styles.filterChip,
                isSelected && styles.filterChipActive,
              ]}
              onPress={() => setSelectedDest(dest)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.filterChipTextActive,
                ]}
              >
                {dest}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Safari Packages List */}
      <View style={styles.packagesContainer}>
        {filteredPackages.map((pkg) => (
          <View key={pkg.id} style={styles.packageCard}>
            <View style={styles.packageImageWrap}>
              <Image source={{ uri: pkg.hero_image }} style={styles.packageImage} />
              <View style={styles.packageDurationBadge}>
                <Ionicons name="time-outline" size={13} color={AmberPlainsColors.night} />
                <Text style={styles.packageDurationText}>{pkg.duration_days} Days / {pkg.duration_days - 1} Nights</Text>
              </View>
              <View style={styles.packagePriceBadge}>
                <Text style={styles.packagePriceLabel}>From</Text>
                <Text style={styles.packagePriceVal}>${pkg.price_from_usd.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.packageBody}>
              <Text style={styles.packageTitle}>{pkg.title}</Text>
              <Text style={styles.packageSubtitle}>{pkg.subtitle}</Text>
              <Text style={styles.packageSummary} numberOfLines={3}>
                {pkg.summary}
              </Text>

              {/* Highlights */}
              <View style={styles.highlightsContainer}>
                {pkg.highlights.slice(0, 2).map((hl, i) => (
                  <View key={i} style={styles.highlightRow}>
                    <Ionicons name="checkmark-circle" size={14} color={AmberPlainsColors.gold} />
                    <Text style={styles.highlightText} numberOfLines={1}>{hl}</Text>
                  </View>
                ))}
              </View>

              {/* Action row */}
              <View style={styles.cardActionRow}>
                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => {
                    router.push({
                      pathname: '/(tabs)/enquiry',
                      params: { packageId: pkg.id, title: pkg.title },
                    });
                  }}
                >
                  <Text style={styles.detailsBtnText}>Request Itinerary</Text>
                  <Ionicons name="paper-plane-outline" size={15} color={AmberPlainsColors.sand} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Amber Plains Fleet & Bush Standards Section */}
      <View style={styles.standardsCard}>
        <View style={styles.standardsBadge}>
          <Ionicons name="shield-checkmark" size={16} color={AmberPlainsColors.gold} />
          <Text style={styles.standardsBadgeText}>THE AMBER PLAINS GUARANTEE</Text>
        </View>
        <Text style={styles.standardsTitle}>Custom Extended 4x4 Land Cruisers</Text>
        <Text style={styles.standardsDesc}>
          Every Amber Plains expedition operates exclusively in custom-engineered heavy-duty Toyota Land Cruisers featuring 360° pop-up roofs, onboard Engel refrigerators, dual spare tires, telephoto lens beanbags, and KPSGA Silver certified naturalist guides.
        </Text>
        <View style={styles.standardsPillsRow}>
          <View style={styles.featPill}>
            <Ionicons name="radio-outline" size={13} color={AmberPlainsColors.gold} />
            <Text style={styles.featPillText}>VHF Long Range</Text>
          </View>
          <View style={styles.featPill}>
            <Ionicons name="medkit-outline" size={13} color={AmberPlainsColors.gold} />
            <Text style={styles.featPillText}>AMREF Evacuation</Text>
          </View>
          <View style={styles.featPill}>
            <Ionicons name="snow-outline" size={13} color={AmberPlainsColors.gold} />
            <Text style={styles.featPillText}>Cold Drinks</Text>
          </View>
        </View>
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
  heroBanner: {
    height: 320,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 14, 12, 0.65)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
  },
  heroBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: AmberPlainsColors.gold,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: AmberPlainsColors.sand,
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: AmberPlainsColors.sandMuted,
    lineHeight: 18,
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: AmberPlainsColors.gold,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  ctaButtonText: {
    color: AmberPlainsColors.night,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionSubtitle: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
  },
  sectionTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
  },
  filterChipActive: {
    backgroundColor: AmberPlainsColors.gold,
    borderColor: AmberPlainsColors.gold,
  },
  filterChipText: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: AmberPlainsColors.night,
    fontWeight: '700',
  },
  packagesContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  packageCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    overflow: 'hidden',
  },
  packageImageWrap: {
    height: 190,
    width: '100%',
    position: 'relative',
  },
  packageImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  packageDurationBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: AmberPlainsColors.sand,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  packageDurationText: {
    color: AmberPlainsColors.night,
    fontSize: 11,
    fontWeight: '700',
  },
  packagePriceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(11, 14, 12, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AmberPlainsColors.borderLight,
    alignItems: 'flex-end',
  },
  packagePriceLabel: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  packagePriceVal: {
    color: AmberPlainsColors.gold,
    fontSize: 16,
    fontWeight: '800',
  },
  packageBody: {
    padding: 16,
  },
  packageTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
    marginBottom: 4,
  },
  packageSubtitle: {
    fontSize: 12,
    color: AmberPlainsColors.goldLight,
    marginBottom: 8,
    fontWeight: '500',
  },
  packageSummary: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  highlightsContainer: {
    gap: 6,
    marginBottom: 16,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightText: {
    fontSize: 12,
    color: AmberPlainsColors.sand,
    flex: 1,
  },
  cardActionRow: {
    borderTopWidth: 1,
    borderTopColor: AmberPlainsColors.border,
    paddingTop: 12,
  },
  detailsBtn: {
    backgroundColor: AmberPlainsColors.surface,
    borderWidth: 1,
    borderColor: AmberPlainsColors.goldDark,
    borderRadius: 6,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  detailsBtnText: {
    color: AmberPlainsColors.sand,
    fontSize: 13,
    fontWeight: '600',
  },
  standardsCard: {
    margin: 20,
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    borderRadius: 12,
    padding: 18,
  },
  standardsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  standardsBadgeText: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  standardsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AmberPlainsColors.sand,
    marginBottom: 6,
  },
  standardsDesc: {
    fontSize: 12,
    color: AmberPlainsColors.sandMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  standardsPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: AmberPlainsColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
  },
  featPillText: {
    color: AmberPlainsColors.sand,
    fontSize: 11,
    fontWeight: '500',
  },
});

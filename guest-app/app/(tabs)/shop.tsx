import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AmberPlainsColors } from '../../constants/Colors';
import { MERCHANDISE_ITEMS } from '../../src/services/safariData';
import { MerchandiseItem } from '../../src/types';
import { useCart } from '../../src/context/CartContext';

const CATEGORIES = ['All Gear', 'Apparel', 'Field Gear', 'Luggage'];

export default function ShopScreen() {
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPriceUsd } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All Gear');
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'camp' | 'hotel'>('camp');

  const filteredItems =
    selectedCategory === 'All Gear'
      ? MERCHANDISE_ITEMS
      : MERCHANDISE_ITEMS.filter((item) => item.category === selectedCategory);

  const handleCheckout = () => {
    Alert.alert(
      'Order Dispatched to Bush Concierge',
      `Thank you! Your order for ${totalCount} items ($${totalPriceUsd} USD) will be prepared and delivered directly to your ${deliveryOption === 'camp' ? 'safari camp accommodation in Kenya' : 'coastal hotel in Mombasa'}. Your invoice has been updated.`,
      [
        {
          text: 'Confirm',
          onPress: () => {
            clearCart();
            setCartModalVisible(false);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroSubtitle}>EQUIPMENT & LUGGAGE</Text>
          <Text style={styles.heroTitle}>Amber Plains Field Boutique</Text>
          <Text style={styles.heroDesc}>
            Curated expedition essentials crafted specifically for East African bush conditions and light aircraft weight allowances.
          </Text>
        </View>

        {/* Category filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, isSelected && styles.catChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Grid */}
        <View style={styles.productGrid}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={{ uri: item.image_url }} style={styles.productImage} />
              <View style={styles.productBody}>
                <Text style={styles.productCategory}>{item.category.toUpperCase()}</Text>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price_usd} USD</Text>
                <Text style={styles.productDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                <TouchableOpacity
                  style={styles.addCartBtn}
                  onPress={() => addToCart(item, item.sizes ? item.sizes[0] : undefined)}
                >
                  <Ionicons name="bag-add-outline" size={15} color={AmberPlainsColors.night} />
                  <Text style={styles.addCartBtnText}>Add to Bag</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Cart Button */}
      {totalCount > 0 && (
        <TouchableOpacity
          style={styles.floatingCartBar}
          activeOpacity={0.9}
          onPress={() => setCartModalVisible(true)}
        >
          <View style={styles.floatingCartLeft}>
            <View style={styles.cartCountCircle}>
              <Text style={styles.cartCountText}>{totalCount}</Text>
            </View>
            <Text style={styles.floatingCartLabel}>View Expedition Bag</Text>
          </View>
          <View style={styles.floatingCartRight}>
            <Text style={styles.floatingCartTotal}>${totalPriceUsd} USD</Text>
            <Ionicons name="arrow-forward" size={16} color={AmberPlainsColors.night} />
          </View>
        </TouchableOpacity>
      )}

      {/* Cart Modal */}
      <Modal visible={cartModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.cartSheet}>
            <View style={styles.sheetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="bag-handle" size={20} color={AmberPlainsColors.gold} />
                <Text style={styles.sheetTitle}>Your Safari Bag ({totalCount})</Text>
              </View>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <Ionicons name="close" size={24} color={AmberPlainsColors.sand} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
              {items.map((cartItem, idx) => (
                <View key={idx} style={styles.cartItemRow}>
                  <Image source={{ uri: cartItem.product.image_url }} style={styles.cartThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cartItemName}>{cartItem.product.name}</Text>
                    {cartItem.selected_size && (
                      <Text style={styles.cartItemSize}>Size: {cartItem.selected_size}</Text>
                    )}
                    <Text style={styles.cartItemPrice}>
                      ${cartItem.product.price_usd * cartItem.quantity} USD
                    </Text>
                  </View>

                  <View style={styles.qtyControl}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() =>
                        updateQuantity(
                          cartItem.product.id,
                          cartItem.quantity - 1,
                          cartItem.selected_size
                        )
                      }
                    >
                      <Ionicons name="remove" size={14} color={AmberPlainsColors.sand} />
                    </TouchableOpacity>
                    <Text style={styles.qtyVal}>{cartItem.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() =>
                        updateQuantity(
                          cartItem.product.id,
                          cartItem.quantity + 1,
                          cartItem.selected_size
                        )
                      }
                    >
                      <Ionicons name="add" size={14} color={AmberPlainsColors.sand} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {/* Delivery Destination */}
              <View style={styles.deliverySection}>
                <Text style={styles.deliveryTitle}>Delivery Preference in Kenya</Text>
                <View style={styles.deliveryOptionsRow}>
                  <TouchableOpacity
                    style={[styles.delBtn, deliveryOption === 'camp' && styles.delBtnActive]}
                    onPress={() => setDeliveryOption('camp')}
                  >
                    <Ionicons
                      name="bonfire-outline"
                      size={16}
                      color={deliveryOption === 'camp' ? AmberPlainsColors.gold : AmberPlainsColors.sage}
                    />
                    <Text
                      style={[
                        styles.delBtnText,
                        deliveryOption === 'camp' && styles.delBtnTextActive,
                      ]}
                    >
                      Deliver to Bush Camp
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.delBtn, deliveryOption === 'hotel' && styles.delBtnActive]}
                    onPress={() => setDeliveryOption('hotel')}
                  >
                    <Ionicons
                      name="bed-outline"
                      size={16}
                      color={deliveryOption === 'hotel' ? AmberPlainsColors.gold : AmberPlainsColors.sage}
                    />
                    <Text
                      style={[
                        styles.delBtnText,
                        deliveryOption === 'hotel' && styles.delBtnTextActive,
                      ]}
                    >
                      Mombasa Hotel Reception
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.sheetFooter}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalVal}>${totalPriceUsd} USD</Text>
              </View>
              <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                <Text style={styles.checkoutBtnText}>Complete Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AmberPlainsColors.night,
  },
  heroBanner: {
    padding: 20,
    backgroundColor: AmberPlainsColors.forest,
    borderBottomWidth: 1,
    borderBottomColor: AmberPlainsColors.border,
  },
  heroSubtitle: {
    color: AmberPlainsColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 4,
  },
  heroDesc: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: AmberPlainsColors.forest,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
  },
  catChipActive: {
    backgroundColor: AmberPlainsColors.gold,
    borderColor: AmberPlainsColors.gold,
  },
  catChipText: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  catChipTextActive: {
    color: AmberPlainsColors.night,
    fontWeight: '700',
  },
  productGrid: {
    paddingHorizontal: 16,
    gap: 16,
  },
  productCard: {
    backgroundColor: AmberPlainsColors.forest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productBody: {
    padding: 14,
  },
  productCategory: {
    color: AmberPlainsColors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  productName: {
    color: AmberPlainsColors.sand,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 4,
  },
  productPrice: {
    color: AmberPlainsColors.goldLight,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  productDesc: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  addCartBtn: {
    backgroundColor: AmberPlainsColors.gold,
    borderRadius: 6,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addCartBtnText: {
    color: AmberPlainsColors.night,
    fontWeight: '700',
    fontSize: 12,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: AmberPlainsColors.gold,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartCountCircle: {
    backgroundColor: AmberPlainsColors.night,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: AmberPlainsColors.sand,
    fontSize: 11,
    fontWeight: '800',
  },
  floatingCartLabel: {
    color: AmberPlainsColors.night,
    fontWeight: '800',
    fontSize: 13,
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  floatingCartTotal: {
    color: AmberPlainsColors.night,
    fontWeight: '800',
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  cartSheet: {
    backgroundColor: AmberPlainsColors.forest,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: AmberPlainsColors.borderLight,
    maxHeight: '80%',
    padding: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 16,
    fontWeight: '700',
  },
  cartList: {
    marginBottom: 16,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AmberPlainsColors.border,
  },
  cartThumb: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  cartItemName: {
    color: AmberPlainsColors.sand,
    fontSize: 13,
    fontWeight: '700',
  },
  cartItemSize: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
  },
  cartItemPrice: {
    color: AmberPlainsColors.gold,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AmberPlainsColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
  },
  qtyVal: {
    color: AmberPlainsColors.sand,
    fontSize: 13,
    fontWeight: '700',
  },
  deliverySection: {
    marginTop: 16,
    gap: 8,
  },
  deliveryTitle: {
    color: AmberPlainsColors.sand,
    fontSize: 12,
    fontWeight: '700',
  },
  deliveryOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  delBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AmberPlainsColors.border,
    alignItems: 'center',
    gap: 4,
    backgroundColor: AmberPlainsColors.surface,
  },
  delBtnActive: {
    borderColor: AmberPlainsColors.gold,
    backgroundColor: AmberPlainsColors.forest,
  },
  delBtnText: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  delBtnTextActive: {
    color: AmberPlainsColors.sand,
    fontWeight: '700',
  },
  sheetFooter: {
    borderTopWidth: 1,
    borderTopColor: AmberPlainsColors.border,
    paddingTop: 14,
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: AmberPlainsColors.sandMuted,
    fontSize: 13,
  },
  totalVal: {
    color: AmberPlainsColors.gold,
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutBtn: {
    backgroundColor: AmberPlainsColors.gold,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: AmberPlainsColors.night,
    fontWeight: '800',
    fontSize: 14,
  },
});

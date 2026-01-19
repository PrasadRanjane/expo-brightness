import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';

interface BrightnessInfoProps {
  appBrightness: number;
  systemBrightness: number;
  autoBrightness: boolean;
}

export const BrightnessInfo: React.FC<BrightnessInfoProps> = ({
  appBrightness,
  systemBrightness,
  autoBrightness,
}) => {
  const getBrightnessLevel = (value: number): string => {
    if (value >= 0.7) return 'High';
    if (value >= 0.4) return 'Medium';
    if (value >= 0.1) return 'Low';
    return 'Very Low';
  };

  const getBrightnessColor = (value: number): string => {
    if (value >= 0.7) return Colors.brightnessHigh;
    if (value >= 0.4) return Colors.brightnessMedium;
    return Colors.brightnessLow;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="info" size={24} color={Colors.info} />
        <Text style={styles.title}>Brightness Information</Text>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons name="phone-android" size={20} color={Colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>App Brightness</Text>
            <View style={styles.infoValueRow}>
              <Text style={[styles.infoValue, { color: getBrightnessColor(appBrightness) }]}>
                {Math.round(appBrightness * 100)}%
              </Text>
              <Text style={styles.infoLevel}>{getBrightnessLevel(appBrightness)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons name="settings-brightness" size={20} color={Colors.secondary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>System Brightness</Text>
            <View style={styles.infoValueRow}>
              <Text style={[styles.infoValue, { color: getBrightnessColor(systemBrightness) }]}>
                {Math.round(systemBrightness * 100)}%
              </Text>
              <Text style={styles.infoLevel}>{getBrightnessLevel(systemBrightness)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons 
              name={autoBrightness ? "brightness-auto" : "brightness-6"} 
              size={20} 
              color={autoBrightness ? Colors.success : Colors.textSecondary} 
            />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Auto Brightness</Text>
            <Text style={[styles.infoStatus, { color: autoBrightness ? Colors.success : Colors.textSecondary }]}>
              {autoBrightness ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  infoLevel: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  infoStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
});

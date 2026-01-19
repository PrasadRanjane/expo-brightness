import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Slider } from '@react-native-community/slider';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';

interface BrightnessSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;
  label: string;
  icon: string;
}

export const BrightnessSlider: React.FC<BrightnessSliderProps> = ({
  value,
  onValueChange,
  onSlidingComplete,
  disabled = false,
  label,
  icon,
}) => {
  const percentage = Math.round(value * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon as any} size={24} color={Colors.primary} />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
      </View>
      
      <View style={styles.sliderContainer}>
        <MaterialIcons 
          name="brightness-2" 
          size={20} 
          color={disabled ? Colors.textTertiary : Colors.brightnessLow} 
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={value}
          onValueChange={onValueChange}
          onSlidingComplete={onSlidingComplete}
          disabled={disabled}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Platform.OS === 'android' ? Colors.primary : undefined}
        />
        <MaterialIcons 
          name="brightness-7" 
          size={20} 
          color={disabled ? Colors.textTertiary : Colors.brightnessHigh} 
        />
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
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  percentage: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 40,
  },
});

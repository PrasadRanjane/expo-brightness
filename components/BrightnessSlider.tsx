import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, Animated } from 'react-native';
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
  const [sliderWidth, setSliderWidth] = useState(0);
  const pan = React.useRef(new Animated.Value(value * 100)).current;

  React.useEffect(() => {
    Animated.timing(pan, {
      toValue: value * 100,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [value, pan]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        if (disabled || sliderWidth === 0) return;
        const locationX = evt.nativeEvent.locationX;
        const newValue = Math.max(0, Math.min(100, (locationX / sliderWidth) * 100));
        pan.setValue(newValue);
        onValueChange(newValue / 100);
      },
      onPanResponderMove: (evt) => {
        if (disabled || sliderWidth === 0) return;
        const locationX = evt.nativeEvent.locationX;
        const newValue = Math.max(0, Math.min(100, (locationX / sliderWidth) * 100));
        pan.setValue(newValue);
        onValueChange(newValue / 100);
      },
      onPanResponderRelease: () => {
        if (onSlidingComplete) {
          onSlidingComplete(value);
        }
      },
    })
  ).current;

  const percentage = Math.round(value * 100);
  const thumbPosition = value * 100;

  const handlePress = (newValue: number) => {
    if (disabled) return;
    onValueChange(newValue);
    if (onSlidingComplete) {
      onSlidingComplete(newValue);
    }
  };

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
        <View
          style={styles.sliderTrack}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setSliderWidth(width);
          }}
          {...panResponder.panHandlers}
        >
          <View style={[styles.track, disabled && styles.trackDisabled]} />
          <Animated.View
            style={[
              styles.trackFill,
              {
                width: `${thumbPosition}%`,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
          />
          <TouchableOpacity
            style={[
              styles.thumb,
              {
                left: `${thumbPosition}%`,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
            disabled={disabled}
            activeOpacity={0.8}
          />
        </View>
        <MaterialIcons 
          name="brightness-7" 
          size={20} 
          color={disabled ? Colors.textTertiary : Colors.brightnessHigh} 
        />
      </View>

      <View style={styles.quickButtons}>
        {[0, 0.25, 0.5, 0.75, 1].map((quickValue) => (
          <TouchableOpacity
            key={quickValue}
            style={[
              styles.quickButton,
              Math.abs(value - quickValue) < 0.05 && styles.quickButtonActive,
              disabled && styles.quickButtonDisabled,
            ]}
            onPress={() => handlePress(quickValue)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.quickButtonText,
                Math.abs(value - quickValue) < 0.05 && styles.quickButtonTextActive,
              ]}
            >
              {Math.round(quickValue * 100)}%
            </Text>
          </TouchableOpacity>
        ))}
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
    marginBottom: 12,
  },
  sliderTrack: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  trackDisabled: {
    opacity: 0.5,
  },
  trackFill: {
    position: 'absolute',
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    left: 0,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    marginLeft: -10,
    borderWidth: 3,
    borderColor: Colors.background,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  quickButtonActive: {
    backgroundColor: `${Colors.primary}20`,
    borderColor: Colors.primary,
  },
  quickButtonDisabled: {
    opacity: 0.5,
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  quickButtonTextActive: {
    color: Colors.primary,
  },
});

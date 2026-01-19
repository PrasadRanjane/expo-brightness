import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';

interface BrightnessVisualizerProps {
  brightness: number;
  label: string;
}

export const BrightnessVisualizer: React.FC<BrightnessVisualizerProps> = ({
  brightness,
  label,
}) => {
  const scaleAnim = useRef(new Animated.Value(brightness)).current;
  const opacityAnim = useRef(new Animated.Value(brightness)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: brightness,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: brightness,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [brightness, scaleAnim, opacityAnim]);

  const percentage = Math.round(brightness * 100);
  const glowOpacity = brightness * 0.5;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.visualizerContainer}>
        <Animated.View
          style={[
            styles.sunContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowOpacity,
              },
            ]}
          />
          <MaterialIcons name="wb-sunny" size={80} color={Colors.primary} />
        </Animated.View>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentage}>{percentage}</Text>
          <Text style={styles.percentageUnit}>%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    fontWeight: '500',
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    position: 'relative',
  },
  sunContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    position: 'absolute',
  },
  glow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 140,
  },
  percentage: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.primary,
  },
  percentageUnit: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});

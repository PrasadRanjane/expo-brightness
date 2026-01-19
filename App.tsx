import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Brightness from 'expo-brightness';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BrightnessSlider } from './components/BrightnessSlider';
import { BrightnessInfo } from './components/BrightnessInfo';
import { BrightnessVisualizer } from './components/BrightnessVisualizer';
import { Colors } from './constants/Colors';

export default function App() {
  const [appBrightness, setAppBrightness] = useState<number>(1);
  const [systemBrightness, setSystemBrightness] = useState<number>(1);
  const [autoBrightness, setAutoBrightness] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadBrightnessInfo();
    setupBrightnessListener();

    return () => {
      Brightness.removeBrightnessListener();
    };
  }, []);

  const loadBrightnessInfo = async () => {
    try {
      setIsLoading(true);

      const appLevel = await Brightness.getBrightnessAsync();
      setAppBrightness(appLevel);

      const systemLevel = await Brightness.getSystemBrightnessAsync();
      setSystemBrightness(systemLevel);

      const autoEnabled = await Brightness.isAutoBrightnessEnabledAsync();
      setAutoBrightness(autoEnabled);

      if (Platform.OS === 'android') {
        const { status } = await Brightness.getPermissionsAsync();
        setHasPermission(status === 'granted');
      } else {
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Brightness API error:', error);
      Alert.alert('Error', 'Failed to load brightness information');
    } finally {
      setIsLoading(false);
    }
  };

  const setupBrightnessListener = () => {
    Brightness.addBrightnessListener(({ brightness }) => {
      setAppBrightness(brightness);
    });
  };

  const requestSystemPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'System brightness control requires permission. Please grant it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'android') {
                  Brightness.requestPermissionsAsync();
                }
              },
            },
          ]
        );
        return false;
      }
      setHasPermission(true);
      return true;
    }
    return true;
  };

  const handleAppBrightnessChange = async (value: number) => {
    try {
      await Brightness.setBrightnessAsync(value);
      setAppBrightness(value);
    } catch (error) {
      console.error('Failed to set app brightness:', error);
      Alert.alert('Error', 'Failed to set app brightness');
    }
  };

  const handleSystemBrightnessChange = async (value: number) => {
    try {
      const hasPerm = await requestSystemPermission();
      if (!hasPerm) return;

      await Brightness.setSystemBrightnessAsync(value);
      setSystemBrightness(value);
    } catch (error) {
      console.error('Failed to set system brightness:', error);
      Alert.alert('Error', 'Failed to set system brightness');
    }
  };

  const handleResetBrightness = async () => {
    try {
      await Brightness.setBrightnessAsync(1);
      setAppBrightness(1);

      const hasPerm = await requestSystemPermission();
      if (hasPerm) {
        await Brightness.setSystemBrightnessAsync(1);
        setSystemBrightness(1);
      }
    } catch (error) {
      console.error('Failed to reset brightness:', error);
      Alert.alert('Error', 'Failed to reset brightness');
    }
  };

  const handleRefresh = async () => {
    await loadBrightnessInfo();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="brightness-6" size={32} color={Colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Brightness Control</Text>
            <Text style={styles.headerSubtitle}>Screen brightness management</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <MaterialIcons name="refresh" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BrightnessVisualizer brightness={appBrightness} label="App Brightness" />

        <BrightnessSlider
          value={appBrightness}
          onValueChange={handleAppBrightnessChange}
          label="App Brightness"
          icon="phone-android"
        />

        <BrightnessSlider
          value={systemBrightness}
          onValueChange={handleSystemBrightnessChange}
          label="System Brightness"
          icon="settings-brightness"
          disabled={!hasPermission && Platform.OS === 'android'}
        />

        {!hasPermission && Platform.OS === 'android' && (
          <View style={styles.permissionWarning}>
            <MaterialIcons name="warning" size={24} color={Colors.warning} />
            <View style={styles.permissionTextContainer}>
              <Text style={styles.permissionTitle}>Permission Required</Text>
              <Text style={styles.permissionText}>
                System brightness control requires permission. Tap the slider to request it.
              </Text>
            </View>
          </View>
        )}

        <BrightnessInfo
          appBrightness={appBrightness}
          systemBrightness={systemBrightness}
          autoBrightness={autoBrightness}
        />

        <TouchableOpacity style={styles.resetButton} onPress={handleResetBrightness}>
          <MaterialIcons name="restore" size={20} color={Colors.text} />
          <Text style={styles.resetButtonText}>Reset to Maximum</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={24} color={Colors.info} />
            <Text style={styles.infoTitle}>About Brightness</Text>
          </View>
          <Text style={styles.infoText}>
            App brightness controls only your app's display, while system brightness affects
            the entire device. Auto brightness adjusts based on ambient light conditions.
          </Text>
          {Platform.OS === 'web' && (
            <View style={styles.webWarning}>
              <MaterialIcons name="warning" size={20} color={Colors.warning} />
              <Text style={styles.webWarningText}>
                Brightness API requires a physical device. Test on iOS or Android for full
                functionality.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: `${Colors.warning}15`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.warning,
    marginBottom: 4,
  },
  permissionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  webWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: `${Colors.warning}15`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  webWarningText: {
    flex: 1,
    fontSize: 13,
    color: Colors.warning,
    lineHeight: 18,
    fontWeight: '500',
  },
});

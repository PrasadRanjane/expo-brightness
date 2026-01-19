# Expo Brightness - Screen Brightness Control

A professional React Native app demonstrating screen brightness control using `expo-brightness`. Control both app-level and system-level brightness with a beautiful, intuitive interface.

## Features

- ✅ **App Brightness Control** - Adjust brightness within your app
- ✅ **System Brightness Control** - Control device-wide brightness (with permissions)
- ✅ **Auto Brightness Detection** - Check if auto brightness is enabled
- ✅ **Real-time Updates** - Live brightness monitoring with listeners
- ✅ **Visual Feedback** - Animated brightness visualizer
- ✅ **Permission Handling** - Proper Android permission requests
- ✅ **Modern UI** - Beautiful dark theme with smooth animations

## Installation

```bash
npx expo install expo-brightness @react-native-community/slider @expo/vector-icons
```

## Usage

### Basic Brightness Control

```tsx
import * as Brightness from 'expo-brightness';

const brightness = await Brightness.getBrightnessAsync();
await Brightness.setBrightnessAsync(0.5);
```

### System Brightness Control

```tsx
const { status } = await Brightness.requestPermissionsAsync();
if (status === 'granted') {
  await Brightness.setSystemBrightnessAsync(0.5);
}
```

### Brightness Listeners

```tsx
const subscription = Brightness.addBrightnessListener(({ brightness }) => {
  console.log('Brightness changed:', brightness);
});

subscription.remove();
```

### Auto Brightness Check

```tsx
const isAutoEnabled = await Brightness.isAutoBrightnessEnabledAsync();
```

## API Reference

### Methods

- `getBrightnessAsync()` - Get current app brightness (0-1)
- `setBrightnessAsync(value)` - Set app brightness (0-1)
- `getSystemBrightnessAsync()` - Get system brightness (0-1)
- `setSystemBrightnessAsync(value)` - Set system brightness (0-1)
- `isAutoBrightnessEnabledAsync()` - Check if auto brightness is enabled
- `requestPermissionsAsync()` - Request system brightness permission (Android)
- `getPermissionsAsync()` - Get current permission status (Android)
- `addBrightnessListener(callback)` - Listen to brightness changes
- `removeBrightnessListener()` - Remove brightness listener

## Components

### BrightnessSlider

A customizable slider component for brightness control.

```tsx
<BrightnessSlider
  value={brightness}
  onValueChange={handleChange}
  label="App Brightness"
  icon="phone-android"
/>
```

### BrightnessInfo

Display current brightness information and status.

```tsx
<BrightnessInfo
  appBrightness={appBrightness}
  systemBrightness={systemBrightness}
  autoBrightness={autoBrightness}
/>
```

### BrightnessVisualizer

Animated visual representation of brightness level.

```tsx
<BrightnessVisualizer
  brightness={brightness}
  label="App Brightness"
/>
```

## Platform Considerations

### iOS
- System brightness control works without special permissions
- Auto brightness detection is available
- Test on physical device for best results

### Android
- System brightness requires `WRITE_SETTINGS` permission
- Permission must be requested at runtime
- May require user to grant permission in system settings

### Web
- Brightness API is not available on web
- App will show warning message

## Use Cases

- **Reading Apps** - Adjust brightness for comfortable reading
- **Media Apps** - Control brightness for video playback
- **Accessibility** - Help users with vision needs
- **Night Mode** - Implement custom dark mode features
- **Battery Saving** - Reduce brightness to save battery

## Try It

[Open in Expo Snack](https://snack.expo.dev/@prasadranjane/expo-brightness)

## License

MIT

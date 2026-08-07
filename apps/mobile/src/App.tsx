import React from 'react';
import { useColorScheme, View } from 'react-native';
import { VariableContextProvider } from 'react-native-css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './state/app-context';
import { AppShell } from './components/AppShell';
import { darkTheme, lightTheme } from './ui/theme';

export default function App() {
  const scheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <VariableContextProvider
          value={scheme === 'dark' ? darkTheme : lightTheme}
        >
          <AppProvider>
            <AppShell />
          </AppProvider>
        </VariableContextProvider>
      </View>
    </SafeAreaProvider>
  );
}

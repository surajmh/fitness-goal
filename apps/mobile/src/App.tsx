import React from 'react';
import { useColorScheme, View } from 'react-native';
import { VariableContextProvider } from 'react-native-css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@fitnessgoal/data-access/workout';
import { AppShell } from '@fitnessgoal/feature-shell/app-shell';
import { darkTheme, lightTheme } from '@fitnessgoal/shared/ui';

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

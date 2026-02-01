import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { Stack } from 'expo-router';
import { sessionContext } from '@/context/session-context';
import {View, Text} from 'react-native';


import { useAuth } from '@/context/useAuth';

export default function RootLayout() {
    const { session, loading } = useAuth()

    if (loading) {
        return <View><Text> Loading... </Text></View>;
    }

    return (
        <sessionContext.Provider value={{ session }}>
            <GluestackUIProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                </Stack>
            </GluestackUIProvider>
        </sessionContext.Provider>
    );
}

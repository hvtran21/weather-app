import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WeatherResponse } from './index';
import { weatherAPI } from './index';
import { WeatherContext } from './index';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error("Permission denied");
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync();
            const res = await weatherAPI(coords.latitude, coords.longitude);
            if (res !== undefined) {
                setWeatherData(res);
            }
        };

        fetchData();
    }, []);

    if (!loaded) {
        return null;
    }

    return (
        <WeatherContext.Provider value={weatherData}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="sevendays" options={{ headerShown: false }} />
            </Stack>
        </WeatherContext.Provider>
    );
}

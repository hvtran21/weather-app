import { View, Text, ScrollView, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts } from 'expo-font';
import {
    faLocationDot,
    faSun,
    faCloud,
    faWind,
    faDroplet,
    faUmbrella,
    faSmog,
    faCloudShowersHeavy,
    faCloudSun,
    faBolt,
    faCloudMoonRain,
    faCaretRight,
    faCaretLeft,
    faCloudRain,
    faSnowflake,
    faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, createContext, useContext } from 'react';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';



const BASE_URL = 'http://192.168.0.207:8000';

const stateAbbreviations: Record<string, string> = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
};

type WeatherInfo = {
    label: string;
    icon: IconDefinition;
    color: string;
};

export const weatherCodeMap: Record<number, WeatherInfo> = {
    0:  { label: "Clear", icon: faSun, color: "#facc15" },
    1:  { label: "Sunny", icon: faCloudSun, color: "#fde68a" },
    2:  { label: "Cloudy", icon: faCloudSun, color: "#cbd5e1" },
    3:  { label: "Overcast", icon: faCloud, color: "#94a3b8" },

    45: { label: "Fog", icon: faSmog, color: "#a3a3a3" },
    48: { label: "Rime", icon: faSmog, color: "#d4d4d8" },

    51: { label: "Drizzle", icon: faCloudRain, color: "#60a5fa" },
    53: { label: "Drizzle", icon: faCloudRain, color: "#3b82f6" },
    55: { label: "Drizzle", icon: faCloudRain, color: "#2563eb" },

    56: { label: "Freeze", icon: faCloudRain, color: "#38bdf8" },
    57: { label: "Freeze", icon: faCloudRain, color: "#0ea5e9" },

    61: { label: "Rain", icon: faCloudShowersHeavy, color: "#60a5fa" },
    63: { label: "Rain", icon: faCloudShowersHeavy, color: "#3b82f6" },
    65: { label: "Rain", icon: faCloudShowersHeavy, color: "#1d4ed8" },

    66: { label: "Ice", icon: faCloudShowersHeavy, color: "#7dd3fc" },
    67: { label: "Ice", icon: faCloudShowersHeavy, color: "#38bdf8" },

    71: { label: "Snow", icon: faSnowflake, color: "#e0f2fe" },
    73: { label: "Snow", icon: faSnowflake, color: "#bae6fd" },
    75: { label: "Snow", icon: faSnowflake, color: "#7dd3fc" },

    77: { label: "Flakes", icon: faSnowflake, color: "#a5f3fc" },

    80: { label: "Shower", icon: faCloudShowersHeavy, color: "#60a5fa" },
    81: { label: "Shower", icon: faCloudShowersHeavy, color: "#3b82f6" },
    82: { label: "Shower", icon: faCloudShowersHeavy, color: "#1e40af" },

    85: { label: "Flurry", icon: faSnowflake, color: "#dbeafe" },
    86: { label: "Flurry", icon: faSnowflake, color: "#bfdbfe" },

    95: { label: "Storm", icon: faBolt, color: "#facc15" },
    96: { label: "Hail", icon: faBolt, color: "#eab308" },
    99: { label: "Hail", icon: faBolt, color: "#ca8a04" } 
};

const formatHour = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
        hour: 'numeric',
        hour12: true
    });
};

export type TodayWeather = {
    today_temperature_2m: number | undefined;
    today_precipitation: number | undefined;
    today_wind_speed_10m: number | undefined;
    today_relative_humidity_2m: number | undefined;
    precipitation_probability_max: number | undefined,
    today_apparent_temperature: number | undefined;
    today_weather_code: number | undefined;
};

export type HourlyWeather = {
    date: string;
    temperature_2m: number;
    precipitation: number;
    uv_index: number;
    uv_index_clear_sky: number;
    is_day: number;
    precipitation_probability: number;
    visibility: number;
    wind_speed_10m: number;
    weather_code?: number; // Add this if you request it
    color: string
};

export type DailyWeather = {
    date: string; // ISO format
    temperature_2m_max: number;
    temperature_2m_min: number;
    uv_index_max: number;
    sunset: string;  // If you convert to ISO; otherwise, number (UNIX)
    sunrise: string; // If you convert to ISO; otherwise, number (UNIX)
    rain_sum: number;
    weather_code?: number; // Optional if not included
};

export type WeatherResponse = {
    today: TodayWeather;
    hourly: HourlyWeather[];
    daily: DailyWeather[];
};

type HourlyCardProp = {
    temp: number;
    icon: IconDefinition;
    time: string;
    color: string;
};


const HourlyCard = ({ temp, icon, time, color }: HourlyCardProp) => {
    return (
        <View
            style={{
                backgroundColor: '#2A2A2A',
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderRadius: 18,
                alignItems: 'center',
                width: 83,
                height: 100,
                marginRight: 12,
                shadowColor: 'transparent',
                shadowOffset: { width: 0, height: 4 },
                borderWidth: StyleSheet.hairlineWidth,
                flexDirection: 'column',
                justifyContent: 'space-evenly'

            }}
        >
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>{temp}°</Text>
            <FontAwesomeIcon icon={icon} size={20} color={color} />
            <Text style={{ color: 'white', marginTop: 4, fontSize: 12 }}>{time}</Text>
        </View>
    );
};

type HourlyDataProps = {
    hourlyData: HourlyWeather[] | undefined
}

export const HourlyCards = ({ hourlyData }: HourlyDataProps)=> {

    const data = hourlyData
    if (!Array.isArray(data)) {
        return;
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 16 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
        >
            {data.map((item, idx) => (
                
                <HourlyCard
                    key={idx}
                    temp={Math.round(item.temperature_2m)}
                    icon={weatherCodeMap[item.weather_code ?? 0].icon ?? faQuestion}
                    time={formatHour(item.date)}
                    color={weatherCodeMap[item.weather_code ?? 0].color ?? 'white'}
                />
            ))}
        </ScrollView>
    );
};

type WeatherSpecProp = {
    icon: IconDefinition,
    value: string,
    name: string,
    color: string
}

const WeatherSpec = ({icon, value, name, color}: WeatherSpecProp) => {
    return (
        <View style={iconStyle.icon_container}>
            <FontAwesomeIcon icon={icon} style={iconStyle.icon} color={color} />
            <Text style={iconStyle.icon_value}>{value}</Text>
            <Text style={iconStyle.icon_name}>{name}</Text>
        </View>
    )
}

const CurrentWeatherSpecs = ({
    today_wind_speed_10m,
    today_relative_humidity_2m,
    precipitation_probability_max
    }: TodayWeather) => {
    const wind = today_wind_speed_10m ?? 0
    const humidity = today_relative_humidity_2m ?? 0
    const precipprob = precipitation_probability_max ?? 0

    return (
        <View
            style={{
                width: '90%',
                backgroundColor: '#222222',
                padding: 16,
                borderRadius: 12,
                marginBottom: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
            }}
        >
            <View style={iconStyle.icon_container}>
                <FontAwesomeIcon icon={faWind} style={iconStyle.icon} color="#87CEFA" />
                <Text style={iconStyle.icon_value}>{Math.round(wind)} mp/h</Text>
                <Text style={iconStyle.icon_name}>Wind</Text>
            </View>

            <View
                style={{
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: 'white',
                    opacity: 0.2,
                }}
            ></View>

            <View style={iconStyle.icon_container}>
                <FontAwesomeIcon icon={faDroplet} style={iconStyle.icon} color="#5EEAD4" />
                <Text style={iconStyle.icon_value}>{Math.round(humidity)}%</Text>
                <Text style={iconStyle.icon_name}>Humidity</Text>
            </View>

            <View
                style={{
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: 'white',
                    opacity: 0.2,
                }}
            ></View>

            <View style={iconStyle.icon_container}>
                <FontAwesomeIcon icon={faUmbrella} style={iconStyle.icon} color="#A5B4FC" />
                <Text style={iconStyle.icon_value}>{Math.round(precipprob)}%</Text>
                <Text style={iconStyle.icon_name}>Rain</Text>
            </View>
        </View>

    )
}

const getCityAndState = async (latitude: number, longitude: number) => {
    try {
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

        if (geocode.length > 0) {
            const { city, region } = geocode[0];
            if (city !== null && region !== null) {
                const stateAbbreviation = stateAbbreviations[region] || region;
                return { city, state: stateAbbreviation };
            } else {
                throw new Error('Error obtaining state and city data.');
            }
        }
    } catch (err) {
        console.error("Error in reverse geocoding", err);
        return null;
    }
};


export async function weatherAPI(latitude: number, longitude: number) {
    var data = null;
    try {
        const response = await fetch(`${BASE_URL}/weather`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
            })

        })

        if (!response.ok) {
            throw new Error(`Error occurred contacting API, got code: ${response.status}`)
        }

        data = await response.json() as WeatherResponse;
        return data;

    } catch (error) {
        console.error(`Error ocurred: ${error}`);
    }

}

export const WeatherContext = createContext<WeatherResponse | null>(null)

export const useWeather = () => useContext(WeatherContext)

export default function Home() {
    const [fontsLoaded] = useFonts({
        'Manrope-Regular': require('../assets/fonts/Manrope/static/Manrope-Regular.ttf'),
        'Manrope-Bold': require('../assets/fonts/Manrope/static/Manrope-Bold.ttf'),
        'Manrope-ExtraBold': require('../assets/fonts/Manrope/static/Manrope-ExtraBold.ttf'),
        'Manrope-Light': require('../assets/fonts/Manrope/static/Manrope-Light.ttf'),
        'Manrope-ExtraLight': require('../assets/fonts/Manrope/static/Manrope-ExtraLight.ttf'),
    });

    const data = useWeather();
    const [address, setAddress] = useState<{ city: string; state: string }>();

    useEffect(() => {
        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission denied');
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync();
            const resolvedAddress = await getCityAndState(coords.latitude, coords.longitude);
            if (resolvedAddress) {
                setAddress(resolvedAddress);
            }
        };

        getLocation();
    }, []);

    if (!fontsLoaded || !data) return null;

    const code = data.today.today_weather_code ?? 0;
    const weatherInfo = weatherCodeMap[code];

    return (
        <>
            <StatusBar style="light" />
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: '#141414',
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    alignItems: 'center',
                }}
                edges={['top', 'left', 'right', 'bottom']}
            >
                {/* Header */}
                <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 16 }}>
                    <FontAwesomeIcon icon={faLocationDot} size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.headerText}>
                        {address?.city ?? 'San Francisco'}, {address?.state ?? 'CA'}
                    </Text>
                </View>

                {/* Weather Icon + Temp */}
                <View style={{ alignItems: 'center', marginVertical: 25 }}>
                    <FontAwesomeIcon
                        icon={weatherInfo?.icon ?? faQuestion}
                        size={180}
                        color={weatherInfo?.color ?? 'white'}
                        style={styles.weatherIcon}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.tempText}>{Math.round(data.today.today_temperature_2m ?? 0)}</Text>
                        <Text style={styles.degreeSymbol}>°</Text>
                    </View>
                    <Text style={styles.weatherLabel}>{weatherInfo?.label ?? ''}</Text>
                </View>

                {/* Weather Specs */}
                <CurrentWeatherSpecs
                    today_wind_speed_10m={data.today.today_wind_speed_10m}
                    today_relative_humidity_2m={data.today.today_relative_humidity_2m}
                    precipitation_probability_max={data.today.precipitation_probability_max}
                    today_temperature_2m={undefined}
                    today_precipitation={undefined}
                    today_apparent_temperature={undefined}
                    today_weather_code={undefined}
                />

                {/* Header Row */}
                <View style={styles.todayRow}>
                    <Text style={styles.todayText}>Today</Text>
                    <TouchableOpacity onPress={() => router.push('/sevendays')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.linkText}>Next week</Text>
                            <FontAwesomeIcon icon={faCaretRight} color="white" style={{ opacity: 0.8, marginTop: 3 }} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Hourly Cards */}
                <View style={{ width: '100%' }}>
                    <HourlyCards hourlyData={data.hourly} />
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 26,
        color: 'white',
        opacity: 0.8,
        fontFamily: 'Manrope-Regular',
    },
    tempText: {
        fontSize: 124,
        color: 'white',
        fontFamily: 'Manrope-ExtraBold',
    },
    degreeSymbol: {
        color: 'white',
        fontFamily: 'Manrope-Regular',
        fontSize: 40,
        position: 'absolute',
        top: 27,
        right: -18,
        opacity: 0.8,
    },
    weatherIcon: {
        shadowColor: '#ffffff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    weatherLabel: {
        fontFamily: 'ManRope-Regular',
        color: 'white',
        fontSize: 24,
    },
    todayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        width: '90%',
        marginLeft: 10,
    },
    todayText: {
        color: 'white',
        opacity: 0.8,
        fontFamily: 'Manrope-Regular',
        fontSize: 20,
    },
    linkText: {
        color: 'white',
        opacity: 0.8,
        fontFamily: 'Manrope-Regular',
        fontSize: 16,
    },
});

const iconStyle = StyleSheet.create({
    icon: {
        color: 'white',
        opacity: 0.8,
    },

    icon_container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '30%',
        flex: 1,
    },

    icon_name: {
        fontFamily: 'Manrope-ExtraLight',
        color: 'white',
        opacity: 0.8,
    },

    icon_value: {
        fontFamily: 'Manrope-Bold',
        color: 'white',
        opacity: 0.8,
        marginTop: 5,
    },
});

export {iconStyle, WeatherSpec, WeatherSpecProp};
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
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const BASE_URL = 'http://192.168.0.15:8000';

type HourlyCardProp = {
    temp: number;
    icon: IconDefinition;
    time: string;
    color: string;
};

async function weatherAPI() {}

const HourlyCard = ({ temp, icon, time, color }: HourlyCardProp) => {
    return (
        <View
            style={{
                backgroundColor: '#2A2A2A',
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderRadius: 20,
                alignItems: 'center',
                width: 64,
                marginRight: 12,
                shadowColor: 'transparent',
                shadowOffset: { width: 0, height: 4 },
                borderWidth: StyleSheet.hairlineWidth,
            }}
        >
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>{temp}°</Text>
            <FontAwesomeIcon icon={icon} size={20} color={color} />
            <Text style={{ color: 'white', marginTop: 4, fontSize: 12 }}>{time}</Text>
        </View>
    );
};

export const HourlyCards = () => {
    const data = [
        { temp: 23, icon: faCloudShowersHeavy, time: '10:00', color: '#60A5FA' },
        { temp: 21, icon: faBolt, time: '11:00', color: '#FACC15', selected: true },
        { temp: 22, icon: faCloudShowersHeavy, time: '12:00', color: '#60A5FA' },
        { temp: 19, icon: faCloudMoonRain, time: '01:00', color: '#D1D5DB' },
        { temp: 23, icon: faCloudShowersHeavy, time: '10:00', color: '#60A5FA' },
        { temp: 21, icon: faBolt, time: '11:00', color: '#FACC15', selected: true },
        { temp: 22, icon: faCloudShowersHeavy, time: '12:00', color: '#60A5FA' },
        { temp: 19, icon: faCloudMoonRain, time: '01:00', color: '#D1D5DB' },
        { temp: 23, icon: faCloudShowersHeavy, time: '10:00', color: '#60A5FA' },
        { temp: 21, icon: faBolt, time: '11:00', color: '#FACC15', selected: true },
        { temp: 22, icon: faCloudShowersHeavy, time: '12:00', color: '#60A5FA' },
        { temp: 19, icon: faCloudMoonRain, time: '01:00', color: '#D1D5DB' },
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 16 }}
            contentContainerStyle={{ paddingHorizontal: 24 }}
        >
            {data.map((item, idx) => (
                <HourlyCard
                    key={idx}
                    temp={item.temp}
                    icon={item.icon}
                    time={item.time}
                    color={item.color}
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

const CurrentWeatherSpecs = () => {
    // the input should be data
    // creates an array of WeatherSpec components to render

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
                <Text style={iconStyle.icon_value}>69 mp/h</Text>
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
                <Text style={iconStyle.icon_value}>24%</Text>
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
                <Text style={iconStyle.icon_value}>67%</Text>
                <Text style={iconStyle.icon_name}>Rain</Text>
            </View>
        </View>

    )
}

export default function Home() {
    const [fontsLoaded] = useFonts({
        'Manrope-Regular': require('../assets/fonts/Manrope/static/Manrope-Regular.ttf'),
        'Manrope-Bold': require('../assets/fonts/Manrope/static/Manrope-Bold.ttf'),
        'Manrope-ExtraBold': require('../assets/fonts/Manrope/static/Manrope-ExtraBold.ttf'),
        'Manrope-Light': require('../assets/fonts/Manrope/static/Manrope-Light.ttf'),
        'Manrope-ExtraLight': require('../assets/fonts/Manrope/static/Manrope-ExtraLight.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
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
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{ margin: 5 }}>
                        <FontAwesomeIcon icon={faLocationDot} size={20} color="white" />
                    </View>
                    <Text
                        style={{
                            fontSize: 26,
                            color: 'white',
                            opacity: 0.8,
                            fontFamily: 'Manrope-Regular',
                            shadowColor: '#ffffff',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 5,
                        }}
                    >
                        Boston, MA
                    </Text>
                </View>

                {/* Current Weather */}
                <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 25,
                    }}
                >
                    <View
                        style={{
                            shadowColor: '#ffffff',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 20,
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faCloud}
                            size={200}
                            color="white"
                            style={{ opacity: 0.8 }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 124,
                                color: 'white',
                                fontWeight: 'bold',
                                fontFamily: 'Manrope-ExtraBold',
                                shadowColor: '#ffffff',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.15,
                                shadowRadius: 5,
                            }}
                        >
                            72
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'Manrope-Regular',
                                fontSize: 40,
                                position: 'absolute',
                                top: 27,
                                right: -18,
                                opacity: 0.8,
                            }}
                        >
                            °
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={{
                                fontFamily: 'ManRope-Regular',
                                color: 'white',
                                fontSize: 24,
                            }}
                        >
                            Cloudy
                        </Text>
                    </View>
                </View>

                <CurrentWeatherSpecs />
                
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignContent: 'center',
                        width: '90%',
                        marginLeft: 10,
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            opacity: 0.8,
                            fontFamily: 'Manrope-Regular',
                            fontSize: 20,
                        }}
                    >
                        Today
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            router.push('/sevendays');
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    opacity: 0.8,
                                    fontFamily: 'Manrope-Regular',
                                    fontSize: 16,
                                }}
                            >
                                7 days
                            </Text>
                            <FontAwesomeIcon
                                icon={faCaretRight}
                                color="white"
                                style={{ opacity: 0.8, marginTop: 3 }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%' }}>
                    <HourlyCards />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

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
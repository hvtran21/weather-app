import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faCaretLeft,
    faSun,
    faDroplet,
    faCalendarWeek,
    faUmbrella,
} from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DailyWeather, useWeather, weatherCodeMap, WeatherSpec, WeatherSpecProp } from './index';

const WeeklyForecast = ({ daily }: { daily: DailyWeather[] }) => {
    const weekDays = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {daily.slice(2).map((item, idx) => {
                const date = new Date(item.date);
                const day = weekDays[date.getUTCDay()];
                const icon = weatherCodeMap[item.weather_code ?? 0].icon;
                const label = weatherCodeMap[item.weather_code ?? 0].label;

                return (
                    <View key={idx} style={styles.dayRow}>
                        <Text style={styles.dayLabel}>{day}</Text>

                        <View style={{ flexDirection: 'row', flex: 1, opacity: 0.8, justifyContent: 'center' }}>
                            <View style={{ alignItems: 'center', marginRight: 8, width: 30 }}>
                                <FontAwesomeIcon icon={icon} color={weatherCodeMap[item.weather_code ?? 0].color} size={17} />
                            </View>
                            <View style={{ width: 65, justifyContent: 'center', flexDirection: 'row' }}>
                                <Text style={{ color: 'white', fontSize: 16, opacity: 0.8 }}>
                                    {label}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.dayTemps}>+{Math.round(item.temperature_2m_max)}°</Text>
                        <Text style={[styles.dayTemps, { opacity: 0.6 }]}>+{Math.round(item.temperature_2m_min)}°</Text>
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default function SevenDay() {
    const data = useWeather();
    const [tomorrow, setTomorrow] = useState<DailyWeather | null>(null);
    const [weatherSpecData, setWeatherSpecData] = useState<WeatherSpecProp[]>([]);

    useEffect(() => {
        if (!data || !data.daily || data.daily.length < 2) return;

        const day = data.daily[1];
        setTomorrow(day);

        const spec: WeatherSpecProp[] = [
            {
                icon: faUmbrella,
                value: `${Math.round(day.rain_sum)} mm`,
                name: 'Rain',
                color: '#A5B4FC',
            },
            {
                icon: faDroplet,
                value: `${Math.round(data.today.today_relative_humidity_2m ?? 0)}%`,
                name: 'Humidity',
                color: '#5EEAD4',
            },
            {
                icon: faSun,
                value: `${Math.round(day.uv_index_max)} UV`,
                name: 'UV Index',
                color: '#FACC15',
            },
        ];
        setWeatherSpecData(spec);
    }, [data]);

    if (!tomorrow) return null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faCaretLeft} color="white" size={18} style={{ opacity: 0.8 }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesomeIcon
                        icon={faCalendarWeek}
                        color="white"
                        size={18}
                        style={{ marginHorizontal: 10, opacity: 0.9 }}
                    />
                    <Text
                        style={{
                            fontFamily: 'Manrope-Regular',
                            color: 'white',
                            fontSize: 24,
                            opacity: 0.8,
                        }}
                    >
                        This week
                    </Text>
                </View>
                <View style={{ width: 18 }} />
            </View>

            {/* Tomorrow's Weather */}
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 10, shadowColor: '#ffffff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 20 }}>
                    <FontAwesomeIcon
                        icon={weatherCodeMap[tomorrow.weather_code ?? 0].icon}
                        color={weatherCodeMap[tomorrow.weather_code ?? 0].color}
                        size={100}
                        style={{ opacity: 0.8 }}
                    />
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', shadowColor: '#ffffff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 20 }}>
                    <Text style={{ color: 'white', opacity: 0.8, fontFamily: 'Manrope-Bold', fontSize: 28 }}>Tomorrow</Text>
                    <View style={{ marginLeft: 35, flexDirection: 'row', alignItems: 'baseline' }}>
                        <Text style={{ color: 'white', opacity: 0.8, fontFamily: 'Manrope-Bold', fontSize: 80 }}>
                            {Math.round(tomorrow.temperature_2m_max)}
                        </Text>
                        <Text style={{ color: 'white', opacity: 0.4, fontFamily: 'Manrope-Reg', fontSize: 50 }}>
                            /{Math.round(tomorrow.temperature_2m_min)}°
                        </Text>
                    </View>
                    <Text style={{ color: 'white', opacity: 0.4, fontFamily: 'Manrope-Regular', fontSize: 18 }}>
                        {weatherCodeMap[tomorrow.weather_code ?? 0].label}
                    </Text>
                </View>
            </View>

            {/* Tomorrow Specs */}
            <View
                style={{
                    width: '90%',
                    backgroundColor: '#222222',
                    padding: 16,
                    borderRadius: 12,
                    marginTop: 10,
                    marginBottom: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    flex: 1,
                    maxHeight: 100,
                }}
            >
                {weatherSpecData.map((item, index) => (
                    <React.Fragment key={index}>
                        <WeatherSpec
                            icon={item.icon}
                            value={item.value}
                            name={item.name}
                            color={item.color}
                        />
                        {index !== weatherSpecData.length - 1 && (
                            <View
                                style={{
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor: 'white',
                                    opacity: 0.2,
                                }}
                            ></View>
                        )}
                    </React.Fragment>
                ))}
            </View>

            {/* 7-Day Forecast */}
            <WeeklyForecast daily={data?.daily ?? []}/>
        </SafeAreaView>
    );
}

const MiniStat = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
    <View style={{ alignItems: 'center', flex: 1 }}>
        <FontAwesomeIcon icon={icon} size={16} color="white" />
        <Text style={{ color: 'white', fontSize: 12 }}>{value}</Text>
        <Text style={{ color: 'white', fontSize: 10, opacity: 0.6 }}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 16,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },


    scrollContent: {
        paddingBottom: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },

    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        flex: 1,
        width: '90%'
    },

    dayLabel: {
        color: 'white',
        width: 100,
        fontFamily: 'Manrope-Regular',
        opacity: 0.8,
        fontSize: 16,
    },

    dayTemps: {
        color: 'white',
        marginLeft: 12,
        fontFamily: 'Manrope-Regular',
        fontSize: 16,

    },

});

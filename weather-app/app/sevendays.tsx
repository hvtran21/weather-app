import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faCaretLeft,
    faCloudShowersHeavy,
    faCloud,
    faBolt,
    faSnowflake,
    faWater,
    faWind,
    faDroplet,
    faCalendarWeek,
    faUmbrella,
} from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WeatherSpec, WeatherSpecProp } from './index';

export default function SevenDay() {
    const weekData = [
        { day: 'Mon', icon: faCloudShowersHeavy, condition: 'Rainy', high: 20, low: 14 },
        { day: 'Tue', icon: faCloudShowersHeavy, condition: 'Rainy', high: 22, low: 16 },
        { day: 'Wed', icon: faCloud, condition: 'Storm', high: 19, low: 13 },
        { day: 'Thu', icon: faSnowflake, condition: 'Slow', high: 18, low: 12 },
        { day: 'Fri', icon: faBolt, condition: 'Thunder', high: 23, low: 19 },
        { day: 'Sat', icon: faCloudShowersHeavy, condition: 'Rainy', high: 25, low: 17 },
        { day: 'Sun', icon: faCloud, condition: 'Storm', high: 21, low: 18 },
    ];

    const weatherSpecData: WeatherSpecProp[] = [
        {icon: faBolt, value: '45%', name: 'Thunder', color: '#FACC15'},
        {icon: faDroplet, value: '24%', name: 'Humidity', color: '#5EEAD4'},
        {icon: faUmbrella, value: '69%', name: 'Rain', color: '#A5B4FC'},
    ]

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

            {/* tomorrows weather information */}
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 10, shadowColor: '#ffffff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 20 }}>
                    <FontAwesomeIcon icon={faCloudShowersHeavy} color='white' size={100} style={{ opacity: 0.8 }}/>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' , shadowColor: '#ffffff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 20}}>
                    <Text style={{ color: 'white', opacity: 0.8, fontFamily: 'Manrope-Bold', fontSize: 28}}>Tomorrow</Text>
                    <View style={{ marginLeft: 35, flexDirection: 'row', alignItems: 'baseline'}}>
                        <Text style={{ color: 'white', opacity: 0.8, fontFamily: 'Manrope-Bold', fontSize: 80}}>20</Text>
                        <Text style={{ color: 'white', opacity: 0.4, fontFamily: 'Manrope-Reg', fontSize: 50}}>/17°</Text>
                    </View>
                    <Text style={{ color: 'white', opacity: 0.4, fontFamily: 'Manrope-Regular', fontSize: 18 }}>Rainy - Cloudy</Text>
                </View>    
            </View>

            <View style={{
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
                maxHeight: 100
                }}>
                {weatherSpecData.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            <WeatherSpec icon={item.icon} value={item.value} name={item.name} color={item.color} />
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
                    )
                })}
            </View>

            {/* 7-Day Forecast */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {weekData.map((item, idx) => (
                    <View key={idx} style={styles.dayRow}>
                        <Text style={styles.dayLabel}>{item.day}</Text>

                        <View style={{ width: 28, alignItems: 'center', marginRight: 8 }}>
                            <FontAwesomeIcon icon={item.icon} color="white" size={18} />
                        </View>

                        <Text style={{ color: 'white', flex: 1, fontSize: 14, opacity: 0.8 }}>
                            {item.condition}
                        </Text>

                        <Text style={styles.dayTemps}>+{item.high}°</Text>
                        <Text style={[styles.dayTemps, { opacity: 0.6 }]}>+{item.low}°</Text>
                    </View>
                ))}
            </ScrollView>
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
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomColor: '#2a2a2a',
        borderBottomWidth: 1,
    },
    dayLabel: {
        color: 'white',
        width: 40,
        fontWeight: '500',
    },
    dayTemps: {
        color: 'white',
        marginLeft: 12,
        fontWeight: '600',
    },
});

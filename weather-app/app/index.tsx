import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts } from 'expo-font';
import { faLocationDot, faSun, faCloud, faWind, faDroplet, faUmbrella } from '@fortawesome/free-solid-svg-icons';

const BASE_URL = 'http://192.168.0.15:8000';

async function weatherAPI() {}

export default function Home() {
    const [fontsLoaded] = useFonts({
        'Manrope-Regular': require('../assets/fonts/Manrope/static/Manrope-Regular.ttf'),
        'Manrope-Bold': require('../assets/fonts/Manrope/static/Manrope-Bold.ttf'),
        'Manrope-Light': require('../assets/fonts/Manrope/static/Manrope-Light.ttf'),
        'Manrope-ExtraLight': require('../assets/fonts/Manrope/static/Manrope-ExtraLight.ttf'),
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: '#141414',
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    alignItems: 'center'
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
                            shadowOffset: {width: 0, height: 4}, 
                            shadowOpacity: 0.15, 
                            shadowRadius: 5
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
                    <View style={{ shadowColor: '#ffffff', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.15, shadowRadius: 20}}>
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
                                fontSize: 80,
                                color: 'white',
                                fontWeight: 'bold',
                                fontFamily: 'Manrope-Regular',
                                opacity: 0.8,
                                shadowColor: '#ffffff', 
                                shadowOffset: {width: 0, height: 4}, 
                                shadowOpacity: 0.15, 
                                shadowRadius: 5
                            }}
                        >
                            72
                        </Text>
                        <Text
                            style={{
                            color: 'white',
                            fontFamily: 'Manrope-Regular',
                            fontSize: 24,
                            position: 'absolute',
                            top: 16,
                            right: -12
                            }}
                        >
                            °
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        width: '90%',
                        backgroundColor: '#222222',
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignSelf: 'center',
                    }}
                >
                    <View style={iconStyle.icon_container}>
                        <FontAwesomeIcon icon={faWind} style={iconStyle.icon} color='#87CEFA'/>
                        <Text style={iconStyle.icon_value}>69 mp/h</Text>
                        <Text style={iconStyle.icon_name}>Wind</Text>
                    </View>

                    <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: 'white', opacity: 0.2 }}>

                    </View>
                    
                    <View style={iconStyle.icon_container}>
                        <FontAwesomeIcon icon={faDroplet} style={iconStyle.icon} color='#5EEAD4'/>
                        <Text style={iconStyle.icon_value}>24%</Text>
                        <Text style={iconStyle.icon_name}>Humidity</Text>
                    </View>

                    <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: 'white', opacity: 0.2 }}></View>
                    
                    <View style={iconStyle.icon_container}>
                        <FontAwesomeIcon icon={faUmbrella} style={iconStyle.icon} color='#A5B4FC'/>
                        <Text style={iconStyle.icon_value}>67%</Text>
                        <Text style={iconStyle.icon_name}>Rain</Text>
                    </View>
                    
                </View>

                {/* Forecast Scroll */}
                {/* <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexGrow: 0, marginBottom: 20 }}
                >
                    {[1, 2, 3, 4, 5].map((item, idx) => (
                        <View
                            key={idx}
                            style={{
                                backgroundColor: '#1e40af',
                                padding: 12,
                                borderRadius: 10,
                                alignItems: 'center',
                                marginRight: 12,
                                width: 80,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                }}
                            >
                                2PM
                            </Text>
                            <FontAwesome5 name="cloud-showers-heavy" size={24} color="#87cefa" />
                            <Text
                                style={{
                                    color: '#f1f5f9',
                                    fontSize: 14,
                                }}
                            >
                                69°F
                            </Text>
                        </View>
                    ))}
                </ScrollView> */}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const iconStyle = StyleSheet.create({
    icon: {
        color: 'white',
        opacity: 0.8
    },

    icon_container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '30%',
        flex: 1

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
        marginTop: 5

    }

})
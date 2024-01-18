import React from "react";
import { View, Text, StatusBar, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Back from '../components/Back/Index'
import color from '../constants/Colors';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

class BookingDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            distance: 0,
            duration: 0,
        }
    }

    async componentDidMount() {

    }

    render() {
        const booking = this.props.navigation.state.params.item
        //console.log(JSON.stringify(booking))
        return (
            <View style={styles.viewStyles}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={color.primary}
                />
                <Back />
                <View style={{
                    backgroundColor: color.primary,
                    borderBottomRightRadius: wp('20%')
                }}>
                    <View style={{
                        width: wp('90%'), alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <Text style={{
                            fontSize: hp('3%'), color: color.black, marginLeft: wp('5%'),
                            marginTop: wp('5%'), fontWeight: 'bold', marginBottom: wp('5%')
                        }}>
                            Détails De La Réservation
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: wp('5%'), marginBottom: wp('5%') }}>
                    <View style={{
                        width: wp('90%'), backgroundColor: color.white, elevation: 10,
                        borderRadius: wp('5%'), padding: 20, marginLeft: wp('5%'),
                    }}>
                        <View style={{
                            width: wp('85%'), backgroundColor: color.tertiary, alignSelf: 'center',
                            elevation: 10, borderRadius: wp('4%'),
                        }}>
                            <Text style={{
                                fontSize: hp('3%'), color: color.white, marginLeft: wp('5%'), textAlign: 'center',
                                marginTop: wp('5%'), fontWeight: 'bold', marginBottom: wp('5%')
                            }}>
                                Détails Du Motoman
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp('5%'), marginTop: wp('5%') }}>
                            <Text style={{ fontSize: hp('2%'), color: color.black, fontWeight: 'bold' }}>
                                Identité
                            </Text>
                            <Text style={{ fontSize: hp('2%'), color: color.black }}>
                                {booking.motoExtra.user.lastName} {booking.motoExtra.user.firstName}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp('5%'), marginTop: wp('5%') }}>
                            <Text style={{ fontSize: hp('2%'), color: color.black, fontWeight: 'bold' }}>
                                Adresse
                            </Text>
                            <Text style={{ fontSize: hp('2%'), color: color.black }}>
                                {booking.motoExtra.adress}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp('5%'), marginTop: wp('5%') }}>
                            <Text style={{ fontSize: hp('2%'), color: color.black, fontWeight: 'bold' }}>
                                Numéro De CNI
                            </Text>
                            <Text style={{ fontSize: hp('2%'), color: color.black }}>
                                {booking.motoExtra.cni}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp('5%'), marginTop: wp('5%') }}>
                            <TouchableOpacity onPress={() => Linking.openURL(`sms:${booking.motoExtra.phone}?body=`)}>
                                <Icon2 name="sms" size={wp('8%')} color={color.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:${booking.motoExtra.phone}`)}>
                                <Icon name="phone" size={wp('8%')} color={color.black} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${booking.motoExtra.user.email}`)}>
                                <Icon name="mail" size={wp('8%')} color={color.tertiary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: 3.9276815,
                            longitude: 11.5218664,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }} 
                        style={{
                            height: hp('25%'), width: wp('100%'),
                        }}
                        showsUserLocation
                        ref={c => this.mapView = c}
                    >
                        <MapView.Marker coordinate={{ latitude: parseFloat(booking.beginMap.latitude), longitude: parseFloat(booking.beginMap.longitude) }} />
                        <MapView.Marker coordinate={{ latitude: parseFloat(booking.endMap.latitude), longitude: parseFloat(booking.endMap.longitude) }} />
                        <MapViewDirections
                            origin={{ latitude: parseFloat(booking.beginMap.latitude), longitude: parseFloat(booking.beginMap.longitude) }}
                            destination={{ latitude: parseFloat(booking.endMap.latitude), longitude: parseFloat(booking.endMap.longitude) }}
                            apikey='AIzaSyD1mi74tbqkc05QGozso7D6hX0zlwTDqvA'
                            strokeWidth={10}
                            strokeColor="hotpink"
                            onStart={(params) => {
                                //console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                                console.log(`Distance: ${result.distance} km`)
                                this.setState({
                                    distance: Math.round(result.distance),
                                    duration: Math.round(result.duration)
                                })
                                console.log(`Duration: ${result.duration} min.`)
                            }}
                        />
                    </MapView>
                    <View style={{
                        width: wp('100%'), backgroundColor: color.secondary, alignSelf: 'center',
                        elevation: 10, borderRadius: wp('0%'), flexDirection: 'row', justifyContent: 'space-between'
                    }}>
                        <Text style={{
                            fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), textAlign: 'center',
                            marginVertical: wp('3%'), fontWeight: 'bold',
                        }}>
                            Distance : {this.state.distance} Km
                        </Text>
                        <Text style={{
                            fontSize: hp('2%'), color: color.black, marginRight: wp('5%'), textAlign: 'center',
                            marginVertical: wp('3%'), fontWeight: 'bold',
                        }}>
                            Durée : {this.state.duration} Min
                        </Text>
                        <Text style={{
                            fontSize: hp('2%'), color: color.black, marginRight: wp('5%'), textAlign: 'center',
                            marginVertical: wp('3%'), fontWeight: 'bold',
                        }}>
                            Prix : {this.state.distance*100} FCFA
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewStyles: {
        //flex: 1,
        paddingBottom: wp('5%')
    },

})

export default withNavigation(BookingDetails);
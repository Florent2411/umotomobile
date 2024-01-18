import React from "react";
import { View, Text, StatusBar, StyleSheet, PermissionsAndroid, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/AntDesign';

import Drawer from '../components/Drawer/Index'
import color from '../constants/Colors';
import apiKey from '../helpers/Index';
import Loader from '../components/Loader/Index';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import BookingsService from '../services/Bookings';

class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            isLoading: false,
            userId: '',
            latitude: 0,
            longitude: 0,
            latitude2: 0,
            longitude2: 0,
            distance: 0,
            duration: 0,
            price: 0,
            date: new Date(Date.now()),
            isPickerShow: false,
            isPickerShow2: false,
            time: new Date(Date.now()),
        }
        this.mapView = null;
    }

    async componentDidMount() {

        try {
            const token = await AsyncStorage.getItem('token')
            const userId = await AsyncStorage.getItem('userId')
            if (token !== null && userId !== null) {
                this.setState({ token: token })
                this.setState({ userId: userId })

                if (Platform.OS === 'ios') {
                    this.getCurrentLocation();
                } else {
                    try {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                            {
                                title: 'Device current location permission',
                                message:
                                    'Allow app to get your current location',
                                buttonNeutral: 'Ask Me Later',
                                buttonNegative: 'Cancel',
                                buttonPositive: 'OK',
                            },
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            this.getCurrentLocation();
                        } else {
                            showMessage({
                                message: "Accès Refusé",
                                description: "Vous avez réfusé l'accès à votre localisation",
                                type: "warning",
                            });
                        }
                    } catch (err) {
                        showMessage({
                            message: "Erreur",
                            description: err,
                            type: "error",
                        });
                    }
                }
            }
        } catch (e) {
            showMessage({
                message: "Echec De Connexion",
                description: JSON.stringify(e),
                type: "danger",
            })
        }
    }

    getCurrentLocation() {
        //Geolocation.requestAuthorization('always');
        Geolocation.getCurrentPosition(
            (position) => {
                //console.log(position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            (error) => {
                showMessage({
                    message: "Erreur",
                    description: error.message,
                    type: "danger",
                });
            },
        );
    }

    onChangeDate = (event, value) => {
        this.setState({ date: value })
        if (Platform.OS === 'android') {
            this.setState({ isPickerShow: false })
        }
    }

    onChangeTime = (event, value) => {
        this.setState({ time: value })
        if (Platform.OS === 'android') {
            this.setState({ isPickerShow2: false })
        }
    }

    booking = async () => {
        const { latitude, latitude2, longitude, longitude2, date, time, userId, token } = this.state
        if (latitude == "" || longitude == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez choisir un point de départ",
                type: "warning",
            })
        }
        else if (latitude2 == "" || longitude2 == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez choisir un point de destination",
                type: "warning",
            })
        }
        else if (date == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez choisir une date",
                type: "warning",
            })
        }
        else if (time == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez choisir une heure",
                type: "warning",
            })
        }
        else if (latitude == latitude2 && longitude == longitude2) {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez choisir un point de départ différent de celui de destination",
                type: "warning",
            })
        }
        else NetInfo.fetch().then(async (state) => {
            if (state.isConnected) {
                this.setState({ isLoading: true })
                try {
                    const bookingService = new BookingsService();
                    const booking = await bookingService.booking({
                        latitude,
                        longitude,
                        latitude2,
                        longitude2,
                        date,
                        time: this.state.time.toLocaleTimeString('fr-FR'),
                        userId,
                        token
                    })
                    this.setState({ isLoading: false })
                    console.log('booking', JSON.stringify(booking))
                    if (log.id_token) {

                        showMessage({
                            message: "Succès De La Réservation",
                            description: "Réservation éffectuée avec succès",
                            type: "success",
                        })
                        this.props.navigation.navigate('BookingList')
                    }
                    else {
                        showMessage({
                            message: "Echec De La réservation",
                            description: "Réservation échouée",
                            type: "danger",
                        })
                        this.setState({ isLoading: false })
                    }
                } catch (errors) {
                    if (errors.message == "Request failed with status code 500") {
                        showMessage({
                            message: "Echec De Connexion Au Serveur",
                            description: "Les services sont actuellement indisponibles",
                            type: "danger",
                        });
                        this.setState({ isLoading: false })
                    }
                    else {
                        showMessage({
                            message: "Echec De Connexion Au Serveur",
                            description: JSON.stringify(errors.response.data.detail),
                            type: "danger",
                        });
                        this.setState({ isLoading: false })
                    }
                }
            } else {
                showMessage({
                    message: "Pas De Connexion Internet",
                    description: "Veuillez vérifier le status de votre connexion internet",
                    type: "warning",
                });
                this.setState({ isLoading: false })
            }
        })
    }

    render() {
        const { latitude, latitude2, longitude, longitude2 } = this.state
        return (
            <ScrollView style={styles.viewStyles} keyboardShouldPersistTaps='always'>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={color.primary}
                />
                <Drawer />
                <View style={{
                    backgroundColor: color.primary,
                    borderBottomRightRadius: wp('20%')
                }}>
                    <View style={{
                        width: wp('90%'), alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <Text style={{ fontSize: hp('3%'), color: color.black, marginLeft: wp('5%'), marginVertical: wp('5%'), fontWeight: 'bold' }}>
                            Réservation De Moto
                        </Text>
                    </View>
                </View>
                <GooglePlacesAutocomplete
                    placeholder='Point De Départ (*)'
                    listViewDisplayed={false}
                    onPress={(data, details = null) => {
                        this.setState({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng
                        })
                    }}
                    query={{
                        key: 'AIzaSyD1mi74tbqkc05QGozso7D6hX0zlwTDqvA',
                        language: 'fr',
                        components: 'country:cm',
                    }}
                    fetchDetails={true}
                    textInputProps={{ InputComp: TextInput }}
                    styles={{
                        textInputContainer: {
                            backgroundColor: 'grey',
                        },
                        textInput: {
                            height: hp('6%'),
                            color: '#5d5d5d',
                            fontSize: hp('2%'),
                            fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb',
                        },
                    }}
                />
                <GooglePlacesAutocomplete
                    placeholder='Point De Destination (*)'
                    onPress={(data, details = null) => {
                        this.setState({
                            latitude2: details.geometry.location.lat,
                            longitude2: details.geometry.location.lng
                        })
                    }}
                    query={{
                        key: 'AIzaSyD1mi74tbqkc05QGozso7D6hX0zlwTDqvA',
                        language: 'fr',
                        components: 'country:cm',
                    }}
                    fetchDetails={true}
                    textInputProps={{ InputComp: TextInput }}
                    styles={{
                        textInputContainer: {
                            backgroundColor: 'grey',
                        },
                        textInput: {
                            height: hp('6%'),
                            color: '#5d5d5d',
                            fontSize: hp('2%'),
                            fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb',
                        },
                    }}
                />
                <View>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: 3.9276815,
                            longitude: 11.5218664,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        style={{
                            width: wp('100%'),
                            height: hp('40%'),
                        }}
                        showsUserLocation
                        ref={c => this.mapView = c}
                    >
                        <MapView.Marker coordinate={{ latitude: latitude, longitude: longitude }} />
                        <MapView.Marker coordinate={{ latitude: latitude2, longitude: longitude2 }} />
                        <MapViewDirections
                            origin={{ latitude: latitude, longitude: longitude }}
                            destination={{ latitude: latitude2, longitude: longitude2 }}
                            apikey='AIzaSyD1mi74tbqkc05QGozso7D6hX0zlwTDqvA'
                            strokeWidth={10}
                            strokeColor="hotpink"
                            onStart={(params) => {
                                //console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                                //console.log(`Distance: ${result.distance} km`)
                                this.setState({
                                    distance: Math.round(result.distance),
                                    duration: Math.round(result.duration)
                                })
                                //console.log(`Duration: ${result.duration} min.`)
                            }}
                            onError={(errorMessage) => {
                                console.log('GOT AN ERROR' + errorMessage);
                                /* showMessage({
                                    message: "Pas De Choix D'Itinéraire",
                                    description: errorMessage,
                                    type: "warning",
                                }); */
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
                            Prix : {this.state.distance * 100} FCFA
                        </Text>
                    </View>
                    <View style={{
                        width: wp('98%'), backgroundColor: color.white, alignSelf: 'center',
                        flexDirection: 'row', justifyContent: 'space-between'
                    }}>
                        {!this.state.isPickerShow && (
                            <TouchableOpacity onPress={() => this.setState({ isPickerShow: true })}>
                                <Text style={{ fontSize: hp('2%'), paddingLeft: wp('2%'), fontWeight: 'bold' }}>Date (*)</Text>
                                <View style={[styles.pickerStyle, { justifyContent: 'center' }]}>
                                    <Text style={{ fontSize: hp('2%') }}>{this.state.date.toDateString()}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        {this.state.isPickerShow && (
                            <DateTimePicker
                                value={this.state.date}
                                mode={'date'}
                                minimunDate={new Date(Date.now())}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={this.onChangeDate}
                                style={styles.pickerStyle}
                            />
                        )}

                        {!this.state.isPickerShow2 && (
                            <TouchableOpacity onPress={() => this.setState({ isPickerShow2: true })}>
                                <Text style={{ fontSize: hp('2%'), paddingLeft: wp('2%'), fontWeight: 'bold' }}>Heure (*)</Text>
                                <View style={[styles.pickerStyle, { justifyContent: 'center' }]}>
                                    <Text style={{ fontSize: hp('2%') }}>{this.state.time.toLocaleTimeString('fr-FR')}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        {this.state.isPickerShow2 && (
                            <DateTimePicker
                                value={this.state.time}
                                mode={'time'}
                                display={Platform.OS === 'ios' ? 'clock' : 'default'}
                                onChange={this.onChangeTime}
                                style={styles.pickerStyle}
                            />
                        )}
                    </View>
                    <TouchableOpacity onPress={this.booking} style={{
                        alignItems: 'center', justifyContent: 'center', marginTop: wp('3%')
                    }}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center', backgroundColor: color.primary,
                            width: wp('12%'), height: hp('7%'), borderRadius: (wp('12%') + hp('7%')) / 2
                        }}>
                            <Icon name="arrowright" size={wp('8%')} color={color.white} />
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    this.state.isLoading && <Loader />
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    viewStyles: {
        //flex: 1,
        paddingBottom: wp('5%')
    },
    pickerStyle: {
        height: hp('6%'),
        width: wp('48%'),
        alignSelf: 'center',
        fontSize: hp('2%'),
        paddingLeft: wp('2%'),
        borderRadius: wp('2.5%'),
        borderWidth: wp('.5%'),
        //margin: wp('1.5%')
    },
})

export default Booking;
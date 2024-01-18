import React from "react";
import { View, Text, StatusBar, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation';
import Drawer from '../components/Drawer/Index'
import img from '../constants/Imgs';
import color from '../constants/Colors';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import BookingsService from '../services/Bookings';
import Loader from '../components/Loader/Index';

class BookingList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infos: '',
            isLoading: false,
            token: '',
            bookings: []
        }
    }

    async componentDidMount() {
        try {
            const userId = await AsyncStorage.getItem('userId')
            const token = await AsyncStorage.getItem('token')
            if (userId !== null && token !== null) {
                //this.setState({ login: value })
                this.getBookings(userId, token)
            }
        } catch (e) {
            showMessage({
                message: "Echec De Connexion",
                description: JSON.stringify(e),
                type: "danger",
            })
        }
    }

    getBookings = async (userId, token) => {
        NetInfo.fetch().then(async (state) => {
            if (state.isConnected) {
                this.setState({ isLoading: true })
                try {
                    const bookingService = new BookingsService();
                    const bookings = await bookingService.getBookings({
                        userId, token
                    })
                    //console.log("bookings : " + JSON.stringify(bookings))
                    this.setState({ bookings: bookings })
                    this.setState({ isLoading: false })
                } catch (errors) {
                    showMessage({
                        message: "Echec De Connexion Au Serveur",
                        description: JSON.stringify(errors.message),
                        type: "danger",
                    });
                    this.setState({ isLoading: false })
                }
            } else
                showMessage({
                    message: "Pas De Connexion Internet",
                    description: "Veuillez vérifier le status de votre connexion internet",
                    type: "warning",
                });
        })
    }

    render() {

        return (
            <View style={styles.viewStyles}>
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
                        <Text style={{
                            fontSize: hp('3%'), color: color.black, marginLeft: wp('5%'),
                            marginTop: wp('5%'), fontWeight: 'bold', marginBottom: wp('5%')
                        }}>
                            Historique De Vos Réservations
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: wp('5%'), marginBottom: wp('5%') }}>
                    <View style={{
                        width: wp('90%'), backgroundColor: color.tertiary, alignSelf: 'center',
                        elevation: 10, borderRadius: wp('4%'),
                    }}>
                        <Text style={{
                            fontSize: hp('2%'), color: color.white, marginLeft: wp('5%'),
                            marginTop: wp('5%'), fontWeight: 'bold', marginBottom: wp('5%')
                        }}>
                            Liste Des Réservations
                        </Text>
                    </View>
                    <ScrollView>

                        {
                            this.state.bookings.length == 0 &&
                            <View style={{
                                alignSelf: 'center', width: wp('80%'), backgroundColor: color.white,
                                elevation: 10, flex: 1,
                                borderRadius: wp('3%'), marginTop: hp('2%'), flexDirection: 'row'
                            }}>
                                <View style={{ width: wp('70%') }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{
                                            flexDirection: 'column', backgroundColor: 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')', width: wp('20%'),
                                            borderRadius: wp('3%'), alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Icon2 name="motorcycle" size={wp('8%')} color={color.white} />

                                        </View>
                                        <View style={{
                                            marginLeft: wp('3%'), margin: wp('5%')
                                        }}>
                                            <Text style={{
                                                fontSize: hp('2%'), color: color.black, fontWeight: 'bold',
                                            }}>Aucune Réservation Trouvée</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        }
                        {
                            this.state.bookings.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('BookingDetails', {item})}>
                                        <View style={{
                                            alignSelf: 'center', width: wp('80%'), backgroundColor: color.white,
                                            elevation: 10, flex: 1,
                                            borderRadius: wp('3%'), marginTop: hp('2%'), flexDirection: 'row'
                                        }}>
                                            <View style={{ width: wp('70%') }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{
                                                        flexDirection: 'column', width: wp('20%'),
                                                        borderRadius: wp('3%'), alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <Image source={{ uri: item.motoExtra.imageBase }} style={{
                                                            height: wp('20%'), width: wp('20%'),
                                                            borderRadius: wp('3%')
                                                        }} />
                                                    </View>
                                                    <View style={{
                                                        flexDirection: 'column', marginLeft: wp('3%')
                                                    }}>
                                                        <Text style={{
                                                            fontSize: hp('2%'), color: color.black, fontWeight: 'bold',
                                                        }}>Motoman : {item.motoExtra.user.lastName} {item.motoExtra.user.firstName}</Text>
                                                        <Text style={{
                                                            fontSize: hp('2%'), color: color.black, marginTop: hp('2%'),
                                                        }}>Date : {item.date.slice(0, 10)}</Text>
                                                        <Text style={{
                                                            fontSize: hp('2%'), color: color.black, marginTop: hp('2%'),
                                                        }}>Heure : {item.hour}h-{item.minute}min</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{
                                                justifyContent: 'center', width: wp('10%')
                                            }}>
                                                <Icon name="pluscircleo" size={wp('8%')} color={color.black} />
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                    </ScrollView>
                </View>
                {
                    this.state.isLoading && <Loader />
                }
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

export default withNavigation(BookingList);
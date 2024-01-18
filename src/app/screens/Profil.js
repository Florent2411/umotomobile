import React from "react";
import { View, Text, StatusBar, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Drawer from '../components/Drawer/Index'
import img from '../constants/Imgs';
import color from '../constants/Colors';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import AuthService from '../services/Auth';
import Loader from '../components/Loader/Index';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infos: '',
            isLoading: false,
            token: ''
        }
    }

    async componentDidMount() {
        try {
            const login = await AsyncStorage.getItem('login')
            const token = await AsyncStorage.getItem('token')
            if (login !== null && token !== null) {
                //this.setState({ login: value })
                this.getInfos(login, token)
            }
        } catch (e) {
            showMessage({
                message: "Echec De Connexion",
                description: JSON.stringify(e),
                type: "danger",
            })
        }
    }

    getInfos = async (login, token) => {
        NetInfo.fetch().then(async (state) => {
            if (state.isConnected) {
                this.setState({ isLoading: true })
                try {
                    const authService = new AuthService();
                    const infos = await authService.getInfos({
                        login, token
                    })
                    //console.log("infos : " + JSON.stringify(infos))
                    AsyncStorage.setItem('userId', infos.id)
                    this.setState({ infos: infos })
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
            <ScrollView style={styles.viewStyles}>
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
                        <View style={{
                            alignSelf: 'center',
                            width: wp('50%'),
                            height: wp('40%'),
                            borderRadius: wp('90%'),
                            backgroundColor: color.white,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <Image
                                style={{ padding: 5, height: wp('50%'), width: wp('40%'), alignSelf: 'center' }}
                                source={img.user}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: wp('10%'), marginBottom: wp('5%') }}>
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
                                Mon Compte
                            </Text>
                        </View>
                        <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), marginTop: wp('5%'), fontWeight: 'bold' }}>
                            Identité
                        </Text>
                        <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), lineHeight: wp('7%') }}>
                            {this.state.infos.lastName} {this.state.infos.firstName}
                        </Text>
                        <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), marginTop: wp('5%'), fontWeight: 'bold' }}>
                            Email
                        </Text>
                        <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), lineHeight: wp('7%') }}>
                            {this.state.infos.email}
                        </Text>
                        <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), marginTop: wp('5%'), fontWeight: 'bold' }}>
                            Login
                        </Text>
                        <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), lineHeight: wp('7%') }}>
                            {this.state.infos.login}
                        </Text>
                    </View>
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

})

export default Login;
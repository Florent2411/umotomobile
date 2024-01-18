import React from "react";
import { View, TextInput, StatusBar, StyleSheet, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/AntDesign';
import { showMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import AuthService from '../services/Auth';
import Loader from '../components/Loader/Index';

import img from '../constants/Imgs';
import color from '../constants/Colors';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false
        }
    }

    onLogIn = async () => {
        const { username, password } = this.state
        if (username == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un numéro de téléphone",
                type: "warning",
            })
        }
        else if (username.length != 9 ) {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un numéro de téléphone valide",
                type: "warning",
            })
        }
        else if (password == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un mot de passe",
                type: "warning",
            })
        }
        else if (password.length < 4) {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un mot de passe d'au moins 4 caractères",
                type: "warning",
            })
        }
        else NetInfo.fetch().then(async (state) => {
            if (state.isConnected) {
                this.setState({ isLoading: true })
                try {
                    const authService = new AuthService();
                    const log = await authService.login({
                        username,
                        password,
                    })
                    this.setState({ isLoading: false })
                    //console.log('response', JSON.stringify(log))
                    if (log.id_token) {
                        AsyncStorage.setItem('token', JSON.stringify(log.id_token))
                        AsyncStorage.setItem('login', username)
                        /* showMessage({
                            message: "Succès De L'Authentification",
                            description: "Bienvenue dans votre espace",
                            type: "success",
                        }) */
                        this.props.navigation.navigate('Home')
                    }
                    else
                        showMessage({
                            message: "Echec De L'Authentification",
                            description: "Veuillez vérifiez vos identifiants",
                            type: "danger",
                        })
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
                        if (errors.response.data.detail == "Bad credentials") {
                            showMessage({
                                message: "Echec De Connexion Au Serveur",
                                description: "Les identifants saisis sont incorrects",
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
                <View style={{ height: hp('40%'), backgroundColor: color.white }}>
                    <View style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, flexDirection: 'row',
                        borderBottomRightRadius: wp('20%'), backgroundColor: color.primary
                    }}>
                        <View style={{ alignSelf: 'center', width: wp('100%') }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: wp('70%'), height: hp('30%') }}
                                    source={img.login} />
                            </View>
                        </View>
                    </View>
                </View>


                <View style={{ height: hp('60%') }}>
                    <View style={{ flex: 1, backgroundColor: color.primary }} />
                    <View style={{ flex: 1, backgroundColor: color.white }} />
                    <View style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 0,
                        borderTopLeftRadius: wp('20%'), backgroundColor: color.white, borderBottomRightRadius: 0
                    }} >
                        <View style={{
                            width: wp('90%'), alignSelf: 'center', backgroundColor: color.gray, elevation: 10,
                            borderRadius: 20, padding: 20, marginTop: hp('5%'),
                        }}>
                            <Text style={{ fontSize: hp('3%'), color: color.tertiary, fontWeight: 'bold' }}>
                                Bon Retour Parmi Nous
                            </Text>
                            <Text style={{ fontSize: hp('2%'), color: color.black, paddingTop: hp('2%'), fontWeight: 'bold' }}>
                                Connectez-vous pour continuer
                            </Text>
                            <View style={{
                                width: wp('80%'), alignSelf: 'center', backgroundColor: color.white, elevation: 10,
                                borderRadius: wp('3%'), padding: wp('2%'), margin: wp('5%')
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <TextInput
                                            style={styles.pickerStyle}
                                            placeholder={"Numéro De Téléphone"}
                                            onChangeText={username => this.setState({ username })}
                                        />
                                        <TextInput
                                            style={styles.pickerStyle}
                                            placeholder={'Mot De Passe'}
                                            secureTextEntry={true}
                                            onChangeText={password => this.setState({ password })}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={this.onLogIn} style={{
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <View style={{
                                            alignItems: 'center', justifyContent: 'center', backgroundColor: color.primary,
                                            width: wp('12%'), height: hp('7%'), borderRadius: (wp('12%') + hp('7%')) / 2
                                        }}>
                                            <Icon name="arrowright" size={wp('8%')} color={color.white} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <Text style={{ fontSize: hp('2%'), color: color.black, paddingTop: hp('2%'), textAlign: 'center' }}>
                            Pas De Compte ?
                            <Text onPress={() => this.props.navigation.navigate('Register')} style={{ fontSize: hp('2%'), color: color.tertiary, paddingTop: hp('2%'), paddingLeft: wp('2%'), fontWeight: 'bold', textAlign: 'center' }}>
                                Enregistez-Vous Ici
                            </Text>
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
    },
    pickerStyle: {
        height: hp('6%'),
        width: wp('70%'),
        alignSelf: 'center',
        fontSize: hp('2%'),
        paddingLeft: wp('2%'),
        borderRadius: wp('2.5%'),
        borderWidth: wp('.5%'),
        margin: wp('1.5%')
    },
})

export default Login;
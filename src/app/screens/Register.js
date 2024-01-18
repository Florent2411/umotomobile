import React from "react";
import { View, TextInput, StatusBar, StyleSheet, Image, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { showMessage } from "react-native-flash-message";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import NetInfo from "@react-native-community/netinfo";
import AuthService from '../services/Auth';
import Loader from '../components/Loader/Index';

import img from '../constants/Imgs';
import color from '../constants/Colors';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            cni: '',
            email: '',
            password2: '',
            address: '',
            phone: '',
            errors: false,
            password: '',
            isLoading: false,
            isSchool: false,
            value: false
        }
    }

    remplirChamps = async () => {
        const { lastName, firstName } = this.state
        if (lastName == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un nom d'utilisateur",
                type: "warning",
            })
            this.setState({ errors: true })
        }
        else if (firstName == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un prénom",
                type: "warning",
            })
            this.setState({ errors: true })
        }
        else
            this.setState({ errors: false })
    }

    remplirChamps1 = async () => {
        const { phone, address } = this.state
        if (phone == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un numéro de téléphone",
                type: "warning",
            })
            this.setState({ errors: true })
        }
        else if (phone.length != 9) {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un numéro de téléphone valide",
                type: "warning",
            })
            this.setState({ errors: true })
        }
        else if (address == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir une adresse",
                type: "warning",
            })
            this.setState({ errors: true })
        }
        else
            this.setState({ errors: false })
    }

    remplirChamps2 = async () => {
        const { cni, email } = this.state
        if (cni == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un numéro de la carte d'identité",
                type: "warning",
            })
            this.setState({ errors: true })
        }
        else if (email == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir une adresse mail",
                type: "warning",
            })
            this.setState({ errors: true })
        }
        else
            this.setState({ errors: false })
    }

    remplirChamps3 = async () => {
        const { password, password2 } = this.state
        if (password == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un mot de passe",
                type: "warning",
            })
        }
        else if (password.length < 4) {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un mot de passe contenant au moins 4 caractères",
                type: "warning",
            })
        }
        else if (password2 == "") {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un meme mot de passe",
                type: "warning",
            })
        }
        else if (password2 != password) {
            showMessage({
                message: "Champs Requis",
                description: "Veuillez saisir un meme mot de passe",
                type: "warning",
            })
        }
        else
            this.setState({ errors: false })
    }

    onRegister = async () => {
        NetInfo.fetch().then(async (state) => {
            if (state.isConnected) {
                this.setState({ isLoading: true })
                try {
                    const authService = new AuthService();
                    const register = await authService.register({
                        lastName: this.state.lastName,
                        firstName: this.state.firstName,
                        phone: this.state.phone,
                        address: this.state.address,
                        cni: this.state.cni,
                        email: this.state.email,
                        isSchool: this.state.value,
                        password: this.state.password
                    })
                    this.setState({ isLoading: false })
                    //console.log('register', JSON.stringify(register))
                    if (register == 201) {
                        showMessage({
                            message: "Succès De La Création De Compte",
                            description: "Veuillez vous connecter pour continuer",
                            type: "success",
                        })
                        this.props.navigation.navigate('Login')
                    }
                    if (register.status == 201 && this.state.value == true) {
                        showMessage({
                            message: "Succès De La Création De Compte",
                            description: "Merci de vous rapprocher de l'établissement Marie Albert pour vous faire activer afin de pouvoir vous connecter",
                            type: "success",
                        })
                        this.props.navigation.navigate('Login')
                    }
                    else
                        showMessage({
                            message: "Echec De La Création De Compte",
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
                        showMessage({
                            message: "Echec De Connexion Au Serveur",
                            description: JSON.stringify(errors.response.data.title),
                            type: "danger",
                        });
                        this.setState({ isLoading: false })
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
            <View style={styles.viewStyles}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={color.primary}
                />
                <View style={{ height: hp('30%'), backgroundColor: color.white }}>
                    <View style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, flexDirection: 'row',
                        borderBottomRightRadius: wp('20%'), backgroundColor: color.primary
                    }}>
                        <View style={{ alignSelf: 'center', width: wp('100%') }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: wp('60%'), height: hp('25%') }}
                                    source={img.login} />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ height: hp('70%') }}>
                    <View style={{ flex: 1, backgroundColor: color.primary }} />
                    <View style={{ flex: 1, backgroundColor: color.white }} />
                    <View style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 0,
                        borderTopLeftRadius: wp('20%'), backgroundColor: color.white, borderBottomRightRadius: 0
                    }} >
                        <View style={{
                            width: wp('90%'), alignSelf: 'center', backgroundColor: color.gray, elevation: 10,
                            borderRadius: 20, padding: 20, marginTop: hp('2%'),
                        }}>
                            <Text style={{ fontSize: hp('3%'), color: color.tertiary, fontWeight: 'bold' }}>
                                Bienvenue Parmi Nous
                            </Text>
                            <Text style={{ fontSize: hp('2%'), color: color.black, paddingTop: hp('2%'), fontWeight: 'bold' }}>
                                Enregistrez-vous pour continuer
                            </Text>
                            <View style={{
                                width: wp('80%'), alignSelf: 'center', backgroundColor: color.white, elevation: 10,
                                borderRadius: wp('3%'), padding: wp('2%'), margin: wp('3%'), height: hp('35%')
                            }}>
                                <ProgressSteps activeLabelColor={color.tertiary} completedStepIconColor={color.tertiary}
                                    completedProgressBarColor={color.tertiary} activeStepIconBorderColor={color.tertiary}>
                                    <ProgressStep label="" onNext={this.remplirChamps} errors={this.state.errors}>
                                        <View>
                                            <TextInput
                                                style={styles.pickerStyle}
                                                placeholder={"Nom D'Utilisateur"}
                                                value={this.state.lastName}
                                                onChangeText={lastName => this.setState({ lastName })}
                                            />
                                            <TextInput
                                                style={styles.pickerStyle}
                                                placeholder={'Prénom'}
                                                value={this.state.firstName}
                                                onChangeText={firstName => this.setState({ firstName })}
                                            />
                                        </View>
                                    </ProgressStep>
                                    <ProgressStep label="" onNext={this.remplirChamps1} errors={this.state.errors}>
                                        <View>
                                            <TextInput
                                                style={styles.pickerStyle}
                                                placeholder={"Téléphone"}
                                                value={this.state.phone}
                                                keyboardType="number-pad"
                                                onChangeText={phone => this.setState({ phone })}
                                            />
                                            <TextInput
                                                style={styles.pickerStyle}
                                                placeholder={'Adresse'}
                                                value={this.state.address}
                                                onChangeText={address => this.setState({ address })}
                                            />
                                        </View>
                                    </ProgressStep>
                                    <ProgressStep label="" onNext={this.remplirChamps2} errors={this.state.errors}>
                                        <View>
                                            <TextInput
                                                style={styles.pickerStyle}
                                                placeholder={"Numéro De CNI"}
                                                value={this.state.cni}
                                                onChangeText={cni => this.setState({ cni })}
                                            />
                                            <TextInput
                                                style={styles.pickerStyle}
                                                placeholder={'Email'}
                                                value={this.state.email}
                                                onChangeText={email => this.setState({ email })}
                                            />
                                        </View>
                                    </ProgressStep>
                                    <ProgressStep label="" onNext={this.remplirChamps3} errors={this.state.errors}>
                                        <View>
                                            <TextInput
                                                style={styles.pickerStyle}
                                                placeholder={'Mot De Passe'}
                                                secureTextEntry={true}
                                                value={this.state.password}
                                                onChangeText={password => this.setState({ password })}
                                            />
                                            <TextInput
                                                style={styles.pickerStyle}
                                                placeholder={'Confirmer Mot De Passe'}
                                                secureTextEntry={true}
                                                value={this.state.password2}
                                                onChangeText={password2 => this.setState({ password2 })}
                                            />
                                        </View>
                                    </ProgressStep>
                                    <ProgressStep label="" onSubmit={this.onRegister} errors={this.state.errors}>
                                        <View>
                                            <Text style={{ fontSize: hp('2%'), paddingLeft: wp('2%'), fontWeight: 'bold', paddingBottom: wp('3%') }}>Etes-vous de Marie Albert ?</Text>
                                            <RadioForm
                                                radio_props={[
                                                    { label: "Non", value: false },
                                                    { label: "Oui", value: true }
                                                ]}
                                                buttonColor={color.tertiary}
                                                onPress={(value) => { this.setState({ value: value }) }}
                                                labelStyle={{ fontSize: hp('2%'), padding: wp('2%') }}
                                                formHorizontal={true}
                                            />
                                        </View>
                                    </ProgressStep>
                                </ProgressSteps>
                            </View>
                        </View>
                        <Text style={{ fontSize: hp('2%'), color: color.black, paddingTop: hp('2%'), textAlign: 'center' }}>
                            Déjà Un Compte ?
                            <Text onPress={() => this.props.navigation.navigate('Login')} style={{ fontSize: hp('2%'), color: color.primary, paddingTop: hp('2%'), paddingLeft: wp('2%'), fontWeight: 'bold', textAlign: 'center' }}>
                                Connectez-Vous Ici
                            </Text>
                        </Text>
                    </View>
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
        flex: 1,
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

export default Register;
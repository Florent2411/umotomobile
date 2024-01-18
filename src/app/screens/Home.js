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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastName: '',
      firstName: '',
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
          AsyncStorage.setItem('userId', JSON.stringify(infos.id))
          this.setState({ lastName: infos.lastName })
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
            width: wp('90%'), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: hp('2.5%'), color: color.white, fontWeight: 'bold' }}>BIENVENUE @{this.state.lastName}</Text>
            <View style={{
              alignSelf: 'flex-end',
              width: wp('30%'),
              height: hp('5%'),
              borderRadius: wp('5%'),
              backgroundColor: color.white,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Image
                style={{ padding: 5, height: wp('7%'), width: wp('7%'), alignSelf: 'center' }}
                source={img.Flag_of_Cameroon}
              />
              <Text style={{ fontSize: hp('2%'), color: color.black, paddingLeft: 5 }}>Cameroun</Text>
            </View>
          </View>
          <View style={{
            width: wp('90%'), alignSelf: 'center', justifyContent: 'center', paddingTop: hp('2%')
          }}>
            <Text style={{ fontSize: hp('2%'), color: color.black, marginBottom: wp('5%'), lineHeight: wp('7%') }}>
              Votre espace de réservation de moto partout au Cameroun est toujours disponible avec plusieurs services
              spécialement conçus pour des clients pour vous.
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: hp('3%'), color: color.tertiary, margin: wp('5%'), fontWeight: 'bold' }}>
          Nos Services
        </Text>
        <ScrollView horizontal={true}>
          <View style={{ flexDirection: 'row', marginBottom: wp('5%') }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Booking')}>
              <View style={{
                width: wp('70%'), backgroundColor: color.gray, elevation: 10,
                borderRadius: wp('5%'), padding: 20, marginLeft: wp('5%'),
              }}>
                <View style={{
                  width: wp('60%'), backgroundColor: color.secondary, elevation: 10,
                  borderRadius: wp('5%'), padding: 20, alignSelf: 'center'
                }}>
                  <Image style={{ width: wp('50%'), height: hp('25%'), alignSelf: 'center' }}
                    source={img.deliveryman} />
                </View>
                <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), marginTop: wp('5%'), fontWeight: 'bold' }}>
                  Moto
                </Text>
                <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), lineHeight: wp('7%') }}>
                  Appelez une moto. Déplacez-vous en toute sécurité de jour comme de nuit
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Booking')}>
              <View style={{
                width: wp('70%'), backgroundColor: color.gray, elevation: 10,
                borderRadius: wp('5%'), padding: 20, marginLeft: wp('5%'), marginRight: wp('5%'),
              }}>
                <View style={{
                  width: wp('60%'), backgroundColor: color.tertiary, elevation: 10,
                  borderRadius: wp('5%'), padding: 20, alignSelf: 'center'
                }}>
                  <Image style={{ width: wp('50%'), height: hp('25%'), alignSelf: 'center' }}
                    source={img.deliveryman2} />
                </View>
                <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), marginTop: wp('5%'), fontWeight: 'bold' }}>
                  Livraison
                </Text>
                <Text style={{ fontSize: hp('2%'), color: color.black, marginLeft: wp('5%'), lineHeight: wp('7%') }}>
                  Envoyez un colis. Faites-vous livrer partout au Cameroun avec un réel suivi du temps
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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

export default Home;
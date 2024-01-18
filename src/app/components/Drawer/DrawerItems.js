import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import {View, Image, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import img from '../../constants/Imgs';
import color from '../../constants/Colors';

class DrawerItems extends React.Component {

    navigateToScreen = route => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
        this.setState({ currentScreen: route })
    };

    constructor(props) {
        super(props);
        this.state = {
            currentScreen: props.navigation.state.routeName
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ marginLeft: wp('2%') }}
                    onPress={() => this.props.navigation.closeDrawer()}>
                    <Image
                        style={{
                            width: wp('6%'),
                            height: hp('4%'),
                            alignSelf: 'flex-end'
                        }}
                        source={img.drawerIcon}
                    />
                </TouchableOpacity>
                <View style={{ marginTop: 0, marginBottom: hp('3%'), backgroundColor: '#D1CFE7' }}>
                    <Image style={{ width: wp('50%'), height: hp('30%'), alignSelf: 'center' }}
                        source={img.logo}
                    />
                </View>
                <View style={{ justifyContent: 'space-between', flex: 1 }}>
                    <ScrollView vertical="true" showsVerticalScrollIndicator style={{
                        padding: 0, marginBottom: hp('0%'),
                    }}>

                        <TouchableOpacity onPress={this.navigateToScreen("Home")}>
                            <View style={this.state.currentScreen === "Home" && { backgroundColor: color.secondary }}>
                                <Text style={[styles.drawerText, this.state.currentScreen === "Home" && styles.activeTitle]}>Tableau De Bord</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen("Booking")}>
                            <View style={this.state.currentScreen === "Reservation" && { backgroundColor: color.secondary }}>
                                <Text style={[styles.drawerText, this.state.currentScreen === "Reservation" && styles.activeTitle]}>Réservation</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen("BookingList")}>
                            <View style={this.state.currentScreen === "Liste" && { backgroundColor: color.secondary }}>
                                <Text style={[styles.drawerText, this.state.currentScreen === "Liste" && styles.activeTitle]}>Liste Des Réservations</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity onPress={this.navigateToScreen("Profil")} style={{ backgroundColor: color.secondary }}>
                        <View style={this.state.currentScreen === "Profil" && { backgroundColor: color.secondary }}>
                            <Text style={[styles.drawerText, this.state.currentScreen === "Profil" && styles.activeTitle]}>Mon Profil Client</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View >
        );
    }
}

const styles = StyleSheet.create({
    drawerText: {
        paddingLeft: wp('2%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('2%'),
        borderBottomWidth: 2,
        borderBottomColor: color.secondary,
        color: color.black,
        fontWeight: 'bold',
        fontSize: hp('2%')
    },
    activeTitle: {
        color: 'red',
    },
});

export default DrawerItems;
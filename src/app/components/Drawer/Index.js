import React, { Component } from "react";
import { Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import img from '../../constants/Imgs';
import color from '../../constants/Colors';

class Drawer extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <TouchableOpacity style={{ backgroundColor: color.primary, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => this.props.navigation.openDrawer()}>
                <Image
                    style={{
                        width: wp('6%'),
                        height: hp('4%'),
                        marginLeft: wp('2%')
                    }}
                    source={img.drawerIcon}
                />
            </TouchableOpacity>
        );
    }
}

export default withNavigation(Drawer);
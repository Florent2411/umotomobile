import React, { Component } from "react";
import {TouchableOpacity, Image} from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation'; 
import img from '../../constants/Imgs';
import color from '../../constants/Colors';

class Back extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <TouchableOpacity style={{ backgroundColor: color.primary }}
                onPress={() => this.props.navigation.goBack() }>
                <Image
                    style={{
                        width: wp('8%'),
                        height: hp('4%')
                    }}
                    source={img.backIcon}
                />
            </TouchableOpacity>
        );
    }
}

export default withNavigation(Back);
import React from "react";
import {View, Image, StatusBar, StyleSheet} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import img from '../../constants/Imgs';

class SplashScreen extends React.Component {

  render() {

    return (
      <View style={styles.viewStyles}>
        <StatusBar
          translucent backgroundColor="transparent"
        />
        <Image
          style={{ width: wp('32%'), height: hp('20%') }}
          source={img.logo}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

})

export default SplashScreen;
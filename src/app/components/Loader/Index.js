import React from 'react';
import color from '../../constants/Colors';
import img from '../../constants/Imgs';
import * as Animatable from 'react-native-animatable';
import { View, Modal, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: props.visible,
        }
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={true}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <Animatable.View animation='rotate' iterationCount="infinite">
                        <View style={styles.activityIndicatorWrapper}>
                            <Image animation='rotate' iterationCount="infinite" style={{
                                width: wp('20%'), height: wp('20%'), alignSelf: 'center',
                                marginTop: hp('2%'), marginBottom: hp('2%')
                            }}
                                source={img.logo}
                            />
                        </View>
                    </Animatable.View>
                </View>
            </Modal>
        )
    }
}

const styles = {
    modalBackground: {
        flex: 1,
        width: wp('100%'),
        height: hp('100%'),
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#00000060',
        height: wp('25%'),
        width: wp('25%'),
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textWrapper: {
        fontSize: 16,
        textAlign: 'center',
        color: color.primary,
        ...Platform.select({
            ios: {
                fontFamily: 'Ubuntu-Medium',
            },
            android: {
                fontFamily: 'Ubuntu-M',
            }
        }),
    }
};

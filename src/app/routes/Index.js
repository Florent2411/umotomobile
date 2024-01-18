import React from "react";
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import DrawerItems from '../components/Drawer/DrawerItems';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import Profil from '../screens/Profil';
import BookingList from '../screens/BookingList';
import BookingDetails from '../screens/BookingDetails';
import Booking from '../screens/Booking';

const Home1 = createDrawerNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        //drawerLabel: "Accueil"
      },
    },
    Profil: {
      screen: Profil,
      navigationOptions: {
        //drawerLabel: "Accueil"
      },
    },
    BookingList: {
      screen: BookingList,
      navigationOptions: {
        //drawerLabel: "Accueil"
      },
    },
    Booking: {
      screen: Booking,
      navigationOptions: {
        //drawerLabel: "Accueil"
      },
    },
  },
  {
    drawerWidth: wp('75%'),
    contentComponent: DrawerItems,
    /* contentComponent: (props) => (
      <Modules.DrawerItems currentScreen={props.navigation.state.routeName} {...props} />
    ), */
    initialRouteName: 'Home',
  }
)

const Routes = createStackNavigator({

  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      header: null,
    }
  },
  Home: {
    screen: Home1,
    navigationOptions: {
      header: null,
    }
  },
  Profil: {
    screen: Profil,
    navigationOptions: {
      header: null,
    }
  },
  BookingList: {
    screen: BookingList,
    navigationOptions: {
      header: null,
    }
  },
  BookingDetails: {
    screen: BookingDetails,
    navigationOptions: {
      header: null,
    }
  },
  Booking: {
    screen: Booking,
    navigationOptions: {
      header: null,
    }
  },
});

export default createAppContainer(Routes);

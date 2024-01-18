import React from "react";
import FlashMessage from "react-native-flash-message";
import { LogBox } from 'react-native';
import Routes from './src/app/routes/Index'
import SplashScreen from './src/app/components/Splash/Index'

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  performTimeConsumingTask = async () => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        2000
      )
    )
  }

  async componentDidMount() {
    const data = await this.performTimeConsumingTask();
    if (data !== null) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    LogBox.ignoreLogs([
      'Require cycle:'
    ])
    LogBox.ignoreAllLogs(true)

    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <>
        <Routes />
        <FlashMessage position="top" duration={5000} />
      </>
    );
  }
}
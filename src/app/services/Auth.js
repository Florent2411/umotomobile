import Axios from 'axios';
import config from '../config/Index';

export default class AuthService {
  async login(data) {
    try {
      //console.log('data from auth service is ', data);
      const response = await Axios.post(`${config.apiUrl}/authenticate`, {
        username: data.username,
        password: data.password
      });
      //console.log('response', JSON.stringify(response));
      return response.data
    } catch (errors) {
      //console.log('response', JSON.stringify(errors));
      return Promise.reject(errors);
    }
  }

  async register(data) {
    try {
      //console.log('data from auth service is ', data);
      const response = await Axios.post(`${config.apiUrl}/register`, {
        activated: !data.isSchool,
        adress: data.address,
        authorities: [
          "ROLE_USER"
        ],
        cni: data.cni,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        login: data.phone,
        password: data.password,
        phone: data.phone,
        school: data.isSchool
      });
      //console.log('response', JSON.stringify(response));
      return response
    } catch (errors) {
      //console.log('response', JSON.stringify(errors));
      return Promise.reject(errors);
    }
  }

  async getInfos(data) {
    try {
      //console.log('data from auth service is ', data);
      const response = await Axios.get(`${config.apiUrl}/users/` + data.login,
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer" + data.token,
          },
        });
      //console.log('response', JSON.stringify(response));
      return response.data
    } catch (errors) {
      //console.log('response', JSON.stringify(errors));
      return Promise.reject(errors);
    }
  }

}
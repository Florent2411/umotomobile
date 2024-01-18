/**
    * @description      : 
    * @author           : HP
    * @group            : 
    * @created          : 15/12/2021 - 10:04:02
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 15/12/2021
    * - Author          : HP
    * - Modification    : 
**/
import Axios from "axios";
import config from '../config/Index';

export default class BookingsService {
  async getBookings(data) {
    try {
      const response = await Axios.get(
        `${config.apiUrl}/bookings/findAllByUserId/{userId}?userId=${data.userId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer" + data.token,
          },
        }
      );
      //console.log(response)
      return response.data;
    } catch (error) {
      //console.log(JSON.stringify(error))
      return Promise.reject(error);
    }
  }

  async booking(data) {
    const time = data.time.split(':');
    try {
      const response = await Axios.post(
        `${config.apiUrl}/bookings`,
          {
            user: {
              id: data.userId
            }, 
            motoExtra: {
              id: ''
            }, 
            date: data.date,
            hour: time[0],
            minute: time[1],
            beginMap: {
              latitude: data.latitude,
              longitude: data.longitude
            },
            endMap: {
              latitude: data.latitude2,
              longitude: data.longitude2
            }
          },{
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer" + data.token,
            }
        }
      );
      console.log(response)
      return response;
    } catch (error) {
      console.log(JSON.stringify(error))
      return Promise.reject(error);
    }
  }
}

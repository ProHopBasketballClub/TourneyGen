import axios from 'axios'

export default class ApiCall {

    backendLocation = 'http://' + (process.env.BACKEND_LOCATION || 'localhost:34345') + '/api';


    get(path, params) {
        axios.get(this.backendLocation + path, {params}).then((resp) => {
            return resp;
        }).catch(error => {
            console.log(error)
        })
    }

    post(path, body) {
        axios.post(this.backendLocation + path, body).then(resp => {
            return resp
        }).catch(error => {
            console.log(error)
        })
    }

    put(path, body) {
        axios.put(this.backendLocation + path, body).then(resp => {
            return resp;
        }).catch(error => {
            console.log(error)
        })
    }



}

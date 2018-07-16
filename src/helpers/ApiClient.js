import fetch from 'isomorphic-fetch';
import axios from 'axios';

// TODO Move me elsewhere!
const host = window.location.protocol + "//" + process.env.REACT_APP_API_HOST;

export default class clientAPI {
  constructor() {
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  get(url, params) {
    const fullUrl = new URL(host + url);

    // Optional query parameters.
    if (params) {
      Object.keys(params).forEach(key => fullUrl.searchParams.append(key, params[key]));
    }

    return fetch(fullUrl, {
      method: 'GET',
      headers: this.headers,
      credentials: 'include',
    });
  }

  post(url, params) {
    return axios({
      method: 'post',
      url: host + url,
      headers: this.headers,
      withCredentials: true,
      timeout: 100000000,
      data: params.data
    });
    // return fetch(host + url, {
    //   method: 'POST',
    //   headers: this.headers,
    //   credentials: 'include',
    //   timeout: 100000000,
    //   body: JSON.stringify(params.data)
    // });
  }
}

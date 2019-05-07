import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
var io = sailsIOClient(socketIOClient);
io.sails.autoConnect = false;

const host = `${window.location.protocol}//${window._env_.REACT_APP_API_HOST}`;

export default class socketAPI {
  socket;

  connect() {
    this.socket = io.sails.connect(host, {
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionDelayMax : 5000,
      reconnectionAttempts: Infinity
    });
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        resolve()
      });
      this.socket.on('connect_error', (error) => {
        reject(error);
        return;
      });
      this.socket.on('reconnecting', () => {
        return;
      });
      this.socket.on('disconnect', () => {
        return;
      });
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.socket.disconnect(() => {
        this.socket = null;
        resolve();
      });
    });
  }

  get(url, params) {

    const fullUrl = new URL(host + url);

    // Optional query parameters.
    if (params) {
      Object.keys(params).forEach(key => fullUrl.searchParams.append(key, params[key]));
    }

    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      return this.socket.get(fullUrl.href, null, (response) => {
        if (response.error) {
          console.error(response.error);
          return reject(response.error);
        }
        return resolve(response);
      });
    });
  }

  emit(event, data) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      return this.socket.emit(event, data, (response) => {
        if (response.error) {
          console.error(response.error);
          return reject(response.error);
        }
        return resolve(response);
      });
    });
  }

  on(event, fun) {
    // No promise is needed here, but let's be consistent.
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      this.socket.on(event, fun);
      resolve();
    });
  }
}

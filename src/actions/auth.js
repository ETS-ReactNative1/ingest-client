export function me() {
  return {
    types: ['ME', 'ME_SUCCESS', 'ME_FAILURE'],
    promise: (client) => client.get('/me'),
  };
}

export function login(params) {
  return {
    types: ['LOGIN', 'LOGIN_SUCCESS', 'LOGIN_FAILURE'],
    promise: client => client.post('/login', {
      data: {
        email: params.email,
        password: params.password
      }
    })
  };
}

export function register(params) {
  return {
    types: ['REGISTER', 'REGISTER_SUCCESS', 'REGISTER_FAILURE'],
    promise: client => client.post('/register', {
      data: {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        username: params.username,
        password: params.password,
        age: params.age
      }
    })
  };
}

export function logout() {
  return {
    types: ['LOGOUT', 'LOGOUT_SUCCESS', 'LOGOUT_FAILURE'],
    promise: client => client.get('/logout')
  };
}

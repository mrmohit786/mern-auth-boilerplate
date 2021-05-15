import cookie from 'js-cookie';

// set data in cookie
export const setCookie = (key, value) => {
  if (window !== 'undefined') {
    cookie.set(key, value, {
      // 1 day
      expires: 1,
    });
  }
};

// remove from cookie
export const removeCookie = key => {
  if (window !== 'undefined') {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

// get data from cookie
export const getCookie = key => {
  if (window !== 'undefined') {
    return cookie.get(key);
  }
};

// set data in localstorage
export const setLocalStorage = (key, value) => {
  if (window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from localstorage
export const removeLocalStorage = key => {
  if (window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// get data from localstorage
export const getLocalStorage = key => {
  if (window !== 'undefined') {
    return localStorage.getItem(key);
  }
};

// auth user
export const authenticate = (response, next) => {
  setCookie('token', response.data.token);
  setLocalStorage('user', response.data.user);
  next();
};

// signout
export const signout = next => {
  removeCookie('token');
  removeLocalStorage('user');
};

// get user info
export const isAuth = () => {
  if (window !== 'undefined') {
    const cookieChecked = getCookie('token');
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
        return false;
      }
    }
  }
};

// update4 user data in localstorage
export const updateUser = (response, next) => {
  if (window !== 'undefined') {
    let auth = JSON.parse(localStorage.getItem('user'));
    auth = response.data;
    localStorage.setItem('user', JSON.stringify(auth));
  }
  next();
};

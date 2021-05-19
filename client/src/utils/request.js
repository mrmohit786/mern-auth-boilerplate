import axios from 'axios';
import { API } from 'utils/constants';

const client = axios.create({
  baseURL: API.url,
});

// default header for all get request
client.defaults.headers.get['Accept'] = 'application/json';
client.defaults.headers.post['Accept'] = 'application/json';

// timeout : 2.5sec
client.defaults.timeout = 2500;

const request = function (options) {
  const onSuccess = (response) => {
    return response.data;
  };

  const onError = (error) => {
    return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;

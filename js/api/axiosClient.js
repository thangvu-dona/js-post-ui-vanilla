import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  header: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  // console.log('request interceptors ', config);

  // Attack token to request if exists (exp: for login)
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axiosClient.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log('axioClient - response error for all res ' , error.response);

  if (!error.response) throw new Error('Network error. Plese try again!');

  // redirect to login if not login
  if (error.response.status === 401) {
    // clear token, logout
    // ...
    // handle for reponses return error 404

    window.location.assign('/login.html');
    return
  }

  return Promise.reject(error);
});

export default axiosClient;
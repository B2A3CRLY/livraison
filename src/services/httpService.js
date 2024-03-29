import axios from 'axios';
import {
  toast
} from 'react-toastify';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.interceptors.response.use(null, (error) => {
  const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
  if (!expectedError) {
    toast.error('Une erreur innatendu!, verifie ta connextion intenet');
  }
  return Promise.reject(error);
});

function setJwt(jwt) {
  return (jwt ? axios.defaults.headers.common['Authorization'] = `Token ${jwt}` : null);
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt
};
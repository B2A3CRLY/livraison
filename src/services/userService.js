import http from './httpService';
import {
  apiUrl
} from '../config.json';
const apiEndpoit = apiUrl + '/auth/register';

export function register(user) {
  return http.post(apiEndpoit, {
    email: user.email,
    username: user.username,
    password: user.password,
    first_name: user.first_name,
    last_name: user.last_name
  });
}
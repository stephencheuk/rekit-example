// This module will be executed before all other tests are executed,
// so import all necessary modules which should be included for webpack compiling.
import 'babel-polyfill';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import './jsdom-setup';

if (process.env.NODE_ENV === 'test') {
  axios.defaults.baseURL = 'http://localhost';
  axios.defaults.adapter = httpAdapter;
}

import {
  DefaultPage,
} from './';

export default {
  path: 'login',
  name: 'Login',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
  ],
};

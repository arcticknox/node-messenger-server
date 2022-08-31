const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const channelRoute = require('./channel.route');
const messageRoute = require('./message.route');
const orgRoute = require('./org.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/channel',
    route: channelRoute,
  },
  {
    path: '/message',
    route: messageRoute,
  },
  {
    path: '/org',
    route: orgRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;

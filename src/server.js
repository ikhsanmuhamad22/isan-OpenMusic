const Hapi = require('@hapi/hapi');
const music = require('./api/music');
const MusicService = require('./service/postgres/MusicService');
require('dotenv').config();

const init = async () => {
  const musicService = new MusicService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register({
    plugin: music,
    options: {
      service: musicService,
    },
  });

  await server.start();
  console.log('Server running on', server.info.uri);
};

init();

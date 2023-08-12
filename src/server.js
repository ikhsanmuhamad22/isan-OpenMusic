const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const albums = require('./api/albums');
const AlbumsService = require('./service/postgres/albumsService');
const AlbumsValidator = require('./validator/albums');

const user = require('./api/user');
const UsersService = require('./service/postgres/UserService');
const UsersValidator = require('./validator/user');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./service/postgres/authenticationsService');
const AuthenticationsValidator = require('./validator/authentications');

const playlists = require('./api/playlists');
const PlaylistsService = require('./service/postgres/playlistsService');
const SongsService = require('./service/postgres/songsService');
const CollaborationsService = require('./service/postgres/collaborationsService');
const ActivitiesService = require('./service/postgres/activitiesService');

const TokenManager = require('./tokenize/TokenManager');
const ClientError = require('./exceptions/ClientError');
const PlaylistsValidator = require('./validator/playlists');
const songs = require('./api/songs');
const SongsValidator = require('./validator/songs');
const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');
const activities = require('./api/activities');

require('dotenv').config();

const init = async () => {
  const albumsService = new AlbumsService();
  const playlistsService = new PlaylistsService();
  const songsService = new SongsService();
  const collaborationsService = new CollaborationsService();
  const activitiesService = new ActivitiesService();
  const userService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: activities,
      options: {
        service: activitiesService,
      },
    },
    {
      plugin: user,
      options: {
        service: userService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    // console.log(response);
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log('Server running on', server.info.uri);
};

init();

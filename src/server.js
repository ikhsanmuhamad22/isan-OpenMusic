const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const inert = require('@hapi/inert');

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
const ExportsValidator = require('./validator/exports');
const exportss = require('./api/exportss');
const ProducerService = require('./service/rabbitmq/producerService');
const StorageService = require('./service/storage/storageService');
const UploadsValidator = require('./validator/uploads');
const uploads = require('./api/uploads');
const Verify = require('./service/postgres/verifyService');
const albumLikes = require('./api/albumLikes');
const AlbumLikesService = require('./service/postgres/albumsLikeService');
const CacheService = require('./service/redis/CacheService');
const config = require('./utils/config');

require('dotenv').config();

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService();
  const playlistsService = new PlaylistsService();
  const songsService = new SongsService();
  const collaborationsService = new CollaborationsService();
  const activitiesService = new ActivitiesService();
  const userService = new UsersService();
  const verifyService = new Verify();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images-cover'));
  const albumLikesService = new AlbumLikesService(cacheService);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
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
    {
      plugin: inert,
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
        verifyService,
      },
    },
    {
      plugin: activities,
      options: {
        service: activitiesService,
        verifyService,
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
    {
      plugin: exportss,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        verifyService,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
        albumsService,
      },
    },
    {
      plugin: albumLikes,
      options: {
        service: albumLikesService,
        verifyService,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
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

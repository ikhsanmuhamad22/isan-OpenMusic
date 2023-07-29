const routes = (handler) => [

  // * albums route
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums/{albumId}',
    handler: handler.getAlbumHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{albumId}',
    handler: handler.editAlbumHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}',
    handler: handler.deleteAlbumHandler,
  },

  // * song route
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllsongsHandler,
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: handler.getsongByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: handler.editSongHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: handler.deleteSongHandler,
  },
];

module.exports = routes;

const routes = (handler) => [
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
];

module.exports = routes;

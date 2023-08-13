const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumsHandler(req, h) {
    const { name, year } = req.payload;
    this._validator.validateAlbumPayload(req.payload);
    const albumId = await this._service.addAlbums({ name, year });
    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumHandler(req, h) {
    const { albumId } = req.params;
    const album = await this._service.getAlbum(albumId);
    const songs = await this._service.getSongByAlbum(albumId);
    const response = h.response({
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          coverUrl: album.cover,
          songs,
        },
      },
    });
    response.code(200);
    return response;
  }

  async editAlbumHandler(req, h) {
    this._validator.validateAlbumPayload(req.payload);
    const id = req.params.albumId;
    const { name, year } = req.payload;
    const album = await this._service.putAlbum(id, { name, year });
    const response = h.response({
      status: 'success',
      message: 'data berhasil di update',
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAlbumHandler(req, h) {
    const id = req.params.albumId;
    await this._service.deleteAlbum(id);
    const response = h.response({
      status: 'success',
      message: 'data berhasil di hapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumHandler;

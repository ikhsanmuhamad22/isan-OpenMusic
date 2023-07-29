const autoBind = require('auto-bind');

class MusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  // * Handler buat albums
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
    // eslint-disable-next-line no-unused-vars
    const album = await this._service.deleteAlbum(id);
    const response = h.response({
      status: 'success',
      message: 'data berhasil di hapus',
    });
    response.code(200);
    return response;
  }

  // * Handler songs
  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = req.payload;
    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'berhasil menambah lagu',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getAllsongsHandler(req, h) {
    const { title, performer } = req.query;
    const songs = await this._service.getAllsongs(title, performer);
    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  async getsongByIdHandler(req, h) {
    const { songId } = req.params;
    const song = await this._service.getSongById(songId);
    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  async editSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const id = req.params.songId;
    const {
      title,
      year,
      performer,
      genre,
      duration,
    } = req.payload;
    const song = await this._service.putSong(id, {
      title,
      year,
      performer,
      genre,
      duration,
    });
    const response = h.response({
      status: 'success',
      message: 'data berhasil di update',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongHandler(req, h) {
    const id = req.params.songId;
    // eslint-disable-next-line no-unused-vars
    const album = await this._service.deletesong(id);
    const response = h.response({
      status: 'success',
      message: 'data berhasil di hapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = MusicHandler;

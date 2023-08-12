const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

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
    await this._service.putSong(id, {
      title,
      year,
      performer,
      genre,
      duration,
    });
    const response = h.response({
      status: 'success',
      message: 'data berhasil di update',
    });
    response.code(200);
    return response;
  }

  async deleteSongHandler(req, h) {
    const id = req.params.songId;
    await this._service.deletesong(id);
    const response = h.response({
      status: 'success',
      message: 'data berhasil di hapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;

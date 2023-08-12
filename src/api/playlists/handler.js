const autoBind = require('auto-bind');
const Verify = require('../../service/postgres/verifyService');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this._verify = new Verify();

    autoBind(this);
  }

  async postPlaylistHandler(req, h) {
    this._validator.validatePlaylistPayload(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { name } = req.payload;
    const playlistId = await this._service.addPlaylist(credentialId, name);
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async postSongsToPlaylistsHandler(req, h) {
    await this._validator.validatePlaylistPayload(req.payload);

    const { songId } = req.payload;
    const playlistId = req.params.playlistIdJohn;
    const { id: credentialId } = req.auth.credentials;
    const action = 'add';

    await this._verify.verifyPlaylistAccess(playlistId, credentialId);
    await this._verify.verifySong(songId);
    await this._service.addActivities(playlistId, songId, credentialId, action);

    await this._service.addSongToPlaylists(playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'berhasi menambah lagu ke playlists',
    });
    response.code(201);
    return response;
  }

  async getSongByPlaylistsHandler(req, h) {
    const playlistId = req.params.playlistIdJohn;
    const { id: credentialId } = req.auth.credentials;
    await this._verify.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getSongByPlaylistId(playlistId, credentialId);
    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongsByPlaylistHandler(req, h) {
    await this._validator.validatePlaylistPayload(req.payload);
    const playlistId = req.params.playlistIdJohn;
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;
    const action = 'delete';

    await this._verify.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongsByPlaylistId(playlistId, songId);
    await this._service.addActivities(playlistId, songId, credentialId, action);

    const response = h.response({
      status: 'success',
      message: 'berhasil menghapus lagu',
    });
    response.code(200);
    return response;
  }

  async deletePlaylistHandler(req, h) {
    const playlistId = req.params.playlistIdJohn;
    const { id: credentialId } = req.auth.credentials;
    await this._verify.verifyPlaylist(playlistId, credentialId);

    await this._service.deletePlaylist(playlistId);
    const response = h.response({
      status: 'success',
      message: 'berhasil menghapus playlists',
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistsHandler;

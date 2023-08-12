const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/authorizationError');

class Verify {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistAccess(playlistId, credentialId) {
    try {
      await this.verifyPlaylist(playlistId, credentialId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this.verifyCollaborator(playlistId, credentialId);
      } catch {
        throw error;
      }
    }
  }

  async verifyPlaylist(playlistId, credentialId) {
    const query1 = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const playlist = await this._pool.query(query1);
    if (!playlist.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }
    const result = playlist.rows[0];
    if (result.owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyCollaborator(playlistId, credentialId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, credentialId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }

  async verifyUser(userId) {
    const query2 = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };
    const users = await this._pool.query(query2);
    if (!users.rows.length) {
      throw new NotFoundError('users tidak ditemukan');
    }
  }

  async verifySong(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const song = await this._pool.query(query);
    if (!song.rows.length) {
      throw new NotFoundError('song tidak ditemukan');
    }
  }
}

module.exports = Verify;

const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(credentialId, name) {
    const id = `playlists-${nanoid(16)}`;
    const owner = credentialId;
    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, owner, name],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('gagal menambah playlist');
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
          LEFT JOIN users ON users.id = playlists.owner
          LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
          WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };
    let result = await this._pool.query(query);
    if (!result.rowCount) {
      query.text = 'SELECT playlists.id, playlists.name, users.username FROM playlists JOIN users ON playlists.owner = users.id WHERE users.id = $1';
      result = await this._pool.query(query);
    }
    return result.rows;
  }

  async addSongToPlaylists(playlistId, songId) {
    const id = `playlist-song${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('gagal menambah lagu ke playlist');
    }
    return result.rows[0];
  }

  async getSongByPlaylistId(playlistId) {
    const query1 = {
      text: `SELECT playlists.id, playlists.name, users.username 
            FROM playlists
            LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
            LEFT JOIN songs ON songs.id = playlist_songs.song_id
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const query2 = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs JOIN playlist_songs ON songs.id = playlist_songs.song_id JOIN playlists ON playlist_songs.playlist_id = playlists.id WHERE playlists.id = $1',
      values: [playlistId],
    };
    const song = await this._pool.query(query2);
    const playlist = await this._pool.query(query1);
    const result = {
      ...playlist.rows[0],
      songs: [...song.rows],
    };
    return result;
  }

  async deleteSongsByPlaylistId(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('gagal menghapus lagu dari playlist');
    }
    return result.rows[0];
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE playlists.id = $1 RETURNING id',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('gagal menghapus lagu dari playlist');
    }
  }

  async addActivities(
    playlistId, songId, credentialId, action,
  ) {
    const id = `activities-${nanoid(16)}`;
    const timeStamp = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, credentialId, action, timeStamp],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Aktifitas lagu gagal dibuat');
    }
  }
}

module.exports = PlaylistsService;

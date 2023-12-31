const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbums({ name, year }) {
    const id = `albums-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('gagal menambah albums');
    }

    return result.rows[0].id;
  }

  async getAlbum(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('id tidak ditemukan');
    }
    return result.rows[0];
  }

  async putAlbum(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('id tidak ditemukan');
    }
  }

  async deleteAlbum(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('id tidak ditemukan');
    }
  }

  async getSongByAlbum(albumId) {
    const query = {
      text: 'SELECT songs.id,songs.title,songs.performer,albums.cover FROM songs JOIN albums ON songs.album_Id = albums.id WHERE songs.album_id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async addAlbumCover({ cover, id }) {
    const query = {
      text: 'UPDATE albums SET cover = $1 where id = $2 RETURNING id',
      values: [cover, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;

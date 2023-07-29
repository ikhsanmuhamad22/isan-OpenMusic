const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class MusicService {
  constructor() {
    this._pool = new Pool();
  }

  // * Method buat albums
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

    if (!result.rows.length) {
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

    if (!result.rows.length) {
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

  // * Method buat song

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = `songs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('gagal menambah lagu');
    }
    return result.rows[0].id;
  }

  async getAllsongs(title, performer) {
    const query = {
      text: 'SELECT id,title,performer FROM songs',
      values: [],
    };

    if (title && performer) {
      query.text += ' WHERE title ILIKE $1 AND performer ILIKE $2';
      query.values.push(`%${title}%`, `%${performer}%`);
    } else if (title) {
      query.text += ' WHERE title ILIKE $1';
      query.values.push(`%${title}%`);
    } else if (performer) {
      query.text += ' WHERE performer ILIKE $1';
      query.values.push(`%${performer}%`);
    }

    const result = await this._pool.query(query);
    const song = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }));
    return song;
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('id tidak ditemukan');
    }
    return result.rows[0];
  }

  async putSong(id, {
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('id tidak ditemukan');
    }
  }

  async deletesong(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('id tidak ditemukan');
    }
  }

  async getSongByAlbum(albumId) {
    const query = {
      text: 'SELECT songs.id,songs.title,songs.performer FROM songs JOIN albums ON songs."albumId" = albums.id WHERE songs."albumId" = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = MusicService;

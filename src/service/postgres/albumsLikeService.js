const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLikes(albumId, credentialId) {
    const id = `album-likes${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_albums_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, credentialId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('gagal menambah albums');
    }

    await this._cacheService.delete(`likes:${albumId}`);
    return result.rows[0].id;
  }

  async userHasLikes(albumId, credentialId) {
    const query = {
      text: 'SELECT * FROM user_albums_likes WHERE user_id = $1 AND album_id = $2',
      values: [credentialId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('tidak bisa like lebih dari sekali');
    }
  }

  async getlikesAlbum(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return {
        count: JSON.parse(result),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_albums_likes WHERE "album_id" = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new InvariantError('Album tidak mempunyai like');
      }

      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rowCount));

      return {
        count: result.rows.length,
      };
    }
  }

  async deleteLikeAlbum(albumId, credentialId) {
    const query = {
      text: 'DELETE FROM user_albums_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, credentialId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`likes:${albumId}`);

    if (!result.rows.length) {
      throw new NotFoundError('userId tidak ditemukan');
    }
  }
}

module.exports = AlbumLikesService;

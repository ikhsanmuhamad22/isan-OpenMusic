const { Pool } = require('pg');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time 
            FROM playlist_song_activities
            JOIN playlists ON playlist_song_activities.playlist_id = playlists.id
            JOIN songs ON playlist_song_activities.song_id = songs.id
            JOIN users ON playlist_song_activities.user_id = users.id
            WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ActivitiesService;

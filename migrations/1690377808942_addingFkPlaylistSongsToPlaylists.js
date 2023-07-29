/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id');
};

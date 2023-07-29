/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createConstraint('playlist_songs', 'fk_playlist_songs.song_Id_songs.id', {
    foreignKeys: {
      columns: 'song_id',
      references: 'songs(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_song', 'fk_playlist_songs.song_Id_songs.id');
};

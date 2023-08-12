exports.up = (pgm) => {
  pgm.createConstraint('playlist_song_activities', 'fk_playlist_songs_activities.playlist_Id_playlists.id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_songs_activities.playlist_Id_playlists.id');
};

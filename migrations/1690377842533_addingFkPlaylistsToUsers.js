/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createConstraint('playlists', 'fk_playlists.owner_users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
};

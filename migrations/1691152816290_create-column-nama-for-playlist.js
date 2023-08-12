exports.up = (pgm) => {
  pgm.addColumns('playlists', {
    name: { type: 'text', notNull: true },
  });
};

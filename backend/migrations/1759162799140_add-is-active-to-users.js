/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addColumns('users', {
    is_active: { 
      type: 'boolean', 
      notNull: true, 
      default: true 
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['is_active']);
};
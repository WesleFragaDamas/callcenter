/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addColumns('pause_types', {
    timer_type: { 
      type: 'varchar(20)', 
      notNull: true, 
      default: 'REGRESSIVE' 
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('pause_types', ['timer_type']);
};
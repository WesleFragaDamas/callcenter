/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Adiciona a restrição UNIQUE à coluna 'name' da tabela 'pause_types'
  pgm.addConstraint('pause_types', 'pause_types_name_unique', {
    unique: 'name',
  });
};

exports.down = (pgm) => {
  // Remove a restrição caso precisemos reverter a migração
  pgm.dropConstraint('pause_types', 'pause_types_name_unique');
};
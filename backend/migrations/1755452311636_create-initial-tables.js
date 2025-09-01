/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // 1. Criar a tabela 'roles'
  pgm.createTable('roles', {
    id: 'id', // Atalho para SERIAL PRIMARY KEY
    name: { type: 'varchar(50)', notNull: true, unique: true },
  });

  // 2. Criar a tabela 'users'
  pgm.createTable('users', {
    id: 'id',
    username: { type: 'varchar(100)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    full_name: { type: 'varchar(255)' },
    role_id: {
      type: 'integer',
      notNull: true,
      references: '"roles"', // Referencia a tabela 'roles'
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });
};

exports.down = (pgm) => {
  // A ordem de deleção é a inversa da criação
  pgm.dropTable('users');
  pgm.dropTable('roles');
};
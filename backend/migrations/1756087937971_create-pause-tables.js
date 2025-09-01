/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Tabela para os TIPOS de pausa (ex: Pausa Café, Almoço)
  pgm.createTable('pause_types', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    duration_minutes: { type: 'integer', notNull: true },
  });

  // Tabela para registrar as SOLICITAÇÕES de pausa
  pgm.createTable('pause_requests', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"', // Chave estrangeira para a tabela 'users'
      onDelete: 'CASCADE',
    },
    pause_type_id: {
      type: 'integer',
      // Permitimos nulo por enquanto, caso o supervisor force uma pausa genérica
      references: '"pause_types"',
      onDelete: 'SET NULL',
    },
    status: { type: 'varchar(50)', notNull: true, default: 'PENDING' }, // PENDING, APPROVED, IN_PROGRESS, COMPLETED, REJECTED
    requested_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    handled_by: { // ID do supervisor que aprovou/rejeitou
      type: 'integer',
      references: '"users"',
      onDelete: 'SET NULL',
    },
    handled_at: { type: 'timestamptz' },
    start_time: { type: 'timestamptz' },
    end_time: { type: 'timestamptz' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('pause_requests');
  pgm.dropTable('pause_types');
};
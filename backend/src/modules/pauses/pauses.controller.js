const db = require('../../config/database');

const PAUSE_LIMIT_PERCENTAGE = 0.15; // 15%

const checkQueueAndPromote = async (db) => {
  try {
    const operatorsResult = await db.query("SELECT COUNT(id) AS total_operators FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'OPERATOR')");
    const totalOperators = parseInt(operatorsResult.rows[0].total_operators, 10);
    if (totalOperators === 0) return;
    
    const pauseLimit = totalOperators > 0 ? Math.max(1, Math.floor(totalOperators * PAUSE_LIMIT_PERCENTAGE)) : 0;

    const onPauseResult = await db.query("SELECT COUNT(id) AS operators_on_pause FROM pause_requests WHERE status = 'IN_PROGRESS'");
    const operatorsOnPause = parseInt(onPauseResult.rows[0].operators_on_pause, 10);

    const availableSlots = pauseLimit - operatorsOnPause;
    if (availableSlots <= 0) {
      console.log('Fila verificada, sem vagas disponíveis.');
      return;
    }

    const nextInQueueResult = await db.query(`SELECT id FROM pause_requests WHERE status = 'QUEUED' ORDER BY requested_at ASC LIMIT $1;`, [availableSlots]);

    if (nextInQueueResult.rows.length > 0) {
      const idsToPromote = nextInQueueResult.rows.map(row => row.id);
      await db.query("UPDATE pause_requests SET status = 'APPROVED' WHERE id = ANY($1::int[])", [idsToPromote]);
      console.log(`Vaga(s) liberada(s)! Solicitações ${idsToPromote.join(', ')} foram aprovadas da fila.`);
    }
  } catch (error) {
    console.error("Erro ao verificar a fila de espera:", error);
  }
};
/**
 * Busca todos os tipos de pausa disponíveis no banco de dados.
 * Usado pelo frontend para popular menus dropdown.
 */
const getPauseTypes = async (req, res) => {
  try {
    const query = 'SELECT * FROM pause_types ORDER BY name';
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar tipos de pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Busca as solicitações de pausa PENDENTES.
 * Usado pela sidebar de notificações do supervisor.
 */
const getPendingRequests = async (req, res) => {
  try {
    const query = `
      SELECT 
        pr.id AS request_id,
        u.full_name AS user_full_name,
        pt.name AS pause_type_name,
        pr.status
      FROM pause_requests pr
      JOIN users u ON pr.user_id = u.id
      JOIN pause_types pt ON pr.pause_type_id = pt.id
      WHERE pr.status IN ('PENDING', 'QUEUED')
      ORDER BY pr.status DESC, pr.requested_at ASC;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar solicitações pendentes e em fila:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Busca uma solicitação de pausa específica pelo seu ID.
 * Usado pelo operador para verificar o status de sua própria solicitação.
 */
const getRequestById = async (req, res) => {
  const { requestId } = req.params;
  try {
    const query = 'SELECT id, status FROM pause_requests WHERE id = $1';
    const { rows } = await db.query(query, [requestId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar solicitação por ID:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Busca a última solicitação de pausa ATIVA (PENDING, APPROVED, IN_PROGRESS) de um usuário.
 * Usado pelo operador para sincronizar seu estado ao carregar a página.
 */
const getActiveRequestByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT 
        pr.*, 
        pt.duration_minutes,
        pt.timer_type,
        pt.name as pause_type_name
      FROM pause_requests pr
      LEFT JOIN pause_types pt ON pr.pause_type_id = pt.id
      WHERE pr.user_id = $1 AND pr.status IN ('PENDING', 'APPROVED', 'IN_PROGRESS')
      ORDER BY pr.requested_at DESC
      LIMIT 1;
    `;
    const { rows } = await db.query(query, [userId]);
    if (rows.length === 0) {
      return res.status(200).json(null); 
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar solicitação ativa do usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Busca dados para o Dashboard de Monitoramento do Supervisor.
 * Retorna um objeto com a lista de pausas ativas e estatísticas da equipe.
 */
const getPauseMonitor = async (req, res) => {
  try {
    const pausesQuery = `
      SELECT 
        pr.id AS request_id,
        pr.user_id,
        u.full_name AS user_full_name,
        pt.name AS pause_type_name,
        pt.duration_minutes,
        pt.timer_type,
        pr.status,
        pr.start_time
      FROM pause_requests pr
      JOIN users u ON pr.user_id = u.id
      JOIN pause_types pt ON pr.pause_type_id = pt.id
      WHERE pr.status IN ('APPROVED', 'IN_PROGRESS')
      ORDER BY 
        CASE pr.status WHEN 'IN_PROGRESS' THEN 1 ELSE 2 END, 
        pr.start_time ASC, pr.requested_at ASC;
    `;
    const operatorsQuery = `
      SELECT COUNT(u.id) AS total_operators
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'OPERATOR';
    `;
    const [pausesResult, operatorsResult] = await Promise.all([
      db.query(pausesQuery),
      db.query(operatorsQuery)
    ]);
    const activePauses = pausesResult.rows;
    const totalOperators = parseInt(operatorsResult.rows[0].total_operators, 10);
    const operatorsOnPause = activePauses.filter(p => p.status === 'IN_PROGRESS').length;
    const responseData = {
      activePauses: activePauses,
      stats: { totalOperators: totalOperators, operatorsOnPause: operatorsOnPause }
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Erro ao buscar dados para o monitor de pausas:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// ====================================================================
// FUNÇÕES DE AÇÃO DO OPERADOR (POST)
// ====================================================================

/**
 * Registra uma nova solicitação de pausa.
 */
const requestPause = async (req, res) => {
  const { userId, pauseTypeId } = req.body;
  if (!userId || !pauseTypeId) {
    return res.status(400).json({ message: 'ID do usuário e tipo de pausa são obrigatórios.' });
  }
  try {
    const existingPauseQuery = `SELECT * FROM pause_requests WHERE user_id = $1 AND status IN ('PENDING', 'APPROVED', 'IN_PROGRESS')`;
    const { rows: existingPauses } = await db.query(existingPauseQuery, [userId]);
    if (existingPauses.length > 0) {
      return res.status(409).json({ message: 'Você já possui uma pausa pendente ou em andamento.' });
    }
    const insertQuery = `INSERT INTO pause_requests (user_id, pause_type_id, status) VALUES ($1, $2, 'PENDING') RETURNING *`;
    const { rows } = await db.query(insertQuery, [userId, pauseTypeId]);
    res.status(201).json({ message: 'Solicitação de pausa registrada com sucesso!', request: rows[0] });
  } catch (error) {
    console.error('Erro ao registrar solicitação de pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Inicia uma pausa que já foi aprovada.
 */
const startPause = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.body;
  try {
    const query = `UPDATE pause_requests SET status = 'IN_PROGRESS', start_time = NOW() WHERE id = $1 AND user_id = $2 AND status = 'APPROVED' RETURNING *;`;
    const { rows } = await db.query(query, [requestId, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pausa não encontrada, não pertence a você ou não foi aprovada.' });
    }
    const detailsQuery = `SELECT pt.duration_minutes, pt.timer_type FROM pause_requests pr JOIN pause_types pt ON pr.pause_type_id = pt.id WHERE pr.id = $1`;
    const detailsResult = await db.query(detailsQuery, [requestId]);
    const responseData = { ...rows[0], ...detailsResult.rows[0] };
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Erro ao iniciar pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Finaliza uma pausa que está em andamento.
 */
const endPause = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.body;
  try {
    const query = `UPDATE pause_requests SET status = 'COMPLETED', end_time = NOW() WHERE id = $1 AND user_id = $2 AND status = 'IN_PROGRESS' RETURNING *;`;
    const { rows } = await db.query(query, [requestId, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pausa não encontrada ou não está em progresso.' });
    }
    await checkQueueAndPromote(db);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao finalizar pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Cancela uma solicitação de pausa PENDENTE.
 */
const cancelRequest = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.body;
  try {
    const query = `UPDATE pause_requests SET status = 'CANCELLED' WHERE id = $1 AND user_id = $2 AND status = 'PENDING' RETURNING *;`;
    const { rows } = await db.query(query, [requestId, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada, já foi tratada ou não pertence a este usuário.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao cancelar solicitação:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// ====================================================================
// FUNÇÕES DE AÇÃO DO SUPERVISOR (POST)
// ====================================================================

/**
 * Aprova uma solicitação de pausa PENDENTE.
 */
const approveRequest = async (req, res) => {
  const { requestId } = req.params;
  const { userId: supervisorId } = req.body;
  try {
    const operatorsResult = await db.query("SELECT COUNT(id) AS total_operators FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'OPERATOR')");
    const totalOperators = parseInt(operatorsResult.rows[0].total_operators, 10);
    const pauseLimit = totalOperators > 0 ? Math.max(1, Math.floor(totalOperators * PAUSE_LIMIT_PERCENTAGE)) : 0;
    const onPauseResult = await db.query("SELECT COUNT(id) AS operators_on_pause FROM pause_requests WHERE status = 'IN_PROGRESS'");
    const operatorsOnPause = parseInt(onPauseResult.rows[0].operators_on_pause, 10);
    let newStatus = (operatorsOnPause < pauseLimit) ? 'APPROVED' : 'QUEUED';
    const updateQuery = `UPDATE pause_requests SET status = $1, handled_by = $2, handled_at = NOW() WHERE id = $3 AND status = 'PENDING' RETURNING *;`;
    const { rows } = await db.query(updateQuery, [newStatus, supervisorId, requestId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada ou já foi tratada.' });
    }
    console.log(`Solicitação ${requestId} movida para o status: ${newStatus}`);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao aprovar/colocar em fila a solicitação:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Rejeita uma solicitação de pausa PENDENTE.
 */
const rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.body;
  try {
    const query = `UPDATE pause_requests SET status = 'REJECTED', handled_by = $1, handled_at = NOW() WHERE id = $2 AND status = 'PENDING' RETURNING *;`;
    const { rows } = await db.query(query, [userId, requestId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada ou já foi tratada.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Força o início de uma pausa para um operador.
 */
const forcePause = async (req, res) => {
  const { operatorId, pauseTypeId, supervisorId } = req.body;
  if (!operatorId || !pauseTypeId || !supervisorId) {
    return res.status(400).json({ message: 'IDs do operador, tipo de pausa e supervisor são obrigatórios.' });
  }
  try {
    const existingPauseQuery = `SELECT * FROM pause_requests WHERE user_id = $1 AND status IN ('PENDING', 'APPROVED', 'IN_PROGRESS')`;
    const { rows: existingPauses } = await db.query(existingPauseQuery, [operatorId]);
    if (existingPauses.length > 0) {
      return res.status(409).json({ message: 'Este operador já possui uma pausa ativa.' });
    }
    const insertQuery = `INSERT INTO pause_requests (user_id, pause_type_id, status, handled_by, handled_at, start_time) VALUES ($1, $2, 'IN_PROGRESS', $3, NOW(), NOW()) RETURNING *;`;
    const { rows } = await db.query(insertQuery, [operatorId, pauseTypeId, supervisorId]);
    res.status(201).json({ message: 'Pausa forçada com sucesso!', request: rows[0] });
  } catch (error) {
    console.error('Erro ao forçar pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// ====================================================================
// FUNÇÕES DE ADMINISTRAÇÃO (CRUD de Tipos de Pausa)
// ====================================================================

/**
 * Cria um novo tipo de pausa.
 */
const createPauseType = async (req, res) => {
  const { name, duration_minutes, timer_type } = req.body;
  if (!name || typeof duration_minutes !== 'number') {
    return res.status(400).json({ message: 'Nome e duração (como número) são obrigatórios.' });
  }
  try {
    const query = `INSERT INTO pause_types (name, duration_minutes, timer_type) VALUES ($1, $2, $3) RETURNING *;`;
    const { rows } = await db.query(query, [name, duration_minutes, timer_type || 'REGRESSIVE']);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar tipo de pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Atualiza um tipo de pausa existente.
 */
const updatePauseType = async (req, res) => {
  const { typeId } = req.params;
  const { name, duration_minutes, timer_type } = req.body;
  if (!name || typeof duration_minutes !== 'number') {
    return res.status(400).json({ message: 'Nome e duração (como número) são obrigatórios.' });
  }
  try {
    const query = `UPDATE pause_types SET name = $1, duration_minutes = $2, timer_type = $3 WHERE id = $4 RETURNING *;`;
    const { rows } = await db.query(query, [name, duration_minutes, timer_type, typeId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tipo de pausa não encontrado.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar tipo de pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * Deleta um tipo de pausa.
 */
const deletePauseType = async (req, res) => {
  const { typeId } = req.params;
  try {
    const query = 'DELETE FROM pause_types WHERE id = $1 RETURNING *;';
    const { rows } = await db.query(query, [typeId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tipo de pausa não encontrado.' });
    }
    res.status(200).json({ message: 'Tipo de pausa deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar tipo de pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO (NOVA): Força a finalização de uma pausa de um operador.
 * Usada por um supervisor.
 */
const forceEndPause = async (req, res) => {
  const { requestId } = req.params;
  const { supervisorId } = req.body;
  try {
    const query = `UPDATE pause_requests SET status = 'COMPLETED', end_time = NOW(), handled_by = $1 WHERE id = $2 AND status = 'IN_PROGRESS' RETURNING *;`;
    const { rows } = await db.query(query, [supervisorId, requestId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pausa não encontrada ou não está em progresso.' });
    }
    await checkQueueAndPromote(db);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao forçar finalização de pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// Exporta todas as funções para serem usadas pelo arquivo de rotas.
module.exports = {
  getPauseTypes,
  requestPause,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  cancelRequest,
  getRequestById,
  startPause,
  endPause,
  getActiveRequestByUser,
  getPauseMonitor,
  forcePause,
  createPauseType,
  updatePauseType,
  deletePauseType,
  forceEndPause,

};
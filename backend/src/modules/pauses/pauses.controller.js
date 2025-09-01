const db = require('../../config/database');

/**
 * FUNÇÃO 1: Busca todos os tipos de pausa.
 */
const getPauseTypes = async (req, res) => {
  console.log(">>> ROTA /types ACIONADA");
  try {
    console.log(">>> Executando query para buscar tipos de pausa...");
    const query = 'SELECT * FROM pause_types ORDER BY name';
    const { rows } = await db.query(query);
    console.log(">>> Query executada com sucesso. Tipos encontrados:", rows.length);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar tipos de pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO 2: Registra uma nova solicitação de pausa.
 */
const requestPause = async (req, res) => {
  const { userId, pauseTypeId } = req.body;
  if (!userId || !pauseTypeId) {
    return res.status(400).json({ message: 'ID do usuário e tipo de pausa são obrigatórios.' });
  }
  try {
    const existingPauseQuery = `
      SELECT * FROM pause_requests 
      WHERE user_id = $1 AND status IN ('PENDING', 'IN_PROGRESS', 'APPROVED')
    `;
    const { rows: existingPauses } = await db.query(existingPauseQuery, [userId]);
    if (existingPauses.length > 0) {
      return res.status(409).json({ message: 'Você já possui uma pausa pendente ou em andamento.' });
    }
    const insertQuery = `
      INSERT INTO pause_requests (user_id, pause_type_id, status) 
      VALUES ($1, $2, 'PENDING') 
      RETURNING *
    `;
    const { rows } = await db.query(insertQuery, [userId, pauseTypeId]);
    const newRequest = rows[0];
    console.log('Nova solicitação de pausa registrada:', newRequest);
    res.status(201).json({ 
      message: 'Solicitação de pausa registrada com sucesso!',
      request: newRequest,
    });
  } catch (error) {
    console.error('Erro ao registrar solicitação de pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO 3: Busca as solicitações pendentes para o supervisor.
 */
const getPendingRequests = async (req, res) => {
  try {
    const query = `
      SELECT 
        pr.id AS request_id,
        u.full_name AS user_full_name,
        pt.name AS pause_type_name,
        pt.duration_minutes
      FROM pause_requests pr
      JOIN users u ON pr.user_id = u.id
      JOIN pause_types pt ON pr.pause_type_id = pt.id
      WHERE pr.status = 'PENDING'
      ORDER BY pr.requested_at ASC;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error)
 {
    console.error('Erro ao buscar solicitações pendentes:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO 4: Aprova uma solicitação de pausa.
 */
const approveRequest = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.body;
  try {
    const query = `
      UPDATE pause_requests 
      SET status = 'APPROVED', handled_by = $1, handled_at = NOW() 
      WHERE id = $2 AND status = 'PENDING'
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, requestId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada ou já foi tratada.' });
    }
    console.log('Solicitação aprovada:', rows[0]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO 5: Rejeita uma solicitação de pausa.
 */
const rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.body;
  try {
    const query = `
      UPDATE pause_requests 
      SET status = 'REJECTED', handled_by = $1, handled_at = NOW()
      WHERE id = $2 AND status = 'PENDING'
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, requestId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada ou já foi tratada.' });
    }
    console.log('Solicitação rejeitada:', rows[0]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// Função 6: Cancela uma solicitação de pausa pelo operador.
const cancelRequest = async (req, res) => {
  const { requestId } = req.params; // ID da solicitação vem da URL
  const { userId } = req.body; // ID do operador que está cancelando

  try {
    const query = `
      UPDATE pause_requests 
      SET status = 'CANCELLED'
      WHERE id = $1 AND user_id = $2 AND status = 'PENDING'
      RETURNING *;
    `;
    // Adicionamos a checagem 'user_id = $2' por segurança, 
    // para garantir que um operador só possa cancelar suas próprias solicitações.
    const { rows } = await db.query(query, [requestId, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        message: 'Solicitação não encontrada, já foi tratada ou não pertence a este usuário.' 
      });
    }

    console.log('Solicitação cancelada pelo operador:', rows[0]);
    res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Erro ao cancelar solicitação:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO 7 (NOVA): Busca uma solicitação de pausa específica pelo seu ID.
 * Usada pelo operador para verificar o status da sua solicitação pendente.
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
 * FUNÇÃO 8 (NOVA): Inicia uma pausa que já foi aprovada.
 */
const startPause = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.body; // ID do operador que está iniciando

  try {
    const query = `
      UPDATE pause_requests 
      SET status = 'IN_PROGRESS', 
          start_time = NOW()
      WHERE id = $1 AND user_id = $2 AND status = 'APPROVED'
      RETURNING *;
    `;
    const { rows } = await db.query(query, [requestId, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pausa não encontrada, não pertence a você ou não foi aprovada.' });
    }
    
    // Precisamos buscar a duração da pausa para enviar ao frontend
    const durationQuery = `
      SELECT pt.duration_minutes 
      FROM pause_requests pr 
      JOIN pause_types pt ON pr.pause_type_id = pt.id 
      WHERE pr.id = $1
    `;
    const durationResult = await db.query(durationQuery, [requestId]);
    
    const responseData = {
      ...rows[0],
      duration_minutes: durationResult.rows[0].duration_minutes,
    };

    console.log('Pausa iniciada:', responseData);
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Erro ao iniciar pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO 9 (NOVA): Finaliza uma pausa que está em andamento.
 */
const endPause = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.body;

  try {
    const query = `
      UPDATE pause_requests 
      SET status = 'COMPLETED', 
          end_time = NOW()
      WHERE id = $1 AND user_id = $2 AND status = 'IN_PROGRESS'
      RETURNING *;
    `;
    const { rows } = await db.query(query, [requestId, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pausa não encontrada ou não está em progresso.' });
    }

    console.log('Pausa finalizada:', rows[0]);
    res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Erro ao finalizar pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO 10 (NOVA): Busca a última solicitação de pausa ativa de um usuário.
 * Usada pelo operador para sincronizar seu estado ao carregar a página.
 */
const getActiveRequestByUser = async (req, res) => {
  const { userId } = req.params; // ID do usuário vem da URL

  try {
    const query = `
      SELECT 
        pr.*, 
        pt.duration_minutes
      FROM pause_requests pr
      LEFT JOIN pause_types pt ON pr.pause_type_id = pt.id
      WHERE pr.user_id = $1 AND pr.status IN ('PENDING', 'APPROVED', 'IN_PROGRESS')
      ORDER BY pr.requested_at DESC
      LIMIT 1;
    `;
    const { rows } = await db.query(query, [userId]);

    if (rows.length === 0) {
      // É normal não encontrar nada, significa que o usuário não tem pausas ativas
      return res.status(200).json(null); 
    }
    
    res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Erro ao buscar solicitação ativa do usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO 11 (NOVA): Busca todas as pausas Aprovadas ou Em Progresso.
 * Usada pelo Dashboard de Monitoramento do Supervisor.
 */
const getPauseMonitor = async (req, res) => {
  try {
    const query = `
      SELECT 
        pr.id AS request_id,
        pr.user_id, -- GARANTA QUE ESTA LINHA EXISTA!
        u.full_name AS user_full_name,
        pt.name AS pause_type_name,
        pt.duration_minutes,
        pr.status,
        pr.start_time
      FROM pause_requests pr
      JOIN users u ON pr.user_id = u.id
      JOIN pause_types pt ON pr.pause_type_id = pt.id
      WHERE pr.status IN ('APPROVED', 'IN_PROGRESS')
      ORDER BY 
        CASE pr.status
          WHEN 'IN_PROGRESS' THEN 1
          WHEN 'APPROVED' THEN 2
        END, 
        pr.start_time ASC, 
        pr.requested_at ASC;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Erro ao buscar dados para o monitor de pausas:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * FUNÇÃO 12 (NOVA): Força o início de uma pausa para um operador.
 */
const forcePause = async (req, res) => {
  const { operatorId, pauseTypeId, supervisorId } = req.body;

  if (!operatorId || !pauseTypeId || !supervisorId) {
    return res.status(400).json({ message: 'IDs do operador, tipo de pausa e supervisor são obrigatórios.' });
  }

  try {
    // Primeiro, verifica se o operador já não tem uma pausa ativa
    const existingPauseQuery = `SELECT * FROM pause_requests WHERE user_id = $1 AND status IN ('PENDING', 'APPROVED', 'IN_PROGRESS')`;
    const { rows: existingPauses } = await db.query(existingPauseQuery, [operatorId]);

    if (existingPauses.length > 0) {
      return res.status(409).json({ message: 'Este operador já possui uma pausa ativa.' });
    }

    // Se estiver livre, cria e já inicia a pausa
    const insertQuery = `
      INSERT INTO pause_requests (user_id, pause_type_id, status, handled_by, handled_at, start_time) 
      VALUES ($1, $2, 'IN_PROGRESS', $3, NOW(), NOW()) 
      RETURNING *;
    `;
    const { rows } = await db.query(insertQuery, [operatorId, pauseTypeId, supervisorId]);
    
    console.log('Pausa forçada pelo supervisor:', rows[0]);
    res.status(201).json({ message: 'Pausa forçada com sucesso!', request: rows[0] });

  } catch (error) {
    console.error('Erro ao forçar pausa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// Exporta TODAS as funções.
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
};

// ... (depois da função getPendingRequests)

const approveRequest = async (req, res) => {
  const { requestId } = req.params; // Pega o ID da URL
  const { userId } = req.body; // Pega o ID do supervisor que está aprovando
  
  try {
    const query = `
      UPDATE pause_requests 
      SET status = 'APPROVED', 
          handled_by = $1, 
          handled_at = NOW() 
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

const rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  const { userId } = req.body;

  try {
    const query = `
      UPDATE pause_requests 
      SET status = 'REJECTED',
          handled_by = $1,
          handled_at = NOW()
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

// Atualize o module.exports para incluir as novas funções
module.exports = {
  getPauseTypes,
  requestPause,
  getPendingRequests,
  approveRequest, // Adicione aqui
  rejectRequest,  // E aqui
};
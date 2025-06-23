// Importa os módulos necessários
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

let db;

try {
    // Inicializa o Firebase Admin com as credenciais do serviço
    const serviceAccount = require('./firebase.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore(); // Obtém instância do Firestore
} catch (error) {
    process.exit(1); // Encerra se não conseguir conectar ao Firebase
}

const app = express();
const port = 3000;

// Configura o CORS para permitir requisições do frontend
app.use(cors({
  origin: 'http://localhost:8080'
}));

app.use(express.json()); // Permite receber JSON no corpo das requisições

// Middleware para verificar o token JWT do Firebase
const verificarToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).send('Não autorizado: Token não fornecido.');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Adiciona o usuário decodificado na requisição
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(403).send('Não autorizado: Token inválido ou expirado.');
  }
};

// Rota raiz da API
app.get('/', (req, res) => {
  res.send('API SISVAC está rodando e conectada ao Firebase!');
});

const vacinasCollection = db.collection('vacinas'); // Referência à coleção "vacinas"

// Lista todas as vacinas
app.get('/vacinas', verificarToken, async (req, res) => {
  try {
    const snapshot = await vacinasCollection.get();
    const vacinas = [];
    snapshot.forEach(doc => {
      vacinas.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(vacinas);
  } catch (error) {
    res.status(500).send('Erro interno do servidor ao buscar vacinas.');
  }
});

// Retorna uma vacina específica pelo ID
app.get('/vacinas/:id', verificarToken, async (req, res) => {
  try {
    const doc = await vacinasCollection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send('Vacina não encontrada.');
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send('Erro interno do servidor ao buscar vacina.');
  }
});

// Adiciona uma nova vacina
app.post('/vacinas', verificarToken, async (req, res) => {
  try {
    const novaVacina = req.body;

    // Validação dos campos obrigatórios
    if (!novaVacina.nome || !novaVacina.fabricante || !novaVacina.doses) {
        return res.status(400).send('Campos nome, fabricante e doses são obrigatórios.');
    }

    if (typeof novaVacina.doses !== 'number' || novaVacina.doses <= 0) {
        return res.status(400).send('Doses deve ser um número positivo.');
    }

    const vacinaParaSalvar = { ...novaVacina };
    delete vacinaParaSalvar.id; // Remove o ID se vier do frontend

    const docRef = await vacinasCollection.add(vacinaParaSalvar); // Salva no Firestore
    res.status(201).json({ id: docRef.id, ...novaVacina });
  } catch (error) {
    res.status(500).send('Erro interno do servidor ao adicionar vacina.');
  }
});

// Atualiza uma vacina existente
app.put('/vacinas/:id', verificarToken, async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;

    // Validação dos dados
    if (!dadosAtualizados.nome || !dadosAtualizados.fabricante || !dadosAtualizados.doses) {
        return res.status(400).send('Campos nome, fabricante e doses são obrigatórios para atualização.');
    }

    if (typeof dadosAtualizados.doses !== 'number' || dadosAtualizados.doses <= 0) {
        return res.status(400).send('Doses deve ser um número positivo para atualização.');
    }

    const dadosParaAtualizar = { ...dadosAtualizados };
    delete dadosParaAtualizar.id;

    await vacinasCollection.doc(id).set(dadosParaAtualizar, { merge: true }); // Atualiza com merge
    res.status(200).json({ id: id, ...dadosAtualizados });
  } catch (error) {
    res.status(500).send('Erro interno do servidor ao atualizar vacina.');
  }
});

// Remove uma vacina pelo ID
app.delete('/vacinas/:id', verificarToken, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || typeof id !== 'string') {
        return res.status(400).send('ID da vacina inválido.');
    }

    await vacinasCollection.doc(id).delete(); // Remove do Firestore
    res.status(204).send(); // Sucesso sem conteúdo
  } catch (error) {
    if (error.code && (error.code === 'not-found' || error.message.includes('No document to delete'))) {
        return res.status(404).send('Vacina não encontrada ou já excluída.');
    }
    res.status(500).send('Erro interno do servidor ao excluir vacina.');
  }
});

// Inicia o servidor na porta definida
app.listen(port, () => console.log(`API SISVAC rodando na porta ${port}`));


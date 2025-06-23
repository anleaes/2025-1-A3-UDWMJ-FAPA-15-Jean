<template>
  <!-- Página de gerenciamento de vacinas -->
  <div class="vacinas-container">
    <h1>Gerenciamento de Vacinas</h1>
    <div class="form-section">
      <h2>{{ editandoVacina ? 'Editar Vacina' : 'Adicionar Nova Vacina' }}</h2>
      <!-- Formulário de cadastro/edição de vacina -->
      <form @submit.prevent="salvarVacina">
        <input v-model="vacinaForm.nome" placeholder="Nome da Vacina" />
        <input v-model="vacinaForm.fabricante" placeholder="Fabricante" />
        <input v-model="vacinaForm.doses" type="number" placeholder="Doses" />
        <button type="submit">{{ editandoVacina ? 'Salvar Edição' : 'Adicionar Vacina' }}</button>
        <button type="button" v-if="editandoVacina" @click="cancelarEdicao">Cancelar Edição</button>
        <p v-if="formErro" class="error-message">{{ formErro }}</p>
      </form>
    </div>
    <div class="list-section">
      <h2>Lista de Vacinas</h2>
      <p v-if="loading">Carregando vacinas...</p>
      <p v-if="listErro" class="error-message">{{ listErro }}</p>
      <!-- Lista de vacinas -->
      <table v-if="vacinas.length" class="tabela-vacinas">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Fabricante</th>
            <th>Doses</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vacina in vacinas" :key="vacina.id">
            <td>{{ vacina.nome }}</td>
            <td>{{ vacina.fabricante }}</td>
            <td>{{ vacina.doses }}</td>
            <td>
              <button @click="editarVacina(vacina)">Editar</button>
              <button @click="excluirVacina(vacina.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="!loading">Nenhuma vacina cadastrada.</p>
      <button @click="carregarVacinas">Atualizar Lista</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VacinasPage',
  // Dados reativos da página
  data() {
    return {
      vacinas: [], // Lista de vacinas obtidas da API
      vacinaForm: {
        id: null,
        nome: '',
        fabricante: '',
        doses: 1
      },
      editandoVacina: false, // Define se o formulário está em modo de edição
      loading: false, // Indica se está carregando dados da API
      formErro: '', // Mensagem de erro no formulário
      listErro: '' // Mensagem de erro ao carregar a lista
    };
  },
  methods: {
    // Carrega as vacinas da API
    async carregarVacinas() {
      this.loading = true;
      this.listErro = '';
      try {
        const response = await this.$axios.get('/vacinas');
        this.vacinas = response.data;
      } catch (error) {
        console.error('Erro ao carregar vacinas:', error);
        this.listErro = 'Não foi possível carregar as vacinas. Verifique a conexão com a API.';
        // Redireciona para o login se o token estiver inválido
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.$router.push('/login');
          localStorage.removeItem('token');
        }
      } finally {
        this.loading = false;
      }
    },

    // Salva uma nova vacina ou atualiza uma existente
    async salvarVacina() {
      this.formErro = '';
      if (!this.vacinaForm.nome || !this.vacinaForm.fabricante || !this.vacinaForm.doses) {
        this.formErro = 'Todos os campos são obrigatórios.';
        return;
      }
      if (this.vacinaForm.doses <= 0) {
        this.formErro = 'Número de doses deve ser positivo.';
        return;
      }

      try {
        if (this.editandoVacina) {
          await this.$axios.put(`/vacinas/${this.vacinaForm.id}`, this.vacinaForm);
          alert('Vacina atualizada com sucesso!');
        } else {
          await this.$axios.post('/vacinas', this.vacinaForm);
          alert('Vacina adicionada com sucesso!');
        }
        this.limparFormulario();
        this.carregarVacinas();
      } catch (error) {
        console.error('Erro ao salvar vacina:', error);
        this.formErro = 'Erro ao salvar vacina. Verifique os dados.';
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.$router.push('/login');
          localStorage.removeItem('token');
        }
      }
    },

    // Preenche o formulário com os dados da vacina selecionada
    editarVacina(vacina) {
      this.vacinaForm = { ...vacina };
      this.editandoVacina = true;
      this.formErro = '';
    },

    // Cancela a edição da vacina
    cancelarEdicao() {
      this.limparFormulario();
    },

    // Exclui a vacina com o ID fornecido
    async excluirVacina(id) {
      if (confirm('Tem certeza que deseja excluir esta vacina?')) {
        try {
          await this.$axios.delete(`/vacinas/${id}`);
          alert('Vacina excluída com sucesso!');
          this.carregarVacinas();
        } catch (error) {
          console.error('Erro ao excluir vacina:', error);
          this.listErro = 'Erro ao excluir vacina.';
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            this.$router.push('/login');
            localStorage.removeItem('token');
          }
        }
      }
    },

    // Limpa o formulário e volta ao modo de adição
    limparFormulario() {
      this.vacinaForm = { id: null, nome: '', fabricante: '', doses: 1 };
      this.editandoVacina = false;
      this.formErro = '';
    }
  },
  // Carrega a lista de vacinas automaticamente ao abrir a página
  mounted() {
    this.carregarVacinas();
  }
};
</script>

<!-- Estilização da página -->
<style scoped>
.vacinas-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
}

h1, h2 {
  color: #333;
}

.form-section, .list-section {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

input {
  display: block;
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  opacity: 0.9;
}

button:last-child {
  margin-right: 0;
}

.tabela-vacinas {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.tabela-vacinas th,
.tabela-vacinas td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.tabela-vacinas th {
  background-color: #f9fafb;
  color: #374151;
}

.tabela-vacinas tr:nth-child(even) {
  background-color: #f3f4f6;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
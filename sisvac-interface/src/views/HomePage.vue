<template>
  <div class="home-container">
    <h1>Bem-vindo ao SISVAC</h1>
    <!-- Mostra o total de vacinas cadastradas -->
    <p>Total de vacinas cadastradas: {{ total }}</p>
    <!-- Botão para atualizar a lista de vacinas -->
    <button @click="buscarVacinas">Atualizar</button>

    <!-- Tabela de vacinas, exibida se houver vacinas cadastradas -->
    <table v-if="vacinas.length" class="tabela-vacinas">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Fabricante</th>
          <th>Doses</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vacina in vacinas" :key="vacina.id">
          <td>{{ vacina.nome }}</td>
          <td>{{ vacina.fabricante }}</td>
          <td>{{ vacina.doses }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Mensagem exibida se não houver vacinas -->
    <p v-else>Nenhuma vacina cadastrada ainda.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      total: 0,       // Total de vacinas cadastradas
      vacinas: []     // Lista de vacinas obtidas da API
    }
  },
  methods: {
    // Busca a lista de vacinas na API
    async buscarVacinas() {
      try {
        const res = await axios.get('http://localhost:3000/vacinas')
        this.vacinas = res.data
        this.total = res.data.length
      } catch (err) {
        console.error('Erro ao buscar vacinas:', err)
      }
    }
  },
  // Busca as vacinas automaticamente quando a página é carregada
  mounted() {
    this.buscarVacinas()
  }
}
</script>

<style scoped>
.home-container {
  padding: 2rem;
  max-width: 800px;
  margin: auto;
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

button {
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #4338ca;
}

.tabela-vacinas {
  width: 100%;
  border-collapse: collapse;
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
</style>
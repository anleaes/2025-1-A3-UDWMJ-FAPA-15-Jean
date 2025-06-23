<template>
  <div id="app">
    <nav v-if="isAuthenticated">
      <router-link to="/home">Home</router-link> |
      <router-link to="/vacinas">Gerenciar Vacinas</router-link> | <button @click="logout" class="logout-button">Sair</button>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { auth } from '@/firebase/auth'; // Importa a instância 'auth' do Firebase
import { signOut } from 'firebase/auth'; // Importa a função signOut

export default {
  data() {
    return {
      isAuthenticated: false // Estado reativo para controlar a visibilidade da navegação
    };
  },
  methods: {
    async logout() {
      try {
        await signOut(auth); // Desloga o usuário do Firebase Authentication
        localStorage.removeItem('token'); // Remove o token JWT
        this.isAuthenticated = false; // Atualiza o estado para esconder a navegação
        this.$router.push('/login'); // Redireciona o usuário para a página de login
        alert('Você foi desconectado.');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout. Tente novamente.');
      }
    },
    // Método para verificar o status de autenticação baseado no token
    checkAuthStatus() {
      this.isAuthenticated = !!localStorage.getItem('token');
    }
  },
  watch: {
    // Observa mudanças na rota. Cada vez que a rota muda, verifica o status de autenticação.
    $route() {
      this.checkAuthStatus();
    }
  },
  created() {
    // Verifica o status de autenticação quando o App.vue é criado (ao carregar a aplicação)
    this.checkAuthStatus();
  }
};
</script>

<style>
/* Estilos*/
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}

nav {
  padding: 30px;
  border-bottom: 1px solid #ccc;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 15px;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.logout-button {
  background-color: #f44336;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 20px;
}

.logout-button:hover {
  background-color: #da190b;
}
</style>
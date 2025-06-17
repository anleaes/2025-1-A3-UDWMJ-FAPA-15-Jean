import { createApp } from 'vue' // Inicia a aplicação Vue
import App from './App.vue'     // Componente raiz
import router from './router'   // Rotas da aplicação
import axios from 'axios'       // Biblioteca HTTP

const app = createApp(App)

// Configura a URL base da API
axios.defaults.baseURL = 'http://localhost:3000';

// Adiciona o token JWT ao cabeçalho Authorization em cada requisição
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Torna o Axios acessível via this.$axios nos componentes
app.config.globalProperties.$axios = axios;

app.use(router)         // Usa o Vue Router
app.mount('#app')       // Monta a aplicação no elemento HTML
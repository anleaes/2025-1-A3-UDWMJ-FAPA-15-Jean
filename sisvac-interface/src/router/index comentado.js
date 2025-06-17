// sisvac-interface/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import HomePage from '../views/HomePage.vue';
import VacinasPage from '../views/VacinasPage.vue'; // <--- Importe a nova página

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true } // Protege esta rota
  },
  {
    path: '/vacinas', // <--- Nova rota para gerenciamento de vacinas
    name: 'Vacinas',
    component: VacinasPage,
    meta: { requiresAuth: true } // Protege esta rota
  },
  {
    path: '/',
    redirect: '/login' // Redireciona a rota raiz para o login por padrão
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard: Essencial para proteger as rotas e gerenciar o fluxo de autenticação
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // Verifica se há um token JWT no localStorage

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Cenário 1: Rota requer autenticação E usuário NÃO está autenticado
    // Redireciona para a página de login
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // Cenário 2: Usuário está na página de login E JÁ está autenticado
    // Redireciona para a página inicial (Home) para evitar que ele acesse o login estando logado
    next('/home');
  } else {
    // Cenário 3: Rota não requer autenticação OU usuário está autenticado
    // Permite a navegação normalmente
    next();
  }
});

export default router;
<template>
  <!-- Estrutura da tela de login -->
  <div class="login-container">
    <div class="login-box">
      <h1>Login SISVAC</h1>
      <input v-model="email" placeholder="Email" @keyup.enter="login" />
      <input v-model="senha" type="password" placeholder="Senha" @keyup.enter="login" />
      <button @click="login">Entrar</button>
      <p v-if="erro" class="erro">{{ erro }}</p>
    </div>
  </div>
</template>

<script>
// Importa autenticação do Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/auth";

export default {
  data() {
    return {
      email: "",
      senha: "",
      erro: ""
    };
  },
  methods: {
    // Realiza o login e redireciona
    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.senha);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem("token", token);
        this.$router.push("/home");
      } catch (err) {
        this.erro = "Erro ao fazer login: " + err.message;
      }
    }
  }
};
</script>

<style scoped>
/* Estilização da página */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f3f4f6;
}

.login-box {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.login-box h1 {
  text-align: center;
  color: #111827;
}

.login-box input {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

.login-box input:focus {
  border-color: #6366f1;
}

.login-box button {
  padding: 0.75rem;
  background-color: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-box button:hover {
  background-color: #4338ca;
}

.erro {
  color: red;
  text-align: center;
  font-size: 0.9rem;
}

/* Remove scroll na tela de login pra não ficar enchendo o saco*/
:global(html), :global(body), :global(#app) {
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
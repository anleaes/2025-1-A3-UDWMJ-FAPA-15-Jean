// Importa funções do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuração do Firebase do projeto
const firebaseConfig = {
  apiKey: "AIzaSyAYhnepi_ZbSxVHJ2x8wa7kZXZBpuhvr7Q",
  authDomain: "api-a3-sdm.firebaseapp.com",
  projectId: "api-a3-sdm",
  storageBucket: "api-a3-sdm.firebasestorage.app",
  messagingSenderId: "963831908039",
  appId: "1:963831908039:web:cdb5e074748756118120e2",
  measurementId: "G-P4BR62K0K3"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);
// Inicializa o Analytics apenas se estiver no navegador
if (typeof window !== "undefined") {
  getAnalytics(app);
}
// Exporta o módulo de autenticação
const auth = getAuth(app);
export { auth };
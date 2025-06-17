
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAYhnepi_ZbSxVHJ2x8wa7kZXZBpuhvr7Q",
  authDomain: "api-a3-sdm.firebaseapp.com",
  projectId: "api-a3-sdm",
  storageBucket: "api-a3-sdm.firebasestorage.app",
  messagingSenderId: "963831908039",
  appId: "1:963831908039:web:cdb5e074748756118120e2",
  measurementId: "G-P4BR62K0K3"
};

// Inicializar firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
const auth = getAuth(app);

export { auth };
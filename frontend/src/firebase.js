// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBphl7V5Cg7_f4V0WtFHJ5oRmBFj4w6kis",
  authDomain: "educationai-1321b.firebaseapp.com",
  projectId: "educationai-1321b",
  storageBucket: "educationai-1321b.firebasestorage.app",
  messagingSenderId: "733987379933",
  appId: "1:733987379933:web:52580e9efcc140ee9fd934",
  measurementId: "G-28FZZHWVS2"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

export default app;
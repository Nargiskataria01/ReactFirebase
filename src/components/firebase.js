import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUrIFCUDIK-WR1Zeb9bB5-HzjS5WqjKYU",
  authDomain: "login-6e349.firebaseapp.com",
  databaseURL: "https://login-6e349-default-rtdb.firebaseio.com",
  projectId: "login-6e349",
  storageBucket: "login-6e349.appspot.com",
  messagingSenderId: "228797377533",
  appId: "1:228797377533:web:5f663ad5c609ffcff04794"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCQ8Q2fEIJIM_tFE6KNhBOM_Zxv3K2xwnk",
//   authDomain: "assignment1-89cf0.firebaseapp.com",
//   projectId: "assignment1-89cf0",
//   storageBucket: "assignment1-89cf0.appspot.com",
//   messagingSenderId: "12701703518",
//   appId: "1:12701703518:web:93cc6139a5eb8ccd4043cf",
//   measurementId: "G-CVERWF5FHF"
// };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {

  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);

    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password,navigate) => {
  try {
    await signInWithEmailAndPassword(auth, email, password).then(e=>{
    localStorage.setItem('isAuth','true')
    localStorage.setItem('user',JSON.stringify(e?.user))
    navigate('/dashboard')
    }).catch(err=>console.log("signin eror",err))
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password,navigate) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password).then(async(e)=>{
      localStorage.setItem('isAuth','true')
      localStorage.setItem('user',JSON.stringify(e?.user))
      const user = e?.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        onlineState: ""
      });
      navigate('/dashboard')
      }).catch(err=>console.log("signup eror",err))
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email,navigate) => {
  try {
    await sendPasswordResetEmail(auth, email).then(e=>{
      alert("Password reset link sent!");
      navigate('/login')
    }).catch(err=>console.log("rest error",err))
   
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  return signOut(auth).then(e=>{
    localStorage.clear()
  }).catch(err=>console.log("signout error",err))
 
};
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};


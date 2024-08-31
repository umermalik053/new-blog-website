// import from firebase-config
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "../firebase/firebase-config.js";

// all element get  

let google = document.getElementById("googleBtn");
let inputEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let loginBtn = document.querySelector("#loginBtn");

const provider = new GoogleAuthProvider();


// login with email and password 
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    console.log(inputEmail.value);
    console.log(loginPassword.value);
    signInWithEmailAndPassword(auth, inputEmail.value, loginPassword.value)
      .then((userCredential) => {
        Toastify({
          text: "Login Succesfully",
          duration: 3000
          }).showToast();
        window.location.href = "../pages/dashboard.html";
      })
      .catch((error) => {
        Toastify({
          text: error.message,
          duration: 3000
          }).showToast();
      });
  });
}
// google login 
if (google) {
  google.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        console.log(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        Toastify({
          text: errorMessage,
          duration: 3000
          }).showToast();
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  });
}

// state checking 
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (
      window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("signup.html")||
      window.location.pathname.includes("index.html")
    ) {
      window.location.href = "dashboard.html";
    } else if (window.location.pathname.includes("dashboard.html")) {
      loadPosts();
    }
  } else {
    if (window.location.pathname.includes("dashboard.html")) {
      window.location.href = "login.html";
    }
  }
});



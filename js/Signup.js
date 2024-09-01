// import from firebase confiq
import {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "../firebase/firebase-config.js";


// google provider  
const provider = new GoogleAuthProvider();


// all element get here 
let google = document.getElementById("googleBtn");
let signup = document.querySelector("#signupbtn");
let singupEmail = document.querySelector("#singupEmail");
let signuppassword = document.querySelector("#singupPassword");
let namesignup = document.querySelector("#namesignup");


// add event listener on sign up btn 
signup.addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, singupEmail.value, signuppassword.value)
  // when signup successful 
    .then((userCredential) => {
      Toastify({
          text: "Signup Succesfully",
          duration: 3000
          }).showToast();
          window.location.href = "../pages/login.html"
    })
    // catch error 
    .catch((error) => {
      Toastify({
        text: error.message,
        duration: 3000
        }).showToast();
    });

    // signup complete so empty all value 
  singupEmail.value = "";
  signuppassword.value = "";
  namesignup.value = "";
});



// if google button is not null or undefined so execute if condition 
if (google) {
  // google signup is start here
  google.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = result.user;
        console.log(user);
       
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
       
        // show toast when an error to google login 
        Toastify({
          text: errorMessage,
          duration: 3000
          }).showToast();
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  });
}



// state checking user is login or not 
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

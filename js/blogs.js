// import from firebase config 
import {
    db,
    collection,
    getDocs,
    auth,
    onAuthStateChanged,
    signOut,
  } from "../firebase/firebase-config.js";


  let postDiv = document.querySelector("#dashboard")
  // get data 
  const getposts = async () => {
    postDiv.innerHTML = "";
        const querySnapshot = await getDocs(collection(db, "posts"));
        try{
      if (querySnapshot.empty) {
        postDiv.innerHTML = `
        <div class="nopostDiv">
      <img src="../assets/document.png">
      </br>
      <p id="nopost">No posts founds</p>
      </div>`;
      } else {
        postDiv.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        postDiv.innerHTML += `
        <div class="blog-card">
          <div class="image-container">
            <img src="${postData.ImageUrl}" alt="Blog Image" />
          </div>
          <div class="content">
            <h3 class="title">${postData.title}</h3>
            <p class="category">Category: ${postData.category} </p>
            <p class="description">${postData.description}</p>
            <p class="created-date">Created Date: ${postData.createdDate}</p>
          </div>
        </div>
        
        `
        });
      }
    } catch (error) {
      Toastify({
        text: error.message,
        duration: 3000
        }).showToast();
    }}
  

  let signout = document.querySelector("#Signout");

const logOut = () => {
  signOut(auth).then(() => {
    window.location.href = "../pages/login.html";
  });
};
signout.addEventListener("click", logOut);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (window.location.pathname.includes("blog.html")) {
        getposts(); // Call loadPosts() on page load
      }
    } else {
      if (window.location.pathname.includes("blog.html")) {
        window.location.href = "login.html";
      }
    }
  });


  window.addEventListener("load", () => {
    if (auth.currentUser) {
      getposts(); // Load posts on page load if user is authenticated
    }
  });
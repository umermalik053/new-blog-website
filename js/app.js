import { db, collection, getDocs, onAuthStateChanged , auth } from "../firebase/firebase-config.js";


let postDiv = document.querySelector("#dashboard");
const getposts = async () => {
  postDiv.innerHTML = "";
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    if (querySnapshot.empty) {
      postDiv.innerHTML = `
        <div class="nopostDiv">
      <img src="./assets/document.png">
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
      
      `;
      });
    }
  } catch (error) {
    console.log("Error loading posts: ", error);
  } ;
}

// onload call getpost function  
window.addEventListener("load", () => { 
    getposts(); 
});


// state checking login or not 
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "../pages/dashboard.html";
  }else{
    console.log("user is not login")
  }
});

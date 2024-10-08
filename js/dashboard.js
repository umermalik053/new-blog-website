// import from firebase config
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  auth,
  onAuthStateChanged,
  signOut,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "../firebase/firebase-config.js";

// Formatting current date
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();
let datedone = day + "/" + month + "/" + year;

let signout = document.querySelector("#Signout");
// logout function
const logOut = () => {
  signOut(auth).then(() => {
    window.location.href = "../pages/login.html";
  });
};

if (signout) {
  signout.addEventListener("click", logOut);
}

// Handle image upload
let image = document.querySelector("#picture");
let imagePreview = document.querySelector("#image-preview");

let uploadTask;
let ImageUrl;

if (image) {
  image.addEventListener("change", () => {
    const files = image.files[0];
    const imagesRefWithFolder = ref(storage, files.name);
    uploadTask = uploadBytesResumable(imagesRefWithFolder, files);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
        if (files) {
          const reader = new FileReader();
          reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
          };
          reader.readAsDataURL(files);
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          ImageUrl = downloadURL;
          console.log(ImageUrl);
        });
      }
    );
  });
}

// element get

let pictureinput = document.querySelector("#picture");
let title = document.querySelector("#title");
let category = document.querySelector("#category");
let description = document.querySelector("#description");
let publishbtn = document.querySelector("#publishbtn");

const postData = async (e) => {
  e.preventDefault(); // Prevent form submission
  let value = title.value;
  let value1 = category.value;
  let value2 = description.value;
  // if all value is true so add doc
  if (ImageUrl && value && value1 && value2) {
    await addDoc(collection(db, "posts"), {
      title: title.value,
      category: category.value,
      description: description.value,
      ImageUrl: ImageUrl,
      createdDate: datedone,
      uid: auth.currentUser.uid,
    });
    title.value = "";
    category.value = "";
    description.value = "";
    ImageUrl = undefined;
    pictureinput.value = "";
    imagePreview.src = "#"
    imagePreview.style.display = "none"
    Toastify({
      text: "All Data Successfully send to server",
      duration: 3000,
    }).showToast();
  } else {
    Toastify({
      text: "sorry data is not being sent to server.",
      duration: 4000,
    }).showToast();
    Toastify({
      text: "Please Enter All Data and wait for picture processing",
      duration: 3000,
    }).showToast();
  }
  pictureinput.value = "";
  imagePreview.src = "#"
  imagePreview.style.display = "none"
  loadPosts(); // Reload posts after adding a new one
};

// publishbtn event Listener
if(publishbtn){
  publishbtn.addEventListener("click", postData);
}

let userCard = document.querySelector("#dashboard");

const loadPosts = async () => {
  userCard.innerHTML = "";

  let loading = document.querySelector(".loading");
  loading.style.display = "block";

  // query only login user post
  const q = query(
    collection(db, "posts"),
    where("uid", "==", auth.currentUser.uid)
  );

  try {
    // fetch data
    const querySnapshot = await getDocs(q);
    // if data is empty so show if condition
    if (querySnapshot.empty) {
      userCard.innerHTML = `
      <img src="./../assets/document.png">
      <p id="nopost">No posts founds</p>
      `;
    }
    // if data sucessfully fetch show else
    else {
      querySnapshot.forEach((doc) => {
        userCard.innerHTML += `
          <div class="blog-card">
              <div class="image-container">
                  <img src="${doc.data().ImageUrl}" alt="Blog Image">
              </div>
              <div class="content">
                  <h3 class="title">${doc.data().title}</h3>
                  <p class="category">Category: ${doc.data().category}</p>
                  <p class="description">${doc.data().description}</p>
                  <p class="created-date">Created Date: ${
                    doc.data().createdDate
                  }</p>
                  <div class="buttons">
                      <button onclick="editData('${
                        doc.id
                      }',this)" class="edit-btn">Edit</button>
                      <button
                      onclick="deleteData('${
                        doc.id
                      }',this)" class="delete-btn">Delete</button>
                  </div>
              </div>
          </div>
        `;
      });
    }
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 3000,
    }).showToast();
  } finally {
    loading.style.display = "none"; // Hide loader after fetching posts
  }
};

// Load posts on page load if the user is login
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (window.location.pathname.includes("dashboard.html")) {
      loadPosts(); // Call loadPosts() on page load
    }
  } else {
    if (window.location.pathname.includes("dashboard.html")) {
      window.location.href = "login.html";
    }
  }
});
window.deleteData = async (id, btn) => {
  btn.innerText = "Deleting.....";
  try {
    await deleteDoc(doc(db, "posts", id));
    Toastify({
      text: "Data Deleted Successfully",
      duration: 3000,
    }).showToast();

    loadPosts();
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 3000,
    }).showToast();
  }
};

// loadPosts is called on page load
window.addEventListener("load", () => {
  if (auth.currentUser) {
    loadPosts();
    Toastify({
      text: "Move Dashboard successfully",
      duration: 3000,
    }).showToast();
  }
});








let editid;
let editModal = document.querySelector("#editModal");
let closeBtn = document.querySelector(".close-button");
let editForm = document.querySelector("#editForm");
let editTitle = document.querySelector("#edit-title");
let editCategory = document.querySelector("#edit-category");
let editDescription = document.querySelector("#edit-description");
let editPicture = document.querySelector("#edit-picture");
let editImagePreview = document.querySelector("#edit-image-preview");
let updateBtn = document.querySelector("#updateBtn");
if (editPicture) {
  editPicture.addEventListener("change", () => {
    const files = editPicture.files[0];

    const imagesRefWithFolder = ref(storage, files.name);
    uploadTask = uploadBytesResumable(imagesRefWithFolder, files);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // editImagePreview.src = ImageUrl
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
        if (files) {
          const reader = new FileReader();
          reader.onload = (e) => {
            editImagePreview.src = e.target.result;
            editImagePreview.style.display = "block";
          };
          reader.readAsDataURL(files);
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          ImageUrl = downloadURL;
          console.log(ImageUrl);
        });
      }
    );
  });
  
}

closeBtn.addEventListener("click", () => {
  editModal.style.display = "none";
  Toastify({
    text: "closed modal from user",
    duration: 3000,
  }).showToast();
});

window.onclick = function (event) {
  if (event.target == editModal) {
    editModal.style.display = "none";
  }
};

window.editData = async (id, editparam) => {
  editparam.innerText = "Editing......";
  try {
    editid = id;
    let userData = await getDoc(doc(db, "posts", id));
    editTitle.value = userData.data().title;
    editCategory.value = userData.data().category;
    editDescription.value = userData.data().description;
    ImageUrl = userData.data().ImageUrl
    editImagePreview.src = userData.data().ImageUrl;
    editImagePreview.style.display = "block";
    editModal.style.display = "block"; // Open the modal
  } catch (error) {
    console.log(error);
  } finally {
    editparam.innerText = "Edit";
  }
};

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {

    await updateDoc(doc(db, "posts", editid), {
      title: editTitle.value,
      category: editCategory.value,
      description: editDescription.value,
      ImageUrl: ImageUrl || editImagePreview.src,

    });
    Toastify({
      text: "Post Updated Successfully",
      duration: 3000,
    }).showToast();
    editModal.style.display = "none";
    loadPosts(); // Reload posts after updating
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 3000,
    }).showToast();
  }
});


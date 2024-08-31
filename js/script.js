// get preloader and content div here 
let preloader = document.querySelector("#preloader");
let contentDiv = document.querySelector("#content");

// function for preloader 
function hidePreloader() {
    preloader.style.display = 'none';  
    contentDiv.style.display = 'block';  
}

// onload preloader show for 3 sec
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(hidePreloader, 3000); 
});




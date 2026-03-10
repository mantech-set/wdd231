const year = document.querySelector("#year");
year.textContent = new Date().getFullYear();

document.getElementById("lastModified").textContent =
"Last Modified: " + document.lastModified;
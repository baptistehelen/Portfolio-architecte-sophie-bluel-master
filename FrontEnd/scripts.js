// ----------------------------------------------------------------
// ----------------------------------------------------------------
// (1.1) - function to fetch data from the API
async function fetchData() {
  try {
    // fetch data from the specified API
    const r = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "DEMO-API-KEY",
      },
    });

    // convert the response to JSON format
    const data = await r.json();
    console.log(data);

    const dataContainer = document.querySelector(".gallery");
    const modalGalleries = document.querySelector(".imgmodal");

    // Vider le conteneur d'images existant
    dataContainer.innerHTML = "";
    modalGalleries.innerHTML = "";

    // - function callback -
    displayModal(data);
    displayData(data);
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
  }
}
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// (1.1) - function to display the data in the HTML document
function displayData(data) {
  const dataContainer = document.querySelector(".gallery");

  // loop through the fetched data and create HTML elements for each item
  for (let i = 0; i < data.length; i++) {
    const listItem = document.createElement("figure");
    listItem.innerHTML = `<img src="${data[i].imageUrl}" alt="Image">`;

    const textElement = document.createElement("figcaption");
    textElement.innerHTML = `${data[i].title}`;

    listItem.appendChild(textElement);
    dataContainer.appendChild(listItem);
  }

  // - (1.2) - set up EventListeners for filter buttons and handle filtered data display -
  
  function addFilterListener(selector, categoryId) {
    const boutonFiltrer = document.querySelector(selector);
    
    function applyFilter() {
        let allButtons = document.querySelectorAll(".filters-button");
        
        allButtons.forEach(function(button) {
            button.style.backgroundColor = '';
            button.style.color = '';
        });
        
        let filteredData;

        switch (selector) {
            case ".all":
                filteredData = data.filter(function (data) {
                    return data.categoryId <= 3;
                });
                break;
            case ".objects":
                filteredData = data.filter(function (data) {
                    return data.categoryId == 1;
                });
                break;
            case ".apartments":
                filteredData = data.filter(function (data) {
                    return data.categoryId == 2;
                });
                break;
            case ".handr":
                filteredData = data.filter(function (data) {
                    return data.categoryId == 3;
                });
                break;
        }

        console.log(filteredData);
        displayFilteredData(filteredData);

        boutonFiltrer.style.backgroundColor = '#0e2f28';
        boutonFiltrer.style.color = 'white';
    }

    if (selector === ".all") {
        applyFilter();
    }

    boutonFiltrer.addEventListener("click", function () {
        applyFilter();
    });
}

addFilterListener(".objects", 1);
addFilterListener(".apartments", 2);
addFilterListener(".handr", 3);
addFilterListener(".all", 3);

}

// ----------------------------------------------------------------
// (1.2) - function to display filtered data in the HTML document
function displayFilteredData(filteredData) {
  const dataContainer = document.querySelector(".gallery");

  dataContainer.innerHTML = "";

  // loop through the filtered data and create HTML elements for each item
  for (let i = 0; i < filteredData.length; i++) {
    const listItem = document.createElement("figure");
    listItem.innerHTML = `<img src="${filteredData[i].imageUrl}" alt="Image">`;

    const textElement = document.createElement("figcaption");
    textElement.innerHTML = `${filteredData[i].title}`;

    listItem.appendChild(textElement);
    dataContainer.appendChild(listItem);
  }
}
// ----------------------------------------------------------------
// (1.1) - fetch data when the script is executed
fetchData();

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// (3) - modal section
function setupModal() {
  // get the modal
  const modal = document.getElementById("modal");
  const modalOne = document.querySelector(".modal-content-1");
  const modalTwo = document.querySelector(".modal-content-2");
  const button = document.getElementById("openModal2");
  const back = document.querySelector(".back");

  // get the button that opens the modal
  const btn = document.getElementById("openModal");

  // get the <span> element that closes the modal
  const span1 = modalOne.querySelector(".close");
  const span2 = modalTwo.querySelector(".close");

  // function to open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // function for the 2nd page link button
  button.onclick = function () {
    modalOne.style.display = "none";
    modalTwo.style.display = "block";
  };

  // function to back
  back.onclick = function () {
    modalTwo.style.display = "none";
    modalOne.style.display = "block";
    document.getElementById("imageForm").reset();
    resetMiniature();
  };

  // function to close the modal 1
  span1.onclick = function () {
    modal.style.display = "none";
    document.getElementById("imageForm").reset();
    resetMiniature();
  };
  // function to close the modal 2
  span2.onclick = function () {
    modalOne.style.display = "block";
    modalTwo.style.display = "none";
    modal.style.display = "none";
    document.getElementById("imageForm").reset();
    resetMiniature();
  };

  // function to close the modal when clicking outside of it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      modalOne.style.display = "block";
      modalTwo.style.display = "none";
      document.getElementById("imageForm").reset();
      resetMiniature();
    }
  };
}
// ----------------------------------------------------------------
// function to delete images via api
async function deleteImage(imageId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    });
    await fetchData();
    if (!response.ok) {
      throw new Error("Échec de la suppression de l'image");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image :", error);
  }
}
  // --- create all the images elements and delete button ---
function displayModal(data) {
  for (let i = 0; i < data.length; i++) {
    const parentImg = document.createElement("figure");
    const img = document.createElement("img");
    const deleteButton = document.createElement("span");
    const modalGalleries = document.querySelector(".imgmodal");

    deleteButton.className = "delete-button";
    // add trash fontawesome icon
    deleteButton.innerHTML = `<div class="trash"><i class="fa-solid fa-trash-can"></i></div>`;

    deleteButton.addEventListener("click", function () {
      // call to function deleteImage
      deleteImage(data[i].id);
      modalGalleries.removeChild(parentImg);
    });

    img.src = data[i].imageUrl;

    img.alt = "Image";

    parentImg.appendChild(img);
    parentImg.appendChild(deleteButton);
    modalGalleries.appendChild(parentImg);
  }
}
// call the setupModal function to set up the modal behavior
setupModal();

// ----------------------------------------------------------------
// function "mode edition"
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("loggedIn") === "true") {
    // (Item created -> login.js)
    document.getElementById("banner").style.display = "block";
    document.getElementById("openModal").style.display = "block";
    const log = document.querySelector(".log");
    log.textContent = "logout";
    log.removeAttribute("href");
    log.addEventListener("click", function () {
      localStorage.clear();
      location.reload();
    });
    // hide filter button at login
    document.querySelector(".all").style.display = "none";
    document.querySelector(".objects").style.display = "none";
    document.querySelector(".apartments").style.display = "none";
    document.querySelector(".handr").style.display = "none";
  }
});

// ----------------------------------------------------------------
// function to post images via api
document
  .getElementById("imageFile")
  .addEventListener("change", function (event) {
    const imageFile = event.target.files[0];
    const title = document.getElementById("imageTitle").value;
    const categoryId = document.getElementById("imageCategory").value;

    const reader = new FileReader();

    reader.onload = async function (event) {
      const imageUrl = event.target.result;
      const miniatureContainer = document.querySelector(".rectangle");
      const miniature = document.querySelector(".miniature");
      miniature.style.opacity = "0";
      const miniatureImage = document.createElement("img");
      miniatureImage.classList.add("miniatureImage");
      miniatureImage.src = imageUrl;
      miniatureContainer.appendChild(miniatureImage);
    };

    reader.readAsDataURL(imageFile);
  });

document
  .getElementById("imageForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const imageFile = document.getElementById("imageFile").files[0];
    const title = document.getElementById("imageTitle").value;
    const categoryId = document.getElementById("imageCategory").value;

    await addWork(imageFile, title, categoryId);
  });

async function addWork(imageFile, title, categoryId) {
  const token = localStorage.getItem("token");
  let formData = new FormData();

  formData.append("image", imageFile);
  formData.append("title", title);
  formData.append("category", categoryId);
  console.log(formData)
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de l'image à l'API");
    }

    await fetchData();

    document.getElementById("imageForm").reset();
    resetMiniature();
    const modal = document.getElementById("modal");
    const modalOne = document.querySelector(".modal-content-1");
    const modalTwo = document.querySelector(".modal-content-2");
    modal.style.display = "none";
    modalOne.style.display = "block";
    modalTwo.style.display = "none";
  } catch (error) {
    console.error(error);
  }
}
// ----------------------------------------------------------------
// function to reset miniature img form
function resetMiniature() {
  const miniatureImage = document.querySelector(".miniatureImage");
      miniatureImage.remove();
  
  const miniature = document.querySelector(".miniature");
      miniature.style.opacity = "1";
}



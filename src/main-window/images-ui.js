/* eslint-disable prefer-const */
/* eslint-disable max-statements */
/* eslint-disable one-var */
/* eslint-disable require-unicode-regexp */
/* eslint-disable sort-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-invalid-this */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
import url from "url";
import path from "path";
import { applyFilter } from "./filters";

function reloadImagesEvent () {
  const $thumbs = [...document.querySelectorAll("li.Image__item")];
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < $thumbs.length; index++) {
    // eslint-disable-next-line no-loop-func
    $thumbs[index].addEventListener("click", function () {
      changeImage(this);
    });
  }
}

function changeImage (node) {
  const selected = document.querySelector("li.selected");
  if (selected) {
    selected.classList.remove("selected");
  }
  node.classList.add("selected");

  const image = document.getElementById("image__displayed");
  image.src = node.querySelector("img").src;
  image.dataset.original = node.querySelector("img").src;
  document.getElementById("filter").selectedIndex = 0;
}

function selectFirstImage () {
  const $image = document.querySelector("li.Image__item:not(.hidden)");
  if ($image) {
    changeImage($image);
  }
}

function searchImagesEvent () {
  const $searchBox = document.getElementById("search__box");

  $searchBox.addEventListener("keyup", function () {
    const regex = new RegExp(this.value.toLowerCase(), "gi"),
     $thumbs = [...document.querySelectorAll("li.Image__item img")];

    if (!this.value) {
      $thumbs.map(($thumb) => $thumb.parentNode.parentNode.parentNode.classList.remove("hidden"));
      selectFirstImage();
      return null;
    }

    for (let index = 0; index < $thumbs.length; index++) {
      const fileUrl = url.parse($thumbs[index].src),
       fileName = path.basename(fileUrl.pathname);
      if (fileName.match(regex)) {
        $thumbs[index].parentNode.parentNode.parentNode.classList.remove("hidden");
      } else {
        $thumbs[index].parentNode.parentNode.parentNode.classList.add("hidden");
      }
    }

    selectFirstImage();
  });
}

function print () {
  window.print();
}

function selectEvent () {
  const $select = document.getElementById("filter");

  $select.addEventListener("change", function () {
    applyFilter(this.value, document.getElementById("image__displayed"));
  });
}

function clearImages () {
  const $oldImages = document.querySelectorAll("li.Image__item");

  for (const oldImage of $oldImages) {
    oldImage.parentNode.removeChild(oldImage);
  }
}

function loadImages (images) {
  const $imagesList = document.querySelector(".Image__list");

  for (const { size, src, filename } of images) {
    const $li = document.createElement("li");
    $li.classList.add("Image__item");
    $li.innerHTML = `
      <div>
        <figure>
          <img src="${src}" alt="${filename}">
        </figure>
        <article>
          <p><strong>${filename}</strong></p>
          <p>${size}</p>
        </article>
      </div>
      <hr>
    `;

    $imagesList.insertAdjacentElement("beforeend", $li); // inserta template en el último lugar
  }
}

export {
  reloadImagesEvent,
  selectEvent,
  changeImage,
  selectFirstImage,
  loadImages,
  clearImages,
  searchImagesEvent,
  print,
};

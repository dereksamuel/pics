/* eslint-disable prefer-const */
/* eslint-disable max-statements */
/* eslint-disable one-var */
/* eslint-disable require-unicode-regexp */
/* eslint-disable sort-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-invalid-this */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
import { changeImage, searchImagesEvent, selectEvent } from "./images-ui";
import { setIpc, openDirectory as sendOpendirectory, saveFile, openPreferences } from "./ipcRendererEvents";

let imagesData = [];

window.onload = () => {
  setIpc(imagesData);
  addImages();
  searchImagesEvent();
  selectFirstImage();
  selectEvent();
  handleButtonAction("open__directory", () => {
    // $el.disabled = true;
    sendOpendirectory();
  });
  handleButtonAction("save__as", () => {
    saveFile();
  });
  handleButtonAction("open__preferences", () => {
    openPreferences();
  });
};

function handleButtonAction (id, cb) {
  const $el = document.getElementById(id);
  $el.addEventListener("click", () => cb($el));
}

function addImages () {
  const $thumbs = [...document.querySelectorAll("li.Image__item")];
  for (let index = 0; index < $thumbs.length; index++) {
    $thumbs[index].addEventListener("click", function () {
      changeImage(this); // se añade el nodo seleccionado osea el li
    });
  }
}

function selectFirstImage () {
  const $image = document.querySelector("li.Image__item:not(.hidden)");
  if ($image) {
    changeImage($image);
  }
}

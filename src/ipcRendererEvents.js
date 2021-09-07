/* eslint-disable consistent-return */
/* eslint-disable sort-vars */
/* eslint-disable no-invalid-this */
/* eslint-disable func-names */
import path from "path";
import { ipcRenderer, remote } from "electron";
import { clearImages, loadImages, reloadImagesEvent, selectFirstImage } from "./images-ui";
import { saveImageFilters } from "./filters";

function setIpc (imagesData) {
  ipcRenderer.on("load-images", (event, images) => {
    console.log(images);
    clearImages();
    loadImages(images);
    reloadImagesEvent();
    selectFirstImage();
  });

  ipcRenderer.on("save-image", (event, file) => {
    if (file) {
      saveImageFilters(file.filePath, (error) => {
        if (error) {
          return showDialog({
            type: "error",
            title: "Pics",
            message: error.message,
          });
        }
        showDialog({
          type: "info",
          title: "Pics",
          message: "La imágen fué guardada con éxito",
        });
      });
    }
  });

  return imagesData;
}

function openPreferences () {
  const { BrowserWindow } = remote,
   preferencesWindow = new BrowserWindow({
    width: 400,
    height: 600,
    title: "Preferences",
    center: true,
    modal: true,
    frame: true, // pone controles de la new window
    show: false,
  });

  preferencesWindow.show();
}

function openDirectory () {
  ipcRenderer.send("open-directory");
}

function saveFile () {
  const imageOriginal = document.getElementById("image__displayed").dataset.original,
   extensionImage = path.extname(imageOriginal); // me consigue la extensión

  ipcRenderer.send("open-save-file", extensionImage);
}

function showDialog ({
  type,
  title,
  message,
}) {
  ipcRenderer.send("show-dialog", {
    type,
    title,
    message,
  });
}

export {
  openDirectory,
  saveFile,
  setIpc,
  showDialog,
  openPreferences,
};

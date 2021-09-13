/* eslint-disable one-var-declaration-per-line */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable sort-vars */
/* eslint-disable no-invalid-this */
/* eslint-disable func-names */
import path from "path";
import url from "url";
import os from "os";
// import settings from "electron-settings";
import { ipcRenderer, remote } from "electron";

import { clearImages, loadImages, reloadImagesEvent, selectFirstImage } from "./images-ui";
import { saveImageFilters } from "./filters";

function setIpc (imagesData) {
  const $directoryFooter = document.getElementById("directory"),
   directory = localStorage.getItem("directory");

  if (directory) {
    console.log(directory);
    ipcRenderer.send("load-directory", directory);
    $directoryFooter.innerHTML = `<p>Directorio: ${directory}</p>`;
  }

  ipcRenderer.on("load-images", (event, dir, images) => {
    clearImages();
    loadImages(images);
    reloadImagesEvent();
    selectFirstImage();
    localStorage.setItem("directory", dir);
    $directoryFooter.innerHTML = `<p>Directorio: ${dir}</p>`;
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
    frame: false, // pone controles de la new window
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  }), mainWindow = remote.getGlobal("window");

  if (os.platform() !== "wind32") {
    preferencesWindow.setParentWindow(mainWindow);// pertenece a ventana padre NO FUNCIONA EN WINDOWS
  }

  preferencesWindow.once("ready-to-show", () => {
    preferencesWindow.show();
    preferencesWindow.focus();
  });
  preferencesWindow.loadURL(url.format({
    protocol: "file:",
    pathname: path.join(path.join(__dirname, ".."), "prefs-window/preferences.html"),
    slashes: true
  }));
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

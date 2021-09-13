/* eslint-disable func-style */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable consistent-return */
import { ipcMain, dialog, } from "electron";
import fs from "fs";
import path from "path";
import isImage from "is-image";
import fileSize from "filesize";

function loadImages (filePaths, event) {
  const imagesData = [];
  fs.readdir(filePaths[0], (error, files) => {
    if (error) {
      console.error("[error]:", error);
      throw error;
    }

    for (const file of files) {
      if (isImage(file)) {
        const imageUbication = path.join(filePaths[0], file),
         size = fileSize(fs.statSync(imageUbication).size, { round: 0, });

        imagesData.push({
          filename: file,
          src: `file://${imageUbication}`,
          size,
        });
      }
    }

    event.sender.send("load-images", filePaths[0], imagesData);
  });
}

export const ipcMainSetup = (window) => {
  ipcMain.on("open-directory", async (event) => {
    try {
      const { filePaths } = await dialog.showOpenDialog({
        title: "Seleccione la nueva ubicación",
        buttonLabel: "Open ubication", // define etiqueta del botón
        properties: ["openDirectory"], // tipo del diálogo
      });

      if (filePaths && filePaths.length) {
        loadImages(filePaths, event);
      }
    } catch (error) {
      console.error(error);
      event.sender.send("load-images", "Ha ocurrido un error al extraer su ubicación");
    }
  });

  ipcMain.on("load-directory", (event, directory) => {
    // console.log(event, directory);
    loadImages([directory], event);
  });

  ipcMain.on("open-save-file", async (event, imageOriginal) => {
    try {
      const file = await dialog.showSaveDialog(window, {
        title: "Guardar imágen alterada",
        buttonLabel: "Guardar imágen",
        filters: [
          {
            name: "Images",
            extensions: [imageOriginal.substr(1)],
          }
        ],
      });

      if (file) {
        event.sender.send("save-image", file);
      }
    } catch (error) {
      console.error(error);
    }
  });

  ipcMain.on("show-dialog", (event, options) => {
    dialog.showMessageBox(window, {
      type: options.type,
      title: options.title,
      message: options.message,
    });
  });
};

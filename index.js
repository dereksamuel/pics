/* eslint-disable no-magic-numbers */
/* eslint-disable consistent-return */
"use strict";

import { app, BrowserWindow } from "electron";
import path from "path";

import devtools from "./devtools";
import setupErrors from "./src/handle-errors";
import { ipcMainSetup } from "./src/ipcMainEvents";

let window;

if (process.env.NODE_ENV === "development") {
  devtools();
}

app.on("before-quit", () => {
  console.log("Bye 👋");
});

app.on("ready", async () => {
  window = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 1000,
    title: "Pics - Your favorite app to edit 'pics' images",
    center: true,
    // maximizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    }
  });

  window.maximize();

  setupErrors(window);
  ipcMainSetup(window);

  window.once("ready-to-show", () => { // once es solo una vez
    window.show();
  });

  window.on("move", () => {
    const position = window.getPosition();
    console.log(position);
  });

  window.on("closed", handleFinish);

  // await window.loadURL("https://transformart-5e776.web.app/").catch((error) => {
  //   console.error("[error-load-url]:", error);
  // });
  await window.loadURL(`file://${__dirname}/src/index.html`);
  window.toggleDevTools();
});

function handleFinish () {
  window = null;
  app.quit();
}

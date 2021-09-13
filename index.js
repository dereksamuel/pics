/* eslint-disable max-statements */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
/* eslint-disable consistent-return */
"use strict";

import { app, BrowserWindow, Tray } from "electron";
import path from "path";

import devtools from "./devtools";
import setupErrors from "./handle-errors";
import { ipcMainSetup } from "./ipcMainEvents";
import os from "os";

global.window;

if (process.env.NODE_ENV === "development") {
  devtools();
}

app.on("before-quit", () => {
  console.log("Bye 👋");
});

app.on("ready", async () => {
  global.window = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 1300,
    minHeight: 800,
    icon: path.join(__dirname, "assets", "icons", "pics_logo.ico"),
    title: "Pics - Your favorite app to edit 'pics' images",
    center: true,
    // maximizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    }
  });

  global.window.maximize();

  setupErrors(global.window);
  ipcMainSetup(global.window);

  global.window.once("ready-to-show", () => { // once es solo una vez
    global.window.show();
  });

  global.window.on("move", () => {
    const position = global.window.getPosition();
    console.log(position);
  });

  global.window.on("closed", handleFinish);

  let icon;
  if (os.platform() === "win32") {
    icon = path.join(__dirname, "assets", "icons", "pics_logo.ico");
  } else {
    icon = path.join(__dirname, "assets", "icons", "pics_logo.png");
  }

  global.tray = new Tray(icon);
  // await global.window.loadURL("https://transformart-5e776.web.app/").catch((error) => {
  //   console.error("[error-load-url]:", error);
  // });
  await global.window.loadURL(`file://${__dirname}/src/index.html`);
  global.window.toggleDevTools();
});

function handleFinish () {
  global.window = null;
  app.quit();
}

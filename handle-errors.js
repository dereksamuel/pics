/* eslint-disable no-magic-numbers */
/* eslint-disable func-style */
/* eslint-disable one-var */
import { dialog, app } from "electron";

const restartApp = (window) => {
  dialog.showMessageBox(window, {
    type: "error",
    title: "Pics",
    message: "Ocurrió un error inesperado se reiniciará el aplicativo ↩↪↩",
  }, () => {
    app.relaunch();
    app.exit(0);
  });
};

const setupErrors = (window) => {
  window.webContents.on("crashed", () => {
    restartApp(window);
  });

  window.on("unresponsive", () => {
    dialog.showMessageBox(window, {
      type: "warning",
      title: "Pics",
      message: "Un process está tardando demasiado, puede esperar o reiniciar el aplicativo",
    });
  });

  process.on("uncaughtException", (error) => {
    console.error(error);
    restartApp(window);
  });
};

export default setupErrors;

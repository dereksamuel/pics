/* eslint-disable no-magic-numbers */
/* eslint-disable max-statements */
/* eslint-disable one-var */
/* eslint-disable no-debugger */
/* eslint-disable no-invalid-this */
/* eslint-disable func-names */
import { remote } from "electron";
import Cryptr from "cryptr";

import { showDialog } from "../main-window/ipcRendererEvents";

const cryptr = new Cryptr("PicsSecret");

window.onload = () => {
  const cloudUpInformation = JSON.parse(localStorage.getItem("cloudUpInformation") || "{}");
  loadCancelButton();
  loadSave();

  if (Object.keys(cloudUpInformation).length && cloudUpInformation.password && cloudUpInformation.user) {
    const decrypter = cryptr.decrypt(cloudUpInformation.password);

    document.getElementById("email").value = cloudUpInformation.user;
    document.getElementById("password").value = decrypter;
  }
};

function loadCancelButton () {
  const $cancel = document.getElementById("cancel");
  $cancel.addEventListener("click", closeWindow);
}

function loadSave () {
  const $form = document.getElementById("form");

  $form.addEventListener("submit", function (event) {
    event.preventDefault();
    if ($form.reportValidity()) {
      const formData = new FormData(this);
      const { user, password } = {
        user: formData.get("email"),
        password: cryptr.encrypt(formData.get("password")),
      };

      localStorage.setItem("cloudUpInformation", JSON.stringify({ user,
        password }));

      showDialog({
        type: "info",
        message: "Guardado con éxito",
        title: "Pics",
      });
      closeWindow();
    } else {
      showDialog({
        type: "error",
        message: "Es requerido escribir todos los campos de CloudUp",
        title: "Pics",
      });
    }
  });
}

function closeWindow () {
  const preferencesWindow = remote.getCurrentWindow();
  preferencesWindow.close();
}

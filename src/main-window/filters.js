/* eslint-disable prefer-destructuring */
/* eslint-disable no-negated-condition */
/* eslint-disable no-magic-numbers */
/* eslint-disable require-unicode-regexp */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable no-debugger */
import fs from "fs-extra";

function applyFilter (filter, actualImage) {
  let imgObj = new Image() // eslint-disable-line
  imgObj.src = actualImage.src;

  filterous.importImage(imgObj, {}). // eslint-disable-line
    applyInstaFilter(filter).
    renderHtml(actualImage);
}

function saveImageFilters (fileName, cb) {
  let fileSrc = document.getElementById("image__displayed").src;
  // eslint-disable-next-line require-unicode-regexp
  if (fileSrc.indexOf(";base64,") !== -1) {
    fileSrc = fileSrc.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    fs.writeFile(fileName, fileSrc, "base64", cb);
  } else {
    fileSrc = fileSrc.replace("file://", "");
    fileSrc = fileSrc.split("/C:/")[1];
    fs.copy(fileSrc, fileName, cb);
  }
}

export {
  applyFilter,
  saveImageFilters,
};

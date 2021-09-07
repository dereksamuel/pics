import { enableLiveReload } from "electron-compile";
import electronDebug from "electron-debug";

function devtools () {
  enableLiveReload();
  electronDebug({
    showDevTools: true,
  });
}

export default devtools;

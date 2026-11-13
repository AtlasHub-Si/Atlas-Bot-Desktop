import { defineMessages } from "../../message";

export const messages = defineMessages("menu", {
  // The native application menu. Electron localizes its own `role:` entries from the operating
  // system, so only the custom items are here. A role's label does not follow the app language, so
  // the chat's right-click edit menu takes its labels from here.
  "menu.stopAllAgents": "Stop all agents",
  "menu.checkForUpdates": "Check for Updates…",
  "menu.preferences": "Settings…",
  "menu.actualSize": "Actual Size",
  "menu.zoomIn": "Zoom In",
  "menu.zoomOut": "Zoom Out",
  "menu.copyLink": "Copy Link",
  "menu.copyImage": "Copy Image",
  "menu.quit": "Quit AtlasBot",
  "menu.quitConfirmTitle": "Quit AtlasBot?",
  "menu.quitConfirmBody": "Agents and routines stop until you open AtlasBot again.",
  "menu.quitConfirm": "Quit",
  "menu.quitHint": "Hold ⌘Q or press it twice to quit",
  // Windows and Linux, when the user closes the main window while agents work.
  "menu.closeWorkingTitle": { one: "{count} agent is still working", other: "{count} agents are still working" },
  "menu.closeWorkingBody":
    "If you quit AtlasBot, the agents stop. Keep it running to let them finish. To show the window again, open AtlasBot.",
  "menu.closeKeepRunning": "Keep Running",
  "menu.trayOpen": "Open AtlasBot",
  "menu.trayQuit": "Quit AtlasBot",
  "menu.trayTooltip": "AtlasBot",
  "menu.hideDynamicIsland": "Hide Dynamic Island",
  "menu.undo": "Undo",
  "menu.redo": "Redo",
  "menu.cut": "Cut",
  "menu.copy": "Copy",
  "menu.paste": "Paste",
  "menu.pasteAndMatchStyle": "Paste and Match Style",
  "menu.delete": "Delete",
  "menu.selectAll": "Select All",
});

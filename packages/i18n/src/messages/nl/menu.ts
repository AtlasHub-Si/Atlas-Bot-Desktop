import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Stop alle agents",
  "menu.checkForUpdates": "Controleer op updates…",
  "menu.preferences": "Instellingen…",
  "menu.actualSize": "Werkelijke grootte",
  "menu.zoomIn": "Zoom in",
  "menu.zoomOut": "Zoom uit",
  "menu.copyLink": "Kopieer link",
  "menu.copyImage": "Kopieer afbeelding",
  "menu.quit": "Stop AtlasBot",
  "menu.quitConfirmTitle": "AtlasBot stoppen?",
  "menu.quitConfirmBody": "Agents en routines stoppen tot je AtlasBot weer opent.",
  "menu.quitConfirm": "Stop",
  "menu.quitHint": "Houd ⌘Q ingedrukt of druk twee keer om te stoppen",
  "menu.closeWorkingTitle": { one: "{count} agent werkt nog", other: "{count} agents werken nog" },
  "menu.closeWorkingBody":
    "Als je AtlasBot stopt, stoppen de agents. Laat AtlasBot draaien, zodat ze klaar worden. Open AtlasBot om het venster weer te tonen.",
  "menu.closeKeepRunning": "Laat draaien",
  "menu.trayOpen": "Open AtlasBot",
  "menu.trayQuit": "Stop AtlasBot",
  "menu.trayTooltip": "AtlasBot",
  "menu.hideDynamicIsland": "Dynamic Island verbergen",
  "menu.undo": "Herstel",
  "menu.redo": "Opnieuw",
  "menu.cut": "Knip",
  "menu.copy": "Kopieer",
  "menu.paste": "Plak",
  "menu.pasteAndMatchStyle": "Plak en pas stijl aan",
  "menu.delete": "Verwijder",
  "menu.selectAll": "Selecteer alles",
} as const satisfies PartialTranslation<typeof source>;

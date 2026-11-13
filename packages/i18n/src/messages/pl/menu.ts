import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Zatrzymaj wszystkich agentów",
  "menu.checkForUpdates": "Sprawdź aktualizacje…",
  "menu.preferences": "Ustawienia…",
  "menu.actualSize": "Rzeczywisty rozmiar",
  "menu.zoomIn": "Powiększ",
  "menu.zoomOut": "Pomniejsz",
  "menu.copyLink": "Kopiuj link",
  "menu.copyImage": "Kopiuj obraz",
  "menu.quit": "Zamknij AtlasBot",
  "menu.quitConfirmTitle": "Zamknąć AtlasBot?",
  "menu.quitConfirmBody": "Agenci i rutyny zatrzymają się, dopóki nie otworzysz AtlasBot ponownie.",
  "menu.quitConfirm": "Zamknij",
  "menu.quitHint": "Przytrzymaj ⌘Q lub naciśnij dwa razy, aby zamknąć",
  "menu.closeWorkingTitle": {
    one: "{count} agent nadal pracuje",
    few: "{count} agenci nadal pracują",
    many: "{count} agentów nadal pracuje",
    other: "{count} agenta nadal pracuje",
  },
  "menu.closeWorkingBody":
    "Jeśli zamkniesz AtlasBot, agenci się zatrzymają. Zostaw go uruchomionego, aby skończyli. Aby znowu pokazać okno, otwórz AtlasBot.",
  "menu.closeKeepRunning": "Nie zamykaj",
  "menu.trayOpen": "Otwórz AtlasBot",
  "menu.trayQuit": "Zamknij AtlasBot",
  "menu.trayTooltip": "AtlasBot",
  "menu.hideDynamicIsland": "Ukryj Dynamic Island",
  "menu.undo": "Cofnij",
  "menu.redo": "Przywróć",
  "menu.cut": "Wytnij",
  "menu.copy": "Kopiuj",
  "menu.paste": "Wklej",
  "menu.pasteAndMatchStyle": "Wklej i dopasuj styl",
  "menu.delete": "Usuń",
  "menu.selectAll": "Zaznacz wszystko",
} as const satisfies PartialTranslation<typeof source>;

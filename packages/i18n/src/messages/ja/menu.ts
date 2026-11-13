import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "すべてのエージェントを停止",
  "menu.checkForUpdates": "アップデートを確認…",
  "menu.preferences": "設定…",
  "menu.actualSize": "実際のサイズ",
  "menu.zoomIn": "拡大",
  "menu.zoomOut": "縮小",
  "menu.copyLink": "リンクをコピー",
  "menu.copyImage": "画像をコピー",
  "menu.quit": "AtlasBot を終了",
  "menu.quitConfirmTitle": "AtlasBot を終了しますか？",
  "menu.quitConfirmBody": "AtlasBot を再び開くまで、エージェントとルーティンは停止します。",
  "menu.quitConfirm": "終了",
  "menu.quitHint": "終了するには ⌘Q を長押しするか、2 回押します",
  "menu.closeWorkingTitle": { other: "{count} 個のエージェントがまだ作業中です" },
  "menu.closeWorkingBody":
    "AtlasBot を終了すると、エージェントは止まります。終わるまで AtlasBot を実行したままにしてください。ウィンドウをもう一度表示するには、AtlasBot を開きます。",
  "menu.closeKeepRunning": "実行を続ける",
  "menu.trayOpen": "AtlasBot を開く",
  "menu.trayQuit": "AtlasBot を終了",
  "menu.trayTooltip": "AtlasBot",
  "menu.hideDynamicIsland": "Dynamic Island を隠す",
  "menu.undo": "取り消す",
  "menu.redo": "やり直す",
  "menu.cut": "カット",
  "menu.copy": "コピー",
  "menu.paste": "ペースト",
  "menu.pasteAndMatchStyle": "ペーストしてスタイルを合わせる",
  "menu.delete": "削除",
  "menu.selectAll": "すべてを選択",
} as const satisfies PartialTranslation<typeof source>;

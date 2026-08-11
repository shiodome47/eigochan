// 学習データの一括リセット。
// storage.ts に置くと jaCorpusReview → autoSync → storage の循環参照になるため、
// ここで各モジュールの clear を束ねる。

import { resetAll } from "./storage";
import { clearSrs } from "./srs";
import { clearJaReview } from "./jaCorpusReview";
import { clearJaDomainNotes } from "./jaDomainNote";
import { clearAllPhraseAudio } from "./phraseAudioStorage";

/** 進捗・ミッション・自作フレーズ・日→英データ・音声メモを消す。同期設定は残す。 */
export async function resetAllLearningData(): Promise<void> {
  resetAll();
  clearSrs();
  clearJaReview();
  clearJaDomainNotes();
  await clearAllPhraseAudio();
}

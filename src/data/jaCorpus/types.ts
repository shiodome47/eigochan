// 日→英モード用の日本語コーパス。
// 既存の Phrase (英語が主役) とは別系統のデータとして持つ。
// 「自分が実際に言いそうな日本語」を先に並べ、あとから英語を当てていく。

export type JaImportance = "must" | "often" | "sub";

export interface JaDomain {
  /** 1〜66 の分野番号 */
  id: number;
  /** グループ名 (日常生活 / 外出 / …) */
  group: string;
  title: string;
  /** 目標文数 (進捗表示用) */
  target: number;
}

/** データファイルに書く形。id は分野内の並び順から自動採番する。 */
export interface JaSentenceInput {
  ja: string;
  en: string;
  /** 反復して覚える英語の塊。省略時は英文そのものを 1 チャンクとする。 */
  ch?: string[];
  /** 場面 (家、駅、カフェ など) */
  scene?: string;
  /** 相手 (家族、友人、店員 など) */
  to?: string;
  /** 重要度。省略時は "often"。 */
  imp?: JaImportance;
}

export interface JaSentence {
  /** "d01_003" 形式。分野番号 + 分野内の連番。 */
  id: string;
  domain: number;
  ja: string;
  en: string;
  chunks: string[];
  scene: string;
  to: string;
  imp: JaImportance;
}

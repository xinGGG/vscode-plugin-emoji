import * as emojis from './data-emoji.json';
import * as vscode from 'vscode';

export const getEmojis = () => {
  const config = vscode.workspace.getConfiguration('emojiConfig');
  const appendEmojis = config.get<any[]>('emojis') || [];
  // 补充缺省值
  appendEmojis.forEach(emoji => {
    if (!emoji.detail) {
      emoji.detail = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unicode_version: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unicode_code: '',
        code: '',
        keywords: [],
      };
    }
    if (emoji.detail.unicode_version === undefined) {
      emoji.detail.unicode_version = '';
    }
    if (emoji.detail.unicode_code === undefined) {
      emoji.detail.unicode_code = '';
    }
    if (emoji.detail.code === undefined) {
      emoji.detail.code = '';
    }
    if (emoji.detail.keywords === undefined) {
      emoji.detail.keywords = [];
    }
    if (!emoji.collections) {
      emoji.collections = [];
    }
    ['groupName', 'subGroupName', 'image', 'nameZh', 'nameEn'].forEach(key => {
      if (!emoji[key]) {
        emoji[key] = '';
      }
    });
  });
  return appendEmojis.concat(emojis);
};

export { emojis };

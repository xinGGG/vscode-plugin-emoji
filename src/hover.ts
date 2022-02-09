import { getEmojis } from './data-emoji';
import * as vscode from 'vscode';

/**
 * 鼠标悬停提示，当鼠标停在package.json的dependencies或者devDependencies时，
 * 自动显示对应包的名称、版本号和许可协议
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
function provideHover(document: any, position: any, token: any) {
  const reg = /[\u{2702}-\u{27B0}\u{1F000}-\u{1FFFF}]/gu;
  // 编辑器对象
  const editor = vscode.window.activeTextEditor!;
  // 获取所有选中文本
  const allSelections = editor.selections;
  const matches = allSelections
    .map(selection => {
      return editor.document.getText(selection);
    })
    .join(',')
    .match(reg);
  // 没有匹配的直接返回
  if (!matches) {
    return;
  }
  // 查找并构造结果
  // * **名称**：${content.name}\n*
  const results: string = Array.from(new Set(matches))
    .map(emojiStr => getEmojis().find(item => item.image === emojiStr))
    .filter(item => item)
    .map((item: any) => `${item.image}: ${item.nameZh},${item.nameEn}  code: '${item.detail.code}' 关键词: '${item.detail.keywords.join(',')}'\n\n`)
    .join('');

  return new vscode.Hover(results);
}

export default function (context: { subscriptions: vscode.Disposable[] }) {
  let disposable;
  // 注册鼠标悬停提示
  context.subscriptions.push(
    (disposable = vscode.languages.registerHoverProvider(['markdown', 'javascript', 'typescript', 'vue'], {
      provideHover,
    }))
  );
  return disposable;
}

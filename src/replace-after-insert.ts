import * as vscode from 'vscode';

/**
 * 在插入后，根据光标的位置查找需要替换的关键字（当前那一行）
 */

export default function (context: { subscriptions: vscode.Disposable[] }) {
  let disposable;
  context.subscriptions.push(
    (disposable = vscode.commands.registerCommand('vscode-plugin-emoji.replace_after_insert', () => {
      // vscode.window.showInformationMessage('will replace_after_insert!!!');
      // 编辑器对象
      const editor = vscode.window.activeTextEditor!;
      // document对象
      const document = editor.document;
      const position = editor.selection.active;
      const offset = editor.document.offsetAt(editor.selection.start);
      // 匹配那一行，找到range和emojiStr
      const line = document.lineAt(position);
      const lineText = line.text.substring(0, position.character); // 截取到光标位置前一个为止
      const arrs = lineText
        .split(':')
        .map((item: string) => item.trim())
        .filter((item: string) => item);
      // 校验一下，最小长度为2的数组
      if (!Array.isArray(arrs) || arrs.length < 2) {
        return;
      }
      const target = arrs[arrs.length - 2];
      /**
       * 替换范围，需要注意的是emojiStr的length是不定的，可能的值是1、2、3
       * '2️⃣'.length === 3
       * '✌️'.length === 2
       * '⏰'.length === 1
       * ...
       */
      let range: vscode.Range;
      const emojiStr = arrs[arrs.length - 1];
      range = new vscode.Range(position.translate(0, -(target.length + emojiStr.length + 2)), position);

      editor.edit(editBuilder => {
        editBuilder.replace(range, emojiStr);
      });
    }))
  );
  return disposable;
}

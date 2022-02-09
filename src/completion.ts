import * as vscode from 'vscode';
import { getEmojis } from './data-emoji';

/**
 * 自动提示实现，这里模拟一个很简单的操作
 * 当输入 this.dependencies.xxx时自动把package.json中的依赖带出来
 * 当然这个例子没啥实际意义，仅仅是为了演示如何实现功能
 * @param {*} document
 * @param {*} position
 * @param {*} token
 * @param {*} context
 */
function provideCompletionItems(document: { lineAt: (arg0: any) => any }, position: vscode.Position, token: any, context: any) {
  const line = document.lineAt(position);
  // 只截取到光标位置为止，防止一些特殊情况
  const lineText = line.text.substring(0, position.character);

  // 使用command替换

  const arrs = lineText
    .split(':')
    .map((item: string) => item.trim())
    .filter((item: string) => item);
  const target = arrs[arrs.length - 1];

  const results: { label: string; detail: string; description: string; range: any; target: string }[] = [];

  // 计算需要替换的range
  const range: any = new vscode.Range(position.translate(0, -(target.length + 2)), position.translate(0, 1));
  const kind = vscode.CompletionItemKind.Text;

  getEmojis().forEach(({ groupName, subGroupName, image, nameZh, nameEn, collections, detail: { code, keywords } }) => {
    const emojiItem = { label: image, detail: `  ${nameZh},${nameEn}`, description: '', range, target };
    if (image === target) {
      emojiItem.description = '完全匹配';
      return results.push(emojiItem);
    }
    if (code.includes(target)) {
      emojiItem.description = `匹配code：${code}`;
      return results.push(emojiItem);
    }
    if (nameZh.includes(target)) {
      emojiItem.description = `匹配中文名：${nameZh}`;
      return results.push(emojiItem);
    }
    if (nameEn.includes(target)) {
      emojiItem.description = `匹配英文名：${nameEn}`;
      return results.push(emojiItem);
    }
    if (keywords.join(',').includes(target)) {
      emojiItem.description = `匹配关键词：${keywords.join(',')}`;
      return results.push(emojiItem);
    }
    if (collections.join(',').includes(target)) {
      emojiItem.description = `匹配专题集：${collections.join(',')}`;
      return results.push(emojiItem);
    }
    if (subGroupName.includes(target)) {
      emojiItem.description = `匹配子类：${subGroupName}`;
      return results.push(emojiItem);
    }
    if (groupName.includes(target)) {
      emojiItem.description = `匹配分类：${groupName}`;
      return results.push(emojiItem);
    }
  });

  const res = results.map(({ label, detail, description, range, target }) => {
    const assigned = {
      // range,
      kind,
      insertText: label,
      command: {
        command: 'vscode-plugin-emoji.replace_after_insert',
        title: 'replace after insert',
      },
    };
    return Object.assign(new vscode.CompletionItem({ label, detail, description }), assigned);
  });

  return new vscode.CompletionList(res);
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item
 * @param {*} token
 */
function resolveCompletionItem(item: any, token: any) {
  return null;
}

export default function (context: { subscriptions: vscode.Disposable[] }) {
  let disposable;
  // 注册代码建议提示，只有当按下“.”时才触发
  context.subscriptions.push(
    (disposable = vscode.languages.registerCompletionItemProvider(
      ['markdown', 'javascript', 'typescript', 'vue'],
      {
        provideCompletionItems,
        // resolveCompletionItem,
      },
      ':'
    ))
  );
  return disposable;
}

/*
 * @Author: Pengmx01 pengmx01@catl.com
 * @Date: 2023-02-03 09:00:27
 * @LastEditors: chenlong ChenL72@catl.com
 * @LastEditTime: 2023-02-14 10:12:14
 * @FilePath: \catl-components\.cz-config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  // 可选类型
  types: [
    { value: 'feat', name: '🔥 feat 新增一个功能' },
    { value: 'fix', name: '🐛 fix 修复一个bug' },
    { value: 'docs', name: '📝 docs 文档变更' },
    {
      value: 'style',
      name: '💄 style 代码格式（不影响功能，例如空格、分号等格式修正）',
    },
    { value: 'refactor', name: '♻️  refactor 代码重构' },
    { value: 'perf', name: '⚡️ perf 性能优化' },
    { value: 'test', name: '✅ test 增加测试' },
    { value: 'chore', name: '🎨 chore 构建过程或辅助工具的变动' },
    { value: 'revert', name: '⏪️ revert 回退' },
    { value: 'build', name: '🚩 build 打包' },
  ],
  scopes: ['cards', 'templates', 'docs', 'components'],
  allowCustomScopes: true,
  // 消息步骤
  messages: {
    type: '请选择提交类型:',
    scope: '请选择修改范围:',
    subject: '请简要描述提交(必填):',
    body: '请输入详细描述(可选):',
    footer: '请输入要关闭的issue(可选):',
    confirmCommit: '确认使用以上信息提交？(y/n/e/h)',
  },
  // 跳过问题
  skipQuestions: ['footer'],
  // subject文字长度默认是72
  subjectLimit: 72,
};

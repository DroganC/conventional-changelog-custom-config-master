"use strict";

const compareFunc = require(`compare-func`);
const Q = require(`q`);
const readFile = Q.denodeify(require(`fs`).readFile);
const resolve = require(`path`).resolve;
const path = require("path");

// 自定义配置
let defaultJson = {
  emojis: true,
  authorName: true,
  authorEmail: true,
};
let pkgJson = {};
try {
  pkgJson = require(path.resolve(process.cwd(), "./package.json"));
} catch (err) {
  console.error("no root package.json found");
}

const { changelog } = Object.assign(defaultJson, pkgJson);
const { emojis, authorName, authorEmail, bugsUrl } = changelog;

const gitUserInfo = "**@{{authorName}}** ({{authorEmail}})";

module.exports = Q.all([
  readFile(resolve(__dirname, `./templates/template.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/header.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/commit.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/footer.hbs`), `utf-8`),
]).spread((template, header, commit, footer) => {
  const writerOpts = getWriterOpts();

  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  // 替换 commit.hbs 模板中的 gitUserInfo
  writerOpts.commitPartial = commit.replace(/{{gitUserInfo}}/g, gitUserInfo);
  writerOpts.footerPartial = footer;

  return writerOpts;
});

function getWriterOpts() {
  return {
    transform: (commit, context) => {
      let discard = true;
      const issues = [];

      commit.notes.forEach((note) => {
        note.title = `BREAKING CHANGES`;
        discard = false;
      });

      const optionsMap = {
        feat: "✨ Features",
        fix: "🐛 Bug Fixes",
        perf: "⚡ Performance Improvements",
        revert: "⏪ Reverts",
        docs: "📝 Documentation",
        style: "💄 Styles",
        refactor: "♻ Code Refactoring",
        test: "✅ Tests",
        build: "👷‍ Build System",
        ci: "🔧 Continuous Integration",
        chore: "🎫 Chores",
      };

      commit.type = optionsMap[commit.type];

      if (commit.scope === `*`) {
        commit.scope = ``;
      }

      if (typeof commit.hash === `string`) {
        commit.hash = commit.hash.substring(0, 7);
      }
      console.log(context)
      if (typeof commit.subject === `string`) {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl;
        if (url) {
          url = `${url}/issues/`;
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue);
            return `[#${issue}](${url}${issue})`;
          });
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(
            /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
            (_, username) => {
              if (username.includes("/")) {
                return `@${username}`;
              }

              return `[@${username}](${context.host}/${username})`;
            }
          );
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter((reference) => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }

        return false;
      });

      if (bugsUrl) {
        commit.references = commit.references.map((ref) => {
          return {
            ...ref,
            bugsUrl,
          };
        });
      }

      return commit;
    },
    groupBy: `type`,
    commitGroupsSort: `title`,
    commitsSort: [`scope`, `subject`],
    noteGroupsSort: `title`,
    notesSort: compareFunc,
  };
}

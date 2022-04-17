# 小游戏

```
技术栈：react+typescript+ant
贪吃蛇
俄罗斯方块
1024
```

# 部署到 GitHub Pages

```
git remote add origin git@github.com:{username}/games.git
git branch -M main
git push -u origin main

package.json
"homepage":"https://{username}.github.io/games"
"predeploy": "yarn build",
"deploy": "gh-pages -d build",

yarn add -D gh-pages
yarn deploy
```

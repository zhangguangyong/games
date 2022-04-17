# 游戏

```
git remote add origin git@github.com:zhangguangyong/games.git
git branch -M main
git push -u origin main

package.json
"homepage":"https://zhangguangyong.github.io/games"
"predeploy": "yarn build",
"deploy": "gh-pages -d build",

yarn add -D gh-pages
yarn add -D @types/react-dom
yarn deploy
```

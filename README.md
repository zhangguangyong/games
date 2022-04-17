# 站点

```
git remote add origin git@github.com:zhangguangyong/games.git
git branch -M main
git push -u origin main

package.json
"homepage":"https://zhangguangyong.github.io/games"
"predeploy": "npm run build",
"deploy": "gh-pages -d build",

npm install --save-dev gh-pages

npm run deploy
```

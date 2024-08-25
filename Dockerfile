# Node.js version 14のイメージをベースとして使用
FROM node:14

# コンテナ内の作業ディレクトリを /app に設定
WORKDIR /app

# package.json と package-lock.json をコンテナにコピー
# これらのファイルだけを先にコピーすることで、依存関係が変更されていない場合にキャッシュを活用できる
COPY package*.json ./

# npm installコマンドが実行され、package.jsonに記載されているすべての依存関係（react-scriptsを含む）がインストールされます
RUN npm install

# アプリケーションのソースコードをコンテナにコピー
COPY . .

# Reactアプリケーションをビルド
# これにより、最適化された静的ファイルが生成される
RUN npm run build

# コンテナがリッスンするポートを指定
# これはドキュメンテーション目的であり、実際にポートを開くわけではない
EXPOSE 8080

# コンテナが起動したときに実行されるコマンドを指定
# この場合、Node.jsサーバー（server/app.mjs）を起動する
CMD ["node", "server/app.mjs"]
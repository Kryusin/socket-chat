# Node.jsの公式Dockerイメージを使用
FROM node AS build

# 作業ディレクトリを/appに設定
WORKDIR /web

# 依存関係をインストール
# RUN npm install

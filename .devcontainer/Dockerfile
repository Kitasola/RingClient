FROM node:20

# Copy source code
WORKDIR /app

# 必要なファイルをコピー
COPY package.json .
COPY yarn.lock .

# パッケージのインストール
RUN apt update && apt install -y yarn
RUN yarn install --frozen-lockfile

# ポートを公開
EXPOSE 8080
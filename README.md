# RingDoorBell
Ring Doorbellのサブスクライブ化に伴い利用できなくなる機能の代替提供アプリケーション

## 仕様
### 無料プラン対応
* ライブ映像
* アラート(呼び出しアラート、モーションアラート)
> [公式アナウンス](https://ring.com/jp/ja/support/articles/lw54x/comparing-ring-home-plans?hasLangChanged=true&srsltid=AfmBOoqUiY1jAQ0jszBul2hOQx6XxG8YEeOPbyqxzdunOjGC4PFxQjmy)を参考に読み取れた内容を記載したため未確認

### 追加機能
* アラート時録画保存
* スナップショット機能
* 通話機能(ドアベルコール)
* タイムライン表示

### その他
* 一時保存先はサーバストレージ、保存期間は1週間とする
* 長期保存先はGoogle Driveとし、保存期間は永続とする
* 一時保存先の画像・動画はタイムライン形式でWebページから確認可能とする
    - Webページについては自宅ネットワークからのみアクセス可能とする
* 一時保存先から長期保存先へのバックアップは毎日3:00(JST)に実行する

## 参考
* 録画開始までのラグは5秒程度
* スナップショットは即時撮影

## 開発環境
### ポート開放
WSL2 -> Windowsへのポートフォワーディングの設定方法
```powershell
netsh.exe interface portproxy add v4tov4 listenaddress=192.168.1.16 listenport=8080 connectaddress=127.0.0.1 connectport=8080

netsh.exe interface portproxy delete v4tov4  listenaddress=192.168.1.16 listenport=8080
```
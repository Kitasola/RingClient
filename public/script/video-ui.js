export class VideoUI {
    constructor(app) {
        this.app = app;
        // UIをキャンバスに追加
        this.group = new PIXI.Container();
        this.group.name = 'video-ui';
        this.group.x = this.app.screen.width / 2;
        this.group.y = this.app.screen.height - 58;
        this.app.stage.addChild(this.group);

        // ボタン
        this.playButton = null;
        this.pauseButton = null;
        this.skipButton = null;
        this.rewindButton = null;

        // 操作対象の動画
        this.playFunction = null;
        this.pauseFunction = null;
        this.skipFunction = null;
        this.rewindFunction = null;
    }

    // UIの初期化
    async init() {
        // 再生ボタン
        const playButtonTexture = await PIXI.Assets.load('/image/video-ui/start.png');
        this.playButton = new PIXI.Sprite(playButtonTexture);
        this.playButton.anchor.set(0.5);
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        // クリックイベント
        this.playButton.on('pointertap', () => {
            this.playFunction();
            this.playButton.visible = false;
            this.pauseButton.visible = true;
        });
        this.group.addChild(this.playButton);

        // 一時停止ボタン
        const pauseButtonTexture = await PIXI.Assets.load('/image/video-ui/pause.png');
        this.pauseButton = new PIXI.Sprite(pauseButtonTexture);
        this.pauseButton.anchor.set(0.5);
        this.pauseButton.interactive = true;
        this.pauseButton.buttonMode = true;
        // クリックイベント
        this.pauseButton.on('pointertap', () => {
            this.pauseFunction();
            this.pauseButton.visible = false;
            this.playButton.visible = true;
        });
        this.group.addChild(this.pauseButton);

        // 5sスキップボタン
        const skipButtonTexture = await PIXI.Assets.load('/image/video-ui/skip.png');
        this.skipButton = new PIXI.Sprite(skipButtonTexture);
        this.skipButton.anchor.set(0.5);
        this.skipButton.x = this.playButton.width + 10;
        this.skipButton.interactive = true;
        this.skipButton.buttonMode = true;
        // クリックイベント
        this.skipButton.on('pointertap', () => {
            this.skipFunction();
        });
        this.group.addChild(this.skipButton);

        // 5s巻き戻しボタン
        const rewindButtonTexture = await PIXI.Assets.load('/image/video-ui/rewind.png');
        this.rewindButton = new PIXI.Sprite(rewindButtonTexture);
        this.rewindButton.anchor.set(0.5);
        this.rewindButton.x = -(this.playButton.width + 10);
        this.rewindButton.interactive = true;
        this.rewindButton.buttonMode = true;
        // クリックイベント
        this.rewindButton.on('pointertap', () => {
            this.rewindFunction();
        });
        this.group.addChild(this.rewindButton);

        // ボタンの初期表示
        this.visible(true);
    }

    // 表示制御
    visible(visible) {
        this.group.visible = visible;
        if (visible) {
            this.playButton.visible = true;
            this.pauseButton.visible = false;
        }
    }

    play(func) {
        this.playFunction = func;
    }

    pause(func) {
        this.pauseFunction = func;
    }

    skip(func) {
        this.skipFunction = func;
    }

    rewind(func) {
        this.rewindFunction = func;
    }
}

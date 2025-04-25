export class VideoUI {
    constructor(app) {
        this.app = app;
        // UIをキャンバスに追加
        this.group = new PIXI.Container();
        this.group.name = 'video-ui';
        this.group.x = this.app.screen.width / 2;
        this.group.y = this.app.screen.height / 2;
        this.app.stage.addChild(this.group);

        // ボタンの初期化
        this.playButton = null;
        this.pauseButton = null;
        this.playFunction = null;
        this.pauseFunction = null;
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

    stop() {

    }

    next() {

    }
}


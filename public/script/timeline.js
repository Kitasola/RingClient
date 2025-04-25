import { VideoUI } from './video-ui.js'

window.addEventListener('load', async () => {
    // キャンバスの生成
    const app = new PIXI.Application()
    await app.init({
        width: 500,
        height: 500,
    })
    const parent_view = document.querySelector('.timeline-view')
    parent_view.appendChild(app.canvas)

    // 出力ファイル一覧の取得
    const res = await fetch('/output')
    const res_json = await res.json()

    // アセットの登録
    const output_textures = await Promise.all(
        res_json.files.map(async (file, i) => {
            return await PIXI.Assets.load('/output/' + file.name)
        })
    )

    // キャンバスへの配置
    let output_textures_id = 0
    const output_sprite = new PIXI.Sprite(output_textures[output_textures_id])
    app.stage.addChild(output_sprite)

    // 動画UIの作成
    const video_ui = new VideoUI(app)
    await video_ui.init()

    // 再生時の処理
    video_ui.play(() => {
        output_sprite.texture.source.resource.muted = false;
        output_sprite.texture.source.resource.play()
            .catch(err => console.log('Audio playback failed:', err));
    })

    // 一時停止時の処理
    video_ui.pause(() => {
        output_sprite.texture.source.resource.muted = true;
        output_sprite.texture.source.resource.pause()
    })

    // 5sスキップの処理
    video_ui.skip(() => {
        output_sprite.texture.source.resource.currentTime += 5;
        if (output_sprite.texture.source.resource.currentTime >= output_sprite.texture.source.resource.duration) {
            output_sprite.texture.source.resource.currentTime = output_sprite.texture.source.resource.duration
        }
    })

    //5s巻き戻しの処理
    video_ui.rewind(() => {
        output_sprite.texture.source.resource.currentTime -= 5;
        if (output_sprite.texture.source.resource.currentTime < 0) {
            output_sprite.texture.source.resource.currentTime = 0
        }
    });

    // 参照アセットの変更関数
    const changeAsset = async (id) => {
        // アセットが動画の場合
        if (output_sprite.texture.source.uploadMethodId === 'video') {
            // 再生停止
            output_sprite.texture.source.resource.currentTime = 0
            output_sprite.texture.source.resource.muted = true
            output_sprite.texture.source.resource.pause()
        }

        // アセットのスワップ
        output_textures_id = (id + output_textures.length) % output_textures.length
        output_sprite.texture = output_textures[output_textures_id]

        // リサイズ
        output_sprite.scale.x = app.screen.width / output_sprite.texture.width
        output_sprite.scale.y = app.screen.height / output_sprite.texture.height

        // キャプションの変更
        const texture_date = getDate(output_sprite.texture.label)
        const caption_date = document.querySelector('#caption-date')
        caption_date.textContent = texture_date.toLocaleString()

        // アセットが動画の場合
        if (output_sprite.texture.source.uploadMethodId === 'video') {
            // 再生位置を0sに変更
            output_sprite.texture.source.resource.currentTime = 0

            output_sprite.texture.source.resource.muted = true;
            output_sprite.texture.source.resource.playsInline = true;
            output_sprite.texture.source.resource.pause()

            // 再生中の処理
            output_sprite.texture.source.resource.addEventListener('timeupdate', () => {
                if (output_sprite.texture.source.uploadMethodId === 'video') {
                    // 再生終了時に次のアセットに変更
                    if (output_sprite.texture.source.resource.currentTime >= output_sprite.texture.source.resource.duration) {
                        // changeAsset(output_textures_id - 1)
                        output_sprite.texture.source.resource.pause()
                    }
                    // キャプションに再生位置を追加
                    caption_date.textContent = texture_date.toLocaleString() + ' + ' + output_sprite.texture.source.resource.currentTime.toFixed() + 's'
                }
            })

            // 動画用UIの表示
            video_ui.visible(true);
        }
        else {
            // 動画でない場合はUIを非表示
            video_ui.visible(false);
        }
    }

    // 登録されたアセットのうち最新のものを初期表示
    await changeAsset(output_textures_id)

    // マウス操作の設定
    output_sprite.eventMode = 'static'
    output_sprite.cursor = 'pointer'

    if (isMobile()) {
        // モバイル端末の場合はスワイプ操作を有効化
        output_sprite.on('pointerdown', (event) => {
            event.data.start_x = event.data.global.x

            output_sprite.once('pointerup', async (event) => {
                const swipe_distance = event.data.global.x - event.data.start_x

                // スワイプ距離が50px以上の場合
                if (Math.abs(swipe_distance) > 50) {
                    if (swipe_distance > 0) {
                        // 右スワイプの場合は前のアセットに変更
                        await changeAsset(output_textures_id + 1)
                    } else {
                        // 左スワイプの場合は次のアセットに変更
                        await changeAsset(output_textures_id - 1)
                    }
                }
            })
        })
    } else {
        // PCの場合はクリック操作を有効化
        output_sprite.on('pointertap', async (event) => {
            const sprite_center_x = output_sprite.x + (output_sprite.width / 2)

            if (event.data.global.x > sprite_center_x) {
                // 右側をクリックした場合は次のアセットに変更
                await changeAsset(output_textures_id - 1)
            } else {
                // 左側をクリックした場合は前のアセットに変更
                await changeAsset(output_textures_id + 1)
            }
        })
    }

})

function getDate(url) {
    const date_str = (new URL(url)).pathname.match(/\d{14}/)[0]
    const y = parseInt(date_str.substring(0, 4))
    const m = parseInt(date_str.substring(4, 6))
    const d = parseInt(date_str.substring(6, 8))
    const h = parseInt(date_str.substring(8, 10))
    const mm = parseInt(date_str.substring(10, 12))
    const s = parseInt(date_str.substring(12, 14))
    return new Date(y, m - 1, d, h, mm, s)
}

function isMobile() {
    const userAgent = navigator.userAgent || window.opera;
    return /android|iPad|iPhone|iPod/i.test(userAgent);
}
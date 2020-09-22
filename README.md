qrcode.js — JavaScript QR Code Generator
================================================================================

![test](https://github.com/zu-min-g/qrcode/workflows/test/badge.svg)

使い方 - browser
--------------------------------------------------------------------------------

```html
<script src="/path/to/qrcode.min.js"></script>
<canvas id="qr">
<script>
try {
    qrcode.generate('QR コードの内容', {
        // QR Code options
    }).drawToCanvas(document.getElementById('qr'), {
        // canvas options
    });
} catch (e) {
    // 生成失敗時の処理
}
</script>
```

使い方 - Vue with TypeScript
--------------------------------------------------------------------------------

```vue
<template>
    <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import Vue from 'vue'
import * as qr from '@zu-min/qrcode'
export default Vue.extend({
    mounted() {
        this.generate()
    },
    methods: {
        generate() {
            try {
                qr.generate("QR コードの内容", {
                    // QR Code options
                }).drawToCanvas(this.$refs.canvas as HTMLCanvasElement, {
                    // canvas options
                })
            } catch (e) {
                // 生成失敗時の処理
            }
        }
    }
})
</script>
```

QR Code options
--------------------------------------------------------------------------------

```js
{
    division: 1,
    level: qrcode.EccLevel.L,
    type: 1,
    encoder: {
        charset: 'utf8',
        useEci: false,
    },
    debug: false,
}
```

上記はデフォルト値です。

### division

構造的連接 QR コード（分割）を作成します。1 の場合は分割無し、2以降の場合は分割
の上限値として使用します。最大は 16 です。指定した数の QR コードを埋めるだけの
十分なデータがない場合、指定した数より少なくなります。

### level

誤り訂正レベルです。レベルが高いほど、QRコード読み取り時の誤り訂正能力が
上がりますが、その分データ量が多くなり QR コードの大きさも大きくなります。

```js
qrcode.EccLevel.L; // 低
qrcode.EccLevel.M;
qrcode.EccLevel.Q;
qrcode.EccLevel.H; // 高
```

### encoder

入力文字列を QR コード用に符号化するエンコーダーの設定です。
通常は設定値を含んだオブジェクトを指定します。
オブジェクトの代わりに独自の Encoder を指定することも可能です。

#### encoder.charset

指定した文字コードで符号化します。以下の文字コードに対応しています。

* `UTF-8`
* `Shift_JIS` ※ `①` など、機種により読み取れない文字があります

#### encoder.useEci

true の場合は ECI ヘッダを出力します。読み取り機によって対応可否があるので、
動作確認して決定してください。

### debug

true の場合、 console にログを出力します。

canvas options
--------------------------------------------------------------------------------

```js
{
    thickness: 1,
    color: 'rgb(0,0,0)',
    backgroundColor: 'rgb(255,255,255)',
    debug: false,
    flipHorizontal: false,
    transparent: false,
}
```

上記はデフォルト値です。

### thickness

モジュール（QRコードのドット1つ）の１辺の長さを px で指定します。

### color

モジュールの色を指定します。 `rgb(0, 0, 0)` 形式か、 `#000000` 形式で指定できます。

### backgroundColor

背景色を指定します。 `rgb(255, 255, 255)` 形式か、 `#ffffff` 形式で指定できます。

### debug

true の場合、デバッグ用に塗り分けを行います。

### flipHorizontal

true の場合、左右反転します。

### transparent

true の場合、背景を透明にします。

読み取り機種による制約
--------------------------------------------------------------------------------

### iPhone

* 構造的連接（分割）に非対応
* Shift_JIS の場合、機種依存文字（ `①` など）が含まれると読み取れない

### フィーチャーフォン（ガラケー）

* ECI ヘッダがあると読み取れない機種がある
* Shift_JIS しか読めない機種がある
* 構造的連接に対応していない機種がある

その他
--------------------------------------------------------------------------------

QR コード / QR Code はデンソーウェーブの登録商標です。

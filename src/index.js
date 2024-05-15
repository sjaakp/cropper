import './index.css';
import version from './version';

function Cropper(elmt, translations = {}, options = {}) {
    this.settings = Object.assign({}, this.defaults, options, elmt.dataset);
    this.text = Object.assign({}, this.defaultText, translations);
    this._sanitizeSettings();

    const wrap = document.createElement('div'),
        preview = document.createElement('div'),
        drop = document.createElement('div'),
        overlay = document.createElement('div'),
        image = document.createElement('img'),
        zoomCtrl = document.createElement('input'),
        msg = document.createElement('div'),
        jsonData = document.createElement('input'),
        label = document.createElement('label'),
        empty = document.createElement('button');

    wrap.classList.add('cropper-wrap');
    preview.classList.add('cropper-preview');
    drop.classList.add('cropper-drop');
    drop.innerText = this.text.drop;
    msg.classList.add('cropper-msg');

    overlay.classList.add('cropper-overlay');

    image.classList.add('cropper-image');
    zoomCtrl.classList.add('cropper-scale');
    zoomCtrl.type = 'range';
    zoomCtrl.setAttribute('step', 'any');
    zoomCtrl.setAttribute('title', this.text.zoom);

    jsonData.type = 'hidden';
    jsonData.name = (elmt.name || 'cropper') + '-data';

    label.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512' fill='currentColor'><path d='M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM215.3 292c-4.68 0-9.051 2.34-11.65 6.234L164 357.8l-11.68-17.53C149.7 336.3 145.3 334 140.7 334c-4.682 0-9.053 2.34-11.65 6.234l-46.67 70c-2.865 4.297-3.131 9.82-.6953 14.37C84.09 429.2 88.84 432 93.1 432h196c5.163 0 9.907-2.844 12.34-7.395c2.436-4.551 2.17-10.07-.6953-14.37l-74.67-112C224.4 294.3 220 292 215.3 292zM128 288c17.67 0 32-14.33 32-32S145.7 224 128 224S96 238.3 96 256S110.3 288 128 288z' /svg>";
    label.setAttribute('title', this.text.choose);

    empty.type = 'button';
    empty.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='currentColor'><path d='M630.8 469.1l-55.95-43.85C575.3 422.2 575.1 419.2 575.1 416l.0034-320c0-35.35-28.65-64-64-64H127.1C113.6 32 100.4 36.98 89.78 45.06L38.81 5.113C28.34-3.058 13.31-1.246 5.109 9.192C-3.063 19.63-1.235 34.72 9.187 42.89L601.2 506.9C605.6 510.3 610.8 512 615.1 512c7.125 0 14.17-3.156 18.91-9.188C643.1 492.4 641.2 477.3 630.8 469.1zM527.1 388.5l-36.11-28.3l-100.7-136.8C387.8 218.8 382.1 216 376 216c-6.113 0-11.82 2.768-15.21 7.379L344.9 245L261.9 180C262.1 176.1 264 172.2 264 168c0-26.51-21.49-48-48-48c-8.336 0-16.05 2.316-22.88 6.057L134.4 80h377.6c8.822 0 16 7.178 16 16V388.5zM254.2 368.3l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L111.1 184.5l-48-37.62L63.99 416c0 35.35 28.65 64 64 64h361.1l-201.1-157.6L254.2 368.3z' /svg>";
    empty.setAttribute('title', this.text.empty);

    elmt.parentNode.insertBefore(wrap, elmt);
    label.append(elmt);
    preview.append(drop, image, overlay);
    wrap.append(preview, zoomCtrl, label, empty, msg, jsonData);

    elmt.cropper = this;
    this.element = elmt;
    this.preview = preview;
    this.overlay = overlay;
    this.image = image;
    this.zoomCtrl = zoomCtrl;
    this.msg = msg;
    this.jsonData = jsonData;
    this.wrap = wrap;

    this.aspect = 1;
    this.scale = 1;     // minimum scale to let image cover preview
    this.translate = { x: 0, y: 0 };
    this.range = { x: 0, y: 0 };
    this.imageSize = { width: 0, height: 0 };   // after scaling

    this.zoom = 1;  // always > 1

    this.dragging = -1;
    this.loaded = false;

    elmt.addEventListener('change', function(ev) {
        this._loadFile();
    }.bind(this));

    preview.addEventListener('dragenter', function(ev) {
        // ev.stopPropagation();
        ev.preventDefault();
    });

    preview.addEventListener('dragover', function(ev) {
        // ev.stopPropagation();
        ev.preventDefault();
    });

    preview.addEventListener('drop', function(ev) {
        // ev.stopPropagation();
        ev.preventDefault();
        this.element.files = ev.dataTransfer.files;
        this._loadFile();
    }.bind(this));

    overlay.addEventListener('pointerdown', function(ev) {
        if (this.loaded && ev.button === 0)    {
            this.dragging = ev.pointerId;
        }
    }.bind(this));

    document.addEventListener('pointerup', function(ev) {
        if (ev.pointerId === this.dragging) {
            this.move(ev.movementX, ev.movementY);
            this.dragging = -1;
        }
    }.bind(this));

    document.addEventListener('pointermove', function(ev) {
        if (ev.pointerId === this.dragging)  {
            this.move(ev.movementX, ev.movementY);
        }
    }.bind(this));

    overlay.addEventListener('dblclick', function(ev) {
        if (this.loaded)    {
            this.translate = { x: 0, y: 0 };
            this.move(0, 0);
        }
    }.bind(this));

    zoomCtrl.addEventListener('input', function(ev) {
        this.setZoom(Math.exp(ev.target.valueAsNumber));
    }.bind(this));

    zoomCtrl.addEventListener('dblclick', function(ev) {
        ev.target.value = 0;
        this.setZoom(1);
    }.bind(this));

    empty.addEventListener('click', function(ev) {
        this.loadImage(false);
    }.bind(this));

    this.setAspect(this.settings.aspect);
    this._setCrop();

    // console.log(this);
}

Cropper.prototype = {

    version: `v${version.version}, ${version.date}`,

    defaults: {
        aspect: 1,
        margin: 40,
        diagonal: 300,
        maxZoom: 4
    },

    defaultText: {
        choose: 'Choose an image...',
        empty: 'Empty cropper',
        drop: 'Drop file here',
        zoom: 'Zoom',
    },

    loadImage(url) {
        this.wrap.classList.remove('cropper-loaded');

        if (!url) {
            this.image.removeAttribute('src');
            const dt = new DataTransfer();
            this.element.files = dt.files;
            this._resetAll();
            this.msg.innerText = '';
            this.imageAsp = 1;
            return; // empty
        }

        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const type = blob.type,
                    name = url.replace(/^.*[\\\/]/, ''),
                    size = blob.size;

                const file = new File([blob], name, {
                    type: type,
                });

                const dt = new DataTransfer(); // https://stackoverflow.com/questions/5632629/how-to-change-a-file-inputs-filelist-programmatically
                dt.items.add(file);
                this.element.files = dt.files;
                this._loadFile();
            })
    },

    _loadFile() {
        const file = this.element.files[0];
        if (file.type.match(/image.*/))  {
            const reader = new FileReader();
            reader.addEventListener('load', function(ev) {
                this.loaded = false;
                this.wrap.classList.remove('cropper-loaded');

                const preload = new Image();

                preload.addEventListener('load', function(evt) {
                    this.loaded = true;
                    this.wrap.classList.add('cropper-loaded');
                    this.image.setAttribute('src', evt.target.src);
                    this._resetAll();
                }.bind(this));

                preload.src = ev.target.result;
                this.msg.innerText = file.name;
            }.bind(this));
            reader.readAsDataURL(file);
        }
    },

    _sanitizeSettings() {
        const asp = this.settings.aspect;
        if (! isNaN(asp) && (asp < .2 || asp > 5)) this.settings.aspect = this.defaults.aspect;
        const diag = this.settings.diagonal;
        if (diag < 80 || diag > 2000) this.settings.diagonal = this.defaults.diagonal;
        const mrg = this.settings.margin;
        if (mrg < 8 || mrg > 200) this.settings.margin = this.defaults.margin;
        const mz = this.settings.maxZoom;
        if (mz < 2 || mz > 10) this.settings.maxZoom = this.defaults.maxZoom;
    },

    _setCrop() {
        let asp = this.aspect,
            d = Math.sqrt(1 + asp * asp),       // Pythagoras
            h = this.settings.diagonal / d,
            w = h * asp,
            margins = 2 * this.settings.margin,
            styleOverlay = this.overlay.style,
            stylePreview = this.preview.style;

        styleOverlay.width = `${w}px`;
        styleOverlay.aspectRatio = asp;
        styleOverlay.borderWidth = `${this.settings.margin}px`;

        stylePreview.width = `${w + margins}px`;
        stylePreview.height = `${h + margins}px`;
    },

    _calcBaseScale()    {
        this.scale = this.loaded ? Math.max(this.overlay.clientWidth / this.image.naturalWidth,
            this.overlay.clientHeight / this.image.naturalHeight) : 1;
    },

    _calcRange()    {
        this.range = {
            x: (this.imageSize.width - this.overlay.clientWidth) / 2,
            y: (this.imageSize.height - this.overlay.clientHeight) / 2,
        };
    },

    _setMaxZoom()   {
        const lnMz = Math.log(this.settings.maxZoom);

        this.zoomCtrl.value = Math.min(lnMz, this.zoomCtrl.valueAsNumber);
        this.zoomCtrl.setAttribute('max', lnMz);
    },

    _resetZoom()    {
        this.zoomCtrl.setAttribute('min', 0);
        this._setMaxZoom();
        this.zoomCtrl.value = 0;
        this.setZoom(1);
    },

    setZoom(zoom)   {
        const sz = zoom * this.scale;

        this.zoom = zoom;
        this.image.style.scale = sz;
        this.imageSize = {
            width: sz * this.image.naturalWidth,
            height: sz * this.image.naturalHeight
        }
        this._calcRange();
        this.move(0, 0);
    },

    setAspect(aspect)   {
        const presets = {
            tower: 0.429,             // 9 x 21
            high: 0.563,              // 9 x 16
            din_portrait: 0.707,      // 1 x sqrt(2)
            portrait: 0.75,           // 3 x 4
            // square: 1.0,              // 1 x 1, default
            landscape: 1.333,         // 4 x 3
            din_landscape: 1.414,     // sqrt(2) x 1
            wide: 1.718,              // 16 x 9
            cinema: 2.333             // 21 x 9
        };
        if (isNaN(aspect)) aspect = presets[aspect] ?? 1.0;
        this.aspect = +aspect;
        this._sanitizeSettings();
        this._resetAll();
    },

    setMargin(margin)   {
        this.settings.margin = margin;
        this._sanitizeSettings();
        this._setCrop();
    },

    setDiagonal(diag)   {
        this.settings.diagonal = diag;
        this._sanitizeSettings();
        this._resetAll();
    },

    _resetAll() {
        this.translate = { x: 0, y: 0 };
        this._setCrop();
        this._calcBaseScale();
        this._calcRange();
        this._resetZoom();
    },

    move(dx, dy)  {
        let x = this.translate.x + dx,
            y = this.translate.y + dy;

        x = Math.max(-this.range.x, Math.min(x, this.range.x));   // clamp
        y = Math.max(-this.range.y, Math.min(y, this.range.y));

        this.translate = { x: x, y: y };
        this.image.style.translate = `${x}px ${y}px`;

        const dims = this.getDimensions();
        this.jsonData.value = JSON.stringify(dims);

        this.element.dispatchEvent(new CustomEvent('cropperchange', { detail: dims }));
    },

    getDimensions() {
        const sz = this.zoom * this.scale,
            cw = this.overlay.clientWidth,
            ch = this.overlay.clientHeight,
            iw = this.imageSize.width,
            ih = this.imageSize.height
        ;

        const r = {
            aspect: this.aspect,
            x: this.loaded ? ((this.imageSize.width - cw) / 2 - this.translate.x/* + dx*/) / sz : 0,
            y: this.loaded ? ((this.imageSize.height - ch) / 2 - this.translate.y/* + dy*/) / sz : 0,
            w: this.loaded ? cw / sz : 0,
            h: this.loaded ? ch / sz : 0,
        };

        return r;
    }
}


window.cropper = function(translations = {}, options = {}, selector = '[type=file]')   {
    return [...document.querySelectorAll(selector)].map(v => new Cropper(v, translations, options));
}

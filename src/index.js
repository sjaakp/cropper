import './index.css';
const version = 'v2.1.1 2024-06-16';

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
        rotCtrl = document.createElement('input'),
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
    zoomCtrl.setAttribute('min', '0');
    zoomCtrl.setAttribute('step', 'any');
    zoomCtrl.setAttribute('title', this.text.zoom);

    rotCtrl.type = 'range';
    rotCtrl.setAttribute('step', 'any');
    rotCtrl.setAttribute('title', this.text.angle);
    rotCtrl.value = '0';
    rotCtrl.classList.add('cropper-rotation');

    jsonData.type = 'hidden';
    jsonData.name = /(.*)\[(.*)]/gm.exec(elmt.name) ?
        `${(/(.*)\[(.*)]/gm.exec(elmt.name))[1]}[${(/(.*)\[(.*)]/gm.exec(elmt.name))[2]}_data]` :
        (elmt.name || 'cropper') + '_data';

    label.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512' fill='currentColor'><path d='M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM215.3 292c-4.68 0-9.051 2.34-11.65 6.234L164 357.8l-11.68-17.53C149.7 336.3 145.3 334 140.7 334c-4.682 0-9.053 2.34-11.65 6.234l-46.67 70c-2.865 4.297-3.131 9.82-.6953 14.37C84.09 429.2 88.84 432 93.1 432h196c5.163 0 9.907-2.844 12.34-7.395c2.436-4.551 2.17-10.07-.6953-14.37l-74.67-112C224.4 294.3 220 292 215.3 292zM128 288c17.67 0 32-14.33 32-32S145.7 224 128 224S96 238.3 96 256S110.3 288 128 288z' /svg>";
    label.setAttribute('title', this.text.choose);

    empty.type = 'button';
    empty.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='currentColor'><path d='M630.8 469.1l-55.95-43.85C575.3 422.2 575.1 419.2 575.1 416l.0034-320c0-35.35-28.65-64-64-64H127.1C113.6 32 100.4 36.98 89.78 45.06L38.81 5.113C28.34-3.058 13.31-1.246 5.109 9.192C-3.063 19.63-1.235 34.72 9.187 42.89L601.2 506.9C605.6 510.3 610.8 512 615.1 512c7.125 0 14.17-3.156 18.91-9.188C643.1 492.4 641.2 477.3 630.8 469.1zM527.1 388.5l-36.11-28.3l-100.7-136.8C387.8 218.8 382.1 216 376 216c-6.113 0-11.82 2.768-15.21 7.379L344.9 245L261.9 180C262.1 176.1 264 172.2 264 168c0-26.51-21.49-48-48-48c-8.336 0-16.05 2.316-22.88 6.057L134.4 80h377.6c8.822 0 16 7.178 16 16V388.5zM254.2 368.3l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L111.1 184.5l-48-37.62L63.99 416c0 35.35 28.65 64 64 64h361.1l-201.1-157.6L254.2 368.3z' /svg>";
    empty.setAttribute('title', this.text.empty);

    elmt.parentNode.insertBefore(wrap, elmt);
    label.append(elmt);

    preview.append(drop, image, overlay);
    wrap.append(preview, zoomCtrl, rotCtrl, label, empty, msg, jsonData);

    elmt.cropper = this;
    this.element = elmt;
    this.preview = preview;
    this.overlay = overlay;
    this.image = image;
    this.zoomCtrl = zoomCtrl;
    this.rotCtrl = rotCtrl;
    this.msg = msg;
    this.jsonData = jsonData;
    this.wrap = wrap;

    this.aspect = 1;
    this.imageAsp = 1;
    this.scale = 1;     // minimum scale to let image cover preview
    this.translate = { x: 0, y: 0 };
    this.range = { x: 0, y: 0 };
    this.imageSize = { width: 0, height: 0 };   // after scaling
    this.envelopeSize = { width: 0, height: 0 };   // after scaling and rotation

    this.zoom = 1;  // always >= 1
    this.rotation = 0;
    this.rotSin = 0;
    this.absSin = 0; // abs value
    this.rotCos = 1; //. always >=0 (assuming rotation is between - pi/2 and pi/2)
    this.rotScale = 1; // extra scale resulting from rotation, always >= 1

    this.enabled = true;
    this.dragging = -1;
    this.loaded = false;

    elmt.addEventListener('change', (_ev) => {
        this._loadFile();
    });

    preview.addEventListener('dragenter', (ev) => {
        ev.preventDefault();
    });

    preview.addEventListener('dragover', (ev) => {
        ev.preventDefault();
    });

    preview.addEventListener('drop', (ev) => {
        ev.preventDefault();
        this.element.files = ev.dataTransfer.files;
        this._loadFile();
    });

    overlay.addEventListener('pointerdown', (ev) => {
        if (this.loaded && this.enabled && ev.button === 0)    {
            this.wrap.classList.add('cropper-dragging');
            this.dragging = ev.pointerId;
        }
    });

    document.addEventListener('pointerup', (ev) => {
        if (ev.pointerId === this.dragging) {
            this.move(ev.movementX, ev.movementY);
            this.wrap.classList.remove('cropper-dragging');
            this.dragging = -1;
            this._update();
        }
    });

    document.addEventListener('pointermove', (ev) => {
        if (ev.pointerId === this.dragging)  {
            this.move(ev.movementX, ev.movementY);
            this._update();
        }
    });

    overlay.addEventListener('dblclick', (_ev) => {
        if (this.loaded)    {
            this._resetTranslate();
            this._update();
        }
    });

    zoomCtrl.addEventListener('input', (ev) => {
        this.setZoom(Math.exp(ev.target.valueAsNumber));
        this._update();
    });

    zoomCtrl.addEventListener('dblclick', (ev) => {
        ev.target.value = 0;
        this.setZoom(1);
        this._update();
    });

    rotCtrl.addEventListener('input', (ev) => {
        this.setRotation(- ev.target.valueAsNumber);
        this._update();
    });

    rotCtrl.addEventListener('dblclick', (_ev) => {
        this._resetRotation();
        this._update();
    });

    empty.addEventListener('click', (_ev) => {
        this.loadImage(false);
    });

    this.setMaxRotation(this.settings.maxRotation);
    this.setMaxZoom(this.settings.maxZoom);
    this.setAspect(this.settings.aspect);
    this._setCrop();

    // console.log(this);
}

Cropper.prototype = {

    version: version,

    defaults: {
        aspect: 1,
        margin: 40,
        diagonal: 300,
        maxZoom: 4,
        maxRotation: 30
    },

    defaultText: {
        choose: 'Choose an image...',
        empty: 'Empty cropper',
        drop: 'Drop file here',
        zoom: 'Zoom',
        angle: 'Angle'
    },

    loadImage(url, bEnable = true) {
        this.wrap.classList.remove('cropper-loaded');

        if (!url) {
            this.image.removeAttribute('src');
            const dt = new DataTransfer();
            this.element.files = dt.files;
            this.loaded = false;
            this._resetAll();
            this.msg.innerText = '';
            this.imageAsp = 1;
            this.enable(bEnable);
            this._update();

            return; // empty
        }

        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const name = url.replace(/^.*[\\\/]/, '');
                let type = blob.type;

                // Not all web servers serve .avif with the right MIME-type
                // https://shortpixel.com/blog/avif-mime-type-delivery-apache-nginx/
                if (name.endsWith('.avif')) type = 'image/avif';

                const file = new File([blob], name, {
                    type: type,
                });

                const dt = new DataTransfer(); // https://stackoverflow.com/questions/5632629/how-to-change-a-file-inputs-filelist-programmatically
                dt.items.add(file);
                this.element.files = dt.files;
                this._loadFile(bEnable);
            })
    },

    _loadFile(bEnable = true) {
        const file = this.element.files[0];
        if (file.type.startsWith('image/'))  {
            const reader = new FileReader();
            reader.addEventListener('load', (ev) => {
                this.loaded = false;
                this.wrap.classList.remove('cropper-loaded');

                const preload = new Image();

                preload.addEventListener('load', (evt) => {
                    this.loaded = true;
                    this.wrap.classList.add('cropper-loaded');
                    this.image.setAttribute('src', evt.target.src);
                    this.imageAsp = this.image.naturalWidth / this.image.naturalHeight;
                    this._resetAll();
                    this._calcImgSize();
                    this.enable(bEnable);
                    this._update();
                });

                preload.src = ev.target.result;
                this.msg.innerText = file.name;
            });
            reader.readAsDataURL(file);
        }
    },

    _sanitizeSettings() {
        const asp = this.settings.aspect;
        if (! isNaN(asp)) this.settings.aspect = this._clamp(asp, .2, 5);
        this.settings.diagonal = this._clamp(this.settings.diagonal, 80, 2000);
        this.settings.margin = this._clamp(this.settings.margin, 8, 200);
        this.settings.maxZoom = this._clamp(this.settings.maxZoom, 2, 10);
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

    _calcImgSize() {
        const sz = this.zoom * this.scale * this.rotScale,
            w = sz * this.image.naturalWidth,
            h = sz * this.image.naturalHeight;

        this.imageSize = {
            width: w,
            height: h
        }

        this.envelopeSize = {
            width: w * this.rotCos + h * this.absSin,
            height: w * this.absSin + h * this.rotCos
        }
   },

    _calcScale()    {
        this.scale = this.loaded ? Math.max(this.overlay.clientWidth / this.image.naturalWidth,
            this.overlay.clientHeight / this.image.naturalHeight) : 1;
    },

    _resetTranslate()   {
        this.translate = { x: 0, y: 0 };
    },

    _resetZoom()    {
        this.zoomCtrl.value = '0';
        this.setZoom(1);
    },

    setZoom(zoom)   {
        this.zoom = zoom;
        this._calcImgSize();
    },

    _resetRotation()    {
        this.rotCtrl.value = '0';
        this.setRotation(0);
    },

    setRotation(rot) {
        const sin = Math.sin(rot),
            cos = Math.cos(rot),
            absSin = Math.abs(sin),
            asp = this.aspect,
            imgAsp = this.imageAsp;

        let hScale = cos + absSin / asp,
            vScale = cos + absSin * asp;

        if (asp > imgAsp) {
            vScale *= imgAsp/asp;
        } else {
            hScale *= asp/imgAsp;
        }

        this.rotation = rot;
        this.rotSin = sin;
        this.absSin = absSin;
        this.rotCos = cos;
        this.rotScale = Math.max(hScale, vScale);
        this._calcImgSize();
    },

    setAspect(aspect)   {
        const presets = {
            tower: 0.429,             // 9 x 21
            high: 0.563,              // 9 x 16
            phi_portrait: 0.618,      // 1 x phi, golden ratio
            din_portrait: 0.707,      // 1 x sqrt(2)
            portrait: 0.75,           // 3 x 4
            // square: 1.0,              // 1 x 1, default
            landscape: 1.333,         // 4 x 3
            din_landscape: 1.414,     // sqrt(2) x 1
            phi_landscape: 1.618,     // phi x 1
            wide: 1.718,              // 16 x 9
            cinema: 2.333             // 21 x 9
        };
        if (isNaN(aspect)) aspect = presets[aspect] ?? 1.0;
        this.aspect = +aspect;  // ensure float
        this._resetAll();
        this._update();
    },

    setMargin(margin)   {
        console.log('setMargin', margin);
        this.settings.margin = margin;
        this._sanitizeSettings();
        console.log(this.settings);
        this.overlay.style.borderWidth = `${this.settings.margin}px`;
        this._setCrop();
    },

    setDiagonal(diag)   {
        this.settings.diagonal = diag;
        this._sanitizeSettings();
        this._resetAll();
        this._update();
    },

    setMaxRotation(degrees) {
        const deg = this._clamp(degrees, 0, 90),
            rad = deg * Math.PI / 180;

        this.rotCtrl.setAttribute('min', (-rad).toString());
        this.rotCtrl.setAttribute('max', rad.toString());

        if (rad)    {
            this.wrap.classList.remove('cropper-no-rotation');
        } else {
            this.wrap.classList.add('cropper-no-rotation');
        }

        this._resetRotation();
        this._update();
    },

    setMaxZoom(zoom)   {
        const lnMz = Math.log(zoom);

        this.zoomCtrl.value = Math.min(lnMz, this.zoomCtrl.valueAsNumber).toString();
        this.zoomCtrl.setAttribute('max', lnMz.toString());
    },

    enable(b = ! this.enabled) {
        this.enabled = b;
        if (b)  {
            this.zoomCtrl.removeAttribute('disabled');
            this.rotCtrl.removeAttribute('disabled');
        } else {
            this.zoomCtrl.setAttribute('disabled', '');
            this.rotCtrl.setAttribute('disabled', '');
        }
    },

    _update() {
        const cw = this.overlay.clientWidth / 2,
            ch = this.overlay.clientHeight / 2,
            iw = this.imageSize.width / 2,
            ih = this.imageSize.height / 2;

        // rotate translate
        let tr = this._rotatePoint(this.translate);

        [0, 1, 2, 3].forEach((v) => {
            const left = !(v & 1),
                top = !(v & 2),
                fx = left ? -cw : cw,   // frame corner
                fy = top ? -ch : ch;

            let ix = left ? -iw : iw,   // corresponding image corner
                iy = top ? -ih : ih;

            ix += tr.x;     // move image corner with rotated translate
            iy += tr.y;

            const corner = { x: fx, y:fy }, // frame corner, rotate
                rotated = this._rotatePoint(corner),
                clamp = {   // clamp rotated frame corner against corresponding image corner
                    x: left ? Math.max(ix, rotated.x) : Math.min(ix, rotated.x),
                    y: top ? Math.max(iy, rotated.y) : Math.min(iy, rotated.y)
                },
                corrected = this._counterRotatePoint(clamp);    // rotate back

            tr.x -= corrected.x - corner.x;  // adapt translate as needed
            tr.y -= corrected.y - corner.y;
        });

        this.translate = this._counterRotatePoint(tr);

        this.image.style.scale = (this.zoom * this.scale * this.rotScale).toString();
        this.image.style.translate = `${this.translate.x}px ${this.translate.y}px`;
        this.image.style.rotate = `${this.rotation}rad`;

        const dims = this.getDimensions();
        this.jsonData.value = JSON.stringify(dims);

        this.element.dispatchEvent(new CustomEvent('cropperchange', { detail: dims }));
    },

    _resetAll() {
        this._resetRotation();
        this._resetZoom();
        this._resetTranslate();
        this._setCrop();
        this._calcScale();
    },

    move(dx, dy)  {
        // this.translate = this._clampTrans({ x: this.translate.x + dx, y: this.translate.y + dy });
        this.translate.x += dx;
        this.translate.y += dy;
    },

    getDimensions() {
        const sz = this.zoom * this.scale * this.rotScale,
            cw = this.overlay.clientWidth,
            ch = this.overlay.clientHeight;

        return {
            aspect: this.aspect,
            angle: -this.rotation,
            degrees: -this.rotation * 180 / Math.PI,
            x: this.loaded ? ((this.envelopeSize.width - cw) / 2 - this.translate.x/* + dx*/) / sz : 0,
            y: this.loaded ? ((this.envelopeSize.height - ch) / 2 - this.translate.y/* + dy*/) / sz : 0,
            w: this.loaded ? cw / sz : 0,
            h: this.loaded ? ch / sz : 0,
        };
    },

    _clamp(value, min, max)    {
        return Math.min(Math.max(min, value), max);
    },

    _rotatePoint(p) {
        return {
            x: p.x * this.rotCos + p.y * this.rotSin,
            y: - p.x * this.rotSin + p.y * this.rotCos
        };
    },

    _counterRotatePoint(p) {
        return {
            x: p.x * this.rotCos - p.y * this.rotSin,
            y: p.x * this.rotSin + p.y * this.rotCos
        };
    }
}


window.cropper = (translations = {}, options = {}, selector = '[type=file]') =>
    [...document.querySelectorAll(selector)].map(v => v.cropper ?? new Cropper(v, translations, options));

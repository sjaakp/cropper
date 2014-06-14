/*global File, FileList, FileReader, Image, Math, jQuery */
/*jslint nomen: true, unparam: true, white: true */
/**
 * MIT licence
 * Version 1.0
 * Sjaak Priester, Amsterdam 13-06-2014.
 */
(function ($) {
    "use strict";
    $.widget("sjaakp.cropper", {

        options: {
            aspectRatio: 1,
            margin: 40,
            diagonal: 300,
            minSize: 240,
            zoomMax: 3,
            sliderPosition: "bottom",
            sliderOptions: {}
        },

        scale: 1,
        zoom: 1,
        crop: true,
        loaded: false,

        loadImage: function (file) {
            var that = this,
                thisFile,
                reader;

            this.crop = true;
            this.overlay.show();
            this.loaded = false;
            this.preview.removeClass("sjaakp-state-loaded sjaakp-state-nocrop");
            if (!file) {
                this._empty();
                return;
            }
            if (file instanceof FileList) { thisFile = file[0]; }
            else if (file instanceof File) { thisFile = file; }
            else {
                this._loadSrc(file);
                return;
            }

            if (thisFile.type.match(/image.*/))  {
                reader = new FileReader();
                reader.onload = function (evt) {
                    that._loadSrc(evt.target.result);
                };
                reader.readAsDataURL(thisFile);
            }
            else { this._empty(); }
        },

        _create: function () {

            this.img = $('<img>').addClass("sjaakp-img");
            this.overlay = $("<div>").addClass("sjaakp-overlay");

            this.preview = $("<div>").addClass("sjaakp-preview")
                .append(this.img, this.overlay);

            this.slider = $("<div>").addClass("sjaakp-slider")
                .slider($.extend({}, this.options.sliderOptions, {  // don't let user override our options
                    disabled: true,
                    min: 1,
                    max: this.options.zoomMax,
                    step: 0.01,
                    orientation: this.options.sliderPosition === "top" || this.options.sliderPosition === "bottom" ?
                        "horizontal" : "vertical"
                }));
            this._calcPreviewSize();
            this._setMargin();

            this.element.append(this.preview);
            this._positionSlider();

            this._on(this.slider, {
                slide: function (evt, ui) {
                    this._changeZoom(ui.value);
                }
            });

            var dragging = false;
            this._on(this.overlay, {
                mousedown: function (evt) {
                    if (evt.which === 1) {
                        var d = {
                            left: evt.pageX,
                            top: evt.pageY
                            },
                            startPos = this.img.position();     // this = widget
                        dragging = true;

                        this._on(this.document, {
                            mousemove: function (evt) {
                                if (dragging) {
                                    this._setImgPosition({
                                        left: startPos.left + evt.pageX - d.left,
                                        top: startPos.top + evt.pageY - d.top
                                    });
                                    this._report();
                                    evt.preventDefault();
                                }
                            },
                            mouseup: function (evt) {
                                if (dragging)   {
                                    this._off(this.document, "mousemove mouseup");  // unbind events
                                    dragging = false;
                                    evt.preventDefault();
                                }
                            }
                        });

                        evt.preventDefault();
                    }
                }
            });
        },

        _setOption: function (key, value)    {
            this._super(key, value);
            if (key !== "sliderOptions") {
                this._update();
                if (key === "margin") { this._setMargin(); }
                else if (key === "aspectRatio" && this.loaded) { this._centerImage(); }
                else if (key === "sliderPosition") { this._positionSlider(); }
            }
            if (this.loaded) { this._report(); }
        },

        _empty: function ()  {
            this.img.removeAttr("src");
            this._reportNull();
            this._reset();
        },

        _reset: function ()  {
            this.zoom = this.scale = 1;
            this.slider.slider("option", "value", 1).slider("disable");
        },

        _loadSrc: function (src)  {
            var that = this,
                preload = new Image();

            preload.src = src;

            preload.onload = function () {
                that.nativeSize = {
                    width: this.width,
                    height: this.height
                };

                that.img.attr("src", this.src);
                that.zoom = 1;
                that.loaded = true;
                that.slider.slider("option", "value", 1);
                that._update();
                that._centerImage();
                that.preview.addClass("sjaakp-state-loaded");
                that._report();
            };
        },

        _update: function () {
            this._calcPreviewSize();
            if (this.loaded)    {
                this._calcScale();
                this._setImgSize();
                this._setSlider();
            }
        },

        // Calculate and set preview size based on aspect ratio, margin and diagonal.
        _calcPreviewSize: function ()    {
            var asp = this.options.aspectRatio,
                d = Math.sqrt(1 + asp * asp),       // Pythagoras
                f = this.options.diagonal / d,
                margins = 2 * this.options.margin,
                w = f * asp + margins,              // compensate for crop margins
                h = f + margins;

            this.previewSize = {
                width: w,
                height: h
            };
            this.preview.css(this.previewSize);     // set preview size
            this._sizeSlider();
        },

        // Calculate base scale for the image: the smallest scale where the image fits the crop area.
        _calcScale: function ()  {
            var cropWidth = this.previewSize.width - 2 * this.options.margin,
                cropHeight = this.previewSize.height - 2 * this.options.margin,
                scale =  Math.max(cropWidth / this.nativeSize.width, cropHeight / this.nativeSize.height);

            if (scale > 1)  {
                scale = 1;
                this.overlay.hide();
                this.preview.addClass("sjaakp-state-nocrop");
                this._reset();
                this.crop = false;
                this._reportNull();
            }

            this.scale = scale;
        },

        // Set img size
        _setImgSize: function ()    {
            var f = this.scale * this.zoom;
            this.imgSize = {
                width: f * this.nativeSize.width,
                height: f * this.nativeSize.height
            };
            this.img.css(this.imgSize);
            this._setImgPosition(this.img.position());      // ensure img is constrained
        },

        _setSlider: function ()  {
            var zoomMax = this.options.zoomMax,
                cropped;
            if (this.options.minSize > 0)   {
                cropped = this.options.aspectRatio >= 1 ? this.previewSize.width : this.previewSize.height;
                cropped -= 2 * this.options.margin;
                cropped /= this.scale;
                zoomMax = cropped / this.options.minSize;
            }
            if (this.zoom > zoomMax)    {
                this.zoom = Math.max(zoomMax, 1);
                this._setImgSize();
            }
            if (zoomMax > 1) { this.slider.slider("option", "max", zoomMax).slider("enable"); }
            else { this._reset(); }
        },

        _positionSlider: function() {
            var pos = this.options.sliderPosition;
            this.slider.slider("option", "orientation", pos === "top" || pos === "bottom" ? "horizontal" : "vertical");
            this.element.attr("class", "sjaakp-cropper sjaakp-spos-" + this.options.sliderPosition);
            if (pos === "top" || pos === "left")    {
                this.element.prepend(this.slider);
            }
            else    {
                this.element.append(this.slider);
            }
            this._sizeSlider();
        },

        _sizeSlider: function() {
            var pos = this.options.sliderPosition;
            if (pos === "top" || pos === "bottom")  {
                this.slider.width(this.preview.width()).height("");
            }
            else    {
                this.slider.height(this.preview.height()).width("")
                    .find("a").css( {left: "" });   // hack to solve position problem in slider handle
            }
        },

        // Set margin. Implemented as border of overlay.
        _setMargin: function ()  {
            this.overlay.css({ borderWidth: this.options.margin });
        },

        // Set img position, constraining it to the crop area.
        _setImgPosition: function (pos)  {
            var m = this.options.margin;
            this.img.css({
                left: Math.max(Math.min(pos.left, m), this.previewSize.width - this.imgSize.width - m),
                top: Math.max(Math.min(pos.top, m), this.previewSize.height - this.imgSize.height - m)
            });
        },

        // Change zoom. Center point of crop area remains the same.
        _changeZoom: function (zoom) {
            var posImg = this.img.position(),
                pos = {                 // translate center point of crop area to origin
                    left: this.previewSize.width / 2 - posImg.left,
                    top: this.previewSize.height / 2 - posImg.top
                },
                f = zoom / this.zoom;   // new zoom value / old zoom value
            pos.left *= f;              // scale
            pos.top *= f;
            this.zoom = zoom;           // set new value
            posImg.left = this.previewSize.width / 2 - pos.left;     // translate origin back to center point
            posImg.top = this.previewSize.height / 2 - pos.top;
            this.img.css(posImg);       // set new position

            this._setImgSize();
            this._report();
        },

        _centerImage: function ()    {
            this.img.css({
                left: (this.previewSize.width - this.imgSize.width) / 2,
                top: (this.previewSize.height - this.imgSize.height) / 2
            });
        },

        _report: function () {
            if (this.crop)  {
                var pos = this.img.position(),
                    m = this.options.margin,
                    f = 1 / (this.scale * this.zoom);

                this._trigger("change", null, {     // trigger change event
                    aspect: this.options.aspectRatio,
                    x: f * (m - pos.left),          // coordinates in native pixels
                    y: f * (m - pos.top),
                    w: f * (this.previewSize.width - 2 * m),
                    h: f * (this.previewSize.height - 2 * m)
                });
            }
        },

        _reportNull: function () {
            this._trigger("change", null, {     // trigger change event
                aspect: this.options.aspectRatio,
                x: 0,          // all coordinates zero, indicating no crop
                y: 0,
                w: 0,
                h: 0
            });
        }

    });
} (jQuery));

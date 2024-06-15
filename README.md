# Cropper 2.1 #




**Cropper 2.1** is a widget to add cropping by zoom, pan, and rotation 
to any application. The cropping area is set by dragging the image 
'under' the widget. Zooming and rotating can be adjusted by sliders.
**Cropper 2.1** should work in any modern browser. Double-clicking the image
will center it. Double-clicking the sliders resets them.

**Cropper 2.1** is different from version 1.0. While the first version was
dependent on jQuery, **Cropper 2.1** is not. Also, the API has changed
considerably. You can now drag-and-drop image files onto the widget.

Compared to **Cropper 2.0**, **Cropper 2.1** adds rotation of the image.

You can see **Cropper 2.1** in action [here](http://www.sjaakpriester.nl/software/cropper).

Here is **Cropper 2.1**'s  [GitHub page](https://github.com/sjaakp/cropper).

## Install ##

Install **Cropper 2.1** with [npm](https://www.npmjs.com//):

	npm i @sjaakp/cropper

You can also manually install **Cropper 2.1** by
[downloading the source in ZIP-format](https://github.com/sjaakp/cropper/archive/master.zip).

## Dependencies ##

**Cropper 2.1** has no dependencies.

## Usage ##

#### Load resources ####

At the end of the `body` part of the HTML-page,
load the **Cropper 2.1** code from the `dist` directory of this depository:

    <script src="dist/cropper.js"></script>
    
#### Load from CDN ####

You may also load the **Cropper 2.1** file from a content distribution
network (CDN), like so:

    <script src="https://unpkg.com/@sjaakp/cropper/dist/cropper.js"></script>

 
#### Set-up ####

**Cropper 2.1** creates itself around an HTML `<input>` of the `file`-type,
most probably inside an HTML `<form>`. The `<input>` should have a `name`,
as is common for `<form>` elements, and, optionally, an `id`.
It would be wise to also set `accept="image/*"`.

The HTML could look something like:

    <html>
        <head> ... </head>
        <body>
            ... other stuff ...
            <form>
                ... other form elements ...
                <input type="file" id="crop1" name="image" accept="image/*">
                ... more form elements ...
                <button type="submit">Submit</button>
            </form>
            ... more stuff ...
            <script src="dist/cropper.js"></script>
        </body>
    </html>

Initializing **Cropper 2.1** is as simple as:

    <script>
        cropper();
    </script>

The function `cropper()` returns an `array` of **Cropper 2.1** instances on the page.
In almost all cases this will be just one **Cropper 2.1**, 
but you can have more.

If you want to access a single **Cropper 2.1** instance you could 
store it like this:

    <script>
        window.myCropper = cropper()[0];
    </script>

You can also access a **Cropper 2.1** through the `cropper` property
of the file `<input>`.

## Loading an image ##

After set-up, an image can be loaded in **Cropper 2.1** in four ways.
Firstly, it can be drag-and-dropped directly. Secondly, you can select
an image after pressing the 'Choose Ímage'-button.

Programmatically, it can be loaded like so:

    myCropper.loadImage(src);

Or, through the associated file `<input>`:

    document.getElementById("crop1").cropper.loadImage(src);

Where `src` can be anything that can be `src` of an HTML `img`. 
So, to load a picture of Newton, the code might be:

    myCropper.loadImage("img/Newton.jpg");

If `src` is `false` **Cropper 2.1** will be emptied. The 'Empty Cropper'
button does the same.

## Getting crop information ##

**Cropper 2.1** creates an extra hidden `<input>`. This is permanently
updated with a JSON representation of the crop information. The hidden 
`<input>`'s name is derived from the name of the associated file `<input>`
by adding `"_data"` to it. A **Cropper 2.1** created around a file `<input>`
named `"image"` will have a hidden `<input>` named `"image_data"`. (If
the associated file `<input>` doesn't have a name, the hidden `<input>`
wille be named `"cropper_data"`.)

The value of the hidden `<input>` is a JSON-representation of the following
plain object:

    {
        aspect: ...		// the current aspect ratio
        angle: ...	        // the rotation in radians
        degrees: ...	// same in degrees
        x: ...		// left position of the cropped area
        y: ...		// top position of the cropped area
        w: ...		// width of the cropped area
        y: ...		// height of the cropped area
    }

Example value:

    "{aspect:0.75,angle:0.118736448006251,degrees:6.803097345132721,x:283.72518797781396,y:8.614753563516281,w:456.54962404437214,h:608.7328320591628}"

The crop dimensions are all in pixels. Positive angles are counter-clockwise.
All the members of `data` are floats
(with an almost ridiculous precision). Keep that in mind when processing them.

## Options ##

Options are set by setting `data-*` attribute(s) on the associated
`<input>` element, for instance:

    <input type="file" name="image" accept="image/*" data-aspect="portrait">

You can also set options with a plain object as the **second** parameter
of the initialization function. Leave out the `data-` part of the
option name. Example:

    <script>
        cropper({}, { aspect: 'portrait' });
    </script>

#### data-aspect ####

A value describing the dimensions of the cropped area, i.e. width / height 
ratio. A square cropped area will have `data-aspect="square"`,
while a portrait layout may have `data-aspect=".75"`. Default is 1.

The value can be a float between 0.2 and 5.0,
or one of the following strings:

 - **'tower'** equivalent to 0.429, 9:21
 - **'high'** equivalent to 0.563, 9:16
 - **'phi_portrait'** equivalent to 0.618, 1:φ, [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio)
 - **'din_portrait'** equivalent to 0.707, 1:√2, [DIN/ISO 216 paper sizes](https://en.wikipedia.org/wiki/ISO_216)
 - **'portrait'** equivalent to 0.75, 3:4
 - **'square'** equivalent to 1.0, 1:1
 - **'landscape'** equivalent to 1.333, 4:3
 - **'din_landscape'** equivalent to 1.414, √2:1
 - **'phi_landscape'** equivalent to 1.618, φ:1
 - **'wide'** equivalent to 1.718, 16:9
 - **'cinema'** equivalent to 2.333, 21:9

#### data-margin ####

The width of **Cropper 2.1**'s area margin, in pixels. Default is 40.

#### data-diagonal ####

The diagonal of the cropping area, in pixels. 
If `data-aspect` changes, both width and height of the cropping area
change, but the diagonal is constant. Default: 300.

#### data-maxRotation ####

The maximum rotation **Cropper 2.1** will allow in degrees. 
A float value between 0.0 and 90.0. If `data-maxRotation` is zero,
no rotation slider is rendered.
Default: 30.0.

#### data-maxZoom ####

The maximum zoom **Cropper 2.1** will allow. 
A float value between 2.0 and 10.0.
Default: 4.0.

## Event ##

#### cropperchange ####

Whenever something changes, **Cropper 2.1** fires the `cropperchange` event.
The `detail` property of the Event object contains crop information: 

    {
        aspect: ...		// the current aspect ratio
        angle: ...	        // the rotation in radians
        degrees: ...	// same in degrees
        x: ...		// left position of the cropped area
        y: ...		// top position of the cropped area
        w: ...		// width of the cropped area
        y: ...		// height of the cropped area
    }

## Internationalization ##

**Cropper 2.1** displays some text messages in English. These can be adapted by
providing a plain object with translated messages as the **first** parameter
of the initialization function. For instance, to translate the messages into
Dutch, initialize **Cropper 2.1** like this:

    <script>
        cropper({
            choose: "Kies een afbeelding...",
            empty: "Maak leeg",
            drop: "Sleep afbeelding hierheen",
            zoom: "Zoom",
            angle: "Hoek"
        }, { ...options... });
    </script>

## Appearance ##

Some aspects of **Cropper 2.1**'s appearance can be adapted by setting
CSS custom properties inside the ruleset for the class of **Cropper 2.1**'s
surrounding `<div>`: `.cropper-wrap` (or, of course, any DOM-element 
higher in the cascade).

The properties, together with their default value:

 - **--cropper-border-color**, default: `ButtonBorder` 
 - **--cropper-border-width**, default: `2px` 
 - **--cropper-border-radius**, default: `.4em` 
 - **--cropper-gap**, default: `.6em` 
 - **--cropper-drop**, default: `GrayText` 
 - **--cropper-drop-text**, default: `Canvas` 
 - **--cropper-gray**, default: `GrayText` 
 - **--cropper-button**, default: `ButtonText` 
 - **--cropper-range**, default: `SelectedItem` 

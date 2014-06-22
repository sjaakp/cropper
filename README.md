# Cropper #

**Cropper** is a jQuery widget to add cropping by zoom and pan to any application. The cropping area is set by dragging the image 'under' the widget, and zooming with a slider. **Cropper** should work in any modern browser.

## Dependencies ##

**Cropper** depends on jQuery and jQuery.ui.
It is tested with jQuery 2.1.1, and jQuery.ui 1.10.4.

Of the jQuery.ui library, only the slider widget is used. Therefore, only the following modules are required:

- slider
- core
- widget
- position
- mouse

## Usage ##

#### Load resources ####

In the `header` part of the HTML-page, link to the style sheets (`.css`) of jQuery.ui and of **Cropper**, like:

    <link href="http://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css" rel="stylesheet">
    <link href="css/jquery.cropper.min.css" rel="stylesheet">

At the end of the `body` part, load the jQuery and jQuery.ui libraries:
 
    <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="http://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>

And load the **Cropper** code:

    <script src="js/jquery.cropper.js"></script>
 
#### Set-up ####

**Cropper** is loaded like most other jQuery.ui widgets. The code might look something like:

    <script>
        $(document).ready(function () {
            $("#cropper").cropper({
                ... cropper options ...
            });
        });
    </script>

One ore more (or zero) options may be set, like:

    <script>
        $(document).ready(function () {
            $("#cropper").cropper({
                aspectRatio: .75,
                sliderPosition: "left"
            });
        });
    </script>

## Loading an image ##

After set-up, an image can be loaded in **Cropper** as follows:

    $("#cropper").cropper({"loadImage", src});

Where `src` can be anything that can be `src` of an HTML `img`. So, to load a picture of Newton, the code might be:

    $("#cropper").cropper({"loadImage", "img/Newton.jpg"});

`src` can be an image url, but also a Web `File` or a `FileList`, like those from a HTML file input. Take a look at the source code of `demo.html` for an example.

If `src` is `false` **Cropper** will be emptied.

## Options ##

Options can be set at set-up time (see above) or at run time. The technique is the same as with most other jQuery.ui widgets. So, to set `aspectRatio` to 1.33 after **Cropper** has been initialized, use something like:

    $("#cropper").cropper({"option", "aspectRatio", 1.33});

To read an option:

    var asp = $("#cropper").cropper({"option", "aspectRatio"});

The options have immediate effect after they have been set, so changes are in real time.

#### aspectRatio ####

A float describing the dimensions of the cropped area, i.e. width / height. A square cropped area will have `aspectRatio: 1`, while a portrait layout may have `aspectRatio: .75`, and a landscape layout `aspectRatio: 1.5`. Default is 1.

#### margin ####

The width of **Cropper**'s area margin, in pixels. Default is 40.

#### diagonal ####

The diagonal of the cropping area, in pixels. If `aspectRatio` changes, both width and height of the cropping area change, but the diagonal is constant. Default: 300.

#### minSize ####

The minimal size of the cropped area in pixels. The size is the length of the greatest side, so for a portrait layout it will be the height. If an image is too small, it will not be cropped. `minSize` also determines the maximum zoom factor of the image. Default: 240.

#### sliderPosition ####

Position of the slider with respect to the preview area. Possible values: `"top"`, `"bottom"`, `"left"`, `"right"`. Default is `"bottom"`.

#### change ####

The handler of the `change` event. See below.

## Events ##

#### change ####

Whenever something changes, **Cropper** fires the `change` event. This can be used to update other elements on the page, f.i. hidden inputs. 

The event handler has to be a  function or a closure with the signature `function(evt, data)`, where `evt` is the usual Javascript event object. `data` is an object containing the following **Cropper** information:

    {
        aspect: ...		// the current aspect ratio
		x: ...			// left position of the crop area
		y: ...			// top position of the crop area
		w: ...			// width of the crop area
		y: ...			// height of the crop area
    }

The crop dimensions are all in pixels. All the members of `data` are floats (with an almost ridiculous precision), including the pixel values. Keep that in mind when processing them.

`demo.html` contains an example how the `change` event may be utilised. In this case, the handler function is set as the `change` option at set-up time.

## Acknowledgements ##

I drew inspiration from [Rabona's Image Crop](http://codecanyon.net/item/image-crop/full_screen_preview/5348464) for the look and feel.  However, **Cropper** was coded from scratch.
 
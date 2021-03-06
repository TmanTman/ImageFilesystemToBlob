# README

This Ionic application demonstrates how to get load an in-memory blob from a filepath, **Android-only**.

In this example, a filepath is generated by selecting an image from the gallery or taking a picture. Once the filepath is known,
the filepath is converted into a blob.

I re-use the ngCordova readAsArrayBuffer method. You are welcome to use it directly from ngCordova (http://ngcordova.com/docs/plugins/file/). I had to use it like this as I have specific restrictions on how to build my final project.

This was required in my case as I needed to included the Blob data in a custom file format that I am writing.

To get the project up and running:

* Clone: $ git clone https://github.com/TmanTman/ImageFilesystemToBlob.git
* Install dependencies: $ bower install
* Add the android platform: $ ionic platform add android
* File Plugin: $ cordova plugin add cordova-plugin-file
* Image Picker plugin: $ cordova plugin add https://github.com/wymsee/cordova-imagePicker.git
* Install the camera plugin: $ cordova plugin add https://github.com/TmanTman/cordova-plugin-wezka-nativecamera

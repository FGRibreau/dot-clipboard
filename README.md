.clipboard (dot-clipboard)
==========================

# What is it?

*dot-clipboard* monitor your clipboard and runs user-defined scripts based on the clipboard content.

### I am not a child, what is it?

*dot-clipboard* is a nodejs daemon that runs javascript scripts located in `~/.clipboard` each time the clipboard content change.

### Ok... but why?

Believe it or not **we use the clipboard the same way since the 70s**. Yes, we've copy/pasted stuff the same way for 40 years! Well, until now. 

<p align="center">
<img src="https://dl.dropboxusercontent.com/u/3892/gif/noob.gif"/>
</p>

*dot-clipboard* brings the power of automation to a whole new level. Now each time you **copy** something you will be able to automatically trigger anything, depending on your workflow.

### Yeah... but why?

- You share a lot of gif though github, hipchat or skype ? Automatically backup them to your own public gif folder in dropbox when doing so. See [examples/download-gif.js](/examples/download-gif.js).
- Automatically *backup* a youtube/dailymotion video inside a folder just by copying the link.
- Minify links from clipboard on the fly. Change the clipboard content with a minified link\*
- Automatically convert Spotify/Deezer/Grooveshark links to Youtube equivalent\*

<p align="center">
<img src="https://dl.dropboxusercontent.com/u/3892/gif/knailed-it/ironman-stark-awesome-epic-giphy%20%281%29.gif"/>
</p>

### Wow that's awesome! What more does it do?

- automatically load scripts located inside `~/.clipboard`
- automatically reload scripts when changed/renamed
- customizable concurrency per script
- fully-asynchronous scripts : each *clipboard change* events are duplicated for each script, queued, and then consumed asynchronously

## How do I install it?

```
npm install dot-clipboard -g
```

## How do I write my first script?

- Start `dot-clipboard`
- Open `~/.clipboard`, and save the following `myScript.js`:

```javascript
module.exports = {
  /**
   * Method called each time the clipboard content changes
   * @param  {String} data clipboard content
   * @param  {Function} f(err)
   */
  run: function(data, f){
    console.log('My first script got new clipboard data : ', data);
    f();// we're done
  }
};
```

- Dot-clipboard should trigger a desktop notification saying that it loaded the module
- Try to copy something, you should see a new line inside the console, for instance:

```
My first script got new clipboard data : test
```

- You can now edit/rename `myScript.js` and it will be automatically removed/reloaded inside `dot-clipboard`.

## I don't like `~/.clipboard`, how can I change it?

The scripts localization is customizable with the `DOT_CLIPBOARD_DIR` environment variable.

## I want to help!

Great! Here are some of the most asked features:

- Expose a clipboard write api to scripts. \* this feature is required.
- Multi-platform support (**currently only *OSX* is supported**)

-------------------------

### Please please, show me the boring license stuff!

Copyright (c) 2014, Francois-Guillaume Ribreau node@fgribreau.com.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

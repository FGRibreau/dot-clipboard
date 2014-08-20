.clipboard (dot-clipboard)
==========================

# What is it?

*dot-clipboard* - a daemon that runs scripts from `~/.dot-clipboard` each time the clipboard content change.

# Sorry... what?

*dot-clipboard* monitor your clipboard and runs user-defined scripts depending on the clipboard content.

# Ok... but why?

Believe it or not **we use the clipboard the same way since the 70s**. Yes, we've copy/pasted stuff the same way for 40 years! Well, until now. 

*dot-clipboard* brings the power of automation to a whole new level. Now each time you **copy** something you will be able to automatically trigger anything, depending on your workflow.

# Ok... but why?

- You share a lot of gif though github, hipchat or skype ? Automatically backup them to your own public gif folder in dropbox when doing so. See [examples/download-gif.js](/examples/download-gif.js).
- Automatically *backup* a youtube/dailymotion video inside a folder just by copying the link.
- Minify links from clipboard on the fly. Change the clipboard content with a minified link\*
- Automatically convert Spotify/Deezer/Grooveshark links to Youtube equivalent\*

# Wow that's awesome! What more does it do?

- automatically load scripts located inside `~/.dot-clipboard`
- automatically reload scripts when changed/renamed
- customizable concurrency per script
- fully-asynchronous scripts : each *clipboard change* events are duplicated for each script, queued, and then consumed asynchronously

# I don't like `~/.dot-clipboard`, how can I change it?

The scripts localization is customizable with the `DOT_CLIPBOARD_DIR` environment variable.

# I want to help!

Great! Here are some of the most asked features:

- Expose a clipboard write api to scripts. \* this feature is required.
- Multi-platform support (**currently only *OSX* is supported**)

# Please please, show me the boring license stuff! *no one*

Copyright (c) 2014, Francois-Guillaume Ribreau node@fgribreau.com.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

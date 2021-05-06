# Mastodon Archive Viewer (based on the modified version by slshyn 11/09/2020)
An offline web page to view a mastodon archive. It gives a powerful data table to tell you what the composition of all your toots is. There is also a line graph telling you the tooting trend. You can select a period of time to view.

The branch "exhibition" is for my season's toots exhibition.

# Features (and changelog):
## original
* organizes your old posts into a conveniently readable timeline
* includes media attachments in posts
* Preserves content warnings/summaries
* Tries to use the header from the archive as the background
* Tries to use the avatar from the archive as the avatar next to your old posts
## modified by slshyn 11/07/2020 
* fixed a few link problems
* prettier interface, more similar to mastodon dark theme
* more details from the toots and user profile added
## modified by slshyn 11/08/2020 
* separate page on only toots & media
* archive column on months and year, stick on the screen when scroll down
* back to top button when scroll down
## modified by slshyn 11/09/2020 
* added click to open image
* fixed a few visual problems
* added scroll on archive column
* added open link on a new tab when click
## fixed by slshyn 11/10/2020 
* fixed picture display problem
* modified .sticky column
## modified by Zero 03/24/2021
* seperated the css and js file from html
* delete the original python method
## modified by Zero 04/19/2021
* added a date selector, then one can choose a specific period of time to view
## modified by Zero 04/20/2021
* fixed the wrong number of "Toots and replies"
* added a statistical table to show the numbers of all kinds of toots
## modified by Zero 04/22/2021
* added a favicon.ico
## modified by Zero 04/23/2021
* added more information to the table
* finished the function of date selector! Hooray!
## modified by Zero 04/29/2021
* self-reply is no longer counted as a reply, so they would show in "Toots" column
## modified by Zero 04/30/2021
* ask users to load actor.json first
## modified by Zero 05/02/2021
* finish the line graph function, thanks to [chart.js](https://www.chartjs.org/)
* adjusted some color and background-color in the table, one can choose whether show their direct messages' count or not
## modified by Zero 05/06/2021
* i18n supported. Can be viewed in Chinese or English now. A shoutout to [this code](https://codesandbox.io/s/ipfeu)

# Usage
* Place all the files of this repo in the root of the archive (the folder that has `outbox.json` and `media_attachments/` in it).
* Open `archive_page.html` in your web browser. Open the `actor.json` and `outbox.json` file from within the page and it will load it.

## Linux
* `git clone https://github.com/zero-mstd/mav-z.git`
* `mkdir mastodon_archive`
* `cp /the/path/of/your/archive-xxx.tar.gz mastodon_archive/`
* `cp -r mav-z/* mastodon_archive/`
* `cd mastodon_archive`
* `tar -zxvf archive-xxx.tar.gz`
* `firefox archive_page.html`

## Windows
* Open this link <https://github.com/zero-mstd/mav-z/tree/master> in a browser
* Hit the green button `Code`
* Choose `Download ZIP`
* Unzip what you download
* Unzip your archived file (named as `archive-xxx.tar.gz`) downloaded from your mastodon instance
* Copy and paste your files, so that your directory tree is like:
```
mastodon_archive_or_whatever_you_like
├── actor.json
├── archive_page.html
├── assets
│   ├── avatar_default.png
│   ├── avatar.png
│   ├── chart.js
│   ├── favicon.ico
│   ├── header_default.jpg
│   ├── header.jpg
│   ├── main.js
│   ├── style.css
│   └── translator.js
├── bookmarks.json
├── likes.json
├── media_attachments
│   └── files
│       ├── ……
│       ├── ……
│       └── ……
└── outbox.json
```
* Open the `archive_page.html` in your browser

# Next steps:

- [x] separate page on only toots & media
	- [x] make medias easier to view
	- [x] click to open pictures (why `addEventListener click` didn't work...)
- [ ] prettier interface
- [x] select a period of toots
- [x]  (branch: exhibition) assistant for my season's exhibition
- [ ] open the .tar.gz directly
- [x] the display of vedio problem, width out of box
- [ ] add reverse mode to view all toots
- [ ] total(with_reply_ct) + boost_ct - direct_ct != display_ct, why?
- [x] i18n support. use pure js, with data attributes. see [this link](https://codeburst.io/translating-your-website-in-pure-javascript-98b9fa4ce427)
- [ ] more information? for example, the one you liked the most, the one you boost the most…
- [x] add a line graph, maybe?

Open to suggestions. Chinese and English ok.

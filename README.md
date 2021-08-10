# Mastodon Archive Viewer - Zero's fork

An offline web page to view a [Mastodon](https://joinmastodon.org) archive. It gives a powerful data table to tell you what the composition of all your toots is. There is also a line graph telling you the tooting trend. You can select a period of time to view.

![Screenshot](https://cdn.jsdelivr.net/gh/zero-mstd/figure-bed@master/mav-z_screenshot.png "Screenshot of this tool")

The branch "exhibition" is for my season's toots exhibition.

# Features (and changelog):

* (original, Dizzy) organizes your old posts into a conveniently readable timeline
* (original, Dizzy) includes media attachments in posts
* (original, Dizzy) Preserves content warnings/summaries
* (original, Dizzy) Tries to use the header from the archive as the background
* (original, Dizzy) Tries to use the avatar from the archive as the avatar next to your old posts
* (11/07/2020, Slashyn) fixed a few link problems
* (11/07/2020, Slashyn) prettier interface, more similar to mastodon dark theme
* (11/07/2020, Slashyn) more details from the toots and user profile added
* (11/08/2020, Slashyn) separate page on only toots & media
* (11/08/2020, Slashyn) archive column on months and year, stick on the screen when scroll down
* (11/08/2020, Slashyn) back to top button when scroll down
* (11/09/2020, Slashyn) added click to open image
* (11/09/2020, Slashyn) fixed a few visual problems
* (11/09/2020, Slashyn) added scroll on archive column
* (11/09/2020, Slashyn) added open link on a new tab when click
* (11/10/2020, Slashyn) fixed picture display problem
* (11/10/2020, Slashyn) modified .sticky column
* (03/24/2021, Zero) seperated the css and js file from html
* (03/24/2021, Zero) delete the original python method
* (04/19/2021, Zero) added a date selector, then one can choose a specific period of time to view
* (04/20/2021, Zero) fixed the wrong number of "Toots and replies"
* (04/20/2021, Zero) added a statistical table to show the numbers of all kinds of toots
* (04/22/2021, Zero) added a favicon.ico
* (04/23/2021, Zero) added more information to the table
* (04/23/2021, Zero) finished the function of date selector! Hooray!
* (04/29/2021, Zero) self-reply is no longer counted as a reply, so they would show in "Toots" column
* (04/30/2021, Zero) ask users to load actor.json first
* (05/02/2021, Zero) finish the line graph function, thanks to [chart.js](https://www.chartjs.org/)
* (05/02/2021, Zero) adjusted some color and background-color in the table, one can choose whether show their direct messages' count or not
* (05/06/2021, Zero) i18n supported. Can be viewed in Chinese or English now. A shoutout to [this code](https://codesandbox.io/s/ipfeu)
* (08/10/2021, Zero) use 🔑 to mark unlisted toot, because 🔓 (unlisted) is not often easy to distinguish from 🔒 (followers-only)
* (08/10/2021, Zero) fix the problem that `captionText` is not defined: `var captionText = document.getElementById("caption");`
* (08/10/2021, Zero) no need to unzip `archive-xxx.tar.gz` file anymore, just select directly the archive file in browser, then everything should be fine. This feature benefits from [pako](https://github.com/nodeca/pako) and [js-untar](https://github.com/InvokIT/js-untar), which are greatly appreciated. (and this [code](https://stackoverflow.com/a/65448758) provides an out-of-the-box idea)
* (08/10/2021, Zero) add the time zone feature, use your system time zone by default, and can be customized.

# Usage

Simply put, just request and download your Mastodon archive, save this repo, open the archive file in `archive_page.html` in your browser, there you go.

## Linux

First go to your Mastodon instance, request an archive of your toots and uploaded media (Settings - Import and export - Data export), and download your archive.

Then:
```bash
$ git clone https://github.com/zero-mstd/mav-z.git
$ cd mav-z
$ firefox archive_page.html
```

## Windows
1. First go to your Mastodon instance, request an archive of your toots and uploaded media (Settings - Import and export - Data export), and download your archive;
2. Open this link <https://github.com/zero-mstd/mav-z/tree/master> in a browser;
3. Hit the green button `Code`;
4. Choose `Download ZIP`;
5. Unzip what you downloaded (should be `mav-z-master.zip`) and enter this folder;
6. Open the `archive_page.html` in your browser;
7. Follow the instructions, choose and open the entire `.tar.gz` archive file you got from the 1st step.

# Next steps:

- [x] separate page on only toots & media
	- [x] make medias easier to view
	- [x] click to open pictures (why `addEventListener click` didn't work...)
- [ ] prettier interface
- [x] select a period of toots
- [x]  (branch: exhibition) assistant for my season's exhibition
- [x] open the .tar.gz directly
- [x] the display of vedio problem, width out of box
- [ ] add reverse mode to view all toots
- [ ] total(with_reply_ct) + boost_ct - direct_ct != display_ct, why?
- [x] i18n support. use pure js, with data attributes. see [this link](https://codeburst.io/translating-your-website-in-pure-javascript-98b9fa4ce427)
- [ ] more information? for example, the one you liked the most, the one you boost the most…
- [x] add a line graph, maybe?
- [x] time zone problem

# Similar Projects:
- [kit-ty-kate, mastodon-archive-viewer](https://github.com/kit-ty-kate/mastodon-archive-viewer), written in [OCaml](https://ocaml.org/), need [OPAM](https://opam.ocaml.org/) installed.
- [nuklearfiziks, mastodon-archive-tool](https://observablehq.com/@nuklearfiziks/mastodon-archive-tool). It runs in a browser and does not need to download anything.
- [Yuzuki Aida, Mastodon-Archive-Viewer](https://github.com/nzws/Mastodon-Archive-Viewer). Quite clean but not completely offline. Need to choose `actor.json` and `outbox.json` respectively, no support to media (images or vedios).
- [Poga, ActivityPub to CSV](https://poga.github.io/activitypub2csv/). Turn `outbox.json` file into `.csv` file then can be viewed in excel or other softwares.

---

Open to suggestions. Chinese and English ok.

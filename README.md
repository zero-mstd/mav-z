# Mastodon Archive Viewer - Zero's fork

An offline web page to view a [Mastodon](https://joinmastodon.org) archive. It gives a powerful data table to tell you what the composition of all your toots is. There is also a line graph telling you the tooting trend. You can select a period of time to view.

![Screenshot](https://cdn.jsdelivr.net/gh/zero-mstd/figure-bed@master/mav-z_screenshot_2.png "Screenshot of this tool")

## The exhibition branch

The branch “exhibition” is a tool for [my season's toots exhibition](https://zero-mstd.netlify.app/exhibition/). This part is not completely i18n yet because I believe that not many people have the same needs. But anyway, here is my process when I using it, in case someone need it:

1. Just like the “master” branch, I open this tool and choose my archieve;
2. According to the date range of the “exhibition's season”, I set the date range of toots;
3. I read my toots one by one, and decide whether to give it a chance to be exhibited;
4. For those I want to exhibit, I hit the drop-down menu, and select a proper section for it;
5. If there currently does not have a proper section, I hit the “add a section (添加分区)”, and set its name (“请输入标题”) and description (“请输入一小段描述”) in the pop-up window;
6. If I regret exhibiting one toot, I choose the “-” to delete;
7. Followers-only and Direct toots are not able to be selected;
8. When I finish all the work, I go back to the top of the page, and hit “Generate File”;
9. Now this tool will automatically generate a markdown file for me and I just need to “Download” it;
10. I can edit the markdown file if I like, and then publish it.

## Features (and changelog):
* original, Dizzy
    * organizes your old posts into a conveniently readable timeline
    * includes media attachments in posts
    * Preserves content warnings/summaries
    * Tries to use the header from the archive as the background
    * Tries to use the avatar from the archive as the avatar next to your old posts
* 11/07/2020, Slashyn
    * fixed a few link problems
    * prettier interface, more similar to mastodon dark theme
    * more details from the toots and user profile added
* 11/08/2020, Slashyn
    * separate page on only toots & media
    * archive column on months and year, stick on the screen when scroll down
    * back to top button when scroll down
* 11/09/2020, Slashyn
    * added click to open image
    * fixed a few visual problems
    * added scroll on archive column
    * added open link on a new tab when click
* 11/10/2020, Slashyn
    * fixed picture display problem
    * modified .sticky column
* 03/24/2021, Zero
    * seperated the css and js file from html
    * delete the original python method
* 04/19/2021, Zero
    * added a date selector, then one can choose a specific period of time to view
* 04/20/2021, Zero
    * fixed the wrong number of "Toots and replies"
    * added a statistical table to show the numbers of all kinds of toots
* 04/22/2021, Zero
    * added a favicon.ico
* 04/23/2021, Zero
    * added more information to the table
    * finished the function of date selector! Hooray!
* 04/29/2021, Zero
    * self-reply is no longer counted as a reply, so they would show in "Toots" column
* 04/30/2021, Zero
    * * (branch: exhibition) finish the season's exhibition selector function
    * ask users to load actor.json first
* 05/02/2021, Zero
    * finish the line graph function, thanks to [chart.js](https://www.chartjs.org/)
    * adjusted some color and background-color in the table, one can choose whether show their direct messages' count or not
* 05/06/2021, Zero
    * i18n supported. Can be viewed in Chinese or English now. A shoutout to [this code](https://codesandbox.io/s/ipfeu)
* 08/10/2021, Zero
    * use 🔑 to mark unlisted toot, because 🔓 (unlisted) is not often easy to distinguish from 🔒 (followers-only)
    * fix the problem that `captionText` is not defined: `var captionText = document.getElementById("caption");`
    * no need to unzip `archive-xxx.tar.gz` file anymore, just select directly the archive file in browser, then everything should be fine. This feature benefits from [pako](https://github.com/nodeca/pako) and [js-untar](https://github.com/InvokIT/js-untar), which are greatly appreciated. (and this [code](https://stackoverflow.com/a/65448758) provides an out-of-the-box idea)
    * add the time zone feature, use your system time zone by default, and can be customized.
* 08/11/2021, Zero
    * tell you the fedi sites whose users you usually interacted with. At first I want to show the users you most interacted with, but the toots of [pleroma](https://pleroma.social) users in `likes.json` and `bookmarks.json` don't have a link formated as `https://<mastodon.example.com>/users/<username>/statuses/<status_id>`, they are like `https://<pleroma.example.com>/objects/<object-id>`. It is not fair to exclude them.

## Usage
Simply put, just request your Mastodon archive and download it, save this repo, open the `archive_page.html` web page in your browser and choose your archieve, there you go.

### Linux
First go to your Mastodon instance, request an archive of your toots and uploaded media (Settings - Import and export - Data export), and download your archive. Then:
```bash
$ git clone https://github.com/zero-mstd/mav-z.git
$ cd mav-z
$ firefox archive_page.html
```

### Windows
1. First go to your Mastodon instance, request an archive of your toots and uploaded media (Settings - Import and export - Data export), and download your archive;
2. Open this link <https://github.com/zero-mstd/mav-z/tree/master> in a browser;
3. Hit the green button `Code`;
4. Choose `Download ZIP`;
5. Unzip what you downloaded (should be `mav-z-master.zip`) and enter this folder;
6. Open the `archive_page.html` in your browser;
7. Follow the instructions, choose and open the entire `.tar.gz` archive file you got from the 1st step.

## Next steps:
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
- [x] more information? for example, the one you liked the most, the one you boost the most…
- [x] add a line graph, maybe?
- [x] time zone problem

## Similar Projects:
- [kit-ty-kate, mastodon-archive-viewer](https://github.com/kit-ty-kate/mastodon-archive-viewer), written in [OCaml](https://ocaml.org/), need [OPAM](https://opam.ocaml.org/) installed.
- [nuklearfiziks, mastodon-archive-tool](https://observablehq.com/@nuklearfiziks/mastodon-archive-tool). It runs in a browser and does not need to download anything.
- [Yuzuki Aida, Mastodon-Archive-Viewer](https://github.com/nzws/Mastodon-Archive-Viewer). Quite clean but not completely offline. Need to choose `actor.json` and `outbox.json` respectively, no support to media (images or vedios).
- [Poga, ActivityPub to CSV](https://poga.github.io/activitypub2csv/). Turn `outbox.json` file into `.csv` file then can be viewed in excel or other softwares.

---

Open to suggestions. Chinese and English ok.

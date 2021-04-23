# Mastodon Archive Viewer (based on the modified version by slshyn 11/09/2020)
A html script to take a mastodon archive and convert it into a human-readable webpage for viewing.

# Features:
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
* added more informatiion to the table
* finish the function of date selector! Hooray!

# Usage
* Clone the whole repo by using `git clone https://github.com/zero-mstd/mav-z.git`. Place all of them in the root of the archive (the folder that has `outbox.json` and `media_attachments/` in it).
* Open `archive_page.html` in your web browser. Open the `actor.json` and `outbox.json` file from within the page and it will load it.


# Next steps:

- [x] separate page on only toots & media
	- [x] make medias easier to view
	- [x] click to open pictures (why `addEventListener click` didn't work...)
- [ ] prettier interface
- [ ] select a period of toots
- [ ] assistant for my season's exhibition
- [ ] open the .tar.gz directly
- [ ] the display of vedio problem, width out of box
- [ ] add reverse mode to view all toots
- [ ] timezone problem, all the time need to be +8 hrs fixed
- [ ] total(with_reply_ct) + boost_ct - direct_ct != display_ct, why?

Open to suggestions. Chinese and English ok.

'use strict'
// i'm both shocked that this works and shocked that the other things i tried didn't
// same my friend
var actor = null;
var outbox = null;

//scroll bar
//Get the button:
var mybutton = document.getElementById("scroll_top_button");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }

    stop = archive.offsetTop - 20
    if (stop >= 0) {
        stop_val = stop
    }

    // if user scrolls to 20px from the top of the archive
    if (document.body.scrollTop > stop_val || document.documentElement.scrollTop >
        stop_val) {
        // stick the div
        archive.classList.add("sticky");
    } else {
        // release the div
        archive.classList.remove("sticky");
    }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// stick archive
var archive = document.getElementById("archive__section"),

    stop = archive.offsetTop - 20,
    stop_val = stop;



//load actor
document.getElementById("actor-file-input")
    .addEventListener("change", function(event) {
        var file = event.target.files[0],
            reader = new FileReader();
        reader.addEventListener("load", function() {
            actor = JSON.parse(this.result);

            var accounturl = actor.url,
                url_sp = accounturl.split("/"),
                id = url_sp[3] + '@' + url_sp[2];

            var avatar_img, header_img = ''
            try {
                avatar_img = actor.icon["url"];
            } catch {
                console.log("no profile avatar");
            }
            try {
                header_img = actor.image["url"]
            } catch {
                console.log("no profile header image");
            }

            var header_fields = '';
            actor.attachment.forEach((item) => {
                header_fields += '<dl><dt>' + item.name +
                    '</dt><dd><span>' + item.value +
                    '</span></dd></dl>'
            });
            document.getElementById("account__header__fields")
                .innerHTML = header_fields;
            document.getElementById("public-account-header__image")
                .innerHTML = '<img class="parallax" src="' +
                header_img +
                '" style="transform: translate3d(0px, 0px, 0px);">';
            document.getElementById("account__header__tabs__name")
                .innerHTML = '<h1><span>' + actor.name +
                '</span><small>' + id + '</small></h1>'
            document.getElementById("public-account-header__bar")
                .innerHTML = '<a class="avatar" href="' +
                accounturl + '"><img src="' + avatar_img + '"></a>';
            document.getElementById("account__header__content")
                .innerHTML = actor.summary;
        });
        reader.readAsText(file);
    });
document.getElementById("outbox-file-input")
    .addEventListener("change", function(event) {
        var file = event.target.files[0],
            reader = new FileReader();
        reader.addEventListener("load", function() {
            outbox = JSON.parse(this.result);
            buildArchiveView(outbox, actor);
        });
        reader.readAsText(file);
    });

function buildArchiveView(outbox, actor) {
    var articleTemplate = document.getElementById("article"),
        articleCWTemplate = document.getElementById("article--CW"),
        videoTemplate = document.getElementById("media-video"),
        imageTemplate = document.getElementById("media-image");

    var statuses = outbox.orderedItems.map(item => item.object)
        .filter(object => typeof(object) === typeof({}));

    var nonreply_ct = 0,
        mediatoot_ct = 0;
    var month_cur = '',
        month_list = [],
        month_ct = []

    statuses.forEach((status) => {
        // check visibility

        var visibility = '',
            activitystreams = outbox["@context"] + '#Public';

        if (typeof outbox["@context"] != "string") {
            activitystreams = outbox["@context"][0] + '#Public';
        }
        try {
            if (status.to.includes(actor.followers)) {
                if (status.cc.includes(activitystreams)) {
                    visibility = '📜';
                } else {
                    visibility = '🔒';
                }
            } else if (status.to.includes(activitystreams)) {
                visibility = '🌍';
            } else {
                visibility = '✉️';
            }
        } catch {
            console.log('grabing visibility failed');
            visibility = '';
        }

        var attachmentUrls = status.attachment.map(media => media.url);
        var attachmentNames = status.attachment.map(media => media.name);
        if (status.summary) {
            var article = document.importNode(articleCWTemplate.content,
                true);
            article.querySelector(".status__summary")
                .insertAdjacentText("afterbegin", status.summary);
        } else {
            var article = document.importNode(articleTemplate.content,
                true);
        }
        if (visibility == '✉️') {
            article.querySelector(".status__box")
                .classList.add("direct");
        }
        if (status.inReplyTo != null) {
            article.querySelector(".status__box")
                .classList.add("reply");
        } else {
            nonreply_ct += 1
        }

        var publish_date = status.published;
        var publish_month = publish_date.slice(0, 7);

        var date_html = '<a class="date" href="' + status.url +
            '"  target="_blank">' + visibility + ' ' + publish_date.slice(
                0, 10) + ' ' + publish_date.slice(11, 19) + '</a>';
        if ((month_cur != publish_month)) {
            date_html = '<a class="date" id="' + publish_month +
                '" href="' + status.url + '"  target="_blank">' +
                visibility + ' ' + publish_date.slice(0, 10) + ' ' +
                publish_date.slice(11, 19) + '</a>'
            month_cur = publish_month;

            month_list.push(month_cur);
            month_ct.push(1);
        } else {
            month_ct[month_list.length - 1] += 1
        }

        article.querySelector(".status__date")
            .insertAdjacentHTML("afterbegin", date_html);
        article.querySelector(".status__content")
            .insertAdjacentHTML("afterbegin", status.content);
        if (attachmentUrls.length > 0) {

            var mediaDiv = article.querySelector(".status__media");

            for (var i = 0; i < attachmentUrls.length; i++) {

                var url = attachmentUrls[i]
                var caption = attachmentNames[i]
                // attachmentUrls.forEach((url) => {
                mediatoot_ct += 1
                var extension = url.split(".")
                    .pop();
                if (extension === "mp4") {
                    var media = document.importNode(videoTemplate.content,
                        true);
                } else {
                    var media = document.importNode(imageTemplate.content,
                        true);
                }

                var src_img = "media_attachments/" + url.split(
                        "/media_attachments/")
                    .pop();
                media.querySelector(".status__media")
                    .src = src_img
                media.querySelector(".status__media")
                    .onclick = function(src_img) { // insert image inside the modal - use name as a caption
                        var modal = document.getElementById("myModal");
                        var modalImg = document.getElementById("img01");
                        modal.style.display = "block";
                        modalImg.src = src_img.target.src;
                        if (caption) {
                            captionText.innerHTML = caption;
                        }
                    }
                mediaDiv.appendChild(media);
                // });
            }
        } else {
            article.querySelector(".status__box")
                .classList.add("nonmedia");
            article.querySelector(".status__media")
                .remove();
        }
        document.getElementById("articles")
            .appendChild(article);

    });
    document.getElementById("account__section-headline")
        .innerHTML =
        '<a class="tootheadline" id="toots" onclick="clicktoots()"><span>嘟文（' +
        nonreply_ct.toString() +
        '）</span></a><a class="active tootheadline" id="tootsNreplies" onclick="clicktootsNreplies()"><span>嘟文和回复（' +
        outbox.totalItems.toString() +
        '）</span></a><a class="tootheadline" id="mediatoots" onclick="clicktootsmedia()"><span>媒体（' +
        mediatoot_ct.toString() + '）</span></a>'


    var month_section_html =
        '<dl class="account__section-headline" style="background: #1f232b;border-bottom: 1px solid #393f4f; margin:0"><dd style="padding:15px;color:#d9e1e8">索引</dd></dl>'

    var yr_last = ''
    var yr_cur = ''
    for (var i = 0; i < month_list.length; i++) {
        yr_cur = month_list[i].slice(0, 4)
        if (yr_cur != yr_last) {
            month_section_html +=
                '</details><details><summary class="archive year">' + yr_cur +
                '</summary>'
            yr_last = yr_cur
        }
        month_section_html += '<dl><dd><a href="#' + month_list[i] + '">' +
            month_list[i] + ' (' + month_ct[i] + ')</a></dd></dl>'

    }

    month_section_html += '</details>'
    document.getElementById("archive__section")
        .innerHTML = month_section_html

}

function clicktoots() {
    var sts = document.getElementsByClassName("status__box reply");
    for (var index = 0; index < sts.length; index++) {
        var status = sts[index]
        status.style.display = "none";
        document.getElementById("toots")
            .classList.add("active");
        document.getElementById("tootsNreplies")
            .classList.remove("active");
        document.getElementById("mediatoots")
            .classList.remove("active");
    }
}

function clicktootsNreplies() {
    var sts = document.getElementsByClassName("status__box");
    for (var index = 0; index < sts.length; index++) {
        var status = sts[index]
        status.style.display = "block";
        document.getElementById("toots")
            .classList.remove("active");
        document.getElementById("tootsNreplies")
            .classList.add("active");
        document.getElementById("mediatoots")
            .classList.remove("active");
    }
}

function clicktootsmedia() {
    var sts = document.getElementsByClassName("status__box nonmedia");
    for (var index = 0; index < sts.length; index++) {
        var status = sts[index]
        status.style.display = "none";
        document.getElementById("toots")
            .classList.remove("active");
        document.getElementById("tootsNreplies")
            .classList.remove("active");
        document.getElementById("mediatoots")
            .classList.add("active");
    }
}

function clickcloseimg() {
    document.getElementById('myModal')
        .style.display = 'none'
}


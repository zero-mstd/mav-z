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
                avatar_img = "avatar_default.png";
            }
            try {
                header_img = actor.image["url"]
            } catch {
                console.log("no profile header image");
                header_img = "header_default.jpg";
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
                .innerHTML = '<img class="parallax" src="assets/' +
                header_img +
                '" style="transform: translate3d(0px, 0px, 0px);">';
            document.getElementById("account__header__tabs__name")
                .innerHTML = '<h1><span>' + actor.name +
                '</span><small>' + id + '</small></h1>'
            document.getElementById("public-account-header__bar")
                .innerHTML = '<a class="avatar" href="' +
                accounturl + '"><img src="assets/' + avatar_img + '"></a>';
            document.getElementById("account__header__content")
                .innerHTML = actor.summary;
        });
        reader.readAsText(file);
    });
var days_ct;
function days_diff(start, end) {
    var s = new Date(start);
    var e = new Date(end);
    return (e.getTime() - s.getTime()) / (1000 * 3600 * 24) + 1;
}

var date_from, date_to;
document.getElementById("outbox-file-input")
    .addEventListener("change", function(event) {
        var file = event.target.files[0],
            reader = new FileReader();
        reader.addEventListener("load", function() {
            outbox = JSON.parse(this.result);
            date_from = document.getElementById("date-input-from");
            date_to = document.getElementById("date-input-to");
            var earliest_number = 0;
            var latest_number = outbox.orderedItems.length - 1;
            var earliest_date = outbox.orderedItems[earliest_number].published.substring(0,10);
            var latest_date = outbox.orderedItems[latest_number].published.substring(0,10);
            date_from.value = earliest_date;
            date_from.min = earliest_date;
            date_from.max = latest_date;
            document.getElementById("date_from").innerHTML = earliest_date;
            document.getElementById("date_input_from").innerHTML = earliest_date;
            date_to.value = latest_date;
            date_to.min = earliest_date;
            date_to.max = latest_date;
            document.getElementById("date_to").innerHTML = latest_date;
            document.getElementById("date_input_to").innerHTML = latest_date;
            days_ct = days_diff(earliest_date, latest_date);
            document.getElementById("date_diff").innerHTML = days_ct;
            document.getElementById("date_input_diff").innerHTML = days_ct;
            buildArchiveView(outbox, actor);
        });
        reader.readAsText(file);
    });

function deal_with_period(date_from_value, date_to_value) {
    var date_from_number = new Date(date_from_value);
    var date_to_number = new Date(date_to_value);
    if (date_from_number.getTime() > date_to_number.getTime()) {
        alert('开始日期应不晚于结束日期');
        return 1;
    }

    days_ct = days_diff(date_from_value, date_to_value);
    document.getElementById("date_input_to").innerHTML = date_to_value;
    document.getElementById("date_input_diff").innerHTML = days_ct;

    var outbox_operate = JSON.parse(JSON.stringify(outbox));
    // deep copy so that the change won't affect the original data.
    let toot;
    for (toot in outbox_operate.orderedItems) {
        var published_date = new Date(outbox_operate.orderedItems[toot].published.substring(0,10));
        if (published_date.getTime() < date_from_number.getTime() ||
            published_date.getTime() > date_to_number.getTime()) {
            delete outbox_operate.orderedItems[toot];
        }
    }

    buildArchiveView(outbox_operate, actor);
}

function save_date_from(v) {
    deal_with_period(v.target.value, date_to.value);
}
function save_date_to(v) {
    deal_with_period(date_from.value, v.target.value);
}

function clear_grid() {
    document.getElementById("grid_section")
        .innerHTML = '<div class="column-0">\
                        <div class="account__section-headline" id="account__section-headline">\
                        </div>\
                        <main id="articles">\
                        </main>\
                    </div>\
                    <div class="column-1">\
                        <div class="archive__section" id="archive__section">\
                        </div>\
                    </div>';
}

function buildArchiveView(outbox, actor) {
    clear_grid();
    var articleTemplate = document.getElementById("article"),
        articleCWTemplate = document.getElementById("article--CW"),
        videoTemplate = document.getElementById("media-video"),
        imageTemplate = document.getElementById("media-image");

    var statuses = outbox.orderedItems.map(item => item.object)
        .filter(object => typeof(object) === typeof({}));

    var nonreply_ct = 0,
        with_reply_ct = 0,
        mediatoot_ct = 0,
        public_ct = 0,
        public_reply_ct = 0,
        unlisted_ct = 0,
        unlisted_reply_ct = 0,
        followers_only_ct = 0,
        followers_only_reply_ct = 0,
        direct_ct = 0,
        direct_reply_ct = 0,
        boost_ct = 0;
    var month_cur = '',
        month_list = [],
        month_ct = [];

    let toot;
    for (toot in outbox.orderedItems) {
        if (outbox.orderedItems[toot].type == "Create") {
            with_reply_ct += 1;
        } else if (outbox.orderedItems[toot].type == "Announce") {
            boost_ct += 1;
        }
    }

    function checkIfReply(status) {
        if (status.inReplyTo != null) {
            return 1;
        } else {
            nonreply_ct += 1;
            return 0;
        }
    }

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
                    visibility = '🔓';
                    unlisted_reply_ct += checkIfReply(status);
                    unlisted_ct += 1;
                } else {
                    visibility = '🔒';
                    followers_only_reply_ct += checkIfReply(status);
                    followers_only_ct += 1;
                }
            } else if (status.to.includes(activitystreams)) {
                visibility = '🌍';
                public_reply_ct += checkIfReply(status);
                public_ct += 1;
            } else {
                visibility = '✉️';
                direct_reply_ct += checkIfReply(status);
                direct_ct += 1;
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
        with_reply_ct.toString() +
        '）</span></a><a class="tootheadline" id="mediatoots" onclick="clicktootsmedia()"><span>媒体（' +
        mediatoot_ct.toString() + '）</span></a>';
    document.getElementById("overviews_public").innerHTML = public_ct.toString();
    document.getElementById("overviews_public_original").innerHTML = (public_ct - public_reply_ct).toString();
    document.getElementById("overviews_public_reply").innerHTML = public_reply_ct.toString();
    document.getElementById("overviews_unlisted").innerHTML = unlisted_ct.toString();
    document.getElementById("overviews_unlisted_original").innerHTML = (unlisted_ct - unlisted_reply_ct).toString();
    document.getElementById("overviews_unlisted_reply").innerHTML = unlisted_reply_ct.toString();
    document.getElementById("overviews_followers-only").innerHTML = followers_only_ct.toString();
    document.getElementById("overviews_followers-only_original").innerHTML = (followers_only_ct - followers_only_reply_ct).toString();
    document.getElementById("overviews_followers-only_reply").innerHTML = followers_only_reply_ct.toString();
    document.getElementById("overviews_direct").innerHTML = direct_ct.toString();
    document.getElementById("overviews_direct_original").innerHTML = (direct_ct - direct_reply_ct).toString();
    document.getElementById("overviews_direct_reply").innerHTML = direct_reply_ct.toString();
    document.getElementById("overviews_original").innerHTML = nonreply_ct.toString();
    document.getElementById("overviews_reply").innerHTML = (public_reply_ct + unlisted_reply_ct + followers_only_reply_ct + direct_reply_ct).toString();
    document.getElementById("overviews_total").innerHTML = with_reply_ct.toString();
    document.getElementById("overviews_total_without_direct").innerHTML = (public_ct + unlisted_ct + followers_only_ct).toString();
    document.getElementById("overviews_total_without_direct_a").innerHTML = ((public_ct + unlisted_ct + followers_only_ct) / days_ct).toFixed(2).toString();
    document.getElementById("overviews_boost").innerHTML = boost_ct.toString();
    document.getElementById("overviews_boost_a").innerHTML = (boost_ct / days_ct).toFixed(2).toString();
    document.getElementById("overviews_display").innerHTML = outbox.totalItems.toString();
    document.getElementById("overviews_without_reply_and_boost").innerHTML = (public_ct + unlisted_ct + followers_only_ct + boost_ct).toString();


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


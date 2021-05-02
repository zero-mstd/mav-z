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

var exhibition_title_json = {"0":"exhibition_title_json"};
var exhibition_content_json = {"0":"exhibition_content_json"};
var exhibition_title_ct = 0;
function delete_one_item(lists, n, item) {
    for (var i = 0; i <= n; i++) {
        if (lists[i].includes(item)) {
            var tem_index = lists[i].indexOf(item);
            lists[i].splice(tem_index, 1);
        }
    }
}
function AfterSelect(s) {
    if (s.value == "0") {
        delete_one_item(exhibition_content_json, exhibition_title_ct, s.id);
    } else if (s.value == "new") {
        delete_one_item(exhibition_content_json, exhibition_title_ct, s.id);
        var title = prompt("请输入标题", "");
        var descr = prompt("请输入一小段描述", "标题是：" + title);
        exhibition_title_ct += 1;
        exhibition_title_json[exhibition_title_ct] = [title, descr];
        exhibition_content_json[exhibition_title_ct] = [s.id];
        var all_selectors = document.getElementsByClassName("exhibition_selector");
        for (var i = 0; i < all_selectors.length; i++) {
            var cur_selector = all_selectors.item(i);
            var opt = document.createElement("option");
            opt.text = title;
            opt.value = exhibition_title_ct;
            cur_selector.add(opt, exhibition_title_ct);
        }
        s.value = exhibition_title_ct;
    } else {
        delete_one_item(exhibition_content_json, exhibition_title_ct, s.id);
        exhibition_content_json[s.value].push(s.id);
    }
    // console.log(exhibition_title_json);
    // console.log(exhibition_content_json);
}

// stick archive
var archive = document.getElementById("archive__section"),

    stop = archive.offsetTop - 20,
    stop_val = stop;

var actor_id;
var accounturl;
//load actor
document.getElementById("actor-file-input")
    .addEventListener("change", function(event) {
        var file = event.target.files[0],
            reader = new FileReader();
        reader.addEventListener("load", function() {
            actor = JSON.parse(this.result);

            actor_id = actor.id;
            accounturl = actor.url;
            var url_sp = accounturl.split("/"),
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
        if (actor == null) {
            alert('请先选择 actor.json');
            return 1;
        }
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
    date_from.max = date_to_value;
    date_to.min = date_from_value;
    var date_from_number = new Date(date_from_value);
    var date_to_number = new Date(date_to_value);

    days_ct = days_diff(date_from_value, date_to_value);
    document.getElementById("date_input_from").innerHTML = date_from_value;
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
    outbox_operate.orderedItems = outbox_operate.orderedItems.filter(Boolean);
    // ref: https://stackoverflow.com/a/281335/9783145

    buildArchiveView(outbox_operate, actor);
}

function save_date_from(v) {
    deal_with_period(v.target.value, date_to.value);
}
function save_date_to(v) {
    deal_with_period(date_from.value, v.target.value);
}

var tootCanvas = document.getElementById("tootChart");
var lineChart = new Chart(tootCanvas, {
        type: 'line',
        data: {}
    });
function clear_grid() {
    exhibition_title_json = {"0":"exhibition_title_json"};
    exhibition_content_json = {"0":"exhibition_content_json"};
    exhibition_title_ct = 0;
    lineChart.destroy();
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

    // prepare for the plotting
    function millisec_to_date(millisec) {
        var date = new Date(millisec);
        return date.toISOString().substring(0,10);
    }

    var temp_plot_data = {};

    if (outbox.orderedItems[0] != null) {
        var earliest_number = 0;
        var latest_number = outbox.orderedItems.length - 1;
        var earliest_date = new Date(outbox.orderedItems[earliest_number].published.substring(0,10));
        var latest_date = new Date(outbox.orderedItems[latest_number].published.substring(0,10));
        var earliest_millisec = earliest_date.getTime();
        var latest_millisec = latest_date.getTime();
        for (var i = earliest_millisec; i <= latest_millisec; i += 86400000) {
            temp_plot_data[millisec_to_date(i)] = [0, 0, 0]; // toots, replies, boosts
        }
    }

    let toot;
    for (toot in outbox.orderedItems) {
        if (outbox.orderedItems[toot].type == "Create") {
            with_reply_ct += 1;
        } else if (outbox.orderedItems[toot].type == "Announce") {
            boost_ct += 1;
            temp_plot_data[outbox.orderedItems[toot].published.substring(0,10)][2] += 1;
        }
    }
    // end prepare

    function checkIfReply(status) {
        if (status.inReplyTo != null && !(status.inReplyTo.includes(actor_id))) {
            return 1;
        } else {
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
                    nonreply_ct += (1 - checkIfReply(status));
                } else {
                    visibility = '🔒';
                    followers_only_reply_ct += checkIfReply(status);
                    followers_only_ct += 1;
                    nonreply_ct += (1 - checkIfReply(status));
                }
            } else if (status.to.includes(activitystreams)) {
                visibility = '🌍';
                public_reply_ct += checkIfReply(status);
                public_ct += 1;
                nonreply_ct += (1 - checkIfReply(status));
            } else {
                visibility = '✉️';
                direct_reply_ct += checkIfReply(status);
                direct_ct += 1;
                nonreply_ct += (1 - checkIfReply(status));
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
        } else {
            temp_plot_data[status.published.substring(0,10)][0] += (1 - checkIfReply(status));
            temp_plot_data[status.published.substring(0,10)][1] += checkIfReply(status);
        }
        if (status.inReplyTo != null && !(status.inReplyTo.includes(actor_id))) {
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

        var ex_id_n = status.url.lastIndexOf("/");
        var ex_id = status.url.substring(ex_id_n + 1);
        var exhibition_html;

        if (visibility == '✉️' || visibility == '🔒') {
            exhibition_html = `
                <select disabled="disabled">
                    <option>不公开</option>
                </select>
            `
        } else {
            exhibition_html = '<select onchange="AfterSelect(this)" id="' +
            ex_id + '" class="exhibition_selector"> \
                <option value="0">-</option> \
                <option value="new">添加分区</option> \
                </select>'
        }

        article.querySelector(".status__date")
            .insertAdjacentHTML("afterbegin", date_html);
        article.querySelector(".status__content").id = 'c_' + ex_id;
        article.querySelector(".status__content")
            .insertAdjacentHTML("afterbegin", status.content);
        article.querySelector(".status__exhibition")
            .insertAdjacentHTML("afterbegin", exhibition_html);
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
    // console.log(temp_plot_data);

    // plotting the line graph part
    var lable_array = [],
        toots_array = [],
        replies_array = [],
        boosts_array = [];
    let t;
    for (t in temp_plot_data) {
        lable_array.push(t);
        toots_array.push(temp_plot_data[t][0]);
        replies_array.push(temp_plot_data[t][1]);
        boosts_array.push(temp_plot_data[t][2]);
    }

    var dataToots = {
        label: "原创数（不含私信）",
        data: toots_array,
        lineTension: 0,
        fill: false,
        borderColor: 'yellow'
    };

    var dataReplies = {
        label: "回复数（不含私信）",
        data: replies_array,
        lineTension: 0,
        fill: false,
        borderColor: 'lightblue'
    };

    var dataBoosts = {
        label: "转嘟数",
        data: boosts_array,
        lineTension: 0,
        fill: false,
        borderColor: 'red'
    };

    var tootData = {
        labels: lable_array,
        datasets: [dataToots, dataReplies, dataBoosts]
    };

    lineChart = new Chart(tootCanvas, {
        type: 'line',
        data: tootData
    });
    // end of plotting

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
        .innerHTML = month_section_html;

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
        .style.display = 'none';
}

var exhibitionText = `
---
title: 季度嘟文精华展 - 20xx X
date: 20xx-xx-xx
---


`;

// ref: https://www.thecodehubs.com/generate-text-file-using-plain-javascript/
function generateTxtFile(text){
    var textFile = null;
    var data = new Blob([text], {type: 'text/plain'});
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
}
(function () {
    var btnCreateFile = document.getElementById('btnCreateFile');
    btnCreateFile.addEventListener('click', function () {
        for (var i = 1; i <= exhibition_title_ct; i++) {
            exhibitionText += '## ' + exhibition_title_json[i][0] + '\n\n';
            exhibitionText += exhibition_title_json[i][1] + '\n\n';
            for (var j in exhibition_content_json[i]) {
                if (document.getElementById("c_" + exhibition_content_json[i][j]).parentNode.className.includes('reply')) {
                    exhibitionText += '这是一条回复，建议点开链接查看上下文，不要断章取义，并按照发言顺序阅读，避免先入为主.\n\n'
                }
                exhibitionText += '<!--'
                exhibitionText += document.getElementById("c_" + exhibition_content_json[i][j]).innerHTML;
                exhibitionText += '-->\n\n'
                exhibitionText += '<iframe src="' + accounturl + '/' +
                    exhibition_content_json[i][j] +
                    `/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="100%" allowfullscreen="allowfullscreen"></iframe>` +
                    '\n\n';
                exhibitionText += '---\n\n'
            }
        }
        var link = document.getElementById('downloadFile');
        link.href = generateTxtFile(exhibitionText);
        link.style.display = 'inline-block';
    }, false);
})();

var secret = document.getElementsByClassName("secret");
function toggle_show() {
    for (var i = 0; i < secret.length; i++) {
        if (secret[i].style.color == secret[i].style.backgroundColor) {
            secret[i].style.backgroundColor = "";
        } else {
            secret[i].style.backgroundColor = secret[i].style.color;
        }
    }
}

'use strict'
var debug = 0; // 1: debug mode on; 0: debug mode off;
//
// Mastodon Archive Viewer (mav-z)
// Author: Zero
//
// i'm both shocked that this works and shocked that the other things i tried didn't
// same my friend
var actor = null;
var outbox = null;

function debugLog(text) {
    if (debug) {
        console.log("(" + new Date().toISOString().substr(11,12) + ") " + text);
    }
}
debugLog("(log) debug mode on");
debugLog("(log) browser: " + navigator.userAgent);

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

var actor_id;

var my_reply = {},
    my_boost = {},
    my_favourite = {},
    my_bookmark = {};

var all_files = {};
const take_files = (files) => {
    debugLog("(log) there are " + files.length + " files in total");
    //console.log(files); // `files` is an array
    let f;
    for (f in files) {
        all_files[files[f].name] = files[f];
    }
    debugLog("(log) finish untaring");
    //console.log(all_files); // `all_files` is a javascript object, key = file's name
    bookmarks_input(all_files['bookmarks.json'].blob);
    likes_input(all_files['likes.json'].blob);
    actor_input(all_files['actor.json'].blob);
    outbox_input(all_files['outbox.json'].blob);
};

document.getElementById("tgz-file-input")
    .addEventListener("change", function(event) {
    // 1. read the xxx.tar.gz here
    // 2. use pako.min.js to uncompress
    // 3. use untar.js to open the .tar file
    // 4. deal it with the take_files function
        // console.log(this.files);
        var file = event.target.files[0],
            reader = new FileReader();
        reader.addEventListener("load", function() {
            debugLog("(log) total: " + this.result.byteLength * 0.000001 + " MB");
            debugLog("(log) start to untar the .tar.gz file");
            untar(pako.inflate(this.result).buffer).then(take_files);
            debugLog("(log) untaring the .tar.gz file");
        });
        debugLog("(log) reading the .tar.gz file");
        reader.readAsArrayBuffer(file);
        debugLog("(log) finish reading the .tar.gz file");
    });

document.getElementById("bookmarks-file-input")
    .addEventListener("change", function(event) {
        var file = event.target.files[0];
        bookmarks_input(file);
    });
document.getElementById("likes-file-input")
    .addEventListener("change", function(event) {
        var file = event.target.files[0];
        likes_input(file);
    });
document.getElementById("actor-file-input")
    .addEventListener("change", function(event) {
        var file = event.target.files[0];
        actor_input(file);
    });
document.getElementById("outbox-file-input")
    .addEventListener("change", function(event) {
        if (actor == null) {
            alert('Open actor.json first!\n请先选择 actor.json! ');
            return 1;
        }
        var file = event.target.files[0];
        outbox_input(file);
    });

function actor_input(file) {
    debugLog("(log)(actor) start the actor.json part");
    // The js-untar package indeed has a `readAsJSON()` method, see:
    //      https://github.com/InvokIT/js-untar#file-object,
    // which means I should could use the following easier sentence:
    // actor = all_files['actor.json'].readAsJSON();
    // BUT all the chinese characters then become messy (mojibake),
    // seemed that the js-untar didn't consider about the encoded thing?
    // So, I have to use the more complex way (.blob),
    // and it is the same situation about `{outbox|bookmarks|likes}_input` function.

    var reader = new FileReader();
    if (file) {
        debugLog("(log)(actor) got actor.json");
    } else {
        debugLog("(error)(bookmark) no actor.json");
    }
    reader.addEventListener("load", function() {
        debugLog("(log)(actor) parsing the actor.json");
        actor = JSON.parse(this.result);
        if (actor.id) {
            debugLog("(log)(actor) finish parsing the actor.json");
        } else {
            debugLog("(error)(actor) no actor.json or no actor.id");
        }

        deal_with_actor(actor);
    });
    debugLog("(log)(actor) reading the actor.json");
    reader.readAsText(file);
    debugLog("(log)(actor) finish reading actor.json");
}
function deal_with_actor(actor) {
    actor_id = actor.id;
    var accounturl = actor.url,
        url_sp = accounturl.split("/"),
        id = url_sp[3] + '@' + url_sp[2];

    var avatar_img, header_img = ''
    try {
        var avatar_img_address = actor.icon["url"];
        if (load_mode == 'auto') {
            avatar_img = URL.createObjectURL(all_files[avatar_img_address].blob);
        } else if (load_mode == 'manual') {
            avatar_img = avatar_img_address;
        }
    } catch {
        debugLog("(log)(actor) no profile avatar");
        avatar_img = "assets/avatar.png";
    }
    try {
        var header_img_address = actor.image["url"];
        if (load_mode == 'auto') {
            header_img = URL.createObjectURL(all_files[header_img_address].blob);
        } else if (load_mode == 'manual') {
            header_img = header_img_address;
        }
    } catch {
        debugLog("(log)(actor) no profile header image");
        header_img = "assets/header.jpg";
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
    debugLog("(log)(actor) finish the actor.json part");
}

function link2name(link, stage) {
    try {
        var link_arr = link.split('/');
        return link_arr[2];
        // return '@' + link_arr[2] + '@' + link_arr[0];
    } catch {
        debugLog("(error)(link2name) cannot extract site’s name from this link: " + link + ", when deal with " + stage);
    }
}

function bookmarks_input(file) {
    debugLog("(log)(bookmark) start the bookmarks.json part");
    var reader = new FileReader();
    if (file) {
        debugLog("(log)(bookmark) got bookmarks.json");
    } else {
        debugLog("(error)(bookmark) no bookmarks.json");
    }
    reader.addEventListener("load", function() {
        debugLog("(log)(bookmark) parsing the bookmarks.json");
        var bookmarks = JSON.parse(this.result);
        if (bookmarks.orderedItems) {
            debugLog("(log)(bookmark) finish parsing the bookmarks.json");
        } else {
            debugLog("(error)(bookmark) no bookmarks.json or no orderedItems");
        }

        deal_with_bookmarks(bookmarks);
    });
    debugLog("(log)(bookmark) reading the bookmarks.json");
    reader.readAsText(file);
    debugLog("(log)(bookmark) finish reading bookmarks.json");
}
function deal_with_bookmarks(bookmarks) {
    for (var i in bookmarks.orderedItems) {
        var name = link2name(bookmarks.orderedItems[i], 'bookmarks');
        if (my_bookmark[name] == null) {
            my_bookmark[name] = 1;
        } else {
            my_bookmark[name] += 1;
        }
    }
    var order_bookmark = Object.keys(my_bookmark)
        .sort(function(a,b){return my_bookmark[b] - my_bookmark[a]});
    var h = '';
    for (var i in order_bookmark) {
        h += order_bookmark[i] + '(' + my_bookmark[order_bookmark[i]] + ')<br>';
    }
    document.getElementById("most_bookmark").innerHTML = h;
    debugLog("(log)(bookmark) finish rendering most bookmark sites");
    my_bookmark = {}; //clear mem
    debugLog("(log)(bookmark) finish the bookmarks.json part");
}

function likes_input(file) {
    debugLog("(log)(like) start the likes.json part");
    var reader = new FileReader();
    if (file) {
        debugLog("(log)(like) got likes.json");
    } else {
        debugLog("(error)(like) no likes.json");
    }
    reader.addEventListener("load", function() {
        debugLog("(log)(like) parsing the likes.json");
        var likes = JSON.parse(this.result);
        if (likes.orderedItems) {
            debugLog("(log)(like) finish parsing the likes.json");
        } else {
            debugLog("(error)(like) no likes.json or no orderedItems");
        }
        deal_with_likes(likes);
    });
    debugLog("(log)(like) reading the likes.json");
    reader.readAsText(file);
    debugLog("(log)(like) finish reading likes.json");
}
function deal_with_likes(likes) {
    for (var i in likes.orderedItems) {
        var name = link2name(likes.orderedItems[i], 'likes');
        if (my_favourite[name] == null) {
            my_favourite[name] = 1;
        } else {
            my_favourite[name] += 1;
        }
    }
    var order_favourite = Object.keys(my_favourite)
        .sort(function(a,b){return my_favourite[b] - my_favourite[a]});
    var h = '';
    for (var i in order_favourite) {
        h += order_favourite[i] + '(' + my_favourite[order_favourite[i]] + ')<br>';
    }
    document.getElementById("most_favourite").innerHTML = h;
    debugLog("(log)(like) finish rendering most favourite sites");
    my_favourite = {}; //clear mem
    debugLog("(log)(like) finish the likes.json part");
}

var days_ct;
function days_diff(start, end) {
    var s = new Date(start);
    var e = new Date(end);
    return (e.getTime() - s.getTime()) / (1000 * 3600 * 24) + 1;
}

var date_from, date_to;
function outbox_input(file) {
    debugLog("(log)(outbox) start the outbox.json part");
    var reader = new FileReader();
    if (file) {
        debugLog("(log)(outbox) got outbox.json");
    } else {
        debugLog("(error)(outbox) no outbox.json");
    }
    reader.addEventListener("load", function() {
        debugLog("(log)(outbox) parsing the outbox.json");
        outbox = JSON.parse(this.result);
        if (outbox.orderedItems) {
            debugLog("(log)(outbox) finish parsing the outbox.json");
        } else {
            debugLog("(log)(outbox) no outbox.json or no orderedItems");
        }
        deal_with_outbox(outbox);
    });
    debugLog("(log)(outbox) reading the outbox.json");
    reader.readAsText(file);
    debugLog("(log)(outbox) finish reading outbox.json");
}
function deal_with_outbox(outbox) {
    date_from = document.getElementById("date-input-from");
    date_to = document.getElementById("date-input-to");
    var earliest_number = 0;
    var latest_number = outbox.orderedItems.length - 1;
    var earliest_date = offsetTime(outbox.orderedItems[earliest_number].published).substring(0,10);
    var latest_date = offsetTime(outbox.orderedItems[latest_number].published).substring(0,10);
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
    debugLog("(log)(outbox) finish rendering the earliest and latest date");

    debugLog("(log)(outbox) passing outbox and actor, start to bulid");
    buildArchiveView(outbox, actor);
    debugLog("(log)(outbox) finish the outbox.json part");
}

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
        var published_date = new Date(offsetTime(outbox_operate.orderedItems[toot].published).substring(0,10));
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
    lineChart.destroy();
    document.getElementById("articles").innerHTML = '';
    document.getElementById("month_section_html").innerHTML = '';
    document.getElementById("nonreply_ct").innerHTML = '0';
    document.getElementById("with_reply_ct").innerHTML = '0';
    document.getElementById("mediatoot_ct").innerHTML = '0';
}

function buildArchiveView(outbox, actor) {
    debugLog("(log)(build) building satarted");
    clear_grid();
    debugLog("(log)(build) cleaned the entire page");
    var articleTemplate = document.getElementById("article"),
        articleCWTemplate = document.getElementById("article--CW"),
        videoTemplate = document.getElementById("media-video"),
        audioTemplate = document.getElementById("media-audio"),
        imageTemplate = document.getElementById("media-image"),
        otherTemplate = document.getElementById("media-file");
    debugLog("(log)(build) got 4 templates");

    var statuses = outbox.orderedItems.map(item => item.object)
        .filter(object => typeof(object) === typeof({}));
    // Uncomment the following line to sort your toots by published time.
    // statuses = statuses.sort((a,b) => new Date(a.published).getTime() - new Date(b.published).getTime());
    debugLog("(log)(build) turned outbox.orderedItems to statuses");

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
    debugLog("(log)(build) variables prepared");

    // prepare for the plotting
    function millisec_to_date(millisec) {
        var date = new Date(millisec);
        return date.toISOString().substring(0,10);
    }

    var temp_plot_data = {};

    if (outbox.orderedItems[0] != null) {
        debugLog("(log)(build) start to establish x-axis for the graph");
        var earliest_number = 0;
        var latest_number = outbox.orderedItems.length - 1;
        var earliest_date = new Date(offsetTime(outbox.orderedItems[earliest_number].published).substring(0,10));
        var latest_date = new Date(offsetTime(outbox.orderedItems[latest_number].published).substring(0,10));
        var earliest_millisec = earliest_date.getTime();
        var latest_millisec = latest_date.getTime();
        for (var i = earliest_millisec; i <= latest_millisec; i += 86400000) {
            temp_plot_data[millisec_to_date(i)] = [0, 0, 0]; // toots, replies, boosts
        }
        debugLog("(log)(build) established x-axis for the graph");
    } else {
        debugLog("(error)(build) unable to establish x-axis for the graph");
    }

    let toot;
    for (toot in outbox.orderedItems) {
        if (outbox.orderedItems[toot].type == "Create") {
            with_reply_ct += 1;
        } else if (outbox.orderedItems[toot].type == "Announce") {
            boost_ct += 1;
            temp_plot_data[offsetTime(outbox.orderedItems[toot].published).substring(0,10)][2] += 1;
            var name = link2name(outbox.orderedItems[toot].object, 'boost');
            if (my_boost[name] == null) {
                my_boost[name] = 1;
            } else {
                my_boost[name] += 1;
            }
        }
    }
    debugLog("(log)(build) finish preparing boost data");
    // end prepare
    var order_boost = Object.keys(my_boost)
        .sort(function(a,b){return my_boost[b] - my_boost[a]});
    var h = '';
    for (var i in order_boost) {
        h += order_boost[i] + '(' + my_boost[order_boost[i]] + ')<br>';
    }
    document.getElementById("most_boost").innerHTML = h;
    debugLog("(log)(build) finish rendering most boost sites");
    my_boost = {}; //clear mem

    function checkIfReply(status) {
        if (status.inReplyTo == null && status.conversation.includes(actor_id.split('/')[2])) {
            return 0;
        } else {
            if (status.inReplyTo != null && !(status.inReplyTo.includes(actor_id))) {
                var name = link2name(status.inReplyTo, 'reply');
                if (my_reply[name] == null) {
                    my_reply[name] = 1;
                } else {
                    my_reply[name] += 1;
                }
            }
            return 1;
        }
    }

    debugLog("(log)(build) start reading and dealing toots one by one");
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
                    visibility = '🔑';
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
            debugLog("(log)(build) grabing visibility failed for this toot: " + status.url);
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
            temp_plot_data[offsetTime(status.published).substring(0,10)][0] += (1 - checkIfReply(status));
            temp_plot_data[offsetTime(status.published).substring(0,10)][1] += checkIfReply(status);
        }
        if (status.inReplyTo != null && !(status.inReplyTo.includes(actor_id))) {
            article.querySelector(".status__box")
                .classList.add("reply");
        }

        var publish_date = offsetTime(status.published);
        var publish_month = publish_date.slice(0, 7);

        var date_html = '<a class="date" href="' + status.url +
            '"  target="_blank">' + visibility + ' <div id="toot_date_time">' + publish_date.slice(
                0, 10) + ' ' + publish_date.slice(11, 19) + '</div></a>';
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

            //
            //console.log(attachmentUrls)
            //console.log(attachmentNames)
            for (var i = 0; i < attachmentUrls.length; i++) (function(i){
            // onClick event in a for loop is quite tricky,
            // see, https://stackoverflow.com/a/15860764

                var url = attachmentUrls[i]
                var caption = attachmentNames[i]
                // attachmentUrls.forEach((url) => {
                mediatoot_ct += 1
                var extension = url.split(".")
                    .pop();
                if (['mp4', 'm4v', 'mov', 'webm'].includes(extension)) {
                    var media = document.importNode(videoTemplate.content,
                        true);
                    var mediaType = 'v';
                } else if (['mp3', 'ogg', 'wav', 'flac', 'opus', 'aac', 'm4a', '3gp'].includes(extension)) {
                    var media = document.importNode(audioTemplate.content,
                        true);
                    var mediaType = 'a';
                } else if (['png', 'jpg', 'gif', 'jpeg'].includes(extension)) {
                    var media = document.importNode(imageTemplate.content,
                        true);
                    var mediaType = 'i';
                } else {
                    var media = document.importNode(otherTemplate.content,
                        true);
                    var mediaType = 'o';
                }

                var address_att = url.substring(url.indexOf('media_attachments/'));
                if (load_mode == 'auto') {
                    if (all_files.hasOwnProperty(address_att)) {
                        var src_att = URL.createObjectURL(all_files[address_att].blob);
                    } else {
                        var src_att = 'assets/favicon.ico';
                        caption += ' (MISSED!)';
                        console.log('(ERROR) Your archive pack does not seem to contain this image: '
                            + address_att + '. Involved toot: ' + status.url);
                    }
                } else if (load_mode == 'manual') {
                    var src_att = address_att;
                }

                if (mediaType != 'o') {
                    media.querySelector(".status__media").src = src_att;
                } else {
                    media.querySelector(".status__media").innerHTML = src_att;
                }
                if (mediaType == 'i') {
                    media.querySelector(".status__media")
                        .onclick = function(src_att) { // insert image inside the modal - use name as a caption
                            var modal = document.getElementById("myModal");
                            var modalImg = document.getElementById("img01");
                            var captionText = document.getElementById("caption");
                            modal.style.display = "block";
                            modalImg.src = src_att.target.src;
                            if (caption) {
                                captionText.innerHTML = caption;
                            }
                        }
                }
                mediaDiv.appendChild(media);
                // });
            })(i);
        } else {
            article.querySelector(".status__box")
                .classList.add("nonmedia");
            article.querySelector(".status__media")
                .remove();
        }
        document.getElementById("articles")
            .appendChild(article);

    });
    debugLog("(log)(build) finish reading and dealing toots one by one");
    // console.log(temp_plot_data);
    var order_reply = Object.keys(my_reply)
        .sort(function(a,b){return my_reply[b] - my_reply[a]});
    var h = '';
    for (var i in order_reply) {
        h += order_reply[i] + '(' + my_reply[order_reply[i]] + ')<br>';
    }
    document.getElementById("most_reply").innerHTML = h;
    debugLog("(log)(build) finish rendering most reply sites");
    my_reply = {}; //clear mem

    debugLog("(log)(build) prepare for the graph plotting");
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
        label: "Original (without DMs)\n原创数（不含私信）",
        data: toots_array,
        lineTension: 0,
        fill: false,
        borderColor: 'yellow'
    };

    var dataReplies = {
        label: "Replies (without DMs)\n回复数（不含私信）",
        data: replies_array,
        lineTension: 0,
        fill: false,
        borderColor: 'lightblue'
    };

    var dataBoosts = {
        label: "Boosts\n转嘟数",
        data: boosts_array,
        lineTension: 0,
        fill: false,
        borderColor: 'red'
    };

    var tootData = {
        labels: lable_array,
        datasets: [dataToots, dataReplies, dataBoosts]
    };

    debugLog("(log)(build) start plotting");
    lineChart = new Chart(tootCanvas, {
        type: 'line',
        data: tootData
    });
    debugLog("(log)(build) finish plotting");
    // end of plotting

    debugLog("(log)(build) start to render the table");
    document.getElementById("nonreply_ct").innerHTML = nonreply_ct.toString();
    document.getElementById("with_reply_ct").innerHTML = with_reply_ct.toString();
    document.getElementById("mediatoot_ct").innerHTML = mediatoot_ct.toString();
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
    debugLog("(log)(build) finish rendering the table");

    debugLog("(log)(build) prepare for the index part");
    var month_section_html = '';
    var yr_last = '';
    var yr_cur = '';
    for (var i = 0; i < month_list.length; i++) {
        yr_cur = month_list[i].slice(0, 4);
        if (yr_cur != yr_last) {
            month_section_html +=
                '</details><details><summary class="archive year">' + yr_cur +
                '</summary>';
            yr_last = yr_cur;
        }
        month_section_html += '<dl><dd><a href="#' + month_list[i] + '">' +
            month_list[i] + ' (' + month_ct[i] + ')</a></dd></dl>';

    }

    month_section_html += '</details>';
    document.getElementById("month_section_html")
        .innerHTML = month_section_html;
    debugLog("(log)(build) fiinsh rendering the index part");

    debugLog("(log)(build) finish the build");
}

function clicktoots() {
    var sts = document.getElementsByClassName("status__box");
    for (var index = 0; index < sts.length; index++) {
        var status = sts[index];
        if (status.classList.contains("reply")) {
            status.style.display = "none";
        } else {
            status.style.display = "block";
        }
    }
    document.getElementById("toots")
        .classList.add("active");
    document.getElementById("tootsNreplies")
        .classList.remove("active");
    document.getElementById("mediatoots")
        .classList.remove("active");
}

function clicktootsNreplies() {
    var sts = document.getElementsByClassName("status__box");
    for (var index = 0; index < sts.length; index++) {
        var status = sts[index];
        status.style.display = "block";
    }
    document.getElementById("toots")
        .classList.remove("active");
    document.getElementById("tootsNreplies")
        .classList.add("active");
    document.getElementById("mediatoots")
        .classList.remove("active");
}

function clicktootsmedia() {
    var sts = document.getElementsByClassName("status__box");
    for (var index = 0; index < sts.length; index++) {
        var status = sts[index];
        if (status.classList.contains("nonmedia")) {
            status.style.display = "none";
        } else {
            status.style.display = "block";
        }
    }
    document.getElementById("toots")
        .classList.remove("active");
    document.getElementById("tootsNreplies")
        .classList.remove("active");
    document.getElementById("mediatoots")
        .classList.add("active");
}

function clickcloseimg() {
    document.getElementById('myModal')
        .style.display = 'none';
}

// hide the # of DM
function toggle_show() {
    var secret = document.getElementsByClassName("secret");
    for (var i = 0; i < secret.length; i++) {
        if (secret[i].style.color == secret[i].style.backgroundColor) {
            secret[i].style.backgroundColor = "";
        } else {
            secret[i].style.backgroundColor = secret[i].style.color;
        }
    }
}

// fold the table
function toggleFold() {
    var cell = document.getElementsByClassName("tg-nrit");
    for (var i = 0; i < cell.length; i++) {
        cell[i].classList.toggle("cell_hide");
    }
}

// set the Time Zone
var offset = new Date().getTimezoneOffset();
debugLog("(log) get time zone offset: " + offset);
document.getElementById('timezone_sel').value = - offset / 60;

function setTimeZone(timezone_value) {
    offset = - timezone_value * 60;
    debugLog("(log) time zone offset changed: " + offset);
    if (all_files['outbox.json']) {
        outbox_input();
    }
}

function offsetTime(datetime) {
    var timeInMillis = Date.parse(datetime);
    var correctTime = new Date(timeInMillis - offset * 60 * 1000);
    var correct_datetime = correctTime.toISOString().split('.')[0] + "Z";
    return correct_datetime;
}

// switchMode
document.getElementById('mode').value = 'auto';
var load_mode = 'auto';
check_mode(load_mode);
debugLog("(log) the loading mode is: auto");

function switchMode(mode) {
    load_mode = mode;
    debugLog("(log) the loading mode is switched to: " + load_mode);
    check_mode(load_mode);
}

function check_mode(mode) {
    if (mode == 'auto'){
        document.getElementById('instruction2').style.display = "none";
        document.getElementById('bookmarks-input').style.display = "none";
        document.getElementById('likes-input').style.display = "none";
        document.getElementById('actor-input').style.display = "none";
        document.getElementById('outbox-input').style.display = "none";
        document.getElementById('instruction1').style.display = "inline-block";
        document.getElementById('tgz-input').style.display = "inline-block";
    } else if (mode == 'manual') {
        document.getElementById('instruction1').style.display = "none";
        document.getElementById('tgz-input').style.display = "none";
        document.getElementById('instruction2').style.display = "inline-block";
        document.getElementById('bookmarks-input').style.display = "inline-block";
        document.getElementById('likes-input').style.display = "inline-block";
        document.getElementById('actor-input').style.display = "inline-block";
        document.getElementById('outbox-input').style.display = "inline-block";
    }
}


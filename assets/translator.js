var i18n_data = {
    'zh': {
        'title': '长毛象嘟文备份',
        'language': 'Choose a language: ',
        'notes': '说明：',
        'note': {
            'p1': '先去你的长毛象实例请求你的账户数据存档（设置 - 导入和导出 - 导出）并下载下来，然后直接在下面选择并打开整个 .tar.gz 格式的文件.',
            'p2': '自己回复自己的嘟文算做是原创，显示在“嘟文”那一列里. 这与网页版 Mastodon 是一致的.',
            'p3': '假设本站用户 A 发了一条嘟文 x，你的嘟文 y 是对 x 的回复，那么当 x 被 A 删除（或由于 A 注销帐号导致其所有嘟文被删除）后，y 会由回复变为原创，显示在“嘟文”那一列里. 同时，统计表格中原创的嘟文数量可能会有所增加，而回复的嘟文数量会相应地有所减少.',
            'p4': '注意：上一条与网页版 Mastodon 并不一致，这是由于存档中少了 `in_reply_to_account_id` 字段导致的无法补救的缺陷. 受影响的只是对本站嘟文的回复，对外站嘟文的回复不受影响.',
            'p5': '本页面会自动读取你的系统时区作为默认时区. 改变时区后嘟文展示与统计都会重新生成，建议先调整好时区再打开存档包.',
            'p6': '表格最下面一行的“存档中显示的嘟文与回复数”指的是在网页版 Mastodon 的个人主页那里，关注数与关注者数左边的那个数字. 它包括转嘟，但不包括私信. 这个数字可能会大于倒数第四行的“以上两项总计”，初步判断是实例的计数有 bug：删除一条嘟文后，其他实例 <code>api/v1/accounts/id</code> 中的 <code>statuses_count</code> 有所减少，但有时候自己实例 <code>api/v1/accounts/id</code> 中的 <code>statuses_count</code> 没有变化. 我觉得非常奇怪，请各位象友指点.',
            'p7': '私信的数量默认隐藏，点击方块的位置可以显示数字，再次点击数字则隐藏.',
        },
        'instruction1': '请直接选择你的长毛象存档文件，它的格式应该是 <b><code>archive-xxx.tar.gz</code></b>.',
        'instruction2': '请按顺序选择 <b><code>bookmarks.json</code></b>、<b><code>likes.json</code></b>、<b><code>actor.json</code></b>、<b><code>outbox.json</code></b>.',
        'from': ' 从 ',
        'to': ' 至 ',
        'table': {
            'title': '<b><span style="color:lightgreen">发嘟</span></b>概览',
            'original': '原创',
            'reply': '回复',
            'total': '总计',
            'tot2': '不含私信总计',
            'tot3': '<b><span style="color:red">转嘟</span></b>总计',
            'public': '公开',
            'average': '平均 ',
            'perd': ' / 天',
            'unlisted': '不公开',
            'fonly': '仅关注者',
            'direct': '私信',
            'tot4': '以上两项总计（不含私信的发嘟和转嘟）：',
            'period1': '上面数据的日期范围（根据在本页最上方的选择）',
            'tot5': '（共 ',
            'tot6': ' 天）',
            'period2': '存档中所有嘟文的日期范围（根据请求存档的时刻）',
            'display': '存档中显示的嘟文与回复数',
        },
        'toots': '嘟文',
        'tnr': '嘟文和回复',
        'media': '媒体',
        'index': '索引',
        'timezone': '时区：',
        'my': '我与这些站的用户有过互动（括号里的数字表示互动次数）：',
        'mReply': '回复',
        'mBoost': '转发',
        'mFavourite': '喜欢',
        'mBookmark': '收藏',
        'togglefold': '展开/折叠',
        'trend': '嘟嘟趋势图：',
        'mode': '加载模式：',
        'auto': '自动',
        'manual': '手动',
        'p1ad': '如果选择了手动加载模式，请按顺序加载 bookmarks.json、likes.json、actor.json、outbox.json.',
    },
    'en': {
        'title': 'Mastodon Archive',
        'language': '切换语言：',
        'notes': 'Notes: ',
        'note': {
            'p1': 'First go to your Mastodon instance, request an archive of your toots and uploaded media (Settings - Import and export - Data export), and download your archive. Then choose and open directly the entire .tar.gz file below.',
            'p2': 'Self-reply counts as original, and will be shown in the “Toots” column. Same as the Mastodon web side.',
            'p3': 'Suppose user A of the same instance as you posted a toot x, and your toot y was a reply to x. Then when x is deleted by A (may also caused by the account deletion of A), y will become original and be shown in the “Toots” column. As a result, the number of original toots in the table increased, while the number of replies decreased.',
            'p4': 'Note that the behavior described in the previous line is not consistent with the Mastodon web UI. This is because every toot in your archive doesn’t have the `in_reply_to_account_id` field as the web UI does. The only toots affected are those that are replies to the toots on the same instance. It’s totally fine if one is a reply to a toot from other instance.',
            'p5': 'This page will automatically detect your system time zone as default. The display will be regenerated and the statistics will be recalculated after you change the time zone, so it is better to adjust the time zone before opening your archive.',
            'p6': '“The number displayed on the web side” item (in the last row of the table) refers to the number displayed on the left of “Following” number and “Followers” number on the web side of Mastodon. It should count boosts but does not count DMs. In practice, this number is probably greater than the fourth-to-last line in the table, i.e., “Total of the above two (boosts contained, but DMs not)”, I feel very strange about this. My preliminary thought is that there is a bug with the counting of Mastodon, because sometimes when I delete one toot, the <code>statuses_count</code> in <code>api/v1/accounts/id</code> on another instance indeed decreased, while on my own instance, it stay the same. Feel free to tell me if you have a clue.',
            'p7': 'The count of DMs is hidden by default, click to toggle between visible and invisible.',
        },
        'instruction1': 'Choose and open directly the archive file, its file name format should be like <b><code>archive-xxx.tar.gz</code></b>.',
        'instruction2': 'Choose and open these json files in order: <b><code>bookmarks.json</code></b>, <b><code>likes.json</code></b>, <b><code>actor.json</code></b>, <b><code>outbox.json</code></b>.',
        'from': ' From ',
        'to': ' To ',
        'table': {
            'title': '<b><span style="color:lightgreen">Toots</span></b> Overview',
            'original': 'Original',
            'reply': 'Reply',
            'total': 'Total',
            'tot2': 'Total (no DMs)',
            'tot3': 'Total of <b><span style="color:red">Boosts</span></b>',
            'public': 'Public',
            'average': 'Average ',
            'perd': ' per day',
            'unlisted': 'Unlisted',
            'fonly': 'Followers-only',
            'direct': 'Direct',
            'tot4': 'Total of the above two (boosts contained, but DMs not): ',
            'period1': 'The date range that you selected',
            'tot5': '( ',
            'tot6': ' days in total)',
            'period2': 'The date range of your archived file',
            'display': 'The number displayed on the web side',
        },
        'toots': 'Toots',
        'tnr': 'Toots and replies',
        'media': 'Media',
        'index': 'Index',
        'timezone': 'Time Zone:',
        'my': 'I have interacted with users in these site (the number following indicates the number of interactions):',
        'mReply': 'Reply',
        'mBoost': 'Boost',
        'mFavourite': 'Favourite',
        'mBookmark': 'Bookmark',
        'togglefold': 'fold/unfold',
        'trend': 'The trend of your toot:',
        'mode': 'Loading mode:',
        'auto': 'Automatically',
        'manual': 'Manually',
        'p1ad': 'If you choose to load your archive manually，please open these files in order: bookmarks.json, likes.json, actor.json, and outbox.json.',
    }
}

// ref: https://codesandbox.io/s/ipfeu
class Translator {
    constructor(options = {}) {
        this._options = Object.assign({}, this.defaultConfig, options);
        this._elements = document.querySelectorAll("[data-i18n]");
        this._cache = new Map();

        if (this._options.detectLanguage) {
            this._options.defaultLanguage = this._detectLanguage();
        }

        if (
            this._options.defaultLanguage &&
            typeof this._options.defaultLanguage == "string"
        ) {
            this._getResource(this._options.defaultLanguage);
        }
    }

    _detectLanguage() {
        var stored = localStorage.getItem("language");

        if (this._options.persist && stored) {
            return stored;
        }

        var lang = navigator.languages ?
            navigator.languages[0] :
            navigator.language;

        return lang.substr(0, 2);
    }

    _fetch(path) {
        return fetch(path)
            .then(response => response.json())
            .catch(() => {
                console.error(
                    `Could not load ${path}. Please make sure that the file exists.`
                );
            });
    }

    async _getResource(lang) {
        if (this._cache.has(lang)) {
            return JSON.parse(this._cache.get(lang));
        }

        var translation = i18n_data[lang];

        if (!this._cache.has(lang)) {
            this._cache.set(lang, JSON.stringify(translation));
        }

        return translation;
    }

    async load(lang) {
        if (!this._options.languages.includes(lang)) {
            return;
        }

        this._translate(await this._getResource(lang));

        document.documentElement.lang = lang;

        if (this._options.persist) {
            localStorage.setItem("language", lang);
        }
    }

    async getTranslationByKey(lang, key) {
        if (!key) throw new Error(
            "Expected a key to translate, got nothing.");

        if (typeof key != "string")
            throw new Error(
                `Expected a string for the key parameter, got ${typeof key} instead.`
            );

        var translation = await this._getResource(lang);

        return this._getValueFromJSON(key, translation, true);
    }

    _getValueFromJSON(key, json, fallback) {
        var text = key.split(".")
            .reduce((obj, i) => obj[i], json);

        if (!text && this._options.defaultLanguage && fallback) {
            let fallbackTranslation = JSON.parse(
                this._cache.get(this._options.defaultLanguage)
            );
            text = this._getValueFromJSON(key, fallbackTranslation, false);
        } else if (!text) {
            text = key;
            console.warn(`Could not find text for attribute "${key}".`);
        }

        return text;
    }

    _translate(translation) {
        var zip = (keys, values) => keys.map((key, i) => [key, values[i]]);
        var nullSafeSplit = (str, separator) => (str ? str.split(separator) :
            null);

        var replace = element => {
            var keys = nullSafeSplit(element.getAttribute("data-i18n"),
                " ") || [];
            var properties = nullSafeSplit(
                element.getAttribute("data-i18n-attr"),
                " "
            ) || ["innerHTML"];

            if (keys.length > 0 && keys.length !== properties.length) {
                console.error(
                    "data-i18n and data-i18n-attr must contain the same number of items"
                );
            } else {
                var pairs = zip(keys, properties);
                pairs.forEach(pair => {
                    const [key, property] = pair;
                    var text = this._getValueFromJSON(key,
                        translation, true);

                    if (text) {
                        element[property] = text;
                        element.setAttribute(property, text);
                    } else {
                        console.error(
                            `Could not find text for attribute "${key}".`
                        );
                    }
                });
            }
        };

        this._elements.forEach(replace);
    }

    get defaultConfig() {
        return {
            persist: false,
            languages: ["en"],
            defaultLanguage: "",
            detectLanguage: true,
        };
    }
}

// i18n, ref: https://codesandbox.io/s/ipfeu
var translator = new Translator({
    persist: false,
    languages: ["zh", "en"],
    defaultLanguage: "zh",
    detectLanguage: true
});

translator.load();

document.querySelector("form")
    .addEventListener("click", function(evt) {
        if (evt.target.tagName === "INPUT") {
            translator.load(evt.target.value);
        }
    });

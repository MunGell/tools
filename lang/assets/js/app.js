(function ($) {
    var apiKey = 'trnsl.1.1.20160221T162750Z.0a88df843fdc8658.bb8268f4125cd4776343638e7b73facf95de6806',
        apiBase = 'https://translate.yandex.net/api/v1.5/tr.json/';

    var templates = {
        translationListItem: function (values) {
            return '<li class="list-group-item word"><h4 class="list-group-item-heading word__origin">' + values.original + '</h4> <p class="list-group-item-text word__translation">' + values.translation + '</p> </li>';
        }
    };

    var apiRequest = function (uri, callback) {
            var query = apiBase + uri;
            $.get(query, callback);
        },
        apiGetLangs = function (callback, ui) {
            ui = ui || 'en';

            var params = {
                    key: apiKey,
                    ui: ui
                },
                uri = 'getLangs?' + $.param(params);

            apiRequest(uri, callback);
        },
        apiTranslate = function (callback, text, lang) {
            var params = {
                    key: apiKey,
                    text: text,
                    lang: lang
                },
                uri = 'translate?' + $.param(params);

            apiRequest(uri, callback);
        };

    var showTranslation = function (original, texts) {
        $('#js-translation').html(texts.join('<br>'));
        $('#js-original').html(original);
    };

    var storage = {
        getItem: function (key, defaultValue) {
            defaultValue = defaultValue || '{}';
            return localStorage.getItem(key) || defaultValue;
        },
        setItem: function (key, value) {
            value = typeof value === 'object' ? JSON.stringify(value) : value;
            return localStorage.setItem(key, value);
        },
        removeItem: function (key) {
            return localStorage.removeItem(key);
        },
        getJson: function (key) {
            return JSON.parse(this.getItem(key, '{}'));
        },
        appendJSONObject: function (key, objectKey, value) {
            var json = this.getJson(key);
            json[objectKey] = value;
            this.setItem(key, json);
        }
    };

    var saveTranslation = function (original, translation) {
            storage.appendJSONObject('translations', original, translation);
        },
        getTranslations = function () {
            return storage.getJson('translations');
        };

    $(document).ready(function () {

        (function () {
            var translations = getTranslations(),
                list = $('#js-list');

            list.html('');

            for (var original in translations) {
                list.append(templates.translationListItem({
                    original: original,
                    translation: translations[original]
                }));
            }
        })();

        $('#action-go').click(function (e) {
            e.preventDefault();
            var original = $('#word-input').val();
            apiTranslate(function (data) {
                showTranslation(original, data.text);
            }, original, 'en-ru');
        });
        $('#action-add').click(function (e) {
            e.preventDefault();
            var original = $('#js-original').html(),
                translation = $('#js-translation').html(),
                list = $('#js-list');
            saveTranslation(original, translation);
            list.append(templates.translationListItem({
                original: original,
                translation: translation
            }));
        });
    });
})(jQuery);

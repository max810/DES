jQuery(function () {
    $('#status-value').text('Ready');
    $('#text-input').on('input', onEncodeUpdate);
    $('#enc-text-input').on('input', onDecodeUpdate);
    $('#key-input').on('input', function () {
        onEncodeUpdate();
        onDecodeUpdate();
        setCookie('key', $('#key-input').val());
    });
    $('#transferInputButton').on('click', onTransferClick);
    let x = getCookie('text');
    let y = getCookie('key');
    if (x) {
        $('#text-input').val(x);

    }
    if (y) {
        $('#key-input').val(y);
    }
    if (x && y) {
        onEncodeUpdate();
        onTransferClick();
    }
});

function onEncodeUpdate() {
    let text = $('#text-input').val();
    let key = $('#key-input').val();
    if (key && text) {
        let result = runDESEncode(text, key);
        $('#text-output').val(result);
    }
    if (!text) {
        $('#text-output').val('');
    }
    setCookie('text', text);
}

function onDecodeUpdate() {
    let textInput = $('#enc-text-input').val();
    textInput = "[" + textInput + "]";
    let charCodes = JSON.parse(textInput);
    let key = $('#key-input').val();
    if (key && charCodes.length) {
        let result = runDESDecode(charCodes, key);
        $('#enc-text-output').val(result);
    }
    if (!charCodes) {
        $('#enc-text-output').val('');
    }
}

function onTransferClick() {
    $('#enc-text-input').val($('#text-output').val());
    onDecodeUpdate();
}

//------------------------------------------------------------------

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}
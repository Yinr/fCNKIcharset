function listener(details) {
    const FILENAME_REGEXP = /^attachment; ?[fF]ile[nN]ame=(.+)$/;
    const TRIM_QUOTES_REGEXP = /^"(.+?)";?$/;

    for (var i = 0; i < details.responseHeaders.length; i++) {
        if (details.responseHeaders[i].name === 'Content-Disposition') {
            let filename = details.responseHeaders[i].value
                            .match(FILENAME_REGEXP)[1]
                            .replace(TRIM_QUOTES_REGEXP, '$1');

            // encode the spaces, because Firefox will truncate it
            // from the first space, and don't think is a bug, see
            // https://bugzilla.mozilla.org/show_bug.cgi?id=221028
            filename = filename.replace(/ /g, '%20');

            newHeader = "attachment; filename*=GB18030''" + filename;

            details.responseHeaders[i].value = newHeader;
            break;
        }
    }

    return details;
}

browser.webRequest.onHeadersReceived.addListener(
    listener, {
        urls: ["*://*.cnki.net/*"], types: ["main_frame"]
    }, ["blocking", "responseHeaders"]
);

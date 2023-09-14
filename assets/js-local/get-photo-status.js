function checkStatus() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/photo-status', false);
        xhr.send();
        if (xhr.status != 200) {
            return null;
        } else {
            return xhr.response;
        }
    } catch(err) { // instead of onerror
        return null;
    }
}

document.addEventListener('readystatechange', async event => {
    switch (document.readyState) {
        case "complete":
            var response = checkStatus();
            while (response == "UPLOADED") {
                const delay = (ms) => new Promise((response) => setTimeout(response, ms));
                await delay(checkStatusDelay);
                response = checkStatus();
                if (response == null) {
                    response = '/500';
                }
            }
            window.location.href = response;
    }
});
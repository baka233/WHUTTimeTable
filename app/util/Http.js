
export function fetchPost(url, header, data) {
    var formData = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formData.push(encodedKey + "=" + encodedValue);
    }
    formData = formData.join("&");

    console.log(data);
    
    return fetch(url, {
        method : "POST",
        headers: header,
        body : formData
    })
}

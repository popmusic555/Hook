
var HttpClient = {};

HttpClient.request = function (url , callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            // console.log(response);
            callback(HttpClient.formatResp(response) , url);
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
};

HttpClient.req = function (action , params , callback) {
    HttpClient.requestForAction(Global.Common.Const.URL , action , params , callback)
}

HttpClient.requestForAction = function (path , action , params , callback) {
    var url = HttpClient.toUrl(path , action , params);
    HttpClient.request(url , callback);
}

HttpClient.toUrl = function (path , action , params) {
    path = HttpClient.addAction(path , action);
    for(var key in params){
        var value = params[key];
        path = HttpClient.addParam(path , key , value);
    }
    return path;
}

HttpClient.addAction = function (path , action) {
    return path + "?" + "method" + "=" + action;
}

HttpClient.addParam = function (path , key , value) {
    return path + "&" + key + "=" + value;
}

HttpClient.formatResp = function (resp) {
    var datas = resp.split(",");
    return datas;
}

module.exports = HttpClient;
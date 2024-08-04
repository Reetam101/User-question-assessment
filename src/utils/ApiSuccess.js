class ApiSuccess {
  constructor(res, statusCode, message, data, tokens, url) {
    let respObj = {};
    respObj.code = statusCode || 200;
    respObj.message = message || "success";
    respObj.isSuccess = true;
    respObj.data = data || {};
    if (url) respObj.url = url;
    if (tokens) {
      respObj.accessToken = tokens.access.token;
      respObj.refreshToken = tokens.refresh.token;
    }
    console.log(respObj);
    res.status(statusCode || 200).json(respObj);
  }
}

module.exports = ApiSuccess;

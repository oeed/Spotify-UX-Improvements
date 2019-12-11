const TEN_PER_SECOND_FOR_A_YEAR = 31536e4,
  COSMOS_VERBS = ["GET", "HEAD", "POST", "PUT", "SUB", "PATCH", "DELETE"],
  ERROR_PREFIX = "bridge.cosmosRequest: ";

export function cosmosRequest(e: any, t: any, o: any, r: any) {
  if (o.url) throw new Error(`${ERROR_PREFIX}"url" is not a valid option, did you mean "uri"?`);
  if ("string" != typeof o.uri) throw new Error(`${ERROR_PREFIX}Expected uri to be string.`);
  if (-1 === COSMOS_VERBS.indexOf(o.method)) throw new Error(`${ERROR_PREFIX}Method must match valid verb in uppercase (GET, POST etc)`);
  if (o.body && "string" != typeof o.body) throw new Error(`${ERROR_PREFIX}If body is provided it should be a string.`);
  if (o.headers && "[object Object]" !== Object.prototype.toString.call(o.headers)) throw new Error(`${ERROR_PREFIX}Expected headers be a plain object.`);
  const s: any = {
    action: o.method,
    uri: o.uri
  };
  o.body && (s.body = o.body), o.headers && (s.headers = o.headers), e.requestIDCounter = e.requestIDCounter || TEN_PER_SECOND_FOR_A_YEAR, e.requestIDCounter++;
  const n = [e.requestIDCounter, s];
  let u = !1;
  const i = e.requestIDCounter;

  return function e(s, i) {
      t(s ? "cosmos_request_create" : "cosmos_request_pull", n, function(s: any, n: any) {
        if (!u) try {
          r && (s ? r(s) : r(null, n))
        } finally {
          "SUB" !== o.method ? t("cosmos_request_cancel", [i]) : u || e(!1, i)
        }
      })
    }(!0, i),
    function() {
      u = !0, t("cosmos_request_cancel", [i])
    }
}
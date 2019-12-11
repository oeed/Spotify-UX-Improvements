import { cosmosRequest } from "./cosmos";
import _debug from "./debug";
// import { defer } from "./spotify-defer";

const debug = _debug("bridge")
  // defer =  // require("spotify-deferred"),

// import { defer } from "shared/spotify/spotify-defer";

let scheduledCoreFlush: any = !1
let cosmosState: any = null

export function cosmos() {
  cosmosState || (cosmosState = {});
  const e = [cosmosState, request];
  return cosmosRequest.apply(null, e.concat(Array.prototype.slice.call(arguments)))
}

function _createCallbackWrapper(e: any) {
  return function(t: any, s: any) {
    let r = t;
    if (r) e(r, s);
    else {
      if (s && !s.body && s.status >= 400) return r = new Error(`${s.uri} responded with status ${s.status}`), void e(r, s);
      let t;
      try {
        t = JSON.parse(s.body)
      } catch (t) {
        return t.message = `Failed to parse cosmos response: ${t.message}`, void e(t)
      }
      e(null, t)
    }
  }
}

export function cosmosJSON(e: any, t: any) {
  return e.body && (e.body = JSON.stringify(e.body)), (cosmos as any)(e, t ? _createCallbackWrapper(t) : null)
}

export function request(e: any, t?: any, s?: any) {
  const r = t || [],
    o = getCallback(e, r, s);

  debug(`req:${e}`, r)
  
  _request(e, r, o)
  return
  // e.endsWith("_metadata") && !scheduledCoreFlush && (scheduledCoreFlush = !0, defer(flushCore))
}

function _request(e: any, t: any, s: any) {
  const bridgeModule = window && "function" == typeof (window as any)._getSpotifyModule && (window as any)._getSpotifyModule("bridge")

  console.log("cos rewq", bridgeModule)
  const obja = JSON.stringify({
    name: e,
    args: t
  })
  const objb =  {
    onSuccess: getSuccessHandler(s),
    onFailure: getFailureHandler(s, e, t)
  }
  
  // console.log("cos done", bridgeModule)
  // return
  bridgeModule.executeRequest(obja, objb)
}

function getCallback(e: any, t: any, s: any) {
  const r = s || function() {};
  return function(s: any, o: any) {
    if (s && "timeout" === s.name) {
      const o = 300 + Math.floor(100 * Math.random());
      return debug("timeout", s.message), void setTimeout(function() {
        request(e, t, r)
      }, o)
    }
    debug(`res:${e}`, t, o), r(s, o)
  }
}

function getSuccessHandler(e: any) {
  return function(t: any) {
    let s;
    debug("success", t);
    try {
      s = JSON.parse(t)
    } catch (t) {
      e(t)
    }
    s && e(null, s)
  }
}

function getFailureHandler(e: any, t: any, s: any) {
  return function(r: any) {
    let o;
    debug("failure", r);
    try {
      o = JSON.parse(r)
    } catch (t) {
      r instanceof Error ? e(r) : (t.message += `\nResponse Data: ${r}`, e(t))
    }
    o && e(createError(t, s, o))
  }
}

function createError(e: any, t: any, s: any) {
  const r = ` (bridge message: '${e}', args: ${JSON.stringify(t)})`,
    o = s.message + r,
    u = new Error(o);
  return u.name = s.error, u
}

function flushCore() {
  scheduledCoreFlush = !1, request("core_flush")
}

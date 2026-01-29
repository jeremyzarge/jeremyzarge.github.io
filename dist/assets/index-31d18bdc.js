(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();function jy(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var up={exports:{}},pl={},cp={exports:{}},G={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ws=Symbol.for("react.element"),zy=Symbol.for("react.portal"),Wy=Symbol.for("react.fragment"),By=Symbol.for("react.strict_mode"),Vy=Symbol.for("react.profiler"),$y=Symbol.for("react.provider"),Hy=Symbol.for("react.context"),Gy=Symbol.for("react.forward_ref"),Ky=Symbol.for("react.suspense"),Qy=Symbol.for("react.memo"),Yy=Symbol.for("react.lazy"),Bd=Symbol.iterator;function qy(t){return t===null||typeof t!="object"?null:(t=Bd&&t[Bd]||t["@@iterator"],typeof t=="function"?t:null)}var dp={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},hp=Object.assign,fp={};function ri(t,e,n){this.props=t,this.context=e,this.refs=fp,this.updater=n||dp}ri.prototype.isReactComponent={};ri.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};ri.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function pp(){}pp.prototype=ri.prototype;function Yu(t,e,n){this.props=t,this.context=e,this.refs=fp,this.updater=n||dp}var qu=Yu.prototype=new pp;qu.constructor=Yu;hp(qu,ri.prototype);qu.isPureReactComponent=!0;var Vd=Array.isArray,gp=Object.prototype.hasOwnProperty,Xu={current:null},mp={key:!0,ref:!0,__self:!0,__source:!0};function _p(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)gp.call(e,r)&&!mp.hasOwnProperty(r)&&(i[r]=e[r]);var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){for(var a=Array(l),u=0;u<l;u++)a[u]=arguments[u+2];i.children=a}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)i[r]===void 0&&(i[r]=l[r]);return{$$typeof:ws,type:t,key:s,ref:o,props:i,_owner:Xu.current}}function Xy(t,e){return{$$typeof:ws,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Ju(t){return typeof t=="object"&&t!==null&&t.$$typeof===ws}function Jy(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var $d=/\/+/g;function Gl(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Jy(""+t.key):e.toString(36)}function ro(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case ws:case zy:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+Gl(o,0):r,Vd(i)?(n="",t!=null&&(n=t.replace($d,"$&/")+"/"),ro(i,e,n,"",function(u){return u})):i!=null&&(Ju(i)&&(i=Xy(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace($d,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",Vd(t))for(var l=0;l<t.length;l++){s=t[l];var a=r+Gl(s,l);o+=ro(s,e,n,a,i)}else if(a=qy(t),typeof a=="function")for(t=a.call(t),l=0;!(s=t.next()).done;)s=s.value,a=r+Gl(s,l++),o+=ro(s,e,n,a,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Fs(t,e,n){if(t==null)return t;var r=[],i=0;return ro(t,r,"","",function(s){return e.call(n,s,i++)}),r}function Zy(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Ue={current:null},io={transition:null},ev={ReactCurrentDispatcher:Ue,ReactCurrentBatchConfig:io,ReactCurrentOwner:Xu};function yp(){throw Error("act(...) is not supported in production builds of React.")}G.Children={map:Fs,forEach:function(t,e,n){Fs(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Fs(t,function(){e++}),e},toArray:function(t){return Fs(t,function(e){return e})||[]},only:function(t){if(!Ju(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};G.Component=ri;G.Fragment=Wy;G.Profiler=Vy;G.PureComponent=Yu;G.StrictMode=By;G.Suspense=Ky;G.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ev;G.act=yp;G.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=hp({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Xu.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(a in e)gp.call(e,a)&&!mp.hasOwnProperty(a)&&(r[a]=e[a]===void 0&&l!==void 0?l[a]:e[a])}var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){l=Array(a);for(var u=0;u<a;u++)l[u]=arguments[u+2];r.children=l}return{$$typeof:ws,type:t.type,key:i,ref:s,props:r,_owner:o}};G.createContext=function(t){return t={$$typeof:Hy,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:$y,_context:t},t.Consumer=t};G.createElement=_p;G.createFactory=function(t){var e=_p.bind(null,t);return e.type=t,e};G.createRef=function(){return{current:null}};G.forwardRef=function(t){return{$$typeof:Gy,render:t}};G.isValidElement=Ju;G.lazy=function(t){return{$$typeof:Yy,_payload:{_status:-1,_result:t},_init:Zy}};G.memo=function(t,e){return{$$typeof:Qy,type:t,compare:e===void 0?null:e}};G.startTransition=function(t){var e=io.transition;io.transition={};try{t()}finally{io.transition=e}};G.unstable_act=yp;G.useCallback=function(t,e){return Ue.current.useCallback(t,e)};G.useContext=function(t){return Ue.current.useContext(t)};G.useDebugValue=function(){};G.useDeferredValue=function(t){return Ue.current.useDeferredValue(t)};G.useEffect=function(t,e){return Ue.current.useEffect(t,e)};G.useId=function(){return Ue.current.useId()};G.useImperativeHandle=function(t,e,n){return Ue.current.useImperativeHandle(t,e,n)};G.useInsertionEffect=function(t,e){return Ue.current.useInsertionEffect(t,e)};G.useLayoutEffect=function(t,e){return Ue.current.useLayoutEffect(t,e)};G.useMemo=function(t,e){return Ue.current.useMemo(t,e)};G.useReducer=function(t,e,n){return Ue.current.useReducer(t,e,n)};G.useRef=function(t){return Ue.current.useRef(t)};G.useState=function(t){return Ue.current.useState(t)};G.useSyncExternalStore=function(t,e,n){return Ue.current.useSyncExternalStore(t,e,n)};G.useTransition=function(){return Ue.current.useTransition()};G.version="18.3.1";cp.exports=G;var D=cp.exports;const tv=jy(D);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nv=D,rv=Symbol.for("react.element"),iv=Symbol.for("react.fragment"),sv=Object.prototype.hasOwnProperty,ov=nv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,lv={key:!0,ref:!0,__self:!0,__source:!0};function vp(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)sv.call(e,r)&&!lv.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:rv,type:t,key:s,ref:o,props:i,_owner:ov.current}}pl.Fragment=iv;pl.jsx=vp;pl.jsxs=vp;up.exports=pl;var p=up.exports,Aa={},wp={exports:{}},qe={},Sp={exports:{}},Cp={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(O,S){var I=O.length;O.push(S);e:for(;0<I;){var R=I-1>>>1,U=O[R];if(0<i(U,S))O[R]=S,O[I]=U,I=R;else break e}}function n(O){return O.length===0?null:O[0]}function r(O){if(O.length===0)return null;var S=O[0],I=O.pop();if(I!==S){O[0]=I;e:for(var R=0,U=O.length,Je=U>>>1;R<Je;){var Ot=2*(R+1)-1,cr=O[Ot],Dt=Ot+1,Et=O[Dt];if(0>i(cr,I))Dt<U&&0>i(Et,cr)?(O[R]=Et,O[Dt]=I,R=Dt):(O[R]=cr,O[Ot]=I,R=Ot);else if(Dt<U&&0>i(Et,I))O[R]=Et,O[Dt]=I,R=Dt;else break e}}return S}function i(O,S){var I=O.sortIndex-S.sortIndex;return I!==0?I:O.id-S.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var a=[],u=[],h=1,d=null,c=3,_=!1,y=!1,v=!1,M=typeof setTimeout=="function"?setTimeout:null,g=typeof clearTimeout=="function"?clearTimeout:null,f=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function m(O){for(var S=n(u);S!==null;){if(S.callback===null)r(u);else if(S.startTime<=O)r(u),S.sortIndex=S.expirationTime,e(a,S);else break;S=n(u)}}function w(O){if(v=!1,m(O),!y)if(n(a)!==null)y=!0,Ct(P);else{var S=n(u);S!==null&&pi(w,S.startTime-O)}}function P(O,S){y=!1,v&&(v=!1,g(T),T=-1),_=!0;var I=c;try{for(m(S),d=n(a);d!==null&&(!(d.expirationTime>S)||O&&!B());){var R=d.callback;if(typeof R=="function"){d.callback=null,c=d.priorityLevel;var U=R(d.expirationTime<=S);S=t.unstable_now(),typeof U=="function"?d.callback=U:d===n(a)&&r(a),m(S)}else r(a);d=n(a)}if(d!==null)var Je=!0;else{var Ot=n(u);Ot!==null&&pi(w,Ot.startTime-S),Je=!1}return Je}finally{d=null,c=I,_=!1}}var k=!1,N=null,T=-1,C=5,A=-1;function B(){return!(t.unstable_now()-A<C)}function b(){if(N!==null){var O=t.unstable_now();A=O;var S=!0;try{S=N(!0,O)}finally{S?W():(k=!1,N=null)}}else k=!1}var W;if(typeof f=="function")W=function(){f(b)};else if(typeof MessageChannel<"u"){var F=new MessageChannel,he=F.port2;F.port1.onmessage=b,W=function(){he.postMessage(null)}}else W=function(){M(b,0)};function Ct(O){N=O,k||(k=!0,W())}function pi(O,S){T=M(function(){O(t.unstable_now())},S)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(O){O.callback=null},t.unstable_continueExecution=function(){y||_||(y=!0,Ct(P))},t.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<O?Math.floor(1e3/O):5},t.unstable_getCurrentPriorityLevel=function(){return c},t.unstable_getFirstCallbackNode=function(){return n(a)},t.unstable_next=function(O){switch(c){case 1:case 2:case 3:var S=3;break;default:S=c}var I=c;c=S;try{return O()}finally{c=I}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(O,S){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var I=c;c=O;try{return S()}finally{c=I}},t.unstable_scheduleCallback=function(O,S,I){var R=t.unstable_now();switch(typeof I=="object"&&I!==null?(I=I.delay,I=typeof I=="number"&&0<I?R+I:R):I=R,O){case 1:var U=-1;break;case 2:U=250;break;case 5:U=1073741823;break;case 4:U=1e4;break;default:U=5e3}return U=I+U,O={id:h++,callback:S,priorityLevel:O,startTime:I,expirationTime:U,sortIndex:-1},I>R?(O.sortIndex=I,e(u,O),n(a)===null&&O===n(u)&&(v?(g(T),T=-1):v=!0,pi(w,I-R))):(O.sortIndex=U,e(a,O),y||_||(y=!0,Ct(P))),O},t.unstable_shouldYield=B,t.unstable_wrapCallback=function(O){var S=c;return function(){var I=c;c=S;try{return O.apply(this,arguments)}finally{c=I}}}})(Cp);Sp.exports=Cp;var av=Sp.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var uv=D,Ye=av;function E(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Ep=new Set,Ki={};function or(t,e){Wr(t,e),Wr(t+"Capture",e)}function Wr(t,e){for(Ki[t]=e,t=0;t<e.length;t++)Ep.add(e[t])}var Ht=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Oa=Object.prototype.hasOwnProperty,cv=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Hd={},Gd={};function dv(t){return Oa.call(Gd,t)?!0:Oa.call(Hd,t)?!1:cv.test(t)?Gd[t]=!0:(Hd[t]=!0,!1)}function hv(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function fv(t,e,n,r){if(e===null||typeof e>"u"||hv(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function je(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Te={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Te[t]=new je(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Te[e]=new je(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Te[t]=new je(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Te[t]=new je(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Te[t]=new je(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Te[t]=new je(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Te[t]=new je(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Te[t]=new je(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Te[t]=new je(t,5,!1,t.toLowerCase(),null,!1,!1)});var Zu=/[\-:]([a-z])/g;function ec(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Zu,ec);Te[e]=new je(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Zu,ec);Te[e]=new je(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Zu,ec);Te[e]=new je(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Te[t]=new je(t,1,!1,t.toLowerCase(),null,!1,!1)});Te.xlinkHref=new je("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Te[t]=new je(t,1,!1,t.toLowerCase(),null,!0,!0)});function tc(t,e,n,r){var i=Te.hasOwnProperty(e)?Te[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(fv(e,n,i,r)&&(n=null),r||i===null?dv(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var Jt=uv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Us=Symbol.for("react.element"),gr=Symbol.for("react.portal"),mr=Symbol.for("react.fragment"),nc=Symbol.for("react.strict_mode"),Da=Symbol.for("react.profiler"),kp=Symbol.for("react.provider"),Ip=Symbol.for("react.context"),rc=Symbol.for("react.forward_ref"),Ma=Symbol.for("react.suspense"),La=Symbol.for("react.suspense_list"),ic=Symbol.for("react.memo"),tn=Symbol.for("react.lazy"),xp=Symbol.for("react.offscreen"),Kd=Symbol.iterator;function mi(t){return t===null||typeof t!="object"?null:(t=Kd&&t[Kd]||t["@@iterator"],typeof t=="function"?t:null)}var ae=Object.assign,Kl;function Ni(t){if(Kl===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Kl=e&&e[1]||""}return`
`+Kl+t}var Ql=!1;function Yl(t,e){if(!t||Ql)return"";Ql=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var r=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){r=u}t.call(e.prototype)}else{try{throw Error()}catch(u){r=u}t()}}catch(u){if(u&&r&&typeof u.stack=="string"){for(var i=u.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,l=s.length-1;1<=o&&0<=l&&i[o]!==s[l];)l--;for(;1<=o&&0<=l;o--,l--)if(i[o]!==s[l]){if(o!==1||l!==1)do if(o--,l--,0>l||i[o]!==s[l]){var a=`
`+i[o].replace(" at new "," at ");return t.displayName&&a.includes("<anonymous>")&&(a=a.replace("<anonymous>",t.displayName)),a}while(1<=o&&0<=l);break}}}finally{Ql=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Ni(t):""}function pv(t){switch(t.tag){case 5:return Ni(t.type);case 16:return Ni("Lazy");case 13:return Ni("Suspense");case 19:return Ni("SuspenseList");case 0:case 2:case 15:return t=Yl(t.type,!1),t;case 11:return t=Yl(t.type.render,!1),t;case 1:return t=Yl(t.type,!0),t;default:return""}}function Fa(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case mr:return"Fragment";case gr:return"Portal";case Da:return"Profiler";case nc:return"StrictMode";case Ma:return"Suspense";case La:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Ip:return(t.displayName||"Context")+".Consumer";case kp:return(t._context.displayName||"Context")+".Provider";case rc:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case ic:return e=t.displayName||null,e!==null?e:Fa(t.type)||"Memo";case tn:e=t._payload,t=t._init;try{return Fa(t(e))}catch{}}return null}function gv(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Fa(e);case 8:return e===nc?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function xn(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Tp(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function mv(t){var e=Tp(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function js(t){t._valueTracker||(t._valueTracker=mv(t))}function Np(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=Tp(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function wo(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Ua(t,e){var n=e.checked;return ae({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Qd(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=xn(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Rp(t,e){e=e.checked,e!=null&&tc(t,"checked",e,!1)}function ja(t,e){Rp(t,e);var n=xn(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?za(t,e.type,n):e.hasOwnProperty("defaultValue")&&za(t,e.type,xn(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Yd(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function za(t,e,n){(e!=="number"||wo(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Ri=Array.isArray;function Nr(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+xn(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function Wa(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(E(91));return ae({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function qd(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(E(92));if(Ri(n)){if(1<n.length)throw Error(E(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:xn(n)}}function Pp(t,e){var n=xn(e.value),r=xn(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function Xd(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function bp(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ba(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?bp(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var zs,Ap=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(zs=zs||document.createElement("div"),zs.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=zs.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Qi(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ai={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},_v=["Webkit","ms","Moz","O"];Object.keys(Ai).forEach(function(t){_v.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ai[e]=Ai[t]})});function Op(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ai.hasOwnProperty(t)&&Ai[t]?(""+e).trim():e+"px"}function Dp(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=Op(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var yv=ae({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Va(t,e){if(e){if(yv[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(E(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(E(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(E(61))}if(e.style!=null&&typeof e.style!="object")throw Error(E(62))}}function $a(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ha=null;function sc(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Ga=null,Rr=null,Pr=null;function Jd(t){if(t=Es(t)){if(typeof Ga!="function")throw Error(E(280));var e=t.stateNode;e&&(e=vl(e),Ga(t.stateNode,t.type,e))}}function Mp(t){Rr?Pr?Pr.push(t):Pr=[t]:Rr=t}function Lp(){if(Rr){var t=Rr,e=Pr;if(Pr=Rr=null,Jd(t),e)for(t=0;t<e.length;t++)Jd(e[t])}}function Fp(t,e){return t(e)}function Up(){}var ql=!1;function jp(t,e,n){if(ql)return t(e,n);ql=!0;try{return Fp(t,e,n)}finally{ql=!1,(Rr!==null||Pr!==null)&&(Up(),Lp())}}function Yi(t,e){var n=t.stateNode;if(n===null)return null;var r=vl(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(E(231,e,typeof n));return n}var Ka=!1;if(Ht)try{var _i={};Object.defineProperty(_i,"passive",{get:function(){Ka=!0}}),window.addEventListener("test",_i,_i),window.removeEventListener("test",_i,_i)}catch{Ka=!1}function vv(t,e,n,r,i,s,o,l,a){var u=Array.prototype.slice.call(arguments,3);try{e.apply(n,u)}catch(h){this.onError(h)}}var Oi=!1,So=null,Co=!1,Qa=null,wv={onError:function(t){Oi=!0,So=t}};function Sv(t,e,n,r,i,s,o,l,a){Oi=!1,So=null,vv.apply(wv,arguments)}function Cv(t,e,n,r,i,s,o,l,a){if(Sv.apply(this,arguments),Oi){if(Oi){var u=So;Oi=!1,So=null}else throw Error(E(198));Co||(Co=!0,Qa=u)}}function lr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function zp(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Zd(t){if(lr(t)!==t)throw Error(E(188))}function Ev(t){var e=t.alternate;if(!e){if(e=lr(t),e===null)throw Error(E(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return Zd(i),t;if(s===r)return Zd(i),e;s=s.sibling}throw Error(E(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,l=i.child;l;){if(l===n){o=!0,n=i,r=s;break}if(l===r){o=!0,r=i,n=s;break}l=l.sibling}if(!o){for(l=s.child;l;){if(l===n){o=!0,n=s,r=i;break}if(l===r){o=!0,r=s,n=i;break}l=l.sibling}if(!o)throw Error(E(189))}}if(n.alternate!==r)throw Error(E(190))}if(n.tag!==3)throw Error(E(188));return n.stateNode.current===n?t:e}function Wp(t){return t=Ev(t),t!==null?Bp(t):null}function Bp(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Bp(t);if(e!==null)return e;t=t.sibling}return null}var Vp=Ye.unstable_scheduleCallback,eh=Ye.unstable_cancelCallback,kv=Ye.unstable_shouldYield,Iv=Ye.unstable_requestPaint,fe=Ye.unstable_now,xv=Ye.unstable_getCurrentPriorityLevel,oc=Ye.unstable_ImmediatePriority,$p=Ye.unstable_UserBlockingPriority,Eo=Ye.unstable_NormalPriority,Tv=Ye.unstable_LowPriority,Hp=Ye.unstable_IdlePriority,gl=null,Tt=null;function Nv(t){if(Tt&&typeof Tt.onCommitFiberRoot=="function")try{Tt.onCommitFiberRoot(gl,t,void 0,(t.current.flags&128)===128)}catch{}}var mt=Math.clz32?Math.clz32:bv,Rv=Math.log,Pv=Math.LN2;function bv(t){return t>>>=0,t===0?32:31-(Rv(t)/Pv|0)|0}var Ws=64,Bs=4194304;function Pi(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function ko(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~i;l!==0?r=Pi(l):(s&=o,s!==0&&(r=Pi(s)))}else o=n&~i,o!==0?r=Pi(o):s!==0&&(r=Pi(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-mt(e),i=1<<n,r|=t[n],e&=~i;return r}function Av(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ov(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-mt(s),l=1<<o,a=i[o];a===-1?(!(l&n)||l&r)&&(i[o]=Av(l,e)):a<=e&&(t.expiredLanes|=l),s&=~l}}function Ya(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Gp(){var t=Ws;return Ws<<=1,!(Ws&4194240)&&(Ws=64),t}function Xl(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ss(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-mt(e),t[e]=n}function Dv(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-mt(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function lc(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-mt(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var X=0;function Kp(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Qp,ac,Yp,qp,Xp,qa=!1,Vs=[],hn=null,fn=null,pn=null,qi=new Map,Xi=new Map,rn=[],Mv="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function th(t,e){switch(t){case"focusin":case"focusout":hn=null;break;case"dragenter":case"dragleave":fn=null;break;case"mouseover":case"mouseout":pn=null;break;case"pointerover":case"pointerout":qi.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Xi.delete(e.pointerId)}}function yi(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=Es(e),e!==null&&ac(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function Lv(t,e,n,r,i){switch(e){case"focusin":return hn=yi(hn,t,e,n,r,i),!0;case"dragenter":return fn=yi(fn,t,e,n,r,i),!0;case"mouseover":return pn=yi(pn,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return qi.set(s,yi(qi.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Xi.set(s,yi(Xi.get(s)||null,t,e,n,r,i)),!0}return!1}function Jp(t){var e=zn(t.target);if(e!==null){var n=lr(e);if(n!==null){if(e=n.tag,e===13){if(e=zp(n),e!==null){t.blockedOn=e,Xp(t.priority,function(){Yp(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function so(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Xa(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);Ha=r,n.target.dispatchEvent(r),Ha=null}else return e=Es(n),e!==null&&ac(e),t.blockedOn=n,!1;e.shift()}return!0}function nh(t,e,n){so(t)&&n.delete(e)}function Fv(){qa=!1,hn!==null&&so(hn)&&(hn=null),fn!==null&&so(fn)&&(fn=null),pn!==null&&so(pn)&&(pn=null),qi.forEach(nh),Xi.forEach(nh)}function vi(t,e){t.blockedOn===e&&(t.blockedOn=null,qa||(qa=!0,Ye.unstable_scheduleCallback(Ye.unstable_NormalPriority,Fv)))}function Ji(t){function e(i){return vi(i,t)}if(0<Vs.length){vi(Vs[0],t);for(var n=1;n<Vs.length;n++){var r=Vs[n];r.blockedOn===t&&(r.blockedOn=null)}}for(hn!==null&&vi(hn,t),fn!==null&&vi(fn,t),pn!==null&&vi(pn,t),qi.forEach(e),Xi.forEach(e),n=0;n<rn.length;n++)r=rn[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<rn.length&&(n=rn[0],n.blockedOn===null);)Jp(n),n.blockedOn===null&&rn.shift()}var br=Jt.ReactCurrentBatchConfig,Io=!0;function Uv(t,e,n,r){var i=X,s=br.transition;br.transition=null;try{X=1,uc(t,e,n,r)}finally{X=i,br.transition=s}}function jv(t,e,n,r){var i=X,s=br.transition;br.transition=null;try{X=4,uc(t,e,n,r)}finally{X=i,br.transition=s}}function uc(t,e,n,r){if(Io){var i=Xa(t,e,n,r);if(i===null)la(t,e,r,xo,n),th(t,r);else if(Lv(i,t,e,n,r))r.stopPropagation();else if(th(t,r),e&4&&-1<Mv.indexOf(t)){for(;i!==null;){var s=Es(i);if(s!==null&&Qp(s),s=Xa(t,e,n,r),s===null&&la(t,e,r,xo,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else la(t,e,r,null,n)}}var xo=null;function Xa(t,e,n,r){if(xo=null,t=sc(r),t=zn(t),t!==null)if(e=lr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=zp(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return xo=t,null}function Zp(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(xv()){case oc:return 1;case $p:return 4;case Eo:case Tv:return 16;case Hp:return 536870912;default:return 16}default:return 16}}var un=null,cc=null,oo=null;function eg(){if(oo)return oo;var t,e=cc,n=e.length,r,i="value"in un?un.value:un.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return oo=i.slice(t,1<r?1-r:void 0)}function lo(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function $s(){return!0}function rh(){return!1}function Xe(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?$s:rh,this.isPropagationStopped=rh,this}return ae(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=$s)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=$s)},persist:function(){},isPersistent:$s}),e}var ii={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},dc=Xe(ii),Cs=ae({},ii,{view:0,detail:0}),zv=Xe(Cs),Jl,Zl,wi,ml=ae({},Cs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:hc,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==wi&&(wi&&t.type==="mousemove"?(Jl=t.screenX-wi.screenX,Zl=t.screenY-wi.screenY):Zl=Jl=0,wi=t),Jl)},movementY:function(t){return"movementY"in t?t.movementY:Zl}}),ih=Xe(ml),Wv=ae({},ml,{dataTransfer:0}),Bv=Xe(Wv),Vv=ae({},Cs,{relatedTarget:0}),ea=Xe(Vv),$v=ae({},ii,{animationName:0,elapsedTime:0,pseudoElement:0}),Hv=Xe($v),Gv=ae({},ii,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Kv=Xe(Gv),Qv=ae({},ii,{data:0}),sh=Xe(Qv),Yv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},qv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Xv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Jv(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Xv[t])?!!e[t]:!1}function hc(){return Jv}var Zv=ae({},Cs,{key:function(t){if(t.key){var e=Yv[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=lo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?qv[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:hc,charCode:function(t){return t.type==="keypress"?lo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?lo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),e0=Xe(Zv),t0=ae({},ml,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),oh=Xe(t0),n0=ae({},Cs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:hc}),r0=Xe(n0),i0=ae({},ii,{propertyName:0,elapsedTime:0,pseudoElement:0}),s0=Xe(i0),o0=ae({},ml,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),l0=Xe(o0),a0=[9,13,27,32],fc=Ht&&"CompositionEvent"in window,Di=null;Ht&&"documentMode"in document&&(Di=document.documentMode);var u0=Ht&&"TextEvent"in window&&!Di,tg=Ht&&(!fc||Di&&8<Di&&11>=Di),lh=String.fromCharCode(32),ah=!1;function ng(t,e){switch(t){case"keyup":return a0.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function rg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var _r=!1;function c0(t,e){switch(t){case"compositionend":return rg(e);case"keypress":return e.which!==32?null:(ah=!0,lh);case"textInput":return t=e.data,t===lh&&ah?null:t;default:return null}}function d0(t,e){if(_r)return t==="compositionend"||!fc&&ng(t,e)?(t=eg(),oo=cc=un=null,_r=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return tg&&e.locale!=="ko"?null:e.data;default:return null}}var h0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function uh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!h0[t.type]:e==="textarea"}function ig(t,e,n,r){Mp(r),e=To(e,"onChange"),0<e.length&&(n=new dc("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var Mi=null,Zi=null;function f0(t){gg(t,0)}function _l(t){var e=wr(t);if(Np(e))return t}function p0(t,e){if(t==="change")return e}var sg=!1;if(Ht){var ta;if(Ht){var na="oninput"in document;if(!na){var ch=document.createElement("div");ch.setAttribute("oninput","return;"),na=typeof ch.oninput=="function"}ta=na}else ta=!1;sg=ta&&(!document.documentMode||9<document.documentMode)}function dh(){Mi&&(Mi.detachEvent("onpropertychange",og),Zi=Mi=null)}function og(t){if(t.propertyName==="value"&&_l(Zi)){var e=[];ig(e,Zi,t,sc(t)),jp(f0,e)}}function g0(t,e,n){t==="focusin"?(dh(),Mi=e,Zi=n,Mi.attachEvent("onpropertychange",og)):t==="focusout"&&dh()}function m0(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return _l(Zi)}function _0(t,e){if(t==="click")return _l(e)}function y0(t,e){if(t==="input"||t==="change")return _l(e)}function v0(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var St=typeof Object.is=="function"?Object.is:v0;function es(t,e){if(St(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Oa.call(e,i)||!St(t[i],e[i]))return!1}return!0}function hh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function fh(t,e){var n=hh(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=hh(n)}}function lg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?lg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function ag(){for(var t=window,e=wo();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=wo(t.document)}return e}function pc(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function w0(t){var e=ag(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&lg(n.ownerDocument.documentElement,n)){if(r!==null&&pc(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=fh(n,s);var o=fh(n,r);i&&o&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var S0=Ht&&"documentMode"in document&&11>=document.documentMode,yr=null,Ja=null,Li=null,Za=!1;function ph(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Za||yr==null||yr!==wo(r)||(r=yr,"selectionStart"in r&&pc(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Li&&es(Li,r)||(Li=r,r=To(Ja,"onSelect"),0<r.length&&(e=new dc("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=yr)))}function Hs(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var vr={animationend:Hs("Animation","AnimationEnd"),animationiteration:Hs("Animation","AnimationIteration"),animationstart:Hs("Animation","AnimationStart"),transitionend:Hs("Transition","TransitionEnd")},ra={},ug={};Ht&&(ug=document.createElement("div").style,"AnimationEvent"in window||(delete vr.animationend.animation,delete vr.animationiteration.animation,delete vr.animationstart.animation),"TransitionEvent"in window||delete vr.transitionend.transition);function yl(t){if(ra[t])return ra[t];if(!vr[t])return t;var e=vr[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in ug)return ra[t]=e[n];return t}var cg=yl("animationend"),dg=yl("animationiteration"),hg=yl("animationstart"),fg=yl("transitionend"),pg=new Map,gh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function bn(t,e){pg.set(t,e),or(e,[t])}for(var ia=0;ia<gh.length;ia++){var sa=gh[ia],C0=sa.toLowerCase(),E0=sa[0].toUpperCase()+sa.slice(1);bn(C0,"on"+E0)}bn(cg,"onAnimationEnd");bn(dg,"onAnimationIteration");bn(hg,"onAnimationStart");bn("dblclick","onDoubleClick");bn("focusin","onFocus");bn("focusout","onBlur");bn(fg,"onTransitionEnd");Wr("onMouseEnter",["mouseout","mouseover"]);Wr("onMouseLeave",["mouseout","mouseover"]);Wr("onPointerEnter",["pointerout","pointerover"]);Wr("onPointerLeave",["pointerout","pointerover"]);or("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));or("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));or("onBeforeInput",["compositionend","keypress","textInput","paste"]);or("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));or("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));or("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var bi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),k0=new Set("cancel close invalid load scroll toggle".split(" ").concat(bi));function mh(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,Cv(r,e,void 0,t),t.currentTarget=null}function gg(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var l=r[o],a=l.instance,u=l.currentTarget;if(l=l.listener,a!==s&&i.isPropagationStopped())break e;mh(i,l,u),s=a}else for(o=0;o<r.length;o++){if(l=r[o],a=l.instance,u=l.currentTarget,l=l.listener,a!==s&&i.isPropagationStopped())break e;mh(i,l,u),s=a}}}if(Co)throw t=Qa,Co=!1,Qa=null,t}function re(t,e){var n=e[iu];n===void 0&&(n=e[iu]=new Set);var r=t+"__bubble";n.has(r)||(mg(e,t,2,!1),n.add(r))}function oa(t,e,n){var r=0;e&&(r|=4),mg(n,t,r,e)}var Gs="_reactListening"+Math.random().toString(36).slice(2);function ts(t){if(!t[Gs]){t[Gs]=!0,Ep.forEach(function(n){n!=="selectionchange"&&(k0.has(n)||oa(n,!1,t),oa(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Gs]||(e[Gs]=!0,oa("selectionchange",!1,e))}}function mg(t,e,n,r){switch(Zp(e)){case 1:var i=Uv;break;case 4:i=jv;break;default:i=uc}n=i.bind(null,e,n,t),i=void 0,!Ka||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function la(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var l=r.stateNode.containerInfo;if(l===i||l.nodeType===8&&l.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var a=o.tag;if((a===3||a===4)&&(a=o.stateNode.containerInfo,a===i||a.nodeType===8&&a.parentNode===i))return;o=o.return}for(;l!==null;){if(o=zn(l),o===null)return;if(a=o.tag,a===5||a===6){r=s=o;continue e}l=l.parentNode}}r=r.return}jp(function(){var u=s,h=sc(n),d=[];e:{var c=pg.get(t);if(c!==void 0){var _=dc,y=t;switch(t){case"keypress":if(lo(n)===0)break e;case"keydown":case"keyup":_=e0;break;case"focusin":y="focus",_=ea;break;case"focusout":y="blur",_=ea;break;case"beforeblur":case"afterblur":_=ea;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":_=ih;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":_=Bv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":_=r0;break;case cg:case dg:case hg:_=Hv;break;case fg:_=s0;break;case"scroll":_=zv;break;case"wheel":_=l0;break;case"copy":case"cut":case"paste":_=Kv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":_=oh}var v=(e&4)!==0,M=!v&&t==="scroll",g=v?c!==null?c+"Capture":null:c;v=[];for(var f=u,m;f!==null;){m=f;var w=m.stateNode;if(m.tag===5&&w!==null&&(m=w,g!==null&&(w=Yi(f,g),w!=null&&v.push(ns(f,w,m)))),M)break;f=f.return}0<v.length&&(c=new _(c,y,null,n,h),d.push({event:c,listeners:v}))}}if(!(e&7)){e:{if(c=t==="mouseover"||t==="pointerover",_=t==="mouseout"||t==="pointerout",c&&n!==Ha&&(y=n.relatedTarget||n.fromElement)&&(zn(y)||y[Gt]))break e;if((_||c)&&(c=h.window===h?h:(c=h.ownerDocument)?c.defaultView||c.parentWindow:window,_?(y=n.relatedTarget||n.toElement,_=u,y=y?zn(y):null,y!==null&&(M=lr(y),y!==M||y.tag!==5&&y.tag!==6)&&(y=null)):(_=null,y=u),_!==y)){if(v=ih,w="onMouseLeave",g="onMouseEnter",f="mouse",(t==="pointerout"||t==="pointerover")&&(v=oh,w="onPointerLeave",g="onPointerEnter",f="pointer"),M=_==null?c:wr(_),m=y==null?c:wr(y),c=new v(w,f+"leave",_,n,h),c.target=M,c.relatedTarget=m,w=null,zn(h)===u&&(v=new v(g,f+"enter",y,n,h),v.target=m,v.relatedTarget=M,w=v),M=w,_&&y)t:{for(v=_,g=y,f=0,m=v;m;m=dr(m))f++;for(m=0,w=g;w;w=dr(w))m++;for(;0<f-m;)v=dr(v),f--;for(;0<m-f;)g=dr(g),m--;for(;f--;){if(v===g||g!==null&&v===g.alternate)break t;v=dr(v),g=dr(g)}v=null}else v=null;_!==null&&_h(d,c,_,v,!1),y!==null&&M!==null&&_h(d,M,y,v,!0)}}e:{if(c=u?wr(u):window,_=c.nodeName&&c.nodeName.toLowerCase(),_==="select"||_==="input"&&c.type==="file")var P=p0;else if(uh(c))if(sg)P=y0;else{P=m0;var k=g0}else(_=c.nodeName)&&_.toLowerCase()==="input"&&(c.type==="checkbox"||c.type==="radio")&&(P=_0);if(P&&(P=P(t,u))){ig(d,P,n,h);break e}k&&k(t,c,u),t==="focusout"&&(k=c._wrapperState)&&k.controlled&&c.type==="number"&&za(c,"number",c.value)}switch(k=u?wr(u):window,t){case"focusin":(uh(k)||k.contentEditable==="true")&&(yr=k,Ja=u,Li=null);break;case"focusout":Li=Ja=yr=null;break;case"mousedown":Za=!0;break;case"contextmenu":case"mouseup":case"dragend":Za=!1,ph(d,n,h);break;case"selectionchange":if(S0)break;case"keydown":case"keyup":ph(d,n,h)}var N;if(fc)e:{switch(t){case"compositionstart":var T="onCompositionStart";break e;case"compositionend":T="onCompositionEnd";break e;case"compositionupdate":T="onCompositionUpdate";break e}T=void 0}else _r?ng(t,n)&&(T="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(T="onCompositionStart");T&&(tg&&n.locale!=="ko"&&(_r||T!=="onCompositionStart"?T==="onCompositionEnd"&&_r&&(N=eg()):(un=h,cc="value"in un?un.value:un.textContent,_r=!0)),k=To(u,T),0<k.length&&(T=new sh(T,t,null,n,h),d.push({event:T,listeners:k}),N?T.data=N:(N=rg(n),N!==null&&(T.data=N)))),(N=u0?c0(t,n):d0(t,n))&&(u=To(u,"onBeforeInput"),0<u.length&&(h=new sh("onBeforeInput","beforeinput",null,n,h),d.push({event:h,listeners:u}),h.data=N))}gg(d,e)})}function ns(t,e,n){return{instance:t,listener:e,currentTarget:n}}function To(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=Yi(t,n),s!=null&&r.unshift(ns(t,s,i)),s=Yi(t,e),s!=null&&r.push(ns(t,s,i))),t=t.return}return r}function dr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function _h(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var l=n,a=l.alternate,u=l.stateNode;if(a!==null&&a===r)break;l.tag===5&&u!==null&&(l=u,i?(a=Yi(n,s),a!=null&&o.unshift(ns(n,a,l))):i||(a=Yi(n,s),a!=null&&o.push(ns(n,a,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var I0=/\r\n?/g,x0=/\u0000|\uFFFD/g;function yh(t){return(typeof t=="string"?t:""+t).replace(I0,`
`).replace(x0,"")}function Ks(t,e,n){if(e=yh(e),yh(t)!==e&&n)throw Error(E(425))}function No(){}var eu=null,tu=null;function nu(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var ru=typeof setTimeout=="function"?setTimeout:void 0,T0=typeof clearTimeout=="function"?clearTimeout:void 0,vh=typeof Promise=="function"?Promise:void 0,N0=typeof queueMicrotask=="function"?queueMicrotask:typeof vh<"u"?function(t){return vh.resolve(null).then(t).catch(R0)}:ru;function R0(t){setTimeout(function(){throw t})}function aa(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),Ji(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);Ji(e)}function gn(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function wh(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var si=Math.random().toString(36).slice(2),xt="__reactFiber$"+si,rs="__reactProps$"+si,Gt="__reactContainer$"+si,iu="__reactEvents$"+si,P0="__reactListeners$"+si,b0="__reactHandles$"+si;function zn(t){var e=t[xt];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Gt]||n[xt]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=wh(t);t!==null;){if(n=t[xt])return n;t=wh(t)}return e}t=n,n=t.parentNode}return null}function Es(t){return t=t[xt]||t[Gt],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function wr(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(E(33))}function vl(t){return t[rs]||null}var su=[],Sr=-1;function An(t){return{current:t}}function ie(t){0>Sr||(t.current=su[Sr],su[Sr]=null,Sr--)}function ne(t,e){Sr++,su[Sr]=t.current,t.current=e}var Tn={},Ae=An(Tn),Ve=An(!1),Yn=Tn;function Br(t,e){var n=t.type.contextTypes;if(!n)return Tn;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function $e(t){return t=t.childContextTypes,t!=null}function Ro(){ie(Ve),ie(Ae)}function Sh(t,e,n){if(Ae.current!==Tn)throw Error(E(168));ne(Ae,e),ne(Ve,n)}function _g(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(E(108,gv(t)||"Unknown",i));return ae({},n,r)}function Po(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Tn,Yn=Ae.current,ne(Ae,t),ne(Ve,Ve.current),!0}function Ch(t,e,n){var r=t.stateNode;if(!r)throw Error(E(169));n?(t=_g(t,e,Yn),r.__reactInternalMemoizedMergedChildContext=t,ie(Ve),ie(Ae),ne(Ae,t)):ie(Ve),ne(Ve,n)}var Lt=null,wl=!1,ua=!1;function yg(t){Lt===null?Lt=[t]:Lt.push(t)}function A0(t){wl=!0,yg(t)}function On(){if(!ua&&Lt!==null){ua=!0;var t=0,e=X;try{var n=Lt;for(X=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}Lt=null,wl=!1}catch(i){throw Lt!==null&&(Lt=Lt.slice(t+1)),Vp(oc,On),i}finally{X=e,ua=!1}}return null}var Cr=[],Er=0,bo=null,Ao=0,Ze=[],et=0,qn=null,Ut=1,jt="";function Ln(t,e){Cr[Er++]=Ao,Cr[Er++]=bo,bo=t,Ao=e}function vg(t,e,n){Ze[et++]=Ut,Ze[et++]=jt,Ze[et++]=qn,qn=t;var r=Ut;t=jt;var i=32-mt(r)-1;r&=~(1<<i),n+=1;var s=32-mt(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Ut=1<<32-mt(e)+i|n<<i|r,jt=s+t}else Ut=1<<s|n<<i|r,jt=t}function gc(t){t.return!==null&&(Ln(t,1),vg(t,1,0))}function mc(t){for(;t===bo;)bo=Cr[--Er],Cr[Er]=null,Ao=Cr[--Er],Cr[Er]=null;for(;t===qn;)qn=Ze[--et],Ze[et]=null,jt=Ze[--et],Ze[et]=null,Ut=Ze[--et],Ze[et]=null}var Qe=null,Ke=null,se=!1,dt=null;function wg(t,e){var n=tt(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Eh(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Qe=t,Ke=gn(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Qe=t,Ke=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=qn!==null?{id:Ut,overflow:jt}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=tt(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Qe=t,Ke=null,!0):!1;default:return!1}}function ou(t){return(t.mode&1)!==0&&(t.flags&128)===0}function lu(t){if(se){var e=Ke;if(e){var n=e;if(!Eh(t,e)){if(ou(t))throw Error(E(418));e=gn(n.nextSibling);var r=Qe;e&&Eh(t,e)?wg(r,n):(t.flags=t.flags&-4097|2,se=!1,Qe=t)}}else{if(ou(t))throw Error(E(418));t.flags=t.flags&-4097|2,se=!1,Qe=t}}}function kh(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Qe=t}function Qs(t){if(t!==Qe)return!1;if(!se)return kh(t),se=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!nu(t.type,t.memoizedProps)),e&&(e=Ke)){if(ou(t))throw Sg(),Error(E(418));for(;e;)wg(t,e),e=gn(e.nextSibling)}if(kh(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(E(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Ke=gn(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Ke=null}}else Ke=Qe?gn(t.stateNode.nextSibling):null;return!0}function Sg(){for(var t=Ke;t;)t=gn(t.nextSibling)}function Vr(){Ke=Qe=null,se=!1}function _c(t){dt===null?dt=[t]:dt.push(t)}var O0=Jt.ReactCurrentBatchConfig;function Si(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(E(309));var r=n.stateNode}if(!r)throw Error(E(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var l=i.refs;o===null?delete l[s]:l[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(E(284));if(!n._owner)throw Error(E(290,t))}return t}function Ys(t,e){throw t=Object.prototype.toString.call(e),Error(E(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Ih(t){var e=t._init;return e(t._payload)}function Cg(t){function e(g,f){if(t){var m=g.deletions;m===null?(g.deletions=[f],g.flags|=16):m.push(f)}}function n(g,f){if(!t)return null;for(;f!==null;)e(g,f),f=f.sibling;return null}function r(g,f){for(g=new Map;f!==null;)f.key!==null?g.set(f.key,f):g.set(f.index,f),f=f.sibling;return g}function i(g,f){return g=vn(g,f),g.index=0,g.sibling=null,g}function s(g,f,m){return g.index=m,t?(m=g.alternate,m!==null?(m=m.index,m<f?(g.flags|=2,f):m):(g.flags|=2,f)):(g.flags|=1048576,f)}function o(g){return t&&g.alternate===null&&(g.flags|=2),g}function l(g,f,m,w){return f===null||f.tag!==6?(f=ma(m,g.mode,w),f.return=g,f):(f=i(f,m),f.return=g,f)}function a(g,f,m,w){var P=m.type;return P===mr?h(g,f,m.props.children,w,m.key):f!==null&&(f.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===tn&&Ih(P)===f.type)?(w=i(f,m.props),w.ref=Si(g,f,m),w.return=g,w):(w=go(m.type,m.key,m.props,null,g.mode,w),w.ref=Si(g,f,m),w.return=g,w)}function u(g,f,m,w){return f===null||f.tag!==4||f.stateNode.containerInfo!==m.containerInfo||f.stateNode.implementation!==m.implementation?(f=_a(m,g.mode,w),f.return=g,f):(f=i(f,m.children||[]),f.return=g,f)}function h(g,f,m,w,P){return f===null||f.tag!==7?(f=Gn(m,g.mode,w,P),f.return=g,f):(f=i(f,m),f.return=g,f)}function d(g,f,m){if(typeof f=="string"&&f!==""||typeof f=="number")return f=ma(""+f,g.mode,m),f.return=g,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Us:return m=go(f.type,f.key,f.props,null,g.mode,m),m.ref=Si(g,null,f),m.return=g,m;case gr:return f=_a(f,g.mode,m),f.return=g,f;case tn:var w=f._init;return d(g,w(f._payload),m)}if(Ri(f)||mi(f))return f=Gn(f,g.mode,m,null),f.return=g,f;Ys(g,f)}return null}function c(g,f,m,w){var P=f!==null?f.key:null;if(typeof m=="string"&&m!==""||typeof m=="number")return P!==null?null:l(g,f,""+m,w);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Us:return m.key===P?a(g,f,m,w):null;case gr:return m.key===P?u(g,f,m,w):null;case tn:return P=m._init,c(g,f,P(m._payload),w)}if(Ri(m)||mi(m))return P!==null?null:h(g,f,m,w,null);Ys(g,m)}return null}function _(g,f,m,w,P){if(typeof w=="string"&&w!==""||typeof w=="number")return g=g.get(m)||null,l(f,g,""+w,P);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case Us:return g=g.get(w.key===null?m:w.key)||null,a(f,g,w,P);case gr:return g=g.get(w.key===null?m:w.key)||null,u(f,g,w,P);case tn:var k=w._init;return _(g,f,m,k(w._payload),P)}if(Ri(w)||mi(w))return g=g.get(m)||null,h(f,g,w,P,null);Ys(f,w)}return null}function y(g,f,m,w){for(var P=null,k=null,N=f,T=f=0,C=null;N!==null&&T<m.length;T++){N.index>T?(C=N,N=null):C=N.sibling;var A=c(g,N,m[T],w);if(A===null){N===null&&(N=C);break}t&&N&&A.alternate===null&&e(g,N),f=s(A,f,T),k===null?P=A:k.sibling=A,k=A,N=C}if(T===m.length)return n(g,N),se&&Ln(g,T),P;if(N===null){for(;T<m.length;T++)N=d(g,m[T],w),N!==null&&(f=s(N,f,T),k===null?P=N:k.sibling=N,k=N);return se&&Ln(g,T),P}for(N=r(g,N);T<m.length;T++)C=_(N,g,T,m[T],w),C!==null&&(t&&C.alternate!==null&&N.delete(C.key===null?T:C.key),f=s(C,f,T),k===null?P=C:k.sibling=C,k=C);return t&&N.forEach(function(B){return e(g,B)}),se&&Ln(g,T),P}function v(g,f,m,w){var P=mi(m);if(typeof P!="function")throw Error(E(150));if(m=P.call(m),m==null)throw Error(E(151));for(var k=P=null,N=f,T=f=0,C=null,A=m.next();N!==null&&!A.done;T++,A=m.next()){N.index>T?(C=N,N=null):C=N.sibling;var B=c(g,N,A.value,w);if(B===null){N===null&&(N=C);break}t&&N&&B.alternate===null&&e(g,N),f=s(B,f,T),k===null?P=B:k.sibling=B,k=B,N=C}if(A.done)return n(g,N),se&&Ln(g,T),P;if(N===null){for(;!A.done;T++,A=m.next())A=d(g,A.value,w),A!==null&&(f=s(A,f,T),k===null?P=A:k.sibling=A,k=A);return se&&Ln(g,T),P}for(N=r(g,N);!A.done;T++,A=m.next())A=_(N,g,T,A.value,w),A!==null&&(t&&A.alternate!==null&&N.delete(A.key===null?T:A.key),f=s(A,f,T),k===null?P=A:k.sibling=A,k=A);return t&&N.forEach(function(b){return e(g,b)}),se&&Ln(g,T),P}function M(g,f,m,w){if(typeof m=="object"&&m!==null&&m.type===mr&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case Us:e:{for(var P=m.key,k=f;k!==null;){if(k.key===P){if(P=m.type,P===mr){if(k.tag===7){n(g,k.sibling),f=i(k,m.props.children),f.return=g,g=f;break e}}else if(k.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===tn&&Ih(P)===k.type){n(g,k.sibling),f=i(k,m.props),f.ref=Si(g,k,m),f.return=g,g=f;break e}n(g,k);break}else e(g,k);k=k.sibling}m.type===mr?(f=Gn(m.props.children,g.mode,w,m.key),f.return=g,g=f):(w=go(m.type,m.key,m.props,null,g.mode,w),w.ref=Si(g,f,m),w.return=g,g=w)}return o(g);case gr:e:{for(k=m.key;f!==null;){if(f.key===k)if(f.tag===4&&f.stateNode.containerInfo===m.containerInfo&&f.stateNode.implementation===m.implementation){n(g,f.sibling),f=i(f,m.children||[]),f.return=g,g=f;break e}else{n(g,f);break}else e(g,f);f=f.sibling}f=_a(m,g.mode,w),f.return=g,g=f}return o(g);case tn:return k=m._init,M(g,f,k(m._payload),w)}if(Ri(m))return y(g,f,m,w);if(mi(m))return v(g,f,m,w);Ys(g,m)}return typeof m=="string"&&m!==""||typeof m=="number"?(m=""+m,f!==null&&f.tag===6?(n(g,f.sibling),f=i(f,m),f.return=g,g=f):(n(g,f),f=ma(m,g.mode,w),f.return=g,g=f),o(g)):n(g,f)}return M}var $r=Cg(!0),Eg=Cg(!1),Oo=An(null),Do=null,kr=null,yc=null;function vc(){yc=kr=Do=null}function wc(t){var e=Oo.current;ie(Oo),t._currentValue=e}function au(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function Ar(t,e){Do=t,yc=kr=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(We=!0),t.firstContext=null)}function it(t){var e=t._currentValue;if(yc!==t)if(t={context:t,memoizedValue:e,next:null},kr===null){if(Do===null)throw Error(E(308));kr=t,Do.dependencies={lanes:0,firstContext:t}}else kr=kr.next=t;return e}var Wn=null;function Sc(t){Wn===null?Wn=[t]:Wn.push(t)}function kg(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,Sc(e)):(n.next=i.next,i.next=n),e.interleaved=n,Kt(t,r)}function Kt(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var nn=!1;function Cc(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Ig(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Vt(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function mn(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,Y&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,Kt(t,n)}return i=r.interleaved,i===null?(e.next=e,Sc(r)):(e.next=i.next,i.next=e),r.interleaved=e,Kt(t,n)}function ao(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,lc(t,n)}}function xh(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Mo(t,e,n,r){var i=t.updateQueue;nn=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,l=i.shared.pending;if(l!==null){i.shared.pending=null;var a=l,u=a.next;a.next=null,o===null?s=u:o.next=u,o=a;var h=t.alternate;h!==null&&(h=h.updateQueue,l=h.lastBaseUpdate,l!==o&&(l===null?h.firstBaseUpdate=u:l.next=u,h.lastBaseUpdate=a))}if(s!==null){var d=i.baseState;o=0,h=u=a=null,l=s;do{var c=l.lane,_=l.eventTime;if((r&c)===c){h!==null&&(h=h.next={eventTime:_,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var y=t,v=l;switch(c=e,_=n,v.tag){case 1:if(y=v.payload,typeof y=="function"){d=y.call(_,d,c);break e}d=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=v.payload,c=typeof y=="function"?y.call(_,d,c):y,c==null)break e;d=ae({},d,c);break e;case 2:nn=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,c=i.effects,c===null?i.effects=[l]:c.push(l))}else _={eventTime:_,lane:c,tag:l.tag,payload:l.payload,callback:l.callback,next:null},h===null?(u=h=_,a=d):h=h.next=_,o|=c;if(l=l.next,l===null){if(l=i.shared.pending,l===null)break;c=l,l=c.next,c.next=null,i.lastBaseUpdate=c,i.shared.pending=null}}while(1);if(h===null&&(a=d),i.baseState=a,i.firstBaseUpdate=u,i.lastBaseUpdate=h,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);Jn|=o,t.lanes=o,t.memoizedState=d}}function Th(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(E(191,i));i.call(r)}}}var ks={},Nt=An(ks),is=An(ks),ss=An(ks);function Bn(t){if(t===ks)throw Error(E(174));return t}function Ec(t,e){switch(ne(ss,e),ne(is,t),ne(Nt,ks),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Ba(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Ba(e,t)}ie(Nt),ne(Nt,e)}function Hr(){ie(Nt),ie(is),ie(ss)}function xg(t){Bn(ss.current);var e=Bn(Nt.current),n=Ba(e,t.type);e!==n&&(ne(is,t),ne(Nt,n))}function kc(t){is.current===t&&(ie(Nt),ie(is))}var oe=An(0);function Lo(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var ca=[];function Ic(){for(var t=0;t<ca.length;t++)ca[t]._workInProgressVersionPrimary=null;ca.length=0}var uo=Jt.ReactCurrentDispatcher,da=Jt.ReactCurrentBatchConfig,Xn=0,le=null,me=null,Se=null,Fo=!1,Fi=!1,os=0,D0=0;function Re(){throw Error(E(321))}function xc(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!St(t[n],e[n]))return!1;return!0}function Tc(t,e,n,r,i,s){if(Xn=s,le=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,uo.current=t===null||t.memoizedState===null?U0:j0,t=n(r,i),Fi){s=0;do{if(Fi=!1,os=0,25<=s)throw Error(E(301));s+=1,Se=me=null,e.updateQueue=null,uo.current=z0,t=n(r,i)}while(Fi)}if(uo.current=Uo,e=me!==null&&me.next!==null,Xn=0,Se=me=le=null,Fo=!1,e)throw Error(E(300));return t}function Nc(){var t=os!==0;return os=0,t}function It(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Se===null?le.memoizedState=Se=t:Se=Se.next=t,Se}function st(){if(me===null){var t=le.alternate;t=t!==null?t.memoizedState:null}else t=me.next;var e=Se===null?le.memoizedState:Se.next;if(e!==null)Se=e,me=t;else{if(t===null)throw Error(E(310));me=t,t={memoizedState:me.memoizedState,baseState:me.baseState,baseQueue:me.baseQueue,queue:me.queue,next:null},Se===null?le.memoizedState=Se=t:Se=Se.next=t}return Se}function ls(t,e){return typeof e=="function"?e(t):e}function ha(t){var e=st(),n=e.queue;if(n===null)throw Error(E(311));n.lastRenderedReducer=t;var r=me,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var l=o=null,a=null,u=s;do{var h=u.lane;if((Xn&h)===h)a!==null&&(a=a.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),r=u.hasEagerState?u.eagerState:t(r,u.action);else{var d={lane:h,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};a===null?(l=a=d,o=r):a=a.next=d,le.lanes|=h,Jn|=h}u=u.next}while(u!==null&&u!==s);a===null?o=r:a.next=l,St(r,e.memoizedState)||(We=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=a,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,le.lanes|=s,Jn|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function fa(t){var e=st(),n=e.queue;if(n===null)throw Error(E(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);St(s,e.memoizedState)||(We=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function Tg(){}function Ng(t,e){var n=le,r=st(),i=e(),s=!St(r.memoizedState,i);if(s&&(r.memoizedState=i,We=!0),r=r.queue,Rc(bg.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||Se!==null&&Se.memoizedState.tag&1){if(n.flags|=2048,as(9,Pg.bind(null,n,r,i,e),void 0,null),Ee===null)throw Error(E(349));Xn&30||Rg(n,e,i)}return i}function Rg(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=le.updateQueue,e===null?(e={lastEffect:null,stores:null},le.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Pg(t,e,n,r){e.value=n,e.getSnapshot=r,Ag(e)&&Og(t)}function bg(t,e,n){return n(function(){Ag(e)&&Og(t)})}function Ag(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!St(t,n)}catch{return!0}}function Og(t){var e=Kt(t,1);e!==null&&_t(e,t,1,-1)}function Nh(t){var e=It();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ls,lastRenderedState:t},e.queue=t,t=t.dispatch=F0.bind(null,le,t),[e.memoizedState,t]}function as(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=le.updateQueue,e===null?(e={lastEffect:null,stores:null},le.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function Dg(){return st().memoizedState}function co(t,e,n,r){var i=It();le.flags|=t,i.memoizedState=as(1|e,n,void 0,r===void 0?null:r)}function Sl(t,e,n,r){var i=st();r=r===void 0?null:r;var s=void 0;if(me!==null){var o=me.memoizedState;if(s=o.destroy,r!==null&&xc(r,o.deps)){i.memoizedState=as(e,n,s,r);return}}le.flags|=t,i.memoizedState=as(1|e,n,s,r)}function Rh(t,e){return co(8390656,8,t,e)}function Rc(t,e){return Sl(2048,8,t,e)}function Mg(t,e){return Sl(4,2,t,e)}function Lg(t,e){return Sl(4,4,t,e)}function Fg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Ug(t,e,n){return n=n!=null?n.concat([t]):null,Sl(4,4,Fg.bind(null,e,t),n)}function Pc(){}function jg(t,e){var n=st();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&xc(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function zg(t,e){var n=st();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&xc(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function Wg(t,e,n){return Xn&21?(St(n,e)||(n=Gp(),le.lanes|=n,Jn|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,We=!0),t.memoizedState=n)}function M0(t,e){var n=X;X=n!==0&&4>n?n:4,t(!0);var r=da.transition;da.transition={};try{t(!1),e()}finally{X=n,da.transition=r}}function Bg(){return st().memoizedState}function L0(t,e,n){var r=yn(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Vg(t))$g(e,n);else if(n=kg(t,e,n,r),n!==null){var i=Me();_t(n,t,r,i),Hg(n,e,r)}}function F0(t,e,n){var r=yn(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Vg(t))$g(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,l=s(o,n);if(i.hasEagerState=!0,i.eagerState=l,St(l,o)){var a=e.interleaved;a===null?(i.next=i,Sc(e)):(i.next=a.next,a.next=i),e.interleaved=i;return}}catch{}finally{}n=kg(t,e,i,r),n!==null&&(i=Me(),_t(n,t,r,i),Hg(n,e,r))}}function Vg(t){var e=t.alternate;return t===le||e!==null&&e===le}function $g(t,e){Fi=Fo=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Hg(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,lc(t,n)}}var Uo={readContext:it,useCallback:Re,useContext:Re,useEffect:Re,useImperativeHandle:Re,useInsertionEffect:Re,useLayoutEffect:Re,useMemo:Re,useReducer:Re,useRef:Re,useState:Re,useDebugValue:Re,useDeferredValue:Re,useTransition:Re,useMutableSource:Re,useSyncExternalStore:Re,useId:Re,unstable_isNewReconciler:!1},U0={readContext:it,useCallback:function(t,e){return It().memoizedState=[t,e===void 0?null:e],t},useContext:it,useEffect:Rh,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,co(4194308,4,Fg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return co(4194308,4,t,e)},useInsertionEffect:function(t,e){return co(4,2,t,e)},useMemo:function(t,e){var n=It();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=It();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=L0.bind(null,le,t),[r.memoizedState,t]},useRef:function(t){var e=It();return t={current:t},e.memoizedState=t},useState:Nh,useDebugValue:Pc,useDeferredValue:function(t){return It().memoizedState=t},useTransition:function(){var t=Nh(!1),e=t[0];return t=M0.bind(null,t[1]),It().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=le,i=It();if(se){if(n===void 0)throw Error(E(407));n=n()}else{if(n=e(),Ee===null)throw Error(E(349));Xn&30||Rg(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,Rh(bg.bind(null,r,s,t),[t]),r.flags|=2048,as(9,Pg.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=It(),e=Ee.identifierPrefix;if(se){var n=jt,r=Ut;n=(r&~(1<<32-mt(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=os++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=D0++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},j0={readContext:it,useCallback:jg,useContext:it,useEffect:Rc,useImperativeHandle:Ug,useInsertionEffect:Mg,useLayoutEffect:Lg,useMemo:zg,useReducer:ha,useRef:Dg,useState:function(){return ha(ls)},useDebugValue:Pc,useDeferredValue:function(t){var e=st();return Wg(e,me.memoizedState,t)},useTransition:function(){var t=ha(ls)[0],e=st().memoizedState;return[t,e]},useMutableSource:Tg,useSyncExternalStore:Ng,useId:Bg,unstable_isNewReconciler:!1},z0={readContext:it,useCallback:jg,useContext:it,useEffect:Rc,useImperativeHandle:Ug,useInsertionEffect:Mg,useLayoutEffect:Lg,useMemo:zg,useReducer:fa,useRef:Dg,useState:function(){return fa(ls)},useDebugValue:Pc,useDeferredValue:function(t){var e=st();return me===null?e.memoizedState=t:Wg(e,me.memoizedState,t)},useTransition:function(){var t=fa(ls)[0],e=st().memoizedState;return[t,e]},useMutableSource:Tg,useSyncExternalStore:Ng,useId:Bg,unstable_isNewReconciler:!1};function ut(t,e){if(t&&t.defaultProps){e=ae({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function uu(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:ae({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Cl={isMounted:function(t){return(t=t._reactInternals)?lr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=Me(),i=yn(t),s=Vt(r,i);s.payload=e,n!=null&&(s.callback=n),e=mn(t,s,i),e!==null&&(_t(e,t,i,r),ao(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=Me(),i=yn(t),s=Vt(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=mn(t,s,i),e!==null&&(_t(e,t,i,r),ao(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=Me(),r=yn(t),i=Vt(n,r);i.tag=2,e!=null&&(i.callback=e),e=mn(t,i,r),e!==null&&(_t(e,t,r,n),ao(e,t,r))}};function Ph(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!es(n,r)||!es(i,s):!0}function Gg(t,e,n){var r=!1,i=Tn,s=e.contextType;return typeof s=="object"&&s!==null?s=it(s):(i=$e(e)?Yn:Ae.current,r=e.contextTypes,s=(r=r!=null)?Br(t,i):Tn),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Cl,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function bh(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&Cl.enqueueReplaceState(e,e.state,null)}function cu(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs={},Cc(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=it(s):(s=$e(e)?Yn:Ae.current,i.context=Br(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(uu(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&Cl.enqueueReplaceState(i,i.state,null),Mo(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function Gr(t,e){try{var n="",r=e;do n+=pv(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function pa(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function du(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var W0=typeof WeakMap=="function"?WeakMap:Map;function Kg(t,e,n){n=Vt(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){zo||(zo=!0,Su=r),du(t,e)},n}function Qg(t,e,n){n=Vt(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){du(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){du(t,e),typeof r!="function"&&(_n===null?_n=new Set([this]):_n.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Ah(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new W0;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=t1.bind(null,t,e,n),e.then(t,t))}function Oh(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Dh(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Vt(-1,1),e.tag=2,mn(n,e,1))),n.lanes|=1),t)}var B0=Jt.ReactCurrentOwner,We=!1;function Oe(t,e,n,r){e.child=t===null?Eg(e,null,n,r):$r(e,t.child,n,r)}function Mh(t,e,n,r,i){n=n.render;var s=e.ref;return Ar(e,i),r=Tc(t,e,n,r,s,i),n=Nc(),t!==null&&!We?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Qt(t,e,i)):(se&&n&&gc(e),e.flags|=1,Oe(t,e,r,i),e.child)}function Lh(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!Uc(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,Yg(t,e,s,r,i)):(t=go(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:es,n(o,r)&&t.ref===e.ref)return Qt(t,e,i)}return e.flags|=1,t=vn(s,r),t.ref=e.ref,t.return=e,e.child=t}function Yg(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(es(s,r)&&t.ref===e.ref)if(We=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(We=!0);else return e.lanes=t.lanes,Qt(t,e,i)}return hu(t,e,n,r,i)}function qg(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ne(xr,Ge),Ge|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ne(xr,Ge),Ge|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,ne(xr,Ge),Ge|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,ne(xr,Ge),Ge|=r;return Oe(t,e,i,n),e.child}function Xg(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function hu(t,e,n,r,i){var s=$e(n)?Yn:Ae.current;return s=Br(e,s),Ar(e,i),n=Tc(t,e,n,r,s,i),r=Nc(),t!==null&&!We?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Qt(t,e,i)):(se&&r&&gc(e),e.flags|=1,Oe(t,e,n,i),e.child)}function Fh(t,e,n,r,i){if($e(n)){var s=!0;Po(e)}else s=!1;if(Ar(e,i),e.stateNode===null)ho(t,e),Gg(e,n,r),cu(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var a=o.context,u=n.contextType;typeof u=="object"&&u!==null?u=it(u):(u=$e(n)?Yn:Ae.current,u=Br(e,u));var h=n.getDerivedStateFromProps,d=typeof h=="function"||typeof o.getSnapshotBeforeUpdate=="function";d||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==r||a!==u)&&bh(e,o,r,u),nn=!1;var c=e.memoizedState;o.state=c,Mo(e,r,o,i),a=e.memoizedState,l!==r||c!==a||Ve.current||nn?(typeof h=="function"&&(uu(e,n,h,r),a=e.memoizedState),(l=nn||Ph(e,n,l,r,c,a,u))?(d||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=a),o.props=r,o.state=a,o.context=u,r=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,Ig(t,e),l=e.memoizedProps,u=e.type===e.elementType?l:ut(e.type,l),o.props=u,d=e.pendingProps,c=o.context,a=n.contextType,typeof a=="object"&&a!==null?a=it(a):(a=$e(n)?Yn:Ae.current,a=Br(e,a));var _=n.getDerivedStateFromProps;(h=typeof _=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==d||c!==a)&&bh(e,o,r,a),nn=!1,c=e.memoizedState,o.state=c,Mo(e,r,o,i);var y=e.memoizedState;l!==d||c!==y||Ve.current||nn?(typeof _=="function"&&(uu(e,n,_,r),y=e.memoizedState),(u=nn||Ph(e,n,u,r,c,y,a)||!1)?(h||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,y,a),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,y,a)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&c===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&c===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=y),o.props=r,o.state=y,o.context=a,r=u):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&c===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&c===t.memoizedState||(e.flags|=1024),r=!1)}return fu(t,e,n,r,s,i)}function fu(t,e,n,r,i,s){Xg(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&Ch(e,n,!1),Qt(t,e,s);r=e.stateNode,B0.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=$r(e,t.child,null,s),e.child=$r(e,null,l,s)):Oe(t,e,l,s),e.memoizedState=r.state,i&&Ch(e,n,!0),e.child}function Jg(t){var e=t.stateNode;e.pendingContext?Sh(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Sh(t,e.context,!1),Ec(t,e.containerInfo)}function Uh(t,e,n,r,i){return Vr(),_c(i),e.flags|=256,Oe(t,e,n,r),e.child}var pu={dehydrated:null,treeContext:null,retryLane:0};function gu(t){return{baseLanes:t,cachePool:null,transitions:null}}function Zg(t,e,n){var r=e.pendingProps,i=oe.current,s=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(i&2)!==0),l?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),ne(oe,i&1),t===null)return lu(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Il(o,r,0,null),t=Gn(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=gu(n),e.memoizedState=pu,t):bc(e,o));if(i=t.memoizedState,i!==null&&(l=i.dehydrated,l!==null))return V0(t,e,o,r,l,i,n);if(s){s=r.fallback,o=e.mode,i=t.child,l=i.sibling;var a={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=a,e.deletions=null):(r=vn(i,a),r.subtreeFlags=i.subtreeFlags&14680064),l!==null?s=vn(l,s):(s=Gn(s,o,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=t.child.memoizedState,o=o===null?gu(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=pu,r}return s=t.child,t=s.sibling,r=vn(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function bc(t,e){return e=Il({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function qs(t,e,n,r){return r!==null&&_c(r),$r(e,t.child,null,n),t=bc(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function V0(t,e,n,r,i,s,o){if(n)return e.flags&256?(e.flags&=-257,r=pa(Error(E(422))),qs(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=Il({mode:"visible",children:r.children},i,0,null),s=Gn(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&$r(e,t.child,null,o),e.child.memoizedState=gu(o),e.memoizedState=pu,s);if(!(e.mode&1))return qs(t,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var l=r.dgst;return r=l,s=Error(E(419)),r=pa(s,r,void 0),qs(t,e,o,r)}if(l=(o&t.childLanes)!==0,We||l){if(r=Ee,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,Kt(t,i),_t(r,t,i,-1))}return Fc(),r=pa(Error(E(421))),qs(t,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=n1.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,Ke=gn(i.nextSibling),Qe=e,se=!0,dt=null,t!==null&&(Ze[et++]=Ut,Ze[et++]=jt,Ze[et++]=qn,Ut=t.id,jt=t.overflow,qn=e),e=bc(e,r.children),e.flags|=4096,e)}function jh(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),au(t.return,e,n)}function ga(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function em(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(Oe(t,e,r.children,n),r=oe.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&jh(t,n,e);else if(t.tag===19)jh(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(ne(oe,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&Lo(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),ga(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&Lo(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}ga(e,!0,n,null,s);break;case"together":ga(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function ho(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Qt(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Jn|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(E(153));if(e.child!==null){for(t=e.child,n=vn(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=vn(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function $0(t,e,n){switch(e.tag){case 3:Jg(e),Vr();break;case 5:xg(e);break;case 1:$e(e.type)&&Po(e);break;case 4:Ec(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;ne(Oo,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(ne(oe,oe.current&1),e.flags|=128,null):n&e.child.childLanes?Zg(t,e,n):(ne(oe,oe.current&1),t=Qt(t,e,n),t!==null?t.sibling:null);ne(oe,oe.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return em(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),ne(oe,oe.current),r)break;return null;case 22:case 23:return e.lanes=0,qg(t,e,n)}return Qt(t,e,n)}var tm,mu,nm,rm;tm=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};mu=function(){};nm=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,Bn(Nt.current);var s=null;switch(n){case"input":i=Ua(t,i),r=Ua(t,r),s=[];break;case"select":i=ae({},i,{value:void 0}),r=ae({},r,{value:void 0}),s=[];break;case"textarea":i=Wa(t,i),r=Wa(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=No)}Va(n,r);var o;n=null;for(u in i)if(!r.hasOwnProperty(u)&&i.hasOwnProperty(u)&&i[u]!=null)if(u==="style"){var l=i[u];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Ki.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in r){var a=r[u];if(l=i!=null?i[u]:void 0,r.hasOwnProperty(u)&&a!==l&&(a!=null||l!=null))if(u==="style")if(l){for(o in l)!l.hasOwnProperty(o)||a&&a.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in a)a.hasOwnProperty(o)&&l[o]!==a[o]&&(n||(n={}),n[o]=a[o])}else n||(s||(s=[]),s.push(u,n)),n=a;else u==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,l=l?l.__html:void 0,a!=null&&l!==a&&(s=s||[]).push(u,a)):u==="children"?typeof a!="string"&&typeof a!="number"||(s=s||[]).push(u,""+a):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Ki.hasOwnProperty(u)?(a!=null&&u==="onScroll"&&re("scroll",t),s||l===a||(s=[])):(s=s||[]).push(u,a))}n&&(s=s||[]).push("style",n);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};rm=function(t,e,n,r){n!==r&&(e.flags|=4)};function Ci(t,e){if(!se)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function Pe(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function H0(t,e,n){var r=e.pendingProps;switch(mc(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Pe(e),null;case 1:return $e(e.type)&&Ro(),Pe(e),null;case 3:return r=e.stateNode,Hr(),ie(Ve),ie(Ae),Ic(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(Qs(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,dt!==null&&(ku(dt),dt=null))),mu(t,e),Pe(e),null;case 5:kc(e);var i=Bn(ss.current);if(n=e.type,t!==null&&e.stateNode!=null)nm(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(E(166));return Pe(e),null}if(t=Bn(Nt.current),Qs(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[xt]=e,r[rs]=s,t=(e.mode&1)!==0,n){case"dialog":re("cancel",r),re("close",r);break;case"iframe":case"object":case"embed":re("load",r);break;case"video":case"audio":for(i=0;i<bi.length;i++)re(bi[i],r);break;case"source":re("error",r);break;case"img":case"image":case"link":re("error",r),re("load",r);break;case"details":re("toggle",r);break;case"input":Qd(r,s),re("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},re("invalid",r);break;case"textarea":qd(r,s),re("invalid",r)}Va(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var l=s[o];o==="children"?typeof l=="string"?r.textContent!==l&&(s.suppressHydrationWarning!==!0&&Ks(r.textContent,l,t),i=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&Ks(r.textContent,l,t),i=["children",""+l]):Ki.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&re("scroll",r)}switch(n){case"input":js(r),Yd(r,s,!0);break;case"textarea":js(r),Xd(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=No)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=bp(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[xt]=e,t[rs]=r,tm(t,e,!1,!1),e.stateNode=t;e:{switch(o=$a(n,r),n){case"dialog":re("cancel",t),re("close",t),i=r;break;case"iframe":case"object":case"embed":re("load",t),i=r;break;case"video":case"audio":for(i=0;i<bi.length;i++)re(bi[i],t);i=r;break;case"source":re("error",t),i=r;break;case"img":case"image":case"link":re("error",t),re("load",t),i=r;break;case"details":re("toggle",t),i=r;break;case"input":Qd(t,r),i=Ua(t,r),re("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=ae({},r,{value:void 0}),re("invalid",t);break;case"textarea":qd(t,r),i=Wa(t,r),re("invalid",t);break;default:i=r}Va(n,i),l=i;for(s in l)if(l.hasOwnProperty(s)){var a=l[s];s==="style"?Dp(t,a):s==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,a!=null&&Ap(t,a)):s==="children"?typeof a=="string"?(n!=="textarea"||a!=="")&&Qi(t,a):typeof a=="number"&&Qi(t,""+a):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Ki.hasOwnProperty(s)?a!=null&&s==="onScroll"&&re("scroll",t):a!=null&&tc(t,s,a,o))}switch(n){case"input":js(t),Yd(t,r,!1);break;case"textarea":js(t),Xd(t);break;case"option":r.value!=null&&t.setAttribute("value",""+xn(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?Nr(t,!!r.multiple,s,!1):r.defaultValue!=null&&Nr(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=No)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Pe(e),null;case 6:if(t&&e.stateNode!=null)rm(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(E(166));if(n=Bn(ss.current),Bn(Nt.current),Qs(e)){if(r=e.stateNode,n=e.memoizedProps,r[xt]=e,(s=r.nodeValue!==n)&&(t=Qe,t!==null))switch(t.tag){case 3:Ks(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Ks(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[xt]=e,e.stateNode=r}return Pe(e),null;case 13:if(ie(oe),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(se&&Ke!==null&&e.mode&1&&!(e.flags&128))Sg(),Vr(),e.flags|=98560,s=!1;else if(s=Qs(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error(E(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(E(317));s[xt]=e}else Vr(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Pe(e),s=!1}else dt!==null&&(ku(dt),dt=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||oe.current&1?ve===0&&(ve=3):Fc())),e.updateQueue!==null&&(e.flags|=4),Pe(e),null);case 4:return Hr(),mu(t,e),t===null&&ts(e.stateNode.containerInfo),Pe(e),null;case 10:return wc(e.type._context),Pe(e),null;case 17:return $e(e.type)&&Ro(),Pe(e),null;case 19:if(ie(oe),s=e.memoizedState,s===null)return Pe(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)Ci(s,!1);else{if(ve!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Lo(t),o!==null){for(e.flags|=128,Ci(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ne(oe,oe.current&1|2),e.child}t=t.sibling}s.tail!==null&&fe()>Kr&&(e.flags|=128,r=!0,Ci(s,!1),e.lanes=4194304)}else{if(!r)if(t=Lo(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Ci(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!se)return Pe(e),null}else 2*fe()-s.renderingStartTime>Kr&&n!==1073741824&&(e.flags|=128,r=!0,Ci(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=fe(),e.sibling=null,n=oe.current,ne(oe,r?n&1|2:n&1),e):(Pe(e),null);case 22:case 23:return Lc(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?Ge&1073741824&&(Pe(e),e.subtreeFlags&6&&(e.flags|=8192)):Pe(e),null;case 24:return null;case 25:return null}throw Error(E(156,e.tag))}function G0(t,e){switch(mc(e),e.tag){case 1:return $e(e.type)&&Ro(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Hr(),ie(Ve),ie(Ae),Ic(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return kc(e),null;case 13:if(ie(oe),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(E(340));Vr()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return ie(oe),null;case 4:return Hr(),null;case 10:return wc(e.type._context),null;case 22:case 23:return Lc(),null;case 24:return null;default:return null}}var Xs=!1,be=!1,K0=typeof WeakSet=="function"?WeakSet:Set,L=null;function Ir(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){ue(t,e,r)}else n.current=null}function _u(t,e,n){try{n()}catch(r){ue(t,e,r)}}var zh=!1;function Q0(t,e){if(eu=Io,t=ag(),pc(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,l=-1,a=-1,u=0,h=0,d=t,c=null;t:for(;;){for(var _;d!==n||i!==0&&d.nodeType!==3||(l=o+i),d!==s||r!==0&&d.nodeType!==3||(a=o+r),d.nodeType===3&&(o+=d.nodeValue.length),(_=d.firstChild)!==null;)c=d,d=_;for(;;){if(d===t)break t;if(c===n&&++u===i&&(l=o),c===s&&++h===r&&(a=o),(_=d.nextSibling)!==null)break;d=c,c=d.parentNode}d=_}n=l===-1||a===-1?null:{start:l,end:a}}else n=null}n=n||{start:0,end:0}}else n=null;for(tu={focusedElem:t,selectionRange:n},Io=!1,L=e;L!==null;)if(e=L,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,L=t;else for(;L!==null;){e=L;try{var y=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(y!==null){var v=y.memoizedProps,M=y.memoizedState,g=e.stateNode,f=g.getSnapshotBeforeUpdate(e.elementType===e.type?v:ut(e.type,v),M);g.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var m=e.stateNode.containerInfo;m.nodeType===1?m.textContent="":m.nodeType===9&&m.documentElement&&m.removeChild(m.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(E(163))}}catch(w){ue(e,e.return,w)}if(t=e.sibling,t!==null){t.return=e.return,L=t;break}L=e.return}return y=zh,zh=!1,y}function Ui(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&_u(e,n,s)}i=i.next}while(i!==r)}}function El(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function yu(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function im(t){var e=t.alternate;e!==null&&(t.alternate=null,im(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[xt],delete e[rs],delete e[iu],delete e[P0],delete e[b0])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function sm(t){return t.tag===5||t.tag===3||t.tag===4}function Wh(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||sm(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function vu(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=No));else if(r!==4&&(t=t.child,t!==null))for(vu(t,e,n),t=t.sibling;t!==null;)vu(t,e,n),t=t.sibling}function wu(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(wu(t,e,n),t=t.sibling;t!==null;)wu(t,e,n),t=t.sibling}var ke=null,ct=!1;function Zt(t,e,n){for(n=n.child;n!==null;)om(t,e,n),n=n.sibling}function om(t,e,n){if(Tt&&typeof Tt.onCommitFiberUnmount=="function")try{Tt.onCommitFiberUnmount(gl,n)}catch{}switch(n.tag){case 5:be||Ir(n,e);case 6:var r=ke,i=ct;ke=null,Zt(t,e,n),ke=r,ct=i,ke!==null&&(ct?(t=ke,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):ke.removeChild(n.stateNode));break;case 18:ke!==null&&(ct?(t=ke,n=n.stateNode,t.nodeType===8?aa(t.parentNode,n):t.nodeType===1&&aa(t,n),Ji(t)):aa(ke,n.stateNode));break;case 4:r=ke,i=ct,ke=n.stateNode.containerInfo,ct=!0,Zt(t,e,n),ke=r,ct=i;break;case 0:case 11:case 14:case 15:if(!be&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&_u(n,e,o),i=i.next}while(i!==r)}Zt(t,e,n);break;case 1:if(!be&&(Ir(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){ue(n,e,l)}Zt(t,e,n);break;case 21:Zt(t,e,n);break;case 22:n.mode&1?(be=(r=be)||n.memoizedState!==null,Zt(t,e,n),be=r):Zt(t,e,n);break;default:Zt(t,e,n)}}function Bh(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new K0),e.forEach(function(r){var i=r1.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function at(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:ke=l.stateNode,ct=!1;break e;case 3:ke=l.stateNode.containerInfo,ct=!0;break e;case 4:ke=l.stateNode.containerInfo,ct=!0;break e}l=l.return}if(ke===null)throw Error(E(160));om(s,o,i),ke=null,ct=!1;var a=i.alternate;a!==null&&(a.return=null),i.return=null}catch(u){ue(i,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)lm(e,t),e=e.sibling}function lm(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(at(e,t),kt(t),r&4){try{Ui(3,t,t.return),El(3,t)}catch(v){ue(t,t.return,v)}try{Ui(5,t,t.return)}catch(v){ue(t,t.return,v)}}break;case 1:at(e,t),kt(t),r&512&&n!==null&&Ir(n,n.return);break;case 5:if(at(e,t),kt(t),r&512&&n!==null&&Ir(n,n.return),t.flags&32){var i=t.stateNode;try{Qi(i,"")}catch(v){ue(t,t.return,v)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,l=t.type,a=t.updateQueue;if(t.updateQueue=null,a!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&Rp(i,s),$a(l,o);var u=$a(l,s);for(o=0;o<a.length;o+=2){var h=a[o],d=a[o+1];h==="style"?Dp(i,d):h==="dangerouslySetInnerHTML"?Ap(i,d):h==="children"?Qi(i,d):tc(i,h,d,u)}switch(l){case"input":ja(i,s);break;case"textarea":Pp(i,s);break;case"select":var c=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var _=s.value;_!=null?Nr(i,!!s.multiple,_,!1):c!==!!s.multiple&&(s.defaultValue!=null?Nr(i,!!s.multiple,s.defaultValue,!0):Nr(i,!!s.multiple,s.multiple?[]:"",!1))}i[rs]=s}catch(v){ue(t,t.return,v)}}break;case 6:if(at(e,t),kt(t),r&4){if(t.stateNode===null)throw Error(E(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(v){ue(t,t.return,v)}}break;case 3:if(at(e,t),kt(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Ji(e.containerInfo)}catch(v){ue(t,t.return,v)}break;case 4:at(e,t),kt(t);break;case 13:at(e,t),kt(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(Dc=fe())),r&4&&Bh(t);break;case 22:if(h=n!==null&&n.memoizedState!==null,t.mode&1?(be=(u=be)||h,at(e,t),be=u):at(e,t),kt(t),r&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!h&&t.mode&1)for(L=t,h=t.child;h!==null;){for(d=L=h;L!==null;){switch(c=L,_=c.child,c.tag){case 0:case 11:case 14:case 15:Ui(4,c,c.return);break;case 1:Ir(c,c.return);var y=c.stateNode;if(typeof y.componentWillUnmount=="function"){r=c,n=c.return;try{e=r,y.props=e.memoizedProps,y.state=e.memoizedState,y.componentWillUnmount()}catch(v){ue(r,n,v)}}break;case 5:Ir(c,c.return);break;case 22:if(c.memoizedState!==null){$h(d);continue}}_!==null?(_.return=c,L=_):$h(d)}h=h.sibling}e:for(h=null,d=t;;){if(d.tag===5){if(h===null){h=d;try{i=d.stateNode,u?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=d.stateNode,a=d.memoizedProps.style,o=a!=null&&a.hasOwnProperty("display")?a.display:null,l.style.display=Op("display",o))}catch(v){ue(t,t.return,v)}}}else if(d.tag===6){if(h===null)try{d.stateNode.nodeValue=u?"":d.memoizedProps}catch(v){ue(t,t.return,v)}}else if((d.tag!==22&&d.tag!==23||d.memoizedState===null||d===t)&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===t)break e;for(;d.sibling===null;){if(d.return===null||d.return===t)break e;h===d&&(h=null),d=d.return}h===d&&(h=null),d.sibling.return=d.return,d=d.sibling}}break;case 19:at(e,t),kt(t),r&4&&Bh(t);break;case 21:break;default:at(e,t),kt(t)}}function kt(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(sm(n)){var r=n;break e}n=n.return}throw Error(E(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Qi(i,""),r.flags&=-33);var s=Wh(t);wu(t,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,l=Wh(t);vu(t,l,o);break;default:throw Error(E(161))}}catch(a){ue(t,t.return,a)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Y0(t,e,n){L=t,am(t)}function am(t,e,n){for(var r=(t.mode&1)!==0;L!==null;){var i=L,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||Xs;if(!o){var l=i.alternate,a=l!==null&&l.memoizedState!==null||be;l=Xs;var u=be;if(Xs=o,(be=a)&&!u)for(L=i;L!==null;)o=L,a=o.child,o.tag===22&&o.memoizedState!==null?Hh(i):a!==null?(a.return=o,L=a):Hh(i);for(;s!==null;)L=s,am(s),s=s.sibling;L=i,Xs=l,be=u}Vh(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,L=s):Vh(t)}}function Vh(t){for(;L!==null;){var e=L;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:be||El(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!be)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:ut(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Th(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Th(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var a=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":a.autoFocus&&n.focus();break;case"img":a.src&&(n.src=a.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var h=u.memoizedState;if(h!==null){var d=h.dehydrated;d!==null&&Ji(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(E(163))}be||e.flags&512&&yu(e)}catch(c){ue(e,e.return,c)}}if(e===t){L=null;break}if(n=e.sibling,n!==null){n.return=e.return,L=n;break}L=e.return}}function $h(t){for(;L!==null;){var e=L;if(e===t){L=null;break}var n=e.sibling;if(n!==null){n.return=e.return,L=n;break}L=e.return}}function Hh(t){for(;L!==null;){var e=L;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{El(4,e)}catch(a){ue(e,n,a)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(a){ue(e,i,a)}}var s=e.return;try{yu(e)}catch(a){ue(e,s,a)}break;case 5:var o=e.return;try{yu(e)}catch(a){ue(e,o,a)}}}catch(a){ue(e,e.return,a)}if(e===t){L=null;break}var l=e.sibling;if(l!==null){l.return=e.return,L=l;break}L=e.return}}var q0=Math.ceil,jo=Jt.ReactCurrentDispatcher,Ac=Jt.ReactCurrentOwner,rt=Jt.ReactCurrentBatchConfig,Y=0,Ee=null,pe=null,xe=0,Ge=0,xr=An(0),ve=0,us=null,Jn=0,kl=0,Oc=0,ji=null,ze=null,Dc=0,Kr=1/0,Mt=null,zo=!1,Su=null,_n=null,Js=!1,cn=null,Wo=0,zi=0,Cu=null,fo=-1,po=0;function Me(){return Y&6?fe():fo!==-1?fo:fo=fe()}function yn(t){return t.mode&1?Y&2&&xe!==0?xe&-xe:O0.transition!==null?(po===0&&(po=Gp()),po):(t=X,t!==0||(t=window.event,t=t===void 0?16:Zp(t.type)),t):1}function _t(t,e,n,r){if(50<zi)throw zi=0,Cu=null,Error(E(185));Ss(t,n,r),(!(Y&2)||t!==Ee)&&(t===Ee&&(!(Y&2)&&(kl|=n),ve===4&&sn(t,xe)),He(t,r),n===1&&Y===0&&!(e.mode&1)&&(Kr=fe()+500,wl&&On()))}function He(t,e){var n=t.callbackNode;Ov(t,e);var r=ko(t,t===Ee?xe:0);if(r===0)n!==null&&eh(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&eh(n),e===1)t.tag===0?A0(Gh.bind(null,t)):yg(Gh.bind(null,t)),N0(function(){!(Y&6)&&On()}),n=null;else{switch(Kp(r)){case 1:n=oc;break;case 4:n=$p;break;case 16:n=Eo;break;case 536870912:n=Hp;break;default:n=Eo}n=mm(n,um.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function um(t,e){if(fo=-1,po=0,Y&6)throw Error(E(327));var n=t.callbackNode;if(Or()&&t.callbackNode!==n)return null;var r=ko(t,t===Ee?xe:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=Bo(t,r);else{e=r;var i=Y;Y|=2;var s=dm();(Ee!==t||xe!==e)&&(Mt=null,Kr=fe()+500,Hn(t,e));do try{Z0();break}catch(l){cm(t,l)}while(1);vc(),jo.current=s,Y=i,pe!==null?e=0:(Ee=null,xe=0,e=ve)}if(e!==0){if(e===2&&(i=Ya(t),i!==0&&(r=i,e=Eu(t,i))),e===1)throw n=us,Hn(t,0),sn(t,r),He(t,fe()),n;if(e===6)sn(t,r);else{if(i=t.current.alternate,!(r&30)&&!X0(i)&&(e=Bo(t,r),e===2&&(s=Ya(t),s!==0&&(r=s,e=Eu(t,s))),e===1))throw n=us,Hn(t,0),sn(t,r),He(t,fe()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error(E(345));case 2:Fn(t,ze,Mt);break;case 3:if(sn(t,r),(r&130023424)===r&&(e=Dc+500-fe(),10<e)){if(ko(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){Me(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=ru(Fn.bind(null,t,ze,Mt),e);break}Fn(t,ze,Mt);break;case 4:if(sn(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var o=31-mt(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=fe()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*q0(r/1960))-r,10<r){t.timeoutHandle=ru(Fn.bind(null,t,ze,Mt),r);break}Fn(t,ze,Mt);break;case 5:Fn(t,ze,Mt);break;default:throw Error(E(329))}}}return He(t,fe()),t.callbackNode===n?um.bind(null,t):null}function Eu(t,e){var n=ji;return t.current.memoizedState.isDehydrated&&(Hn(t,e).flags|=256),t=Bo(t,e),t!==2&&(e=ze,ze=n,e!==null&&ku(e)),t}function ku(t){ze===null?ze=t:ze.push.apply(ze,t)}function X0(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!St(s(),i))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function sn(t,e){for(e&=~Oc,e&=~kl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-mt(e),r=1<<n;t[n]=-1,e&=~r}}function Gh(t){if(Y&6)throw Error(E(327));Or();var e=ko(t,0);if(!(e&1))return He(t,fe()),null;var n=Bo(t,e);if(t.tag!==0&&n===2){var r=Ya(t);r!==0&&(e=r,n=Eu(t,r))}if(n===1)throw n=us,Hn(t,0),sn(t,e),He(t,fe()),n;if(n===6)throw Error(E(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Fn(t,ze,Mt),He(t,fe()),null}function Mc(t,e){var n=Y;Y|=1;try{return t(e)}finally{Y=n,Y===0&&(Kr=fe()+500,wl&&On())}}function Zn(t){cn!==null&&cn.tag===0&&!(Y&6)&&Or();var e=Y;Y|=1;var n=rt.transition,r=X;try{if(rt.transition=null,X=1,t)return t()}finally{X=r,rt.transition=n,Y=e,!(Y&6)&&On()}}function Lc(){Ge=xr.current,ie(xr)}function Hn(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,T0(n)),pe!==null)for(n=pe.return;n!==null;){var r=n;switch(mc(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ro();break;case 3:Hr(),ie(Ve),ie(Ae),Ic();break;case 5:kc(r);break;case 4:Hr();break;case 13:ie(oe);break;case 19:ie(oe);break;case 10:wc(r.type._context);break;case 22:case 23:Lc()}n=n.return}if(Ee=t,pe=t=vn(t.current,null),xe=Ge=e,ve=0,us=null,Oc=kl=Jn=0,ze=ji=null,Wn!==null){for(e=0;e<Wn.length;e++)if(n=Wn[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}Wn=null}return t}function cm(t,e){do{var n=pe;try{if(vc(),uo.current=Uo,Fo){for(var r=le.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}Fo=!1}if(Xn=0,Se=me=le=null,Fi=!1,os=0,Ac.current=null,n===null||n.return===null){ve=1,us=e,pe=null;break}e:{var s=t,o=n.return,l=n,a=e;if(e=xe,l.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){var u=a,h=l,d=h.tag;if(!(h.mode&1)&&(d===0||d===11||d===15)){var c=h.alternate;c?(h.updateQueue=c.updateQueue,h.memoizedState=c.memoizedState,h.lanes=c.lanes):(h.updateQueue=null,h.memoizedState=null)}var _=Oh(o);if(_!==null){_.flags&=-257,Dh(_,o,l,s,e),_.mode&1&&Ah(s,u,e),e=_,a=u;var y=e.updateQueue;if(y===null){var v=new Set;v.add(a),e.updateQueue=v}else y.add(a);break e}else{if(!(e&1)){Ah(s,u,e),Fc();break e}a=Error(E(426))}}else if(se&&l.mode&1){var M=Oh(o);if(M!==null){!(M.flags&65536)&&(M.flags|=256),Dh(M,o,l,s,e),_c(Gr(a,l));break e}}s=a=Gr(a,l),ve!==4&&(ve=2),ji===null?ji=[s]:ji.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var g=Kg(s,a,e);xh(s,g);break e;case 1:l=a;var f=s.type,m=s.stateNode;if(!(s.flags&128)&&(typeof f.getDerivedStateFromError=="function"||m!==null&&typeof m.componentDidCatch=="function"&&(_n===null||!_n.has(m)))){s.flags|=65536,e&=-e,s.lanes|=e;var w=Qg(s,l,e);xh(s,w);break e}}s=s.return}while(s!==null)}fm(n)}catch(P){e=P,pe===n&&n!==null&&(pe=n=n.return);continue}break}while(1)}function dm(){var t=jo.current;return jo.current=Uo,t===null?Uo:t}function Fc(){(ve===0||ve===3||ve===2)&&(ve=4),Ee===null||!(Jn&268435455)&&!(kl&268435455)||sn(Ee,xe)}function Bo(t,e){var n=Y;Y|=2;var r=dm();(Ee!==t||xe!==e)&&(Mt=null,Hn(t,e));do try{J0();break}catch(i){cm(t,i)}while(1);if(vc(),Y=n,jo.current=r,pe!==null)throw Error(E(261));return Ee=null,xe=0,ve}function J0(){for(;pe!==null;)hm(pe)}function Z0(){for(;pe!==null&&!kv();)hm(pe)}function hm(t){var e=gm(t.alternate,t,Ge);t.memoizedProps=t.pendingProps,e===null?fm(t):pe=e,Ac.current=null}function fm(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=G0(n,e),n!==null){n.flags&=32767,pe=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{ve=6,pe=null;return}}else if(n=H0(n,e,Ge),n!==null){pe=n;return}if(e=e.sibling,e!==null){pe=e;return}pe=e=t}while(e!==null);ve===0&&(ve=5)}function Fn(t,e,n){var r=X,i=rt.transition;try{rt.transition=null,X=1,e1(t,e,n,r)}finally{rt.transition=i,X=r}return null}function e1(t,e,n,r){do Or();while(cn!==null);if(Y&6)throw Error(E(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(E(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(Dv(t,s),t===Ee&&(pe=Ee=null,xe=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Js||(Js=!0,mm(Eo,function(){return Or(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=rt.transition,rt.transition=null;var o=X;X=1;var l=Y;Y|=4,Ac.current=null,Q0(t,n),lm(n,t),w0(tu),Io=!!eu,tu=eu=null,t.current=n,Y0(n),Iv(),Y=l,X=o,rt.transition=s}else t.current=n;if(Js&&(Js=!1,cn=t,Wo=i),s=t.pendingLanes,s===0&&(_n=null),Nv(n.stateNode),He(t,fe()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(zo)throw zo=!1,t=Su,Su=null,t;return Wo&1&&t.tag!==0&&Or(),s=t.pendingLanes,s&1?t===Cu?zi++:(zi=0,Cu=t):zi=0,On(),null}function Or(){if(cn!==null){var t=Kp(Wo),e=rt.transition,n=X;try{if(rt.transition=null,X=16>t?16:t,cn===null)var r=!1;else{if(t=cn,cn=null,Wo=0,Y&6)throw Error(E(331));var i=Y;for(Y|=4,L=t.current;L!==null;){var s=L,o=s.child;if(L.flags&16){var l=s.deletions;if(l!==null){for(var a=0;a<l.length;a++){var u=l[a];for(L=u;L!==null;){var h=L;switch(h.tag){case 0:case 11:case 15:Ui(8,h,s)}var d=h.child;if(d!==null)d.return=h,L=d;else for(;L!==null;){h=L;var c=h.sibling,_=h.return;if(im(h),h===u){L=null;break}if(c!==null){c.return=_,L=c;break}L=_}}}var y=s.alternate;if(y!==null){var v=y.child;if(v!==null){y.child=null;do{var M=v.sibling;v.sibling=null,v=M}while(v!==null)}}L=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,L=o;else e:for(;L!==null;){if(s=L,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Ui(9,s,s.return)}var g=s.sibling;if(g!==null){g.return=s.return,L=g;break e}L=s.return}}var f=t.current;for(L=f;L!==null;){o=L;var m=o.child;if(o.subtreeFlags&2064&&m!==null)m.return=o,L=m;else e:for(o=f;L!==null;){if(l=L,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:El(9,l)}}catch(P){ue(l,l.return,P)}if(l===o){L=null;break e}var w=l.sibling;if(w!==null){w.return=l.return,L=w;break e}L=l.return}}if(Y=i,On(),Tt&&typeof Tt.onPostCommitFiberRoot=="function")try{Tt.onPostCommitFiberRoot(gl,t)}catch{}r=!0}return r}finally{X=n,rt.transition=e}}return!1}function Kh(t,e,n){e=Gr(n,e),e=Kg(t,e,1),t=mn(t,e,1),e=Me(),t!==null&&(Ss(t,1,e),He(t,e))}function ue(t,e,n){if(t.tag===3)Kh(t,t,n);else for(;e!==null;){if(e.tag===3){Kh(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(_n===null||!_n.has(r))){t=Gr(n,t),t=Qg(e,t,1),e=mn(e,t,1),t=Me(),e!==null&&(Ss(e,1,t),He(e,t));break}}e=e.return}}function t1(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=Me(),t.pingedLanes|=t.suspendedLanes&n,Ee===t&&(xe&n)===n&&(ve===4||ve===3&&(xe&130023424)===xe&&500>fe()-Dc?Hn(t,0):Oc|=n),He(t,e)}function pm(t,e){e===0&&(t.mode&1?(e=Bs,Bs<<=1,!(Bs&130023424)&&(Bs=4194304)):e=1);var n=Me();t=Kt(t,e),t!==null&&(Ss(t,e,n),He(t,n))}function n1(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),pm(t,n)}function r1(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(E(314))}r!==null&&r.delete(e),pm(t,n)}var gm;gm=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||Ve.current)We=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return We=!1,$0(t,e,n);We=!!(t.flags&131072)}else We=!1,se&&e.flags&1048576&&vg(e,Ao,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;ho(t,e),t=e.pendingProps;var i=Br(e,Ae.current);Ar(e,n),i=Tc(null,e,r,t,i,n);var s=Nc();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,$e(r)?(s=!0,Po(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Cc(e),i.updater=Cl,e.stateNode=i,i._reactInternals=e,cu(e,r,t,n),e=fu(null,e,r,!0,s,n)):(e.tag=0,se&&s&&gc(e),Oe(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(ho(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=s1(r),t=ut(r,t),i){case 0:e=hu(null,e,r,t,n);break e;case 1:e=Fh(null,e,r,t,n);break e;case 11:e=Mh(null,e,r,t,n);break e;case 14:e=Lh(null,e,r,ut(r.type,t),n);break e}throw Error(E(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:ut(r,i),hu(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:ut(r,i),Fh(t,e,r,i,n);case 3:e:{if(Jg(e),t===null)throw Error(E(387));r=e.pendingProps,s=e.memoizedState,i=s.element,Ig(t,e),Mo(e,r,null,n);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=Gr(Error(E(423)),e),e=Uh(t,e,r,n,i);break e}else if(r!==i){i=Gr(Error(E(424)),e),e=Uh(t,e,r,n,i);break e}else for(Ke=gn(e.stateNode.containerInfo.firstChild),Qe=e,se=!0,dt=null,n=Eg(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Vr(),r===i){e=Qt(t,e,n);break e}Oe(t,e,r,n)}e=e.child}return e;case 5:return xg(e),t===null&&lu(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,nu(r,i)?o=null:s!==null&&nu(r,s)&&(e.flags|=32),Xg(t,e),Oe(t,e,o,n),e.child;case 6:return t===null&&lu(e),null;case 13:return Zg(t,e,n);case 4:return Ec(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=$r(e,null,r,n):Oe(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:ut(r,i),Mh(t,e,r,i,n);case 7:return Oe(t,e,e.pendingProps,n),e.child;case 8:return Oe(t,e,e.pendingProps.children,n),e.child;case 12:return Oe(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,ne(Oo,r._currentValue),r._currentValue=o,s!==null)if(St(s.value,o)){if(s.children===i.children&&!Ve.current){e=Qt(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var l=s.dependencies;if(l!==null){o=s.child;for(var a=l.firstContext;a!==null;){if(a.context===r){if(s.tag===1){a=Vt(-1,n&-n),a.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var h=u.pending;h===null?a.next=a:(a.next=h.next,h.next=a),u.pending=a}}s.lanes|=n,a=s.alternate,a!==null&&(a.lanes|=n),au(s.return,n,e),l.lanes|=n;break}a=a.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(E(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),au(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}Oe(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,Ar(e,n),i=it(i),r=r(i),e.flags|=1,Oe(t,e,r,n),e.child;case 14:return r=e.type,i=ut(r,e.pendingProps),i=ut(r.type,i),Lh(t,e,r,i,n);case 15:return Yg(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:ut(r,i),ho(t,e),e.tag=1,$e(r)?(t=!0,Po(e)):t=!1,Ar(e,n),Gg(e,r,i),cu(e,r,i,n),fu(null,e,r,!0,t,n);case 19:return em(t,e,n);case 22:return qg(t,e,n)}throw Error(E(156,e.tag))};function mm(t,e){return Vp(t,e)}function i1(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function tt(t,e,n,r){return new i1(t,e,n,r)}function Uc(t){return t=t.prototype,!(!t||!t.isReactComponent)}function s1(t){if(typeof t=="function")return Uc(t)?1:0;if(t!=null){if(t=t.$$typeof,t===rc)return 11;if(t===ic)return 14}return 2}function vn(t,e){var n=t.alternate;return n===null?(n=tt(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function go(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")Uc(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case mr:return Gn(n.children,i,s,e);case nc:o=8,i|=8;break;case Da:return t=tt(12,n,e,i|2),t.elementType=Da,t.lanes=s,t;case Ma:return t=tt(13,n,e,i),t.elementType=Ma,t.lanes=s,t;case La:return t=tt(19,n,e,i),t.elementType=La,t.lanes=s,t;case xp:return Il(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case kp:o=10;break e;case Ip:o=9;break e;case rc:o=11;break e;case ic:o=14;break e;case tn:o=16,r=null;break e}throw Error(E(130,t==null?t:typeof t,""))}return e=tt(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function Gn(t,e,n,r){return t=tt(7,t,r,e),t.lanes=n,t}function Il(t,e,n,r){return t=tt(22,t,r,e),t.elementType=xp,t.lanes=n,t.stateNode={isHidden:!1},t}function ma(t,e,n){return t=tt(6,t,null,e),t.lanes=n,t}function _a(t,e,n){return e=tt(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function o1(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Xl(0),this.expirationTimes=Xl(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Xl(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function jc(t,e,n,r,i,s,o,l,a){return t=new o1(t,e,n,l,a),e===1?(e=1,s===!0&&(e|=8)):e=0,s=tt(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Cc(s),t}function l1(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:gr,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function _m(t){if(!t)return Tn;t=t._reactInternals;e:{if(lr(t)!==t||t.tag!==1)throw Error(E(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if($e(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(E(171))}if(t.tag===1){var n=t.type;if($e(n))return _g(t,n,e)}return e}function ym(t,e,n,r,i,s,o,l,a){return t=jc(n,r,!0,t,i,s,o,l,a),t.context=_m(null),n=t.current,r=Me(),i=yn(n),s=Vt(r,i),s.callback=e??null,mn(n,s,i),t.current.lanes=i,Ss(t,i,r),He(t,r),t}function xl(t,e,n,r){var i=e.current,s=Me(),o=yn(i);return n=_m(n),e.context===null?e.context=n:e.pendingContext=n,e=Vt(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=mn(i,e,o),t!==null&&(_t(t,i,o,s),ao(t,i,o)),o}function Vo(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Qh(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function zc(t,e){Qh(t,e),(t=t.alternate)&&Qh(t,e)}function a1(){return null}var vm=typeof reportError=="function"?reportError:function(t){console.error(t)};function Wc(t){this._internalRoot=t}Tl.prototype.render=Wc.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(E(409));xl(t,e,null,null)};Tl.prototype.unmount=Wc.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Zn(function(){xl(null,t,null,null)}),e[Gt]=null}};function Tl(t){this._internalRoot=t}Tl.prototype.unstable_scheduleHydration=function(t){if(t){var e=qp();t={blockedOn:null,target:t,priority:e};for(var n=0;n<rn.length&&e!==0&&e<rn[n].priority;n++);rn.splice(n,0,t),n===0&&Jp(t)}};function Bc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Nl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Yh(){}function u1(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var u=Vo(o);s.call(u)}}var o=ym(e,r,t,0,null,!1,!1,"",Yh);return t._reactRootContainer=o,t[Gt]=o.current,ts(t.nodeType===8?t.parentNode:t),Zn(),o}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var l=r;r=function(){var u=Vo(a);l.call(u)}}var a=jc(t,0,!1,null,null,!1,!1,"",Yh);return t._reactRootContainer=a,t[Gt]=a.current,ts(t.nodeType===8?t.parentNode:t),Zn(function(){xl(e,a,n,r)}),a}function Rl(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var l=i;i=function(){var a=Vo(o);l.call(a)}}xl(e,o,t,i)}else o=u1(n,e,t,i,r);return Vo(o)}Qp=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Pi(e.pendingLanes);n!==0&&(lc(e,n|1),He(e,fe()),!(Y&6)&&(Kr=fe()+500,On()))}break;case 13:Zn(function(){var r=Kt(t,1);if(r!==null){var i=Me();_t(r,t,1,i)}}),zc(t,1)}};ac=function(t){if(t.tag===13){var e=Kt(t,134217728);if(e!==null){var n=Me();_t(e,t,134217728,n)}zc(t,134217728)}};Yp=function(t){if(t.tag===13){var e=yn(t),n=Kt(t,e);if(n!==null){var r=Me();_t(n,t,e,r)}zc(t,e)}};qp=function(){return X};Xp=function(t,e){var n=X;try{return X=t,e()}finally{X=n}};Ga=function(t,e,n){switch(e){case"input":if(ja(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=vl(r);if(!i)throw Error(E(90));Np(r),ja(r,i)}}}break;case"textarea":Pp(t,n);break;case"select":e=n.value,e!=null&&Nr(t,!!n.multiple,e,!1)}};Fp=Mc;Up=Zn;var c1={usingClientEntryPoint:!1,Events:[Es,wr,vl,Mp,Lp,Mc]},Ei={findFiberByHostInstance:zn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},d1={bundleType:Ei.bundleType,version:Ei.version,rendererPackageName:Ei.rendererPackageName,rendererConfig:Ei.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Jt.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Wp(t),t===null?null:t.stateNode},findFiberByHostInstance:Ei.findFiberByHostInstance||a1,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Zs=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Zs.isDisabled&&Zs.supportsFiber)try{gl=Zs.inject(d1),Tt=Zs}catch{}}qe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=c1;qe.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Bc(e))throw Error(E(200));return l1(t,e,null,n)};qe.createRoot=function(t,e){if(!Bc(t))throw Error(E(299));var n=!1,r="",i=vm;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=jc(t,1,!1,null,null,n,!1,r,i),t[Gt]=e.current,ts(t.nodeType===8?t.parentNode:t),new Wc(e)};qe.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(E(188)):(t=Object.keys(t).join(","),Error(E(268,t)));return t=Wp(e),t=t===null?null:t.stateNode,t};qe.flushSync=function(t){return Zn(t)};qe.hydrate=function(t,e,n){if(!Nl(e))throw Error(E(200));return Rl(null,t,e,!0,n)};qe.hydrateRoot=function(t,e,n){if(!Bc(t))throw Error(E(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=vm;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=ym(e,null,t,1,n??null,i,!1,s,o),t[Gt]=e.current,ts(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new Tl(e)};qe.render=function(t,e,n){if(!Nl(e))throw Error(E(200));return Rl(null,t,e,!1,n)};qe.unmountComponentAtNode=function(t){if(!Nl(t))throw Error(E(40));return t._reactRootContainer?(Zn(function(){Rl(null,null,t,!1,function(){t._reactRootContainer=null,t[Gt]=null})}),!0):!1};qe.unstable_batchedUpdates=Mc;qe.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!Nl(n))throw Error(E(200));if(t==null||t._reactInternals===void 0)throw Error(E(38));return Rl(t,e,n,!1,r)};qe.version="18.3.1-next-f1338f8080-20240426";function wm(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(wm)}catch(t){console.error(t)}}wm(),wp.exports=qe;var h1=wp.exports,qh=h1;Aa.createRoot=qh.createRoot,Aa.hydrateRoot=qh.hydrateRoot;const f1=()=>{};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sm={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x=function(t,e){if(!t)throw oi(e)},oi=function(t){return new Error("Firebase Database ("+Sm.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cm=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},p1=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],l=t[n++],a=((i&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(a>>10)),e[r++]=String.fromCharCode(56320+(a&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Vc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,l=o?t[i+1]:0,a=i+2<t.length,u=a?t[i+2]:0,h=s>>2,d=(s&3)<<4|l>>4;let c=(l&15)<<2|u>>6,_=u&63;a||(_=64,o||(c=64)),r.push(n[h],n[d],n[c],n[_])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Cm(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):p1(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const u=i<t.length?n[t.charAt(i)]:64;++i;const d=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||l==null||u==null||d==null)throw new g1;const c=s<<2|l>>4;if(r.push(c),u!==64){const _=l<<4&240|u>>2;if(r.push(_),d!==64){const y=u<<6&192|d;r.push(y)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class g1 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Em=function(t){const e=Cm(t);return Vc.encodeByteArray(e,!0)},$o=function(t){return Em(t).replace(/\./g,"")},Ho=function(t){try{return Vc.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m1(t){return km(void 0,t)}function km(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!_1(n)||(t[n]=km(t[n],e[n]));return t}function _1(t){return t!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y1(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v1=()=>y1().__FIREBASE_DEFAULTS__,w1=()=>{if(typeof process>"u"||typeof process.env>"u")return;const t={}.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},S1=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Ho(t[1]);return e&&JSON.parse(e)},$c=()=>{try{return f1()||v1()||w1()||S1()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Im=t=>{var e,n;return(n=(e=$c())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},C1=t=>{const e=Im(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},xm=()=>{var t;return(t=$c())==null?void 0:t.config},Tm=t=>{var e;return(e=$c())==null?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Is{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function li(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Nm(t){return(await fetch(t,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function E1(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...t},l="";return[$o(JSON.stringify(n)),$o(JSON.stringify(o)),l].join(".")}const Wi={};function k1(){const t={prod:[],emulator:[]};for(const e of Object.keys(Wi))Wi[e]?t.emulator.push(e):t.prod.push(e);return t}function I1(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let Xh=!1;function Rm(t,e){if(typeof window>"u"||typeof document>"u"||!li(window.location.host)||Wi[t]===e||Wi[t]||Xh)return;Wi[t]=e;function n(c){return`__firebase__banner__${c}`}const r="__firebase__banner",s=k1().prod.length>0;function o(){const c=document.getElementById(r);c&&c.remove()}function l(c){c.style.display="flex",c.style.background="#7faaf0",c.style.position="fixed",c.style.bottom="5px",c.style.left="5px",c.style.padding=".5em",c.style.borderRadius="5px",c.style.alignItems="center"}function a(c,_){c.setAttribute("width","24"),c.setAttribute("id",_),c.setAttribute("height","24"),c.setAttribute("viewBox","0 0 24 24"),c.setAttribute("fill","none"),c.style.marginLeft="-6px"}function u(){const c=document.createElement("span");return c.style.cursor="pointer",c.style.marginLeft="16px",c.style.fontSize="24px",c.innerHTML=" &times;",c.onclick=()=>{Xh=!0,o()},c}function h(c,_){c.setAttribute("id",_),c.innerText="Learn more",c.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",c.setAttribute("target","__blank"),c.style.paddingLeft="5px",c.style.textDecoration="underline"}function d(){const c=I1(r),_=n("text"),y=document.getElementById(_)||document.createElement("span"),v=n("learnmore"),M=document.getElementById(v)||document.createElement("a"),g=n("preprendIcon"),f=document.getElementById(g)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(c.created){const m=c.element;l(m),h(M,v);const w=u();a(f,g),m.append(f,y,M,w),document.body.appendChild(m)}s?(y.innerText="Preview backend disconnected.",f.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(f.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,y.innerText="Preview backend running in this workspace."),y.setAttribute("id",_)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",d):d()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Hc(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Fe())}function x1(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function T1(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Pm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function N1(){const t=Fe();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function bm(){return Sm.NODE_ADMIN===!0}function R1(){try{return typeof indexedDB=="object"}catch{return!1}}function P1(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b1="FirebaseError";class Dn extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=b1,Object.setPrototypeOf(this,Dn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,xs.prototype.create)}}class xs{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?A1(s,r):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new Dn(i,l,r)}}function A1(t,e){return t.replace(O1,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const O1=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cs(t){return JSON.parse(t)}function ye(t){return JSON.stringify(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Am=function(t){let e={},n={},r={},i="";try{const s=t.split(".");e=cs(Ho(s[0])||""),n=cs(Ho(s[1])||""),i=s[2],r=n.d||{},delete n.d}catch{}return{header:e,claims:n,data:r,signature:i}},D1=function(t){const e=Am(t),n=e.claims;return!!n&&typeof n=="object"&&n.hasOwnProperty("iat")},M1=function(t){const e=Am(t).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bt(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Qr(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]}function Iu(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Go(t,e,n){const r={};for(const i in t)Object.prototype.hasOwnProperty.call(t,i)&&(r[i]=e.call(n,t[i],i,t));return r}function er(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(Jh(s)&&Jh(o)){if(!er(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function Jh(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ai(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L1{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,n){n||(n=0);const r=this.W_;if(typeof e=="string")for(let d=0;d<16;d++)r[d]=e.charCodeAt(n)<<24|e.charCodeAt(n+1)<<16|e.charCodeAt(n+2)<<8|e.charCodeAt(n+3),n+=4;else for(let d=0;d<16;d++)r[d]=e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3],n+=4;for(let d=16;d<80;d++){const c=r[d-3]^r[d-8]^r[d-14]^r[d-16];r[d]=(c<<1|c>>>31)&4294967295}let i=this.chain_[0],s=this.chain_[1],o=this.chain_[2],l=this.chain_[3],a=this.chain_[4],u,h;for(let d=0;d<80;d++){d<40?d<20?(u=l^s&(o^l),h=1518500249):(u=s^o^l,h=1859775393):d<60?(u=s&o|l&(s|o),h=2400959708):(u=s^o^l,h=3395469782);const c=(i<<5|i>>>27)+u+a+h+r[d]&4294967295;a=l,l=o,o=(s<<30|s>>>2)&4294967295,s=i,i=c}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+s&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+a&4294967295}update(e,n){if(e==null)return;n===void 0&&(n=e.length);const r=n-this.blockSize;let i=0;const s=this.buf_;let o=this.inbuf_;for(;i<n;){if(o===0)for(;i<=r;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<n;)if(s[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(s),o=0;break}}else for(;i<n;)if(s[o]=e[i],++o,++i,o===this.blockSize){this.compress_(s),o=0;break}}this.inbuf_=o,this.total_+=n}digest(){const e=[];let n=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=n&255,n/=256;this.compress_(this.buf_);let r=0;for(let i=0;i<5;i++)for(let s=24;s>=0;s-=8)e[r]=this.chain_[i]>>s&255,++r;return e}}function F1(t,e){const n=new U1(t,e);return n.subscribe.bind(n)}class U1{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");j1(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=ya),i.error===void 0&&(i.error=ya),i.complete===void 0&&(i.complete=ya);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function j1(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function ya(){}function Pl(t,e){return`${t} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const z1=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);if(i>=55296&&i<=56319){const s=i-55296;r++,x(r<t.length,"Surrogate pair missing trail surrogate.");const o=t.charCodeAt(r)-56320;i=65536+(s<<10)+o}i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):i<65536?(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},bl=function(t){let e=0;for(let n=0;n<t.length;n++){const r=t.charCodeAt(n);r<128?e++:r<2048?e+=2:r>=55296&&r<=56319?(e+=4,n++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(t){return t&&t._delegate?t._delegate:t}class tr{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Un="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W1{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Is;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(V1(e))try{this.getOrInitializeService({instanceIdentifier:Un})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Un){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Un){return this.instances.has(e)}getOptions(e=Un){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&o.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:B1(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Un){return this.component?this.component.multipleInstances?e:Un:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function B1(t){return t===Un?void 0:t}function V1(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $1{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new W1(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var J;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(J||(J={}));const H1={debug:J.DEBUG,verbose:J.VERBOSE,info:J.INFO,warn:J.WARN,error:J.ERROR,silent:J.SILENT},G1=J.INFO,K1={[J.DEBUG]:"log",[J.VERBOSE]:"log",[J.INFO]:"info",[J.WARN]:"warn",[J.ERROR]:"error"},Q1=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=K1[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Gc{constructor(e){this.name=e,this._logLevel=G1,this._logHandler=Q1,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in J))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?H1[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,J.DEBUG,...e),this._logHandler(this,J.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,J.VERBOSE,...e),this._logHandler(this,J.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,J.INFO,...e),this._logHandler(this,J.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,J.WARN,...e),this._logHandler(this,J.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,J.ERROR,...e),this._logHandler(this,J.ERROR,...e)}}const Y1=(t,e)=>e.some(n=>t instanceof n);let Zh,ef;function q1(){return Zh||(Zh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function X1(){return ef||(ef=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Om=new WeakMap,xu=new WeakMap,Dm=new WeakMap,va=new WeakMap,Kc=new WeakMap;function J1(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(wn(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Om.set(n,t)}).catch(()=>{}),Kc.set(e,t),e}function Z1(t){if(xu.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});xu.set(t,e)}let Tu={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return xu.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Dm.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return wn(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ew(t){Tu=t(Tu)}function tw(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(wa(this),e,...n);return Dm.set(r,e.sort?e.sort():[e]),wn(r)}:X1().includes(t)?function(...e){return t.apply(wa(this),e),wn(Om.get(this))}:function(...e){return wn(t.apply(wa(this),e))}}function nw(t){return typeof t=="function"?tw(t):(t instanceof IDBTransaction&&Z1(t),Y1(t,q1())?new Proxy(t,Tu):t)}function wn(t){if(t instanceof IDBRequest)return J1(t);if(va.has(t))return va.get(t);const e=nw(t);return e!==t&&(va.set(t,e),Kc.set(e,t)),e}const wa=t=>Kc.get(t);function rw(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),l=wn(o);return r&&o.addEventListener("upgradeneeded",a=>{r(wn(o.result),a.oldVersion,a.newVersion,wn(o.transaction),a)}),n&&o.addEventListener("blocked",a=>n(a.oldVersion,a.newVersion,a)),l.then(a=>{s&&a.addEventListener("close",()=>s()),i&&a.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),l}const iw=["get","getKey","getAll","getAllKeys","count"],sw=["put","add","delete","clear"],Sa=new Map;function tf(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Sa.get(e))return Sa.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=sw.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||iw.includes(n)))return;const s=async function(o,...l){const a=this.transaction(o,i?"readwrite":"readonly");let u=a.store;return r&&(u=u.index(l.shift())),(await Promise.all([u[n](...l),i&&a.done]))[0]};return Sa.set(e,s),s}ew(t=>({...t,get:(e,n,r)=>tf(e,n)||t.get(e,n,r),has:(e,n)=>!!tf(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ow{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(lw(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function lw(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Nu="@firebase/app",nf="0.14.6";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt=new Gc("@firebase/app"),aw="@firebase/app-compat",uw="@firebase/analytics-compat",cw="@firebase/analytics",dw="@firebase/app-check-compat",hw="@firebase/app-check",fw="@firebase/auth",pw="@firebase/auth-compat",gw="@firebase/database",mw="@firebase/data-connect",_w="@firebase/database-compat",yw="@firebase/functions",vw="@firebase/functions-compat",ww="@firebase/installations",Sw="@firebase/installations-compat",Cw="@firebase/messaging",Ew="@firebase/messaging-compat",kw="@firebase/performance",Iw="@firebase/performance-compat",xw="@firebase/remote-config",Tw="@firebase/remote-config-compat",Nw="@firebase/storage",Rw="@firebase/storage-compat",Pw="@firebase/firestore",bw="@firebase/ai",Aw="@firebase/firestore-compat",Ow="firebase",Dw="12.6.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ru="[DEFAULT]",Mw={[Nu]:"fire-core",[aw]:"fire-core-compat",[cw]:"fire-analytics",[uw]:"fire-analytics-compat",[hw]:"fire-app-check",[dw]:"fire-app-check-compat",[fw]:"fire-auth",[pw]:"fire-auth-compat",[gw]:"fire-rtdb",[mw]:"fire-data-connect",[_w]:"fire-rtdb-compat",[yw]:"fire-fn",[vw]:"fire-fn-compat",[ww]:"fire-iid",[Sw]:"fire-iid-compat",[Cw]:"fire-fcm",[Ew]:"fire-fcm-compat",[kw]:"fire-perf",[Iw]:"fire-perf-compat",[xw]:"fire-rc",[Tw]:"fire-rc-compat",[Nw]:"fire-gcs",[Rw]:"fire-gcs-compat",[Pw]:"fire-fst",[Aw]:"fire-fst-compat",[bw]:"fire-vertex","fire-js":"fire-js",[Ow]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ko=new Map,Lw=new Map,Pu=new Map;function rf(t,e){try{t.container.addComponent(e)}catch(n){Yt.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Yr(t){const e=t.name;if(Pu.has(e))return Yt.debug(`There were multiple attempts to register component ${e}.`),!1;Pu.set(e,t);for(const n of Ko.values())rf(n,t);for(const n of Lw.values())rf(n,t);return!0}function Qc(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function ht(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fw={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Sn=new xs("app","Firebase",Fw);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uw{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new tr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Sn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ui=Dw;function Mm(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Ru,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Sn.create("bad-app-name",{appName:String(i)});if(n||(n=xm()),!n)throw Sn.create("no-options");const s=Ko.get(i);if(s){if(er(n,s.options)&&er(r,s.config))return s;throw Sn.create("duplicate-app",{appName:i})}const o=new $1(i);for(const a of Pu.values())o.addComponent(a);const l=new Uw(n,r,o);return Ko.set(i,l),l}function Lm(t=Ru){const e=Ko.get(t);if(!e&&t===Ru&&xm())return Mm();if(!e)throw Sn.create("no-app",{appName:t});return e}function Cn(t,e,n){let r=Mw[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const o=[`Unable to register library "${r}" with version "${e}":`];i&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&o.push("and"),s&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Yt.warn(o.join(" "));return}Yr(new tr(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jw="firebase-heartbeat-database",zw=1,ds="firebase-heartbeat-store";let Ca=null;function Fm(){return Ca||(Ca=rw(jw,zw,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(ds)}catch(n){console.warn(n)}}}}).catch(t=>{throw Sn.create("idb-open",{originalErrorMessage:t.message})})),Ca}async function Ww(t){try{const n=(await Fm()).transaction(ds),r=await n.objectStore(ds).get(Um(t));return await n.done,r}catch(e){if(e instanceof Dn)Yt.warn(e.message);else{const n=Sn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Yt.warn(n.message)}}}async function sf(t,e){try{const r=(await Fm()).transaction(ds,"readwrite");await r.objectStore(ds).put(e,Um(t)),await r.done}catch(n){if(n instanceof Dn)Yt.warn(n.message);else{const r=Sn.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Yt.warn(r.message)}}}function Um(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bw=1024,Vw=30;class $w{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Gw(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=of();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Vw){const o=Kw(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Yt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=of(),{heartbeatsToSend:r,unsentEntries:i}=Hw(this._heartbeatsCache.heartbeats),s=$o(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Yt.warn(n),""}}}function of(){return new Date().toISOString().substring(0,10)}function Hw(t,e=Bw){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),lf(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),lf(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Gw{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return R1()?P1().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Ww(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return sf(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return sf(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function lf(t){return $o(JSON.stringify({version:2,heartbeats:t})).length}function Kw(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qw(t){Yr(new tr("platform-logger",e=>new ow(e),"PRIVATE")),Yr(new tr("heartbeat",e=>new $w(e),"PRIVATE")),Cn(Nu,nf,t),Cn(Nu,nf,"esm2020"),Cn("fire-js","")}Qw("");const af="@firebase/database",uf="1.1.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let jm="";function Yw(t){jm=t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qw{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,n){n==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),ye(n))}get(e){const n=this.domStorage_.getItem(this.prefixedName_(e));return n==null?null:cs(n)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xw{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,n){n==null?delete this.cache_[e]:this.cache_[e]=n}get(e){return bt(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zm=function(t){try{if(typeof window<"u"&&typeof window[t]<"u"){const e=window[t];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new qw(e)}}catch{}return new Xw},Vn=zm("localStorage"),bu=zm("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dr=new Gc("@firebase/database"),Jw=function(){let t=1;return function(){return t++}}(),Wm=function(t){const e=z1(t),n=new L1;n.update(e);const r=n.digest();return Vc.encodeByteArray(r)},Ts=function(...t){let e="";for(let n=0;n<t.length;n++){const r=t[n];Array.isArray(r)||r&&typeof r=="object"&&typeof r.length=="number"?e+=Ts.apply(null,r):typeof r=="object"?e+=ye(r):e+=r,e+=" "}return e};let Kn=null,cf=!0;const Zw=function(t,e){x(!e||t===!0||t===!1,"Can't turn on custom loggers persistently."),t===!0?(Dr.logLevel=J.VERBOSE,Kn=Dr.log.bind(Dr),e&&bu.set("logging_enabled",!0)):typeof t=="function"?Kn=t:(Kn=null,bu.remove("logging_enabled"))},Ie=function(...t){if(cf===!0&&(cf=!1,Kn===null&&bu.get("logging_enabled")===!0&&Zw(!0)),Kn){const e=Ts.apply(null,t);Kn(e)}},Ns=function(t){return function(...e){Ie(t,...e)}},Au=function(...t){const e="FIREBASE INTERNAL ERROR: "+Ts(...t);Dr.error(e)},qt=function(...t){const e=`FIREBASE FATAL ERROR: ${Ts(...t)}`;throw Dr.error(e),new Error(e)},Le=function(...t){const e="FIREBASE WARNING: "+Ts(...t);Dr.warn(e)},eS=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&Le("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Yc=function(t){return typeof t=="number"&&(t!==t||t===Number.POSITIVE_INFINITY||t===Number.NEGATIVE_INFINITY)},tS=function(t){if(document.readyState==="complete")t();else{let e=!1;const n=function(){if(!document.body){setTimeout(n,Math.floor(10));return}e||(e=!0,t())};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&n()}),window.attachEvent("onload",n))}},qr="[MIN_NAME]",nr="[MAX_NAME]",ar=function(t,e){if(t===e)return 0;if(t===qr||e===nr)return-1;if(e===qr||t===nr)return 1;{const n=df(t),r=df(e);return n!==null?r!==null?n-r===0?t.length-e.length:n-r:-1:r!==null?1:t<e?-1:1}},nS=function(t,e){return t===e?0:t<e?-1:1},ki=function(t,e){if(e&&t in e)return e[t];throw new Error("Missing required key ("+t+") in object: "+ye(e))},qc=function(t){if(typeof t!="object"||t===null)return ye(t);const e=[];for(const r in t)e.push(r);e.sort();let n="{";for(let r=0;r<e.length;r++)r!==0&&(n+=","),n+=ye(e[r]),n+=":",n+=qc(t[e[r]]);return n+="}",n},Bm=function(t,e){const n=t.length;if(n<=e)return[t];const r=[];for(let i=0;i<n;i+=e)i+e>n?r.push(t.substring(i,n)):r.push(t.substring(i,i+e));return r};function Ne(t,e){for(const n in t)t.hasOwnProperty(n)&&e(n,t[n])}const Vm=function(t){x(!Yc(t),"Invalid JSON number");const e=11,n=52,r=(1<<e-1)-1;let i,s,o,l,a;t===0?(s=0,o=0,i=1/t===-1/0?1:0):(i=t<0,t=Math.abs(t),t>=Math.pow(2,1-r)?(l=Math.min(Math.floor(Math.log(t)/Math.LN2),r),s=l+r,o=Math.round(t*Math.pow(2,n-l)-Math.pow(2,n))):(s=0,o=Math.round(t/Math.pow(2,1-r-n))));const u=[];for(a=n;a;a-=1)u.push(o%2?1:0),o=Math.floor(o/2);for(a=e;a;a-=1)u.push(s%2?1:0),s=Math.floor(s/2);u.push(i?1:0),u.reverse();const h=u.join("");let d="";for(a=0;a<64;a+=8){let c=parseInt(h.substr(a,8),2).toString(16);c.length===1&&(c="0"+c),d=d+c}return d.toLowerCase()},rS=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},iS=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function sS(t,e){let n="Unknown Error";t==="too_big"?n="The data requested exceeds the maximum size that can be accessed with a single request.":t==="permission_denied"?n="Client doesn't have permission to access the desired data.":t==="unavailable"&&(n="The service is unavailable");const r=new Error(t+" at "+e._path.toString()+": "+n);return r.code=t.toUpperCase(),r}const oS=new RegExp("^-?(0*)\\d{1,10}$"),lS=-2147483648,aS=2147483647,df=function(t){if(oS.test(t)){const e=Number(t);if(e>=lS&&e<=aS)return e}return null},ci=function(t){try{t()}catch(e){setTimeout(()=>{const n=e.stack||"";throw Le("Exception was thrown by user callback.",n),e},Math.floor(0))}},uS=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},Bi=function(t,e){const n=setTimeout(t,e);return typeof n=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(n):typeof n=="object"&&n.unref&&n.unref(),n};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cS{constructor(e,n){this.appCheckProvider=n,this.appName=e.name,ht(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=n==null?void 0:n.getImmediate({optional:!0}),this.appCheck||n==null||n.get().then(r=>this.appCheck=r)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((n,r)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(n,r):n(null)},0)})}addTokenChangeListener(e){var n;(n=this.appCheckProvider)==null||n.get().then(r=>r.addTokenListener(e))}notifyForInvalidToken(){Le(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dS{constructor(e,n,r){this.appName_=e,this.firebaseOptions_=n,this.authProvider_=r,this.auth_=null,this.auth_=r.getImmediate({optional:!0}),this.auth_||r.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(n=>n&&n.code==="auth/token-not-initialized"?(Ie("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(n)):new Promise((n,r)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(n,r):n(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(n=>n.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(n=>n.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',Le(e)}}class Mr{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Mr.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xc="5",$m="v",Hm="s",Gm="r",Km="f",Qm=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Ym="ls",qm="p",Ou="ac",Xm="websocket",Jm="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{constructor(e,n,r,i,s=!1,o="",l=!1,a=!1,u=null){this.secure=n,this.namespace=r,this.webSocketOnly=i,this.nodeAdmin=s,this.persistenceKey=o,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=a,this.emulatorOptions=u,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Vn.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Vn.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",n=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${n}`}}function hS(t){return t.host!==t.internalHost||t.isCustomHost()||t.includeNamespaceInQueryParams}function e_(t,e,n){x(typeof e=="string","typeof type must == string"),x(typeof n=="object","typeof params must == object");let r;if(e===Xm)r=(t.secure?"wss://":"ws://")+t.internalHost+"/.ws?";else if(e===Jm)r=(t.secure?"https://":"http://")+t.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);hS(t)&&(n.ns=t.namespace);const i=[];return Ne(n,(s,o)=>{i.push(s+"="+o)}),r+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fS{constructor(){this.counters_={}}incrementCounter(e,n=1){bt(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=n}get(){return m1(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ea={},ka={};function Jc(t){const e=t.toString();return Ea[e]||(Ea[e]=new fS),Ea[e]}function pS(t,e){const n=t.toString();return ka[n]||(ka[n]=e()),ka[n]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gS{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,n){this.closeAfterResponse=e,this.onClose=n,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,n){for(this.pendingResponses[e]=n;this.pendingResponses[this.currentResponseNum];){const r=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<r.length;++i)r[i]&&ci(()=>{this.onMessage_(r[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hf="start",mS="close",_S="pLPCommand",yS="pRTLPCB",t_="id",n_="pw",r_="ser",vS="cb",wS="seg",SS="ts",CS="d",ES="dframe",i_=1870,s_=30,kS=i_-s_,IS=25e3,xS=3e4;class Tr{constructor(e,n,r,i,s,o,l){this.connId=e,this.repoInfo=n,this.applicationId=r,this.appCheckToken=i,this.authToken=s,this.transportSessionId=o,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Ns(e),this.stats_=Jc(n),this.urlFn=a=>(this.appCheckToken&&(a[Ou]=this.appCheckToken),e_(n,Jm,a))}open(e,n){this.curSegmentNum=0,this.onDisconnect_=n,this.myPacketOrderer=new gS(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(xS)),tS(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Zc((...s)=>{const[o,l,a,u,h]=s;if(this.incrementIncomingBytes_(s),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===hf)this.id=l,this.password=a;else if(o===mS)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...s)=>{const[o,l]=s;this.incrementIncomingBytes_(s),this.myPacketOrderer.handleResponse(o,l)},()=>{this.onClosed_()},this.urlFn);const r={};r[hf]="t",r[r_]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(r[vS]=this.scriptTagHolder.uniqueCallbackIdentifier),r[$m]=Xc,this.transportSessionId&&(r[Hm]=this.transportSessionId),this.lastSessionId&&(r[Ym]=this.lastSessionId),this.applicationId&&(r[qm]=this.applicationId),this.appCheckToken&&(r[Ou]=this.appCheckToken),typeof location<"u"&&location.hostname&&Qm.test(location.hostname)&&(r[Gm]=Km);const i=this.urlFn(r);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Tr.forceAllow_=!0}static forceDisallow(){Tr.forceDisallow_=!0}static isAvailable(){return Tr.forceAllow_?!0:!Tr.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!rS()&&!iS()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const n=ye(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const r=Em(n),i=Bm(r,kS);for(let s=0;s<i.length;s++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[s]),this.curSegmentNum++}addDisconnectPingFrame(e,n){this.myDisconnFrame=document.createElement("iframe");const r={};r[ES]="t",r[t_]=e,r[n_]=n,this.myDisconnFrame.src=this.urlFn(r),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const n=ye(e).length;this.bytesReceived+=n,this.stats_.incrementCounter("bytes_received",n)}}class Zc{constructor(e,n,r,i){this.onDisconnect=r,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=Jw(),window[_S+this.uniqueCallbackIdentifier]=e,window[yS+this.uniqueCallbackIdentifier]=n,this.myIFrame=Zc.createIFrame_();let s="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(s='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+s+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(l){Ie("frame writing exception"),l.stack&&Ie(l.stack),Ie(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||Ie("No IE domain setting required")}catch{const r=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+r+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,n){for(this.myID=e,this.myPW=n,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[t_]=this.myID,e[n_]=this.myPW,e[r_]=this.currentSerial;let n=this.urlFn(e),r="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+s_+r.length<=i_;){const o=this.pendingSegs.shift();r=r+"&"+wS+i+"="+o.seg+"&"+SS+i+"="+o.ts+"&"+CS+i+"="+o.d,i++}return n=n+r,this.addLongPollTag_(n,this.currentSerial),!0}else return!1}enqueueSegment(e,n,r){this.pendingSegs.push({seg:e,ts:n,d:r}),this.alive&&this.newRequest_()}addLongPollTag_(e,n){this.outstandingRequests.add(n);const r=()=>{this.outstandingRequests.delete(n),this.newRequest_()},i=setTimeout(r,Math.floor(IS)),s=()=>{clearTimeout(i),r()};this.addTag(e,s)}addTag(e,n){setTimeout(()=>{try{if(!this.sendNewPolls)return;const r=this.myIFrame.doc.createElement("script");r.type="text/javascript",r.async=!0,r.src=e,r.onload=r.onreadystatechange=function(){const i=r.readyState;(!i||i==="loaded"||i==="complete")&&(r.onload=r.onreadystatechange=null,r.parentNode&&r.parentNode.removeChild(r),n())},r.onerror=()=>{Ie("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(r)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TS=16384,NS=45e3;let Qo=null;typeof MozWebSocket<"u"?Qo=MozWebSocket:typeof WebSocket<"u"&&(Qo=WebSocket);class ft{constructor(e,n,r,i,s,o,l){this.connId=e,this.applicationId=r,this.appCheckToken=i,this.authToken=s,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Ns(this.connId),this.stats_=Jc(n),this.connURL=ft.connectionURL_(n,o,l,i,r),this.nodeAdmin=n.nodeAdmin}static connectionURL_(e,n,r,i,s){const o={};return o[$m]=Xc,typeof location<"u"&&location.hostname&&Qm.test(location.hostname)&&(o[Gm]=Km),n&&(o[Hm]=n),r&&(o[Ym]=r),i&&(o[Ou]=i),s&&(o[qm]=s),e_(e,Xm,o)}open(e,n){this.onDisconnect=n,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Vn.set("previous_websocket_failure",!0);try{let r;bm(),this.mySock=new Qo(this.connURL,[],r)}catch(r){this.log_("Error instantiating WebSocket.");const i=r.message||r.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=r=>{this.handleIncomingFrame(r)},this.mySock.onerror=r=>{this.log_("WebSocket error.  Closing connection.");const i=r.message||r.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){ft.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const n=/Android ([0-9]{0,}\.[0-9]{0,})/,r=navigator.userAgent.match(n);r&&r.length>1&&parseFloat(r[1])<4.4&&(e=!0)}return!e&&Qo!==null&&!ft.forceDisallow_}static previouslyFailed(){return Vn.isInMemoryStorage||Vn.get("previous_websocket_failure")===!0}markConnectionHealthy(){Vn.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const n=this.frames.join("");this.frames=null;const r=cs(n);this.onMessage(r)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(x(this.frames===null,"We already have a frame buffer"),e.length<=6){const n=Number(e);if(!isNaN(n))return this.handleNewFrameCount_(n),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const n=e.data;if(this.bytesReceived+=n.length,this.stats_.incrementCounter("bytes_received",n.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(n);else{const r=this.extractFrameCount_(n);r!==null&&this.appendFrame_(r)}}send(e){this.resetKeepAlive();const n=ye(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const r=Bm(n,TS);r.length>1&&this.sendString_(String(r.length));for(let i=0;i<r.length;i++)this.sendString_(r[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(NS))}sendString_(e){try{this.mySock.send(e)}catch(n){this.log_("Exception thrown from WebSocket.send():",n.message||n.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}ft.responsesRequiredToBeHealthy=2;ft.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{static get ALL_TRANSPORTS(){return[Tr,ft]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const n=ft&&ft.isAvailable();let r=n&&!ft.previouslyFailed();if(e.webSocketOnly&&(n||Le("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),r=!0),r)this.transports_=[ft];else{const i=this.transports_=[];for(const s of hs.ALL_TRANSPORTS)s&&s.isAvailable()&&i.push(s);hs.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}hs.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RS=6e4,PS=5e3,bS=10*1024,AS=100*1024,Ia="t",ff="d",OS="s",pf="r",DS="e",gf="o",mf="a",_f="n",yf="p",MS="h";class LS{constructor(e,n,r,i,s,o,l,a,u,h){this.id=e,this.repoInfo_=n,this.applicationId_=r,this.appCheckToken_=i,this.authToken_=s,this.onMessage_=o,this.onReady_=l,this.onDisconnect_=a,this.onKill_=u,this.lastSessionId=h,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Ns("c:"+this.id+":"),this.transportManager_=new hs(n),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.conn_),r=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(n,r)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=Bi(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>AS?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>bS?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return n=>{e===this.conn_?this.onConnectionLost_(n):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return n=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(n):e===this.secondaryConn_?this.onSecondaryMessageReceived_(n):this.log_("message on old connection"))}}sendRequest(e){const n={t:"d",d:e};this.sendData_(n)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Ia in e){const n=e[Ia];n===mf?this.upgradeIfSecondaryHealthy_():n===pf?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):n===gf&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const n=ki("t",e),r=ki("d",e);if(n==="c")this.onSecondaryControl_(r);else if(n==="d")this.pendingDataMessages.push(r);else throw new Error("Unknown protocol layer: "+n)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:yf,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:mf,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:_f,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const n=ki("t",e),r=ki("d",e);n==="c"?this.onControl_(r):n==="d"&&this.onDataMessage_(r)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const n=ki(Ia,e);if(ff in e){const r=e[ff];if(n===MS){const i={...r};this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(n===_f){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else n===OS?this.onConnectionShutdown_(r):n===pf?this.onReset_(r):n===DS?Au("Server Error: "+r):n===gf?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Au("Unknown control packet command: "+n)}}onHandshake_(e){const n=e.ts,r=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,n),Xc!==r&&Le("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.secondaryConn_),r=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(n,r),Bi(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(RS))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,n){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(n,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Bi(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(PS))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:yf,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Vn.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o_{put(e,n,r,i){}merge(e,n,r,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,n,r){}onDisconnectMerge(e,n,r){}onDisconnectCancel(e,n){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l_{constructor(e){this.allowedEvents_=e,this.listeners_={},x(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...n){if(Array.isArray(this.listeners_[e])){const r=[...this.listeners_[e]];for(let i=0;i<r.length;i++)r[i].callback.apply(r[i].context,n)}}on(e,n,r){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:n,context:r});const i=this.getInitialEvent(e);i&&n.apply(r,i)}off(e,n,r){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let s=0;s<i.length;s++)if(i[s].callback===n&&(!r||r===i[s].context)){i.splice(s,1);return}}validateEventType_(e){x(this.allowedEvents_.find(n=>n===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yo extends l_{static getInstance(){return new Yo}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Hc()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return x(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vf=32,wf=768;class Z{constructor(e,n){if(n===void 0){this.pieces_=e.split("/");let r=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[r]=this.pieces_[i],r++);this.pieces_.length=r,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=n}toString(){let e="";for(let n=this.pieceNum_;n<this.pieces_.length;n++)this.pieces_[n]!==""&&(e+="/"+this.pieces_[n]);return e||"/"}}function q(){return new Z("")}function V(t){return t.pieceNum_>=t.pieces_.length?null:t.pieces_[t.pieceNum_]}function Nn(t){return t.pieces_.length-t.pieceNum_}function te(t){let e=t.pieceNum_;return e<t.pieces_.length&&e++,new Z(t.pieces_,e)}function ed(t){return t.pieceNum_<t.pieces_.length?t.pieces_[t.pieces_.length-1]:null}function FS(t){let e="";for(let n=t.pieceNum_;n<t.pieces_.length;n++)t.pieces_[n]!==""&&(e+="/"+encodeURIComponent(String(t.pieces_[n])));return e||"/"}function fs(t,e=0){return t.pieces_.slice(t.pieceNum_+e)}function a_(t){if(t.pieceNum_>=t.pieces_.length)return null;const e=[];for(let n=t.pieceNum_;n<t.pieces_.length-1;n++)e.push(t.pieces_[n]);return new Z(e,0)}function ce(t,e){const n=[];for(let r=t.pieceNum_;r<t.pieces_.length;r++)n.push(t.pieces_[r]);if(e instanceof Z)for(let r=e.pieceNum_;r<e.pieces_.length;r++)n.push(e.pieces_[r]);else{const r=e.split("/");for(let i=0;i<r.length;i++)r[i].length>0&&n.push(r[i])}return new Z(n,0)}function H(t){return t.pieceNum_>=t.pieces_.length}function De(t,e){const n=V(t),r=V(e);if(n===null)return e;if(n===r)return De(te(t),te(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+t+")")}function US(t,e){const n=fs(t,0),r=fs(e,0);for(let i=0;i<n.length&&i<r.length;i++){const s=ar(n[i],r[i]);if(s!==0)return s}return n.length===r.length?0:n.length<r.length?-1:1}function td(t,e){if(Nn(t)!==Nn(e))return!1;for(let n=t.pieceNum_,r=e.pieceNum_;n<=t.pieces_.length;n++,r++)if(t.pieces_[n]!==e.pieces_[r])return!1;return!0}function nt(t,e){let n=t.pieceNum_,r=e.pieceNum_;if(Nn(t)>Nn(e))return!1;for(;n<t.pieces_.length;){if(t.pieces_[n]!==e.pieces_[r])return!1;++n,++r}return!0}class jS{constructor(e,n){this.errorPrefix_=n,this.parts_=fs(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let r=0;r<this.parts_.length;r++)this.byteLength_+=bl(this.parts_[r]);u_(this)}}function zS(t,e){t.parts_.length>0&&(t.byteLength_+=1),t.parts_.push(e),t.byteLength_+=bl(e),u_(t)}function WS(t){const e=t.parts_.pop();t.byteLength_-=bl(e),t.parts_.length>0&&(t.byteLength_-=1)}function u_(t){if(t.byteLength_>wf)throw new Error(t.errorPrefix_+"has a key path longer than "+wf+" bytes ("+t.byteLength_+").");if(t.parts_.length>vf)throw new Error(t.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+vf+") or object contains a cycle "+jn(t))}function jn(t){return t.parts_.length===0?"":"in property '"+t.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nd extends l_{static getInstance(){return new nd}constructor(){super(["visible"]);let e,n;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(n="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(n="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(n="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(n="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,n&&document.addEventListener(n,()=>{const r=!document[e];r!==this.visible_&&(this.visible_=r,this.trigger("visible",r))},!1)}getInitialEvent(e){return x(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ii=1e3,BS=60*5*1e3,Sf=30*1e3,VS=1.3,$S=3e4,HS="server_kill",Cf=3;class $t extends o_{constructor(e,n,r,i,s,o,l,a){if(super(),this.repoInfo_=e,this.applicationId_=n,this.onDataUpdate_=r,this.onConnectStatus_=i,this.onServerInfoUpdate_=s,this.authTokenProvider_=o,this.appCheckTokenProvider_=l,this.authOverride_=a,this.id=$t.nextPersistentConnectionId_++,this.log_=Ns("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Ii,this.maxReconnectDelay_=BS,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,a&&!bm())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");nd.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Yo.getInstance().on("online",this.onOnline_,this)}sendRequest(e,n,r){const i=++this.requestNumber_,s={r:i,a:e,b:n};this.log_(ye(s)),x(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(s),r&&(this.requestCBHash_[i]=r)}get(e){this.initConnection_();const n=new Is,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const l=o.d;o.s==="ok"?n.resolve(l):n.reject(l)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const s=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(s),n.promise}listen(e,n,r,i){this.initConnection_();const s=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+s),this.listens.has(o)||this.listens.set(o,new Map),x(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),x(!this.listens.get(o).has(s),"listen() called twice for same path/queryId.");const l={onComplete:i,hashFn:n,query:e,tag:r};this.listens.get(o).set(s,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const n=this.outstandingGets_[e];this.sendRequest("g",n.request,r=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),n.onComplete&&n.onComplete(r)})}sendListen_(e){const n=e.query,r=n._path.toString(),i=n._queryIdentifier;this.log_("Listen on "+r+" for "+i);const s={p:r},o="q";e.tag&&(s.q=n._queryObject,s.t=e.tag),s.h=e.hashFn(),this.sendRequest(o,s,l=>{const a=l.d,u=l.s;$t.warnOnListenWarnings_(a,n),(this.listens.get(r)&&this.listens.get(r).get(i))===e&&(this.log_("listen response",l),u!=="ok"&&this.removeListen_(r,i),e.onComplete&&e.onComplete(u,a))})}static warnOnListenWarnings_(e,n){if(e&&typeof e=="object"&&bt(e,"w")){const r=Qr(e,"w");if(Array.isArray(r)&&~r.indexOf("no_index")){const i='".indexOn": "'+n._queryParams.getIndex().toString()+'"',s=n._path.toString();Le(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${s} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||M1(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Sf)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,n=D1(e)?"auth":"gauth",r={cred:e};this.authOverride_===null?r.noauth=!0:typeof this.authOverride_=="object"&&(r.authvar=this.authOverride_),this.sendRequest(n,r,i=>{const s=i.s,o=i.d||"error";this.authToken_===e&&(s==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(s,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const n=e.s,r=e.d||"error";n==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(n,r)})}unlisten(e,n){const r=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+r+" "+i),x(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(r,i)&&this.connected_&&this.sendUnlisten_(r,i,e._queryObject,n)}sendUnlisten_(e,n,r,i){this.log_("Unlisten on "+e+" for "+n);const s={p:e},o="n";i&&(s.q=r,s.t=i),this.sendRequest(o,s)}onDisconnectPut(e,n,r){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,n,r):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:n,onComplete:r})}onDisconnectMerge(e,n,r){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,n,r):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:n,onComplete:r})}onDisconnectCancel(e,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:n})}sendOnDisconnect_(e,n,r,i){const s={p:n,d:r};this.log_("onDisconnect "+e,s),this.sendRequest(e,s,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,n,r,i){this.putInternal("p",e,n,r,i)}merge(e,n,r,i){this.putInternal("m",e,n,r,i)}putInternal(e,n,r,i,s){this.initConnection_();const o={p:n,d:r};s!==void 0&&(o.h=s),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+n)}sendPut_(e){const n=this.outstandingPuts_[e].action,r=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(n,r,s=>{this.log_(n+" response",s),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(s.s,s.d)})}reportStats(e){if(this.connected_){const n={c:e};this.log_("reportStats",n),this.sendRequest("s",n,r=>{if(r.s!=="ok"){const s=r.d;this.log_("reportStats","Error sending stats: "+s)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+ye(e));const n=e.r,r=this.requestCBHash_[n];r&&(delete this.requestCBHash_[n],r(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,n){this.log_("handleServerMessage",e,n),e==="d"?this.onDataUpdate_(n.p,n.d,!1,n.t):e==="m"?this.onDataUpdate_(n.p,n.d,!0,n.t):e==="c"?this.onListenRevoked_(n.p,n.q):e==="ac"?this.onAuthRevoked_(n.s,n.d):e==="apc"?this.onAppCheckRevoked_(n.s,n.d):e==="sd"?this.onSecurityDebugPacket_(n):Au("Unrecognized action received from server: "+ye(e)+`
Are you using the latest client?`)}onReady_(e,n){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=n,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){x(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Ii,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Ii,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>$S&&(this.reconnectDelay_=Ii),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let n=Math.max(0,this.reconnectDelay_-e);n=Math.random()*n,this.log_("Trying to reconnect in "+n+"ms"),this.scheduleConnect_(n),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*VS)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),n=this.onReady_.bind(this),r=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+$t.nextConnectionId_++,s=this.lastSessionId;let o=!1,l=null;const a=function(){l?l.close():(o=!0,r())},u=function(d){x(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(d)};this.realtime_={close:a,sendRequest:u};const h=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[d,c]=await Promise.all([this.authTokenProvider_.getToken(h),this.appCheckTokenProvider_.getToken(h)]);o?Ie("getToken() completed but was canceled"):(Ie("getToken() completed. Creating connection."),this.authToken_=d&&d.accessToken,this.appCheckToken_=c&&c.token,l=new LS(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,n,r,_=>{Le(_+" ("+this.repoInfo_.toString()+")"),this.interrupt(HS)},s))}catch(d){this.log_("Failed to get token: "+d),o||(this.repoInfo_.nodeAdmin&&Le(d),a())}}}interrupt(e){Ie("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){Ie("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Iu(this.interruptReasons_)&&(this.reconnectDelay_=Ii,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const n=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:n})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const n=this.outstandingPuts_[e];n&&"h"in n.request&&n.queued&&(n.onComplete&&n.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,n){let r;n?r=n.map(s=>qc(s)).join("$"):r="default";const i=this.removeListen_(e,r);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,n){const r=new Z(e).toString();let i;if(this.listens.has(r)){const s=this.listens.get(r);i=s.get(n),s.delete(n),s.size===0&&this.listens.delete(r)}else i=void 0;return i}onAuthRevoked_(e,n){Ie("Auth token revoked: "+e+"/"+n),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Cf&&(this.reconnectDelay_=Sf,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,n){Ie("App check token revoked: "+e+"/"+n),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Cf&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const n of e.values())this.sendListen_(n);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let n="js";e["sdk."+n+"."+jm.replace(/\./g,"-")]=1,Hc()?e["framework.cordova"]=1:Pm()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Yo.getInstance().currentlyOnline();return Iu(this.interruptReasons_)&&e}}$t.nextPersistentConnectionId_=0;$t.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ${constructor(e,n){this.name=e,this.node=n}static Wrap(e,n){return new $(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Al{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,n){const r=new $(qr,e),i=new $(qr,n);return this.compare(r,i)!==0}minPost(){return $.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eo;class c_ extends Al{static get __EMPTY_NODE(){return eo}static set __EMPTY_NODE(e){eo=e}compare(e,n){return ar(e.name,n.name)}isDefinedOn(e){throw oi("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,n){return!1}minPost(){return $.MIN}maxPost(){return new $(nr,eo)}makePost(e,n){return x(typeof e=="string","KeyIndex indexValue must always be a string."),new $(e,eo)}toString(){return".key"}}const Lr=new c_;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{constructor(e,n,r,i,s=null){this.isReverse_=i,this.resultGenerator_=s,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=n?r(e.key,n):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),n;if(this.resultGenerator_?n=this.resultGenerator_(e.key,e.value):n={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return n}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class Ce{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??Ce.RED,this.left=i??Be.EMPTY_NODE,this.right=s??Be.EMPTY_NODE}copy(e,n,r,i,s){return new Ce(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return s<0?i=i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i=i.copy(null,n,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return Be.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,n){let r,i;if(r=this,n(e,r.key)<0)!r.left.isEmpty()&&!r.left.isRed_()&&!r.left.left.isRed_()&&(r=r.moveRedLeft_()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed_()&&(r=r.rotateRight_()),!r.right.isEmpty()&&!r.right.isRed_()&&!r.right.left.isRed_()&&(r=r.moveRedRight_()),n(e,r.key)===0){if(r.right.isEmpty())return Be.EMPTY_NODE;i=r.right.min_(),r=r.copy(i.key,i.value,null,null,r.right.removeMin_())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Ce.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Ce.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}Ce.RED=!0;Ce.BLACK=!1;class GS{copy(e,n,r,i,s){return this}insert(e,n,r){return new Ce(e,n,null)}remove(e,n){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class Be{constructor(e,n=Be.EMPTY_NODE){this.comparator_=e,this.root_=n}insert(e,n){return new Be(this.comparator_,this.root_.insert(e,n,this.comparator_).copy(null,null,Ce.BLACK,null,null))}remove(e){return new Be(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Ce.BLACK,null,null))}get(e){let n,r=this.root_;for(;!r.isEmpty();){if(n=this.comparator_(e,r.key),n===0)return r.value;n<0?r=r.left:n>0&&(r=r.right)}return null}getPredecessorKey(e){let n,r=this.root_,i=null;for(;!r.isEmpty();)if(n=this.comparator_(e,r.key),n===0){if(r.left.isEmpty())return i?i.key:null;for(r=r.left;!r.right.isEmpty();)r=r.right;return r.key}else n<0?r=r.left:n>0&&(i=r,r=r.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new to(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,n){return new to(this.root_,e,this.comparator_,!1,n)}getReverseIteratorFrom(e,n){return new to(this.root_,e,this.comparator_,!0,n)}getReverseIterator(e){return new to(this.root_,null,this.comparator_,!0,e)}}Be.EMPTY_NODE=new GS;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function KS(t,e){return ar(t.name,e.name)}function rd(t,e){return ar(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Du;function QS(t){Du=t}const d_=function(t){return typeof t=="number"?"number:"+Vm(t):"string:"+t},h_=function(t){if(t.isLeafNode()){const e=t.val();x(typeof e=="string"||typeof e=="number"||typeof e=="object"&&bt(e,".sv"),"Priority must be a string or number.")}else x(t===Du||t.isEmpty(),"priority of unexpected type.");x(t===Du||t.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ef;class we{static set __childrenNodeConstructor(e){Ef=e}static get __childrenNodeConstructor(){return Ef}constructor(e,n=we.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=n,this.lazyHash_=null,x(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),h_(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new we(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:we.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return H(e)?this:V(e)===".priority"?this.priorityNode_:we.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,n){return null}updateImmediateChild(e,n){return e===".priority"?this.updatePriority(n):n.isEmpty()&&e!==".priority"?this:we.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,n).updatePriority(this.priorityNode_)}updateChild(e,n){const r=V(e);return r===null?n:n.isEmpty()&&r!==".priority"?this:(x(r!==".priority"||Nn(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(r,we.__childrenNodeConstructor.EMPTY_NODE.updateChild(te(e),n)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,n){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+d_(this.priorityNode_.val())+":");const n=typeof this.value_;e+=n+":",n==="number"?e+=Vm(this.value_):e+=this.value_,this.lazyHash_=Wm(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===we.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof we.__childrenNodeConstructor?-1:(x(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const n=typeof e.value_,r=typeof this.value_,i=we.VALUE_TYPE_ORDER.indexOf(n),s=we.VALUE_TYPE_ORDER.indexOf(r);return x(i>=0,"Unknown leaf type: "+n),x(s>=0,"Unknown leaf type: "+r),i===s?r==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:s-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const n=e;return this.value_===n.value_&&this.priorityNode_.equals(n.priorityNode_)}else return!1}}we.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let f_,p_;function YS(t){f_=t}function qS(t){p_=t}class XS extends Al{compare(e,n){const r=e.node.getPriority(),i=n.node.getPriority(),s=r.compareTo(i);return s===0?ar(e.name,n.name):s}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,n){return!e.getPriority().equals(n.getPriority())}minPost(){return $.MIN}maxPost(){return new $(nr,new we("[PRIORITY-POST]",p_))}makePost(e,n){const r=f_(e);return new $(n,new we("[PRIORITY-POST]",r))}toString(){return".priority"}}const de=new XS;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JS=Math.log(2);class ZS{constructor(e){const n=s=>parseInt(Math.log(s)/JS,10),r=s=>parseInt(Array(s+1).join("1"),2);this.count=n(e+1),this.current_=this.count-1;const i=r(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const qo=function(t,e,n,r){t.sort(e);const i=function(a,u){const h=u-a;let d,c;if(h===0)return null;if(h===1)return d=t[a],c=n?n(d):d,new Ce(c,d.node,Ce.BLACK,null,null);{const _=parseInt(h/2,10)+a,y=i(a,_),v=i(_+1,u);return d=t[_],c=n?n(d):d,new Ce(c,d.node,Ce.BLACK,y,v)}},s=function(a){let u=null,h=null,d=t.length;const c=function(y,v){const M=d-y,g=d;d-=y;const f=i(M+1,g),m=t[M],w=n?n(m):m;_(new Ce(w,m.node,v,null,f))},_=function(y){u?(u.left=y,u=y):(h=y,u=y)};for(let y=0;y<a.count;++y){const v=a.nextBitIsOne(),M=Math.pow(2,a.count-(y+1));v?c(M,Ce.BLACK):(c(M,Ce.BLACK),c(M,Ce.RED))}return h},o=new ZS(t.length),l=s(o);return new Be(r||e,l)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xa;const hr={};class zt{static get Default(){return x(hr&&de,"ChildrenNode.ts has not been loaded"),xa=xa||new zt({".priority":hr},{".priority":de}),xa}constructor(e,n){this.indexes_=e,this.indexSet_=n}get(e){const n=Qr(this.indexes_,e);if(!n)throw new Error("No index defined for "+e);return n instanceof Be?n:null}hasIndex(e){return bt(this.indexSet_,e.toString())}addIndex(e,n){x(e!==Lr,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const r=[];let i=!1;const s=n.getIterator($.Wrap);let o=s.getNext();for(;o;)i=i||e.isDefinedOn(o.node),r.push(o),o=s.getNext();let l;i?l=qo(r,e.getCompare()):l=hr;const a=e.toString(),u={...this.indexSet_};u[a]=e;const h={...this.indexes_};return h[a]=l,new zt(h,u)}addToIndexes(e,n){const r=Go(this.indexes_,(i,s)=>{const o=Qr(this.indexSet_,s);if(x(o,"Missing index implementation for "+s),i===hr)if(o.isDefinedOn(e.node)){const l=[],a=n.getIterator($.Wrap);let u=a.getNext();for(;u;)u.name!==e.name&&l.push(u),u=a.getNext();return l.push(e),qo(l,o.getCompare())}else return hr;else{const l=n.get(e.name);let a=i;return l&&(a=a.remove(new $(e.name,l))),a.insert(e,e.node)}});return new zt(r,this.indexSet_)}removeFromIndexes(e,n){const r=Go(this.indexes_,i=>{if(i===hr)return i;{const s=n.get(e.name);return s?i.remove(new $(e.name,s)):i}});return new zt(r,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xi;class j{static get EMPTY_NODE(){return xi||(xi=new j(new Be(rd),null,zt.Default))}constructor(e,n,r){this.children_=e,this.priorityNode_=n,this.indexMap_=r,this.lazyHash_=null,this.priorityNode_&&h_(this.priorityNode_),this.children_.isEmpty()&&x(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||xi}updatePriority(e){return this.children_.isEmpty()?this:new j(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const n=this.children_.get(e);return n===null?xi:n}}getChild(e){const n=V(e);return n===null?this:this.getImmediateChild(n).getChild(te(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,n){if(x(n,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(n);{const r=new $(e,n);let i,s;n.isEmpty()?(i=this.children_.remove(e),s=this.indexMap_.removeFromIndexes(r,this.children_)):(i=this.children_.insert(e,n),s=this.indexMap_.addToIndexes(r,this.children_));const o=i.isEmpty()?xi:this.priorityNode_;return new j(i,o,s)}}updateChild(e,n){const r=V(e);if(r===null)return n;{x(V(e)!==".priority"||Nn(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(r).updateChild(te(e),n);return this.updateImmediateChild(r,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const n={};let r=0,i=0,s=!0;if(this.forEachChild(de,(o,l)=>{n[o]=l.val(e),r++,s&&j.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):s=!1}),!e&&s&&i<2*r){const o=[];for(const l in n)o[l]=n[l];return o}else return e&&!this.getPriority().isEmpty()&&(n[".priority"]=this.getPriority().val()),n}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+d_(this.getPriority().val())+":"),this.forEachChild(de,(n,r)=>{const i=r.hash();i!==""&&(e+=":"+n+":"+i)}),this.lazyHash_=e===""?"":Wm(e)}return this.lazyHash_}getPredecessorChildName(e,n,r){const i=this.resolveIndex_(r);if(i){const s=i.getPredecessorKey(new $(e,n));return s?s.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const n=this.resolveIndex_(e);if(n){const r=n.minKey();return r&&r.name}else return this.children_.minKey()}getFirstChild(e){const n=this.getFirstChildName(e);return n?new $(n,this.children_.get(n)):null}getLastChildName(e){const n=this.resolveIndex_(e);if(n){const r=n.maxKey();return r&&r.name}else return this.children_.maxKey()}getLastChild(e){const n=this.getLastChildName(e);return n?new $(n,this.children_.get(n)):null}forEachChild(e,n){const r=this.resolveIndex_(e);return r?r.inorderTraversal(i=>n(i.name,i.node)):this.children_.inorderTraversal(n)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,n){const r=this.resolveIndex_(n);if(r)return r.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,$.Wrap);let s=i.peek();for(;s!=null&&n.compare(s,e)<0;)i.getNext(),s=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,n){const r=this.resolveIndex_(n);if(r)return r.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,$.Wrap);let s=i.peek();for(;s!=null&&n.compare(s,e)>0;)i.getNext(),s=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Rs?-1:0}withIndex(e){if(e===Lr||this.indexMap_.hasIndex(e))return this;{const n=this.indexMap_.addIndex(e,this.children_);return new j(this.children_,this.priorityNode_,n)}}isIndexed(e){return e===Lr||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const n=e;if(this.getPriority().equals(n.getPriority()))if(this.children_.count()===n.children_.count()){const r=this.getIterator(de),i=n.getIterator(de);let s=r.getNext(),o=i.getNext();for(;s&&o;){if(s.name!==o.name||!s.node.equals(o.node))return!1;s=r.getNext(),o=i.getNext()}return s===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===Lr?null:this.indexMap_.get(e.toString())}}j.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class eC extends j{constructor(){super(new Be(rd),j.EMPTY_NODE,zt.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return j.EMPTY_NODE}isEmpty(){return!1}}const Rs=new eC;Object.defineProperties($,{MIN:{value:new $(qr,j.EMPTY_NODE)},MAX:{value:new $(nr,Rs)}});c_.__EMPTY_NODE=j.EMPTY_NODE;we.__childrenNodeConstructor=j;QS(Rs);qS(Rs);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tC=!0;function _e(t,e=null){if(t===null)return j.EMPTY_NODE;if(typeof t=="object"&&".priority"in t&&(e=t[".priority"]),x(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof t=="object"&&".value"in t&&t[".value"]!==null&&(t=t[".value"]),typeof t!="object"||".sv"in t){const n=t;return new we(n,_e(e))}if(!(t instanceof Array)&&tC){const n=[];let r=!1;if(Ne(t,(o,l)=>{if(o.substring(0,1)!=="."){const a=_e(l);a.isEmpty()||(r=r||!a.getPriority().isEmpty(),n.push(new $(o,a)))}}),n.length===0)return j.EMPTY_NODE;const s=qo(n,KS,o=>o.name,rd);if(r){const o=qo(n,de.getCompare());return new j(s,_e(e),new zt({".priority":o},{".priority":de}))}else return new j(s,_e(e),zt.Default)}else{let n=j.EMPTY_NODE;return Ne(t,(r,i)=>{if(bt(t,r)&&r.substring(0,1)!=="."){const s=_e(i);(s.isLeafNode()||!s.isEmpty())&&(n=n.updateImmediateChild(r,s))}}),n.updatePriority(_e(e))}}YS(_e);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nC extends Al{constructor(e){super(),this.indexPath_=e,x(!H(e)&&V(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,n){const r=this.extractChild(e.node),i=this.extractChild(n.node),s=r.compareTo(i);return s===0?ar(e.name,n.name):s}makePost(e,n){const r=_e(e),i=j.EMPTY_NODE.updateChild(this.indexPath_,r);return new $(n,i)}maxPost(){const e=j.EMPTY_NODE.updateChild(this.indexPath_,Rs);return new $(nr,e)}toString(){return fs(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rC extends Al{compare(e,n){const r=e.node.compareTo(n.node);return r===0?ar(e.name,n.name):r}isDefinedOn(e){return!0}indexedValueChanged(e,n){return!e.equals(n)}minPost(){return $.MIN}maxPost(){return $.MAX}makePost(e,n){const r=_e(e);return new $(n,r)}toString(){return".value"}}const iC=new rC;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g_(t){return{type:"value",snapshotNode:t}}function Xr(t,e){return{type:"child_added",snapshotNode:e,childName:t}}function ps(t,e){return{type:"child_removed",snapshotNode:e,childName:t}}function gs(t,e,n){return{type:"child_changed",snapshotNode:e,childName:t,oldSnap:n}}function sC(t,e){return{type:"child_moved",snapshotNode:e,childName:t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class id{constructor(e){this.index_=e}updateChild(e,n,r,i,s,o){x(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(n);return l.getChild(i).equals(r.getChild(i))&&l.isEmpty()===r.isEmpty()||(o!=null&&(r.isEmpty()?e.hasChild(n)?o.trackChildChange(ps(n,l)):x(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?o.trackChildChange(Xr(n,r)):o.trackChildChange(gs(n,r,l))),e.isLeafNode()&&r.isEmpty())?e:e.updateImmediateChild(n,r).withIndex(this.index_)}updateFullNode(e,n,r){return r!=null&&(e.isLeafNode()||e.forEachChild(de,(i,s)=>{n.hasChild(i)||r.trackChildChange(ps(i,s))}),n.isLeafNode()||n.forEachChild(de,(i,s)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(s)||r.trackChildChange(gs(i,s,o))}else r.trackChildChange(Xr(i,s))})),n.withIndex(this.index_)}updatePriority(e,n){return e.isEmpty()?j.EMPTY_NODE:e.updatePriority(n)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ms{constructor(e){this.indexedFilter_=new id(e.getIndex()),this.index_=e.getIndex(),this.startPost_=ms.getStartPost_(e),this.endPost_=ms.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const n=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,r=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return n&&r}updateChild(e,n,r,i,s,o){return this.matches(new $(n,r))||(r=j.EMPTY_NODE),this.indexedFilter_.updateChild(e,n,r,i,s,o)}updateFullNode(e,n,r){n.isLeafNode()&&(n=j.EMPTY_NODE);let i=n.withIndex(this.index_);i=i.updatePriority(j.EMPTY_NODE);const s=this;return n.forEachChild(de,(o,l)=>{s.matches(new $(o,l))||(i=i.updateImmediateChild(o,j.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,r)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const n=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),n)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const n=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),n)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oC{constructor(e){this.withinDirectionalStart=n=>this.reverse_?this.withinEndPost(n):this.withinStartPost(n),this.withinDirectionalEnd=n=>this.reverse_?this.withinStartPost(n):this.withinEndPost(n),this.withinStartPost=n=>{const r=this.index_.compare(this.rangedFilter_.getStartPost(),n);return this.startIsInclusive_?r<=0:r<0},this.withinEndPost=n=>{const r=this.index_.compare(n,this.rangedFilter_.getEndPost());return this.endIsInclusive_?r<=0:r<0},this.rangedFilter_=new ms(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,n,r,i,s,o){return this.rangedFilter_.matches(new $(n,r))||(r=j.EMPTY_NODE),e.getImmediateChild(n).equals(r)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,n,r,i,s,o):this.fullLimitUpdateChild_(e,n,r,s,o)}updateFullNode(e,n,r){let i;if(n.isLeafNode()||n.isEmpty())i=j.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<n.numChildren()&&n.isIndexed(this.index_)){i=j.EMPTY_NODE.withIndex(this.index_);let s;this.reverse_?s=n.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):s=n.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;s.hasNext()&&o<this.limit_;){const l=s.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))i=i.updateImmediateChild(l.name,l.node),o++;else break;else continue}}else{i=n.withIndex(this.index_),i=i.updatePriority(j.EMPTY_NODE);let s;this.reverse_?s=i.getReverseIterator(this.index_):s=i.getIterator(this.index_);let o=0;for(;s.hasNext();){const l=s.getNext();o<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?o++:i=i.updateImmediateChild(l.name,j.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,r)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,n,r,i,s){let o;if(this.reverse_){const d=this.index_.getCompare();o=(c,_)=>d(_,c)}else o=this.index_.getCompare();const l=e;x(l.numChildren()===this.limit_,"");const a=new $(n,r),u=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),h=this.rangedFilter_.matches(a);if(l.hasChild(n)){const d=l.getImmediateChild(n);let c=i.getChildAfterChild(this.index_,u,this.reverse_);for(;c!=null&&(c.name===n||l.hasChild(c.name));)c=i.getChildAfterChild(this.index_,c,this.reverse_);const _=c==null?1:o(c,a);if(h&&!r.isEmpty()&&_>=0)return s!=null&&s.trackChildChange(gs(n,r,d)),l.updateImmediateChild(n,r);{s!=null&&s.trackChildChange(ps(n,d));const v=l.updateImmediateChild(n,j.EMPTY_NODE);return c!=null&&this.rangedFilter_.matches(c)?(s!=null&&s.trackChildChange(Xr(c.name,c.node)),v.updateImmediateChild(c.name,c.node)):v}}else return r.isEmpty()?e:h&&o(u,a)>=0?(s!=null&&(s.trackChildChange(ps(u.name,u.node)),s.trackChildChange(Xr(n,r))),l.updateImmediateChild(n,r).updateImmediateChild(u.name,j.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sd{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=de}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return x(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return x(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:qr}hasEnd(){return this.endSet_}getIndexEndValue(){return x(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return x(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:nr}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return x(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===de}copy(){const e=new sd;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function lC(t){return t.loadsAllData()?new id(t.getIndex()):t.hasLimit()?new oC(t):new ms(t)}function kf(t){const e={};if(t.isDefault())return e;let n;if(t.index_===de?n="$priority":t.index_===iC?n="$value":t.index_===Lr?n="$key":(x(t.index_ instanceof nC,"Unrecognized index type!"),n=t.index_.toString()),e.orderBy=ye(n),t.startSet_){const r=t.startAfterSet_?"startAfter":"startAt";e[r]=ye(t.indexStartValue_),t.startNameSet_&&(e[r]+=","+ye(t.indexStartName_))}if(t.endSet_){const r=t.endBeforeSet_?"endBefore":"endAt";e[r]=ye(t.indexEndValue_),t.endNameSet_&&(e[r]+=","+ye(t.indexEndName_))}return t.limitSet_&&(t.isViewFromLeft()?e.limitToFirst=t.limit_:e.limitToLast=t.limit_),e}function If(t){const e={};if(t.startSet_&&(e.sp=t.indexStartValue_,t.startNameSet_&&(e.sn=t.indexStartName_),e.sin=!t.startAfterSet_),t.endSet_&&(e.ep=t.indexEndValue_,t.endNameSet_&&(e.en=t.indexEndName_),e.ein=!t.endBeforeSet_),t.limitSet_){e.l=t.limit_;let n=t.viewFrom_;n===""&&(t.isViewFromLeft()?n="l":n="r"),e.vf=n}return t.index_!==de&&(e.i=t.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xo extends o_{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,n){return n!==void 0?"tag$"+n:(x(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,n,r,i){super(),this.repoInfo_=e,this.onDataUpdate_=n,this.authTokenProvider_=r,this.appCheckTokenProvider_=i,this.log_=Ns("p:rest:"),this.listens_={}}listen(e,n,r,i){const s=e._path.toString();this.log_("Listen called for "+s+" "+e._queryIdentifier);const o=Xo.getListenId_(e,r),l={};this.listens_[o]=l;const a=kf(e._queryParams);this.restRequest_(s+".json",a,(u,h)=>{let d=h;if(u===404&&(d=null,u=null),u===null&&this.onDataUpdate_(s,d,!1,r),Qr(this.listens_,o)===l){let c;u?u===401?c="permission_denied":c="rest_error:"+u:c="ok",i(c,null)}})}unlisten(e,n){const r=Xo.getListenId_(e,n);delete this.listens_[r]}get(e){const n=kf(e._queryParams),r=e._path.toString(),i=new Is;return this.restRequest_(r+".json",n,(s,o)=>{let l=o;s===404&&(l=null,s=null),s===null?(this.onDataUpdate_(r,l,!1,null),i.resolve(l)):i.reject(new Error(l))}),i.promise}refreshAuthToken(e){}restRequest_(e,n={},r){return n.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,s])=>{i&&i.accessToken&&(n.auth=i.accessToken),s&&s.token&&(n.ac=s.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+ai(n);this.log_("Sending REST request for "+o);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(r&&l.readyState===4){this.log_("REST Response for "+o+" received. status:",l.status,"response:",l.responseText);let a=null;if(l.status>=200&&l.status<300){try{a=cs(l.responseText)}catch{Le("Failed to parse JSON response for "+o+": "+l.responseText)}r(null,a)}else l.status!==401&&l.status!==404&&Le("Got unsuccessful REST response for "+o+" Status: "+l.status),r(l.status);r=null}},l.open("GET",o,!0),l.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aC{constructor(){this.rootNode_=j.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,n){this.rootNode_=this.rootNode_.updateChild(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jo(){return{value:null,children:new Map}}function m_(t,e,n){if(H(e))t.value=n,t.children.clear();else if(t.value!==null)t.value=t.value.updateChild(e,n);else{const r=V(e);t.children.has(r)||t.children.set(r,Jo());const i=t.children.get(r);e=te(e),m_(i,e,n)}}function Mu(t,e,n){t.value!==null?n(e,t.value):uC(t,(r,i)=>{const s=new Z(e.toString()+"/"+r);Mu(i,s,n)})}function uC(t,e){t.children.forEach((n,r)=>{e(r,n)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cC{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),n={...e};return this.last_&&Ne(this.last_,(r,i)=>{n[r]=n[r]-i}),this.last_=e,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xf=10*1e3,dC=30*1e3,hC=5*60*1e3;class fC{constructor(e,n){this.server_=n,this.statsToReport_={},this.statsListener_=new cC(e);const r=xf+(dC-xf)*Math.random();Bi(this.reportStats_.bind(this),Math.floor(r))}reportStats_(){const e=this.statsListener_.get(),n={};let r=!1;Ne(e,(i,s)=>{s>0&&bt(this.statsToReport_,i)&&(n[i]=s,r=!0)}),r&&this.server_.reportStats(n),Bi(this.reportStats_.bind(this),Math.floor(Math.random()*2*hC))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var pt;(function(t){t[t.OVERWRITE=0]="OVERWRITE",t[t.MERGE=1]="MERGE",t[t.ACK_USER_WRITE=2]="ACK_USER_WRITE",t[t.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(pt||(pt={}));function od(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function ld(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function ad(t){return{fromUser:!1,fromServer:!0,queryId:t,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{constructor(e,n,r){this.path=e,this.affectedTree=n,this.revert=r,this.type=pt.ACK_USER_WRITE,this.source=od()}operationForChild(e){if(H(this.path)){if(this.affectedTree.value!=null)return x(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const n=this.affectedTree.subtree(new Z(e));return new Zo(q(),n,this.revert)}}else return x(V(this.path)===e,"operationForChild called for unrelated child."),new Zo(te(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(e,n){this.source=e,this.path=n,this.type=pt.LISTEN_COMPLETE}operationForChild(e){return H(this.path)?new _s(this.source,q()):new _s(this.source,te(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(e,n,r){this.source=e,this.path=n,this.snap=r,this.type=pt.OVERWRITE}operationForChild(e){return H(this.path)?new rr(this.source,q(),this.snap.getImmediateChild(e)):new rr(this.source,te(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jr{constructor(e,n,r){this.source=e,this.path=n,this.children=r,this.type=pt.MERGE}operationForChild(e){if(H(this.path)){const n=this.children.subtree(new Z(e));return n.isEmpty()?null:n.value?new rr(this.source,q(),n.value):new Jr(this.source,q(),n)}else return x(V(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Jr(this.source,te(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn{constructor(e,n,r){this.node_=e,this.fullyInitialized_=n,this.filtered_=r}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(H(e))return this.isFullyInitialized()&&!this.filtered_;const n=V(e);return this.isCompleteForChild(n)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pC{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function gC(t,e,n,r){const i=[],s=[];return e.forEach(o=>{o.type==="child_changed"&&t.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&s.push(sC(o.childName,o.snapshotNode))}),Ti(t,i,"child_removed",e,r,n),Ti(t,i,"child_added",e,r,n),Ti(t,i,"child_moved",s,r,n),Ti(t,i,"child_changed",e,r,n),Ti(t,i,"value",e,r,n),i}function Ti(t,e,n,r,i,s){const o=r.filter(l=>l.type===n);o.sort((l,a)=>_C(t,l,a)),o.forEach(l=>{const a=mC(t,l,s);i.forEach(u=>{u.respondsTo(l.type)&&e.push(u.createEvent(a,t.query_))})})}function mC(t,e,n){return e.type==="value"||e.type==="child_removed"||(e.prevName=n.getPredecessorChildName(e.childName,e.snapshotNode,t.index_)),e}function _C(t,e,n){if(e.childName==null||n.childName==null)throw oi("Should only compare child_ events.");const r=new $(e.childName,e.snapshotNode),i=new $(n.childName,n.snapshotNode);return t.index_.compare(r,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ol(t,e){return{eventCache:t,serverCache:e}}function Vi(t,e,n,r){return Ol(new Rn(e,n,r),t.serverCache)}function __(t,e,n,r){return Ol(t.eventCache,new Rn(e,n,r))}function el(t){return t.eventCache.isFullyInitialized()?t.eventCache.getNode():null}function ir(t){return t.serverCache.isFullyInitialized()?t.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ta;const yC=()=>(Ta||(Ta=new Be(nS)),Ta);class ee{static fromObject(e){let n=new ee(null);return Ne(e,(r,i)=>{n=n.set(new Z(r),i)}),n}constructor(e,n=yC()){this.value=e,this.children=n}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,n){if(this.value!=null&&n(this.value))return{path:q(),value:this.value};if(H(e))return null;{const r=V(e),i=this.children.get(r);if(i!==null){const s=i.findRootMostMatchingPathAndValue(te(e),n);return s!=null?{path:ce(new Z(r),s.path),value:s.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(H(e))return this;{const n=V(e),r=this.children.get(n);return r!==null?r.subtree(te(e)):new ee(null)}}set(e,n){if(H(e))return new ee(n,this.children);{const r=V(e),s=(this.children.get(r)||new ee(null)).set(te(e),n),o=this.children.insert(r,s);return new ee(this.value,o)}}remove(e){if(H(e))return this.children.isEmpty()?new ee(null):new ee(null,this.children);{const n=V(e),r=this.children.get(n);if(r){const i=r.remove(te(e));let s;return i.isEmpty()?s=this.children.remove(n):s=this.children.insert(n,i),this.value===null&&s.isEmpty()?new ee(null):new ee(this.value,s)}else return this}}get(e){if(H(e))return this.value;{const n=V(e),r=this.children.get(n);return r?r.get(te(e)):null}}setTree(e,n){if(H(e))return n;{const r=V(e),s=(this.children.get(r)||new ee(null)).setTree(te(e),n);let o;return s.isEmpty()?o=this.children.remove(r):o=this.children.insert(r,s),new ee(this.value,o)}}fold(e){return this.fold_(q(),e)}fold_(e,n){const r={};return this.children.inorderTraversal((i,s)=>{r[i]=s.fold_(ce(e,i),n)}),n(e,this.value,r)}findOnPath(e,n){return this.findOnPath_(e,q(),n)}findOnPath_(e,n,r){const i=this.value?r(n,this.value):!1;if(i)return i;if(H(e))return null;{const s=V(e),o=this.children.get(s);return o?o.findOnPath_(te(e),ce(n,s),r):null}}foreachOnPath(e,n){return this.foreachOnPath_(e,q(),n)}foreachOnPath_(e,n,r){if(H(e))return this;{this.value&&r(n,this.value);const i=V(e),s=this.children.get(i);return s?s.foreachOnPath_(te(e),ce(n,i),r):new ee(null)}}foreach(e){this.foreach_(q(),e)}foreach_(e,n){this.children.inorderTraversal((r,i)=>{i.foreach_(ce(e,r),n)}),this.value&&n(e,this.value)}foreachChild(e){this.children.inorderTraversal((n,r)=>{r.value&&e(n,r.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e){this.writeTree_=e}static empty(){return new yt(new ee(null))}}function $i(t,e,n){if(H(e))return new yt(new ee(n));{const r=t.writeTree_.findRootMostValueAndPath(e);if(r!=null){const i=r.path;let s=r.value;const o=De(i,e);return s=s.updateChild(o,n),new yt(t.writeTree_.set(i,s))}else{const i=new ee(n),s=t.writeTree_.setTree(e,i);return new yt(s)}}}function Lu(t,e,n){let r=t;return Ne(n,(i,s)=>{r=$i(r,ce(e,i),s)}),r}function Tf(t,e){if(H(e))return yt.empty();{const n=t.writeTree_.setTree(e,new ee(null));return new yt(n)}}function Fu(t,e){return ur(t,e)!=null}function ur(t,e){const n=t.writeTree_.findRootMostValueAndPath(e);return n!=null?t.writeTree_.get(n.path).getChild(De(n.path,e)):null}function Nf(t){const e=[],n=t.writeTree_.value;return n!=null?n.isLeafNode()||n.forEachChild(de,(r,i)=>{e.push(new $(r,i))}):t.writeTree_.children.inorderTraversal((r,i)=>{i.value!=null&&e.push(new $(r,i.value))}),e}function En(t,e){if(H(e))return t;{const n=ur(t,e);return n!=null?new yt(new ee(n)):new yt(t.writeTree_.subtree(e))}}function Uu(t){return t.writeTree_.isEmpty()}function Zr(t,e){return y_(q(),t.writeTree_,e)}function y_(t,e,n){if(e.value!=null)return n.updateChild(t,e.value);{let r=null;return e.children.inorderTraversal((i,s)=>{i===".priority"?(x(s.value!==null,"Priority writes must always be leaf nodes"),r=s.value):n=y_(ce(t,i),s,n)}),!n.getChild(t).isEmpty()&&r!==null&&(n=n.updateChild(ce(t,".priority"),r)),n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dl(t,e){return C_(e,t)}function vC(t,e,n,r,i){x(r>t.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),t.allWrites.push({path:e,snap:n,writeId:r,visible:i}),i&&(t.visibleWrites=$i(t.visibleWrites,e,n)),t.lastWriteId=r}function wC(t,e,n,r){x(r>t.lastWriteId,"Stacking an older merge on top of newer ones"),t.allWrites.push({path:e,children:n,writeId:r,visible:!0}),t.visibleWrites=Lu(t.visibleWrites,e,n),t.lastWriteId=r}function SC(t,e){for(let n=0;n<t.allWrites.length;n++){const r=t.allWrites[n];if(r.writeId===e)return r}return null}function CC(t,e){const n=t.allWrites.findIndex(l=>l.writeId===e);x(n>=0,"removeWrite called with nonexistent writeId.");const r=t.allWrites[n];t.allWrites.splice(n,1);let i=r.visible,s=!1,o=t.allWrites.length-1;for(;i&&o>=0;){const l=t.allWrites[o];l.visible&&(o>=n&&EC(l,r.path)?i=!1:nt(r.path,l.path)&&(s=!0)),o--}if(i){if(s)return kC(t),!0;if(r.snap)t.visibleWrites=Tf(t.visibleWrites,r.path);else{const l=r.children;Ne(l,a=>{t.visibleWrites=Tf(t.visibleWrites,ce(r.path,a))})}return!0}else return!1}function EC(t,e){if(t.snap)return nt(t.path,e);for(const n in t.children)if(t.children.hasOwnProperty(n)&&nt(ce(t.path,n),e))return!0;return!1}function kC(t){t.visibleWrites=v_(t.allWrites,IC,q()),t.allWrites.length>0?t.lastWriteId=t.allWrites[t.allWrites.length-1].writeId:t.lastWriteId=-1}function IC(t){return t.visible}function v_(t,e,n){let r=yt.empty();for(let i=0;i<t.length;++i){const s=t[i];if(e(s)){const o=s.path;let l;if(s.snap)nt(n,o)?(l=De(n,o),r=$i(r,l,s.snap)):nt(o,n)&&(l=De(o,n),r=$i(r,q(),s.snap.getChild(l)));else if(s.children){if(nt(n,o))l=De(n,o),r=Lu(r,l,s.children);else if(nt(o,n))if(l=De(o,n),H(l))r=Lu(r,q(),s.children);else{const a=Qr(s.children,V(l));if(a){const u=a.getChild(te(l));r=$i(r,q(),u)}}}else throw oi("WriteRecord should have .snap or .children")}}return r}function w_(t,e,n,r,i){if(!r&&!i){const s=ur(t.visibleWrites,e);if(s!=null)return s;{const o=En(t.visibleWrites,e);if(Uu(o))return n;if(n==null&&!Fu(o,q()))return null;{const l=n||j.EMPTY_NODE;return Zr(o,l)}}}else{const s=En(t.visibleWrites,e);if(!i&&Uu(s))return n;if(!i&&n==null&&!Fu(s,q()))return null;{const o=function(u){return(u.visible||i)&&(!r||!~r.indexOf(u.writeId))&&(nt(u.path,e)||nt(e,u.path))},l=v_(t.allWrites,o,e),a=n||j.EMPTY_NODE;return Zr(l,a)}}}function xC(t,e,n){let r=j.EMPTY_NODE;const i=ur(t.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(de,(s,o)=>{r=r.updateImmediateChild(s,o)}),r;if(n){const s=En(t.visibleWrites,e);return n.forEachChild(de,(o,l)=>{const a=Zr(En(s,new Z(o)),l);r=r.updateImmediateChild(o,a)}),Nf(s).forEach(o=>{r=r.updateImmediateChild(o.name,o.node)}),r}else{const s=En(t.visibleWrites,e);return Nf(s).forEach(o=>{r=r.updateImmediateChild(o.name,o.node)}),r}}function TC(t,e,n,r,i){x(r||i,"Either existingEventSnap or existingServerSnap must exist");const s=ce(e,n);if(Fu(t.visibleWrites,s))return null;{const o=En(t.visibleWrites,s);return Uu(o)?i.getChild(n):Zr(o,i.getChild(n))}}function NC(t,e,n,r){const i=ce(e,n),s=ur(t.visibleWrites,i);if(s!=null)return s;if(r.isCompleteForChild(n)){const o=En(t.visibleWrites,i);return Zr(o,r.getNode().getImmediateChild(n))}else return null}function RC(t,e){return ur(t.visibleWrites,e)}function PC(t,e,n,r,i,s,o){let l;const a=En(t.visibleWrites,e),u=ur(a,q());if(u!=null)l=u;else if(n!=null)l=Zr(a,n);else return[];if(l=l.withIndex(o),!l.isEmpty()&&!l.isLeafNode()){const h=[],d=o.getCompare(),c=s?l.getReverseIteratorFrom(r,o):l.getIteratorFrom(r,o);let _=c.getNext();for(;_&&h.length<i;)d(_,r)!==0&&h.push(_),_=c.getNext();return h}else return[]}function bC(){return{visibleWrites:yt.empty(),allWrites:[],lastWriteId:-1}}function tl(t,e,n,r){return w_(t.writeTree,t.treePath,e,n,r)}function ud(t,e){return xC(t.writeTree,t.treePath,e)}function Rf(t,e,n,r){return TC(t.writeTree,t.treePath,e,n,r)}function nl(t,e){return RC(t.writeTree,ce(t.treePath,e))}function AC(t,e,n,r,i,s){return PC(t.writeTree,t.treePath,e,n,r,i,s)}function cd(t,e,n){return NC(t.writeTree,t.treePath,e,n)}function S_(t,e){return C_(ce(t.treePath,e),t.writeTree)}function C_(t,e){return{treePath:t,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OC{constructor(){this.changeMap=new Map}trackChildChange(e){const n=e.type,r=e.childName;x(n==="child_added"||n==="child_changed"||n==="child_removed","Only child changes supported for tracking"),x(r!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(r);if(i){const s=i.type;if(n==="child_added"&&s==="child_removed")this.changeMap.set(r,gs(r,e.snapshotNode,i.snapshotNode));else if(n==="child_removed"&&s==="child_added")this.changeMap.delete(r);else if(n==="child_removed"&&s==="child_changed")this.changeMap.set(r,ps(r,i.oldSnap));else if(n==="child_changed"&&s==="child_added")this.changeMap.set(r,Xr(r,e.snapshotNode));else if(n==="child_changed"&&s==="child_changed")this.changeMap.set(r,gs(r,e.snapshotNode,i.oldSnap));else throw oi("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(r,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DC{getCompleteChild(e){return null}getChildAfterChild(e,n,r){return null}}const E_=new DC;class dd{constructor(e,n,r=null){this.writes_=e,this.viewCache_=n,this.optCompleteServerCache_=r}getCompleteChild(e){const n=this.viewCache_.eventCache;if(n.isCompleteForChild(e))return n.getNode().getImmediateChild(e);{const r=this.optCompleteServerCache_!=null?new Rn(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return cd(this.writes_,e,r)}}getChildAfterChild(e,n,r){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:ir(this.viewCache_),s=AC(this.writes_,i,n,1,r,e);return s.length===0?null:s[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MC(t){return{filter:t}}function LC(t,e){x(e.eventCache.getNode().isIndexed(t.filter.getIndex()),"Event snap not indexed"),x(e.serverCache.getNode().isIndexed(t.filter.getIndex()),"Server snap not indexed")}function FC(t,e,n,r,i){const s=new OC;let o,l;if(n.type===pt.OVERWRITE){const u=n;u.source.fromUser?o=ju(t,e,u.path,u.snap,r,i,s):(x(u.source.fromServer,"Unknown source."),l=u.source.tagged||e.serverCache.isFiltered()&&!H(u.path),o=rl(t,e,u.path,u.snap,r,i,l,s))}else if(n.type===pt.MERGE){const u=n;u.source.fromUser?o=jC(t,e,u.path,u.children,r,i,s):(x(u.source.fromServer,"Unknown source."),l=u.source.tagged||e.serverCache.isFiltered(),o=zu(t,e,u.path,u.children,r,i,l,s))}else if(n.type===pt.ACK_USER_WRITE){const u=n;u.revert?o=BC(t,e,u.path,r,i,s):o=zC(t,e,u.path,u.affectedTree,r,i,s)}else if(n.type===pt.LISTEN_COMPLETE)o=WC(t,e,n.path,r,s);else throw oi("Unknown operation type: "+n.type);const a=s.getChanges();return UC(e,o,a),{viewCache:o,changes:a}}function UC(t,e,n){const r=e.eventCache;if(r.isFullyInitialized()){const i=r.getNode().isLeafNode()||r.getNode().isEmpty(),s=el(t);(n.length>0||!t.eventCache.isFullyInitialized()||i&&!r.getNode().equals(s)||!r.getNode().getPriority().equals(s.getPriority()))&&n.push(g_(el(e)))}}function k_(t,e,n,r,i,s){const o=e.eventCache;if(nl(r,n)!=null)return e;{let l,a;if(H(n))if(x(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const u=ir(e),h=u instanceof j?u:j.EMPTY_NODE,d=ud(r,h);l=t.filter.updateFullNode(e.eventCache.getNode(),d,s)}else{const u=tl(r,ir(e));l=t.filter.updateFullNode(e.eventCache.getNode(),u,s)}else{const u=V(n);if(u===".priority"){x(Nn(n)===1,"Can't have a priority with additional path components");const h=o.getNode();a=e.serverCache.getNode();const d=Rf(r,n,h,a);d!=null?l=t.filter.updatePriority(h,d):l=o.getNode()}else{const h=te(n);let d;if(o.isCompleteForChild(u)){a=e.serverCache.getNode();const c=Rf(r,n,o.getNode(),a);c!=null?d=o.getNode().getImmediateChild(u).updateChild(h,c):d=o.getNode().getImmediateChild(u)}else d=cd(r,u,e.serverCache);d!=null?l=t.filter.updateChild(o.getNode(),u,d,h,i,s):l=o.getNode()}}return Vi(e,l,o.isFullyInitialized()||H(n),t.filter.filtersNodes())}}function rl(t,e,n,r,i,s,o,l){const a=e.serverCache;let u;const h=o?t.filter:t.filter.getIndexedFilter();if(H(n))u=h.updateFullNode(a.getNode(),r,null);else if(h.filtersNodes()&&!a.isFiltered()){const _=a.getNode().updateChild(n,r);u=h.updateFullNode(a.getNode(),_,null)}else{const _=V(n);if(!a.isCompleteForPath(n)&&Nn(n)>1)return e;const y=te(n),M=a.getNode().getImmediateChild(_).updateChild(y,r);_===".priority"?u=h.updatePriority(a.getNode(),M):u=h.updateChild(a.getNode(),_,M,y,E_,null)}const d=__(e,u,a.isFullyInitialized()||H(n),h.filtersNodes()),c=new dd(i,d,s);return k_(t,d,n,i,c,l)}function ju(t,e,n,r,i,s,o){const l=e.eventCache;let a,u;const h=new dd(i,e,s);if(H(n))u=t.filter.updateFullNode(e.eventCache.getNode(),r,o),a=Vi(e,u,!0,t.filter.filtersNodes());else{const d=V(n);if(d===".priority")u=t.filter.updatePriority(e.eventCache.getNode(),r),a=Vi(e,u,l.isFullyInitialized(),l.isFiltered());else{const c=te(n),_=l.getNode().getImmediateChild(d);let y;if(H(c))y=r;else{const v=h.getCompleteChild(d);v!=null?ed(c)===".priority"&&v.getChild(a_(c)).isEmpty()?y=v:y=v.updateChild(c,r):y=j.EMPTY_NODE}if(_.equals(y))a=e;else{const v=t.filter.updateChild(l.getNode(),d,y,c,h,o);a=Vi(e,v,l.isFullyInitialized(),t.filter.filtersNodes())}}}return a}function Pf(t,e){return t.eventCache.isCompleteForChild(e)}function jC(t,e,n,r,i,s,o){let l=e;return r.foreach((a,u)=>{const h=ce(n,a);Pf(e,V(h))&&(l=ju(t,l,h,u,i,s,o))}),r.foreach((a,u)=>{const h=ce(n,a);Pf(e,V(h))||(l=ju(t,l,h,u,i,s,o))}),l}function bf(t,e,n){return n.foreach((r,i)=>{e=e.updateChild(r,i)}),e}function zu(t,e,n,r,i,s,o,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let a=e,u;H(n)?u=r:u=new ee(null).setTree(n,r);const h=e.serverCache.getNode();return u.children.inorderTraversal((d,c)=>{if(h.hasChild(d)){const _=e.serverCache.getNode().getImmediateChild(d),y=bf(t,_,c);a=rl(t,a,new Z(d),y,i,s,o,l)}}),u.children.inorderTraversal((d,c)=>{const _=!e.serverCache.isCompleteForChild(d)&&c.value===null;if(!h.hasChild(d)&&!_){const y=e.serverCache.getNode().getImmediateChild(d),v=bf(t,y,c);a=rl(t,a,new Z(d),v,i,s,o,l)}}),a}function zC(t,e,n,r,i,s,o){if(nl(i,n)!=null)return e;const l=e.serverCache.isFiltered(),a=e.serverCache;if(r.value!=null){if(H(n)&&a.isFullyInitialized()||a.isCompleteForPath(n))return rl(t,e,n,a.getNode().getChild(n),i,s,l,o);if(H(n)){let u=new ee(null);return a.getNode().forEachChild(Lr,(h,d)=>{u=u.set(new Z(h),d)}),zu(t,e,n,u,i,s,l,o)}else return e}else{let u=new ee(null);return r.foreach((h,d)=>{const c=ce(n,h);a.isCompleteForPath(c)&&(u=u.set(h,a.getNode().getChild(c)))}),zu(t,e,n,u,i,s,l,o)}}function WC(t,e,n,r,i){const s=e.serverCache,o=__(e,s.getNode(),s.isFullyInitialized()||H(n),s.isFiltered());return k_(t,o,n,r,E_,i)}function BC(t,e,n,r,i,s){let o;if(nl(r,n)!=null)return e;{const l=new dd(r,e,i),a=e.eventCache.getNode();let u;if(H(n)||V(n)===".priority"){let h;if(e.serverCache.isFullyInitialized())h=tl(r,ir(e));else{const d=e.serverCache.getNode();x(d instanceof j,"serverChildren would be complete if leaf node"),h=ud(r,d)}h=h,u=t.filter.updateFullNode(a,h,s)}else{const h=V(n);let d=cd(r,h,e.serverCache);d==null&&e.serverCache.isCompleteForChild(h)&&(d=a.getImmediateChild(h)),d!=null?u=t.filter.updateChild(a,h,d,te(n),l,s):e.eventCache.getNode().hasChild(h)?u=t.filter.updateChild(a,h,j.EMPTY_NODE,te(n),l,s):u=a,u.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=tl(r,ir(e)),o.isLeafNode()&&(u=t.filter.updateFullNode(u,o,s)))}return o=e.serverCache.isFullyInitialized()||nl(r,q())!=null,Vi(e,u,o,t.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VC{constructor(e,n){this.query_=e,this.eventRegistrations_=[];const r=this.query_._queryParams,i=new id(r.getIndex()),s=lC(r);this.processor_=MC(s);const o=n.serverCache,l=n.eventCache,a=i.updateFullNode(j.EMPTY_NODE,o.getNode(),null),u=s.updateFullNode(j.EMPTY_NODE,l.getNode(),null),h=new Rn(a,o.isFullyInitialized(),i.filtersNodes()),d=new Rn(u,l.isFullyInitialized(),s.filtersNodes());this.viewCache_=Ol(d,h),this.eventGenerator_=new pC(this.query_)}get query(){return this.query_}}function $C(t){return t.viewCache_.serverCache.getNode()}function HC(t){return el(t.viewCache_)}function GC(t,e){const n=ir(t.viewCache_);return n&&(t.query._queryParams.loadsAllData()||!H(e)&&!n.getImmediateChild(V(e)).isEmpty())?n.getChild(e):null}function Af(t){return t.eventRegistrations_.length===0}function KC(t,e){t.eventRegistrations_.push(e)}function Of(t,e,n){const r=[];if(n){x(e==null,"A cancel should cancel all event registrations.");const i=t.query._path;t.eventRegistrations_.forEach(s=>{const o=s.createCancelEvent(n,i);o&&r.push(o)})}if(e){let i=[];for(let s=0;s<t.eventRegistrations_.length;++s){const o=t.eventRegistrations_[s];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(t.eventRegistrations_.slice(s+1));break}}t.eventRegistrations_=i}else t.eventRegistrations_=[];return r}function Df(t,e,n,r){e.type===pt.MERGE&&e.source.queryId!==null&&(x(ir(t.viewCache_),"We should always have a full cache before handling merges"),x(el(t.viewCache_),"Missing event cache, even though we have a server cache"));const i=t.viewCache_,s=FC(t.processor_,i,e,n,r);return LC(t.processor_,s.viewCache),x(s.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),t.viewCache_=s.viewCache,I_(t,s.changes,s.viewCache.eventCache.getNode(),null)}function QC(t,e){const n=t.viewCache_.eventCache,r=[];return n.getNode().isLeafNode()||n.getNode().forEachChild(de,(s,o)=>{r.push(Xr(s,o))}),n.isFullyInitialized()&&r.push(g_(n.getNode())),I_(t,r,n.getNode(),e)}function I_(t,e,n,r){const i=r?[r]:t.eventRegistrations_;return gC(t.eventGenerator_,e,n,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let il;class x_{constructor(){this.views=new Map}}function YC(t){x(!il,"__referenceConstructor has already been defined"),il=t}function qC(){return x(il,"Reference.ts has not been loaded"),il}function XC(t){return t.views.size===0}function hd(t,e,n,r){const i=e.source.queryId;if(i!==null){const s=t.views.get(i);return x(s!=null,"SyncTree gave us an op for an invalid query."),Df(s,e,n,r)}else{let s=[];for(const o of t.views.values())s=s.concat(Df(o,e,n,r));return s}}function T_(t,e,n,r,i){const s=e._queryIdentifier,o=t.views.get(s);if(!o){let l=tl(n,i?r:null),a=!1;l?a=!0:r instanceof j?(l=ud(n,r),a=!1):(l=j.EMPTY_NODE,a=!1);const u=Ol(new Rn(l,a,!1),new Rn(r,i,!1));return new VC(e,u)}return o}function JC(t,e,n,r,i,s){const o=T_(t,e,r,i,s);return t.views.has(e._queryIdentifier)||t.views.set(e._queryIdentifier,o),KC(o,n),QC(o,n)}function ZC(t,e,n,r){const i=e._queryIdentifier,s=[];let o=[];const l=Pn(t);if(i==="default")for(const[a,u]of t.views.entries())o=o.concat(Of(u,n,r)),Af(u)&&(t.views.delete(a),u.query._queryParams.loadsAllData()||s.push(u.query));else{const a=t.views.get(i);a&&(o=o.concat(Of(a,n,r)),Af(a)&&(t.views.delete(i),a.query._queryParams.loadsAllData()||s.push(a.query)))}return l&&!Pn(t)&&s.push(new(qC())(e._repo,e._path)),{removed:s,events:o}}function N_(t){const e=[];for(const n of t.views.values())n.query._queryParams.loadsAllData()||e.push(n);return e}function kn(t,e){let n=null;for(const r of t.views.values())n=n||GC(r,e);return n}function R_(t,e){if(e._queryParams.loadsAllData())return Ml(t);{const r=e._queryIdentifier;return t.views.get(r)}}function P_(t,e){return R_(t,e)!=null}function Pn(t){return Ml(t)!=null}function Ml(t){for(const e of t.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sl;function eE(t){x(!sl,"__referenceConstructor has already been defined"),sl=t}function tE(){return x(sl,"Reference.ts has not been loaded"),sl}let nE=1;class Mf{constructor(e){this.listenProvider_=e,this.syncPointTree_=new ee(null),this.pendingWriteTree_=bC(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function b_(t,e,n,r,i){return vC(t.pendingWriteTree_,e,n,r,i),i?di(t,new rr(od(),e,n)):[]}function rE(t,e,n,r){wC(t.pendingWriteTree_,e,n,r);const i=ee.fromObject(n);return di(t,new Jr(od(),e,i))}function dn(t,e,n=!1){const r=SC(t.pendingWriteTree_,e);if(CC(t.pendingWriteTree_,e)){let s=new ee(null);return r.snap!=null?s=s.set(q(),!0):Ne(r.children,o=>{s=s.set(new Z(o),!0)}),di(t,new Zo(r.path,s,n))}else return[]}function Ps(t,e,n){return di(t,new rr(ld(),e,n))}function iE(t,e,n){const r=ee.fromObject(n);return di(t,new Jr(ld(),e,r))}function sE(t,e){return di(t,new _s(ld(),e))}function oE(t,e,n){const r=pd(t,n);if(r){const i=gd(r),s=i.path,o=i.queryId,l=De(s,e),a=new _s(ad(o),l);return md(t,s,a)}else return[]}function ol(t,e,n,r,i=!1){const s=e._path,o=t.syncPointTree_.get(s);let l=[];if(o&&(e._queryIdentifier==="default"||P_(o,e))){const a=ZC(o,e,n,r);XC(o)&&(t.syncPointTree_=t.syncPointTree_.remove(s));const u=a.removed;if(l=a.events,!i){const h=u.findIndex(c=>c._queryParams.loadsAllData())!==-1,d=t.syncPointTree_.findOnPath(s,(c,_)=>Pn(_));if(h&&!d){const c=t.syncPointTree_.subtree(s);if(!c.isEmpty()){const _=uE(c);for(let y=0;y<_.length;++y){const v=_[y],M=v.query,g=M_(t,v);t.listenProvider_.startListening(Hi(M),ys(t,M),g.hashFn,g.onComplete)}}}!d&&u.length>0&&!r&&(h?t.listenProvider_.stopListening(Hi(e),null):u.forEach(c=>{const _=t.queryToTagMap.get(Ll(c));t.listenProvider_.stopListening(Hi(c),_)}))}cE(t,u)}return l}function A_(t,e,n,r){const i=pd(t,r);if(i!=null){const s=gd(i),o=s.path,l=s.queryId,a=De(o,e),u=new rr(ad(l),a,n);return md(t,o,u)}else return[]}function lE(t,e,n,r){const i=pd(t,r);if(i){const s=gd(i),o=s.path,l=s.queryId,a=De(o,e),u=ee.fromObject(n),h=new Jr(ad(l),a,u);return md(t,o,h)}else return[]}function Wu(t,e,n,r=!1){const i=e._path;let s=null,o=!1;t.syncPointTree_.foreachOnPath(i,(c,_)=>{const y=De(c,i);s=s||kn(_,y),o=o||Pn(_)});let l=t.syncPointTree_.get(i);l?(o=o||Pn(l),s=s||kn(l,q())):(l=new x_,t.syncPointTree_=t.syncPointTree_.set(i,l));let a;s!=null?a=!0:(a=!1,s=j.EMPTY_NODE,t.syncPointTree_.subtree(i).foreachChild((_,y)=>{const v=kn(y,q());v&&(s=s.updateImmediateChild(_,v))}));const u=P_(l,e);if(!u&&!e._queryParams.loadsAllData()){const c=Ll(e);x(!t.queryToTagMap.has(c),"View does not exist, but we have a tag");const _=dE();t.queryToTagMap.set(c,_),t.tagToQueryMap.set(_,c)}const h=Dl(t.pendingWriteTree_,i);let d=JC(l,e,n,h,s,a);if(!u&&!o&&!r){const c=R_(l,e);d=d.concat(hE(t,e,c))}return d}function fd(t,e,n){const i=t.pendingWriteTree_,s=t.syncPointTree_.findOnPath(e,(o,l)=>{const a=De(o,e),u=kn(l,a);if(u)return u});return w_(i,e,s,n,!0)}function aE(t,e){const n=e._path;let r=null;t.syncPointTree_.foreachOnPath(n,(u,h)=>{const d=De(u,n);r=r||kn(h,d)});let i=t.syncPointTree_.get(n);i?r=r||kn(i,q()):(i=new x_,t.syncPointTree_=t.syncPointTree_.set(n,i));const s=r!=null,o=s?new Rn(r,!0,!1):null,l=Dl(t.pendingWriteTree_,e._path),a=T_(i,e,l,s?o.getNode():j.EMPTY_NODE,s);return HC(a)}function di(t,e){return O_(e,t.syncPointTree_,null,Dl(t.pendingWriteTree_,q()))}function O_(t,e,n,r){if(H(t.path))return D_(t,e,n,r);{const i=e.get(q());n==null&&i!=null&&(n=kn(i,q()));let s=[];const o=V(t.path),l=t.operationForChild(o),a=e.children.get(o);if(a&&l){const u=n?n.getImmediateChild(o):null,h=S_(r,o);s=s.concat(O_(l,a,u,h))}return i&&(s=s.concat(hd(i,t,r,n))),s}}function D_(t,e,n,r){const i=e.get(q());n==null&&i!=null&&(n=kn(i,q()));let s=[];return e.children.inorderTraversal((o,l)=>{const a=n?n.getImmediateChild(o):null,u=S_(r,o),h=t.operationForChild(o);h&&(s=s.concat(D_(h,l,a,u)))}),i&&(s=s.concat(hd(i,t,r,n))),s}function M_(t,e){const n=e.query,r=ys(t,n);return{hashFn:()=>($C(e)||j.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return r?oE(t,n._path,r):sE(t,n._path);{const s=sS(i,n);return ol(t,n,null,s)}}}}function ys(t,e){const n=Ll(e);return t.queryToTagMap.get(n)}function Ll(t){return t._path.toString()+"$"+t._queryIdentifier}function pd(t,e){return t.tagToQueryMap.get(e)}function gd(t){const e=t.indexOf("$");return x(e!==-1&&e<t.length-1,"Bad queryKey."),{queryId:t.substr(e+1),path:new Z(t.substr(0,e))}}function md(t,e,n){const r=t.syncPointTree_.get(e);x(r,"Missing sync point for query tag that we're tracking");const i=Dl(t.pendingWriteTree_,e);return hd(r,n,i,null)}function uE(t){return t.fold((e,n,r)=>{if(n&&Pn(n))return[Ml(n)];{let i=[];return n&&(i=N_(n)),Ne(r,(s,o)=>{i=i.concat(o)}),i}})}function Hi(t){return t._queryParams.loadsAllData()&&!t._queryParams.isDefault()?new(tE())(t._repo,t._path):t}function cE(t,e){for(let n=0;n<e.length;++n){const r=e[n];if(!r._queryParams.loadsAllData()){const i=Ll(r),s=t.queryToTagMap.get(i);t.queryToTagMap.delete(i),t.tagToQueryMap.delete(s)}}}function dE(){return nE++}function hE(t,e,n){const r=e._path,i=ys(t,e),s=M_(t,n),o=t.listenProvider_.startListening(Hi(e),i,s.hashFn,s.onComplete),l=t.syncPointTree_.subtree(r);if(i)x(!Pn(l.value),"If we're adding a query, it shouldn't be shadowed");else{const a=l.fold((u,h,d)=>{if(!H(u)&&h&&Pn(h))return[Ml(h).query];{let c=[];return h&&(c=c.concat(N_(h).map(_=>_.query))),Ne(d,(_,y)=>{c=c.concat(y)}),c}});for(let u=0;u<a.length;++u){const h=a[u];t.listenProvider_.stopListening(Hi(h),ys(t,h))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _d{constructor(e){this.node_=e}getImmediateChild(e){const n=this.node_.getImmediateChild(e);return new _d(n)}node(){return this.node_}}class yd{constructor(e,n){this.syncTree_=e,this.path_=n}getImmediateChild(e){const n=ce(this.path_,e);return new yd(this.syncTree_,n)}node(){return fd(this.syncTree_,this.path_)}}const fE=function(t){return t=t||{},t.timestamp=t.timestamp||new Date().getTime(),t},Lf=function(t,e,n){if(!t||typeof t!="object")return t;if(x(".sv"in t,"Unexpected leaf node or priority contents"),typeof t[".sv"]=="string")return pE(t[".sv"],e,n);if(typeof t[".sv"]=="object")return gE(t[".sv"],e);x(!1,"Unexpected server value: "+JSON.stringify(t,null,2))},pE=function(t,e,n){switch(t){case"timestamp":return n.timestamp;default:x(!1,"Unexpected server value: "+t)}},gE=function(t,e,n){t.hasOwnProperty("increment")||x(!1,"Unexpected server value: "+JSON.stringify(t,null,2));const r=t.increment;typeof r!="number"&&x(!1,"Unexpected increment value: "+r);const i=e.node();if(x(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return r;const o=i.getValue();return typeof o!="number"?r:o+r},L_=function(t,e,n,r){return vd(e,new yd(n,t),r)},F_=function(t,e,n){return vd(t,new _d(e),n)};function vd(t,e,n){const r=t.getPriority().val(),i=Lf(r,e.getImmediateChild(".priority"),n);let s;if(t.isLeafNode()){const o=t,l=Lf(o.getValue(),e,n);return l!==o.getValue()||i!==o.getPriority().val()?new we(l,_e(i)):t}else{const o=t;return s=o,i!==o.getPriority().val()&&(s=s.updatePriority(new we(i))),o.forEachChild(de,(l,a)=>{const u=vd(a,e.getImmediateChild(l),n);u!==a&&(s=s.updateImmediateChild(l,u))}),s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd{constructor(e="",n=null,r={children:{},childCount:0}){this.name=e,this.parent=n,this.node=r}}function Sd(t,e){let n=e instanceof Z?e:new Z(e),r=t,i=V(n);for(;i!==null;){const s=Qr(r.node.children,i)||{children:{},childCount:0};r=new wd(i,r,s),n=te(n),i=V(n)}return r}function hi(t){return t.node.value}function U_(t,e){t.node.value=e,Bu(t)}function j_(t){return t.node.childCount>0}function mE(t){return hi(t)===void 0&&!j_(t)}function Fl(t,e){Ne(t.node.children,(n,r)=>{e(new wd(n,t,r))})}function z_(t,e,n,r){n&&!r&&e(t),Fl(t,i=>{z_(i,e,!0,r)}),n&&r&&e(t)}function _E(t,e,n){let r=n?t:t.parent;for(;r!==null;){if(e(r))return!0;r=r.parent}return!1}function bs(t){return new Z(t.parent===null?t.name:bs(t.parent)+"/"+t.name)}function Bu(t){t.parent!==null&&yE(t.parent,t.name,t)}function yE(t,e,n){const r=mE(n),i=bt(t.node.children,e);r&&i?(delete t.node.children[e],t.node.childCount--,Bu(t)):!r&&!i&&(t.node.children[e]=n.node,t.node.childCount++,Bu(t))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vE=/[\[\].#$\/\u0000-\u001F\u007F]/,wE=/[\[\].#$\u0000-\u001F\u007F]/,Na=10*1024*1024,Cd=function(t){return typeof t=="string"&&t.length!==0&&!vE.test(t)},W_=function(t){return typeof t=="string"&&t.length!==0&&!wE.test(t)},SE=function(t){return t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),W_(t)},CE=function(t){return t===null||typeof t=="string"||typeof t=="number"&&!Yc(t)||t&&typeof t=="object"&&bt(t,".sv")},EE=function(t,e,n,r){r&&e===void 0||Ul(Pl(t,"value"),e,n)},Ul=function(t,e,n){const r=n instanceof Z?new jS(n,t):n;if(e===void 0)throw new Error(t+"contains undefined "+jn(r));if(typeof e=="function")throw new Error(t+"contains a function "+jn(r)+" with contents = "+e.toString());if(Yc(e))throw new Error(t+"contains "+e.toString()+" "+jn(r));if(typeof e=="string"&&e.length>Na/3&&bl(e)>Na)throw new Error(t+"contains a string greater than "+Na+" utf8 bytes "+jn(r)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,s=!1;if(Ne(e,(o,l)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(s=!0,!Cd(o)))throw new Error(t+" contains an invalid key ("+o+") "+jn(r)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);zS(r,o),Ul(t,l,r),WS(r)}),i&&s)throw new Error(t+' contains ".value" child '+jn(r)+" in addition to actual children.")}},kE=function(t,e){let n,r;for(n=0;n<e.length;n++){r=e[n];const s=fs(r);for(let o=0;o<s.length;o++)if(!(s[o]===".priority"&&o===s.length-1)){if(!Cd(s[o]))throw new Error(t+"contains an invalid key ("+s[o]+") in path "+r.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(US);let i=null;for(n=0;n<e.length;n++){if(r=e[n],i!==null&&nt(i,r))throw new Error(t+"contains a path "+i.toString()+" that is ancestor of another path "+r.toString());i=r}},IE=function(t,e,n,r){if(r&&e===void 0)return;const i=Pl(t,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const s=[];Ne(e,(o,l)=>{const a=new Z(o);if(Ul(i,l,ce(n,a)),ed(a)===".priority"&&!CE(l))throw new Error(i+"contains an invalid value for '"+a.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");s.push(a)}),kE(i,s)},B_=function(t,e,n,r){if(!(r&&n===void 0)&&!W_(n))throw new Error(Pl(t,e)+'was an invalid path = "'+n+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},xE=function(t,e,n,r){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),B_(t,e,n,r)},V_=function(t,e){if(V(e)===".info")throw new Error(t+" failed = Can't modify data under /.info/")},TE=function(t,e){const n=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Cd(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||n.length!==0&&!SE(n))throw new Error(Pl(t,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NE{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function jl(t,e){let n=null;for(let r=0;r<e.length;r++){const i=e[r],s=i.getPath();n!==null&&!td(s,n.path)&&(t.eventLists_.push(n),n=null),n===null&&(n={events:[],path:s}),n.events.push(i)}n&&t.eventLists_.push(n)}function $_(t,e,n){jl(t,n),H_(t,r=>td(r,e))}function ot(t,e,n){jl(t,n),H_(t,r=>nt(r,e)||nt(e,r))}function H_(t,e){t.recursionDepth_++;let n=!0;for(let r=0;r<t.eventLists_.length;r++){const i=t.eventLists_[r];if(i){const s=i.path;e(s)?(RE(t.eventLists_[r]),t.eventLists_[r]=null):n=!1}}n&&(t.eventLists_=[]),t.recursionDepth_--}function RE(t){for(let e=0;e<t.events.length;e++){const n=t.events[e];if(n!==null){t.events[e]=null;const r=n.getEventRunner();Kn&&Ie("event: "+n.toString()),ci(r)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PE="repo_interrupt",bE=25;class AE{constructor(e,n,r,i){this.repoInfo_=e,this.forceRestClient_=n,this.authTokenProvider_=r,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new NE,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Jo(),this.transactionQueueTree_=new wd,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function OE(t,e,n){if(t.stats_=Jc(t.repoInfo_),t.forceRestClient_||uS())t.server_=new Xo(t.repoInfo_,(r,i,s,o)=>{Ff(t,r,i,s,o)},t.authTokenProvider_,t.appCheckProvider_),setTimeout(()=>Uf(t,!0),0);else{if(typeof n<"u"&&n!==null){if(typeof n!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{ye(n)}catch(r){throw new Error("Invalid authOverride provided: "+r)}}t.persistentConnection_=new $t(t.repoInfo_,e,(r,i,s,o)=>{Ff(t,r,i,s,o)},r=>{Uf(t,r)},r=>{ME(t,r)},t.authTokenProvider_,t.appCheckProvider_,n),t.server_=t.persistentConnection_}t.authTokenProvider_.addTokenChangeListener(r=>{t.server_.refreshAuthToken(r)}),t.appCheckProvider_.addTokenChangeListener(r=>{t.server_.refreshAppCheckToken(r.token)}),t.statsReporter_=pS(t.repoInfo_,()=>new fC(t.stats_,t.server_)),t.infoData_=new aC,t.infoSyncTree_=new Mf({startListening:(r,i,s,o)=>{let l=[];const a=t.infoData_.getNode(r._path);return a.isEmpty()||(l=Ps(t.infoSyncTree_,r._path,a),setTimeout(()=>{o("ok")},0)),l},stopListening:()=>{}}),Ed(t,"connected",!1),t.serverSyncTree_=new Mf({startListening:(r,i,s,o)=>(t.server_.listen(r,s,i,(l,a)=>{const u=o(l,a);ot(t.eventQueue_,r._path,u)}),[]),stopListening:(r,i)=>{t.server_.unlisten(r,i)}})}function DE(t){const n=t.infoData_.getNode(new Z(".info/serverTimeOffset")).val()||0;return new Date().getTime()+n}function zl(t){return fE({timestamp:DE(t)})}function Ff(t,e,n,r,i){t.dataUpdateCount++;const s=new Z(e);n=t.interceptServerDataCallback_?t.interceptServerDataCallback_(e,n):n;let o=[];if(i)if(r){const a=Go(n,u=>_e(u));o=lE(t.serverSyncTree_,s,a,i)}else{const a=_e(n);o=A_(t.serverSyncTree_,s,a,i)}else if(r){const a=Go(n,u=>_e(u));o=iE(t.serverSyncTree_,s,a)}else{const a=_e(n);o=Ps(t.serverSyncTree_,s,a)}let l=s;o.length>0&&(l=ei(t,s)),ot(t.eventQueue_,l,o)}function Uf(t,e){Ed(t,"connected",e),e===!1&&jE(t)}function ME(t,e){Ne(e,(n,r)=>{Ed(t,n,r)})}function Ed(t,e,n){const r=new Z("/.info/"+e),i=_e(n);t.infoData_.updateSnapshot(r,i);const s=Ps(t.infoSyncTree_,r,i);ot(t.eventQueue_,r,s)}function kd(t){return t.nextWriteId_++}function LE(t,e,n){const r=aE(t.serverSyncTree_,e);return r!=null?Promise.resolve(r):t.server_.get(e).then(i=>{const s=_e(i).withIndex(e._queryParams.getIndex());Wu(t.serverSyncTree_,e,n,!0);let o;if(e._queryParams.loadsAllData())o=Ps(t.serverSyncTree_,e._path,s);else{const l=ys(t.serverSyncTree_,e);o=A_(t.serverSyncTree_,e._path,s,l)}return ot(t.eventQueue_,e._path,o),ol(t.serverSyncTree_,e,n,null,!0),s},i=>(As(t,"get for query "+ye(e)+" failed: "+i),Promise.reject(new Error(i))))}function FE(t,e,n,r,i){As(t,"set",{path:e.toString(),value:n,priority:r});const s=zl(t),o=_e(n,r),l=fd(t.serverSyncTree_,e),a=F_(o,l,s),u=kd(t),h=b_(t.serverSyncTree_,e,a,u,!0);jl(t.eventQueue_,h),t.server_.put(e.toString(),o.val(!0),(c,_)=>{const y=c==="ok";y||Le("set at "+e+" failed: "+c);const v=dn(t.serverSyncTree_,u,!y);ot(t.eventQueue_,e,v),$u(t,i,c,_)});const d=xd(t,e);ei(t,d),ot(t.eventQueue_,d,[])}function UE(t,e,n,r){As(t,"update",{path:e.toString(),value:n});let i=!0;const s=zl(t),o={};if(Ne(n,(l,a)=>{i=!1,o[l]=L_(ce(e,l),_e(a),t.serverSyncTree_,s)}),i)Ie("update() called with empty data.  Don't do anything."),$u(t,r,"ok",void 0);else{const l=kd(t),a=rE(t.serverSyncTree_,e,o,l);jl(t.eventQueue_,a),t.server_.merge(e.toString(),n,(u,h)=>{const d=u==="ok";d||Le("update at "+e+" failed: "+u);const c=dn(t.serverSyncTree_,l,!d),_=c.length>0?ei(t,e):e;ot(t.eventQueue_,_,c),$u(t,r,u,h)}),Ne(n,u=>{const h=xd(t,ce(e,u));ei(t,h)}),ot(t.eventQueue_,e,[])}}function jE(t){As(t,"onDisconnectEvents");const e=zl(t),n=Jo();Mu(t.onDisconnect_,q(),(i,s)=>{const o=L_(i,s,t.serverSyncTree_,e);m_(n,i,o)});let r=[];Mu(n,q(),(i,s)=>{r=r.concat(Ps(t.serverSyncTree_,i,s));const o=xd(t,i);ei(t,o)}),t.onDisconnect_=Jo(),ot(t.eventQueue_,q(),r)}function zE(t,e,n){let r;V(e._path)===".info"?r=Wu(t.infoSyncTree_,e,n):r=Wu(t.serverSyncTree_,e,n),$_(t.eventQueue_,e._path,r)}function Vu(t,e,n){let r;V(e._path)===".info"?r=ol(t.infoSyncTree_,e,n):r=ol(t.serverSyncTree_,e,n),$_(t.eventQueue_,e._path,r)}function WE(t){t.persistentConnection_&&t.persistentConnection_.interrupt(PE)}function As(t,...e){let n="";t.persistentConnection_&&(n=t.persistentConnection_.id+":"),Ie(n,...e)}function $u(t,e,n,r){e&&ci(()=>{if(n==="ok")e(null);else{const i=(n||"error").toUpperCase();let s=i;r&&(s+=": "+r);const o=new Error(s);o.code=i,e(o)}})}function G_(t,e,n){return fd(t.serverSyncTree_,e,n)||j.EMPTY_NODE}function Id(t,e=t.transactionQueueTree_){if(e||Wl(t,e),hi(e)){const n=Q_(t,e);x(n.length>0,"Sending zero length transaction queue"),n.every(i=>i.status===0)&&BE(t,bs(e),n)}else j_(e)&&Fl(e,n=>{Id(t,n)})}function BE(t,e,n){const r=n.map(u=>u.currentWriteId),i=G_(t,e,r);let s=i;const o=i.hash();for(let u=0;u<n.length;u++){const h=n[u];x(h.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),h.status=1,h.retryCount++;const d=De(e,h.path);s=s.updateChild(d,h.currentOutputSnapshotRaw)}const l=s.val(!0),a=e;t.server_.put(a.toString(),l,u=>{As(t,"transaction put response",{path:a.toString(),status:u});let h=[];if(u==="ok"){const d=[];for(let c=0;c<n.length;c++)n[c].status=2,h=h.concat(dn(t.serverSyncTree_,n[c].currentWriteId)),n[c].onComplete&&d.push(()=>n[c].onComplete(null,!0,n[c].currentOutputSnapshotResolved)),n[c].unwatcher();Wl(t,Sd(t.transactionQueueTree_,e)),Id(t,t.transactionQueueTree_),ot(t.eventQueue_,e,h);for(let c=0;c<d.length;c++)ci(d[c])}else{if(u==="datastale")for(let d=0;d<n.length;d++)n[d].status===3?n[d].status=4:n[d].status=0;else{Le("transaction at "+a.toString()+" failed: "+u);for(let d=0;d<n.length;d++)n[d].status=4,n[d].abortReason=u}ei(t,e)}},o)}function ei(t,e){const n=K_(t,e),r=bs(n),i=Q_(t,n);return VE(t,i,r),r}function VE(t,e,n){if(e.length===0)return;const r=[];let i=[];const o=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const a=e[l],u=De(n,a.path);let h=!1,d;if(x(u!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),a.status===4)h=!0,d=a.abortReason,i=i.concat(dn(t.serverSyncTree_,a.currentWriteId,!0));else if(a.status===0)if(a.retryCount>=bE)h=!0,d="maxretry",i=i.concat(dn(t.serverSyncTree_,a.currentWriteId,!0));else{const c=G_(t,a.path,o);a.currentInputSnapshot=c;const _=e[l].update(c.val());if(_!==void 0){Ul("transaction failed: Data returned ",_,a.path);let y=_e(_);typeof _=="object"&&_!=null&&bt(_,".priority")||(y=y.updatePriority(c.getPriority()));const M=a.currentWriteId,g=zl(t),f=F_(y,c,g);a.currentOutputSnapshotRaw=y,a.currentOutputSnapshotResolved=f,a.currentWriteId=kd(t),o.splice(o.indexOf(M),1),i=i.concat(b_(t.serverSyncTree_,a.path,f,a.currentWriteId,a.applyLocally)),i=i.concat(dn(t.serverSyncTree_,M,!0))}else h=!0,d="nodata",i=i.concat(dn(t.serverSyncTree_,a.currentWriteId,!0))}ot(t.eventQueue_,n,i),i=[],h&&(e[l].status=2,function(c){setTimeout(c,Math.floor(0))}(e[l].unwatcher),e[l].onComplete&&(d==="nodata"?r.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):r.push(()=>e[l].onComplete(new Error(d),!1,null))))}Wl(t,t.transactionQueueTree_);for(let l=0;l<r.length;l++)ci(r[l]);Id(t,t.transactionQueueTree_)}function K_(t,e){let n,r=t.transactionQueueTree_;for(n=V(e);n!==null&&hi(r)===void 0;)r=Sd(r,n),e=te(e),n=V(e);return r}function Q_(t,e){const n=[];return Y_(t,e,n),n.sort((r,i)=>r.order-i.order),n}function Y_(t,e,n){const r=hi(e);if(r)for(let i=0;i<r.length;i++)n.push(r[i]);Fl(e,i=>{Y_(t,i,n)})}function Wl(t,e){const n=hi(e);if(n){let r=0;for(let i=0;i<n.length;i++)n[i].status!==2&&(n[r]=n[i],r++);n.length=r,U_(e,n.length>0?n:void 0)}Fl(e,r=>{Wl(t,r)})}function xd(t,e){const n=bs(K_(t,e)),r=Sd(t.transactionQueueTree_,e);return _E(r,i=>{Ra(t,i)}),Ra(t,r),z_(r,i=>{Ra(t,i)}),n}function Ra(t,e){const n=hi(e);if(n){const r=[];let i=[],s=-1;for(let o=0;o<n.length;o++)n[o].status===3||(n[o].status===1?(x(s===o-1,"All SENT items should be at beginning of queue."),s=o,n[o].status=3,n[o].abortReason="set"):(x(n[o].status===0,"Unexpected transaction status in abort"),n[o].unwatcher(),i=i.concat(dn(t.serverSyncTree_,n[o].currentWriteId,!0)),n[o].onComplete&&r.push(n[o].onComplete.bind(null,new Error("set"),!1,null))));s===-1?U_(e,void 0):n.length=s+1,ot(t.eventQueue_,bs(e),i);for(let o=0;o<r.length;o++)ci(r[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $E(t){let e="";const n=t.split("/");for(let r=0;r<n.length;r++)if(n[r].length>0){let i=n[r];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function HE(t){const e={};t.charAt(0)==="?"&&(t=t.substring(1));for(const n of t.split("&")){if(n.length===0)continue;const r=n.split("=");r.length===2?e[decodeURIComponent(r[0])]=decodeURIComponent(r[1]):Le(`Invalid query segment '${n}' in query '${t}'`)}return e}const jf=function(t,e){const n=GE(t),r=n.namespace;n.domain==="firebase.com"&&qt(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!r||r==="undefined")&&n.domain!=="localhost"&&qt("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||eS();const i=n.scheme==="ws"||n.scheme==="wss";return{repoInfo:new Zm(n.host,n.secure,r,i,e,"",r!==n.subdomain),path:new Z(n.pathString)}},GE=function(t){let e="",n="",r="",i="",s="",o=!0,l="https",a=443;if(typeof t=="string"){let u=t.indexOf("//");u>=0&&(l=t.substring(0,u-1),t=t.substring(u+2));let h=t.indexOf("/");h===-1&&(h=t.length);let d=t.indexOf("?");d===-1&&(d=t.length),e=t.substring(0,Math.min(h,d)),h<d&&(i=$E(t.substring(h,d)));const c=HE(t.substring(Math.min(t.length,d)));u=e.indexOf(":"),u>=0?(o=l==="https"||l==="wss",a=parseInt(e.substring(u+1),10)):u=e.length;const _=e.slice(0,u);if(_.toLowerCase()==="localhost")n="localhost";else if(_.split(".").length<=2)n=_;else{const y=e.indexOf(".");r=e.substring(0,y).toLowerCase(),n=e.substring(y+1),s=r}"ns"in c&&(s=c.ns)}return{host:e,port:a,domain:n,subdomain:r,secure:o,scheme:l,pathString:i,namespace:s}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_{constructor(e,n,r,i){this.eventType=e,this.eventRegistration=n,this.snapshot=r,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+ye(this.snapshot.exportVal())}}class X_{constructor(e,n,r){this.eventRegistration=e,this.error=n,this.path=r}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Td{constructor(e,n){this.snapshotCallback=e,this.cancelCallback=n}onValue(e,n){this.snapshotCallback.call(null,e,n)}onCancel(e){return x(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(e,n,r,i){this._repo=e,this._path=n,this._queryParams=r,this._orderByCalled=i}get key(){return H(this._path)?null:ed(this._path)}get ref(){return new At(this._repo,this._path)}get _queryIdentifier(){const e=If(this._queryParams),n=qc(e);return n==="{}"?"default":n}get _queryObject(){return If(this._queryParams)}isEqual(e){if(e=lt(e),!(e instanceof Nd))return!1;const n=this._repo===e._repo,r=td(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return n&&r&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+FS(this._path)}}class At extends Nd{constructor(e,n){super(e,n,new sd,!1)}get parent(){const e=a_(this._path);return e===null?null:new At(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class ti{constructor(e,n,r){this._node=e,this.ref=n,this._index=r}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const n=new Z(e),r=ll(this.ref,e);return new ti(this._node.getChild(n),r,de)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(r,i)=>e(new ti(i,ll(this.ref,r),de)))}hasChild(e){const n=new Z(e);return!this._node.getChild(n).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function Q(t,e){return t=lt(t),t._checkNotDeleted("ref"),e!==void 0?ll(t._root,e):t._root}function ll(t,e){return t=lt(t),V(t._path)===null?xE("child","path",e,!1):B_("child","path",e,!1),new At(t._repo,ce(t._path,e))}function KE(t){return V_("remove",t._path),vt(t,null)}function vt(t,e){t=lt(t),V_("set",t._path),EE("set",e,t._path,!1);const n=new Is;return FE(t._repo,t._path,e,null,n.wrapCallback(()=>{})),n.promise}function J_(t,e){IE("update",e,t._path,!1);const n=new Is;return UE(t._repo,t._path,e,n.wrapCallback(()=>{})),n.promise}function ge(t){t=lt(t);const e=new Td(()=>{}),n=new Os(e);return LE(t._repo,t,n).then(r=>new ti(r,new At(t._repo,t._path),t._queryParams.getIndex()))}class Os{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,n){const r=n._queryParams.getIndex();return new q_("value",this,new ti(e.snapshotNode,new At(n._repo,n._path),r))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new X_(this,e,n):null}matches(e){return e instanceof Os?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}class Bl{constructor(e,n){this.eventType=e,this.callbackContext=n}respondsTo(e){let n=e==="children_added"?"child_added":e;return n=n==="children_removed"?"child_removed":n,this.eventType===n}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new X_(this,e,n):null}createEvent(e,n){x(e.childName!=null,"Child events should have a childName.");const r=ll(new At(n._repo,n._path),e.childName),i=n._queryParams.getIndex();return new q_(e.type,this,new ti(e.snapshotNode,r,i),e.prevName)}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof Bl?this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)):!1}hasAnyCallback(){return!!this.callbackContext}}function QE(t,e,n,r,i){let s;if(typeof r=="object"&&(s=void 0,i=r),typeof r=="function"&&(s=r),i&&i.onlyOnce){const a=n,u=(h,d)=>{Vu(t._repo,t,l),a(h,d)};u.userCallback=n.userCallback,u.context=n.context,n=u}const o=new Td(n,s||void 0),l=e==="value"?new Os(o):new Bl(e,o);return zE(t._repo,t,l),()=>Vu(t._repo,t,l)}function YE(t,e,n,r){return QE(t,"value",e,n,r)}function qE(t,e,n){let r=null;const i=n?new Td(n):null;e==="value"?r=new Os(i):e&&(r=new Bl(e,i)),Vu(t._repo,t,r)}YC(At);eE(At);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XE="FIREBASE_DATABASE_EMULATOR_HOST",Hu={};let JE=!1;function ZE(t,e,n,r){const i=e.lastIndexOf(":"),s=e.substring(0,i),o=li(s);t.repoInfo_=new Zm(e,o,t.repoInfo_.namespace,t.repoInfo_.webSocketOnly,t.repoInfo_.nodeAdmin,t.repoInfo_.persistenceKey,t.repoInfo_.includeNamespaceInQueryParams,!0,n),r&&(t.authTokenProvider_=r)}function ek(t,e,n,r,i){let s=r||t.options.databaseURL;s===void 0&&(t.options.projectId||qt("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),Ie("Using default host for project ",t.options.projectId),s=`${t.options.projectId}-default-rtdb.firebaseio.com`);let o=jf(s,i),l=o.repoInfo,a,u;typeof process<"u"&&process.env&&(u=process.env[XE]),u?(a=!0,s=`http://${u}?ns=${l.namespace}`,o=jf(s,i),l=o.repoInfo):a=!o.repoInfo.secure;const h=i&&a?new Mr(Mr.OWNER):new dS(t.name,t.options,e);TE("Invalid Firebase Database URL",o),H(o.path)||qt("Database URL must point to the root of a Firebase Database (not including a child path).");const d=nk(l,t,h,new cS(t,n));return new rk(d,t)}function tk(t,e){const n=Hu[e];(!n||n[t.key]!==t)&&qt(`Database ${e}(${t.repoInfo_}) has already been deleted.`),WE(t),delete n[t.key]}function nk(t,e,n,r){let i=Hu[e.name];i||(i={},Hu[e.name]=i);let s=i[t.toURLString()];return s&&qt("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),s=new AE(t,JE,n,r),i[t.toURLString()]=s,s}class rk{constructor(e,n){this._repoInternal=e,this.app=n,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(OE(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new At(this._repo,q())),this._rootInternal}_delete(){return this._rootInternal!==null&&(tk(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&qt("Cannot call "+e+" on a deleted database.")}}function ik(t=Lm(),e){const n=Qc(t,"database").getImmediate({identifier:e});if(!n._instanceStarted){const r=C1("database");r&&sk(n,...r)}return n}function sk(t,e,n,r={}){t=lt(t),t._checkNotDeleted("useEmulator");const i=`${e}:${n}`,s=t._repoInternal;if(t._instanceStarted){if(i===t._repoInternal.repoInfo_.host&&er(r,s.repoInfo_.emulatorOptions))return;qt("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(s.repoInfo_.nodeAdmin)r.mockUserToken&&qt('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Mr(Mr.OWNER);else if(r.mockUserToken){const l=typeof r.mockUserToken=="string"?r.mockUserToken:E1(r.mockUserToken,t.app.options.projectId);o=new Mr(l)}li(e)&&(Nm(e),Rm("Database",!0)),ZE(s,i,r,o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ok(t){Yw(ui),Yr(new tr("database",(e,{instanceIdentifier:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),s=e.getProvider("app-check-internal");return ek(r,i,s,n)},"PUBLIC").setMultipleInstances(!0)),Cn(af,uf,t),Cn(af,uf,"esm2020")}$t.prototype.simpleListen=function(t,e){this.sendRequest("q",{p:t},e)};$t.prototype.echo=function(t,e){this.sendRequest("echo",{d:t},e)};ok();var lk="firebase",ak="12.6.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Cn(lk,ak,"app");function Z_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const uk=Z_,ey=new xs("auth","Firebase",Z_());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const al=new Gc("@firebase/auth");function ck(t,...e){al.logLevel<=J.WARN&&al.warn(`Auth (${ui}): ${t}`,...e)}function mo(t,...e){al.logLevel<=J.ERROR&&al.error(`Auth (${ui}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(t,...e){throw Pd(t,...e)}function wt(t,...e){return Pd(t,...e)}function Rd(t,e,n){const r={...uk(),[e]:n};return new xs("auth","Firebase",r).create(e,{appName:t.name})}function Qn(t){return Rd(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function dk(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&Pt(t,"argument-error"),Rd(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Pd(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return ey.create(t,...e)}function z(t,e,...n){if(!t)throw Pd(e,...n)}function Wt(t){const e="INTERNAL ASSERTION FAILED: "+t;throw mo(e),new Error(e)}function Xt(t,e){t||Wt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gu(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function hk(){return zf()==="http:"||zf()==="https:"}function zf(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fk(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(hk()||T1()||"connection"in navigator)?navigator.onLine:!0}function pk(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(e,n){this.shortDelay=e,this.longDelay=n,Xt(n>e,"Short delay should be less than long delay!"),this.isMobile=Hc()||Pm()}get(){return fk()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bd(t,e){Xt(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ty{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Wt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Wt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Wt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gk={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mk=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],_k=new Ds(3e4,6e4);function Ad(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function fi(t,e,n,r,i={}){return ny(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const l=ai({key:t.config.apiKey,...o}).slice(1),a=await t._getAdditionalHeaders();a["Content-Type"]="application/json",t.languageCode&&(a["X-Firebase-Locale"]=t.languageCode);const u={method:e,headers:a,...s};return x1()||(u.referrerPolicy="no-referrer"),t.emulatorConfig&&li(t.emulatorConfig.host)&&(u.credentials="include"),ty.fetch()(await ry(t,t.config.apiHost,n,l),u)})}async function ny(t,e,n){t._canInitEmulator=!1;const r={...gk,...e};try{const i=new vk(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw no(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[a,u]=l.split(" : ");if(a==="FEDERATED_USER_ID_ALREADY_LINKED")throw no(t,"credential-already-in-use",o);if(a==="EMAIL_EXISTS")throw no(t,"email-already-in-use",o);if(a==="USER_DISABLED")throw no(t,"user-disabled",o);const h=r[a]||a.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Rd(t,h,u);Pt(t,h)}}catch(i){if(i instanceof Dn)throw i;Pt(t,"network-request-failed",{message:String(i)})}}async function yk(t,e,n,r,i={}){const s=await fi(t,e,n,r,i);return"mfaPendingCredential"in s&&Pt(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function ry(t,e,n,r){const i=`${e}${n}?${r}`,s=t,o=s.config.emulator?bd(t.config,i):`${t.config.apiScheme}://${i}`;return mk.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}class vk{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(wt(this.auth,"network-request-failed")),_k.get())})}}function no(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=wt(t,e,r);return i.customData._tokenResponse=n,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wk(t,e){return fi(t,"POST","/v1/accounts:delete",e)}async function ul(t,e){return fi(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gi(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Sk(t,e=!1){const n=lt(t),r=await n.getIdToken(e),i=Od(r);z(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Gi(Pa(i.auth_time)),issuedAtTime:Gi(Pa(i.iat)),expirationTime:Gi(Pa(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Pa(t){return Number(t)*1e3}function Od(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return mo("JWT malformed, contained fewer than 3 sections"),null;try{const i=Ho(n);return i?JSON.parse(i):(mo("Failed to decode base64 JWT payload"),null)}catch(i){return mo("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Wf(t){const e=Od(t);return z(e,"internal-error"),z(typeof e.exp<"u","internal-error"),z(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vs(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Dn&&Ck(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Ck({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ek{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ku{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Gi(this.lastLoginAt),this.creationTime=Gi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cl(t){var d;const e=t.auth,n=await t.getIdToken(),r=await vs(t,ul(e,{idToken:n}));z(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(d=i.providerUserInfo)!=null&&d.length?iy(i.providerUserInfo):[],o=Ik(t.providerData,s),l=t.isAnonymous,a=!(t.email&&i.passwordHash)&&!(o!=null&&o.length),u=l?a:!1,h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new Ku(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(t,h)}async function kk(t){const e=lt(t);await cl(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Ik(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function iy(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xk(t,e){const n=await ny(t,{},async()=>{const r=ai({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=await ry(t,i,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const a={method:"POST",headers:l,body:r};return t.emulatorConfig&&li(t.emulatorConfig.host)&&(a.credentials="include"),ty.fetch()(o,a)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Tk(t,e){return fi(t,"POST","/v2/accounts:revokeToken",Ad(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){z(e.idToken,"internal-error"),z(typeof e.idToken<"u","internal-error"),z(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Wf(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){z(e.length!==0,"internal-error");const n=Wf(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(z(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await xk(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new Fr;return r&&(z(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(z(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(z(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Fr,this.toJSON())}_performRefresh(){return Wt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function en(t,e){z(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class gt{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Ek(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ku(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await vs(this,this.stsTokenManager.getToken(this.auth,e));return z(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Sk(this,e)}reload(){return kk(this)}_assign(e){this!==e&&(z(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new gt({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){z(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await cl(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ht(this.auth.app))return Promise.reject(Qn(this.auth));const e=await this.getIdToken();return await vs(this,wk(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,o=n.photoURL??void 0,l=n.tenantId??void 0,a=n._redirectEventId??void 0,u=n.createdAt??void 0,h=n.lastLoginAt??void 0,{uid:d,emailVerified:c,isAnonymous:_,providerData:y,stsTokenManager:v}=n;z(d&&v,e,"internal-error");const M=Fr.fromJSON(this.name,v);z(typeof d=="string",e,"internal-error"),en(r,e.name),en(i,e.name),z(typeof c=="boolean",e,"internal-error"),z(typeof _=="boolean",e,"internal-error"),en(s,e.name),en(o,e.name),en(l,e.name),en(a,e.name),en(u,e.name),en(h,e.name);const g=new gt({uid:d,auth:e,email:i,emailVerified:c,displayName:r,isAnonymous:_,photoURL:o,phoneNumber:s,tenantId:l,stsTokenManager:M,createdAt:u,lastLoginAt:h});return y&&Array.isArray(y)&&(g.providerData=y.map(f=>({...f}))),a&&(g._redirectEventId=a),g}static async _fromIdTokenResponse(e,n,r=!1){const i=new Fr;i.updateFromServerResponse(n);const s=new gt({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await cl(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];z(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?iy(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new Fr;l.updateFromIdToken(r);const a=new gt({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Ku(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(a,u),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bf=new Map;function Bt(t){Xt(t instanceof Function,"Expected a class definition");let e=Bf.get(t);return e?(Xt(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Bf.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sy{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}sy.type="NONE";const Vf=sy;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _o(t,e,n){return`firebase:${t}:${e}:${n}`}class Ur{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=_o(this.userKey,i.apiKey,s),this.fullPersistenceKey=_o("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await ul(this.auth,{idToken:e}).catch(()=>{});return n?gt._fromGetAccountInfoResponse(this.auth,n,e):null}return gt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Ur(Bt(Vf),e,r);const i=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||Bt(Vf);const o=_o(r,e.config.apiKey,e.name);let l=null;for(const u of n)try{const h=await u._get(o);if(h){let d;if(typeof h=="string"){const c=await ul(e,{idToken:h}).catch(()=>{});if(!c)break;d=await gt._fromGetAccountInfoResponse(e,c,h)}else d=gt._fromJSON(e,h);u!==s&&(l=d),s=u;break}}catch{}const a=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!a.length?new Ur(s,e,r):(s=a[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async u=>{if(u!==s)try{await u._remove(o)}catch{}})),new Ur(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $f(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(uy(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(oy(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(dy(e))return"Blackberry";if(hy(e))return"Webos";if(ly(e))return"Safari";if((e.includes("chrome/")||ay(e))&&!e.includes("edge/"))return"Chrome";if(cy(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function oy(t=Fe()){return/firefox\//i.test(t)}function ly(t=Fe()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function ay(t=Fe()){return/crios\//i.test(t)}function uy(t=Fe()){return/iemobile/i.test(t)}function cy(t=Fe()){return/android/i.test(t)}function dy(t=Fe()){return/blackberry/i.test(t)}function hy(t=Fe()){return/webos/i.test(t)}function Dd(t=Fe()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Nk(t=Fe()){var e;return Dd(t)&&!!((e=window.navigator)!=null&&e.standalone)}function Rk(){return N1()&&document.documentMode===10}function fy(t=Fe()){return Dd(t)||cy(t)||hy(t)||dy(t)||/windows phone/i.test(t)||uy(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function py(t,e=[]){let n;switch(t){case"Browser":n=$f(Fe());break;case"Worker":n=`${$f(Fe())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${ui}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pk{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,l)=>{try{const a=e(s);o(a)}catch(a){l(a)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bk(t,e={}){return fi(t,"GET","/v2/passwordPolicy",Ad(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ak=6;class Ok{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??Ak,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dk{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Hf(this),this.idTokenSubscription=new Hf(this),this.beforeStateQueue=new Pk(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ey,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Bt(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await Ur.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await ul(this,{idToken:e}),r=await gt._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(ht(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(s=this.redirectUser)==null?void 0:s._redirectEventId,l=r==null?void 0:r._redirectEventId,a=await this.tryRedirectSignIn(e);(!o||o===l)&&(a!=null&&a.user)&&(r=a.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return z(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await cl(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=pk()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ht(this.app))return Promise.reject(Qn(this));const n=e?lt(e):null;return n&&z(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&z(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ht(this.app)?Promise.reject(Qn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ht(this.app)?Promise.reject(Qn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Bt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await bk(this),n=new Ok(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new xs("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Tk(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Bt(e)||this._popupRedirectResolver;z(n,this,"argument-error"),this.redirectPersistenceManager=await Ur.create(this,[Bt(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(z(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const a=e.addObserver(n,r,i);return()=>{o=!0,a()}}else{const a=e.addObserver(n);return()=>{o=!0,a()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return z(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=py(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(ht(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&ck(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Vl(t){return lt(t)}class Hf{constructor(e){this.auth=e,this.observer=null,this.addObserver=F1(n=>this.observer=n)}get next(){return z(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Md={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Mk(t){Md=t}function Lk(t){return Md.loadJS(t)}function Fk(){return Md.gapiScript}function Uk(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jk(t,e){const n=Qc(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(er(s,e??{}))return i;Pt(i,"already-initialized")}return n.initialize({options:e})}function zk(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Bt);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Wk(t,e,n){const r=Vl(t);z(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!!(n!=null&&n.disableWarnings),s=gy(e),{host:o,port:l}=Bk(e),a=l===null?"":`:${l}`,u={url:`${s}//${o}${a}/`},h=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){z(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),z(er(u,r.config.emulator)&&er(h,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=u,r.emulatorConfig=h,r.settings.appVerificationDisabledForTesting=!0,li(o)?(Nm(`${s}//${o}${a}`),Rm("Auth",!0)):i||Vk()}function gy(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Bk(t){const e=gy(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Gf(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:Gf(o)}}}function Gf(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Vk(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class my{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Wt("not implemented")}_getIdTokenResponse(e){return Wt("not implemented")}_linkToIdToken(e,n){return Wt("not implemented")}_getReauthenticationResolver(e){return Wt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jr(t,e){return yk(t,"POST","/v1/accounts:signInWithIdp",Ad(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $k="http://localhost";class sr extends my{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new sr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Pt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const o=new sr(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return jr(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,jr(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,jr(e,n)}buildRequest(){const e={requestUri:$k,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=ai(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ld{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms extends Ld{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on extends Ms{constructor(){super("facebook.com")}static credential(e){return sr._fromParams({providerId:on.PROVIDER_ID,signInMethod:on.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return on.credentialFromTaggedObject(e)}static credentialFromError(e){return on.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return on.credential(e.oauthAccessToken)}catch{return null}}}on.FACEBOOK_SIGN_IN_METHOD="facebook.com";on.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft extends Ms{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return sr._fromParams({providerId:Ft.PROVIDER_ID,signInMethod:Ft.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Ft.credentialFromTaggedObject(e)}static credentialFromError(e){return Ft.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return Ft.credential(n,r)}catch{return null}}}Ft.GOOGLE_SIGN_IN_METHOD="google.com";Ft.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln extends Ms{constructor(){super("github.com")}static credential(e){return sr._fromParams({providerId:ln.PROVIDER_ID,signInMethod:ln.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ln.credentialFromTaggedObject(e)}static credentialFromError(e){return ln.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ln.credential(e.oauthAccessToken)}catch{return null}}}ln.GITHUB_SIGN_IN_METHOD="github.com";ln.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an extends Ms{constructor(){super("twitter.com")}static credential(e,n){return sr._fromParams({providerId:an.PROVIDER_ID,signInMethod:an.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return an.credentialFromTaggedObject(e)}static credentialFromError(e){return an.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return an.credential(n,r)}catch{return null}}}an.TWITTER_SIGN_IN_METHOD="twitter.com";an.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ni{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await gt._fromIdTokenResponse(e,r,i),o=Kf(r);return new ni({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Kf(r);return new ni({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Kf(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dl extends Dn{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,dl.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new dl(e,n,r,i)}}function _y(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?dl._fromErrorAndOperation(t,s,e,r):s})}async function Hk(t,e,n=!1){const r=await vs(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return ni._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gk(t,e,n=!1){const{auth:r}=t;if(ht(r.app))return Promise.reject(Qn(r));const i="reauthenticate";try{const s=await vs(t,_y(r,i,e,t),n);z(s.idToken,r,"internal-error");const o=Od(s.idToken);z(o,r,"internal-error");const{sub:l}=o;return z(t.uid===l,r,"user-mismatch"),ni._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Pt(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kk(t,e,n=!1){if(ht(t.app))return Promise.reject(Qn(t));const r="signIn",i=await _y(t,r,e),s=await ni._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}function Qk(t,e,n,r){return lt(t).onIdTokenChanged(e,n,r)}function Yk(t,e,n){return lt(t).beforeAuthStateChanged(e,n)}const hl="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yy{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(hl,"1"),this.storage.removeItem(hl),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qk=1e3,Xk=10;class vy extends yy{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=fy(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,a)=>{this.notifyListeners(o,a)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);Rk()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Xk):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},qk)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}vy.type="LOCAL";const Jk=vy;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wy extends yy{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}wy.type="SESSION";const Sy=wy;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zk(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $l{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new $l(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(o).map(async u=>u(n.origin,s)),a=await Zk(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:a})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}$l.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fd(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eI{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((l,a)=>{const u=Fd("",20);i.port1.start();const h=setTimeout(()=>{a(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(d){const c=d;if(c.data.eventId===u)switch(c.data.status){case"ack":clearTimeout(h),s=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(c.data.response);break;default:clearTimeout(h),clearTimeout(s),a(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rt(){return window}function tI(t){Rt().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cy(){return typeof Rt().WorkerGlobalScope<"u"&&typeof Rt().importScripts=="function"}async function nI(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function rI(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function iI(){return Cy()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ey="firebaseLocalStorageDb",sI=1,fl="firebaseLocalStorage",ky="fbase_key";class Ls{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Hl(t,e){return t.transaction([fl],e?"readwrite":"readonly").objectStore(fl)}function oI(){const t=indexedDB.deleteDatabase(Ey);return new Ls(t).toPromise()}function Qu(){const t=indexedDB.open(Ey,sI);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(fl,{keyPath:ky})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(fl)?e(r):(r.close(),await oI(),e(await Qu()))})})}async function Qf(t,e,n){const r=Hl(t,!0).put({[ky]:e,value:n});return new Ls(r).toPromise()}async function lI(t,e){const n=Hl(t,!1).get(e),r=await new Ls(n).toPromise();return r===void 0?null:r.value}function Yf(t,e){const n=Hl(t,!0).delete(e);return new Ls(n).toPromise()}const aI=800,uI=3;class Iy{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Qu(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>uI)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Cy()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=$l._getInstance(iI()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await nI(),!this.activeServiceWorker)return;this.sender=new eI(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||rI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Qu();return await Qf(e,hl,"1"),await Yf(e,hl),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Qf(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>lI(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Yf(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Hl(i,!1).getAll();return new Ls(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),aI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Iy.type="LOCAL";const cI=Iy;new Ds(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xy(t,e){return e?Bt(e):(z(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud extends my{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return jr(e,this._buildIdpRequest())}_linkToIdToken(e,n){return jr(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return jr(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function dI(t){return Kk(t.auth,new Ud(t),t.bypassAuthState)}function hI(t){const{auth:e,user:n}=t;return z(n,e,"internal-error"),Gk(n,new Ud(t),t.bypassAuthState)}async function fI(t){const{auth:e,user:n}=t;return z(n,e,"internal-error"),Hk(n,new Ud(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ty{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const a={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(a))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return dI;case"linkViaPopup":case"linkViaRedirect":return fI;case"reauthViaPopup":case"reauthViaRedirect":return hI;default:Pt(this.auth,"internal-error")}}resolve(e){Xt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Xt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pI=new Ds(2e3,1e4);async function gI(t,e,n){if(ht(t.app))return Promise.reject(wt(t,"operation-not-supported-in-this-environment"));const r=Vl(t);dk(t,e,Ld);const i=xy(r,n);return new $n(r,"signInViaPopup",e,i).executeNotNull()}class $n extends Ty{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,$n.currentPopupAction&&$n.currentPopupAction.cancel(),$n.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return z(e,this.auth,"internal-error"),e}async onExecution(){Xt(this.filter.length===1,"Popup operations only handle one event");const e=Fd();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(wt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(wt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,$n.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(wt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,pI.get())};e()}}$n.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mI="pendingRedirect",yo=new Map;class _I extends Ty{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=yo.get(this.auth._key());if(!e){try{const r=await yI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}yo.set(this.auth._key(),e)}return this.bypassAuthState||yo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function yI(t,e){const n=SI(e),r=wI(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function vI(t,e){yo.set(t._key(),e)}function wI(t){return Bt(t._redirectPersistence)}function SI(t){return _o(mI,t.config.apiKey,t.name)}async function CI(t,e,n=!1){if(ht(t.app))return Promise.reject(Qn(t));const r=Vl(t),i=xy(r,e),o=await new _I(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const EI=10*60*1e3;class kI{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!II(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Ny(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(wt(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=EI&&this.cachedEventUids.clear(),this.cachedEventUids.has(qf(e))}saveEventToCache(e){this.cachedEventUids.add(qf(e)),this.lastProcessedEventTime=Date.now()}}function qf(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Ny({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function II(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Ny(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xI(t,e={}){return fi(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TI=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,NI=/^https?/;async function RI(t){if(t.config.emulator)return;const{authorizedDomains:e}=await xI(t);for(const n of e)try{if(PI(n))return}catch{}Pt(t,"unauthorized-domain")}function PI(t){const e=Gu(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!NI.test(n))return!1;if(TI.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bI=new Ds(3e4,6e4);function Xf(){const t=Rt().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function AI(t){return new Promise((e,n)=>{var i,s,o;function r(){Xf(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Xf(),n(wt(t,"network-request-failed"))},timeout:bI.get()})}if((s=(i=Rt().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((o=Rt().gapi)!=null&&o.load)r();else{const l=Uk("iframefcb");return Rt()[l]=()=>{gapi.load?r():n(wt(t,"network-request-failed"))},Lk(`${Fk()}?onload=${l}`).catch(a=>n(a))}}).catch(e=>{throw vo=null,e})}let vo=null;function OI(t){return vo=vo||AI(t),vo}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DI=new Ds(5e3,15e3),MI="__/auth/iframe",LI="emulator/auth/iframe",FI={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},UI=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function jI(t){const e=t.config;z(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?bd(e,LI):`https://${t.config.authDomain}/${MI}`,r={apiKey:e.apiKey,appName:t.name,v:ui},i=UI.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${ai(r).slice(1)}`}async function zI(t){const e=await OI(t),n=Rt().gapi;return z(n,t,"internal-error"),e.open({where:document.body,url:jI(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:FI,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=wt(t,"network-request-failed"),l=Rt().setTimeout(()=>{s(o)},DI.get());function a(){Rt().clearTimeout(l),i(r)}r.ping(a).then(a,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WI={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},BI=500,VI=600,$I="_blank",HI="http://localhost";class Jf{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function GI(t,e,n,r=BI,i=VI){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const a={...WI,width:r.toString(),height:i.toString(),top:s,left:o},u=Fe().toLowerCase();n&&(l=ay(u)?$I:n),oy(u)&&(e=e||HI,a.scrollbars="yes");const h=Object.entries(a).reduce((c,[_,y])=>`${c}${_}=${y},`,"");if(Nk(u)&&l!=="_self")return KI(e||"",l),new Jf(null);const d=window.open(e||"",l,h);z(d,t,"popup-blocked");try{d.focus()}catch{}return new Jf(d)}function KI(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QI="__/auth/handler",YI="emulator/auth/handler",qI=encodeURIComponent("fac");async function Zf(t,e,n,r,i,s){z(t.config.authDomain,t,"auth-domain-config-required"),z(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:ui,eventId:i};if(e instanceof Ld){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",Iu(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,d]of Object.entries(s||{}))o[h]=d}if(e instanceof Ms){const h=e.getScopes().filter(d=>d!=="");h.length>0&&(o.scopes=h.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const h of Object.keys(l))l[h]===void 0&&delete l[h];const a=await t._getAppCheckToken(),u=a?`#${qI}=${encodeURIComponent(a)}`:"";return`${XI(t)}?${ai(l).slice(1)}${u}`}function XI({config:t}){return t.emulator?bd(t,YI):`https://${t.authDomain}/${QI}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ba="webStorageSupport";class JI{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Sy,this._completeRedirectFn=CI,this._overrideRedirectResult=vI}async _openPopup(e,n,r,i){var o;Xt((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const s=await Zf(e,n,r,Gu(),i);return GI(e,s,Fd())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Zf(e,n,r,Gu(),i);return tI(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Xt(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await zI(e),r=new kI(e);return n.register("authEvent",i=>(z(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(ba,{type:ba},i=>{var o;const s=(o=i==null?void 0:i[0])==null?void 0:o[ba];s!==void 0&&n(!!s),Pt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=RI(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return fy()||ly()||Dd()}}const ZI=JI;var ep="@firebase/auth",tp="1.11.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ex{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){z(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tx(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function nx(t){Yr(new tr("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;z(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const a={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:py(t)},u=new Dk(r,i,s,a);return zk(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Yr(new tr("auth-internal",e=>{const n=Vl(e.getProvider("auth").getImmediate());return(r=>new ex(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Cn(ep,tp,tx(t)),Cn(ep,tp,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rx=5*60,ix=Tm("authIdTokenMaxAge")||rx;let np=null;const sx=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>ix)return;const i=n==null?void 0:n.token;np!==i&&(np=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function ox(t=Lm()){const e=Qc(t,"auth");if(e.isInitialized())return e.getImmediate();const n=jk(t,{popupRedirectResolver:ZI,persistence:[cI,Jk,Sy]}),r=Tm("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=sx(s.toString());Yk(n,o,()=>o(n.currentUser)),Qk(n,l=>o(l))}}const i=Im("auth");return i&&Wk(n,`http://${i}`),n}function lx(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}Mk({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=wt("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",lx().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});nx("Browser");const ax={apiKey:"AIzaSyA-mvnZp40kJHJ0qIQZZ6zaFmNMSN5V1C8",authDomain:"vitepotlock.firebaseapp.com",databaseURL:"https://vitepotlock-default-rtdb.firebaseio.com",projectId:"vitepotlock",storageBucket:"vitepotlock.firebasestorage.app",messagingSenderId:"1065091003781",appId:"1:1065091003781:web:0303f127f9c00de89d00ec",measurementId:"G-TKYVVKYMEM"},Ry=Mm(ax),Py=ox(Ry),ux=new Ft,K=ik(Ry);async function cx(){return(await gI(Py,ux)).user}async function jd(t){const e=await ge(Q(K,t)),n=e.exists()?e.val():{},r=Object.keys(n).map(s=>Number(s)).filter(s=>!Number.isNaN(s)),i=r.length?Math.max(...r):0;return String(i+1)}async function by(t){const e=await ge(Q(K,`uid_to_id/${t}`));return e.exists()?String(e.val()):null}async function dx(t){const e=await ge(Q(K,`id_to_uid/${t}`));return e.exists()?e.val():null}async function Ay(t){const e=await by(t);if(e)return e;const n=await jd("id_to_uid");return await vt(Q(K,`id_to_uid/${n}`),t),await vt(Q(K,`uid_to_id/${t}`),n),(await ge(Q(K,`users/${n}`))).exists()||await vt(Q(K,`users/${n}`),{uid:t,placeholder:!0}),n}async function zd(t,e){const n=await jd("apartments");return await vt(Q(K,`apartments/${n}`),{name:t,address:e}),String(n)}async function hx(t){(await ge(Q(K,t))).exists()||await vt(Q(K,t),{})}const fx={auth:Py,rtdb:K,loginWithGoogle:cx,getNextNumericId:jd,ensureUserNumericMapping:Ay,getNumericIdFromUid:by,getUidFromNumericId:dx,createNumericApartmentId:zd,ensurePathExists:hx};async function Oy(t,e){await vt(Q(K,`users/${t}`),e),(await ge(Q(K,`meal_matrix/${t}`))).exists()||await vt(Q(K,`meal_matrix/${t}`),{});const r=await ge(Q(K,"users")),i=r.exists()?r.val():{},s={};for(const o of Object.keys(i)){if(o===t)continue;(await ge(Q(K,`meal_matrix/${t}/${o}`))).exists()||(s[`meal_matrix/${t}/${o}`]=0),(await ge(Q(K,`meal_matrix/${o}/${t}`))).exists()||(s[`meal_matrix/${o}/${t}`]=0)}Object.keys(s).length&&await J_(Q(K),s)}async function px(t){const e=await ge(Q(K,t));if(!e.exists())return"1";const n=e.val()||{},r=Object.keys(n).map(Number).filter(i=>!Number.isNaN(i));return String((r.length?Math.max(...r):0)+1)}async function gx(t){const e=await px("meal_events"),n=`meal_events/${e}`;return await vt(Q(K,n),t),await mx(t),e}async function mx(t){const e=t.participants||{},n=[],r=[];for(const[s,o]of Object.entries(e))o.role==="host"?n.push(s):o.role==="guest"&&r.push(s);if(!n.length||!r.length)return;const i={};for(const s of n)for(const o of r){const l=`meal_matrix/${s}/${o}`,a=`meal_matrix/${o}/${s}`,u=await ge(Q(K,l)),h=await ge(Q(K,a)),d=u.exists()?Number(u.val()):0,c=h.exists()?Number(h.val()):0;i[l]=d+1,i[a]=c-1}Object.keys(i).length&&await J_(Q(K),i)}async function zr(){const t=await ge(Q(K,"users")),e=t.exists()?t.val():{};return Object.entries(e).map(([n,r])=>({id:n,...r}))}async function In(){const t=await ge(Q(K,"apartments")),e=t.exists()?t.val():{};return Object.entries(e).map(([n,r])=>({id:n,...r}))}function Dy(){return{gluten_free:!1,dairy_free:!1,vegan:!1,vegetarian:!1,nut_allergy:!1,custom:[]}}function My(){return{drinks:!1,dessert:!1,salad:!1,main_dish:!1,snacks:!1,sides:!1,utensils:!1}}function _x(t){return Number.isInteger(t)?t.toString():t.toFixed(2)}function yx(t){return`${t.name} - ${t.address}`}function vx(t,e){const n={};return t.forEach(r=>{const i=e.find(o=>o.id===r);if(!i||!i.allergies)return;const s=i.allergies;s.gluten_free&&(n["Gluten-free"]=(n["Gluten-free"]||0)+1),s.dairy_free&&(n["Dairy-free"]=(n["Dairy-free"]||0)+1),s.vegan&&(n.Vegan=(n.Vegan||0)+1),s.vegetarian&&(n.Vegetarian=(n.Vegetarian||0)+1),s.nut_allergy&&(n["Nut Allergy"]=(n["Nut Allergy"]||0)+1),s.custom&&Array.isArray(s.custom)&&s.custom.forEach(o=>{n[o]=(n[o]||0)+1})}),n}function wx({user:t,onComplete:e}){const[n,r]=D.useState(""),[i,s]=D.useState(""),[o,l]=D.useState(!1),[a,u]=D.useState([]),[h,d]=D.useState(""),[c,_]=D.useState(null),[y,v]=D.useState(My()),[M,g]=D.useState(Dy()),[f,m]=D.useState(""),w=[{key:"drinks",label:"Drinks"},{key:"dessert",label:"Dessert"},{key:"salad",label:"Salad"},{key:"main_dish",label:"Main Dish"},{key:"snacks",label:"Snacks"},{key:"sides",label:"Sides"},{key:"utensils",label:"Utensils"}],P=[{key:"gluten_free",label:"Gluten-free"},{key:"dairy_free",label:"Dairy-free"},{key:"vegan",label:"Vegan"},{key:"vegetarian",label:"Vegetarian"},{key:"nut_allergy",label:"Nut Allergy"}];D.useEffect(()=>{In().then(u)},[]);const k=b=>{v(W=>({...W,[b]:!W[b]}))},N=b=>{g(W=>({...W,[b]:!W[b]}))},T=()=>{const b=f.trim();!b||M.custom.includes(b)||(g(W=>({...W,custom:[...W.custom,b]})),m(""))},C=b=>{g(W=>({...W,custom:W.custom.filter(F=>F!==b)}))},A=async b=>{if(b.preventDefault(),B)return;l(!0);const W={first_name:n.trim(),last_name:i.trim(),can_bring:y,allergies:M};c?W.newApartment={name:c.name.trim(),address:c.address.trim()}:W.apartmentId=h,await e(W),l(!1)},B=!n.trim()||!i.trim()||(c?!c.name.trim()||!c.address.trim():!h);return p.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"40px 20px",minHeight:"100vh"},children:p.jsxs("form",{onSubmit:A,style:{display:"flex",flexDirection:"column",width:"100%",maxWidth:580,gap:20,backgroundColor:"white",padding:40,borderRadius:20,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",fontFamily:"Inter, sans-serif",border:"4px solid transparent",backgroundImage:"linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",backgroundOrigin:"border-box",backgroundClip:"padding-box, border-box"},children:[p.jsx("h2",{style:{margin:0,fontWeight:900,background:"linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",textAlign:"center",fontSize:"2.2rem",letterSpacing:"-0.5px"},children:"Create Your Profile"}),p.jsx("p",{style:{marginTop:-4,marginBottom:12,color:"#6b7280",textAlign:"center",fontSize:"1.05rem"},children:"Tell us about yourself so you can join meals."}),p.jsx("input",{placeholder:"First name",value:n,onChange:b=>r(b.target.value),style:fr,autoFocus:!0}),p.jsx("input",{placeholder:"Last name",value:i,onChange:b=>s(b.target.value),style:fr}),p.jsxs("select",{value:c?"new":h,onChange:b=>{b.target.value==="new"?(_({name:"",address:""}),d("")):(_(null),d(b.target.value))},style:fr,children:[p.jsx("option",{value:"",children:"-- Select Existing Apartment --"}),a.map(b=>p.jsxs("option",{value:b.id,children:[b.name," — ",b.address]},b.id)),p.jsx("option",{value:"new",style:{color:"#2563eb",fontWeight:600},children:"+ Create New Apartment"})]}),c&&p.jsxs(p.Fragment,{children:[p.jsx("input",{placeholder:"Apartment name",value:c.name,onChange:b=>_({...c,name:b.target.value}),style:fr}),p.jsx("input",{placeholder:"Apartment address",value:c.address,onChange:b=>_({...c,address:b.target.value}),style:fr})]}),p.jsx(ip,{text:"What can you bring?"}),p.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:w.map(b=>p.jsxs("label",{style:rp,children:[p.jsx("input",{type:"checkbox",checked:y[b.key],onChange:()=>k(b.key)}),b.label]},b.key))}),p.jsx(ip,{text:"Allergies / Dietary Restrictions"}),P.map(b=>p.jsxs("label",{style:rp,children:[p.jsx("input",{type:"checkbox",checked:M[b.key],onChange:()=>N(b.key)}),b.label]},b.key)),p.jsxs("div",{style:{marginTop:10},children:[p.jsx("input",{placeholder:"Add another allergy...",value:f,onChange:b=>m(b.target.value),style:fr}),p.jsx("button",{type:"button",onClick:T,style:Sx,children:"Add Allergy"})]}),M.custom.length>0&&p.jsx("ul",{style:{marginTop:10,paddingLeft:0},children:M.custom.map(b=>p.jsxs("li",{style:Ex,children:[b,p.jsx("button",{type:"button",onClick:()=>C(b),style:Cx,children:"✕"})]},b))}),p.jsx("button",{type:"submit",disabled:B||o,style:{padding:"16px 0",borderRadius:12,border:"none",background:B||o?"#d1d5db":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",color:"white",fontWeight:800,fontSize:"1.1rem",cursor:B||o?"not-allowed":"pointer",marginTop:20,boxShadow:B||o?"none":"0 8px 20px rgba(102, 126, 234, 0.4)",transition:"all 0.2s ease",letterSpacing:"0.5px"},children:o?"Creating Profile…":"Create Profile"})]})})}const fr={padding:14,borderRadius:12,border:"2px solid #e5e7eb",fontSize:"1rem",width:"100%",fontWeight:500,transition:"all 0.2s ease"},rp={display:"flex",alignItems:"center",gap:8,padding:"6px 0"},Sx={marginTop:8,padding:"10px 18px",background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(16, 185, 129, 0.3)",transition:"all 0.2s ease"},Cx={background:"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",border:"none",borderRadius:8,color:"white",padding:"4px 10px",cursor:"pointer",fontWeight:600,fontSize:"0.9rem"},Ex={display:"flex",justifyContent:"space-between",background:"linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",padding:"10px 14px",borderRadius:10,marginBottom:8,fontSize:"0.95rem",alignItems:"center",fontWeight:600,border:"2px solid #f9a8d4"};function ip({text:t}){return p.jsx("h3",{style:{marginTop:16,marginBottom:12,fontSize:"1.2rem",fontWeight:800,background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",letterSpacing:"-0.3px"},children:t})}function Ly({mealId:t,onClose:e,onCreated:n,authUser:r,currentUserId:i}){const s=!t,[o,l]=D.useState(null),[a,u]=D.useState([]),[h,d]=D.useState([]),[c,_]=D.useState([]),[y,v]=D.useState(!0),[M,g]=D.useState(!1),[f,m]=D.useState("info"),[w,P]=D.useState("");D.useEffect(()=>{async function S(){if(v(!0),s){const Et={title:"",host_apartment_id:"",participants:{},datetime:new Date(Date.now()+36e5).toISOString(),created_at:new Date().toISOString(),instructions:"",allowGuestsFoodSelection:!1,messages:{}};l(Et);const[gi,Mn]=await Promise.all([zr(),In()]);u(gi),d(Mn);const Wd=await ge(Q(K,"food")),Uy=Wd.exists()?Object.keys(Wd.val()):[];_(Uy),v(!1);return}const I=await ge(Q(K,`meal_events/${t}`));if(!I.exists()){alert("Meal not found"),v(!1);return}let R=I.val();if(R.hosts||R.guests){const Et={};if(R.hosts)for(const[gi,Mn]of Object.entries(R.hosts))Et[gi]={food:Mn.food||"none",specifics:Mn.specifics||"",role:"host"};if(R.guests)for(const[gi,Mn]of Object.entries(R.guests))Et[gi]={food:Mn.food||"none",specifics:Mn.specifics||"",role:"guest"};R={...R,participants:Et,title:R.title||"",host_apartment_id:R.host_apartment_id||"",datetime:R.datetime||new Date().toISOString(),created_at:R.created_at||new Date().toISOString(),instructions:R.instructions||"",allowGuestsFoodSelection:R.allowGuestsFoodSelection||!1,messages:R.messages||{}},delete R.hosts,delete R.guests}const U={title:R.title||"",host_apartment_id:R.host_apartment_id||"",participants:R.participants||{},datetime:R.datetime||new Date().toISOString(),created_at:R.created_at||new Date().toISOString(),instructions:R.instructions||"",allowGuestsFoodSelection:R.allowGuestsFoodSelection||!1,messages:R.messages||{}};l(U);const[Je,Ot]=await Promise.all([zr(),In()]);u(Je),d(Ot);const cr=await ge(Q(K,"food")),Dt=cr.exists()?Object.keys(cr.val()):[];_(Dt),v(!1)}S()},[t]);const k=D.useMemo(()=>{if(s)return!0;if(!o||!r)return!1;const S=o.participants[r.uid];return S&&S.role==="host"},[o,r,s]),N=D.useMemo(()=>o?new Date(o.datetime)<new Date:!1,[o]),T=D.useMemo(()=>i||null,[i]),C=()=>{if(!k||!w||!o||w in o.participants)return;const S=a.find(R=>R.id===w);if(!S)return;const I=S.apartment===o.host_apartment_id?"host":"guest";l(R=>R&&{...R,participants:{...R.participants,[w]:{food:"none",specifics:"",role:I}}}),P("")},A=S=>{!k||!o||l(I=>{if(!I)return I;const R={...I.participants};return delete R[S],{...I,participants:R}})},B=S=>{!k||!o||l(I=>{if(!I)return I;const R=I.participants[S];return R?{...I,participants:{...I.participants,[S]:{...R,role:R.role==="host"?"guest":"host"}}}:I})},b=(S,I)=>{N||!o||!(k||S===T)||l(U=>{if(!U)return U;const Je=U.participants[S];return Je?{...U,participants:{...U.participants,[S]:{...Je,food:I}}}:U})},W=(S,I)=>{N||!o||!(k||S===T)||l(U=>{if(!U)return U;const Je=U.participants[S];return Je?{...U,participants:{...U.participants,[S]:{...Je,specifics:I}}}:U})},F=async()=>{if(!o)return;if(!o.title.trim()){alert("Please enter a meal title");return}if(!o.host_apartment_id){alert("Please select a host apartment");return}if(Object.keys(o.participants).length===0){alert("Please add at least one participant");return}if(!Object.values(o.participants).some(R=>R.role==="host")){alert("At least one participant must be a host");return}g(!0);try{s?(await gx(o),alert("Meal created!"),n&&n(),e&&e()):(await vt(Q(K,`meal_events/${t}`),o),alert("Meal updated!"),e&&e())}catch(R){console.error(R),alert(`Failed to ${s?"create":"save"} meal: `+R.message)}finally{g(!1)}},he=async()=>{if(window.confirm("Delete this meal?"))try{await KE(Q(K,`meal_events/${t}`)),alert("Meal deleted!"),e&&e()}catch(S){console.error(S),alert("Failed to delete meal: "+S.message)}},Ct=D.useMemo(()=>{if(!o)return{};const S=Object.keys(o.participants);return vx(S,a)},[o,a]),pi=D.useMemo(()=>{if(!o)return[];const S=new Set(Object.keys(o.participants));return a.filter(I=>!S.has(I.id))},[a,o]),O=D.useMemo(()=>o?Object.entries(o.participants).map(([S,I])=>{const R=a.find(U=>U.id===S);return{userId:S,participant:I,user:R}}):[],[o,a]);return y||!o?p.jsx("div",{style:{padding:20},children:"Loading meal editor…"}):p.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1e3,backdropFilter:"blur(4px)"},children:p.jsxs("div",{style:{background:"white",padding:32,borderRadius:20,maxWidth:950,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.3)",border:"4px solid transparent",backgroundImage:"linear-gradient(white, white), linear-gradient(135deg, #10b981 0%, #059669 100%)",backgroundOrigin:"border-box",backgroundClip:"padding-box, border-box"},children:[p.jsx("h3",{style:{marginBottom:20,fontWeight:900,fontSize:"1.8rem",background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",letterSpacing:"-0.5px"},children:s?"Create New Meal":o.title||"Edit Meal"}),p.jsx("div",{style:{display:"flex",gap:10,marginBottom:24,background:"#f3f4f6",padding:6,borderRadius:50,width:"fit-content"},children:(s?["info","participants"]:["info","participants","messages"]).map(S=>p.jsx("button",{onClick:()=>m(S),style:{padding:"10px 20px",borderRadius:50,border:"none",background:f===S?"linear-gradient(135deg, #10b981 0%, #059669 100%)":"transparent",color:f===S?"white":"#6b7280",fontWeight:700,cursor:"pointer",fontSize:"1rem",transition:"all 0.2s ease",boxShadow:f===S?"0 4px 12px rgba(16, 185, 129, 0.3)":"none"},children:S.charAt(0).toUpperCase()+S.slice(1)},S))}),f==="info"&&p.jsxs("div",{children:[p.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16},children:[p.jsxs("div",{children:[p.jsx("label",{style:{display:"block",marginBottom:8,fontWeight:700,color:"#374151",fontSize:"0.9rem"},children:"Meal Title"}),p.jsx("input",{value:o.title,onChange:S=>k&&!N&&l(I=>I&&{...I,title:S.target.value}),placeholder:"Enter meal title...",disabled:!k||N,style:{padding:"12px 16px",borderRadius:12,border:"2px solid #d1d5db",width:"100%",fontWeight:600,fontSize:"1rem"}})]}),p.jsxs("div",{children:[p.jsx("label",{style:{display:"block",marginBottom:8,fontWeight:700,color:"#374151",fontSize:"0.9rem"},children:"Host Apartment"}),p.jsxs("select",{value:o.host_apartment_id,onChange:S=>k&&!N&&l(I=>I&&{...I,host_apartment_id:S.target.value}),disabled:!k||N,style:{padding:"12px 16px",borderRadius:12,border:"2px solid #d1d5db",width:"100%",fontWeight:600,fontSize:"1rem"},children:[p.jsx("option",{value:"",children:"-- Select host apartment --"}),h.map(S=>p.jsxs("option",{value:S.id,children:[S.name," — ",S.address]},S.id))]})]})]}),p.jsxs("div",{style:{marginTop:24,padding:20,background:"linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",borderRadius:12,border:"2px solid #fbbf24"},children:[p.jsx("h4",{style:{margin:"0 0 12px 0",fontWeight:800,fontSize:"1.05rem",color:"#78350f"},children:"🥜 Allergens (Meal Participants)"}),Object.keys(Ct).length>0?p.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:8},children:Object.entries(Ct).map(([S,I])=>p.jsxs("span",{style:{padding:"6px 14px",background:"white",borderRadius:20,fontWeight:700,fontSize:"0.9rem",color:"#92400e",border:"2px solid #fbbf24"},children:[S," (",I,")"]},S))}):p.jsx("div",{style:{color:"#92400e",fontWeight:600},children:"No allergens reported"})]}),p.jsxs("div",{style:{marginTop:20},children:[p.jsx("label",{style:{display:"block",marginBottom:8,fontWeight:700,color:"#374151",fontSize:"0.9rem"},children:"Special Instructions"}),p.jsx("textarea",{value:o.instructions,onChange:S=>k&&!N&&l(I=>I&&{...I,instructions:S.target.value}),disabled:!k||N,style:{width:"100%",minHeight:100,padding:"12px 16px",borderRadius:12,border:"2px solid #d1d5db",fontWeight:500,fontSize:"0.95rem",fontFamily:"Inter, sans-serif",resize:"vertical"},placeholder:"Add any special instructions for the meal..."})]})]}),f==="participants"&&p.jsxs("div",{style:{marginTop:12},children:[k&&!N&&p.jsxs("div",{style:{marginBottom:20,padding:16,background:"linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",borderRadius:12,border:"2px solid #60a5fa"},children:[p.jsx("div",{style:{marginBottom:12,fontWeight:800,color:"#1e40af",fontSize:"1rem"},children:"👥 Add Participant"}),p.jsxs("div",{style:{display:"flex",gap:12},children:[p.jsxs("select",{value:w,onChange:S=>P(S.target.value),style:{flex:1,padding:"12px 16px",borderRadius:12,border:"2px solid #60a5fa",fontWeight:600,fontSize:"0.95rem",background:"white"},children:[p.jsx("option",{value:"",children:"-- Select user --"}),pi.map(S=>p.jsxs("option",{value:S.id,children:[S.first_name," ",S.last_name," (Apt: ",S.apartment||"—",")"]},S.id))]}),p.jsx("button",{type:"button",onClick:C,disabled:!w,style:{padding:"12px 24px",borderRadius:12,border:"none",background:w?"linear-gradient(135deg, #10b981 0%, #059669 100%)":"#d1d5db",color:"white",cursor:w?"pointer":"not-allowed",fontWeight:700,fontSize:"1rem",boxShadow:w?"0 4px 12px rgba(16, 185, 129, 0.3)":"none"},children:"Add"})]})]}),p.jsxs("h4",{style:{marginBottom:16,fontWeight:800,fontSize:"1.05rem",color:"#374151"},children:["Participants (",O.length,")"]}),O.length===0?p.jsx("div",{style:{color:"#9ca3af",padding:32,textAlign:"center",background:"#f9fafb",borderRadius:12,fontWeight:600},children:"No participants yet"}):p.jsx("div",{style:{overflowX:"auto",background:"white",borderRadius:12,border:"2px solid #e5e7eb"},children:p.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[p.jsx("thead",{children:p.jsxs("tr",{style:{background:"linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"},children:[p.jsx("th",{style:{textAlign:"left",padding:"14px 12px",fontWeight:800,fontSize:"0.9rem",color:"#374151"},children:"Name"}),p.jsx("th",{style:{textAlign:"left",padding:"14px 12px",fontWeight:800,fontSize:"0.9rem",color:"#374151"},children:"Food"}),p.jsx("th",{style:{textAlign:"left",padding:"14px 12px",fontWeight:800,fontSize:"0.9rem",color:"#374151"},children:"Specifics"}),p.jsx("th",{style:{textAlign:"left",padding:"14px 12px",fontWeight:800,fontSize:"0.9rem",color:"#374151"},children:"Role"}),k&&!N&&p.jsx("th",{style:{textAlign:"left",padding:"14px 12px",fontWeight:800,fontSize:"0.9rem",color:"#374151"},children:"Actions"})]})}),p.jsx("tbody",{children:O.map(({userId:S,participant:I,user:R})=>R?p.jsxs("tr",{style:{borderBottom:"1px solid #e5e7eb",transition:"background 0.2s"},onMouseEnter:U=>U.currentTarget.style.background="#f9fafb",onMouseLeave:U=>U.currentTarget.style.background="transparent",children:[p.jsxs("td",{style:{padding:"12px",fontWeight:600,color:"#374151"},children:[R.first_name," ",R.last_name]}),p.jsx("td",{style:{padding:"12px"},children:p.jsxs("select",{value:I.food,onChange:U=>b(S,U.target.value),disabled:N||!k&&S!==T,style:{padding:"8px 12px",borderRadius:8,border:"2px solid #d1d5db",fontWeight:600,fontSize:"0.9rem",minWidth:120},children:[p.jsx("option",{value:"none",children:"None"}),c.map(U=>p.jsx("option",{value:U,children:U},U))]})}),p.jsx("td",{style:{padding:"12px"},children:p.jsx("input",{type:"text",value:I.specifics,onChange:U=>W(S,U.target.value),disabled:N||!k&&S!==T,placeholder:"e.g., vegan, GF",style:{padding:"8px 12px",borderRadius:8,border:"2px solid #d1d5db",width:"100%",fontWeight:500,fontSize:"0.9rem"}})}),p.jsx("td",{style:{padding:"12px"},children:p.jsx("button",{type:"button",onClick:()=>B(S),disabled:!k||N,style:{padding:"6px 14px",borderRadius:20,border:"none",background:I.role==="host"?"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)":"linear-gradient(135deg, #10b981 0%, #059669 100%)",color:"white",fontSize:"0.85rem",fontWeight:700,cursor:k&&!N?"pointer":"not-allowed",boxShadow:"0 2px 8px rgba(0,0,0,0.15)",opacity:k&&!N?1:.6},children:I.role==="host"?"Host":"Guest"})}),k&&!N&&p.jsx("td",{style:{padding:"12px"},children:p.jsx("button",{type:"button",onClick:()=>A(S),style:{padding:"6px 12px",borderRadius:8,border:"none",background:"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",color:"white",cursor:"pointer",fontWeight:700,fontSize:"0.85rem"},children:"Remove"})})]},S):null)})]})})]}),f==="messages"&&p.jsxs("div",{style:{marginTop:12},children:[p.jsx("h4",{children:"Messages"}),p.jsx("div",{style:{maxHeight:200,overflowY:"auto",background:"#f3f4f6",padding:8,borderRadius:6,marginBottom:8},children:Object.entries(o.messages).length===0?p.jsx("div",{style:{color:"#6b7280"},children:"No messages yet"}):Object.entries(o.messages).map(([S,I])=>{const R=a.find(U=>U.id===I.user);return p.jsxs("div",{style:{marginBottom:4},children:[p.jsxs("strong",{children:[R?R.first_name:I.user,":"]})," ",I.text,p.jsx("span",{style:{fontSize:10,color:"#6b7280",marginLeft:8},children:new Date(I.timestamp).toLocaleString()})]},S)})}),t&&i&&p.jsx(kx,{mealId:t,currentUserId:i,onMessageSent:()=>{ge(Q(K,`meal_events/${t}`)).then(S=>{if(S.exists()){const I=S.val();l(I)}})}})]}),p.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:12,marginTop:28},children:[p.jsx("button",{onClick:e,style:{padding:"12px 24px",borderRadius:12,border:"2px solid #d1d5db",background:"white",color:"#6b7280",cursor:"pointer",fontWeight:700,fontSize:"1rem",transition:"all 0.2s ease"},children:"Cancel"}),k&&p.jsxs(p.Fragment,{children:[!s&&p.jsx("button",{onClick:he,style:{padding:"12px 24px",borderRadius:12,border:"none",background:"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",color:"white",cursor:"pointer",fontWeight:700,fontSize:"1rem",boxShadow:"0 4px 12px rgba(239, 68, 68, 0.3)",transition:"all 0.2s ease"},children:"Delete"}),p.jsx("button",{onClick:F,disabled:M,style:{padding:"12px 32px",borderRadius:12,border:"none",background:M?"#d1d5db":"linear-gradient(135deg, #10b981 0%, #059669 100%)",color:"white",cursor:M?"not-allowed":"pointer",fontWeight:800,fontSize:"1.05rem",boxShadow:M?"none":"0 6px 16px rgba(16, 185, 129, 0.4)",transition:"all 0.2s ease",letterSpacing:"0.3px"},children:M?s?"Creating…":"Saving…":s?"Create Meal":"Save Changes"})]})]})]})})}function kx({mealId:t,currentUserId:e,onMessageSent:n}){const[r,i]=D.useState(""),[s,o]=D.useState(!1),l=async()=>{if(!(!r.trim()||!e)){o(!0);try{const a=Date.now(),u=`${a}_${e}`;await vt(Q(K,`meal_events/${t}/messages/${u}`),{user:e,text:r.trim(),timestamp:a}),i(""),n()}catch(a){console.error("Failed to send message:",a),alert("Failed to send message")}finally{o(!1)}}};return p.jsxs("div",{style:{display:"flex",gap:4,marginTop:4},children:[p.jsx("input",{value:r,onChange:a=>i(a.target.value),onKeyDown:a=>a.key==="Enter"&&!s&&l(),placeholder:"Type a message",disabled:s,style:{flex:1,padding:6,borderRadius:6,border:"1px solid #d1d5db"}}),p.jsx("button",{onClick:l,disabled:!r.trim()||s,style:{padding:"6px 12px",borderRadius:6,border:"none",background:!r.trim()||s?"#9ca3af":"#3b82f6",color:"white",cursor:!r.trim()||s?"not-allowed":"pointer"},children:s?"Sending…":"Send"})]})}function sp({myId:t,users:e,apartments:n,mode:r,authUser:i}){const[s,o]=D.useState([]),[l,a]=D.useState(!1),[u,h]=D.useState(null),[d,c]=D.useState(""),[_,y]=D.useState(""),[v,M]=D.useState(""),[g,f]=D.useState(""),[m,w]=D.useState("date_desc");D.useEffect(()=>{async function C(){a(!0);const A=await ge(Q(K,"meal_events")),B=A.exists()?A.val():{},b=Object.entries(B).map(([W,F])=>({id:W,...F}));o(b),a(!1)}C()},[]);const P=(C,A)=>{var B,b;return"participants"in C&&C.participants?A in C.participants:"hosts"in C||"guests"in C?!!((B=C.hosts)!=null&&B[A]||(b=C.guests)!=null&&b[A]):!1},k=(C,A)=>{var B,b,W;return"participants"in C&&((B=C.participants)!=null&&B[A])?C.participants[A].role:"hosts"in C&&((b=C.hosts)!=null&&b[A])?"host":"guests"in C&&((W=C.guests)!=null&&W[A])?"guest":null},N=C=>"participants"in C&&C.participants?Object.keys(C.participants):"hosts"in C||"guests"in C?[...Object.keys(C.hosts||{}),...Object.keys(C.guests||{})]:[],T=D.useMemo(()=>s.filter(C=>P(C,t)).filter(C=>{const A=new Date(C.datetime),B=new Date;if(r==="past"&&A>B||r==="upcoming"&&A<B||d&&!C.title.toLowerCase().includes(d.toLowerCase())||_&&!N(C).includes(_)||v&&C.host_apartment_id!==v)return!1;if(g){const b=k(C,t);if(g==="host"&&b!=="host"||g==="guest"&&b!=="guest")return!1}return!0}).sort((C,A)=>{switch(m){case"date_asc":return new Date(C.datetime).getTime()-new Date(A.datetime).getTime();case"date_desc":return new Date(A.datetime).getTime()-new Date(C.datetime).getTime();case"title_asc":return C.title.localeCompare(A.title);case"title_desc":return A.title.localeCompare(C.title);default:return 0}}),[s,d,_,v,g,m,t,r]);return l?p.jsx("div",{style:{padding:20},children:"Loading meals..."}):p.jsxs("div",{style:{maxWidth:1200,margin:"20px auto",fontFamily:"'Inter', sans-serif"},children:[p.jsxs("h2",{style:{marginBottom:16,color:"white",textShadow:"2px 2px 4px rgba(0,0,0,0.2)",fontWeight:800},children:[r==="past"?"Past":"Upcoming"," Meals"]}),p.jsxs("div",{style:{background:"white",padding:20,borderRadius:16,boxShadow:"0 8px 24px rgba(0,0,0,0.1)",marginBottom:20,border:"3px solid transparent",backgroundImage:"linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",backgroundOrigin:"border-box",backgroundClip:"padding-box, border-box"},children:[p.jsx("h4",{style:{margin:"0 0 16px 0",fontWeight:800,fontSize:"1.1rem",background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"},children:"Filter & Sort"}),p.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:12},children:[p.jsx("input",{placeholder:"🔍 Search title...",value:d,onChange:C=>c(C.target.value),style:{padding:"12px 16px",borderRadius:12,border:"2px solid #fde68a",background:"linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",color:"#78350f",fontWeight:600,fontSize:"0.95rem",transition:"all 0.2s ease"}}),p.jsxs("select",{value:_,onChange:C=>y(C.target.value),style:{padding:"12px 16px",borderRadius:12,border:"2px solid #93c5fd",background:"linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",color:"#1e3a8a",fontWeight:600,fontSize:"0.95rem",transition:"all 0.2s ease"},children:[p.jsx("option",{value:"",children:"👤 All Users"}),e.map(C=>p.jsxs("option",{value:C.id,children:[C.first_name," ",C.last_name]},C.id))]}),p.jsxs("select",{value:v,onChange:C=>M(C.target.value),style:{padding:"12px 16px",borderRadius:12,border:"2px solid #7dd3fc",background:"linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",color:"#0c4a6e",fontWeight:600,fontSize:"0.95rem",transition:"all 0.2s ease"},children:[p.jsx("option",{value:"",children:"🏠 All Apartments"}),n.map(C=>p.jsx("option",{value:C.id,children:C.name},C.id))]}),p.jsxs("select",{value:g,onChange:C=>f(C.target.value),style:{padding:"12px 16px",borderRadius:12,border:"2px solid #6ee7b7",background:"linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",color:"#065f46",fontWeight:600,fontSize:"0.95rem",transition:"all 0.2s ease"},children:[p.jsx("option",{value:"",children:"🎭 All Roles"}),p.jsx("option",{value:"host",children:"Host"}),p.jsx("option",{value:"guest",children:"Guest"})]}),p.jsxs("select",{value:m,onChange:C=>w(C.target.value),style:{padding:"12px 16px",borderRadius:12,border:"2px solid #c4b5fd",background:"linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",color:"#5b21b6",fontWeight:600,fontSize:"0.95rem",transition:"all 0.2s ease"},children:[p.jsx("option",{value:"date_desc",children:"📅 Date ↓"}),p.jsx("option",{value:"date_asc",children:"📅 Date ↑"}),p.jsx("option",{value:"title_asc",children:"🔤 Title A→Z"}),p.jsx("option",{value:"title_desc",children:"🔤 Title Z→A"})]})]})]}),p.jsx("div",{style:{overflowX:"auto",background:"#fef9c3",borderRadius:12,boxShadow:"0 4px 20px rgba(0,0,0,0.05)"},children:p.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",minWidth:600},children:[p.jsx("thead",{style:{background:"#fef3c7"},children:p.jsx("tr",{children:["Title","Date","Apartment","Role"].map(C=>p.jsx("th",{style:{padding:"12px 8px",textAlign:"left",color:"#78350f",fontWeight:600},children:C},C))})}),p.jsx("tbody",{children:T.length===0?p.jsx("tr",{children:p.jsx("td",{colSpan:4,style:{padding:12,textAlign:"center",color:"#78350f"},children:"No meals match the filters."})}):T.map(C=>{const A=n.find(F=>F.id===C.host_apartment_id),B=A?yx(A):"—",b=k(C,t),W=b==="host"?"Host":b==="guest"?"Guest":"—";return p.jsxs("tr",{style:{borderBottom:"1px solid #fde68a",transition:"background 0.2s",cursor:"pointer"},onClick:()=>h(C.id),onMouseEnter:F=>F.currentTarget.style.background="#fef3c7",onMouseLeave:F=>F.currentTarget.style.background="transparent",children:[p.jsx("td",{style:{padding:12},children:C.title}),p.jsx("td",{style:{padding:12},children:new Date(C.datetime).toLocaleString()}),p.jsx("td",{style:{padding:12},children:B}),p.jsx("td",{style:{padding:12},children:p.jsx("span",{style:{padding:"2px 10px",borderRadius:20,background:W==="Host"?"#3b82f6":W==="Guest"?"#10b981":"#9ca3af",color:"white",fontSize:12,fontWeight:600},children:W})})]},C.id)})})]})}),u&&p.jsx(Ly,{mealId:u,authUser:i,currentUserId:t,onClose:()=>h(null)})]})}function op({meals:t,otherUsers:e,showApartment:n,apartmentMode:r}){return p.jsx("div",{style:{maxWidth:800,margin:"0 auto",fontFamily:"'Inter', sans-serif",background:"#e0f7fa",padding:20,borderRadius:12,boxShadow:"0 4px 20px rgba(0,0,0,0.05)"},children:p.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[p.jsx("thead",{children:p.jsxs("tr",{style:{textAlign:"left",borderBottom:"2px solid #80deea"},children:[p.jsx("th",{style:{padding:"12px 8px"},children:r?"Apartment":"User"}),n&&!r&&p.jsx("th",{style:{padding:"12px 8px"},children:"Apartment"}),p.jsx("th",{style:{padding:"12px 8px"},children:"Balance"})]})}),p.jsx("tbody",{children:e.map(i=>{var s;return p.jsxs("tr",{style:{borderBottom:"1px solid #b2ebf2",transition:"background 0.2s"},children:[p.jsxs("td",{style:{padding:12},children:[i.first_name," ",i.last_name]}),n&&!r&&p.jsx("td",{style:{padding:12},children:((s=i.apartment)==null?void 0:s.name)??"-"}),p.jsx("td",{style:{padding:12},children:_x(t[i.id]??0)})]},i.id)})})]})})}function Ix({currentUserId:t}){const[e,n]=D.useState(null),[r,i]=D.useState(null),[s,o]=D.useState(null),[l,a]=D.useState("users");if(D.useEffect(()=>{if(!t)return;const h=Q(K,`meal_matrix/${t}`),d=YE(h,c=>{n(c.exists()?c.val():{})});return()=>qE(h,"value",d)},[t]),D.useEffect(()=>{if(!t)return;async function h(){const[d,c]=await Promise.all([zr(),In()]);o(c);const _=d.filter(y=>y.id!==t).map(y=>({...y,apartment:c.find(v=>v.id===y.apartment)||null}));i(_)}h()},[t]),!e||!r||!s)return p.jsx("div",{style:{padding:20},children:"Loading Meal Ledger…"});const u=s.map(h=>{const d=r.filter(_=>{var y;return((y=_.apartment)==null?void 0:y.id)===h.id}),c=d.length>0?d.reduce((_,y)=>_+(e[y.id]??0),0)/d.length:0;return{...h,avgBalance:c}});return p.jsxs("div",{style:{marginBottom:20},children:[p.jsxs("div",{style:{display:"flex",gap:10,marginBottom:24,background:"white",padding:8,borderRadius:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",width:"fit-content"},children:[p.jsx("button",{onClick:()=>a("users"),style:{padding:"12px 28px",borderRadius:50,border:"none",background:l==="users"?"linear-gradient(135deg, #667eea 0%, #764ba2 100%)":"transparent",color:l==="users"?"white":"#6b7280",cursor:"pointer",fontWeight:700,fontSize:"1rem",transition:"all 0.2s ease",boxShadow:l==="users"?"0 4px 12px rgba(102, 126, 234, 0.3)":"none"},children:"👤 Users"}),p.jsx("button",{onClick:()=>a("apartments"),style:{padding:"12px 28px",borderRadius:50,border:"none",background:l==="apartments"?"linear-gradient(135deg, #667eea 0%, #764ba2 100%)":"transparent",color:l==="apartments"?"white":"#6b7280",cursor:"pointer",fontWeight:700,fontSize:"1rem",transition:"all 0.2s ease",boxShadow:l==="apartments"?"0 4px 12px rgba(102, 126, 234, 0.3)":"none"},children:"🏠 Apartments"})]}),l==="users"&&p.jsx(op,{meals:e,otherUsers:r,showApartment:!0}),l==="apartments"&&p.jsx(op,{meals:u.reduce((h,d)=>(h[d.id]=d.avgBalance,h),{}),otherUsers:u.map(h=>({id:h.id,first_name:h.name,last_name:""})),apartmentMode:!0})]})}function xx({active:t,onChange:e}){const n=[{id:"ledger",label:"Meal Ledger",color:"#667eea"},{id:"upcoming",label:"Upcoming Meals",color:"#10b981"},{id:"past",label:"Past Meals",color:"#f093fb"}];return p.jsx("div",{style:{display:"flex",gap:12,marginBottom:24,background:"white",padding:8,borderRadius:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",width:"fit-content"},children:n.map(r=>p.jsx("button",{onClick:()=>e(r.id),style:{padding:"12px 24px",borderRadius:50,border:"none",cursor:"pointer",background:t===r.id?r.color:"transparent",color:t===r.id?"white":"#374151",fontWeight:700,fontSize:"1rem",fontFamily:"Inter, sans-serif",transition:"all 0.2s ease",boxShadow:t===r.id?`0 4px 12px ${r.color}40`:"none"},children:r.label},r.id))})}function Tx({onClick:t}){const[e,n]=D.useState(!1);return p.jsx("button",{onClick:t,onMouseEnter:()=>n(!0),onMouseLeave:()=>n(!1),style:{position:"fixed",bottom:40,right:40,width:e?"auto":64,height:64,borderRadius:50,border:"none",background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",color:"white",fontSize:e?"1.1rem":"2rem",fontWeight:700,lineHeight:"1",cursor:"pointer",boxShadow:"0 8px 24px rgba(16, 185, 129, 0.4)",padding:e?"0 24px":0,transition:"all 0.3s ease",display:"flex",alignItems:"center",justifyContent:"center",gap:8,whiteSpace:"nowrap"},title:"Create a new meal",children:e?p.jsxs(p.Fragment,{children:[p.jsx("span",{style:{fontSize:"1.5rem"},children:"+"}),p.jsx("span",{children:"Create Meal"})]}):"+"})}function Nx({userId:t,currentProfile:e,onSaved:n,onCancel:r}){const[i,s]=D.useState(e.first_name||""),[o,l]=D.useState(e.last_name||""),[a,u]=D.useState(!1),[h,d]=D.useState([]),[c,_]=D.useState(e.apartment||""),[y,v]=D.useState(null),[M,g]=D.useState(e.can_bring||My()),[f,m]=D.useState(e.allergies||Dy()),[w,P]=D.useState(""),k=[{key:"drinks",label:"Drinks"},{key:"dessert",label:"Dessert"},{key:"salad",label:"Salad"},{key:"main_dish",label:"Main Dish"},{key:"snacks",label:"Snacks"},{key:"sides",label:"Sides"},{key:"utensils",label:"Utensils"}],N=[{key:"gluten_free",label:"Gluten-free"},{key:"dairy_free",label:"Dairy-free"},{key:"vegan",label:"Vegan"},{key:"vegetarian",label:"Vegetarian"},{key:"nut_allergy",label:"Nut Allergy"}];D.useEffect(()=>{In().then(d)},[]);const T=F=>{g(he=>({...he,[F]:!he[F]}))},C=F=>{m(he=>({...he,[F]:!he[F]}))},A=()=>{const F=w.trim();!F||f.custom.includes(F)||(m(he=>({...he,custom:[...he.custom,F]})),P(""))},B=F=>{m(he=>({...he,custom:he.custom.filter(Ct=>Ct!==F)}))},b=async F=>{if(F.preventDefault(),!W){u(!0);try{let he=c||null;y&&(he=await zd(y.name.trim(),y.address.trim()));const Ct={...e,first_name:i.trim(),last_name:o.trim(),apartment:he||"",can_bring:M,allergies:f};await Oy(t,Ct),alert("Profile updated!"),n()}catch(he){console.error("Failed to update profile:",he),alert("Failed to update profile: "+he.message)}finally{u(!1)}}},W=!i.trim()||!o.trim()||(y?!y.name.trim()||!y.address.trim():!c);return p.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"40px 20px",zIndex:1e3,overflowY:"auto",backdropFilter:"blur(4px)"},children:p.jsxs("form",{onSubmit:b,style:{display:"flex",flexDirection:"column",width:"100%",maxWidth:580,gap:20,backgroundColor:"white",padding:40,borderRadius:20,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",fontFamily:"Inter, sans-serif",border:"4px solid transparent",backgroundImage:"linear-gradient(white, white), linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",backgroundOrigin:"border-box",backgroundClip:"padding-box, border-box"},children:[p.jsx("h2",{style:{margin:0,fontWeight:900,background:"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",textAlign:"center",fontSize:"2.2rem",letterSpacing:"-0.5px"},children:"Edit Your Profile"}),p.jsx("input",{placeholder:"First name",value:i,onChange:F=>s(F.target.value),style:pr,autoFocus:!0}),p.jsx("input",{placeholder:"Last name",value:o,onChange:F=>l(F.target.value),style:pr}),p.jsxs("select",{value:y?"new":c,onChange:F=>{F.target.value==="new"?(v({name:"",address:""}),_("")):(v(null),_(F.target.value))},style:pr,children:[p.jsx("option",{value:"",children:"-- Select Existing Apartment --"}),h.map(F=>p.jsxs("option",{value:F.id,children:[F.name," — ",F.address]},F.id)),p.jsx("option",{value:"new",style:{color:"#2563eb",fontWeight:600},children:"+ Create New Apartment"})]}),y&&p.jsxs(p.Fragment,{children:[p.jsx("input",{placeholder:"Apartment name",value:y.name,onChange:F=>v({...y,name:F.target.value}),style:pr}),p.jsx("input",{placeholder:"Apartment address",value:y.address,onChange:F=>v({...y,address:F.target.value}),style:pr})]}),p.jsx(ap,{text:"What can you bring?"}),p.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:k.map(F=>p.jsxs("label",{style:lp,children:[p.jsx("input",{type:"checkbox",checked:M[F.key],onChange:()=>T(F.key)}),F.label]},F.key))}),p.jsx(ap,{text:"Allergies / Dietary Restrictions"}),N.map(F=>p.jsxs("label",{style:lp,children:[p.jsx("input",{type:"checkbox",checked:f[F.key],onChange:()=>C(F.key)}),F.label]},F.key)),p.jsxs("div",{style:{marginTop:10},children:[p.jsx("input",{placeholder:"Add another allergy...",value:w,onChange:F=>P(F.target.value),style:pr}),p.jsx("button",{type:"button",onClick:A,style:Rx,children:"Add Allergy"})]}),f.custom.length>0&&p.jsx("ul",{style:{marginTop:10,paddingLeft:0},children:f.custom.map(F=>p.jsxs("li",{style:bx,children:[F,p.jsx("button",{type:"button",onClick:()=>B(F),style:Px,children:"✕"})]},F))}),p.jsxs("div",{style:{display:"flex",gap:12,marginTop:20},children:[p.jsx("button",{type:"button",onClick:r,style:{flex:1,padding:"16px 0",borderRadius:12,border:"2px solid #d1d5db",backgroundColor:"white",color:"#6b7280",fontWeight:700,fontSize:"1rem",cursor:"pointer"},children:"Cancel"}),p.jsx("button",{type:"submit",disabled:W||a,style:{flex:1,padding:"16px 0",borderRadius:12,border:"none",background:W||a?"#d1d5db":"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",color:"white",fontWeight:800,fontSize:"1.1rem",cursor:W||a?"not-allowed":"pointer",boxShadow:W||a?"none":"0 8px 20px rgba(240, 147, 251, 0.4)",transition:"all 0.2s ease",letterSpacing:"0.5px"},children:a?"Saving…":"Save Profile"})]})]})})}const pr={padding:14,borderRadius:12,border:"2px solid #e5e7eb",fontSize:"1rem",width:"100%",fontWeight:500,transition:"all 0.2s ease"},lp={display:"flex",alignItems:"center",gap:8,padding:"6px 0"},Rx={marginTop:8,padding:"10px 18px",background:"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",border:"none",borderRadius:10,color:"white",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(240, 147, 251, 0.3)",transition:"all 0.2s ease"},Px={background:"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",border:"none",borderRadius:8,color:"white",padding:"4px 10px",cursor:"pointer",fontWeight:600,fontSize:"0.9rem"},bx={display:"flex",justifyContent:"space-between",background:"linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",padding:"10px 14px",borderRadius:10,marginBottom:8,fontSize:"0.95rem",alignItems:"center",fontWeight:600,border:"2px solid #f9a8d4"};function ap({text:t}){return p.jsx("h3",{style:{marginTop:16,marginBottom:12,fontSize:"1.2rem",fontWeight:800,background:"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",letterSpacing:"-0.3px"},children:t})}const{auth:Ax}=fx;function Ox(){const[t,e]=D.useState(null),[n,r]=D.useState(null),[i,s]=D.useState(null),[o,l]=D.useState(!1),[a,u]=D.useState(!1),[h,d]=D.useState("ledger"),[c,_]=D.useState(!1),[y,v]=D.useState(!1),[M,g]=D.useState([]),[f,m]=D.useState([]);async function w(T){const C=await ge(Q(K,`users/${T}`));return C.exists()?C.val():null}D.useEffect(()=>{const T=Ax.onAuthStateChanged(async C=>{if(e(C),!C){r(null),s(null),l(!1),g([]),m([]);return}u(!0);const A=await Ay(C.uid);r(A);const B=await w(A);if(!B||!B.first_name)l(!0),s(null);else{s(B),l(!1);const[b,W]=await Promise.all([zr(),In()]);g(b),m(W)}u(!1)});return()=>T()},[]);async function P(T){if(!n||!t)throw new Error("Missing auth or numeric id");u(!0);let C=T.apartmentId??null;T.newApartment&&(C=await zd(T.newApartment.name,T.newApartment.address));const A={first_name:T.first_name,last_name:T.last_name,apartment:C||"",uid:t.uid,can_bring:T.can_bring,allergies:T.allergies,placeholder:!1};await Oy(n,A);const B=await w(n);s(B),l(!1);const[b,W]=await Promise.all([zr(),In()]);g(b),m(W),u(!1)}function k(){d(T=>T)}async function N(){if(!n)return;u(!0);const T=await w(n);s(T);const[C,A]=await Promise.all([zr(),In()]);g(C),m(A),u(!1),v(!1)}return a?p.jsx("div",{style:{padding:20},children:"Loading..."}):o&&t&&n?p.jsx(wx,{user:t,onComplete:P}):!i||!n?p.jsx("div",{style:{padding:20},children:"Loading profile…"}):p.jsxs("div",{style:{width:"100%",maxWidth:1200,margin:"0 auto"},children:[p.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,gap:20,flexWrap:"wrap"},children:[p.jsxs("h1",{style:{color:"white",margin:0,textShadow:"2px 2px 4px rgba(0,0,0,0.2)"},children:["Welcome back,"," ",i!=null&&i.first_name?`${i.first_name} ${i.last_name}`:(t==null?void 0:t.displayName)??"User","!"]}),p.jsx("button",{onClick:()=>v(!0),style:{padding:"12px 20px",borderRadius:50,border:"none",background:"white",color:"#4f46e5",fontWeight:700,cursor:"pointer",fontSize:"1rem",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"},title:"Edit your profile",children:"✏️ Edit Profile"})]}),p.jsx(xx,{active:h,onChange:T=>d(T)}),h==="ledger"&&p.jsx(Ix,{currentUserId:n}),h==="past"&&p.jsx(sp,{myId:n,users:M,apartments:f,mode:"past",authUser:t}),h==="upcoming"&&p.jsx(sp,{myId:n,users:M,apartments:f,mode:"upcoming",authUser:t}),p.jsx(Tx,{onClick:()=>_(!0)}),c&&p.jsx(Ly,{authUser:t,currentUserId:n,onCreated:()=>{_(!1),k()},onClose:()=>_(!1)}),y&&n&&i&&p.jsx(Nx,{userId:n,currentProfile:i,onSaved:N,onCancel:()=>v(!1)})]})}const Fy=document.getElementById("root");if(!Fy)throw new Error("Root element not found");Aa.createRoot(Fy).render(p.jsx(tv.StrictMode,{children:p.jsx(Ox,{})}));

/*!
 * Cropper 2.1.0
 * (c) 2024 sjaakpriester.nl
 */
document.head.innerHTML+='<style>.cropper-wrap{border:var(--cropper-border-width,2px) solid var(--cropper-border-color,ButtonBorder);border-radius:var(--cropper-border-radius,.4em);padding:var(--cropper-gap,.6em);display:grid;grid-template-columns:1fr 1fr;gap:var(--cropper-gap,.6em);width:fit-content;}.cropper-preview{grid-area:1/span 2;justify-self:center;box-sizing:content-box;display:grid;place-content:center;place-items:center;overflow:hidden;background:url("data:image/gif;base64,R0lGODlhEAAQAKEAAISChPz+/P///wAAACH5BAEAAAIALAAAAAAQABAAAAIfhG+hq4jM3IFLJhoswNly/XkcBpIiVaInlLJr9FZWAQA7");& > *{grid-area:1/1;}}.cropper-drop{width:min-content;padding-inline:.3em;text-align:center;font-weight:bold;background-color:var(--cropper-drop,GrayText);color:var(--cropper-drop-text,Canvas);}.cropper-image{max-width:none;max-height:none;pointer-events:none;}.cropper-overlay{display:grid;place-content:center;place-items:center;box-sizing:content-box;z-index:1;user-select:none;border:40px solid rgba(255,255,255,.75);cursor:grab;}.cropper-dragging .cropper-overlay{cursor:grabbing;}.cropper-msg{grid-area:4/1/5/3;min-height:1lh;font-size:85%;}.cropper-wrap label{cursor:pointer;margin-block:initial;color:var(--cropper-gray,GrayText);width:1em;&:hover{color:var(--cropper-button,ButtonText);}}.cropper-wrap button{padding:0;border:none;outline:none;font:inherit;font-weight:bold;background:transparent;justify-self:end;color:var(--cropper-gray,GrayText);width:1.67em;&:hover{color:var(--cropper-button,ButtonText);}}.cropper-wrap [type=file]{display:none;}.cropper-wrap [type=range]{--c:var(--cropper-range,SelectedItem);--_c:color-mix(in srgb,var(--c),#fff var(--p,0%));--a:var(--_c);--g:var(--cropper-gray,GrayText);--l:5px;--s:1em;--b:var(--cropper-border-width,2px);height:var(--s);-webkit-appearance :none;-moz-appearance :none;appearance :none;background:none;cursor:pointer;overflow:hidden;&:active,&:focus-visible{--b:var(--s);}&:focus-visible,&:hover{--p:25%;}}.cropper-wrap [type="range"]::-webkit-slider-thumb{height:var(--s);aspect-ratio:1;border-radius:50%;box-shadow:0 0 0 var(--b,var(--l)) inset var(--_c);transition:.3s;border-image:linear-gradient(90deg,var(--a) 50%,var(--g) 0) 0 1/calc(50% - var(--l)/2) 100vw/0 100vw;-webkit-appearance:none;appearance:none;}.cropper-wrap [type="range"]::-moz-range-thumb{height:var(--s);background:none;border-radius:50%;box-shadow:0 0 0 var(--b,var(--l)) inset var(--_c);transition:.3s;border-image:linear-gradient(90deg,var(--a) 50%,var(--g) 0) 0 1/calc(50% - var(--l)/2) 100vw/0 100vw;-moz-appearance:none;appearance:none;}.cropper-wrap .cropper-rotation{--a:var(--g);}.cropper-no-rotation .cropper-scale{grid-area:auto/span 2;}.cropper-no-rotation .cropper-rotation{display:none;}</style>';function Cropper(t,e={},i={}){this.settings=Object.assign({},this.defaults,i,t.dataset),this.text=Object.assign({},this.defaultText,e),this._sanitizeSettings();const s=document.createElement("div"),a=document.createElement("div"),r=document.createElement("div"),o=document.createElement("div"),n=document.createElement("img"),h=document.createElement("input"),l=document.createElement("input"),p=document.createElement("div"),c=document.createElement("input"),d=document.createElement("label"),g=document.createElement("button");s.classList.add("cropper-wrap"),a.classList.add("cropper-preview"),r.classList.add("cropper-drop"),r.innerText=this.text.drop,p.classList.add("cropper-msg"),o.classList.add("cropper-overlay"),n.classList.add("cropper-image"),h.classList.add("cropper-scale"),h.type="range",h.setAttribute("min","0"),h.setAttribute("step","any"),h.setAttribute("title",this.text.zoom),l.type="range",l.setAttribute("step","any"),l.setAttribute("title",this.text.angle),l.value="0",l.classList.add("cropper-rotation"),c.type="hidden",c.name=/(.*)\[(.*)]/gm.exec(t.name)?`${/(.*)\[(.*)]/gm.exec(t.name)[1]}[${/(.*)\[(.*)]/gm.exec(t.name)[2]}_data]`:(t.name||"cropper")+"_data",d.innerHTML="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512' fill='currentColor'><path d='M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM215.3 292c-4.68 0-9.051 2.34-11.65 6.234L164 357.8l-11.68-17.53C149.7 336.3 145.3 334 140.7 334c-4.682 0-9.053 2.34-11.65 6.234l-46.67 70c-2.865 4.297-3.131 9.82-.6953 14.37C84.09 429.2 88.84 432 93.1 432h196c5.163 0 9.907-2.844 12.34-7.395c2.436-4.551 2.17-10.07-.6953-14.37l-74.67-112C224.4 294.3 220 292 215.3 292zM128 288c17.67 0 32-14.33 32-32S145.7 224 128 224S96 238.3 96 256S110.3 288 128 288z' /svg>",d.setAttribute("title",this.text.choose),g.type="button",g.innerHTML="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='currentColor'><path d='M630.8 469.1l-55.95-43.85C575.3 422.2 575.1 419.2 575.1 416l.0034-320c0-35.35-28.65-64-64-64H127.1C113.6 32 100.4 36.98 89.78 45.06L38.81 5.113C28.34-3.058 13.31-1.246 5.109 9.192C-3.063 19.63-1.235 34.72 9.187 42.89L601.2 506.9C605.6 510.3 610.8 512 615.1 512c7.125 0 14.17-3.156 18.91-9.188C643.1 492.4 641.2 477.3 630.8 469.1zM527.1 388.5l-36.11-28.3l-100.7-136.8C387.8 218.8 382.1 216 376 216c-6.113 0-11.82 2.768-15.21 7.379L344.9 245L261.9 180C262.1 176.1 264 172.2 264 168c0-26.51-21.49-48-48-48c-8.336 0-16.05 2.316-22.88 6.057L134.4 80h377.6c8.822 0 16 7.178 16 16V388.5zM254.2 368.3l-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809c-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.0293 0 .0293 0 0L111.1 184.5l-48-37.62L63.99 416c0 35.35 28.65 64 64 64h361.1l-201.1-157.6L254.2 368.3z' /svg>",g.setAttribute("title",this.text.empty),t.parentNode.insertBefore(s,t),d.append(t),a.append(r,n,o),s.append(a,h,l,d,g,p,c),t.cropper=this,this.element=t,this.preview=a,this.overlay=o,this.image=n,this.zoomCtrl=h,this.rotCtrl=l,this.msg=p,this.jsonData=c,this.wrap=s,this.aspect=1,this.imageAsp=1,this.scale=1,this.translate={x:0,y:0},this.range={x:0,y:0},this.imageSize={width:0,height:0},this.envelopeSize={width:0,height:0},this.zoom=1,this.rotation=0,this.rotSin=0,this.absSin=0,this.rotCos=1,this.rotScale=1,this.dragging=-1,this.loaded=!1,t.addEventListener("change",(t=>{this._loadFile()})),a.addEventListener("dragenter",(t=>{t.preventDefault()})),a.addEventListener("dragover",(t=>{t.preventDefault()})),a.addEventListener("drop",(t=>{t.preventDefault(),this.element.files=t.dataTransfer.files,this._loadFile()})),o.addEventListener("pointerdown",(t=>{this.loaded&&0===t.button&&(this.wrap.classList.add("cropper-dragging"),this.dragging=t.pointerId)})),document.addEventListener("pointerup",(t=>{t.pointerId===this.dragging&&(this.move(t.movementX,t.movementY),this.wrap.classList.remove("cropper-dragging"),this.dragging=-1,this._update())})),document.addEventListener("pointermove",(t=>{t.pointerId===this.dragging&&(this.move(t.movementX,t.movementY),this._update())})),o.addEventListener("dblclick",(t=>{this.loaded&&(this._resetTranslate(),this._update())})),h.addEventListener("input",(t=>{this.setZoom(Math.exp(t.target.valueAsNumber)),this._update()})),h.addEventListener("dblclick",(t=>{t.target.value=0,this.setZoom(1),this._update()})),l.addEventListener("input",(t=>{this.setRotation(-t.target.valueAsNumber),this._update()})),l.addEventListener("dblclick",(t=>{this._resetRotation(),this._update()})),g.addEventListener("click",(t=>{this.loadImage(!1)})),this.setMaxRotation(this.settings.maxRotation),this.setMaxZoom(this.settings.maxZoom),this.setAspect(this.settings.aspect),this._setCrop()}Cropper.prototype={version:"v2.1.0 2024-06-12",defaults:{aspect:1,margin:40,diagonal:300,maxZoom:4,maxRotation:30},defaultText:{choose:"Choose an image...",empty:"Empty cropper",drop:"Drop file here",zoom:"Zoom",angle:"Angle"},loadImage(t){if(this.wrap.classList.remove("cropper-loaded"),!t){this.image.removeAttribute("src");const t=new DataTransfer;return this.element.files=t.files,this.loaded=!1,this._resetAll(),this.msg.innerText="",this.imageAsp=1,void this._update()}fetch(t).then((t=>t.blob())).then((e=>{const i=e.type,s=t.replace(/^.*[\\\/]/,""),a=new File([e],s,{type:i}),r=new DataTransfer;r.items.add(a),this.element.files=r.files,this._loadFile()}))},_loadFile(){const t=this.element.files[0];if(t.type.match(/image.*/)){const e=new FileReader;e.addEventListener("load",(e=>{this.loaded=!1,this.wrap.classList.remove("cropper-loaded");const i=new Image;i.addEventListener("load",(t=>{this.loaded=!0,this.wrap.classList.add("cropper-loaded"),this.image.setAttribute("src",t.target.src),this.imageAsp=this.image.naturalWidth/this.image.naturalHeight,this._resetAll(),this._calcImgSize(),this._update()})),i.src=e.target.result,this.msg.innerText=t.name})),e.readAsDataURL(t)}},_sanitizeSettings(){const t=this.settings.aspect;isNaN(t)||(this.settings.aspect=this._clamp(t,.2,5)),this.settings.diagonal=this._clamp(this.settings.diagonal,80,2e3),this.settings.margin=this._clamp(this.settings.margin,8,200),this.settings.maxZoom=this._clamp(this.settings.maxZoom,2,10)},_setCrop(){let t=this.aspect,e=Math.sqrt(1+t*t),i=this.settings.diagonal/e,s=i*t,a=2*this.settings.margin,r=this.overlay.style,o=this.preview.style;r.width=`${s}px`,r.aspectRatio=t,r.borderWidth=`${this.settings.margin}px`,o.width=`${s+a}px`,o.height=`${i+a}px`},_calcImgSize(){const t=this.zoom*this.scale*this.rotScale,e=t*this.image.naturalWidth,i=t*this.image.naturalHeight;this.imageSize={width:e,height:i},this.envelopeSize={width:e*this.rotCos+i*this.absSin,height:e*this.absSin+i*this.rotCos}},_calcScale(){this.scale=this.loaded?Math.max(this.overlay.clientWidth/this.image.naturalWidth,this.overlay.clientHeight/this.image.naturalHeight):1},_resetTranslate(){this.translate={x:0,y:0}},_resetZoom(){this.zoomCtrl.value="0",this.setZoom(1)},setZoom(t){this.zoom=t,this._calcImgSize()},_resetRotation(){this.rotCtrl.value="0",this.setRotation(0)},setRotation(t){const e=Math.sin(t),i=Math.cos(t),s=Math.abs(e),a=this.aspect,r=this.imageAsp;let o=i+s/a,n=i+s*a;a>r?n*=r/a:o*=a/r,this.rotation=t,this.rotSin=e,this.absSin=s,this.rotCos=i,this.rotScale=Math.max(o,n),this._calcImgSize()},setAspect(t){isNaN(t)&&(t={tower:.429,high:.563,phi_portrait:.618,din_portrait:.707,portrait:.75,landscape:1.333,din_landscape:1.414,phi_landscape:1.618,wide:1.718,cinema:2.333}[t]??1),this.aspect=+t,this._resetAll(),this._update()},setMargin(t){console.log("setMargin",t),this.settings.margin=t,this._sanitizeSettings(),console.log(this.settings),this.overlay.style.borderWidth=`${this.settings.margin}px`,this._setCrop()},setDiagonal(t){this.settings.diagonal=t,this._sanitizeSettings(),this._resetAll(),this._update()},setMaxRotation(t){const e=this._clamp(t,0,90)*Math.PI/180;this.rotCtrl.setAttribute("min",(-e).toString()),this.rotCtrl.setAttribute("max",e.toString()),e?this.wrap.classList.remove("cropper-no-rotation"):this.wrap.classList.add("cropper-no-rotation"),this._resetRotation(),this._update()},setMaxZoom(t){const e=Math.log(t);this.zoomCtrl.value=Math.min(e,this.zoomCtrl.valueAsNumber).toString(),this.zoomCtrl.setAttribute("max",e.toString())},_update(){const t=this.overlay.clientWidth/2,e=this.overlay.clientHeight/2,i=this.imageSize.width/2,s=this.imageSize.height/2;let a=this._rotatePoint(this.translate);[0,1,2,3].forEach((r=>{const o=!(1&r),n=!(2&r),h=o?-t:t,l=n?-e:e;let p=o?-i:i,c=n?-s:s;p+=a.x,c+=a.y;const d={x:h,y:l},g=this._rotatePoint(d),m={x:o?Math.max(p,g.x):Math.min(p,g.x),y:n?Math.max(c,g.y):Math.min(c,g.y)},v=this._counterRotatePoint(m);a.x-=v.x-d.x,a.y-=v.y-d.y})),this.translate=this._counterRotatePoint(a),this.image.style.scale=(this.zoom*this.scale*this.rotScale).toString(),this.image.style.translate=`${this.translate.x}px ${this.translate.y}px`,this.image.style.rotate=`${this.rotation}rad`;const r=this.getDimensions();this.jsonData.value=JSON.stringify(r),this.element.dispatchEvent(new CustomEvent("cropperchange",{detail:r}))},_resetAll(){this._resetRotation(),this._resetZoom(),this._resetTranslate(),this._setCrop(),this._calcScale()},move(t,e){this.translate.x+=t,this.translate.y+=e},getDimensions(){const t=this.zoom*this.scale*this.rotScale,e=this.overlay.clientWidth,i=this.overlay.clientHeight;return{aspect:this.aspect,angle:-this.rotation,degrees:180*-this.rotation/Math.PI,x:this.loaded?((this.envelopeSize.width-e)/2-this.translate.x)/t:0,y:this.loaded?((this.envelopeSize.height-i)/2-this.translate.y)/t:0,w:this.loaded?e/t:0,h:this.loaded?i/t:0}},_clamp:(t,e,i)=>Math.min(Math.max(e,t),i),_rotatePoint(t){return{x:t.x*this.rotCos+t.y*this.rotSin,y:-t.x*this.rotSin+t.y*this.rotCos}},_counterRotatePoint(t){return{x:t.x*this.rotCos-t.y*this.rotSin,y:t.x*this.rotSin+t.y*this.rotCos}}},window.cropper=(t={},e={},i="[type=file]")=>[...document.querySelectorAll(i)].map((i=>new Cropper(i,t,e)));
//# sourceMappingURL=cropper.js.map

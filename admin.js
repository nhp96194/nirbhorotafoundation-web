import { app, db } from "./firebase.js";
import { esc } from "./site.js";
import { DEF } from "./defaults.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const auth=getAuth(app), $=s=>document.querySelector(s), page=document.body.dataset.p;
const toast=(m,bad)=>{const e=$("#toast");e.innerHTML='<div class="alert alert-'+(bad?"danger":"success")+' shadow" role="alert">'+esc(m)+'</div>';setTimeout(()=>e.innerHTML="",4000)};
const isAdmin=async u=>(await getDoc(doc(db,"admins",u.uid))).exists();

if(page==="login"){
  onAuthStateChanged(auth,u=>{if(u) location="index.html"});
  $("#lf").onsubmit=async e=>{e.preventDefault();const f=e.target;
    try{const c=await signInWithEmailAndPassword(auth,f.email.value,f.password.value);
      if(!(await isAdmin(c.user))){await signOut(auth);throw Error("This account is not authorised as admin.")}location="index.html"}
    catch(x){toast(x.message.includes("auth/")?"Wrong email or password.":x.message,1)}};
  $("#fp").onclick=async()=>{const m=$("#lf").email.value;if(!m)return toast("Enter your email first.",1);
    try{await sendPasswordResetEmail(auth,m);toast("Reset link sent if the account exists.")}catch(x){toast("Could not send reset email.",1)}};
}else onAuthStateChanged(auth,async u=>{
  if(!u){location="login.html";return}
  if(!(await isAdmin(u))){await signOut(auth);location="login.html";return}
  start();
});

const P=[["title","Title *"],["titleBn","Title (বাংলা)"],["summary","Short summary","ta"],["summaryBn","Summary (বাংলা)","ta"],["body","Full details","ta8"],["bodyBn","Details (বাংলা)","ta8"],["category","Category"]];
const CFG={
  projects:[...P,["location","Location"],["status","Status","sel:Ongoing,Completed,Upcoming"],["image","Cover image","img"]],
  stories:[...P,["author","Author"],["image","Cover image","img"]],
  gallery:[["caption","Caption *"],["captionBn","Caption (বাংলা)"],["category","Category"],["image","Photo *","img"]],
  settings:[["name","Foundation name"],["nameBn","Foundation name (বাংলা)"],["phone","Phone"],["email","Email"],["address","Address"],["facebook","Facebook URL"],["heroTitle","Hero title"],["heroTitleBn","Hero title (বাংলা)"],["heroSubtitle","Hero subtitle","ta"],["heroSubtitleBn","Hero subtitle (বাংলা)","ta"],["heroImage","Hero image","img"],["mission","Mission","ta"],["missionBn","Mission (বাংলা)","ta"],["donation","Donation instructions (bank / bKash / Nagad - only verified details)","ta8"],["donationBn","Donation instructions (বাংলা)","ta8"],["bkash","bKash number"],["nagad","Nagad number"],["bankName","Bank name"],["bankAccount","Bank account number"],["bankHolder","Account name"],["statFamilies","Families helped (only if verified)"],["statProjects","Completed projects (only if verified)"],["statVolunteers","Active volunteers (only if verified)"],["statDistricts","Districts covered (only if verified)"]]
};
const LBL={overview:"Overview",projects:"Projects",stories:"Stories",gallery:"Gallery",volunteers:"Volunteers",contactMessages:"Messages",settings:"Settings"};
const fields=(cfg,d={})=>cfg.map(([k,l,x=""])=>'<div class="mb-3"><label class="form-label fw-semibold">'+l+'</label>'+
  (x==="img"?'<input class="form-control mb-1" type="url" name="'+k+'" value="'+esc(d[k])+'" placeholder="Image URL (optional)"><input class="form-control" type="file" name="'+k+'_file" accept="image/jpeg,image/png,image/webp">'
  :x.startsWith("sel:")?'<select class="form-select" name="'+k+'">'+x.slice(4).split(",").map(o=>'<option '+(o===d[k]?"selected":"")+'>'+o+'</option>').join("")+'</select>'
  :x.startsWith("ta")?'<textarea class="form-control" name="'+k+'" rows="'+(x==="ta8"?8:3)+'">'+esc(d[k])+'</textarea>'
  :'<input class="form-control" name="'+k+'" value="'+esc(d[k])+'">')+'</div>').join("");
async function collect(cfg,form,folder){
  const d={},st=getStorage(app);
  for(const [k,,x] of cfg){
    d[k]=form.elements[k].value.trim();
    if(x==="img"){const f=form.elements[k+"_file"].files[0]; if(f){
      if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size>4e6) throw Error("Image must be JPG, PNG or WebP under 4 MB.");
      try{const r=ref(st,"uploads/"+folder+"/"+Date.now()+"-"+f.name.replace(/[^\w.-]/g,"_"));await uploadBytes(r,f);d[k]=await getDownloadURL(r)}
      catch(e){throw Error("Upload failed (Firebase Storage may need the Blaze plan). Paste an image URL instead.")}}}
  }
  return d;
}
const rows=async c=>(await getDocs(collection(db,c))).docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>((b.createdAt||{}).seconds||0)-((a.createdAt||{}).seconds||0));
let view;
function start(){
  view=$("#view");
  $("#nav").innerHTML=Object.keys(LBL).map(k=>'<button data-t="'+k+'">'+LBL[k]+'</button>').join("")+'<button id="out">Log out</button>';
  $("#nav").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.id==="out")return signOut(auth);go(b.dataset.t)};
  go("overview");
}
function go(t){
  document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("on",b.dataset.t===t));
  view.innerHTML='<p>Loading…</p>'; view.onclick=view.onchange=null;
  ({overview,projects:()=>entity("projects"),stories:()=>entity("stories"),gallery:()=>entity("gallery"),volunteers:()=>inbox("volunteers"),contactMessages:()=>inbox("contactMessages"),settings})[t]().catch(e=>{view.innerHTML='<div class="alert alert-danger">'+esc(e.message)+'</div>'});
}
async function overview(){
  const c={};for(const k of ["projects","stories","volunteers","contactMessages"]) c[k]=await rows(k);
  const n=(a,w)=>'<div class="col-6 col-lg-3"><div class="card p-3"><small class="text-muted">'+w+'</small><h3 class="mb-0">'+a+'</h3></div></div>';
  const pub=a=>a.filter(x=>x.published).length;
  view.innerHTML='<h4 class="mb-3">Overview</h4><div class="row g-3">'+n(c.projects.length+" ("+pub(c.projects)+" published)","Projects")+n(c.stories.length+" ("+pub(c.stories)+" published)","Stories")+n(c.volunteers.length,"Volunteer applications")+n(c.contactMessages.length,"Messages")+'</div>';
}
async function entity(col){
  const cfg=CFG[col], r=await rows(col), m=Object.fromEntries(r.map(x=>[x.id,x]));
  view.innerHTML='<div class="d-flex justify-content-between mb-3"><h4>'+LBL[col]+'</h4><button class="btn btn-success" id="new">+ New</button></div><div id="frm"></div>'+
   (r.map(x=>'<div class="d-flex justify-content-between align-items-center border-bottom py-2 gap-2"><div><strong>'+esc(x.title||x.caption)+'</strong> <span class="badge '+(x.published?"bg-success":"bg-secondary")+'">'+(x.published?"Published":"Draft")+'</span></div><div class="btn-group btn-group-sm"><button class="btn btn-outline-secondary" data-pub="'+x.id+'">'+(x.published?"Unpublish":"Publish")+'</button><button class="btn btn-outline-secondary" data-edit="'+x.id+'">Edit</button><button class="btn btn-outline-danger" data-del="'+x.id+'">Delete</button></div></div>').join("")||'<p class="text-muted">Nothing yet. Click “New”.</p>');
  const form=(x={})=>{$("#frm").innerHTML='<form class="card p-3 mb-4" id="ef">'+fields(cfg,x)+'<button class="btn btn-success">Save</button></form>';
    $("#ef").onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;
      try{const d=await collect(cfg,e.target,col);if(!(d.title||d.caption))throw Error("Title / caption is required.");if(col==="gallery"&&!d.image)throw Error("Please add a photo.");d.updatedAt=serverTimestamp();
        if(x.id)await updateDoc(doc(db,col,x.id),d);else await addDoc(collection(db,col),{...d,published:false,createdAt:serverTimestamp(),createdBy:auth.currentUser.uid});
        toast("Saved.");entity(col)}catch(err){toast(err.message,1);b.disabled=false}}};
  $("#new").onclick=()=>form();
  view.onclick=async e=>{const b=e.target.closest("button[data-pub],button[data-edit],button[data-del]");if(!b)return;const d=b.dataset;
    if(d.edit)form(m[d.edit]);
    else if(d.pub){await updateDoc(doc(db,col,d.pub),{published:!m[d.pub].published,updatedAt:serverTimestamp()});entity(col)}
    else if(confirm("Delete permanently?")){await deleteDoc(doc(db,col,d.del));entity(col)}};
}
async function inbox(col){
  const r=await rows(col), skip=["id","name","email","phone","createdAt","status"], S=["new","reviewed","contacted","accepted","rejected","archived"];
  view.innerHTML='<h4 class="mb-3">'+LBL[col]+'</h4>'+(r.map(x=>'<div class="card p-3 mb-3"><div class="d-flex justify-content-between"><strong>'+esc(x.name)+'</strong><small>'+(x.createdAt?new Date(x.createdAt.seconds*1000).toLocaleString():"")+'</small></div><div class="small text-muted mb-2">'+esc(x.email)+' '+esc(x.phone||"")+'</div>'
   +Object.entries(x).filter(([k])=>!skip.includes(k)).map(([k,v])=>'<div><b>'+esc(k)+':</b> '+esc(v)+'</div>').join("")
   +'<div class="mt-2 d-flex gap-2">'+(col==="volunteers"?'<select data-id="'+x.id+'" class="form-select form-select-sm w-auto">'+S.map(o=>'<option '+(o===x.status?"selected":"")+'>'+o+'</option>').join("")+'</select>':"")+'<button class="btn btn-sm btn-outline-danger" data-del="'+x.id+'">Delete</button></div></div>').join("")||'<p class="text-muted">Nothing yet.</p>');
  view.onchange=async e=>{if(e.target.dataset.id){await updateDoc(doc(db,col,e.target.dataset.id),{status:e.target.value});toast("Status updated.")}};
  view.onclick=async e=>{const b=e.target.closest("button[data-del]");if(b&&confirm("Delete permanently?")){await deleteDoc(doc(db,col,b.dataset.del));inbox(col)}};
}
async function settings(){
  const s=await getDoc(doc(db,"settings","site"));
  view.innerHTML='<h4 class="mb-3">Website settings</h4><form class="card p-3" id="sf">'+fields(CFG.settings,{...DEF,...(s.exists()?s.data():{})})+'<button class="btn btn-success">Save settings</button></form>';
  $("#sf").onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;
    try{const d=await collect(CFG.settings,e.target,"settings");d.updatedAt=serverTimestamp();await setDoc(doc(db,"settings","site"),d,{merge:true});toast("Settings saved.")}catch(x){toast(x.message,1)}b.disabled=false};
}

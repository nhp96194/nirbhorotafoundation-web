import { db } from "./firebase.js";
import { DEF } from "./defaults.js";
import { collection, getDocs, getDoc, doc, addDoc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const T = {
en:{nav_home:"Home",nav_projects:"Projects",nav_stories:"Stories",nav_donate:"Support",nav_volunteer:"Volunteer",nav_contact:"Contact",
hero_t:"Standing beside people, one community at a time.",hero_s:"Nirbhorota Foundation works to support people, strengthen communities and create lasting social impact.",
cta1:"Explore Our Work",cta2:"Get Involved",mission_h:"Our mission",mission_d:"To empower vulnerable communities to achieve dignity and independence.",
feat:"Featured projects",news:"Latest stories",all:"All statuses",don_h:"Support our work",don_none:"Donation details will be published here soon.",
vol_h:"Volunteer with us",vol_d:"Share your time and skills with the community.",f_name:"Full name",f_email:"Email",f_phone:"Phone",f_loc:"Location",
f_int:"Areas of interest",f_skill:"Skills",f_avail:"Availability",f_intro:"Short introduction",f_subj:"Subject",f_msg:"Message",
f_cons:"I agree that the foundation may contact me and store this information.",send:"Send",sent:"Thank you. We received your message.",
fail:"Could not send. Please try again.",wait:"Please wait a minute before sending again.",err:"Could not load content.",none:"Nothing to show yet.",
back:"← Back",search:"Search…",rights:"All rights reserved.",get_h:"Get in touch",nav_gallery:"Gallery",gal_h:"Moments from our work",all_c:"All categories",copy:"Copy",copied:"Copied",pay_note:"Send your donation directly to any account below. Payments are confirmed manually by the foundation.",st_f:"Families helped",st_p:"Projects",st_v:"Volunteers",st_d:"Districts",bkash:"bKash",nagad:"Nagad",bank:"Bank account"},
bn:{nav_home:"হোম",nav_projects:"প্রকল্প",nav_stories:"গল্প ও সংবাদ",nav_donate:"সহযোগিতা",nav_volunteer:"স্বেচ্ছাসেবা",nav_contact:"যোগাযোগ",
hero_t:"একটি একটি সম্প্রদায়ের পাশে, মানুষের সঙ্গে।",hero_s:"নির্ভরতা ফাউন্ডেশন মানুষের পাশে দাঁড়াতে, সমাজকে শক্তিশালী করতে এবং স্থায়ী পরিবর্তন আনতে কাজ করে।",
cta1:"আমাদের কাজ দেখুন",cta2:"যুক্ত হোন",mission_h:"আমাদের লক্ষ্য",mission_d:"অসহায় জনগোষ্ঠীকে মর্যাদা ও স্বনির্ভরতা অর্জনে সক্ষম করে তোলা।",
feat:"নির্বাচিত প্রকল্প",news:"সাম্প্রতিক গল্প ও সংবাদ",all:"সব অবস্থা",don_h:"আমাদের কাজে সহযোগিতা করুন",don_none:"দানের তথ্য শীঘ্রই এখানে প্রকাশিত হবে।",
vol_h:"আমাদের সঙ্গে স্বেচ্ছাসেবী হোন",vol_d:"আপনার সময় ও দক্ষতা দিয়ে সমাজের পাশে দাঁড়ান।",f_name:"পূর্ণ নাম",f_email:"ইমেইল",f_phone:"ফোন",f_loc:"এলাকা",
f_int:"আগ্রহের ক্ষেত্র",f_skill:"দক্ষতা",f_avail:"সময়",f_intro:"সংক্ষিপ্ত পরিচয়",f_subj:"বিষয়",f_msg:"বার্তা",
f_cons:"আমি সম্মত যে ফাউন্ডেশন আমার সঙ্গে যোগাযোগ করতে ও এই তথ্য সংরক্ষণ করতে পারে।",send:"পাঠান",sent:"ধন্যবাদ। আমরা আপনার বার্তা পেয়েছি।",
fail:"পাঠানো যায়নি। আবার চেষ্টা করুন।",wait:"আবার পাঠানোর আগে এক মিনিট অপেক্ষা করুন।",err:"তথ্য লোড করা যায়নি।",none:"এখনো কিছু নেই।",
back:"← ফিরে যান",search:"খুঁজুন…",rights:"সর্বস্বত্ব সংরক্ষিত।",get_h:"যোগাযোগ করুন",nav_gallery:"গ্যালারি",gal_h:"আমাদের কাজের কিছু মুহূর্ত",all_c:"সব বিভাগ",copy:"কপি",copied:"কপি হয়েছে",pay_note:"নিচের যেকোনো মাধ্যমে সরাসরি অনুদান পাঠাতে পারেন। ফাউন্ডেশন নিজে অনুদান যাচাই করে নিশ্চিত করে।",st_f:"উপকৃত পরিবার",st_p:"প্রকল্প",st_v:"স্বেচ্ছাসেবক",st_d:"জেলা",bkash:"বিকাশ",nagad:"নগদ",bank:"ব্যাংক অ্যাকাউন্ট"}};
let lang="en"; try{lang=localStorage.getItem("lang")||"en"}catch(e){}
export const t=k=>T[lang][k]||T.en[k]||k;
export const esc=s=>String(s??"").replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";");
export const L=(o,k)=>(lang==="bn"&&o[k+"Bn"])||o[k]||"";
const $=i=>document.getElementById(i), when=p=>(p.createdAt&&p.createdAt.seconds)||0;

export async function init(){
  let s={}; try{const d=await getDoc(doc(db,"settings","site")); if(d.exists()) s=Object.fromEntries(Object.entries(d.data()).filter(([,v])=>v!==""&&v!=null))}catch(e){}
  s={...DEF,...s};
  const nm=esc(L(s,"name")||"Nirbhorota Foundation"), cur=location.pathname.split("/").pop()||"index.html";
  document.documentElement.lang=lang;
  const nav=[["index.html","nav_home"],["projects.html","nav_projects"],["stories.html","nav_stories"],["gallery.html","nav_gallery"],["index.html#donate","nav_donate"],["volunteer.html","nav_volunteer"],["contact.html","nav_contact"]];
  $("hdr").innerHTML='<nav class="navbar navbar-expand-lg site-nav"><div class="container"><a class="navbar-brand" href="index.html"><img src="assets/images/logo.svg" width="34" height="34" alt=""><span>'+nm+'</span></a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nv" aria-label="Menu"><i class="bi bi-list fs-3"></i></button><div class="collapse navbar-collapse" id="nv"><ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">'
   +nav.map(([h,k])=>'<li><a class="nav-link '+(cur===h?"active":"")+'" href="'+h+'" data-i="'+k+'"></a></li>').join("")
   +'<li><button id="lg" class="btn btn-sm btn-outline-dark">'+(lang==="bn"?"EN":"বাং")+'</button></li></ul></div></div></nav>';
  const fb=u=>/^https?:\/\//.test(u||"")?'<div><a href="'+esc(u)+'" rel="noopener">Facebook</a></div>':"";
  $("ftr").innerHTML='<div class="container py-5"><div class="row g-4"><div class="col-md-6"><strong>'+nm+'</strong><p class="small mb-0">'+esc(L(s,"mission")||t("mission_d"))+'</p></div><div class="col-md-6 small">'
   +(s.phone?'<div><i class="bi bi-telephone"></i> '+esc(s.phone)+'</div>':"")+(s.email?'<div><i class="bi bi-envelope"></i> '+esc(s.email)+'</div>':"")
   +(s.address?'<div><i class="bi bi-geo-alt"></i> '+esc(s.address)+'</div>':"")+fb(s.facebook)+'</div></div><hr><small>© '+new Date().getFullYear()+' '+nm+'. '+t("rights")+'</small></div>';
  document.querySelectorAll("[data-i]").forEach(e=>e.textContent=t(e.dataset.i));
  document.querySelectorAll("[data-ip]").forEach(e=>e.placeholder=t(e.dataset.ip));
  $("lg").onclick=()=>{try{localStorage.setItem("lang",lang==="bn"?"en":"bn")}catch(e){}location.reload()};
  const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("in")));
  document.querySelectorAll(".reveal").forEach(e=>io.observe(e));
  return s;
}
export async function fetchPub(col){   // public may read only published docs (see firestore.rules)
  const s=await getDocs(query(collection(db,col),where("published","==",true)));
  return s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>when(b)-when(a));
}
export const card=(p,col)=>'<a class="entry" href="'+col+'.html?id='+encodeURIComponent(p.id)+'">'+(p.image?'<img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(L(p,"title"))+'">':'<div class="ph"></div>')
  +'<div class="eb"><small>'+esc(p.category||"")+(p.status?" · "+esc(p.status):"")+'</small><h3>'+esc(L(p,"title"))+'</h3><p>'+esc(L(p,"summary"))+'</p></div></a>';

export async function listPage(col){
  const box=$("box"), id=new URLSearchParams(location.search).get("id");
  let items; try{items=await fetchPub(col)}catch(e){box.innerHTML='<p class="empty">'+t("err")+'</p>';return}
  if(id){
    document.querySelectorAll(".filters").forEach(e=>e.hidden=true);
    const p=items.find(x=>x.id===id);
    if(!p){box.innerHTML='<p class="empty">'+t("none")+'</p>';return}
    document.title=L(p,"title")+" | Nirbhorota Foundation";
    box.innerHTML='<a href="'+col+'.html">'+t("back")+'</a><h1 class="my-3">'+esc(L(p,"title"))+'</h1><p class="text-muted">'+[p.category,p.status,p.location,p.author].filter(Boolean).map(esc).join(" · ")+'</p>'
      +(p.image?'<img class="cover mb-4" src="'+esc(p.image)+'" alt="">':"")+'<div class="prose">'+esc(L(p,"body")||L(p,"summary"))+'</div>';
    return;
  }
  const q=$("q"), st=$("st");
  const draw=()=>{const v=q.value.toLowerCase(), s=st?st.value:"";
    const r=items.filter(p=>(!s||p.status===s)&&(L(p,"title")+L(p,"summary")+(p.category||"")).toLowerCase().includes(v));
    box.innerHTML=r.length?'<div class="grid">'+r.map(p=>card(p,col)).join("")+'</div>':'<p class="empty">'+t("none")+'</p>'};
  q.oninput=draw; if(st) st.onchange=draw; draw();
}
export function bindForm(id,col){
  const f=$(id), msg=$("msg"), say=(m,ok)=>{msg.className="alert mt-3 alert-"+(ok?"success":"danger");msg.textContent=m};
  f.onsubmit=async e=>{
    e.preventDefault(); if(f.website.value) return;          // honeypot field for bots
    let last=0; try{last=+localStorage.getItem("sub_"+col)||0}catch(x){}
    if(Date.now()-last<60000) return say(t("wait"));
    if(!f.checkValidity()){f.classList.add("was-validated");return}
    const d={}; new FormData(f).forEach((v,k)=>{if(k!=="website"&&k!=="consent") d[k]=String(v).trim()});
    const b=f.querySelector("button"); b.disabled=true;
    try{await addDoc(collection(db,col),{...d,status:"new",createdAt:serverTimestamp()});
      try{localStorage.setItem("sub_"+col,Date.now())}catch(x){} f.reset(); f.classList.remove("was-validated"); say(t("sent"),1)}
    catch(x){say(t("fail"))}
    b.disabled=false;
  };
}

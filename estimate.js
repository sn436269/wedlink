'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = v => 'NT$ ' + Math.round(v).toLocaleString('zh-TW');
const storage = {get(k,d){try{return JSON.parse(localStorage.getItem('wedlink-'+k))??d;}catch{return d;}},set(k,v){try{localStorage.setItem('wedlink-'+k,JSON.stringify(v));}catch{}}};
const prices = {
  hotels: [
    ['mandarin','台北文華東方酒店',38800,'歐式宮廷風格；每桌 10 位，另加 10% 服務費。'],
    ['marriott','台北萬豪酒店',32800,'挑高無柱宴會廳；每桌 10 位，另加 10% 服務費。'],
    ['regent','台北晶華酒店',28800,'五星飯店婚宴；每桌 10 位，另加 10% 服務費。'],
    ['hyatt','台北君悅酒店',29800,'信義區、多元廳房；每桌 10 位，另加 10% 服務費。'],
    ['hilai','台北漢來大飯店',28800,'南港婚宴空間；每桌 10 位，另加 10% 服務費。']
  ],
  makeup: [
    ['kylie','Kylie 造型師',7000,'單新娘造型／工作室精緻化妝。'],
    ['iling','iling 彩妝造型團隊',16800,'純宴客 2 套新娘造型。'],
    ['weiwei','巫葳葳 WeiWei',24800,'1 儀式＋宴客，2 套造型／半日。'],
    ['senior','資深新秘・高階款',28800,'全日跟妝，3–4 套造型。'],
    ['premium','名師／星級新秘方案',35000,'訂結同日＋午／晚宴全程跟妝。']
  ],
  nails: [
    ['solid','經典單色凝膠',990,'純色凝膠，簡約俐落。'],
    ['cat','貓眼／鏡面凝膠',1190,'光澤折射感款式。'],
    ['french','漸層／法式凝膠',1590,'漸層或法式柔和設計。'],
    ['paint','精緻手繪／暈染',1600,'水彩暈染、手繪花卉等中階造型。'],
    ['jewel','婚宴鑽飾設計',2000,'大貝殼、立體鑽飾或金箔設計。']
  ],
  hair: [
    ['pluus','PLUUS（中山店）',2900,'染髮套餐，含洗剪與頭皮隔離，短髮起算。'],
    ['circle','in circle salon',3200,'溫塑燙／冷燙套餐，含洗剪。'],
    ['ardor','ARDOR Hair Salon',4500,'燙染護指定套餐。'],
    ['palace','M-Palace',3800,'燙／染美髮方案。'],
    ['zoom','ZOOM Styling',6000,'燙染整體造型服務。']
  ],
  photography: [
    ['half','平面攝影・單機半天',18000,'1 位主攝影師，純儀式或純宴客，4 小時。'],
    ['full','平面攝影・單機全天',26000,'1 位主攝影師，儀式＋宴客，8 小時。'],
    ['dual','平面攝影・雙機全天',38000,'1 主攝＋1 副攝，儀式＋宴客，8 小時。']
  ],
  video: [
    ['half','動態錄影・單機半天',20000,'1 位錄影師，純儀式或純宴客，4 小時。'],
    ['full','動態錄影・單機全天',28000,'1 位錄影師，儀式＋宴客，8 小時。'],
    ['dual','動態錄影・雙機全天',42000,'2 位錄影師，儀式＋宴客，8 小時。']
  ],
  wedding: [
    ['light','輕婚紗／美式便服',15000,'拍照 1–2 套，輕婚紗或自主服，含基礎妝髮與精修。'],
    ['korean','韓式極簡風包套',45000,'拍照 3 套＋宴客 2–3 套，含光影攝影棚與妝髮。'],
    ['american','經典美式戶外包套',52000,'拍照 3 套＋宴客 3 套，含外拍車與造型師全程跟妝。'],
    ['vintage','復古／中式秀禾服',38000,'拍照 3–4 套，含龍鳳褂、秀禾服或復古旗袍等。'],
    ['couture','手工婚紗包套',68000,'拍照與宴客可選高訂款式、全區不加價與高級相本，依資料方案。']
  ],
  photos: [
    ['a','方案 A・基礎小資組',6000,'精修 15 組；不含全毛片，僅交付精修檔。'],
    ['b','方案 B・標準包套組',12000,'精修 30 組；約 150–200 張毛片調色全給。'],
    ['c','方案 C・高規全拿組',20000,'精修 50 組；約 250–300 張毛片調色全給。'],
    ['d','方案 D・單張精修加購',0,'按下方張數計費，每張 500 元，含精修與入本排版。'],
    ['e','方案 E・毛片全拿加購',8000,'全數調色 JPG 檔；不另含精修。']
  ]
};
const selectIds = ['hotel','makeup','nails','hair','photography','video','wedding','photos'];
const listNames = {hotel:'hotels',makeup:'makeup',nails:'nails',hair:'hair',photography:'photography',video:'video',wedding:'wedding',photos:'photos'};
let saved = storage.get('estimate-v2',{});
if (!saved || typeof saved!=='object') saved = {};
selectIds.forEach(id=>{
  const select=$('#'+id);
  const empty=id==='photos'?'不另購／已含於包套':'暫不選擇';
  select.innerHTML='<option value="none">'+empty+'</option>'+prices[listNames[id]].map(p=>`<option value="${p[0]}">${p[1]}｜${p[0]==='d'?'NT$ 500／張':money(p[2])}${id==='hotel'?'／桌＋10%':''}</option>`).join('');
  select.value=prices[listNames[id]].some(p=>p[0]===saved[id])?saved[id]:'none';
});
const bounded=(v,min,max,fallback)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Math.floor(Number(v)))):fallback;
$('#tables').value=bounded(saved.tables??10,1,1000,10);
$('#extra-photos').value=bounded(saved.extraPhotos??0,0,10000,0);
$('#target-budget').value=bounded(saved.target??550000,0,1000000000,550000);
$('#sde').value=saved.sde==='yes'?'yes':'none';
const choice=id=>prices[listNames[id]].find(p=>p[0]===$('#'+id).value);
let totals={},currentState={};
function calculate(){
  const state={}; const values={};
  selectIds.forEach(id=>{
    const item=choice(id); state[id]=$('#'+id).value; values[id]=item?.[2]??0;
    $('#'+id+'-note').textContent=item?.[3]??(id==='photos'?'包套已包含的項目，可不另購。':'選擇後可查看方案內容。');
  });
  state.tables=bounded($('#tables').value,1,1000,10);
  state.target=bounded($('#target-budget').value,0,1000000000,550000);
  const isSingle=state.photos==='d';
  if(isSingle&&Number($('#extra-photos').value)<1)$('#extra-photos').value=1;
  $('#extra-photos').min=isSingle?'1':'0';
  $('#extra-photo-label').innerHTML=(isSingle?'單張精修張數':'額外加購精修張數')+' <small>每張 NT$ 500</small>';
  state.extraPhotos=bounded($('#extra-photos').value,isSingle?1:0,10000,isSingle?1:0);
  $('#sde').disabled=state.video==='none';
  if(state.video==='none')$('#sde').value='none';
  state.sde=$('#sde').value;
  $('#sde-note').textContent=state.video==='none'?'需先選擇動態錄影方案。':'現場剪輯師 1 位，當天即時剪輯供晚宴播放。';
  const base=values.hotel*state.tables;
  const service=Math.round(base*.1);
  totals={venue:base+service,beauty:values.makeup+values.nails+values.hair,record:values.photography+values.video+(state.sde==='yes'?15000:0),portrait:values.wedding+values.photos+state.extraPhotos*500};
  totals.total=totals.venue+totals.beauty+totals.record+totals.portrait;
  $('#table-price').textContent=money(values.hotel);
  $('#service-charge').textContent=money(service);
  $('#guest-count').textContent='約 '+(state.tables*10).toLocaleString('zh-TW')+' 位賓客';
  Object.keys(totals).filter(k=>k!=='total').forEach(k=>{$('#'+k+'-subtotal').textContent=money(totals[k]);$('#summary-'+k).textContent=money(totals[k]);});
  $('#estimate-total').textContent=money(totals.total);
  const count=selectIds.filter(id=>state[id]!=='none').length+(state.sde==='yes'?1:0)+(state.extraPhotos>0?1:0);
  $('#selection-count').textContent=count?'已安排 '+count+' 項方案與加購':'先選擇方案，開始規劃。';
  const colors={venue:'#8a5257',beauty:'#b38d78',record:'#7e8e76',portrait:'#c4b293'};
  $('#estimate-distribution').innerHTML=Object.keys(colors).map(k=>`<span style="width:${totals.total?totals[k]/totals.total*100:0}%;background:${colors[k]}"></span>`).join('');
  const balance=state.target-totals.total;
  $('#balance-label').textContent=state.target===0?'未設定上限':balance<0?'超出預算':'尚可安排';
  $('#balance-value').textContent=state.target===0?'—':money(Math.abs(balance));
  $('#budget-message').classList.toggle('over',state.target>0&&balance<0);
  $('#budget-message').textContent=totals.total===0?'選好方案後，這裡會顯示預算餘額。':state.target===0?'可輸入預算上限，比較目前規劃金額。':balance<0?'已超出預算，可以調整桌數或方案。':balance===0?'剛好達到預算，建議再預留彈性。':'還有一些空間，可以留給未列項目與備用金。';
  currentState=state; storage.set('estimate-v2',state);
}
$('#estimate-form').addEventListener('submit',e=>e.preventDefault());
$$('#estimate-form select').forEach(el=>el.addEventListener('change',calculate));
['tables','extra-photos','target-budget'].forEach(id=>{
  $('#'+id).addEventListener('input',calculate);
  $('#'+id).addEventListener('change',()=>{
    const key=id==='tables'?'tables':id==='target-budget'?'target':'extraPhotos';
    $('#'+id).value=currentState[key];calculate();
  });
});
function resetEstimate(){selectIds.forEach(id=>$('#'+id).value='none');$('#tables').value=10;$('#extra-photos').value=0;$('#sde').value='none';calculate();}
$('#reset-estimate').addEventListener('click',resetEstimate);
$('#load-example').addEventListener('click',()=>{
  const example={hotel:'regent',makeup:'iling',nails:'solid',hair:'pluus',photography:'full',video:'full',wedding:'korean',photos:'b'};
  selectIds.forEach(id=>$('#'+id).value=example[id]);$('#tables').value=10;$('#extra-photos').value=0;$('#sde').value='none';calculate();
});
$('#download-estimate').addEventListener('click',()=>{
  const s=currentState;
  const rows=[['WedLink 智慧婚禮整合平台・婚禮預算表'],['項目','參考方案／說明','金額（新臺幣）']];
  const hotel=choice('hotel');
  rows.push(['婚宴',hotel?hotel[1]+'／'+s.tables+'桌／每桌10位':'未選擇',hotel?hotel[2]*s.tables:0],['婚宴服務費','婚宴基本費用 × 10%',Math.round((hotel?.[2]??0)*s.tables*.1)]);
  selectIds.filter(id=>id!=='hotel').forEach(id=>{const p=choice(id);if(p)rows.push([$('#'+id).labels[0].textContent,p[1],p[2]]);});
  if(s.sde==='yes')rows.push(['快剪快播','SDE 加購',15000]);
  if(s.extraPhotos)rows.push(['精修照片加購',s.extraPhotos+' 張 × 500 元',s.extraPhotos*500]);
  rows.push(['預估合計','',totals.total],['預算上限','',s.target],['預算餘額','負值表示超支',s.target-totals.total],['說明','依提供資料固定參考價試算，非即時報價。未列項目另計，已包含的包套項目請勿重複選購。']);
  const csv='\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='WedLink-婚禮預算試算.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
});
calculate();

$('.menu-toggle').addEventListener('click',()=>{const open=$('.menu-toggle').getAttribute('aria-expanded')!=='true';$('.menu-toggle').setAttribute('aria-expanded',String(open));$('#navigation').classList.toggle('open',open);});
$$('#navigation a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');}});
const stages={
  '180':{title:'把理想的婚禮，慢慢說清楚。',text:'確認日期、預算與婚禮形式，建立籌備的起點。',tasks:['討論婚期與婚禮形式','設定總預算與優先項目','了解場地檔期並安排參觀']},
  '90':{title:'找到一起完成婚禮的夥伴。',text:'比較服務內容與作品。簽約前，一起核對加價、訂金與取消條件。',tasks:['比較婚攝與婚錄方案','預約新秘試妝與禮服試穿','確認合約、訂金與聯絡窗口']},
  '30':{title:'把小細節，一件件安放好。',text:'確認賓客席次，和各廠商對齊流程，記下尾款日期。',tasks:['寄送喜帖並確認出席名單','整理席次與飲食需求','核對當日流程與各家尾款']},
  day:{title:'今天，安心做幸福的主角。',text:'交接重要物品與現場窗口，把心力留給相聚。',tasks:['確認流程及各窗口聯絡方式','完成重要物品與款項交接','與彼此好好享受這一天']},
  after:{title:'婚禮結束，美好繼續。',text:'收好影像與回憶，也安排租賃道具歸還。',tasks:['確認影像成果交付與尾款','回饋服務體驗並整理紀錄','安排租賃道具歸還與婚後紀念']}
};
let checks=storage.get('checks',{});if(!checks||typeof checks!=='object')checks={};
function renderJourney(key){const s=stages[key];$('#journey-panel').setAttribute('aria-labelledby','stage-'+key);$('#journey-panel').innerHTML=`<div><h3>${s.title}</h3><p>${s.text}</p></div><div class="checklist">${s.tasks.map((t,i)=>`<label><input type="checkbox" data-task="${key}-${i}" ${checks[key+'-'+i]===true?'checked':''}><span>${t}</span></label>`).join('')}</div>`;$$('#journey-panel input').forEach(el=>el.addEventListener('change',()=>{checks[el.dataset.task]=el.checked;storage.set('checks',checks);}));}
$$('[data-stage]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-stage]').forEach(b=>{b.setAttribute('aria-selected',String(b===btn));b.tabIndex=b===btn?0:-1;});renderJourney(btn.dataset.stage);}));
$('.journey-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const tabs=$$('[data-stage]');const i=tabs.indexOf(document.activeElement);if(i<0)return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].click();tabs[n].focus();});
renderJourney('180');
$$('a[href="#sources"]').forEach(link=>link.addEventListener('click',()=>{$('#sources details').open=true;}));

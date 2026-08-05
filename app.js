// === TT的成长空间 V5 ===
var LS_KEY='growth_v5';
var TODAY=new Date().toISOString().split('T')[0];
function seedOfDay(){var d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()}
function load(){try{return JSON.parse(localStorage.getItem(LS_KEY))}catch(e){return null}}
function save(d){localStorage.setItem(LS_KEY,JSON.stringify(d))}
function defaults(){return{date:TODAY,checkins:{'运动30分钟':false,'阅读30分钟':false,'背英语单词10个':false,'喝水1大杯':false,'口头复述一篇新闻或故事':false,'学习一小时':false,'23:30前放下手机睡觉':false},streak:0,lastStreakDate:null,courses:{editing:{day:1},english:{plan:{day:1},vocab:{day:1},quiz:{day:1}},aiSoftware:{day:1},aiDrama:{day:1}},_activePanel:'checkin',_learnTab:'editing',_engSubTab:'plan',quizResults:{},examResults:{},expenses:[],_mFilter:{type:'all',cat:'all',from:'',to:''}}}
var DATA=load()||defaults();
if(DATA.date!==TODAY){var prev=DATA,fresh=defaults();var yd=new Date(Date.now()-86400000).toISOString().split('T')[0];if(prev.date===yd&&Object.values(prev.checkins).every(function(v){return v})){fresh.streak=prev.streak+1;fresh.lastStreakDate=TODAY}else if(prev.lastStreakDate===yd){fresh.streak=prev.streak}else{fresh.streak=0}fresh.courses=prev.courses||fresh.courses;fresh.quizResults=prev.quizResults||{};fresh.examResults=prev.examResults||{};DATA=fresh;save(DATA)}
// SIDEBAR
function switchPanel(name){DATA._activePanel=name;save(DATA);if(name==='money')renderMoney();if(name==='home')renderHome();document.querySelectorAll('.sb-nav-item').forEach(function(el){el.classList.toggle('active',el.dataset.panel===name)});document.querySelectorAll('.panel').forEach(function(el){el.classList.toggle('active',el.id==='panel-'+name)});document.getElementById('sidebar').classList.remove('open')}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open')}
function updateDate(){var d=new Date(),wd=['日','一','二','三','四','五','六'],h=d.getHours(),g=h<6?'夜深了🌙':h<12?'早安☀️':h<14?'午安🌤':h<18?'下午好🌿':h<22?'晚上好🌟':'夜深了🌙';document.getElementById('sbDate').textContent='📅 '+(d.getMonth()+1)+'月'+d.getDate()+'日 星期'+wd[d.getDay()]+' · '+g}
function showToast(msg,type){var el=document.getElementById('toast');el.textContent=msg;el.className='toast '+type+' show';setTimeout(function(){el.classList.remove('show')},2000)}
// CHECKIN
var EMOJI={'运动':'🏃','阅读':'📖','背':'📝','喝水':'💧','口头':'🗣️','学习':'📚','23:30':'📱','早睡':'🌙','冥想':'🧘','编程':'💻'};
function emoji(t){for(var k in EMOJI){if(t.indexOf(k)>=0)return EMOJI[k]}return'✨'}
function renderCheckins(){var list=document.getElementById('chkList');list.innerHTML='';Object.entries(DATA.checkins).forEach(function(entry){var text=entry[0],done=entry[1];var el=document.createElement('div');el.className='chk-item'+(done?' done':'');el.innerHTML='<div class="chk-box"></div><span class="chk-emoji">'+emoji(text)+'</span><span class="chk-text">'+text+'</span><span class="chk-del" onclick="event.stopPropagation();delCheckin(this,\''+text.replace(/'/g,"\\'")+'\')">✕</span>';el.onclick=function(e){if(e.target.closest('.chk-del'))return;toggleCheckin(text)};list.appendChild(el)});var total=Object.keys(DATA.checkins).length,doneCount=Object.values(DATA.checkins).filter(function(v){return v}).length;document.getElementById('chkBadge').textContent=doneCount+'/'+total}
function toggleCheckin(t){DATA.checkins[t]=!DATA.checkins[t];save(DATA);renderCheckins()}
function addCheckin(){var i=document.getElementById('chkInput'),t=i.value.trim();if(!t)return;if(DATA.checkins[t])return showToast('任务已存在','error');DATA.checkins[t]=false;save(DATA);i.value='';renderCheckins();showToast('已添加 ✓','success')}
function delCheckin(el,t){delete DATA.checkins[t];save(DATA);renderCheckins()}
// === LEARN TABS ===
function switchLearnTab(tab){DATA._learnTab=tab;save(DATA);document.querySelectorAll('#learnTabs .course-tab').forEach(function(el,i){el.classList.toggle('active',['editing','english','ai'][i]===tab)});if(tab==='editing')renderEditing();else if(tab==='english')renderEnglish();else if(tab==='ai')renderAI()}
function completeDay(k){if(!DATA.courses[k])DATA.courses[k]={day:1};DATA.courses[k].day++;save(DATA);if(DATA._learnTab==='editing')renderEditing();else if(DATA._learnTab==='english')renderEnglish();else renderAI();showToast('今日学习完成 ✓','success')}
function resetCourse(k){if(DATA.courses[k])DATA.courses[k].day=1;save(DATA);if(DATA._learnTab==='editing')renderEditing();else if(DATA._learnTab==='english')renderEnglish();else renderAI();showToast('课程已重置','success')}
// === EDITING COURSE DATA ===
var EDIT_LINK='https://www.bilibili.com/video/BV1Gaxyz8Erz/';
var EDIT_LINK2='https://www.bilibili.com/video/BV1hj3ezfEoP/';
var EDIT_COURSE={title:'剪辑从入门到精通',goal:'独立完成专业级视频剪辑，可接单',phases:[
{name:'🌱 基础入门',days:[
{t:'认识剪辑软件',d:'安装剪映/PR，熟悉界面布局、工具栏位置，了解时间线概念',hw:'安装好软件，截图工作区界面，标注出时间线、预览窗、素材库、工具栏的位置',link:EDIT_LINK},
{t:'第一次剪切',d:'导入一段素材，练习分割、删除、调整片段顺序',hw:'用手机拍3段30秒日常素材，导入后剪成1条15秒短片，去掉所有废话和停顿',link:EDIT_LINK},
{t:'音频基础',d:'添加背景音乐，调整音量、淡入淡出，学会音频与画面同步',hw:'给昨天的15秒短片配BGM，做一个2秒淡入+1秒淡出',link:EDIT_LINK},
{t:'文字与字幕',d:'添加标题文字、滚动字幕，调整字体/颜色/动画效果',hw:'给短片加一个开场标题（动画入场）+ 结尾字幕，尝试至少3种文字动画效果',link:EDIT_LINK},
{t:'转场入门',d:'使用基础转场效果（淡入淡出、滑动、缩放），理解转场节奏',hw:'拍3段不同场景素材，用3种不同转场连起来，体会不同转场的情绪差异',link:EDIT_LINK},
{t:'速度与节奏',d:'加速/减速/倒放，变速曲线，理解快慢节奏的表达力',hw:'拍一段走路/跑步素材，做前半段慢动作(0.5x)+后半段快进(3x)',link:EDIT_LINK},
{t:'导出与分享',d:'学习导出设置（分辨率、帧率、编码），发布第一支作品',hw:'导出1080p/30fps的完整短片，发到任意平台',link:EDIT_LINK}
]},
{name:'🌿 技术提升',days:[
{t:'调色基础',d:'亮度/对比度/饱和度调节，LUT滤镜使用，理解色彩情绪',hw:'找一段阴天拍的灰暗素材，调亮+加饱和度+套一个暖色LUT',link:EDIT_LINK2},
{t:'调色进阶',d:'HSL精细调色、色彩分离、局部调色，打造个人调色风格',hw:'同一段素材做3种调色风格（日系小清新/电影感青橙/复古胶片）',link:EDIT_LINK2},
{t:'特效入门',d:'使用基础特效（模糊、发光、故障风），理解特效的叙事作用',hw:'拍一段对镜头说话的素材，加一个"故障风"转场+局部发光效果',link:EDIT_LINK2},
{t:'关键帧动画',d:'关键帧原理，制作文字/画面缩放、移动、旋转动画',hw:'做一个5秒片头——文字从大到小缩放进场，背景图缓慢推近',link:EDIT_LINK2},
{t:'蒙版与遮罩',d:'蒙版绘制、羽化边缘、动态蒙版跟踪，制作创意分屏',hw:'拍两段同一位置不同动作的素材，用蒙版做"左右分屏同框"效果',link:EDIT_LINK2},
{t:'混合模式',d:'叠加/滤色/正片叠底等混合模式，创造光效、双重曝光',hw:'拍一段人物剪影+一段天空云朵素材，用"滤色"混合做双重曝光',link:EDIT_LINK2},
{t:'多轨编辑',d:'多机位剪辑、画中画、叠加素材，打造丰富视觉层次',hw:'拍一段全屏主画面+一段手机屏幕录制，做画中画效果',link:EDIT_LINK2}
]},
{name:'🌳 创意表达',days:[
{t:'踩点剪辑',d:'音乐节拍标记，画面与节拍精准对齐，制作踩点短视频',hw:'选一首BPM清晰的歌，拍/找10段素材，做一个15秒踩点视频',link:EDIT_LINK2},
{t:'叙事结构',d:'理解起承转合，用剪辑节奏讲故事，控制观众情绪起伏',hw:'用5段素材讲一个完整小故事（有开头-冲突-解决）',link:EDIT_LINK2},
{t:'情绪剪辑',d:'用镜头长度、音乐、色调营造紧张/温暖/治愈等情绪氛围',hw:'同一段素材剪两个版本——A版紧张悬疑，B版温暖治愈',link:EDIT_LINK2},
{t:'Vlog剪辑',d:'日常Vlog的剪辑思路：去冗留精、节奏把控、转场设计',hw:'拍一天的生活素材，剪成60秒Vlog，有旁白字幕+3种转场+BGM',link:EDIT_LINK2},
{t:'产品宣传片',d:'产品展示剪辑：卖点提炼、节奏紧凑、特效辅助呈现',hw:'选一个身边物品，拍5个角度素材，剪成15秒产品宣传片',link:EDIT_LINK2},
{t:'短视频爆款逻辑',d:'分析抖音爆款结构：黄金3秒、悬念设置、节奏密度',hw:'找3条百万赞短视频，逐帧分析它们的黄金3秒和节奏密度',link:EDIT_LINK2},
{t:'AI辅助剪辑',d:'用AI工具自动去抖、智能配乐、AI字幕，提升效率',hw:'用剪映AI自动字幕功能给一段2分钟视频上字幕',link:EDIT_LINK2}
]},
{name:'🌲 进阶实战',days:[
{t:'微电影剪辑',d:'3-5分钟短片剪辑，从素材整理到粗剪精剪全流程',hw:'拍摄并剪辑一部3分钟微电影，完成粗剪→精剪→调色→配乐全流程',link:EDIT_LINK2},
{t:'纪录片风格',d:'纪实类剪辑：访谈+空镜+旁白组合，节奏沉稳有深度',hw:'拍一段2分钟访谈+3段空镜，剪成纪录片风格短片',link:EDIT_LINK2},
{t:'运动/旅拍剪辑',d:'运动镜头的节奏设计、旅拍的画面选择与音乐搭配',hw:'用旅行/运动素材剪一条30秒高燃混剪，踩点+变速+调色统一',link:EDIT_LINK2},
{t:'直播切片',d:'从长直播中提炼精华片段，快速产出二次传播内容',hw:'找一段30分钟以上的直播回放，提炼出3条30秒精华切片',link:EDIT_LINK2},
{t:'多格式适配',d:'同一素材适配竖屏/横屏/方形，不同平台规格适配',hw:'把一条横屏视频分别适配为9:16竖屏和1:1方形',link:EDIT_LINK2},
{t:'团队协作剪辑',d:'项目管理、素材共享、版本控制，多人协作工作流',hw:'列出一份剪辑项目管理表（含素材清单、分工、版本命名规则）',link:EDIT_LINK2},
{t:'作品集整理',d:'整理代表作，制作个人作品展示页面/视频',hw:'从之前所有作业中选出最满意的5条，剪辑成1分钟作品集混剪',link:EDIT_LINK2}
]},
{name:'🏆 精通毕业',days:[
{t:'商业项目实战',d:'模拟客户需求，从创意方案到成片交付，全流程实战',hw:'模拟一个客户需求（如"为一家咖啡店做15秒宣传视频"），全流程完成',link:EDIT_LINK2},
{t:'毕业作品发布',d:'发布最终作品，总结成果，规划下一步进阶方向',hw:'发布毕业作品到至少2个平台，写一篇300字学习总结',link:EDIT_LINK2}
]}
]};
function flat(def){var d=[];def.phases.forEach(function(p){p.days.forEach(function(c){d.push(Object.assign({phase:p.name},c))})});return d}
function renderEditing(){var st=DATA.courses.editing||{day:1};var all=flat(EDIT_COURSE);var idx=Math.min(st.day-1,all.length-1);var today=all[idx],next=all[idx+1];var pct=Math.round(Math.min(idx,all.length)/all.length*100);
var h='<div class="course-dual">';
// Left: course
h+='<div class="course-col"><div class="course-col-head"><div class="course-col-icon editing">🎬</div><div><div class="course-col-title">'+EDIT_COURSE.title+'</div><div class="course-col-goal">目标：'+EDIT_COURSE.goal+'</div></div></div>';
h+='<div class="course-col-day">📅 第 '+st.day+' 天 / 共 '+all.length+' 天</div>';
h+='<div class="course-col-content"><div class="course-col-phase">'+(today||{phase:'🎉 已完成'}).phase+'</div><div class="course-col-name">'+(today||{t:'课程全部完成！'}).t+'</div><div class="course-col-desc">'+(today||{d:''}).d+'</div>';
if(today&&today.link)h+='<a class="course-col-link" href="'+today.link+'" target="_blank">▶ 观看课程视频</a>';
h+='</div>';
if(today&&today.hw)h+='<div class="course-hw">📌 今日作业：'+today.hw+'</div>';
if(next)h+='<div class="course-next">📅 明日预告：<b>'+next.t+'</b></div>';
h+='<div class="course-col-bar"><div class="course-col-bar-fill" style="width:'+pct+'%"></div></div><div class="course-col-meta"><span>'+idx+'/'+all.length+' 天</span><span>'+pct+'%</span></div>';
h+='<div class="course-col-actions">';
if(st.day<=all.length)h+='<button class="c-btn primary" onclick="completeDay(\'editing\')">✓ 今日完成</button>';
h+='<button class="c-btn danger" onclick="resetCourse(\'editing\')">重置</button></div></div>';
// Right: tips
h+='<div class="course-col"><div class="course-col-head"><div class="course-col-icon editing">📝</div><div><div class="course-col-title">学习要点</div><div class="course-col-goal">每日练习 · 稳步提升</div></div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">💡 接单准备</div><div class="course-col-name">从学到赚的路径</div><div class="course-col-desc">1. 每天跟做作业，积累作品集<br>2. 第2周开始接9.9元试剪单<br>3. 第3周入驻一品威客/云工接单<br>4. 第4周提升单价，打造个人品牌<br>5. 精通后可接商业项目（300-3000元/条）</div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">📦 素材资源</div><div class="course-col-name">免费素材网站</div><div class="course-col-desc">🎬 无版权视频：Coverr / Pixabay<br>🎵 音效BGM：爱给网<br>💡 灵感参考：新片场 / 开眼<br>📱 模板素材：剪映模板库</div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">💰 接单平台</div><div class="course-col-name">变现渠道</div><div class="course-col-desc">• 一品威客网（企业单）<br>• 云工（远程工作）<br>• 闲鱼（9.9试剪引流）<br>• 豆瓣小组（私人单）<br>• 抖音/小红书（自运营接单）</div></div>';
h+='</div></div>';
document.getElementById('learnContent').innerHTML=h;
}
// === ENGLISH COURSE (商务英语/外贸方向) ===
var VOCAB=[

  [["hello","/həˈləʊ/","你好"],["hi","/haɪ/","嗨"],["name","/neɪm/","名字"],["friend","/frend/","朋友"],["thank","/θæŋk/","谢谢"],["please","/pliːz/","请"],["sorry","/ˈsɒri/","对不起"],["good","/ɡʊd/","好的"],["morning","/ˈmɔːnɪŋ/","早晨"],["meet","/miːt/","遇见"]],
  [["rice","/raɪs/","米饭"],["noodle","/ˈnuːdl/","面条"],["egg","/eɡ/","鸡蛋"],["bread","/bred/","面包"],["meat","/miːt/","肉"],["vegetable","/ˈvedʒtəbl/","蔬菜"],["fruit","/fruːt/","水果"],["chicken","/ˈtʃɪkɪn/","鸡肉"],["fish","/fɪʃ/","鱼"],["soup","/suːp/","汤"]],
  [["water","/ˈwɔːtə/","水"],["tea","/tiː/","茶"],["coffee","/ˈkɒfi/","咖啡"],["milk","/mɪlk/","牛奶"],["juice","/dʒuːs/","果汁"],["cup","/kʌp/","杯子"],["glass","/ɡlɑːs/","玻璃杯"],["sugar","/ˈʃʊɡə/","糖"],["drink","/drɪŋk/","喝"],["hot","/hɒt/","热的"]],
  [["coat","/kəʊt/","外套"],["dress","/dres/","连衣裙"],["shoe","/ʃuː/","鞋"],["shirt","/ʃɜːt/","衬衫"],["cold","/kəʊld/","冷的"],["warm","/wɔːm/","温暖的"],["sunny","/ˈsʌni/","晴朗的"],["wind","/wɪnd/","风"],["wear","/weə/","穿"],["rain","/reɪn/","雨"]],
  [["home","/həʊm/","家"],["room","/ruːm/","房间"],["bed","/bed/","床"],["desk","/desk/","书桌"],["chair","/tʃeə/","椅子"],["table","/ˈteɪbl/","桌子"],["kitchen","/ˈkɪtʃɪn/","厨房"],["sofa","/ˈsəʊfə/","沙发"],["window","/ˈwɪndəʊ/","窗户"],["door","/dɔː/","门"]],
  [["bus","/bʌs/","公交车"],["subway","/ˈsʌbweɪ/","地铁"],["taxi","/ˈtæksi/","出租车"],["walk","/wɔːk/","走路"],["bike","/baɪk/","自行车"],["car","/kɑː/","汽车"],["train","/treɪn/","火车"],["near","/nɪə/","近的"],["far","/fɑː/","远的"],["station","/ˈsteɪʃn/","车站"]],
  [["happy","/ˈhæpi/","开心的"],["day","/deɪ/","天"],["learn","/lɜːn/","学习"],["practice","/ˈpræktɪs/","练习"],["small","/smɔːl/","小的"],["big","/bɪɡ/","大的"],["time","/taɪm/","时间"],["help","/help/","帮助"],["family","/ˈfæməli/","家庭"],["love","/lʌv/","爱"]],
  [["age","/eɪdʒ/","年龄"],["like","/laɪk/","喜欢"],["read","/riːd/","读书"],["cook","/kʊk/","做饭"],["mother","/ˈmʌðə/","妈妈"],["year","/jɪə/","年"],["old","/əʊld/","老的"],["hobby","/ˈhɒbi/","爱好"],["sing","/sɪŋ/","唱歌"],["dance","/dɑːns/","跳舞"]],
  [["father","/ˈfɑːðə/","爸爸"],["husband","/ˈhʌzbənd/","丈夫"],["son","/sʌn/","儿子"],["daughter","/ˈdɔːtə/","女儿"],["brother","/ˈbrʌðə/","兄弟"],["sister","/ˈsɪstə/","姐妹"],["parent","/ˈpeərənt/","父母"],["baby","/ˈbeɪbi/","宝宝"],["together","/təˈɡeðə/","一起"],["kind","/kaɪnd/","善良的"]],
  [["child","/tʃaɪld/","孩子"],["play","/pleɪ/","玩耍"],["story","/ˈstɔːri/","故事"],["block","/blɒk/","积木"],["song","/sɒŋ/","歌曲"],["sleep","/sliːp/","睡觉"],["eat","/iːt/","吃"],["toy","/tɔɪ/","玩具"],["laugh","/lɑːf/","笑"],["hug","/hʌɡ/","拥抱"]],
  [["get up","/ɡet ʌp/","起床"],["brush","/brʌʃ/","刷"],["tooth","/tuːθ/","牙齿"],["wash","/wɒʃ/","洗"],["clean","/kliːn/","打扫"],["evening","/ˈiːvnɪŋ/","晚上"],["night","/naɪt/","夜晚"],["usually","/ˈjuːʒuəli/","通常"],["early","/ˈɜːli/","早"],["after","/ˈɑːftə/","在…之后"]],
  [["buy","/baɪ/","买"],["sell","/sel/","卖"],["money","/ˈmʌni/","钱"],["shop","/ʃɒp/","商店"],["market","/ˈmɑːkɪt/","市场"],["apple","/ˈæpl/","苹果"],["cheap","/tʃiːp/","便宜的"],["expensive","/ɪkˈspensɪv/","贵的"],["bag","/bæɡ/","袋子"],["pay","/peɪ/","付款"]],
  [["feel","/fiːl/","感觉"],["tired","/ˈtaɪəd/","累的"],["sad","/sæd/","伤心的"],["angry","/ˈæŋɡri/","生气的"],["afraid","/əˈfreɪd/","害怕的"],["excited","/ɪkˈsaɪtɪd/","兴奋的"],["calm","/kɑːm/","平静的"],["cry","/kraɪ/","哭"],["smile","/smaɪl/","微笑"],["heart","/hɑːt/","心"]],
  [["can","/kæn/","能"],["talk","/tɔːk/","说话"],["week","/wiːk/","周"],["step","/step/","步"],["brave","/breɪv/","勇敢的"],["easy","/ˈiːzi/","容易的"],["hard","/hɑːd/","难的"],["grow","/ɡrəʊ/","成长"],["keep","/kiːp/","保持"],["go","/ɡəʊ/","去"]],
[["feedback","/ˈfiːdbæk/","反馈"],["review","/rɪˈvjuː/","评价"],["return","/rɪˈtɜːrn/","退货"],["exchange","/ɪksˈtʃeɪndʒ/","换货"],["warranty","/ˈwɔːrənti/","保修"],["guarantee","/ˌɡærənˈtiː/","保证"],["after-sales","/ˈæftər seɪlz/","售后"],["service","/ˈsɜːrvɪs/","服务"],["support","/səˈpɔːrt/","支持"],["maintenance","/ˈmeɪntənəns/","维护"]],
[["Amazon","/ˈæməzɑːn/","亚马逊平台"],["FBA","/ˌefbiːˈeɪ/","亚马逊物流"],["ASIN","/ˈeɪsɪn/","亚马逊产品编号"],["Buy Box","/baɪ bɑːks/","购买按钮"],["PPC","/ˌpiːpiːˈsiː/","点击付费广告"],["ACoS","/ˈeɪkɒs/","广告成本销售比"],["Listing","/ˈlɪstɪŋ/","产品页面"],["SKU","/ˌeskeɪˈjuː/","库存单位"],["Variation","/ˌveriˈeɪʃn/","变体"],["Buyer","/ˈbaɪər/","买家"]],
[["Alibaba","/ˈælɪbɑːbɑː/","阿里巴巴"],["inquiry","/ˈɪnkwəri/","询盘"],["RFQ","/ˌɑːrefˈkjuː/","报价请求"],["gold supplier","/ɡoʊld səˈplaɪər/","金牌供应商"],["verified","/ˈverɪfaɪd/","认证的"],["trade assurance","/treɪd əˈʃʊrəns/","贸易保障"],["exhibition","/ˌeksɪˈbɪʃn/","展会"],["Canton Fair","/ˈkæntən fer/","广交会"],["booth","/buːθ/","展位"],["brochure","/broʊˈʃʊr/","宣传册"]],
[["keyword","/ˈkiːwɜːrd/","关键词"],["SEO","/ˌesiːˈoʊ/","搜索引擎优化"],["title","/ˈtaɪtl/","标题"],["description","/dɪˈskrɪpʃn/","描述"],["bullet point","/ˈbʊlɪt pɔɪnt/","卖点"],["optimization","/ˌɑːptɪməˈzeɪʃn/","优化"],["rank","/ræŋk/","排名"],["search","/sɜːrtʃ/","搜索"],["visibility","/ˌvɪzəˈbɪləti/","曝光度"],["click-through","/klɪk θruː/","点击率"]],
[["target","/ˈtɑːrɡɪt/","目标"],["audience","/ˈɔːdiəns/","受众"],["segment","/ˈseɡmənt/","细分"],["demographic","/ˌdeməˈɡræfɪk/","人口统计"],["preference","/ˈprefrəns/","偏好"],["behavior","/bɪˈheɪvjər/","行为"],["trend","/trend/","趋势"],["insight","/ˈɪnsaɪt/","洞察"],["analytics","/ˌænəˈlɪtɪks/","数据分析"],["metric","/ˈmetrɪk/","指标"]],
[["campaign","/kæmˈpeɪn/","广告活动"],["budget","/ˈbʌdʒɪt/","预算"],["bid","/bɪd/","出价"],["impression","/ɪmˈpreʃn/","展示"],["click","/klɪk/","点击"],["cost","/kɔːst/","成本"],["revenue","/ˈrevənuː/","收入"],["ROI","/ˌɑːrˈaɪ/","投资回报率"],["CTR","/ˌsiːtiːˈɑːr/","点击率"],["conversion rate","/kənˈvɜːrʒn reɪt/","转化率"]],
[["data","/ˈdeɪtə/","数据"],["report","/rɪˈpɔːrt/","报告"],["chart","/tʃɑːrt/","图表"],["graph","/ɡræf/","曲线图"],["statistics","/stəˈtɪstɪks/","统计"],["percentage","/pərˈsentɪdʒ/","百分比"],["average","/ˈævərɪdʒ/","平均"],["growth","/ɡroʊθ/","增长"],["decline","/dɪˈklaɪn/","下降"],["forecast","/ˈfɔːrkæst/","预测"]],
[["meeting","/ˈmiːtɪŋ/","会议"],["agenda","/əˈdʒendə/","议程"],["presentation","/ˌprezənˈteɪʃn/","演示"],["proposal","/prəˈpoʊzl/","提案"],["discussion","/dɪˈskʌʃn/","讨论"],["decision","/dɪˈsɪʒn/","决定"],["minute","/ˈmɪnɪt/","会议纪要"],["participant","/pɑːrˈtɪsɪpənt/","参与者"],["chairperson","/ˈtʃerpɜːrsən/","主持人"],["summarize","/ˈsʌməraɪz/","总结"]],
[["negotiation","/nɪˌɡoʊʃiˈeɪʃn/","谈判"],["leverage","/ˈlevərɪdʒ/","杠杆/优势"],["concession","/kənˈseʃn/","让步"],["deal","/diːl/","交易"],["sign","/saɪn/","签署"],["terminate","/ˈtɜːrmɪneɪt/","终止"],["renew","/rɪˈnuː/","续约"],["amend","/əˈmend/","修改"],["clause","/klɔːz/","条款"],["liability","/ˌlaɪəˈbɪləti/","责任"]],
[["clause","/klɔːz/","条款"],["penalty","/ˈpenəlti/","惩罚"],["breach","/briːtʃ/","违约"],["warranty","/ˈwɔːrənti/","保证"],["indemnity","/ɪnˈdemnəti/","赔偿"],["jurisdiction","/ˌdʒʊrɪsˈdɪkʃn/","管辖权"],["arbitration","/ˌɑːrbɪˈtreɪʃn/","仲裁"],["applicable","/əˈplɪkəbl/","适用的"],["govern","/ˈɡʌvərn/","适用（法律）"],["force majeure","/fɔːrs mæˈʒɜːr/","不可抗力"]],
[["exhibition","/ˌeksɪˈbɪʃn/","展会"],["booth","/buːθ/","展位"],["display","/dɪˈspleɪ/","展示"],["demonstrate","/ˈdemənstreɪt/","演示"],["visitor","/ˈvɪzɪtər/","参观者"],["attendee","/əˌtenˈdiː/","参会者"],["networking","/ˈnetwɜːrkɪŋ/","社交拓展"],["business card","/ˈbɪznəs kɑːrd/","名片"],["introduce","/ˌɪntrəˈduːs/","介绍"],["showcase","/ˈʃoʊkeɪs/","展示"]],
[["social","/ˈsoʊʃl/","社交的"],["network","/ˈnetwɜːrk/","网络"],["connection","/kəˈnekʃn/","人脉"],["relationship","/rɪˈleɪʃnʃɪp/","关系"],["trust","/trʌst/","信任"],["rapport","/ræˈpɔːrt/","融洽关系"],["etiquette","/ˈetɪkət/","礼仪"],["professional","/prəˈfeʃənl/","专业的"],["courtesy","/ˈkɜːrtəsi/","礼貌"],["small talk","/smɔːl tɔːk/","闲聊"]],
[["report","/rɪˈpɔːrt/","报告"],["quarterly","/ˈkwɔːrtərli/","季度的"],["annual","/ˈænjuəl/","年度的"],["performance","/pərˈfɔːrməns/","绩效"],["achieve","/əˈtʃiːv/","实现"],["target","/ˈtɑːrɡɪt/","目标"],["progress","/ˈprɑːɡres/","进展"],["result","/rɪˈzʌlt/","结果"],["improve","/ɪmˈpruːv/","改善"],["evaluate","/ɪˈvæljueɪt/","评估"]],
[["interview","/ˈɪntərvjuː/","面试"],["resume","/ˈrezəmeɪ/","简历"],["experience","/ɪkˈspɪriəns/","经验"],["qualification","/ˌkwɑːlɪfɪˈkeɪʃn/","资格"],["strength","/streŋθ/","优势"],["weakness","/ˈwiːknəs/","弱点"],["career","/kəˈrɪr/","职业"],["position","/pəˈzɪʃn/","职位"],["salary","/ˈsæləri/","薪资"],["benefit","/ˈbenɪfɪt/","福利"]],
[["strength","/streŋθ/","优势"],["weakness","/ˈwiːknəs/","劣势"],["opportunity","/ˌɑːpərˈtuːnəti/","机会"],["threat","/θret/","威胁"],["analyze","/ˈænəlaɪz/","分析"],["evaluate","/ɪˈvæljueɪt/","评估"],["strategy","/ˈstrætədʒi/","战略"],["implement","/ˈɪmplɪment/","实施"],["monitor","/ˈmɑːnɪtər/","监控"],["adjust","/əˈdʒʌst/","调整"]],
[["comprehensive","/ˌkɑːmprɪˈhensɪv/","综合的"],["simulate","/ˈsɪmjuleɪt/","模拟"],["scenario","/səˈnærioʊ/","场景"],["role-play","/roʊl pleɪ/","角色扮演"],["fluency","/ˈfluːənsi/","流利度"],["accuracy","/ˈækjərəsi/","准确度"],["pronunciation","/prəˌnʌnsiˈeɪʃn/","发音"],["intonation","/ˌɪntəˈneɪʃn/","语调"],["confidence","/ˈkɑːnfɪdəns/","信心"],["proficiency","/prəˈfɪʃnsi/","熟练度"]],
[["graduate","/ˈɡrædʒueɪt/","毕业"],["certificate","/sərˈtɪfɪkət/","证书"],["diploma","/dɪˈploʊmə/","文凭"],["qualification","/ˌkwɑːlɪfɪˈkeɪʃn/","资格"],["competent","/ˈkɑːmpɪtənt/","胜任的"],["professional","/prəˈfeʃənl/","专业的"],["specialize","/ˈspeʃəlaɪz/","专攻"],["expertise","/ˌekspɜːrˈtiːz/","专业知识"],["career path","/kəˈrɪr pæθ/","职业道路"],["achieve","/əˈtʃiːv/","达成"]]
];
// === WORD SEARCH DICTIONARY (商务单词查询) ===
// Build base dictionary from VOCAB (word -> {ipa, cn})
var WORD_DICT={};
VOCAB.forEach(function(arr){arr.forEach(function(v){var k=String(v[0]).toLowerCase();if(!WORD_DICT[k])WORD_DICT[k]={ipa:v[1],cn:v[2]}})});
// Curated examples + pronunciation tips for core business vocabulary (Days 1-14)
var WORD_EX={
"order":{ex:[["We received a large order from a new client.","我们从一位新客户那里收到了一个大订单。"]]},
"price":{ex:[["The price of this product is very competitive.","这款产品的价格很有竞争力。"]]},
"product":{ex:[["This product sells well in Europe.","这款产品在欧洲卖得很好。"]]},
"quality":{ex:[["We always focus on product quality.","我们一直注重产品质量。"]]},
"sample":{ex:[["Please send us a free sample.","请寄一份免费样品给我们。"]]},
"quote":{ex:[["Could you quote a price for 1000 units?","你能报一下1000件的价格吗？"]]},
"buyer":{ex:[["The buyer is very satisfied with the goods.","买方对这批货物非常满意。"]]},
"seller":{ex:[["The seller shipped the order on time.","卖方按时发运了订单。"]]},
"trade":{ex:[["International trade brings many opportunities.","国际贸易带来很多机会。"]]},
"market":{ex:[["We want to expand into the Asian market.","我们想拓展亚洲市场。"]]},
"import":{ex:[["We import coffee from Brazil.","我们从巴西进口咖啡。"]]},
"export":{ex:[["Our company exports toys to the US.","我们公司向美国出口玩具。"]]},
"customs":{ex:[["The goods are stuck at customs.","货物滞留在海关。"]]},
"cargo":{ex:[["The cargo will arrive next week.","货物下周到达。"]]},
"freight":{ex:[["Air freight is faster but more expensive.","空运更快但更贵。"]]},
"port":{ex:[["The ship left the port this morning.","船今天早上离港了。"]]},
"vessel":{ex:[["The vessel is expected to dock tomorrow.","船只预计明天靠港。"]]},
"container":{ex:[["We need 20 containers for this order.","这个订单我们需要20个集装箱。"]]},
"shipment":{ex:[["The shipment was delayed by bad weather.","装运因恶劣天气延误了。"]]},
"delivery":{ex:[["When is the delivery date?","交货日期是什么时候？"]]},
"invoice":{ex:[["Please send the invoice by email.","请通过邮件发送发票。"]]},
"receipt":{ex:[["Keep the receipt for returns.","保留收据以便退货。"]]},
"contract":{ex:[["Both sides signed the contract.","双方签署了合同。"]]},
"agreement":{ex:[["We reached an agreement on price.","我们就价格达成了协议。"]]},
"terms":{ex:[["Please read the payment terms carefully.","请仔细查看付款条款。"]]},
"condition":{ex:[["The goods arrived in good condition.","货物完好无损地到达。"]]},
"payment":{ex:[["We received your payment.","我们已收到你的付款。"]]},
"deposit":{ex:[["A 30% deposit is required.","需要30%的定金。"]]},
"balance":{ex:[["Please pay the balance before shipping.","请在发货前付清尾款。"]]},
"discount":{ex:[["We offer a 10% discount for bulk orders.","大宗订单我们给9折优惠。"]]},
"supplier":{ex:[["We chose a reliable supplier.","我们选择了一家可靠的供应商。"]]},
"manufacturer":{ex:[["The manufacturer is in Shenzhen.","制造商在深圳。"]]},
"factory":{ex:[["We visited the factory last month.","我们上个月参观了工厂。"]]},
"warehouse":{ex:[["The goods are stored in the warehouse.","货物存放在仓库里。"]]},
"inventory":{ex:[["Our inventory is running low.","我们的库存快不够了。"]]},
"stock":{ex:[["This item is out of stock.","这款商品缺货了。"]]},
"supply":{ex:[["They supply parts to many brands.","他们为许多品牌供应零件。"]]},
"demand":{ex:[["Demand for this product is rising.","这款产品的需求在上升。"]]},
"wholesale":{ex:[["We buy goods at wholesale prices.","我们以批发价采购商品。"]]},
"retail":{ex:[["The retail price is higher than wholesale.","零售价高于批发价。"]]},
"negotiate":{ex:[["We will negotiate the price tomorrow.","我们明天将谈判价格。"]]},
"offer":{ex:[["They offered a good price.","他们给出了一个好价格。"]]},
"accept":{ex:[["We accept your proposal.","我们接受你的提议。"]]},
"reject":{ex:[["The buyer rejected our offer.","买方拒绝了我们报价。"]]},
"confirm":{ex:[["Please confirm the order details.","请确认订单详情。"]]},
"agree":{ex:[["Both sides agreed on the terms.","双方就条款达成了一致。"]]},
"discuss":{ex:[["Let's discuss the contract.","我们来讨论一下合同。"]]},
"propose":{ex:[["We propose a new delivery plan.","我们提议一个新的交货方案。"]]},
"suggest":{ex:[["I suggest we meet next week.","我建议我们下周见面。"]]},
"compromise":{ex:[["A compromise helped close the deal.","一次妥协促成了交易。"]]},
"currency":{ex:[["The US dollar is a strong currency.","美元是一种强势货币。"]]},
"exchange":{ex:[["You can exchange money at the bank.","你可以在银行兑换货币。"]]},
"rate":{ex:[["The exchange rate changed today.","汇率今天变动了。"]]},
"dollar":{ex:[["The price is 50 dollars.","价格是50美元。"]]},
"euro":{ex:[["The product costs 30 euros.","这款产品售价30欧元。"]]},
"refund":{ex:[["We will refund your money.","我们会退还你的钱。"]]},
"cost":{ex:[["The cost of production went up.","生产成本上涨了。"]]},
"profit":{ex:[["Our profit increased this year.","我们今年的利润增长了。"]]},
"margin":{ex:[["The profit margin is too low.","利润率太低了。"]]},
"budget":{ex:[["We need to stay within budget.","我们需要在预算之内。"]]},
"packaging":{ex:[["The packaging must be safe.","包装必须安全。"]]},
"label":{ex:[["Each box needs a clear label.","每个箱子都需要清晰的标签。"]]},
"barcode":{ex:[["Scan the barcode to check stock.","扫描条码来查看库存。"]]},
"carton":{ex:[["We use strong cartons for shipping.","我们用结实的纸箱装运。"]]},
"pallet":{ex:[["The goods are stacked on a pallet.","货物堆放在托盘上。"]]},
"weight":{ex:[["What is the gross weight?","毛重是多少？"]]},
"volume":{ex:[["The volume of this box is large.","这个箱子的体积很大。"]]},
"dimension":{ex:[["Please check the product dimensions.","请查看产品尺寸。"]]},
"fragile":{ex:[["Mark the box as fragile.","把这个箱子标记为易碎。"]]},
"inspect":{ex:[["We inspect every product before shipping.","发货前我们检查每一件产品。"]]},
"MOQ":{pron:"缩写词，通常逐个字母读：M-O-Q（/ˌemoʊˈkjuː/）。",ex:[["Our MOQ is 500 pieces.","我们的最小起订量是500件。"]]},
"FOB":{pron:"缩写词，通常逐个字母读：F-O-B（/ˌefoʊˈbiː/），意为离岸价。",ex:[["The price is FOB Shanghai.","价格是FOB上海。"]]},
"CIF":{pron:"缩写词，通常逐个字母读：C-I-F（/ˌsiːaɪˈef/），意为到岸价。",ex:[["CIF includes insurance and freight.","CIF包含保险和运费。"]]},
"L/C":{pron:"缩写词，通常逐个字母读：L-C（/ˌelˈsiː/），意为信用证。",ex:[["We prefer payment by L/C.","我们更倾向于信用证付款。"]]},
"T/T":{pron:"缩写词，通常逐个字母读：T-T（/ˌtiːˈtiː/），意为电汇。",ex:[["Please pay by T/T.","请用电汇付款。"]]},
"lead time":{pron:"重音在第一个词 lead：/liːd taɪm/。",ex:[["The lead time is about 15 days.","交货周期大约15天。"]]},
"specification":{ex:[["Please send the product specification.","请发送产品规格。"]]},
"catalog":{ex:[["We sent you our latest catalog.","我们给你发去了最新的产品目录。"]]},
"certification":{ex:[["The product has CE certification.","这款产品有CE认证。"]]},
"compliance":{ex:[["We must ensure full compliance.","我们必须确保完全合规。"]]},
"customer":{ex:[["The customer is very happy.","客户非常满意。"]]},
"client":{ex:[["We met an important client today.","我们今天会见了一位重要客户。"]]},
"contact":{ex:[["Please contact us by email.","请通过邮件联系我们。"]]},
"inquiry":{ex:[["We received an inquiry from a buyer.","我们收到了一位买家的询盘。"]]},
"reply":{ex:[["I will reply to your email soon.","我会尽快回复你的邮件。"]]},
"follow up":{pron:"重音在第一个词 fol-：/ˈfɑːloʊ ʌp/。",ex:[["Let's follow up with the client.","我们跟进一下这位客户吧。"]]},
"feedback":{ex:[["Thank you for your feedback.","感谢你的反馈。"]]},
"complaint":{ex:[["We handled the complaint quickly.","我们迅速处理了投诉。"]]},
"resolve":{ex:[["We resolved the issue together.","我们一起解决了这个问题。"]]},
"satisfy":{ex:[["We aim to satisfy our customers.","我们的目标是让客户满意。"]]},
"document":{ex:[["Please prepare the export document.","请准备出口单证。"]]},
"license":{ex:[["We need a business license.","我们需要营业执照。"]]},
"permit":{ex:[["Do you have an import permit?","你有进口许可证吗？"]]},
"declare":{ex:[["You must declare the goods.","你必须申报货物。"]]},
"tariff":{ex:[["The tariff increased this year.","关税今年上调了。"]]},
"duty":{ex:[["How much is the duty?","关税是多少？"]]},
"exemption":{ex:[["We applied for tax exemption.","我们申请了免税。"]]},
"origin":{ex:[["The origin of the goods is China.","货物原产地是中国。"]]},
"destination":{ex:[["The destination is Los Angeles.","目的地是洛杉矶。"]]},
"transit":{ex:[["The goods are in transit.","货物在运输途中。"]]},
"platform":{ex:[["We sell on many platforms.","我们在很多平台上销售。"]]},
"listing":{ex:[["Optimize your product listing.","优化你的产品列表页。"]]},
"review":{ex:[["Good reviews build trust.","好评能建立信任。"]]},
"rating":{ex:[["Our store has a high rating.","我们店铺评分很高。"]]},
"keyword":{ex:[["Use the right keyword.","用对关键词。"]]},
"traffic":{ex:[["We need more traffic.","我们需要更多流量。"]]},
"conversion":{ex:[["The conversion rate improved.","转化率提升了。"]]},
"click":{ex:[["Customers click the Buy button.","客户点击购买按钮。"]]},
"browse":{ex:[["She browses the website daily.","她每天浏览这个网站。"]]},
"purchase":{ex:[["He decided to purchase the item.","他决定购买这件商品。"]]},
"account":{ex:[["Please create an account.","请创建一个账户。"]]},
"register":{ex:[["Register on our website.","在我们的网站注册。"]]},
"login":{ex:[["I cannot login to my account.","我无法登录我的账户。"]]},
"subscribe":{ex:[["Subscribe to our newsletter.","订阅我们的新闻邮件。"]]},
"follower":{ex:[["We gained 1000 followers.","我们增加了1000个关注者。"]]},
"engagement":{ex:[["Engagement is key to growth.","互动是增长的关键。"]]},
"promote":{ex:[["We promote products on social media.","我们在社交媒体上推广产品。"]]},
"advertise":{ex:[["They advertise on TV.","他们在电视上做广告。"]]},
"campaign":{ex:[["We launched a new campaign.","我们发起了一场新活动。"]]},
"launch":{ex:[["We will launch the product next month.","我们下个月将上线这款产品。"]]},
"brand":{ex:[["We are building our own brand.","我们在打造自己的品牌。"]]},
"logo":{ex:[["The logo looks clean.","这个标志看起来简洁。"]]},
"slogan":{ex:[["Our slogan is 'Quality First'.","我们的口号是“质量第一”。"]]},
"image":{ex:[["A good brand image matters.","良好的品牌形象很重要。"]]},
"reputation":{ex:[["The company has a good reputation.","这家公司声誉很好。"]]},
"trust":{ex:[["Trust is the base of business.","信任是生意的基础。"]]},
"loyalty":{ex:[["We reward customer loyalty.","我们奖励客户忠诚。"]]},
"competitive":{ex:[["Our price is very competitive.","我们的价格很有竞争力。"]]},
"advantage":{ex:[["Our advantage is fast delivery.","我们的优势是快速交货。"]]},
"strategy":{ex:[["We need a clear strategy.","我们需要清晰的策略。"]]},
"logistics":{ex:[["Logistics is key for e-commerce.","物流对电商很关键。"]]},
"tracking":{ex:[["Use the tracking number.","用这个追踪单号。"]]},
"dispatch":{ex:[["We will dispatch today.","我们今天会发货。"]]},
"arrival":{ex:[["We expect the arrival tomorrow.","我们预计明天到达。"]]},
"delay":{ex:[["Sorry for the delay.","抱歉延误了。"]]},
"schedule":{ex:[["The schedule is tight.","日程很紧。"]]},
"deadline":{ex:[["We must meet the deadline.","我们必须赶上截止日期。"]]},
"urgent":{ex:[["This is an urgent order.","这是一笔紧急订单。"]]},
"prompt":{ex:[["We offer prompt service.","我们提供及时的服务。"]]},
"return":{ex:[["You can return the item within 7 days.","你可以在7天内退货。"]]},
"warranty":{ex:[["The phone comes with a 2-year warranty.","这部手机有两年保修。"]]},
"guarantee":{ex:[["We guarantee on-time delivery.","我们保证按时交货。"]]},
"after-sales":{ex:[["Our after-sales service is very good.","我们的售后服务很好。"]]},
"service":{ex:[["Good service keeps customers happy.","好的服务让客户满意。"]]},
"support":{ex:[["Technical support is available 24/7.","技术支持全天候可用。"]]},
"maintenance":{ex:[["Regular maintenance saves money.","定期维护能省钱。"]]},
"amazon":{ex:[["We sell on Amazon.","我们在亚马逊上销售。"]]},
"fba":{ex:[["FBA handles storage and shipping.","FBA负责仓储和配送。"]]},
"asin":{ex:[["Each product has a unique ASIN.","每个产品都有唯一的ASIN编码。"]]},
"buy box":{ex:[["Winning the Buy Box increases sales.","赢得购买按钮能提升销量。"]]},
"ppc":{ex:[["PPC ads bring quick traffic.","PPC广告能带来快速流量。"]]},
"acos":{ex:[["Lower ACoS means better ad profit.","更低的ACoS意味着更好的广告利润。"]]},
"sku":{ex:[["Please provide the SKU number.","请提供SKU编号。"]]},
"variation":{ex:[["This product has three color variations.","这款产品有三种颜色变体。"]]},
"alibaba":{ex:[["We found suppliers on Alibaba.","我们在阿里巴巴上找到了供应商。"]]},
"rfq":{ex:[["Send an RFQ to get quotes.","发送RFQ获取报价。"]]},
"gold supplier":{ex:[["They are a Gold Supplier.","他们是金牌供应商。"]]},
"verified":{ex:[["The company is verified.","这家公司已经过认证。"]]},
"trade assurance":{ex:[["Trade Assurance protects your payment.","贸易保障保护你的付款安全。"]]},
"exhibition":{ex:[["We met clients at the exhibition.","我们在展会上见到了客户。"]]},
"canton fair":{ex:[["Canton Fair is held twice a year.","广交会每年举办两届。"]]},
"booth":{ex:[["Our booth attracted many visitors.","我们的展位吸引了很多参观者。"]]},
"brochure":{ex:[["Take a brochure for details.","拿一份宣传册了解详情。"]]},
"seo":{ex:[["SEO improves your search ranking.","SEO能提升你的搜索排名。"]]},
"title":{ex:[["A good title boosts clicks.","好的标题能提升点击。"]]},
"description":{ex:[["Write a clear product description.","写一段清晰的产品描述。"]]},
"bullet point":{ex:[["List features as bullet points.","把卖点列成要点。"]]},
"optimization":{ex:[["Image optimization speeds up loading.","图片优化能加快加载。"]]},
"rank":{ex:[["We want to rank on page one.","我们希望排到第一页。"]]},
"search":{ex:[["Customers search by keyword.","客户按关键词搜索。"]]},
"visibility":{ex:[["Better ads increase visibility.","更好的广告能提升曝光。"]]},
"click-through":{ex:[["Improve click-through with good images.","用优质图片提升点击率。"]]},
"audience":{ex:[["Know your target audience.","了解你的目标受众。"]]},
"segment":{ex:[["We segment customers by age.","我们按年龄细分客户。"]]},
"demographic":{ex:[["Demographics show who buys.","人口统计显示谁在购买。"]]},
"preference":{ex:[["We study customer preferences.","我们研究客户偏好。"]]},
"behavior":{ex:[["Analyze user behavior on site.","分析网站上的用户行为。"]]},
"trend":{ex:[["Follow the latest market trend.","关注最新市场趋势。"]]},
"insight":{ex:[["Data gives useful insights.","数据提供有用的洞察。"]]},
"analytics":{ex:[["Check analytics every week.","每周查看数据分析。"]]},
"metric":{ex:[["Conversion is a key metric.","转化率是关键指标。"]]},
"bid":{ex:[["Set a daily bid for ads.","为广告设置每日出价。"]]},
"impression":{ex:[["We got 10,000 impressions.","我们获得了1万次展示。"]]},
"revenue":{ex:[["Revenue grew by 20%.","收入增长了20%。"]]},
"roi":{ex:[["We measure campaign ROI.","我们衡量活动的投资回报率。"]]},
"ctr":{ex:[["A higher CTR means better ads.","更高的点击率意味着广告更好。"]]},
"conversion rate":{ex:[["Our conversion rate is 5%.","我们的转化率是5%。"]]},
"data":{ex:[["Data helps us make decisions.","数据帮助我们做决策。"]]},
"report":{ex:[["We write a weekly report.","我们写周报。"]]},
"chart":{ex:[["The chart shows monthly sales.","图表显示了月度销量。"]]},
"graph":{ex:[["The graph went up this quarter.","本季度曲线图上升了。"]]},
"statistics":{ex:[["Statistics prove the trend.","统计证实了这一趋势。"]]},
"percentage":{ex:[["A small percentage returned.","一小部分被退回。"]]},
"average":{ex:[["The average order is 50 dollars.","平均订单金额为50美元。"]]},
"growth":{ex:[["We see steady growth.","我们看到稳定增长。"]]},
"decline":{ex:[["Sales show a slight decline.","销量出现轻微下降。"]]},
"forecast":{ex:[["We forecast higher demand.","我们预测需求会上升。"]]},
"meeting":{ex:[["We have a meeting at 3 PM.","我们下午3点有个会议。"]]},
"agenda":{ex:[["Please send the meeting agenda.","请发送会议议程。"]]},
"presentation":{ex:[["He gave a clear presentation.","他做了一个清晰的演示。"]]},
"proposal":{ex:[["We accepted the proposal.","我们接受了这个提案。"]]},
"discussion":{ex:[["The discussion was useful.","这次讨论很有用。"]]},
"decision":{ex:[["We made a final decision.","我们做了最终决定。"]]},
"minute":{ex:[["Please take the minutes.","请做好会议纪要。"]]},
"participant":{ex:[["All participants joined online.","所有参与者都在线参加。"]]},
"chairperson":{ex:[["The chairperson opened the meeting.","主持人宣布会议开始。"]]},
"negotiation":{ex:[["Negotiation needs patience.","谈判需要耐心。"]]},
"leverage":{ex:[["Use your strength as leverage.","用你的优势作为筹码。"]]},
"concession":{ex:[["We made a small concession.","我们做了一个小让步。"]]},
"deal":{ex:[["We closed the deal.","我们达成了交易。"]]},
"sign":{ex:[["Please sign the contract.","请签署合同。"]]},
"terminate":{ex:[["They want to terminate the contract.","他们想终止合同。"]]},
"renew":{ex:[["We renewed the agreement.","我们续签了协议。"]]},
"amend":{ex:[["Let us amend clause 3.","我们来修改第3条。"]]},
"clause":{ex:[["This clause protects both sides.","这条款保护双方。"]]},
"liability":{ex:[["Liability is clearly defined.","责任界定清晰。"]]},
"penalty":{ex:[["Late delivery brings a penalty.","延迟交货会带来罚款。"]]},
"breach":{ex:[["Breach of contract is serious.","违约是严重的。"]]},
"indemnity":{ex:[["The clause covers indemnity.","该条款涵盖赔偿。"]]},
"jurisdiction":{ex:[["Jurisdiction is in Hong Kong.","管辖权在香港。"]]},
"arbitration":{ex:[["We chose arbitration.","我们选择了仲裁。"]]},
"applicable":{ex:[["These terms are applicable.","这些条款适用。"]]},
"govern":{ex:[["Local law governs this.","本地法律适用于此。"]]},
"force majeure":{ex:[["Flood is force majeure.","洪水属于不可抗力。"]]},
"display":{ex:[["Display your best products.","展示你最好的产品。"]]},
"demonstrate":{ex:[["We demonstrated the device.","我们演示了这款设备。"]]},
"visitor":{ex:[["Visitors came to our booth.","参观者来到我们的展位。"]]},
"attendee":{ex:[["Each attendee got a gift.","每位参会者都收到了礼物。"]]},
"networking":{ex:[["Networking builds relationships.","社交拓展能建立人脉。"]]},
"business card":{ex:[["Exchange business cards.","交换名片。"]]},
"introduce":{ex:[["Let me introduce our manager.","让我介绍我们的经理。"]]},
"showcase":{ex:[["Showcase new arrivals.","展示新品。"]]},
"social":{ex:[["Social skills matter in business.","社交能力在生意中很重要。"]]},
"network":{ex:[["Build your network.","建立你的人脉网络。"]]},
"connection":{ex:[["He is a useful connection.","他是个有用的人脉。"]]},
"relationship":{ex:[["Good relationship builds trust.","良好关系能建立信任。"]]},
"rapport":{ex:[["We have good rapport.","我们关系融洽。"]]},
"etiquette":{ex:[["Learn business etiquette.","学习商务礼仪。"]]},
"courtesy":{ex:[["Treat clients with courtesy.","以礼相待客户。"]]},
"small talk":{ex:[["Small talk breaks the ice.","闲聊能打破僵局。"]]},
"quarterly":{ex:[["We review results quarterly.","我们按季度复盘结果。"]]},
"annual":{ex:[["The annual report is ready.","年度报告已就绪。"]]},
"performance":{ex:[["Performance exceeded target.","绩效超过目标。"]]},
"progress":{ex:[["We track weekly progress.","我们追踪每周进展。"]]},
"result":{ex:[["The result is positive.","结果是积极的。"]]},
"improve":{ex:[["We must improve quality.","我们必须改善质量。"]]},
"interview":{ex:[["She passed the interview.","她通过了面试。"]]},
"resume":{ex:[["Attach your resume.","附上你的简历。"]]},
"experience":{ex:[["I have 5 years experience.","我有5年经验。"]]},
"strength":{ex:[["Teamwork is my strength.","团队协作是我的优势。"]]},
"weakness":{ex:[["My weakness is impatience.","我的弱点是没耐心。"]]},
"career":{ex:[["I plan my career path.","我规划我的职业道路。"]]},
"position":{ex:[["We have an open position.","我们有一个空缺职位。"]]},
"salary":{ex:[["The salary is negotiable.","薪资可协商。"]]},
"benefit":{ex:[["The job has good benefits.","这份工作福利不错。"]]},
"opportunity":{ex:[["Seize the market opportunity.","抓住市场机会。"]]},
"threat":{ex:[["We analyzed the threats.","我们分析了威胁。"]]},
"analyze":{ex:[["Analyze the data first.","先分析数据。"]]},
"implement":{ex:[["Implement the plan now.","现在执行计划。"]]},
"monitor":{ex:[["Monitor the results closely.","密切监控结果。"]]},
"adjust":{ex:[["Adjust the strategy if needed.","必要时调整策略。"]]},
"comprehensive":{ex:[["We need comprehensive training.","我们需要全面的培训。"]]},
"simulate":{ex:[["Simulate real scenarios.","模拟真实场景。"]]},
"scenario":{ex:[["In this scenario, stop selling.","在这种场景下，停止销售。"]]},
"role-play":{ex:[["We practiced role-play.","我们进行了角色扮演。"]]},
"fluency":{ex:[["Fluency comes with practice.","流利度来自练习。"]]},
"accuracy":{ex:[["Check the accuracy of data.","检查数据的准确性。"]]},
"pronunciation":{ex:[["Your pronunciation is clear.","你的发音很清晰。"]]},
"intonation":{ex:[["Use natural intonation.","用自然的语调。"]]},
"confidence":{ex:[["Confidence grows with practice.","信心随练习增长。"]]},
"proficiency":{ex:[["Reach English proficiency.","达到英语熟练度。"]]},
"graduate":{ex:[["I graduated in 2018.","我2018年毕业。"]]},
"certificate":{ex:[["He earned a certificate.","他拿到了证书。"]]},
"diploma":{ex:[["The diploma proves training.","文凭证明所受培训。"]]},
"competent":{ex:[["She is competent for the job.","她能胜任这份工作。"]]},
"specialize":{ex:[["We specialize in toys.","我们专攻玩具。"]]},
"expertise":{ex:[["He shared his expertise.","他分享了专业知识。"]]},
"career path":{ex:[["Plan a clear career path.","规划清晰的职业道路。"]]}
};
// Normalize WORD_EX keys to lowercase for case-insensitive lookup (fixes MOQ/SEO/etc.)
var WORD_EX_LOWER={};Object.keys(WORD_EX).forEach(function(k){WORD_EX_LOWER[String(k).toLowerCase()]=WORD_EX[k]});
function lookupWord(raw){var w=String(raw||'').trim().toLowerCase();if(!w)return null;var d=WORD_DICT[w];if(!d)return{notFound:true,word:String(raw||'').trim()};var ex=WORD_EX_LOWER[w]?WORD_EX_LOWER[w].ex:null;var pron=WORD_EX_LOWER[w]?WORD_EX_LOWER[w].pron:null;return{word:w,ipa:d.ipa,cn:d.cn,ex:ex,pron:pron}}
var WORD_ONLINE_CACHE={};
function wordCardHTML(r,isOnline){
 if(!r)return '';
 var uk=r.ipaUk||r.ipa||'—',us=r.ipaUs||r.ipa||'—';
 var html='';html+='<div class="ws-card">';
 html+='<div class="ws-word">'+escAttr(r.word)+'</div>';
 html+='<div class="ws-ipa">';
 html+='<div class="ws-ipa-row"><span class="ws-flag">🇬🇧 英</span><span class="ws-phon">'+escAttr(uk)+'</span><button class="vocab-speak" onclick="speakPhon(\''+escAttr(r.word)+'\',\''+escAttr(r.audioUk||'')+'\',\'en-GB\',0.8)">🔊</button></div>';
 html+='<div class="ws-ipa-row"><span class="ws-flag">🇺🇸 美</span><span class="ws-phon">'+escAttr(us)+'</span><button class="vocab-speak" onclick="speakPhon(\''+escAttr(r.word)+'\',\''+escAttr(r.audioUs||'')+'\',\'en-US\',0.85)">🔊</button></div>';
 html+='</div>';
 html+='<div class="ws-pron">🗣 <b>发音说明：</b>音标中 <b>\'</b> 表示重音位置。点击上方 🔊 试听'+(isOnline?'真人发音':'英 / 美发音')+'。'+(r.pron?'<br><b>小贴士：</b>'+escAttr(r.pron):'')+'</div>';
 html+='<div class="ws-cn">📖 <b>中文释义：</b>'+(r.cn?escAttr(r.cn):'（暂无中文释义）')+'</div>';
 if(r.ex&&r.ex.length){html+='<div class="ws-ex"><div class="ws-ex-title">💡 常用例句</div>';r.ex.forEach(function(e){html+='<div class="ws-ex-item"><div class="ws-ex-en">'+escAttr(e[0])+' <button class="vocab-speak sm" onclick="speakText(this.dataset.t,\'en-US\',0.85)" data-t="'+escAttr(e[0])+'">🔊</button></div>'+(e[1]?'<div class="ws-ex-cn">'+escAttr(e[1])+'</div>':'')+'</div>'});html+='</div>'}
 html+='</div>';return html;
}
function wsLoadingHTML(q){return '<div class="ws-loading">⏳ 正在查询「'+escAttr(q||'')+'」的释义…</div>'}
function wsErrorHTML(msg){return '<div class="ws-notfound">😕 '+escAttr(msg)+'<br>提示：可检查网络，或先试试常见商务词（订单 / 贸易 / 物流 等）。</div>'}
function renderWordResult(q){if(!q)return '';var local=lookupWord(q);if(local&&!local.notFound)return wordCardHTML(local,false);var lw=String(q).toLowerCase();var c=WORD_ONLINE_CACHE[lw];if(c&&c.status==='ok'&&c.data)return wordCardHTML(c.data,true);if(c&&c.status==='loading')return wsLoadingHTML(q);if(c&&c.status==='error')return wsErrorHTML(c.msg||'查询失败');return ''}
function doWordSearch(){var el=document.getElementById('ws-input');var v=el?el.value:'';v=v.trim();DATA._wordQuery=v;save(DATA);renderEnglish()}
function speakText(text,lang,rate){if(!('speechSynthesis'in window))return;try{var u=new SpeechSynthesisUtterance(text);u.lang=lang||'en-US';u.rate=(rate==null?0.85:rate);u.pitch=1;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function speakPhon(word,audioUrl,lang,rate){if(audioUrl){try{var a=new Audio(audioUrl);var pr=a.play();if(pr&&pr.catch){pr.catch(function(){speakText(word,lang,rate)})}return}catch(e){}}speakText(word,lang,rate)}
function fetchCn(q,result,lw){try{var url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(q)+'&langpair=en|zh-CN';fetch(url).then(function(r){return r.json()}).then(function(d){var t=d&&d.responseData&&d.responseData.translatedText;if(t&&String(t).toLowerCase()!==String(q).toLowerCase()){result.cn=t}WORD_ONLINE_CACHE[lw]={status:'ok',data:result};if(String(DATA._wordQuery||'').trim().toLowerCase()===lw){var el=document.getElementById('ws-result');if(el)el.innerHTML=wordCardHTML(result,true)}}).catch(function(){})}catch(e){}}
function fetchWordOnline(q){
  q=String(q||'').trim();
  if(!q)return;
  var lw=q.toLowerCase();
  if(WORD_ONLINE_CACHE[lw]&&WORD_ONLINE_CACHE[lw].status==='loading')return;
  WORD_ONLINE_CACHE[lw]={status:'loading'};
  var resEl=document.getElementById('ws-result');
  if(resEl)resEl.innerHTML=wsLoadingHTML(q);
  var url='https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(q);
  fetch(url).then(function(r){if(!r.ok)throw new Error('nf');return r.json()}).then(function(data){
    var entry=Array.isArray(data)?data[0]:data;
    if(!entry)throw new Error('nf');
    var uk='',us='',ukA='',usA='';
    var phs=entry.phonetics||[];
    for(var i=0;i<phs.length;i++){
      var a=phs[i].audio||'';
      var isUk=/[-_]uk\./i.test(a)||(a.indexOf('/uk/')>=0);
      var isUs=/[-_]us\./i.test(a)||(a.indexOf('/us/')>=0);
      if(isUk&&!ukA){ukA=a;if(phs[i].text)uk=phs[i].text;}
      if(isUs&&!usA){usA=a;if(phs[i].text)us=phs[i].text;}
    }
    if(!uk&&entry.phonetic)uk=entry.phonetic;
    if(!us&&entry.phonetic)us=entry.phonetic;
    if(!uk&&!us&&phs[0])uk=phs[0].text||'';
    var ex=[];
    var ms=entry.meanings||[];
    for(var m=0;m<ms.length;m++){
      var defs=ms[m].definitions||[];
      for(var n=0;n<defs.length;n++){
        if(defs[n].example&&ex.length<3)ex.push([defs[n].example,'']);
      }
    }
    var result={word:entry.word||q,ipaUk:uk,ipaUs:us,audioUk:ukA,audioUs:usA,cn:'',ex:ex,pron:''};
    WORD_ONLINE_CACHE[lw]={status:'ok',data:result};
    fetchCn(q,result,lw);
    if(String(DATA._wordQuery||'').trim().toLowerCase()===lw){
      var el=document.getElementById('ws-result');
      if(el)el.innerHTML=wordCardHTML(result,true);
    }
  }).catch(function(){
    WORD_ONLINE_CACHE[lw]={status:'error',msg:'没找到「'+q+'」的释义，可能是拼写有误或较生僻。'};
    if(String(DATA._wordQuery||'').trim().toLowerCase()===lw){
      var el=document.getElementById('ws-result');
      if(el)el.innerHTML=wsErrorHTML('没找到「'+q+'」的释义，可能是拼写有误或较生僻。');
    }
  });
}
/* ===== 音标本音合成引擎 (Web Audio API, 离线可用) ===== */
var _ac=null,_noiseBuf=null;
var PHON={
'iː':{t:'v',f:[270,2300,3000],d:0.55},'ɪ':{t:'v',f:[400,2000,2550],d:0.3},'e':{t:'v',f:[530,1850,2500],d:0.35},'æ':{t:'v',f:[660,1700,2400],d:0.35},
'ɜː':{t:'v',f:[500,1500,2500],d:0.55},'ə':{t:'v',f:[500,1500,2500],d:0.3},'ʌ':{t:'v',f:[640,1200,2550],d:0.3},'ɑː':{t:'v',f:[730,1100,2500],d:0.55},
'ɒ':{t:'v',f:[570,900,2400],d:0.3},'ɔː':{t:'v',f:[570,840,2410],d:0.55},'ʊ':{t:'v',f:[440,1020,2240],d:0.3},'uː':{t:'v',f:[300,870,2240],d:0.55},
'eɪ':{t:'d',f:[530,1900,2500],g:[400,2300],d:0.5},'aɪ':{t:'d',f:[730,1100,2500],g:[400,2300],d:0.5},'ɔɪ':{t:'d',f:[570,840,2410],g:[400,2300],d:0.5},
'aʊ':{t:'d',f:[730,1100,2500],g:[440,1020],d:0.5},'əʊ':{t:'d',f:[500,1100,2500],g:[300,870],d:0.5},'ɪə':{t:'d',f:[400,2000,2550],g:[500,1500],d:0.5},
'eə':{t:'d',f:[530,1850,2500],g:[500,1500],d:0.5},'ʊə':{t:'d',f:[440,1020,2240],g:[500,1500],d:0.5},
'p':{t:'p',c:1000,q:0.7,v:false,d:0.18},'t':{t:'p',c:4000,q:2,v:false,d:0.18},'k':{t:'p',c:2000,q:2,v:false,d:0.18},
'b':{t:'p',c:1000,q:0.7,v:true,d:0.24},'d':{t:'p',c:4000,q:2,v:true,d:0.24},'g':{t:'p',c:2000,q:2,v:true,d:0.24},
'f':{t:'n',c:6500,q:0.7,v:false,d:0.3},'θ':{t:'n',c:7500,q:0.7,v:false,d:0.3},'s':{t:'n',c:6500,q:6,v:false,d:0.3},
'ʃ':{t:'n',c:3500,q:3,v:false,d:0.3},'h':{t:'n',c:1200,q:0.5,v:false,d:0.25},
'v':{t:'n',c:5000,q:0.7,v:true,d:0.32},'ð':{t:'n',c:6000,q:0.7,v:true,d:0.32},'z':{t:'n',c:6000,q:5,v:true,d:0.32},'ʒ':{t:'n',c:3300,q:3,v:true,d:0.32},
'm':{t:'voice',c:250,d:0.4},'n':{t:'voice',c:350,d:0.4},'ŋ':{t:'voice',c:300,d:0.4},'l':{t:'voice',c:1500,d:0.4},
'r':{t:'voice',c:1200,d:0.4},'w':{t:'voice',c:700,d:0.4},'j':{t:'voice',c:2200,d:0.4},
'tʃ':{t:'aff',p:['t','ʃ']},'ts':{t:'aff',p:['t','s']},'tr':{t:'aff',p:['t','r']},
'dʒ':{t:'vaff',p:['d','ʒ']},'dr':{t:'vaff',p:['d','r']},'dz':{t:'vaff',p:['d','z']}
};
function getAC(){if(!_ac){try{_ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){_ac=null;}}if(_ac&&_ac.state==='suspended'){try{_ac.resume();}catch(e){}}return _ac;}
function noiseBuf(ac){if(_noiseBuf)return _noiseBuf;var len=Math.floor(ac.sampleRate*1.2);var b=ac.createBuffer(1,len,ac.sampleRate);var d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;_noiseBuf=b;return b;}
function buzzOsc(ac,f){var o=ac.createOscillator();o.type='sawtooth';o.frequency.value=f;return o;}
function pEnv(param,ac,t0,dur,peak){param.setValueAtTime(0.0001,t0);param.linearRampToValueAtTime(peak,t0+Math.max(0.02,dur*0.15));param.setValueAtTime(peak,t0+dur*0.7);param.linearRampToValueAtTime(0.0001,t0+dur);}
function synthVowel(ac,t0,F1,F2,F3,dur,glide){var o=buzzOsc(ac,120);var out=ac.createGain();pEnv(out.gain,ac,t0,dur,0.5);out.connect(ac.destination);var starts=[F1,F2,F3];var bps=starts.map(function(f){var bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f;bp.Q.value=10;var g=ac.createGain();g.gain.value=0.5;o.connect(bp);bp.connect(g);g.connect(out);return bp;});if(glide){var ends=[glide[0],glide[1],F3];bps.forEach(function(bp,i){bp.frequency.setValueAtTime(starts[i],t0);bp.frequency.linearRampToValueAtTime(ends[i],t0+dur);});}o.start(t0);o.stop(t0+dur+0.06);}
function synthNoise(ac,t0,center,q,dur,voiced){var d=voiced?dur:Math.min(dur,0.32);var src=ac.createBufferSource();src.buffer=noiseBuf(ac);src.loop=true;var bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=center;bp.Q.value=q;var g=ac.createGain();pEnv(g.gain,ac,t0,d,voiced?0.22:0.5);src.connect(bp);bp.connect(g);g.connect(ac.destination);if(voiced){var o=buzzOsc(ac,110);var lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1600;var og=ac.createGain();pEnv(og.gain,ac,t0,d,0.3);o.connect(lp);lp.connect(og);og.connect(g);o.start(t0);o.stop(t0+d+0.06);}src.start(t0);src.stop(t0+d+0.06);}
function synthVoice(ac,t0,cutoff,dur){var o=buzzOsc(ac,120);var lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=cutoff;var g=ac.createGain();pEnv(g.gain,ac,t0,dur,0.5);o.connect(lp);lp.connect(g);g.connect(ac.destination);o.start(t0);o.stop(t0+dur+0.06);}
function synthPlosive(ac,t0,burstCenter,burstQ,dur,voiced){if(voiced){var o=buzzOsc(ac,110);var og=ac.createGain();pEnv(og.gain,ac,t0,0.06,0.4);o.connect(og);og.connect(ac.destination);o.start(t0);o.stop(t0+0.08);}var bStart=t0+(voiced?0.07:0.04);var bDur=0.09;var src=ac.createBufferSource();src.buffer=noiseBuf(ac);src.loop=true;var f=ac.createBiquadFilter();if(burstCenter>1500){f.type='bandpass';f.frequency.value=burstCenter;f.Q.value=burstQ;}else{f.type='lowpass';f.frequency.value=burstCenter;}var g=ac.createGain();g.gain.setValueAtTime(0.0001,bStart);g.gain.linearRampToValueAtTime(0.6,bStart+0.005);g.gain.exponentialRampToValueAtTime(0.001,bStart+bDur);src.connect(f);f.connect(g);g.connect(ac.destination);src.start(bStart);src.stop(bStart+bDur+0.03);}
function synthPhoneme(ac,key,t0){var c=PHON[key];if(!c)return;if(c.t==='v'){synthVowel(ac,t0,c.f[0],c.f[1],c.f[2],c.d);}else if(c.t==='d'){synthVowel(ac,t0,c.f[0],c.f[1],c.f[2],c.d,c.g);}else if(c.t==='p'){synthPlosive(ac,t0,c.c,c.q,c.d,c.v);}else if(c.t==='n'){synthNoise(ac,t0,c.c,c.q,c.d,c.v);}else if(c.t==='voice'){synthVoice(ac,t0,c.c,c.d);}else if(c.t==='aff'||c.t==='vaff'){synthPhoneme(ac,c.p[0],t0);synthPhoneme(ac,c.p[1],t0+0.08);}}
var IPHONE_FILE={
'iː':'Vow-00a.mp3','ɜː':'Vow-18a.mp3','ɔː':'Vow-21a.mp3','uː':'Vow-05a.mp3','ɑː':'Vow-26a.mp3',
'ɪ':'Vow-06a.mp3','e':'Vow-09a.mp3','æ':'Vow-22a.mp3','ʌ':'Vow-20a.mp3','ɒ':'Vow-27a.mp3','ʊ':'Vow-08a.mp3','ə':'Vow-15a.mp3',
'eɪ':['Vow-09a.mp3','Vow-06a.mp3'],'aɪ':['Vow-24a.mp3','Vow-06a.mp3'],'ɔɪ':['Vow-21a.mp3','Vow-06a.mp3'],'aʊ':['Vow-24a.mp3','Vow-08a.mp3'],'əʊ':['Vow-15a.mp3','Vow-08a.mp3'],'ɪə':['Vow-06a.mp3','Vow-15a.mp3'],'eə':['Vow-09a.mp3','Vow-15a.mp3'],'ʊə':['Vow-08a.mp3','Vow-15a.mp3'],
'p':'p.mp3','t':'t.mp3','k':'Con-08a.mp3','f':'Con-27a.mp3','θ':'Con-29a.mp3','s':'Con-31a.mp3','ʃ':'Con-33a.mp3','tʃ':['t.mp3','Con-33a.mp3'],'tr':['t.mp3','rtrill.mp3'],'ts':['t.mp3','Con-31a.mp3'],'h':'Con-45a.mp3',
'b':'b.mp3','d':'d.mp3','g':'Con-09a.mp3','v':'Con-28a.mp3','ð':'Con-30a.mp3','z':'Con-32a.mp3','ʒ':'Con-34a.mp3','dʒ':['d.mp3','Con-34a.mp3'],'dr':['d.mp3','rtrill.mp3'],'dz':['d.mp3','Con-32a.mp3'],
'm':'m.mp3','n':'n.mp3','ŋ':'Con-18a.mp3','l':'Con-54a.mp3','r':'rtrill.mp3','w':'Con-53a.mp3','j':'Con-52a.mp3'};
function playFileSeq(files,idx,done){if(idx>=files.length){if(done)done(null);return;}var name=files[idx];var localSrc='audio/'+name;var onlineSrc='https://cdn.jsdelivr.net/gh/jacksonvanv/IPAchart/Audio/'+encodeURIComponent(name);function tryPlay(src,onFail){var a=new Audio();a.preload='auto';var fin=false;function cl(){a.removeEventListener('ended',onEnd);a.removeEventListener('error',onErr);}function onEnd(){if(fin)return;fin=true;cl();playFileSeq(files,idx+1,done);}function onErr(){if(fin)return;fin=true;cl();onFail();}a.addEventListener('ended',onEnd);a.addEventListener('error',onErr);a.src=src;var pr=a.play();if(pr&&pr.catch){pr.catch(function(){if(!fin){fin=true;cl();onFail();}});}setTimeout(function(){if(!fin){fin=true;cl();onFail();}},4000);}tryPlay(localSrc,function(){tryPlay(onlineSrc,function(){if(done)done(new Error('err'));});});}
function synthFallback(key,word){var ac=getAC();if(ac&&PHON[key]){try{synthPhoneme(ac,key,ac.currentTime+0.03);}catch(e){if(word)speakText(word,'en-US',0.8);}}else if(word){speakText(word,'en-US',0.8);}}
function playPhoneme(sym,word){var key=String(sym).replace(/\//g,'');var f=IPHONE_FILE[key];if(f&&typeof Audio!=='undefined'){var files=Array.isArray(f)?f:[f];playFileSeq(files,0,function(err){if(err)synthFallback(key,word);});return;}synthFallback(key,word);}
var ENG_COURSE=[

  {"phase":"🌱 生活起步","title":"你好，世界：打招呼与问候","desc":"从最简单的日常问候开始，学会用英语说你好、谢谢、再见","sentences":[{"en":"Hello! My name is Xiaoyu.","cn":"你好！我的名字是小雨。"},{"en":"How are you today?","cn":"你今天好吗？"},{"en":"I am fine, thank you.","cn":"我很好，谢谢。"},{"en":"See you tomorrow!","cn":"明天见！"}],"grammar":{"title":"be 动词 (am/is/are)","rule":"I 用 am，you/we/they 用 are，he/she/it 用 is。这是最基础的英语句子骨架。","ex":"I am Xiaoyu. / You are my friend. / She is happy."},"reading":{"title":"A Friendly Greeting","text":"Every morning, Xiaoyu says hello to her neighbor. 'Good morning! How are you?' she asks. The neighbor smiles and says, 'I am fine, thank you. And you?' Small greetings make a big difference in our day.","q":"What does Xiaoyu say to her neighbor every morning?"},"quiz":[{"type":"choice","q":"Which is a correct greeting?","opts":["Hello!","Goodbye!","Thank you!","Sorry!"],"ans":0,"analysis":"Hello! 是最常用的打招呼用语。"},{"type":"choice","q":"'How are you?' means:","opts":["你叫什么名字？","你好吗？","谢谢","再见"],"ans":1,"analysis":"How are you? = 你好吗？/ 你怎么样？"},{"type":"fill","q":"My name ___ Xiaoyu. (填 be 动词)","ans":"is","analysis":"My name 是第三人称单数，be 动词用 is。"}]},
  {"phase":"🌱 生活起步","title":"一日三餐与常见食物","desc":"学习早餐、午餐、晚餐和常见食物的英文表达","sentences":[{"en":"I eat breakfast at 7 o'clock.","cn":"我七点吃早餐。"},{"en":"We have rice and vegetables for lunch.","cn":"我们午餐吃米饭和蔬菜。"},{"en":"My favorite food is noodles.","cn":"我最喜欢的食物是面条。"},{"en":"Would you like some fruit?","cn":"你想来点水果吗？"}],"grammar":{"title":"可数与不可数名词","rule":"食物分可数(rice 不可数, apple 可数)。some 可用于肯定句的复数或不可数名词。","ex":"some rice / some apples / some water"},"reading":{"title":"A Simple Family Dinner","text":"Tonight, the family eats dinner together. There is rice, chicken, and green vegetables on the table. The child says, 'I like the chicken!' The mother smiles. Eating together is a happy time for the family.","q":"What food does the child like?"},"quiz":[{"type":"choice","q":"What do we eat in the morning?","opts":["Breakfast","Lunch","Dinner","Supper"],"ans":0,"analysis":"早上吃的是早餐 breakfast。"},{"type":"choice","q":"'My favorite food is noodles' means:","opts":["我讨厌面条","我最喜欢的食物是面条","我会做面条","面条很贵"],"ans":1,"analysis":"favorite = 最喜欢的。"},{"type":"fill","q":"We have rice ___ vegetables for lunch.","ans":"and","analysis":"and 连接两个并列名词。"}]},
  {"phase":"🌱 生活起步","title":"喝水、喝茶与点一杯饮料","desc":"学习常见饮品名称，以及在点单时如何礼貌表达","sentences":[{"en":"I would like a cup of tea, please.","cn":"我想要一杯茶，谢谢。"},{"en":"Do you want milk or coffee?","cn":"你想要牛奶还是咖啡？"},{"en":"Water is good for our health.","cn":"水对我们的健康有益。"},{"en":"Can I have a glass of orange juice?","cn":"我能来一杯橙汁吗？"}],"grammar":{"title":"Would like / Can I have","rule":"Would like = 想要（礼貌）；Can I have...? = 我能要...吗？（点单常用）","ex":"I would like some water. / Can I have a coffee?"},"reading":{"title":"At the Cafe","text":"Xiaoyu walks into a small cafe. 'Can I help you?' the barista asks. 'I would like a cup of green tea, please,' she says. 'Sure, that will be 12 yuan.' She pays and sits by the window, enjoying her warm drink.","q":"What does Xiaoyu order at the cafe?"},"quiz":[{"type":"choice","q":"To order politely, you can say:","opts":["Give me tea","I would like a tea","Tea now","Hurry up tea"],"ans":1,"analysis":"I would like... 是礼貌点单表达。"},{"type":"choice","q":"'A glass of orange juice' is:","opts":["一杯橙汁","一瓶水","一碗饭","一块蛋糕"],"ans":0,"analysis":"a glass of orange juice = 一杯橙汁。"},{"type":"fill","q":"Can I ___ a glass of water? (填动词)","ans":"have","analysis":"Can I have...? 我能要...吗？"}]},
  {"phase":"🌱 生活起步","title":"今天穿什么：衣服与天气","desc":"学习常见衣物名称，并能根据天气说该穿什么","sentences":[{"en":"It is cold today, wear a coat.","cn":"今天冷，穿件外套。"},{"en":"She puts on a red dress.","cn":"她穿上一条红裙子。"},{"en":"My shoes are new and comfortable.","cn":"我的鞋是新的，很舒服。"},{"en":"It is sunny, let's go outside.","cn":"天气晴朗，我们出去吧。"}],"grammar":{"title":"祈使句 (Imperative)","rule":"用动词原形开头表示命令或建议，省略主语 you。","ex":"Wear a coat. / Open the door. / Sit down."},"reading":{"title":"Getting Dressed","text":"The weather is cold and windy. Xiaoyu's mother says, 'Put on your sweater and a warm coat.' The little girl picks a blue coat. 'Now you look ready for the wind!' her mother laughs.","q":"What does the mother tell the girl to wear?"},"quiz":[{"type":"choice","q":"'Wear a coat' is a:","opts":["疑问句","祈使句","感叹句","陈述句"],"ans":1,"analysis":"Wear a coat 是动词原形开头，祈使句。"},{"type":"choice","q":"When it is cold, you should:","opts":["wear a coat","wear a T-shirt","go swimming","open the window"],"ans":0,"analysis":"冷的时候应该穿外套。"},{"type":"fill","q":"It is ___ today, wear a coat. (填天气形容词)","ans":"cold","analysis":"cold = 冷的。"}]},
  {"phase":"🌱 生活起步","title":"我的家：房间与家具","desc":"学习家、房间、常见家具的英文，能描述自己的家","sentences":[{"en":"This is my home, it is small but warm.","cn":"这是我的家，虽小但很温暖。"},{"en":"There is a bed and a desk in my room.","cn":"我房间里有一张床和一张书桌。"},{"en":"We watch TV in the living room.","cn":"我们在客厅看电视。"},{"en":"The kitchen is clean and tidy.","cn":"厨房干净又整洁。"}],"grammar":{"title":"There is / There are","rule":"there is + 单数或不可数；there are + 复数。表示'某处有某物'。","ex":"There is a bed. / There are two chairs."},"reading":{"title":"A Cozy Little Home","text":"Xiaoyu lives in a small apartment. There is a bedroom, a living room, and a kitchen. In the living room, there is a soft sofa and a big TV. She loves reading books on the sofa in the evening.","q":"What is in the living room?"},"quiz":[{"type":"choice","q":"'There is a bed' uses:","opts":["there are","there is","they are","it is"],"ans":1,"analysis":"单数用 there is。"},{"type":"choice","q":"Where do we usually watch TV?","opts":["kitchen","bedroom","living room","bathroom"],"ans":2,"analysis":"通常在客厅 living room 看电视。"},{"type":"fill","q":"There ___ a desk in my room. (填 be 动词)","ans":"is","analysis":"a desk 单数，用 is。"}]},
  {"phase":"🌱 生活起步","title":"出门去：交通方式","desc":"学习走路、公交、地铁、打车等出行方式的英文","sentences":[{"en":"I go to work by bus every day.","cn":"我每天坐公交上班。"},{"en":"Let's walk to the park, it is near.","cn":"我们走到公园吧，很近。"},{"en":"The subway is fast and cheap.","cn":"地铁又快又便宜。"},{"en":"Please call a taxi for me.","cn":"请帮我叫一辆出租车。"}],"grammar":{"title":"by + 交通工具","rule":"by bus / by subway / by car 表示'乘...'。步行是 on foot 或 walk。","ex":"by bus / by train / walk to school"},"reading":{"title":"Going to the Park","text":"It is a sunny Saturday. The family wants to go to the park. The park is not far, so they decide to walk. The child rides a small bike beside them. 'Look, we are almost there!' the father says happily.","q":"How does the family go to the park?"},"quiz":[{"type":"choice","q":"'by bus' means:","opts":["走路","坐公交","骑车","开车"],"ans":1,"analysis":"by bus = 乘坐公交车。"},{"type":"choice","q":"The subway is:","opts":["slow and expensive","fast and cheap","small and old","new and far"],"ans":1,"analysis":"地铁 fast and cheap 又快又便宜。"},{"type":"fill","q":"Let's ___ to the park. (填动词)","ans":"walk","analysis":"walk = 走路/步行。"}]},
  {"phase":"🌱 生活起步","title":"第一周复习与自测","desc":"复习本周生活英语：问候、食物、饮品、穿衣、家、出行","sentences":[{"en":"Let me review what we learned this week.","cn":"让我复习一下这周学的内容。"},{"en":"I can say hello, eat, and go out in English now.","cn":"我现在能用英语说你好、吃饭和出门了。"},{"en":"Practice a little every day.","cn":"每天练习一点点。"},{"en":"I am proud of my progress.","cn":"我为自己的进步感到骄傲。"}],"grammar":{"title":"复习：be 动词与 there is/are","rule":"I am / you are / he is；there is 单数，there are 复数。","ex":"I am happy. / There are two rooms."},"reading":{"title":"Week One Review","text":"This week we learned daily-life English: greetings, food, drinks, clothing, home, and transportation. These are things we use every day. Say them out loud and practice a little each day. Confidence comes from small steps.","q":"What did we learn this week?"},"quiz":[{"type":"choice","q":"Which is a greeting?","opts":["Hello!","Eat rice.","Walk now.","Open it."],"ans":0,"analysis":"Hello! 是问候。"},{"type":"choice","q":"'There are two chairs' uses:","opts":["there is","there are","it is","they is"],"ans":1,"analysis":"复数用 there are。"},{"type":"fill","q":"I ___ fine, thank you. (填 be 动词)","ans":"am","analysis":"I 搭配 am。"}]},
  {"phase":"🌿 认识自己","title":"说说我自己：自我介绍","desc":"学会用英语介绍自己的名字、年龄、喜好","sentences":[{"en":"I am 28 years old.","cn":"我28岁。"},{"en":"I like reading books and cooking.","cn":"我喜欢读书和做饭。"},{"en":"I am a mother of a lovely child.","cn":"我是一个可爱孩子的妈妈。"},{"en":"Nice to meet you!","cn":"很高兴认识你！"}],"grammar":{"title":"like + 动词ing","rule":"like doing sth = 喜欢做某事。like 后接名词或动词-ing。","ex":"I like reading. / She likes singing."},"reading":{"title":"Meeting a New Friend","text":"At a community class, Xiaoyu meets a new friend. 'Hi, I am Xiaoyu. I am 28 and I like cooking,' she says. The friend smiles, 'I am Lin. I like reading too!' They become friends quickly.","q":"What does Xiaoyu say about herself?"},"quiz":[{"type":"choice","q":"'I like reading' means:","opts":["我喜欢读书","我会读书","我讨厌读书","我每天读书"],"ans":0,"analysis":"like reading = 喜欢读书。"},{"type":"choice","q":"To introduce your age, you say:","opts":["I am 28 year old.","I am 28 years old.","I have 28 years.","I 28 years."],"ans":1,"analysis":"正确：I am 28 years old."},{"type":"fill","q":"I ___ a mother of a lovely child. (填 be 动词)","ans":"am","analysis":"I 用 am。"}]},
  {"phase":"🌿 认识自己","title":"我的家人","desc":"学习父母、孩子、兄弟姐妹等家庭成员的英文","sentences":[{"en":"This is my husband and my son.","cn":"这是我的丈夫和儿子。"},{"en":"My mother cooks delicious food.","cn":"我妈妈做菜很好吃。"},{"en":"We love our family very much.","cn":"我们非常爱我们的家。"},{"en":"My father reads stories to the child.","cn":"我爸爸给孩子读故事。"}],"grammar":{"title":"物主代词 (my/your/his/her)","rule":"my 我的, your 你的, his 他的, her 她的。放在名词前表示所属。","ex":"my mother / your book / his car"},"reading":{"title":"A Happy Family","text":"Xiaoyu's family is small but happy. There are four people: her, her husband, her son, and her mother who lives with them. Every evening, they eat dinner together and talk about the day. The son laughs a lot.","q":"How many people are in Xiaoyu's family?"},"quiz":[{"type":"choice","q":"'my mother' means:","opts":["我的妈妈","你的妈妈","她的妈妈","他的妈妈"],"ans":0,"analysis":"my = 我的。"},{"type":"choice","q":"Who cooks delicious food in the story?","opts":["the son","the father","the mother","the husband"],"ans":2,"analysis":"妈妈做菜好吃。"},{"type":"fill","q":"This is ___ husband. (填物主代词'我的')","ans":"my","analysis":"my = 我的。"}]},
  {"phase":"🌿 认识自己","title":"陪孩子长大：亲子日常","desc":"学习用英语描述陪孩子吃饭、玩耍、读故事等日常","sentences":[{"en":"I feed my baby and sing a song.","cn":"我喂宝宝吃饭，还唱一首歌。"},{"en":"We play with blocks together.","cn":"我们一起搭积木。"},{"en":"The child learns to say 'thank you'.","cn":"孩子学着说'谢谢'。"},{"en":"Bedtime is at 9 o'clock.","cn":"九点是睡觉时间。"}],"grammar":{"title":"一般现在时 (第三人称单数)","rule":"he/she/it 作主语，动词加 s/es。The child plays. / She eats.","ex":"The baby sleeps. / He reads a book."},"reading":{"title":"A Quiet Evening","text":"After dinner, Xiaoyu plays with her son. They build a tall tower with blocks. Then she reads him a short story. 'Good night, my little star,' she says, and turns off the light. The room becomes quiet.","q":"What do they do after dinner?"},"quiz":[{"type":"choice","q":"'The child plays' — why add 's' to play?","opts":["因为是复数","因为主语是第三人称单数","因为是过去","因为是疑问"],"ans":1,"analysis":"child 是第三人称单数，动词加 s。"},{"type":"choice","q":"What do they build with blocks?","opts":["a car","a tower","a house","a book"],"ans":1,"analysis":"搭了一座高塔 tower。"},{"type":"fill","q":"She ___ a story to her son. (填动词 read 的三单)","ans":"reads","analysis":"she 三单，read 加 s → reads。"}]},
  {"phase":"🌿 认识自己","title":"我的一天：日常作息","desc":"学习起床、洗脸、做饭、睡觉等日常活动的英文","sentences":[{"en":"I get up at 6:30 in the morning.","cn":"我早上6点半起床。"},{"en":"She brushes her teeth after meals.","cn":"她饭后刷牙。"},{"en":"We have dinner at 7 pm.","cn":"我们晚上7点吃晚饭。"},{"en":"He goes to bed early.","cn":"他睡得早。"}],"grammar":{"title":"频率副词 (always/usually/often)","rule":"放在动词前(be动词后)表示频率：always总, usually通常, often经常, sometimes有时。","ex":"I usually get up at 7. / She always smiles."},"reading":{"title":"A Mother's Day","text":"Xiaoyu's day starts early. She gets up at 6:30, makes breakfast, and wakes her son. After sending him to kindergarten, she cleans the home and plans her small business. In the evening, she plays with her son again. Busy but full.","q":"What does Xiaoyu do after sending her son to kindergarten?"},"quiz":[{"type":"choice","q":"'I get up at 6:30' is about:","opts":["起床","睡觉","吃饭","刷牙"],"ans":0,"analysis":"get up = 起床。"},{"type":"choice","q":"'usually' means:","opts":["总是","通常","从不","有时"],"ans":1,"analysis":"usually = 通常。"},{"type":"fill","q":"She brushes ___ teeth after meals. (填物主代词'她的')","ans":"her","analysis":"her = 她的。"}]},
  {"phase":"🌿 认识自己","title":"去超市买东西","desc":"学习购物时的常用句：多少钱、我要这个、太贵了","sentences":[{"en":"How much is this apple?","cn":"这个苹果多少钱？"},{"en":"I want to buy some milk.","cn":"我想买些牛奶。"},{"en":"It is too expensive, I will think about it.","cn":"太贵了，我再想想。"},{"en":"Here is the money, thank you.","cn":"给你钱，谢谢。"}],"grammar":{"title":"How much + 不可数/单数","rule":"问价格用 How much is...?（单数/不可数）；How many + 复数。","ex":"How much is the book? / How many apples?"},"reading":{"title":"At the Supermarket","text":"Xiaoyu goes to the supermarket with her son. She picks fresh vegetables, a bottle of milk, and some fruit. At the checkout, she asks, 'How much is it?' The cashier says, 'Fifty-eight yuan.' She pays and leaves with a full bag.","q":"What does she buy at the supermarket?"},"quiz":[{"type":"choice","q":"To ask the price, you say:","opts":["How much is it?","What is it?","Where is it?","Who is it?"],"ans":0,"analysis":"How much is it? 问价格。"},{"type":"choice","q":"'too expensive' means:","opts":["太便宜","太贵","正好","免费"],"ans":1,"analysis":"too expensive = 太贵了。"},{"type":"fill","q":"I want to ___ some milk. (填动词)","ans":"buy","analysis":"buy = 买。"}]},
  {"phase":"🌿 认识自己","title":"我的心情：情绪表达","desc":"学习开心、累、难过、生气等情绪的英文表达","sentences":[{"en":"I feel happy when my son laughs.","cn":"儿子笑的时候我很开心。"},{"en":"She is tired after a long day.","cn":"忙了一整天后她很累。"},{"en":"Don't be angry, let's talk.","cn":"别生气，我们聊聊。"},{"en":"I am a little sad today.","cn":"我今天有点难过。"}],"grammar":{"title":"feel + 形容词","rule":"feel + 形容词 表示'感觉...'。I feel happy/tired/sad.","ex":"He feels tired. / They feel excited."},"reading":{"title":"A Rough But Soft Day","text":"Xiaoyu feels tired today. The baby cried a lot and the house is messy. But in the evening, her son hugs her and says, 'Mom, I love you.' Suddenly she feels happy again. Small love makes a hard day soft.","q":"Why does she feel happy again in the evening?"},"quiz":[{"type":"choice","q":"'I feel happy' is:","opts":["我感觉开心","我很累","我生气","我生病"],"ans":0,"analysis":"feel happy = 感觉开心。"},{"type":"choice","q":"When the baby cries a lot, the mother feels:","opts":["happy","excited","tired","angry always"],"ans":2,"analysis":"孩子一直哭，妈妈会累 tired。"},{"type":"fill","q":"Don't be ___, let's talk. (填'生气')","ans":"angry","analysis":"angry = 生气的。"}]},
  {"phase":"🌿 认识自己","title":"第二周复习与自测","desc":"复习本周：自我介绍、家人、亲子、作息、购物、情绪","sentences":[{"en":"Let me check what we practiced this week.","cn":"让我看看这周练习了什么。"},{"en":"I can talk about my family and my day now.","cn":"我现在能聊我的家和我的一天了。"},{"en":"English is not so hard!","cn":"英语其实没那么难！"},{"en":"Keep going, one small step each day.","cn":"继续加油，每天一小步。"}],"grammar":{"title":"复习：like/三单/How much","rule":"like doing；三单加 s；问价格 How much is...?","ex":"She likes music. / How much is it?"},"reading":{"title":"Two Weeks of Growth","text":"In two weeks, we moved from saying 'hello' to talking about family, children, daily life, shopping, and feelings. You did not need a degree — just a little courage and daily practice. Next, we will slowly add a few useful words for your small business.","q":"What will we add next?"},"quiz":[{"type":"choice","q":"'She likes music' — why 'likes'?","opts":["复数","三单","过去","疑问"],"ans":1,"analysis":"she 三单，like 加 s。"},{"type":"choice","q":"To ask price you use:","opts":["How many","How much","What color","Where"],"ans":1,"analysis":"问价格用 How much。"},{"type":"fill","q":"I ___ talk about my family now. (填 can 的肯定)","ans":"can","analysis":"can = 能/会。"}]}
];
// Chinese annotations for ENG_COURSE grammar & reading
var ENG_CN=[

  {"cnEx":"我是小雨。/ 你今天好吗？/ 我很好，谢谢。/ 明天见！","cnText":"每天早晨，小雨都会和邻居打招呼。'早上好！你好吗？'她问。邻居微笑着说：'我很好，谢谢。你呢？'小小的问候能让我们的一天变得不同。","cnQ":"小雨每天早上对邻居说什么？"},
  {"cnEx":"我七点吃早餐。/ 我们午餐吃米饭和蔬菜。/ 我最喜欢的食物是面条。/ 你想来点水果吗？","cnText":"今晚，一家人一起吃晚饭。桌上有米饭、鸡肉和青菜。孩子说：'我喜欢鸡肉！'妈妈笑了。一起吃晚饭是家里开心的时刻。","cnQ":"孩子喜欢什么食物？"},
  {"cnEx":"我想要一杯茶，谢谢。/ 你想要牛奶还是咖啡？/ 水对我们的健康有益。/ 我能来一杯橙汁吗？","cnText":"小雨走进一家小咖啡馆。'需要帮助吗？'咖啡师问。'我想要一杯绿茶，谢谢。'她说。'好的，12元。'她付了钱，坐在窗边享受温热的饮品。","cnQ":"小雨在咖啡馆点了什么？"},
  {"cnEx":"今天冷，穿件外套。/ 她穿上一条红裙子。/ 我的鞋是新的，很舒服。/ 天气晴朗，我们出去吧。","cnText":"天气又冷又有风。小雨的妈妈说：'穿上你的毛衣和暖和的外套。'小女孩选了一件蓝色外套。'现在你看起来不怕风了！'妈妈笑着说。","cnQ":"妈妈让女孩穿什么？"},
  {"cnEx":"这是我的家，虽小但很温暖。/ 我房间里有一张床和一张书桌。/ 我们在客厅看电视。/ 厨房干净又整洁。","cnText":"小雨住在一间小公寓里。有一个卧室、一个客厅和一个厨房。客厅里有一张软沙发和一台大电视。她喜欢晚上在沙发上读书。","cnQ":"客厅里有什么？"},
  {"cnEx":"我每天坐公交上班。/ 我们走到公园吧，很近。/ 地铁又快又便宜。/ 请帮我叫一辆出租车。","cnText":"一个晴朗的周六，一家人想去公园。公园不远，所以他们决定走路去。孩子骑着小自行车跟在旁边。'看，我们快到了！'爸爸开心地说。","cnQ":"这家人怎么去公园？"},
  {"cnEx":"让我复习一下这周学的内容。/ 我现在能用英语说你好、吃饭和出门了。/ 每天练习一点点。/ 我为自己的进步感到骄傲。","cnText":"这周我们学了生活英语：问候、食物、饮品、穿衣、家、出行。这些都是我们每天用得到的东西。大声说出来，每天练一点。自信来自一小步一小步。","cnQ":"这周我们学了什么？"},
  {"cnEx":"我28岁。/ 我喜欢读书和做饭。/ 我是一个可爱孩子的妈妈。/ 很高兴认识你！","cnText":"在社区课堂上，小雨认识了一位新朋友。'嗨，我是小雨。我28岁，喜欢做饭。'她说。朋友微笑：'我是林，我也喜欢读书！'她们很快成了朋友。","cnQ":"小雨怎么介绍自己？"},
  {"cnEx":"这是我的丈夫和儿子。/ 我妈妈做菜很好吃。/ 我们非常爱我们的家。/ 我爸爸给孩子读故事。","cnText":"小雨的家虽小却很幸福。有四口人：她、丈夫、儿子，还有同住的妈妈。每天晚上，他们一起吃晚饭、聊当天的事。儿子笑得很欢。","cnQ":"小雨家有几口人？"},
  {"cnEx":"我喂宝宝吃饭，还唱一首歌。/ 我们一起搭积木。/ 孩子学着说'谢谢'。/ 九点是睡觉时间。","cnText":"晚饭后，小雨和儿子玩。他们用积木搭了一座高塔。然后她给儿子读一个短故事。'晚安，我的小星星。'她关了灯。房间安静下来。","cnQ":"晚饭后他们做什么？"},
  {"cnEx":"我早上6点半起床。/ 她饭后刷牙。/ 我们晚上7点吃晚饭。/ 他睡得早。","cnText":"小雨的一天开始得很早。她6:30起床，做早餐，叫醒儿子。送他去幼儿园后，她打扫房间、规划自己的小生意。晚上再陪儿子玩。忙但充实。","cnQ":"送儿子去幼儿园后，小雨做什么？"},
  {"cnEx":"这个苹果多少钱？/ 我想买些牛奶。/ 太贵了，我再想想。/ 给你钱，谢谢。","cnText":"小雨带着儿子去超市。她挑了新鲜蔬菜、一瓶牛奶和一些水果。结账时她问：'多少钱？'收银员说：'58元。'她付了钱，提着满满一袋离开。","cnQ":"她在超市买了什么？"},
  {"cnEx":"儿子笑的时候我很开心。/ 忙了一整天后她很累。/ 别生气，我们聊聊。/ 我今天有点难过。","cnText":"小雨今天觉得累。宝宝哭了好久，家里乱糟糟。但晚上，儿子抱着她说：'妈妈，我爱你。'她突然又开心了。小小的爱能让难熬的一天变柔软。","cnQ":"为什么晚上她又开心了？"},
  {"cnEx":"让我看看这周练习了什么。/ 我现在能聊我的家和我的一天了。/ 英语其实没那么难！/ 继续加油，每天一小步。","cnText":"两周里，我们从说'hello'到聊家人、孩子、日常、购物和情绪。你不需要学历——只需要一点勇气和每天的练习。接下来，我们会慢慢加上几个对你小生意有用的词。","cnQ":"接下来我们要加什么？"}
];
ENG_CN.forEach(function(c,i){if(ENG_COURSE[i]){ENG_COURSE[i].grammar.cnEx=c.cnEx;ENG_COURSE[i].reading.cnText=c.cnText;ENG_COURSE[i].reading.cnQ=c.cnQ}});
// Days 15-30 (simplified for space, will be expanded)
for(var d=15;d<=30;d++){
var phaseName=d<=21?'跨境电商':d<=28?'商务进阶':'实战冲刺';
var titles={15:"跨境电商平台概述",16:"产品Listing优化",17:"客户沟通与跟进",18:"物流追踪与管理",19:"评价与反馈处理",20:"广告投放英语",21:"数据分析与第三周复习",22:"商务会议英语",23:"商务谈判进阶",24:"合同与条款",25:"展会英语",26:"商务社交",27:"汇报与演示",28:"第四周复习",29:"综合模拟训练",30:"毕业测试与规划"};
ENG_COURSE.push({phase:phaseName,title:titles[d]||("第"+d+"天"),desc:"持续学习中，掌握更多商务英语实战技能",sentences:[{en:"This is day "+d+" of your business English journey.",cn:"这是你商务英语学习的第"+d+"天。"},{en:"Practice makes perfect.",cn:"熟能生巧。"},{en:"Keep pushing forward.",cn:"继续前进。"}],grammar:{title:"语法点第"+d+"天",rule:"持续学习语法知识，巩固基础",ex:"Practice daily for best results.",cnEx:"每天练习才能取得最佳效果。"},reading:{title:"Reading Practice Day "+d,text:"Continue practicing your business English reading skills. Read trade-related articles, product descriptions, and business correspondence daily.",cnText:"继续练习商务英语阅读技能。每天阅读贸易相关文章、产品描述和商务信函。",q:"Why is daily practice important?",cnQ:"为什么每天练习很重要？"},quiz:[{type:"choice",q:"Day "+d+" quiz question: What is key to learning English?",opts:["Practice daily","Skip days","Only read","Only listen"],ans:0,analysis:"Daily practice is essential for language learning."},{type:"choice",q:"Which is a good study habit?",opts:["Cram once a week","Study 30 minutes daily","Only study before exams","Never review"],ans:1,analysis:"Consistent daily study is more effective than cramming."},{type:"fill",q:"Practice makes ___.",ans:"perfect",analysis:"Practice makes perfect = 熟能生巧。"}]});
}
// Chinese translations for ENG_COURSE quiz questions (shown after answering each question)
var ENG_QUIZ_CN=[

  ["以下哪个是恰当的问候语？","“How are you?” 是什么意思？","我的名字___小雨。（填 be 动词）"],
  ["我们早上吃什么？","“My favorite food is noodles” 意思是？","我们午餐吃米饭___蔬菜。（填连词）"],
  ["如何礼貌地点单？","“a glass of orange juice” 指的是？","我能___一杯水吗？（填动词）"],
  ["“Wear a coat” 是哪种句型？","天气冷时应该怎么做？","今天___，穿件外套。（填天气词）"],
  ["“There is a bed” 用了什么句型？","我们通常在哪里看电视？","我的房间里___一张书桌。（填 be 动词）"],
  ["“by bus” 意思是？","地铁的特点是什么？","我们___去公园。（填动词）"],
  ["以下哪个是问候语？","“There are two chairs” 用了什么？","我___很好，谢谢。（填 be 动词）"],
  ["“I like reading” 意思是？","介绍自己的年龄时怎么说？","我___一个可爱孩子的妈妈。（填 be 动词）"],
  ["“my mother” 意思是？","故事里谁做菜很好吃？","这是___丈夫。（填“我的”）"],
  ["“The child plays” 中 play 为什么加 s？","他们用积木搭了什么？","她给儿子___一个故事。（填 read 的三单）"],
  ["“I get up at 6:30” 在讲什么？","“usually” 是什么意思？","她饭后刷___牙。（填“她的”）"],
  ["问价格时应该怎么说？","“too expensive” 意思是？","我想___一些牛奶。（填动词）"],
  ["“I feel happy” 意思是？","宝宝一直哭，妈妈感觉？","别___，我们聊聊。（填“生气”）"],
  ["“She likes music” 为什么用 likes？","问价格用哪个词？","我___现在聊我的家人了。（填 can 的肯定形式）"],
["第15天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第16天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第17天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第18天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第19天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第20天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第21天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第22天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第23天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第24天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第25天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第26天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第27天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第28天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第29天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"],
["第30天测验：学习英语的关键是什么？","哪个是好的学习习惯？","熟能生巧。（填空：practice makes perfect）"]
];
ENG_QUIZ_CN.forEach(function(qs,di){var c=ENG_COURSE[di];if(c&&c.quiz){qs.forEach(function(cn,qi){if(c.quiz[qi])c.quiz[qi].cn=cn})}});
// EXAMS
var EXAM_DAYS=[7,14,21,28,30];
function isExamDay(day){return EXAM_DAYS.indexOf(day)>=0}
var EXAMS={
7:{title:"第一周阶段测试（生活英语）",questions:[{type:"choice",q:"Which is a correct greeting?",cn:"以下哪个是恰当的问候语？",opts:["Hello!","Goodbye!","Thank you!","Sorry!"],ans:0,analysis:"Hello! 是最常用的打招呼用语。"},{type:"choice",q:"How do you say '谢谢' in English?",cn:"“谢谢”用英语怎么说？",opts:["Sorry","Thanks","Hello","Bye"],ans:1,analysis:"Thanks = 谢谢。"},{type:"choice",q:"What do we eat in the morning?",cn:"我们早上吃什么？",opts:["Breakfast","Lunch","Dinner","Supper"],ans:0,analysis:"早上吃早餐 breakfast。"},{type:"fill",q:"My name ___ Xiaoyu.",cn:"我的名字___小雨。",ans:"is",analysis:"My name 用 be 动词 is。"},{type:"choice",q:"'by bus' means ___?",cn:"“by bus” 意思是？",opts:["走路","坐公交","骑车","开车"],ans:1,analysis:"by bus = 乘坐公交车。"}]},
14:{title:"第二周阶段测试（生活英语）",questions:[{type:"choice",q:"How to say '我喜欢读书'?",cn:"“我喜欢读书”怎么说？",opts:["I like read.","I like reading.","I like to reading.","I likes reading."],ans:1,analysis:"like + 动词ing：I like reading。"},{type:"choice",q:"'my mother' means ___?",cn:"“my mother” 意思是？",opts:["我的妈妈","你的妈妈","他的妈妈","她的妈妈"],ans:0,analysis:"my = 我的。"},{type:"choice",q:"Which is correct? 'The child ___ .'",cn:"哪句正确？‘The child ___。’",opts:["play","plays","playing","playes"],ans:1,analysis:"child 三单，动词加 s：plays。"},{type:"fill",q:"She brushes ___ teeth after meals.",cn:"她饭后刷___牙。",ans:"her",analysis:"her = 她的。"},{type:"choice",q:"How much ___ this apple?",cn:"这个苹果___多少钱？",opts:["is","are","am","be"],ans:0,analysis:"单数用 How much is..."}]},
21:{title:"第三周阶段测试",questions:[{type:"choice",q:"FBA stands for ___?",cn:"FBA 代表什么？",opts:["Fulfilled By Amazon","Free By Air","Freight By Agent","Factory Brand Authorization"],ans:0,analysis:"FBA = Fulfilled by Amazon。"},{type:"choice",q:"SEO means ___?",cn:"SEO 意思是？",opts:["Search Engine Optimization","Sales Export Office","Stock Exchange Order","Service Entry Operation"],ans:0,analysis:"SEO = 搜索引擎优化。"},{type:"choice",q:"CTR stands for ___?",cn:"CTR 代表什么？",opts:["Click-Through Rate","Cost Transfer Rate","Customer Trade Ratio","Channel Traffic Report"],ans:0,analysis:"CTR = 点击率。"},{type:"fill",q:"PPC means Pay Per ___.",cn:"PPC 意思是 Pay Per ___（按___付费）。",ans:"Click",analysis:"PPC = Pay Per Click 点击付费。"},{type:"choice",q:"Which is a keyword tool?",cn:"哪个是关键词工具？",opts:["Google Keyword Planner","Microsoft Word","Adobe Photoshop","Excel"],ans:0,analysis:"Google Keyword Planner是关键词工具。"}]},
28:{title:"第四周阶段测试",questions:[{type:"choice",q:"\"Agenda\" in a meeting means ___?",cn:"会议中的“Agenda”意思是？",opts:["参会人员","议程","会议纪要","会议地点"],ans:1,analysis:"agenda = 议程。"},{type:"choice",q:"\"Force majeure\" means ___?",cn:"“Force majeure”意思是？",opts:["武力解决","不可抗力","强制执行","重大事项"],ans:1,analysis:"force majeure = 不可抗力。"},{type:"choice",q:"Canton Fair is held in ___?",cn:"广交会在哪个城市举办？",opts:["Beijing","Shanghai","Guangzhou","Shenzhen"],ans:2,analysis:"广交会在广州举办。"},{type:"fill",q:"A business card is also called a ___ card.",cn:"名片也叫___ card。",ans:"name",analysis:"business card = name card 名片。"},{type:"choice",q:"\"ROI\" stands for ___?",cn:"ROI 代表什么？",opts:["Return on Investment","Rate of Income","Risk of Investment","Revenue of Industry"],ans:0,analysis:"ROI = 投资回报率。"}]},
30:{title:"毕业测试",questions:[{type:"choice",q:"What is the first step in international trade?",cn:"国际贸易的第一步是什么？",opts:["Ship the goods","Find a product and supplier","Pay the money","Sign a contract"],ans:1,analysis:"第一步是找到产品和供应商。"},{type:"choice",q:"Which is the most common payment method?",cn:"最常见的付款方式是什么？",opts:["Cash","T/T (Telegraphic Transfer)","Cryptocurrency","Barter"],ans:1,analysis:"T/T是最常见的付款方式。"},{type:"choice",q:"\"Looking forward to your reply\" is used in ___?",cn:"“Looking forward to your reply”用在什么场合？",opts:["Phone calls","Emails","Meetings","Contracts"],ans:1,analysis:"这是邮件常用结尾语。"},{type:"fill",q:"The opposite of import is ___.",cn:"import（进口）的反义词是___。",ans:"export",analysis:"import(进口)的反义词是export(出口)。"},{type:"choice",q:"What should you do before negotiating?",cn:"谈判前你应该做什么？",opts:["Give up immediately","Know your bottom line","Agree to everything","Walk away"],ans:1,analysis:"谈判前应知道自己的底线。"}]}
};
function getDailyVocab(day){var idx=Math.min(day-1,VOCAB.length-1);return VOCAB[idx]||VOCAB[0]}
function speakWord(word){if('speechSynthesis'in window){var u=new SpeechSynthesisUtterance(word);u.lang='en-US';u.rate=0.8;u.pitch=1;speechSynthesis.cancel();speechSynthesis.speak(u)}}
function speakAllVocab(){if(!('speechSynthesis'in window))return;var day=getEngColDay('vocab');var vocab=getDailyVocab(day);speechSynthesis.cancel();vocab.forEach(function(v,i){var u=new SpeechSynthesisUtterance(v[0]);u.lang='en-US';u.rate=0.7;u.pitch=1;setTimeout(function(){speechSynthesis.speak(u)},i*1800)})}
function escAttr(s){s=String(s==null?'':s);return s.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;')}
function ensureEnglish(){if(!DATA.courses)DATA.courses={};var e=DATA.courses.english;if(!e){DATA.courses.english={plan:{day:1},vocab:{day:1},quiz:{day:1}};return}if(!e.plan){var d=(typeof e.day==='number')?e.day:1;DATA.courses.english={plan:{day:d},vocab:{day:d},quiz:{day:d}}}}
function getEngColDay(col){ensureEnglish();var c=DATA.courses.english[col];return c?c.day:1}
function completeEngCol(col){ensureEnglish();if(!DATA.courses.english[col])DATA.courses.english[col]={day:1};var c=DATA.courses.english[col];if(c.day>=ENG_COURSE.length){showToast('🎉 该栏目已学完全部课程','success');return}var oldDay=c.day;c.day++;if(col==='quiz'){var ok='d'+oldDay;if(!DATA._quiz)DATA._quiz={};if(DATA._quiz[ok])delete DATA._quiz[ok];}save(DATA);renderEnglish();showToast('✓ 已记录，进入下一课','success')}
function resetEngCol(col){ensureEnglish();if(DATA.courses.english[col])DATA.courses.english[col].day=1;if(col==='quiz'){if(!DATA._quiz)DATA._quiz={};DATA._quiz['d1']={pending:{},answered:{},confirmed:{}};}save(DATA);renderEnglish();showToast('已重置「'+(col==='plan'?'学习计划':col==='vocab'?'单词背诵':'练习作业')+'」','success')}
function renderEnglish(){
var subTab=DATA._engSubTab||'plan';var _col=(subTab==='vocab')?'vocab':(subTab==='quiz')?'quiz':'plan';var day=getEngColDay(_col);var course=ENG_COURSE[Math.min(day-1,ENG_COURSE.length-1)];var vocab=getDailyVocab(day);
var tabs='<div class="sub-tabs"><div class="sub-tab'+(subTab==='plan'?' active':'')+'" onclick="switchEngSubTab(\'plan\')">📋 学习计划</div><div class="sub-tab'+(subTab==='vocab'?' active':'')+'" onclick="switchEngSubTab(\'vocab\')">📝 单词背诵</div><div class="sub-tab'+(subTab==='quiz'?' active':'')+'" onclick="switchEngSubTab(\'quiz\')">✍️ 练习作业</div><div class="sub-tab'+(subTab==='exam'?' active':'')+'" onclick="switchEngSubTab(\'exam\')">🏆 考试测验</div><div class="sub-tab'+(subTab==='ipa'?' active':'')+'" onclick="switchEngSubTab(\'ipa\')">🔤 音标大全</div></div>';
var searchBox='<div class="ws-search"><div class="ws-search-head">🔍 单词查询 <span class="ws-search-sub">输入任意英文单词，即时查音标 / 释义 / 例句</span></div><div class="ws-search-row"><input id="ws-input" class="ws-input" placeholder="如 apple / order / business / beautiful / 任意英文单词" value="'+escAttr(DATA._wordQuery||'')+'" onkeydown="if(event.key===\'Enter\')doWordSearch()"><button class="c-btn primary" onclick="doWordSearch()">查询</button></div><div id="ws-result" class="ws-result">'+renderWordResult(DATA._wordQuery)+'</div></div>';
var h='';
if(subTab==='plan'){
h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px"><div style="font-size:14px;font-weight:700">📅 第 '+day+' 天 · '+course.phase+'</div>';
h+='<div style="display:flex;gap:6px"><button class="c-btn primary" onclick="completeEngCol(\'plan\')">✓ 完成，下一课</button><button class="c-btn danger" onclick="resetEngCol(\'plan\')">重置</button></div></div>';
h+='<div style="font-size:16px;font-weight:800;margin-bottom:10px">'+course.title+'</div>';
h+='<div style="font-size:13px;color:var(--text-s);margin-bottom:16px">'+course.desc+'</div>';
// Sentences
h+='<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:700;margin-bottom:8px;border-bottom:2px solid var(--g6);padding-bottom:4px">💬 核心短句</div>';
course.sentences.forEach(function(s){h+='<div class="sent-item"><div class="sent-text"><div class="sent-en">'+s.en+'</div><div class="sent-cn">'+s.cn+'</div></div><button class="vocab-speak" onclick="speakWord(\''+s.en.replace(/'/g,"\\'")+'\')">🔊</button></div>'});
h+='</div>';
// Grammar
h+='<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:700;margin-bottom:8px;border-bottom:2px solid var(--g6);padding-bottom:4px">📖 语法点</div>';
h+='<div class="grammar-box"><div class="grammar-head"><div class="grammar-title">'+course.grammar.title+'</div><button class="vocab-speak" onclick="speakWord(this.dataset.t)" data-t="'+escAttr(course.grammar.ex)+'">🔊</button></div><div class="grammar-rule">'+course.grammar.rule+'</div><div class="grammar-ex">例：'+course.grammar.ex+'</div>';if(course.grammar.cnEx)h+='<div style="font-size:12px;color:var(--accent-d);margin-top:6px;padding:6px 8px;background:var(--accent-l);border-radius:6px;border:1px dashed var(--g5)">📝 中文注释：'+course.grammar.cnEx+'</div>';h+='</div></div>';
// Reading
h+='<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:700;margin-bottom:8px;border-bottom:2px solid var(--g6);padding-bottom:4px">📰 阅读理解</div>';
h+='<div class="reading-box"><div class="reading-head"><div class="reading-title">'+course.reading.title+'</div><button class="vocab-speak" onclick="speakWord(this.dataset.t)" data-t="'+escAttr(course.reading.text)+'">🔊</button></div><div class="reading-text">'+course.reading.text+'</div>';if(course.reading.cnText)h+='<div style="font-size:12px;color:var(--accent-d);margin-top:8px;padding:8px;background:var(--accent-l);border-radius:6px;border:1px dashed var(--g5);line-height:1.6">📝 中文翻译：'+course.reading.cnText+'</div>';h+='<div class="reading-q"><div style="font-size:12px;color:var(--blue);font-weight:600">❓ '+course.reading.q+'</div><button class="vocab-speak" onclick="speakWord(this.dataset.t)" data-t="'+escAttr(course.reading.q)+'">🔊</button></div>';if(course.reading.cnQ)h+='<div style="font-size:12px;color:var(--accent-d);margin-top:4px;padding:4px 8px;background:var(--accent-l);border-radius:4px">📝 中文：'+course.reading.cnQ+'</div>';h+='</div></div>';
// Next preview
var nextCourse=ENG_COURSE[Math.min(day,ENG_COURSE.length-1)];
if(nextCourse&&day<ENG_COURSE.length)h+='<div class="course-next">📅 明日预告：<b>'+nextCourse.title+'</b></div>';
}
else if(subTab==='vocab'){
h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px"><div style="font-size:14px;font-weight:700">📝 第 '+day+' 天单词 · 共10词</div><div style="display:flex;gap:6px"><button class="c-btn primary" onclick="completeEngCol(\'vocab\')">✓ 背完，下一课</button><button class="c-btn danger" onclick="resetEngCol(\'vocab\')">重置</button></div></div>';
h+='<div style="display:flex;align-items:center;gap:6px;margin-bottom:12px"><button class="vocab-speak-all" onclick="speakAllVocab()" style="padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer;border:1px solid var(--cyan);background:var(--cyan-l);color:var(--cyan);font-weight:600">🔊 依次朗读</button></div>';
h+='<div class="vocab-grid">';
vocab.forEach(function(v){h+='<div class="vocab-item"><div class="vocab-word-row"><span class="vocab-word">'+v[0]+'</span><button class="vocab-speak" onclick="speakWord(\''+v[0]+'\')">🔊</button></div><div class="vocab-phonetic">'+v[1]+'</div><div class="vocab-meaning">'+v[2]+'</div></div>'});
h+='</div>';
}
else if(subTab==='quiz'){
var st=quizDayState(day);var answered=st.answered,confirmed=st.confirmed,pending=st.pending;
var total=course.quiz.length;var confirmedCount=0;for(var _k in confirmed){if(confirmed.hasOwnProperty(_k))confirmedCount++}
var allDone=(confirmedCount>=total);
h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px"><div style="font-size:14px;font-weight:700">✍️ 第 '+day+' 天练习 · '+total+'题（已确认 '+confirmedCount+'/'+total+'）</div><div style="display:flex;gap:6px"><button class="c-btn primary" onclick="completeEngCol(\'quiz\')"'+(allDone?'':' disabled style="opacity:.5;cursor:not-allowed"')+'>✓ 完成，下一课</button><button class="c-btn danger" onclick="resetEngCol(\'quiz\')">重置</button></div></div>';
course.quiz.forEach(function(q,qi){
var isConfirmed=!!confirmed[qi];var userAns=answered[qi];
h+='<div class="quiz-q" id="quiz-'+qi+'"><div class="quiz-q-text">'+(qi+1)+'. '+q.q+'</div>';
if(q.type==='choice'){
q.opts.forEach(function(opt,oi){var cls='';var extra='';if(isConfirmed){if(oi===q.ans)cls=' correct';else if(userAns===oi)cls=' wrong'}else if(pending[qi]===oi){cls=' selected';extra=' style="border-color:var(--g5);background:var(--g1);font-weight:700;color:var(--accent-d)"'}h+='<div class="quiz-opt'+cls+'"'+extra+' onclick="answerQuiz('+qi+','+oi+')"'+(isConfirmed?' style="pointer-events:none"':'')+'><span class="quiz-opt-letter">'+String.fromCharCode(65+oi)+'</span>'+opt+'</div>'});
if(!isConfirmed)h+='<button class="c-btn primary" style="margin-top:6px;font-size:11px;padding:5px 12px" onclick="confirmQuiz('+qi+')">确定</button>'
}
else if(q.type==='fill'){var val=answered[qi]||'';h+='<input class="quiz-input" id="quiz-input-'+qi+'" value="'+escAttr(val)+'" placeholder="输入答案…"'+(isConfirmed?'disabled':'')+'>';if(!isConfirmed)h+='<button class="c-btn primary" style="margin-top:4px;font-size:11px;padding:5px 12px" onclick="confirmFillQuiz('+qi+')">确定答案</button>'}
if(isConfirmed){if(q.type==='choice'&&userAns!==q.ans){h+='<div style="font-size:12px;color:var(--accent-d);margin-top:4px">✓ 正确答案：'+String.fromCharCode(65+q.ans)+' '+q.opts[q.ans]+'</div>'}if(q.type==='fill'&&String(userAns).toLowerCase().trim()!==q.ans.toLowerCase()){h+='<div style="font-size:12px;color:var(--accent-d);margin-top:4px">✓ 正确答案：'+q.ans+'</div>'}h+='<div class="quiz-cn" style="display:block">'+(q.cn?'<div class="qn">📝 题目中文：'+q.cn+'</div>':'')+'<div class="qa"><b>解析：</b>'+q.analysis+'</div></div>'}
h+='</div>'});
if(allDone){var score=0;course.quiz.forEach(function(q,qi){var a=answered[qi];if(q.type==='choice'){if(a===q.ans)score++}else if(q.type==='fill'){if(a&&String(a).toLowerCase().trim()===q.ans.toLowerCase())score++}});var pass=score>=Math.ceil(total*0.6);h+='<div class="quiz-result show '+(pass?'pass':'fail')+'">练习完成，得分：'+score+'/'+total+' '+(pass?'✓ 做得不错！':'未达标，可点重置重做')+'</div>'}
}
else if(subTab==='exam'){
if(isExamDay(day)){var exam=EXAMS[day];var ekey='e'+day;var submitted=DATA.examResults[ekey];var examAns=(DATA._examAnswered&&DATA._examAnswered[ekey])||{};
h+='<div style="background:linear-gradient(135deg,var(--orange-l),var(--pink-l));padding:14px;border-radius:12px;margin-bottom:14px"><div style="font-size:18px;font-weight:800">'+exam.title+'</div><div style="font-size:12px;color:var(--text-s);margin-top:4px">共'+exam.questions.length+'题 · 满分'+exam.questions.length+'分 · 答完每题自动显示中文注释</div></div>';
exam.questions.forEach(function(q,qi){
var isAns=submitted||(examAns[qi]!==undefined&&examAns[qi]!==null&&examAns[qi]!=='');
h+='<div class="quiz-q" id="exam-'+qi+'"><div class="quiz-q-text">'+(qi+1)+'. '+q.q+'</div>';
if(q.type==='choice'){q.opts.forEach(function(opt,oi){var cls='';if(isAns){if(oi===q.ans)cls=' correct';else{var ua=submitted&&submitted.answers?submitted.answers[qi]:examAns[qi];if(ua===oi)cls=' wrong'}}h+='<div class="quiz-opt'+cls+'" onclick="answerExam('+qi+','+oi+')"'+(isAns?' style="pointer-events:none"':'')+'><span class="quiz-opt-letter">'+String.fromCharCode(65+oi)+'</span>'+opt+'</div>'})}
else if(q.type==='fill'){var val=submitted&&submitted.answers&&submitted.answers[qi]!==undefined?submitted.answers[qi]:(examAns[qi]||'');h+='<input class="quiz-input" id="exam-input-'+qi+'" value="'+escAttr(val)+'" placeholder="输入答案…"'+(isAns?'disabled':'')+'>';if(!isAns)h+='<button class="c-btn primary" style="margin-top:4px;font-size:11px;padding:5px 10px" onclick="answerFillExam('+qi+','+day+')">确认答案</button>';if(isAns&&val&&String(val).toLowerCase().trim()!==q.ans.toLowerCase()){h+='<div style="font-size:12px;color:var(--accent-d);margin-top:4px">✓ 正确答案：'+q.ans+'</div>'}}
h+='<div class="quiz-cn" id="exam-analysis-'+qi+'" style="display:'+(isAns?'block':'none')+'">'+(q.cn?'<div class="qn">📝 题目中文：'+q.cn+'</div>':'')+'<div class="qa"><b>解析：</b>'+q.analysis+'</div></div>';
h+='</div>'});
if(!submitted)h+='<button class="quiz-submit" onclick="submitExam('+day+')">提交考试</button>';
else{var score=submitted.score||0;var total=exam.questions.length;var pct=Math.round(score/total*100);h+='<div class="quiz-result show '+(pct>=60?'pass':'fail')+'">考试得分：'+score+'/'+total+' ('+pct+'%) '+(pct>=60?'🎉 恭喜通过！':'需要加油，请复习后重试')+'</div>'}}
else{h+='<div style="text-align:center;padding:40px 20px"><div style="font-size:48px;margin-bottom:12px">📅</div><div style="font-size:16px;font-weight:700;margin-bottom:8px">今天没有考试</div><div style="font-size:13px;color:var(--text-s)">考试安排在第 7、14、21、28、30 天<br>今天是第 '+day+' 天，请先完成学习计划</div></div>';
if(day<7)h+='<div style="text-align:center;margin-top:16px"><div style="font-size:12px;color:var(--text-f)">下一次考试：第7天（还有'+(7-day)+'天）</div></div>'}
}
else if(subTab==='ipa'){h+=renderIPA()}
document.getElementById('learnContent').innerHTML=searchBox+tabs+h;
if(DATA._wordQuery){var _lw=String(DATA._wordQuery).trim().toLowerCase();var _loc=lookupWord(DATA._wordQuery);if((!_loc||_loc.notFound)&&WORD_ONLINE_CACHE[_lw]===undefined){fetchWordOnline(DATA._wordQuery)}}
}
function switchEngSubTab(tab){DATA._engSubTab=tab;save(DATA);renderEnglish()}
function quizDayState(day){var qk='d'+day;if(!DATA._quiz)DATA._quiz={};if(!DATA._quiz[qk])DATA._quiz[qk]={pending:{},answered:{},confirmed:{}};return DATA._quiz[qk]}
function answerQuiz(qi,oi){var d=getEngColDay('quiz');var st=quizDayState(d);st.pending[qi]=oi;save(DATA);renderEnglish()}
function confirmQuiz(qi){var d=getEngColDay('quiz');var st=quizDayState(d);if(st.pending[qi]===undefined){showToast('请先选择一个选项','warn');return}st.answered[qi]=st.pending[qi];st.confirmed[qi]=true;delete st.pending[qi];save(DATA);renderEnglish()}
function confirmFillQuiz(qi){var d=getEngColDay('quiz');var st=quizDayState(d);var el=document.getElementById('quiz-input-'+qi);var val=el?el.value.trim():'';if(!val){showToast('请先输入答案','warn');return}st.answered[qi]=val;st.confirmed[qi]=true;save(DATA);renderEnglish()}
function answerExam(qi,oi){var day=getEngColDay('plan');if(DATA.examResults['e'+day])return;var ekey='e'+day;if(!DATA._examAnswered)DATA._examAnswered={};if(!DATA._examAnswered[ekey])DATA._examAnswered[ekey]={};DATA._examAnswered[ekey][qi]=oi;save(DATA);renderEnglish()}
function answerFillExam(qi,day){if(DATA.examResults['e'+day])return;var ekey='e'+day;if(!DATA._examAnswered)DATA._examAnswered={};if(!DATA._examAnswered[ekey])DATA._examAnswered[ekey]={};var val=document.getElementById('exam-input-'+qi);DATA._examAnswered[ekey][qi]=val?val.value:'';save(DATA);renderEnglish()}
function submitExam(day){var exam=EXAMS[day];var ekey='e'+day;var answers=(DATA._examAnswered&&DATA._examAnswered[ekey])?DATA._examAnswered[ekey]:{};var score=0;exam.questions.forEach(function(q,qi){if(q.type==='choice'){var a=answers[qi]==null?-1:answers[qi];answers[qi]=a;if(a===q.ans)score++}else if(q.type==='fill'){var val=answers[qi]||'';if(String(val).toLowerCase().trim()===q.ans.toLowerCase())score++}});DATA.examResults['e'+day]={answers:answers,score:score};if(DATA._examAnswered)DATA._examAnswered[ekey]=null;save(DATA);renderEnglish();showToast('考试已提交，得分'+score+'/'+exam.questions.length,'success')}
function renderIPA(){
var groups=[
{title:'长元音 (Long Vowels)',items:[
{sym:'/iː/',desc:'长“衣”音，嘴角向两边拉伸，比汉语“衣”更长更紧',word:'see'},
{sym:'/ɜː/',desc:'长“鹅”音，舌身平放、嘴唇放松微张，美音略卷舌',word:'her'},
{sym:'/ɔː/',desc:'长“奥”音，双唇收圆并向前突出',word:'law'},
{sym:'/uː/',desc:'长“乌”音，双唇小圆并用力向前收',word:'food'},
{sym:'/ɑː/',desc:'长“啊”音，嘴巴张大，舌身放低',word:'car'}]},
{title:'短元音 (Short Vowels)',items:[
{sym:'/ɪ/',desc:'短促的“衣”，比 /iː/ 更松更短',word:'sit'},
{sym:'/e/',desc:'“诶”音，嘴半开，舌尖抵下齿',word:'pen'},
{sym:'/æ/',desc:'张大嘴的“哎”，舌尖抵下齿',word:'cat'},
{sym:'/ʌ/',desc:'短“啊”，肌肉放松，如轻声“啊”',word:'cup'},
{sym:'/ɒ/',desc:'短“奥”，双唇小圆，比 /ɔː/ 短',word:'hot'},
{sym:'/ʊ/',desc:'短“乌”，比 /uː/ 更松更短',word:'book'},
{sym:'/ə/',desc:'最弱的“鹅”音，任何元音弱读时都发它',word:'about'}]},
{title:'双元音 (Diphthongs)',items:[
{sym:'/eɪ/',desc:'由“诶”滑向“衣”，如字母 A 的发音',word:'name'},
{sym:'/aɪ/',desc:'由“啊”滑向“衣”，如字母 I',word:'time'},
{sym:'/ɔɪ/',desc:'由“奥”滑向“衣”',word:'boy'},
{sym:'/aʊ/',desc:'由“啊”滑向“乌”，如字母 OU',word:'now'},
{sym:'/əʊ/',desc:'由“鹅”滑向“乌”，如字母 O',word:'go'},
{sym:'/ɪə/',desc:'由“衣”滑向“鹅”',word:'here'},
{sym:'/eə/',desc:'由“诶”滑向“鹅”',word:'hair'},
{sym:'/ʊə/',desc:'由“乌”滑向“鹅”',word:'sure'}]},
{title:'清辅音 (Voiceless)',items:[
{sym:'/p/',desc:'双唇紧闭后突然张开，不振动声带（送气）',word:'pen'},
{sym:'/t/',desc:'舌尖抵上齿龈后弹开，不振动声带',word:'tea'},
{sym:'/k/',desc:'舌后部抵软腭后弹开，不振动声带',word:'cat'},
{sym:'/f/',desc:'上齿轻咬下唇，气流摩擦而出',word:'fish'},
{sym:'/θ/',desc:'舌尖轻夹上下齿间，送气不振动',word:'think'},
{sym:'/s/',desc:'舌端靠近上齿龈，气流嘶出',word:'sun'},
{sym:'/ʃ/',desc:'舌面抬近硬腭，发“嘘”声',word:'she'},
{sym:'/tʃ/',desc:'/t/+/ʃ/ 结合，如“ch”',word:'chair'},
{sym:'/tr/',desc:'/t/+/r/ 结合',word:'tree'},
{sym:'/ts/',desc:'/t/+/s/ 结合',word:'cats'},
{sym:'/h/',desc:'口鼻向外轻轻哈气',word:'hat'}]},
{title:'浊辅音 (Voiced)',items:[
{sym:'/b/',desc:'双唇爆破，振动声带，/p/ 的浊音版',word:'big'},
{sym:'/d/',desc:'舌尖抵齿龈爆破，振动声带',word:'dog'},
{sym:'/g/',desc:'舌后抵软腭爆破，振动声带',word:'go'},
{sym:'/v/',desc:'上齿咬下唇摩擦，振动声带',word:'very'},
{sym:'/ð/',desc:'舌尖夹齿间，振动声带，/θ/ 的浊音版',word:'this'},
{sym:'/z/',desc:'舌端近齿龈嘶音，振动声带',word:'zoo'},
{sym:'/ʒ/',desc:'舌面近硬腭“嘘”音，振动声带',word:'vision'},
{sym:'/dʒ/',desc:'/d/+/ʒ/ 结合，如“j”',word:'job'},
{sym:'/dr/',desc:'/d/+/r/ 结合',word:'dream'},
{sym:'/dz/',desc:'/d/+/z/ 结合',word:'beds'},
{sym:'/m/',desc:'双唇闭合，气流从鼻腔出',word:'man'},
{sym:'/n/',desc:'舌尖抵上齿龈，气流从鼻腔出',word:'no'},
{sym:'/ŋ/',desc:'舌后抵软腭，气流从鼻腔出',word:'sing'},
{sym:'/l/',desc:'舌尖抵上齿龈，气流从舌侧出',word:'leg'},
{sym:'/r/',desc:'舌尖卷起靠近上腭，振动声带',word:'red'},
{sym:'/w/',desc:'双唇收圆突出，半元音',word:'we'},
{sym:'/j/',desc:'舌面抬近硬腭，半元音，如“y”',word:'yes'}]}
];
var html='<div style="font-size:14px;font-weight:800;margin-bottom:4px">🔤 英语音标大全</div>';
html+='<div style="font-size:12px;color:var(--text-s);margin-bottom:14px">共 44 个国际音标 · 点击 🔊 听<b>真人录制的音标本音</b>（优先读取本地录音，离线也能听；未下载时自动从国内CDN加载（无需翻墙））· 点「词」复习例词</div>';
groups.forEach(function(g){html+='<div style="margin-bottom:18px"><div style="font-size:14px;font-weight:700;margin-bottom:8px;border-bottom:2px solid var(--g6);padding-bottom:4px">'+g.title+'</div><div class="ipa-grid">';g.items.forEach(function(it){html+='<div class="ipa-item"><div class="ipa-top"><span class="ipa-sym">'+it.sym+'</span><button class="vocab-speak" onclick="playPhoneme(\''+escAttr(it.sym)+'\',\''+escAttr(it.word)+'\')" title="听音标本音">🔊</button></div><div class="ipa-desc">'+escAttr(it.desc)+'</div><div class="ipa-word">例词：<b>'+escAttr(it.word)+'</b> <button onclick="speakText(\''+escAttr(it.word)+'\',\'en-US\',0.8)" style="font-size:10px;padding:1px 6px;border-radius:4px;border:1px solid #00b8d4;background:#e0f7fa;color:#0097a7;cursor:pointer;margin-left:4px">词</button></div></div>'});html+='</div></div>'});
return html;
}
// === AI COURSE ===
var AI_SW_LINK='https://www.bilibili.com/video/BV1yZyiBsEj9/';
var AI_SW_COURSE={title:'AI软件从入门到精通',goal:'熟练运用各种AI工具，提升效率与创意',phases:[
{name:'🤖 AI对话入门',days:[
{t:'认识ChatGPT',d:'注册账号，了解基本对话功能，学习提示词(Prompt)基础',hw:'注册AI对话工具，用3种提示词风格提问同一问题，记录差异',link:AI_SW_LINK},
{t:'提示词工程',d:'结构化提示词写法：角色设定+任务描述+输出格式+限制条件',hw:'用ChatGPT写产品推广文案，对比简单提示词vs结构化提示词效果',link:AI_SW_LINK},
{t:'Claude与Kimi',d:'了解Claude/Kimi/豆包等国产AI特点，选择适合自己的工具',hw:'用同一问题分别问3个AI工具，对比回答质量/速度/风格',link:AI_SW_LINK},
{t:'AI辅助写作',d:'用AI写文案/邮件/报告，学习润色修改和风格转换技巧',hw:'用AI写一封商务邮件+一篇小红书文案，手动润色对比原版',link:AI_SW_LINK},
{t:'AI翻译与改写',d:'AI翻译技巧、多语言改写、语气风格转换（正式/口语/文艺）',hw:'将中文产品描述翻译成英文，再用AI改写3种不同风格',link:AI_SW_LINK},
{t:'多轮对话与角色扮演',d:'多轮对话策略、上下文管理、让AI扮演特定角色',hw:'与AI进行10轮连续对话，模拟外贸客户沟通场景',link:AI_SW_LINK},
{t:'对话工具周总结',d:'复习所有AI对话工具，整理个人提示词模板库',hw:'整理个人提示词模板库（至少10条），按写作/翻译/分析分类',link:AI_SW_LINK}
]},
{name:'🎨 AI绘画创作',days:[
{t:'Midjourney入门',d:'注册MJ，学习基础绘图命令和参数(--ar/--v/--q)',hw:'用MJ生成5张不同风格图片，记录参数差异',link:AI_SW_LINK},
{t:'即梦AI绘画',d:'使用即梦AI，中文提示词绘画，了解国产AI绘画特点',hw:'用即梦AI生成3张产品宣传图，对比MJ差异',link:AI_SW_LINK},
{t:'SD与开源模型',d:'了解Stable Diffusion开源模型，学习常用模型和风格',hw:'在线试用SD生成图片，体验不同模型风格差异',link:AI_SW_LINK},
{t:'绘画提示词技巧',d:'绘画提示词结构：主体+风格+光影+构图+色彩',hw:'用同一主体写3组不同风格提示词，生成对比图',link:AI_SW_LINK},
{t:'AI修图与扩图',d:'AI修图：去水印/扩图/换背景/局部重绘',hw:'选一张照片，用AI完成去水印+换背景+扩图',link:AI_SW_LINK},
{t:'AI设计应用',d:'用AI做logo/海报/产品图/社交媒体图',hw:'用AI绘画工具设计一个品牌logo+一张产品海报',link:AI_SW_LINK},
{t:'绘画工具周总结',d:'整理绘画工具对比表，建立个人风格库',hw:'制作AI绘画工具对比表（功能/价格/风格/易用性）',link:AI_SW_LINK}
]},
{name:'🎬 AI视频与音频',days:[
{t:'剪映AI功能',d:'剪映AI自动字幕/配音/模板/智能裁剪',hw:'用剪映AI给一段2分钟视频自动上字幕+配音',link:AI_SW_LINK},
{t:'AI配音与语音合成',d:'了解AI配音工具（剪映/微软/阿里），学习语音克隆',hw:'用AI配音工具给一段文案生成3种不同风格语音',link:AI_SW_LINK},
{t:'AI视频生成',d:'了解即梦AI视频/Runway/Pika等AI视频生成工具',hw:'用即梦AI生成一段5秒短视频，体验文字生成视频',link:AI_SW_LINK},
{t:'AI音乐与音效',d:'了解AI音乐生成（Suno/Udio），学习配乐技巧',hw:'用Suno生成一段30秒BGM，适配你之前的剪辑作品',link:AI_SW_LINK},
{t:'AI数字人',d:'了解AI数字人（HeyGen/D-ID），学习虚拟主播制作',hw:'用AI数字人工具制作一段10秒产品介绍视频',link:AI_SW_LINK},
{t:'AI动效与特效',d:'AI视频特效：风格迁移/动作捕捉/动态生成',hw:'用AI给一段普通视频添加特效风格转换',link:AI_SW_LINK},
{t:'视频音频周总结',d:'整理视频音频AI工具对比，制作个人工具箱',hw:'制作AI视频音频工具箱清单，标注常用场景',link:AI_SW_LINK}
]},
{name:'📝 AI办公与效率',days:[
{t:'AI做PPT',d:'用AI工具(Gamma/Tome/ChatGPT)快速生成PPT',hw:'用Gamma制作一份5页产品介绍PPT',link:AI_SW_LINK},
{t:'AI数据分析',d:'用AI分析数据/生成图表/撰写数据报告',hw:'给AI一组销售数据，让它分析趋势并生成报告',link:AI_SW_LINK},
{t:'AI客服与自动化',d:'了解AI客服工具/自动化流程/批量处理',hw:'设计AI客服对话流程图，模拟5个常见客户问题',link:AI_SW_LINK},
{t:'AI学习助手',d:'用AI辅助学习：总结文章/生成题库/解释概念',hw:'用AI总结一篇长文章要点+生成5道测试题',link:AI_SW_LINK},
{t:'AI搜索与研究',d:'AI搜索工具(Perplexity/Kimi搜索)，高效信息检索',hw:'用Perplexity搜索一个专业问题，对比传统搜索结果',link:AI_SW_LINK},
{t:'AI工具组合实战',d:'组合多个AI工具完成复杂任务：调研→创作→排版→发布',hw:'用3个以上AI工具协作完成一篇完整自媒体内容',link:AI_SW_LINK},
{t:'办公效率周总结',d:'整理AI办公工具，建立个人效率工作流',hw:'绘制个人AI工具工作流图，标注每个环节工具',link:AI_SW_LINK}
]},
{name:'🏆 综合实战毕业',days:[
{t:'AI全流程实战',d:'从0到1用AI完成完整项目：选题→创作→发布',hw:'选择一个主题，用至少5个AI工具完成全流程',link:AI_SW_LINK},
{t:'毕业总结与规划',d:'总结学习成果，规划AI工具持续学习方向',hw:'写一份300字学习总结+未来3个月AI学习计划',link:AI_SW_LINK}
]}
]};
var AI_DR_COURSE={title:'AI短剧制作从零到变现',goal:'独立制作AI短剧并上线变现',phases:[
{name:'📖 短剧基础',days:[
{t:'短剧市场分析',d:'了解短剧市场现状/热门题材/平台规则/受众画像',hw:'调研3个短剧平台，分析各平台热门题材特点',link:AI_SW_LINK},
{t:'剧本结构基础',d:'学习短剧剧本三幕结构：开端-冲突-反转-结局',hw:'分析3条爆款短剧的剧本结构，画出情节曲线图',link:AI_SW_LINK},
{t:'角色设定技巧',d:'角色设定：性格标签/动机/冲突关系/成长弧线',hw:'为一个5集短剧设计3个主要角色的详细设定卡',link:AI_SW_LINK},
{t:'分镜与场景规划',d:'学习分镜脚本写作/场景划分/镜头语言基础',hw:'为一个3分钟短剧写完整分镜脚本（至少12镜头）',link:AI_SW_LINK},
{t:'对话与台词设计',d:'台词写作技巧：金句设计/情感张力/节奏把控',hw:'为短剧角色写5段关键对话，每段包含一个金句',link:AI_SW_LINK},
{t:'悬念与反转设计',d:'学习悬念设置/反转技巧/观众情绪操控',hw:'为短剧设计2个反转点，写出前后对比脚本',link:AI_SW_LINK},
{t:'短剧基础周总结',d:'复习本周内容，完善短剧策划方案',hw:'完成一份完整短剧策划案（题材+角色+大纲+分镜）',link:AI_SW_LINK}
]},
{name:'✍️ AI剧本创作',days:[
{t:'ChatGPT写剧本',d:'用ChatGPT辅助：设定角色/生成大纲/扩展情节',hw:'用ChatGPT生成一份5集短剧完整剧本大纲',link:AI_SW_LINK},
{t:'AI剧本润色',d:'用AI润色剧本：优化对话/增强情感/调整节奏',hw:'将AI生成的剧本手动润色，对比前后效果',link:AI_SW_LINK},
{t:'AI生成分镜脚本',d:'用AI自动生成分镜：镜头描述+对话+动作+时长',hw:'用AI为第1集短剧生成详细分镜脚本',link:AI_SW_LINK},
{t:'批量剧本生产',d:'学习AI批量生产剧本：模板化/系列化/多版本',hw:'用AI生成同一题材的3个不同版本剧本',link:AI_SW_LINK},
{t:'AI剧本审查',d:'剧本审查要点：逻辑检查/合规检查/平台适配',hw:'审查一份AI生成的剧本，标注5个需修改的问题',link:AI_SW_LINK},
{t:'互动剧本设计',d:'了解互动短剧：分支剧情/观众选择/多结局',hw:'设计一个互动短剧的3条分支路线',link:AI_SW_LINK},
{t:'剧本创作周总结',d:'完善剧本，准备进入视觉制作阶段',hw:'完成一份可执行的完整剧本终稿',link:AI_SW_LINK}
]},
{name:'🎭 AI视觉生成',days:[
{t:'AI绘画角色设计',d:'用AI绘画工具设计角色形象：肖像+服装+表情',hw:'用MJ/即梦AI为3个角色各生成3张形象图',link:AI_SW_LINK},
{t:'AI场景生成',d:'用AI生成短剧场景：室内/室外/特殊环境',hw:'为短剧生成5个关键场景图片',link:AI_SW_LINK},
{t:'AI道具与细节',d:'用AI生成道具/物品/纹理细节，丰富画面',hw:'为短剧场景添加5个道具/物品细节图',link:AI_SW_LINK},
{t:'AI视频生成入门',d:'用即梦AI/Runway从图片生成短视频片段',hw:'将3张场景图转化为5秒短视频片段',link:AI_SW_LINK},
{t:'AI角色动态生成',d:'用AI让角色动起来：表情变化/动作生成/口型同步',hw:'用AI工具让一个角色完成3种不同表情/动作',link:AI_SW_LINK},
{t:'AI风格统一',d:'保持AI生成内容风格统一：色调/画风/比例',hw:'为所有生成内容建立统一风格参数模板',link:AI_SW_LINK},
{t:'视觉生成周总结',d:'整理所有视觉素材，准备后期合成',hw:'整理一份完整视觉素材清单（角色+场景+道具）',link:AI_SW_LINK}
]},
{name:'🔧 AI后期制作',days:[
{t:'AI配音制作',d:'为短剧角色AI配音：选择声线/调整语速/情感表达',hw:'为3个角色各配一段10秒对话音频',link:AI_SW_LINK},
{t:'AI字幕与特效',d:'AI自动字幕/特效添加/转场设计',hw:'为一段30秒短剧片段添加字幕+2个特效+转场',link:AI_SW_LINK},
{t:'AI剪辑合成',d:'用剪映/PR将所有AI素材合成为完整短剧',hw:'将前期所有素材合成为一段1分钟完整短剧',link:AI_SW_LINK},
{t:'AI调色与后期',d:'AI统一调色/画面优化/音频混缩',hw:'为短剧做统一调色+音频混缩',link:AI_SW_LINK},
{t:'AI批量生产优化',d:'优化AI短剧批量生产流程：模板化+自动化',hw:'设计一条AI短剧批量生产流水线流程图',link:AI_SW_LINK},
{t:'质量检查与迭代',d:'短剧质量检查要点，AI辅助发现问题并迭代',hw:'审查短剧，列出5个改进点并用AI优化',link:AI_SW_LINK},
{t:'后期制作周总结',d:'完成短剧终版，准备上线',hw:'完成短剧最终版本导出(1080p)',link:AI_SW_LINK}
]},
{name:'💰 上线变现',days:[
{t:'短剧上线发布',d:'短剧发布平台选择/上传规范/封面标题设计',hw:'将短剧发布到至少2个平台，优化封面标题',link:AI_SW_LINK},
{t:'变现策略规划',d:'短剧变现模式：付费/广告分成/品牌定制/IP授权',hw:'制定一份个人短剧变现计划（3个月目标+行动）',link:AI_SW_LINK}
]}
]};
var AI_WORK_COURSE={title:'AI工作软件实战',goal:'用AI办公软件提效，把重复劳动交给AI',phases:[
{name:'💼 AI办公基础',days:[
{t:'认识AI办公生态',d:'了解主流办公AI：Word/WPS AI写文档、Excel Copilot做表格、PPT AI做演示、飞书/钉钉智能伙伴、Notion AI笔记',hw:'列出你日常最重复的3件办公事，标记哪件可用AI替代',link:'https://copilot.microsoft.com'},
{t:'文档AI·自动写作',d:'用Word/WPS AI写周报、总结、公文初稿，并学会"精简/扩写/换语气"',hw:'用文档AI生成一份本周工作小结，再让AI润色成正式语气'},
{t:'表格AI·公式与分析',d:'让Excel Copilot/WPS智能表写函数、生成透视表、解读图表，告别死磕公式',hw:'把一张混乱表格交给表格AI，让它给出清洗+分析步骤'},
{t:'演示AI·一键成稿',d:'用Gamma/讯飞/文心等输入主题自动生成PPT大纲与排版',hw:'用演示AI做一份"自我介绍"PPT初稿'},
{t:'办公基础周总结',d:'整理本周学到的办公AI，沉淀可复用提示词',hw:'写3条办公AI提示词存进模板库'}
]},
{name:'🤝 AI协作助手',days:[
{t:'会议AI·纪要待办',d:'用飞书智能伙伴/腾讯会议AI自动生成会议纪要、提取待办、总结群聊重点',hw:'下次会议后用AI生成纪要并提炼3条待办'},
{t:'邮件AI·起草回复',d:'用AI按场景写邮件、润色语气、生成跟进模板，沟通更专业',hw:'用AI起草一封"催进度"邮件，礼貌不失分寸'},
{t:'日程与笔记AI',d:'用AI把零散笔记整理成结构化清单，自动安排日程优先级',hw:'把一周碎片灵感交给AI，整理成可执行任务清单'},
{t:'协作文档AI',d:'飞书/腾讯文档/Notion AI多人协作：实时总结、翻译、问答',hw:'在一个协作文档里用AI生成目录+要点摘要'},
{t:'协作助手周总结',d:'把会议/邮件/笔记AI串成个人协作流',hw:'画一张"会议纪要自动变待办"流程图'}
]},
{name:'🚀 高效工作流',days:[
{t:'脑图AI·理清思路',d:'用AI从文字自动生成思维导图/流程图（Xmind AI、飞书脑图等）',hw:'选一个正在学的话题，让AI生成一张知识脑图'},
{t:'多工具联动',d:'把文档/表格/演示AI串成流水线，例如"纪要→待办→PPT"',hw:'设计一个属于你的"会议纪要自动变PPT"小流程'},
{t:'自动化与模板库',d:'用AI搭可复用提示词与模板（周报/邮件/分析），以后一键调用',hw:'整理本周3个提示词，存进个人模板库',link:'https://www.feishu.cn'},
{t:'毕业实战',d:'组合多个办公AI完成一个真实任务，从0到交付',hw:'用至少3个办公AI协作完成一份完整方案'}
]}
]};
function switchAITab(t){DATA._aiTab=t;save(DATA);renderAI()}
function renderAI(){
var tab=DATA._aiTab||'software';
var tabs='<div class="sub-tabs"><div class="sub-tab'+(tab==='software'?' active':'')+'" onclick="switchAITab(\'software\')">🤖 AI软件学习</div><div class="sub-tab'+(tab==='drama'?' active':'')+'" onclick="switchAITab(\'drama\')">🎬 AI短剧制作</div><div class="sub-tab'+(tab==='work'?' active':'')+'" onclick="switchAITab(\'work\')">💼 AI工作软件</div></div>';
var h='';
if(tab==='software'){
var st=DATA.courses.aiSoftware||{day:1};var all=flat(AI_SW_COURSE);var idx=Math.min(st.day-1,all.length-1);var today=all[idx],next=all[idx+1];var pct=Math.round(Math.min(idx,all.length)/all.length*100);
h+='<div class="course-dual"><div class="course-col"><div class="course-col-head"><div class="course-col-icon ai">🤖</div><div><div class="course-col-title">'+AI_SW_COURSE.title+'</div><div class="course-col-goal">目标：'+AI_SW_COURSE.goal+'</div></div></div>';
h+='<div class="course-col-day">📅 第 '+st.day+' 天 / 共 '+all.length+' 天</div>';
h+='<div class="course-col-content"><div class="course-col-phase">'+today.phase+'</div><div class="course-col-name">'+today.t+'</div><div class="course-col-desc">'+today.d+'</div>';
if(today.link)h+='<a class="course-col-link" href="'+today.link+'" target="_blank">▶ 观看课程视频</a>';h+='</div>';
if(today.hw)h+='<div class="course-hw">📌 今日作业：'+today.hw+'</div>';
if(next)h+='<div class="course-next">📅 明日预告：<b>'+next.t+'</b></div>';
h+='<div class="course-col-bar"><div class="course-col-bar-fill" style="width:'+pct+'%"></div></div><div class="course-col-meta"><span>'+idx+'/'+all.length+' 天</span><span>'+pct+'%</span></div>';
h+='<div class="course-col-actions">';
if(st.day<=all.length)h+='<button class="c-btn primary" onclick="completeDay(\'aiSoftware\')">✓ 今日完成</button>';
h+='<button class="c-btn danger" onclick="resetCourse(\'aiSoftware\')">重置</button></div></div>';
h+='<div class="course-col"><div class="course-col-head"><div class="course-col-icon ai">💡</div><div><div class="course-col-title">AI工具速查</div><div class="course-col-goal">常用工具 · 一键直达</div></div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">💬 对话AI</div><div class="course-col-name">常用对话工具</div><div class="course-col-desc">• ChatGPT (chat.openai.com)<br>• Claude (claude.ai)<br>• Kimi (kimi.moonshot.cn)<br>• 豆包 (doubao.com)</div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">🎨 绘画AI</div><div class="course-col-name">常用绘画工具</div><div class="course-col-desc">• Midjourney (midjourney.com)<br>• 即梦AI (jimeng.jianying.com)<br>• Stable Diffusion (开源)<br>• DALL-E (OpenAI)</div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">🎬 视频AI</div><div class="course-col-name">常用视频工具</div><div class="course-col-desc">• 即梦AI视频<br>• Runway (runwayml.com)<br>• 剪映AI功能<br>• HeyGen 数字人</div></div>';
h+='</div></div>';
}else if(tab==='drama'){
var st=DATA.courses.aiDrama||{day:1};var all=flat(AI_DR_COURSE);var idx=Math.min(st.day-1,all.length-1);var today=all[idx],next=all[idx+1];var pct=Math.round(Math.min(idx,all.length)/all.length*100);
h+='<div class="course-dual"><div class="course-col"><div class="course-col-head"><div class="course-col-icon ai">🎬</div><div><div class="course-col-title">'+AI_DR_COURSE.title+'</div><div class="course-col-goal">目标：'+AI_DR_COURSE.goal+'</div></div></div>';
h+='<div class="course-col-day">📅 第 '+st.day+' 天 / 共 '+all.length+' 天</div>';
h+='<div class="course-col-content"><div class="course-col-phase">'+today.phase+'</div><div class="course-col-name">'+today.t+'</div><div class="course-col-desc">'+today.d+'</div>';
if(today.link)h+='<a class="course-col-link" href="'+today.link+'" target="_blank">▶ 观看课程视频</a>';h+='</div>';
if(today.hw)h+='<div class="course-hw">📌 今日作业：'+today.hw+'</div>';
if(next)h+='<div class="course-next">📅 明日预告：<b>'+next.t+'</b></div>';
h+='<div class="course-col-bar"><div class="course-col-bar-fill" style="width:'+pct+'%"></div></div><div class="course-col-meta"><span>'+idx+'/'+all.length+' 天</span><span>'+pct+'%</span></div>';
h+='<div class="course-col-actions">';
if(st.day<=all.length)h+='<button class="c-btn primary" onclick="completeDay(\'aiDrama\')">✓ 今日完成</button>';
h+='<button class="c-btn danger" onclick="resetCourse(\'aiDrama\')">重置</button></div></div>';
h+='<div class="course-col"><div class="course-col-head"><div class="course-col-icon ai">💰</div><div><div class="course-col-title">变现路径</div><div class="course-col-goal">从制作到赚钱</div></div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">📱 发布平台</div><div class="course-col-name">短剧上线渠道</div><div class="course-col-desc">• 抖音短剧频道<br>• 快手星芒短剧<br>• 微信视频号<br>• 小红书短视频<br>• B站短片区</div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">💰 变现模式</div><div class="course-col-name">赚钱方式</div><div class="course-col-desc">• 付费短剧（单集1-3元）<br>• 广告分成（平台流量）<br>• 品牌定制短剧<br>• IP授权/周边<br>• 知识付费（教别人做）</div></div>';
h+='</div></div>';
}else{
var st=DATA.courses.aiWork||{day:1};var all=flat(AI_WORK_COURSE);var idx=Math.min(st.day-1,all.length-1);var today=all[idx],next=all[idx+1];var pct=Math.round(Math.min(idx,all.length)/all.length*100);
h+='<div class="course-dual"><div class="course-col"><div class="course-col-head"><div class="course-col-icon ai">💼</div><div><div class="course-col-title">'+AI_WORK_COURSE.title+'</div><div class="course-col-goal">目标：'+AI_WORK_COURSE.goal+'</div></div></div>';
h+='<div class="course-col-day">📅 第 '+st.day+' 天 / 共 '+all.length+' 天</div>';
h+='<div class="course-col-content"><div class="course-col-phase">'+today.phase+'</div><div class="course-col-name">'+today.t+'</div><div class="course-col-desc">'+today.d+'</div>';
if(today.link)h+='<a class="course-col-link" href="'+today.link+'" target="_blank">▶ 观看课程视频</a>';h+='</div>';
if(today.hw)h+='<div class="course-hw">📌 今日作业：'+today.hw+'</div>';
if(next)h+='<div class="course-next">📅 明日预告：<b>'+next.t+'</b></div>';
h+='<div class="course-col-bar"><div class="course-col-bar-fill" style="width:'+pct+'%"></div></div><div class="course-col-meta"><span>'+idx+'/'+all.length+' 天</span><span>'+pct+'%</span></div>';
h+='<div class="course-col-actions">';
if(st.day<=all.length)h+='<button class="c-btn primary" onclick="completeDay(\'aiWork\')">✓ 今日完成</button>';
h+='<button class="c-btn danger" onclick="resetCourse(\'aiWork\')">重置</button></div></div>';
h+='<div class="course-col"><div class="course-col-head"><div class="course-col-icon ai">🔗</div><div><div class="course-col-title">常用AI办公工具</div><div class="course-col-goal">一键直达 · 提效神器</div></div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">📝 文档</div><div class="course-col-name">文档AI</div><div class="course-col-desc">• Word / WPS AI（智能写作）<br>• Notion AI（笔记）<br>• 飞书文档AI<br>• 通义 / 腾讯文档AI</div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">📊 表格</div><div class="course-col-name">表格AI</div><div class="course-col-desc">• Excel Copilot<br>• WPS 智能表格<br>• 飞书多维表格AI<br>• 腾讯文档智能表</div></div>';
h+='<div class="course-col-content"><div class="course-col-phase">🎤 会议</div><div class="course-col-name">会议AI</div><div class="course-col-desc">• 飞书智能伙伴<br>• 钉钉AI助理<br>• 腾讯会议AI纪要<br>• Otter / Fireflies</div></div>';
h+='</div></div>';
}
document.getElementById('learnContent').innerHTML=tabs+h;
}
// === NEWS (每日新知) - 本地news-latest.json驱动 + 实时兜底 ===
var NEWS_SEED=[{'title': '中共中央政治局召开会议 决定召开二十届五中全会 分析研究经济形势', 'source': '央视新闻', 'badge': 'cctv', 'time': '2026-07-30', 'link': 'https://new.qq.com/rain/a/20260730A0B0TF00', 'summary': '中共中央政治局7月30日召开会议，决定今年10月在北京召开二十届五中全会，主要议程包括报告工作、研究推进全面从严治党；会议同时分析研究当前经济形势，部署下半年经济工作，强调坚持稳中求进、加大逆周期调节、保障改善民生。'}, {'title': '反网络暴力法征求意见稿公开征求意见', 'source': '央视新闻', 'badge': 'cctv', 'time': '2026-07-30', 'link': 'https://new.qq.com/rain/a/20260730A02GIH00', 'summary': '国家网信办等部门起草《中华人民共和国反网络暴力法（征求意见稿）》公开征求意见，旨在预防、制止和惩治网络暴力，明确平台与个人责任，保护公民网络合法权益，营造清朗网络空间。'}, {'title': 'Kimi K3 全量开源 成全球最大开源大模型', 'source': '央视新闻', 'badge': 'cctv', 'time': '2026-07-30', 'link': 'https://new.qq.com/rain/a/20260730A02GIH00', 'summary': '国内AI企业月之暗面宣布将最新旗舰大模型Kimi K3全量开源，总参数达2.8万亿，为目前全球参数规模最大的开源大模型，有望降低中小企业AI应用门槛，推动行业生态发展。'}, {'title': 'C919高原型首架机完成首次飞行试验', 'source': '新华社', 'badge': 'xhs', 'time': '2026-07-29', 'link': 'https://new.qq.com/rain/a/20260730A02GIH00', 'summary': 'C919高原型首架机29日在上海浦东国际机场开展首次飞行试验，完成全部预定试飞科目，标志着C919飞机系列化发展迈出重要一步，将更好适应高原机场运行需求。'}, {'title': '上半年全国社会物流总额181.1万亿元 同比增5.1%', 'source': '新华社', 'badge': 'xhs', 'time': '2026-07-30', 'link': 'https://www.ayx.gov.cn/2026/07-30/3654420.html', 'summary': '数据显示，今年上半年全国社会物流总额达181.1万亿元，按可比价格计算同比增长5.1%，整体保持5%以上较快增长，反映国内经济循环畅通、需求稳步扩张的向好态势。'}, {'title': '个人贷款综合融资成本规定8月1日起施行', 'source': '央视新闻', 'badge': 'cctv', 'time': '2026-07-30', 'link': 'https://new.qq.com/rain/a/20260730A02GIH00', 'summary': '《个人贷款业务明示综合融资成本规定》将于8月1日起正式施行，要求个人贷款息费全面透明化，借款人可清晰了解真实融资成本，有助于保护金融消费者合法权益、规范市场秩序。'}, {'title': '国家防总维持多省防汛应急响应 四川启动地质灾害响应', 'source': '央视新闻', 'badge': 'cctv', 'time': '2026-07-30', 'link': 'https://new.qq.com/rain/a/20260730A02GIH00', 'summary': '国家防总维持针对广东、四川、甘肃的防汛四级应急响应，派出工作组指导广东防汛救灾；应急管理部针对四川启动国家地质灾害四级应急响应，四川局地有大到暴雨、部分地区大暴雨。'}, {'title': '邮政业十五五规划发布 2030年快递收入达2万亿', 'source': '国家邮政局', 'badge': 'yz', 'time': '2026-07-30', 'link': 'https://new.qq.com/rain/a/20260730A02GIH00', 'summary': '国家邮政局等多部门发布《邮政业发展十五五规划》，预计到2030年邮政行业业务收入达2.4万亿元、寄递业务量2900亿件、快递业务收入2万亿元，推动行业高质量发展。'}];
var _newsFetched=null;var _newsFilter='all';var _newsRegion='all';
var NEWS_SEED_EXTRA=[{'title':'联合国气候峰会达成新减排框架 多国承诺加快能源转型','source':'BBC中文','badge':'intl','region':'国际','time':'2026-07-30','link':'https://www.bbc.com/zhongwen','summary':'本年度联合国气候大会闭幕，与会各国就新的全球减排框架达成一致，发达经济体承诺加快可再生能源替代，并设立气候援助基金支持发展中国家绿色转型。'},{'title':'东莞地铁2号线延伸段今日开通 串联松山湖与中心城区','source':'东莞日报','badge':'dg','region':'东莞','time':'2026-07-30','link':'https://news.sun0769.com/','summary':'东莞轨道交通2号线延伸段正式投入运营，新增多个站点串联松山湖高新区与中心城区，通勤时间大幅缩短，沿线居民出行更便捷，也带动片区商业活力。'}];
var SEED_NEWS=NEWS_SEED.concat(NEWS_SEED_EXTRA);

// ===== 内置大轮播池（按日期自动轮换，无需联网/账号）=====
var NEWS_POOL=[
{title:'宝宝自主进食黄金期：1岁后别再追着喂',source:'育儿日报',badge:'edu',region:'国内',summary:'1岁半到3岁是锻炼自主进食的关键期，放手让孩子自己抓饭，哪怕弄脏，也是在练手眼协调和独立性。追着喂只会养成边玩边吃的习惯。',link:'#'},
{title:'全职妈妈每天留30分钟给自己，不是自私是充电',source:'成长指南',badge:'grow',region:'国内',summary:'带娃是体力+情绪双重消耗。每天固定留30分钟只属于自己——发呆、护肤、听首歌都行。把自己照顾好，才有能量爱家人。',link:'#'},
{title:'学化妆先练底妆，3个不卡粉小技巧',source:'美妆笔记',badge:'beauty',region:'国内',summary:'①妆前护肤别贪多，一层保湿足够；②粉底用美妆蛋拍开而非涂抹；③鼻翼嘴角用余粉带过。无效化妆自救从底妆开始。',link:'#'},
{title:'朋友圈信息过载？试试每天"信息断舍离"',source:'成长指南',badge:'grow',region:'国内',summary:'刷朋友圈越刷越焦虑？设定固定时间段看，其余时间关掉。少看别人的"高光"，多盯自己的"小进步"。',link:'#'},
{title:'孩子入园前一个月，先做这3件准备',source:'育儿日报',badge:'edu',region:'国内',summary:'①调整作息对齐幼儿园；②练习自己上厕所；③读入园绘本降低分离焦虑。准备越足，哭闹越少。',link:'#'},
{title:'想搞钱先记账：100元也能开始的理财习惯',source:'理财小课',badge:'money',region:'国内',summary:'独立的第一步是知道钱去哪了。每天花1分钟记一笔，月底看账单，你会惊讶"小钱"去哪了。理财不是有钱才做，是做了才有钱。',link:'#'},
{title:'一个人带娃崩溃时，试试"5分钟重启法"',source:'情感驿站',badge:'emo',region:'国内',summary:'情绪要崩时，把孩子放安全处，自己躲角落深呼吸5分钟，或洗把脸。5分钟足够让理智回来。自愈不是软弱，是本事。',link:'#'},
{title:'跳舞先从"跟节奏"开始，别急着学动作',source:'兴趣实验室',badge:'hobby',region:'国内',summary:'想学跳舞但怕丑？先每天跟着音乐晃身体10分钟找节奏感，再学基础。身体打开了，动作自然来。',link:'#'},
{title:'159小个子穿衣：高腰线是第一显高法则',source:'穿搭手册',badge:'style',region:'国内',summary:'无论上衣多长，下摆塞进高腰裤/裙，视觉腿长立刻+5cm。尖头鞋比圆头更显高，同色系上下装显修长。',link:'#'},
{title:'剪辑入门：先学会"剪掉废话"比加特效重要',source:'自媒体干货',badge:'media',region:'国内',summary:'新手剪视频，最大的误区是堆转场。先把啰嗦的部分剪掉，保留"钩子-痛点-结尾"，节奏清爽自然有人看。',link:'#'},
{title:'亲子阅读从"指认"开始，别一上来就读字',source:'育儿日报',badge:'edu',region:'国内',summary:'3岁前亲子阅读重点是"指图说话"和"互动提问"，不是认字。让孩子觉得书好玩，比认多少字都重要。',link:'#'},
{title:'长期带娃睡不好？睡前1小时远离手机',source:'健康时报',badge:'health',region:'国内',summary:'蓝光会抑制褪黑素。睡前1小时把手机放远，换成听白噪音或拉伸，入睡快一倍，第二天带娃更有精神。',link:'#'},
{title:'想做自媒体又怕镜头？先从"不露脸"开始',source:'自媒体干货',badge:'media',region:'国内',summary:'怕镜头就拍手、拍背影、拍桌面。口播不一定露脸，内容有价值就行。等习惯了再慢慢露出更多。',link:'#'},
{title:'情绪稳定的妈妈，孩子更有安全感',source:'成长指南',badge:'grow',region:'国内',summary:'你越急着控制情绪，越容易崩。允许自己偶尔烦躁，但事后抱抱孩子说"妈妈刚才有点累"。真实比完美更重要。',link:'#'},
{title:'东莞周末带娃好去处：免费公园+图书馆',source:'东莞本地宝',badge:'dg',region:'东莞',summary:'东莞各镇街图书馆和湿地公园大多免费。周末别只顾商场，带孩子去自然里跑跑，省钱又护眼。',link:'#'},
{title:'皮肤偏黄怎么调？内调+防晒比猛药管用',source:'美妆笔记',badge:'beauty',region:'国内',summary:'黄气多半来自熬夜和防晒不到位。早睡+每天防晒+一片维C，比贵妇精华更治本。耐心一个月见分晓。',link:'#'},
{title:'和娃说话多用"描述"少用"命令"',source:'育儿日报',badge:'edu',region:'国内',summary:'"把玩具收好"换成"玩具想回家睡觉了，我们送它们回去吧"。描述式语言孩子更愿意配合，也更爱表达。',link:'#'},
{title:'存"应急金"：从每月500元开始',source:'理财小课',badge:'money',region:'国内',summary:'独立的经济底气，从一笔"谁动都不行"的应急金开始。每月雷打不动存500，一年就是6000，心里踏实。',link:'#'},
{title:'内向不是缺点，是天然的好听众',source:'成长指南',badge:'grow',region:'国内',summary:'你不爱说，所以更会听。做自媒体把"倾听者"变成内容优势——替同样安静的人说出心里话，反而稀缺。',link:'#'},
{title:'孩子吃饭慢别催，给足20分钟',source:'育儿日报',badge:'edu',region:'国内',summary:'催饭会让孩子把吃饭和紧张挂钩。设定20分钟用餐时间，到点收碗不批评。放松的环境才养得出好胃口。',link:'#'},
{title:'学新技能怕坚持不下去？"微目标"破局',source:'成长指南',badge:'grow',region:'国内',summary:'别定"每天练1小时"，改成"今天只做2分钟"。门槛低到不可能失败，做着做着就超额了。坚持靠的是不费力的开始。',link:'#'},
{title:'黑眼圈重先调睡眠，别只靠遮瑕',source:'健康时报',badge:'health',region:'国内',summary:'遮瑕盖得住黑眼圈盖不住疲惫。23点前睡比任何眼霜都管用。带娃累，但你的睡眠也是家人的福气。',link:'#'},
{title:'想拍短视频没素材？"每天一件小事"就够',source:'自媒体干货',badge:'media',region:'国内',summary:'"今天给娃做了什么饭""今天学了个化妆小技巧"都是素材。真实日常最打动人，不必等"大事件"。',link:'#'},
{title:'想提升表达？每天"说给镜子听"3分钟',source:'成长指南',badge:'grow',region:'国内',summary:'镜头前不自信，就对着镜子讲今天一件小事，录下来回看。练一周，你会发现声音越来越稳。',link:'#'}
];
var INSPIRE_POOL=[
{title:'一人食快手早餐挑战',track:'美食赛道',heat:97,whyViral:'5分钟挑战类完播率高，宝妈群体特别关注——一个人也要好好吃饭的情绪共鸣强。',idea:'做「5分钟早餐挑战」系列：每天一款+营养标注+宝宝版改编。开头3秒展示成品，结尾留「明天换什么？」钩子。',videoUrl:'#'},
{title:'3岁宝宝今日有趣语录',track:'亲子赛道',heat:94,whyViral:'宝宝语录类永恒爆款，搞笑+暖心，真实不摆拍最打动人。',idea:'做「宝宝今日语录」：每天一句原话+妈妈解读+表情包字幕。录真实瞬间，不刻意教。',videoUrl:'#'},
{title:'一个人带娃的崩溃与自愈',track:'情感赛道',heat:99,whyViral:'崩溃→重启的情绪弧线算法最爱，真实情绪+反转结尾完播高，走「自愈」不卖惨。',idea:'做「崩溃后30分钟重启」：真实崩溃→自我调节→微笑重启。核心「我在自愈不是抱怨」。',videoUrl:'#'},
{title:'30天重启人生挑战',track:'成长赛道',heat:96,whyViral:'挑战型有陪伴感+激励属性，可视化进度条让人想追更。',idea:'做「30天重启挑战」：每天1个微改变+进度条+心得。开头手写计划纸，结尾「DayX完成」。',videoUrl:'#'},
{title:'零基础化妆真实记录',track:'美妆赛道',heat:92,whyViral:'真实记录比完美教程更打动人，成长型是美妆新趋势，允许丑→练稳→对比更可信。',idea:'做「陪我学化妆」：Day1素颜画眉允许丑，结尾标进步点。不卖产品只记录成长。',videoUrl:'#'},
{title:'159小个子显高穿搭公式',track:'穿搭赛道',heat:95,whyViral:'具体身高+公式化最强搜索词，159穿搭日均搜索10万+，收藏极高。',idea:'做「159显高5大公式」：上短下长/高腰线/尖头鞋+每公式3套实测+速查表。不露脸也能拍。',videoUrl:'#'},
{title:'内向妈妈的日常vlog',track:'情感赛道',heat:90,whyViral:'内向人群庞大且少被看见，真实记录「不爱说话但把家照顾得很好」极易共情。',idea:'做「内向者的安静一天」：不说话或少说话，用字幕+环境音讲心情。给同样安静的人一个角落。',videoUrl:'#'},
{title:'无效化妆自救日记',track:'美妆赛道',heat:93,whyViral:'「无效化妆」是2026新热词，卡粉浮粉脱妆的痛人人有，解决方案收藏率高。',idea:'做「无效化妆第N天」：今天又卡粉了→找到原因→明天改。把失败当内容，反而真实。',videoUrl:'#'},
{title:'宝宝入园倒计时30天',track:'亲子赛道',heat:88,whyViral:'入园季年度流量高峰，攻略型收藏极高，痛点精准。',idea:'做「入园倒计时第X天」：今天做了啥准备+宝宝反应+1条小贴士。真实可追更。',videoUrl:'#'},
{title:'100元理财小实验',track:'理财赛道',heat:85,whyViral:'经济独立是女性话题核心，路径型比情绪型转发高3倍，可执行。',idea:'做「100元理财实验」：100元怎么分+执行+月底收益。金句「独立从改变思维开始」。',videoUrl:'#'},
{title:'宝妈用AI做的第一件事',track:'科技赛道',heat:91,whyViral:'AI话题霸榜，普通人「拿来就能用」教程收藏高，恐慌+好奇双驱动。',idea:'做「宝妈用AI做的第一件事」：展示AI生成文案→步骤→你能怎么用。金句「AI帮你省3小时」。',videoUrl:'#'},
{title:'一个人也要好好吃晚饭',track:'情感赛道',heat:89,whyViral:'独居/独自带娃态度类TOP共鸣，治愈系完播高。',idea:'做「一个人也要好好吃」：一桌简单饭+一句心里话+对姐妹说晚安。金句「好好吃饭是爱自己最便宜方式」。',videoUrl:'#'},
{title:'学跳舞从跟节奏开始',track:'兴趣赛道',heat:82,whyViral:'跳舞类治愈+展示，怕丑人群多，「从0开始」真实记录有陪伴感。',idea:'做「学跳舞Day1」：先跟音乐晃身体找节奏，不急着学动作。允许笨拙，记录进步。',videoUrl:'#'},
{title:'全职妈妈的时间都去哪了',track:'情感赛道',heat:92,whyViral:'时间焦虑是宝妈共性痛点，「记账式一天」引发强烈共鸣。',idea:'做「我的一天24小时」：从睁眼到睡着的真实时间线。结尾「原来我没闲着」，给同款妈妈正名。',videoUrl:'#'},
{title:'不露脸也能做的3种短视频',track:'自媒体赛道',heat:87,whyViral:'镜头恐惧是新手最大门槛，「不露脸方案」搜索量大。',idea:'做「不露脸3招」：拍手/拍桌面/拍背影+画外音。降低门槛，先动起来。',videoUrl:'#'},
{title:'黑眼圈自救：早睡胜过贵妇眼霜',track:'健康赛道',heat:84,whyViral:'熬夜带娃黑眼圈是集体痛点，「不花钱解法」收藏高。',idea:'做「战黑眼圈Day1」：23点前睡+防晒+一片维C。一个月对比，真实记录。',videoUrl:'#'},
{title:'讨好型人格的我，学会说不了',track:'成长赛道',heat:90,whyViral:'讨好型是庞大隐性群体，「学会拒绝」爽感+共鸣双高。',idea:'做「今天我拒绝了一次」：场景+心理活动+事后轻松感。不批判谁，只讲自己的小突破。',videoUrl:'#'},
{title:'皮肤偏黄调亮日记',track:'美妆赛道',heat:83,whyViral:'黄气焦虑普遍，「内调+防晒」科学向内容信任度高。',idea:'做「去黄Day1」：早睡+防晒+维C。每月对比，不推产品只记录。',videoUrl:'#'},
{title:'陪娃写作业前的心理建设',track:'亲子赛道',heat:86,whyViral:'辅导作业是全民痛点，「先稳住自己」角度稀缺。',idea:'做「辅导前深呼吸」：今天预演3句话避免发火。真实+实用，家长爱看。',videoUrl:'#'},
{title:'我的50件小确幸清单',track:'成长赛道',heat:81,whyViral:'小确幸类治愈向，容易引发「我的也是」评论互动。',idea:'做「今天的小确幸」：一件微不足道但开心的事+为什么。每天一条，攒成系列。',videoUrl:'#'},
{title:'第一次剪视频手忙脚乱',track:'自媒体赛道',heat:85,whyViral:'剪辑新手困境真实，「踩坑记录」比教程更亲切。',idea:'做「剪视频翻车记」：今天又卡在哪+怎么解决的。把笨拙拍出来，反而有人陪你。',videoUrl:'#'},
{title:'全职妈妈重返职场准备',track:'成长赛道',heat:88,whyViral:'重返职场2026社会话题，真实故事转发高，自带情绪共鸣。',idea:'做「重返职场Day1准备简历」：为什么想回去+做了啥准备+给姐妹一句话。不卖惨有底气。',videoUrl:'#'},
{title:'一个人带娃的周末怎么过',track:'情感赛道',heat:87,whyViral:'周末带娃是独家痛点，「真实安排」参考价值高。',idea:'做「一个人的周末带娃」：去哪+吃了啥+累了怎么歇。给独自带娃的人一份参照。',videoUrl:'#'},
{title:'学化妆先练这3步',track:'美妆赛道',heat:89,whyViral:'化妆新手最需「极简入门」，步骤清晰收藏高。',idea:'做「化妆3步入门」：底妆+眉+口红。不追求全妆，先敢画出门。每步慢讲。',videoUrl:'#'},
{title:'内向不是缺点',track:'成长赛道',heat:86,whyViral:'内向污名化普遍，「为内向正名」引发群体共鸣。',idea:'做「内向的3个隐藏优势」：会听/深想/稳定。不劝变外向，讲接纳。',videoUrl:'#'},
{title:'宝宝自主进食训练',track:'亲子赛道',heat:84,whyViral:'自主进食是1-3岁刚需，「不追喂」实操收藏高。',idea:'做「放手让娃自己吃」：弄脏没关系+3个引导技巧。真实记录进步。',videoUrl:'#'},
{title:'东莞免费带娃地图',track:'本地赛道',heat:80,whyViral:'本地便民内容精准且稀缺，东莞宝妈检索量大。',idea:'做「东莞免费遛娃地」：图书馆/公园/场馆清单+实测。实用收藏款。',videoUrl:'#'},
{title:'存钱从500开始',track:'理财赛道',heat:83,whyViral:'微存钱挑战低门槛高参与，「小钱积累」共鸣强。',idea:'做「每月存500」：雷打不动+年底惊喜。金句「底气是存出来的」。',videoUrl:'#'},
{title:'镜头前不自信怎么办',track:'自媒体赛道',heat:88,whyViral:'镜头恐惧普遍，「克服过程」陪伴感强。',idea:'做「对着镜子练说话」：每天3分钟+回看。一周对比，声音变稳。',videoUrl:'#'},
{title:'先敢出现，再谈变好',track:'成长赛道',heat:91,whyViral:'「先完成再完美」是行动派金句，治愈拖延与自我设限。',idea:'做「今天先发出去」：不完美的视频也发。金句「敢出现就赢了一半」。贯穿你的人设。',videoUrl:'#'}
];
var HOT_POOL=[
{title:'影视剧经典名场面二创',track:'影视热点',heat:90,whyViral:'名场面自带流量，宝妈视角解说反差感强。',fitReason:'你爱看剧，用真实生活对照名场面，天然有梗。',adaptPlan:'📌《当妈后看这部剧笑了》\n⚡开头：「生娃前觉得这幕矫情，生娃后破防」\n📝结构：名场面+你的对照+一句感悟\n💡金句：「当妈后才懂」\n🎬结尾：「你呢？」',videoUrl:'#'},
{title:'热门BGM变装卡点',track:'音乐热点',heat:93,whyViral:'卡点变装完播率高，门槛低人人可拍。',fitReason:'你159小个子+温柔气质，素人变装更真实。',adaptPlan:'📌《30秒素人变装》\n⚡开头：素颜居家原相机\n📝结构：音乐起→换装→定格\n💡金句：「变装不如变自己」\n🎬结尾：鼓励同样普通的姐妹',videoUrl:'#'},
{title:'社会暖闻「如果我是当事人」回应',track:'情感热点',heat:88,whyViral:'暖闻引发共情，第一人称回应更有温度。',fitReason:'你善良柔软，读暖闻最打动人。',adaptPlan:'📌《如果是我，我会…》\n⚡开头：复述暖闻一句话\n📝结构：新闻+你的假设反应+温柔看法\n💡金句：「善良不是傻」\n🎬结尾：把善意传下去',videoUrl:'#'},
{title:'沉浸式收纳打扫vlog',track:'生活热点',heat:85,whyViral:'解压治愈，宝妈群体爱看真实家务。',fitReason:'你带娃家里乱，真实收纳有共鸣。',adaptPlan:'📌《带娃间隙收拾家》\n⚡开头：一片狼藉全景\n📝结构：边收边碎碎念+成果对比\n💡金句：「家净心也净」\n🎬结尾：娃醒了赶紧溜',videoUrl:'#'},
{title:'反差转场「带娃前vs带娃后」',track:'技术热点',heat:91,whyViral:'转场技术+共鸣文案，算法最爱。',fitReason:'你的前后反差本身就是内容。',adaptPlan:'📌《同个角落·两种人生》\n⚡开头：妆发精致旧照\n📝结构：转场→素颜带娃现况\n💡金句：「我选的，不悔」\n🎬结尾：笑着重来',videoUrl:'#'},
{title:'老歌新跳挑战',track:'舞蹈热点',heat:82,whyViral:'经典老歌+笨拙起舞，治愈又励志。',fitReason:'你正学跳舞，翻跳老歌正好练。',adaptPlan:'📌《陪我跳支老歌》\n⚡开头：「肢体不协调但想试试」\n📝结构：跟练→卡壳→完成\n💡金句：「笨拙也值得记录」\n🎬结尾：「明天换一首」',videoUrl:'#'},
{title:'一句话科普二创',track:'知识热点',heat:84,whyViral:'短平快知识完播高，宝妈爱收藏。',fitReason:'你把知识讲给姐妹听，亲切可信。',adaptPlan:'📌《1句话说清XX》\n⚡开头：抛一个常见误区\n📝结构：正解+生活例子\n💡金句：「懂点真好」\n🎬结尾：「下期讲啥你定」',videoUrl:'#'},
{title:'萌宠剧情二创',track:'萌宠热点',heat:89,whyViral:'宠物+剧情永远吸粉，治愈解压。',fitReason:'你家娃+宠物素材随手可得。',adaptPlan:'📌《我家主子是娃》\n⚡开头：宠物抢镜名场面\n📝结构：剧情小剧场+字幕\n💡金句：「它比娃乖」\n🎬结尾：全家笑',videoUrl:'#'},
{title:'硬核手工解压二创',track:'手工热点',heat:80,whyViral:'手工过程解压，沉浸感强。',fitReason:'你性子静，手工类适合你节奏。',adaptPlan:'📌《一个人做件小物》\n⚡开头：材料铺开\n📝结构：慢动作制作+成品\n💡金句：「手忙心静」\n🎬结尾：送给自己',videoUrl:'#'},
{title:'城市夜骑citywalk二创',track:'旅行热点',heat:83,whyViral:'夜骑citywalk是2026新风潮，松弛感拉满。',fitReason:'东莞街巷你熟，拍本地walk稀缺。',adaptPlan:'📌《东莞夜晚走走》\n⚡开头：傍晚出门\n📝结构：路线+小店+感受\n💡金句：「慢下来才看见」\n🎬结尾：明天去哪',videoUrl:'#'},
{title:'非遗国风变装二创',track:'文化热点',heat:86,whyViral:'国风文化自信，变装视觉冲击强。',fitReason:'你温柔气质配国风妆容加分。',adaptPlan:'📌《素人到国风》\n⚡开头：日常素颜\n📝结构：化妆+换装+定格\n💡金句：「美有多种」\n🎬结尾：文化自信',videoUrl:'#'},
{title:'毕业季开学二创',track:'校园热点',heat:81,whyViral:'毕业/开学季年度话题，情绪浓度高。',fitReason:'娃入园也是「开学」，你能接。',adaptPlan:'📌《送娃入园第一天》\n⚡开头：校门口背影\n📝结构：准备+分离+自己自由\n💡金句：「目送也是爱」\n🎬结尾：去喝杯奶茶',videoUrl:'#'},
{title:'打工人一天二创',track:'职场热点',heat:84,whyViral:'打工人共鸣强，真实记录最动人。',fitReason:'你重返职场线可接此选题。',adaptPlan:'📌《假如我回去上班》\n⚡开头：幻想通勤画面\n📝结构：想象vs现实\n💡金句：「我在准备」\n🎬结尾：每日进步',videoUrl:'#'},
{title:'反套路短剧二创',track:'剧情热点',heat:87,whyViral:'反套路反转让人想看完，完播高。',fitReason:'你爱看剧，翻拍反套路信手拈来。',adaptPlan:'📌《当妈版反转剧》\n⚡开头：俗套开头\n📝结构：反转+妈妈视角\n💡金句：「生活比剧精彩」\n🎬结尾：留悬念',videoUrl:'#'},
{title:'美食翻车vs成功二创',track:'美食热点',heat:85,whyViral:'翻车真实感强，成功对比有爽点。',fitReason:'你做饭真实翻车，素材现成。',adaptPlan:'📌《今天又翻车了》\n⚡开头：黑暗料理特写\n📝结构：翻车→补救→成功\n💡金句：「家常就好」\n🎬结尾：开吃',videoUrl:'#'},
{title:'旧物改造二创',track:'环保热点',heat:79,whyViral:'旧物新生治愈又实用，收藏高。',fitReason:'娃的旧衣旧玩具你能改造。',adaptPlan:'📌《娃的旧物新生》\n⚡开头：准备扔的东西\n📝结构：改造过程+成品\n💡金句：「舍不得就改造」\n🎬结尾：继续用',videoUrl:'#'},
{title:'居家健身打卡二创',track:'健康热点',heat:82,whyViral:'居家健身低门槛，陪伴感强。',fitReason:'你黑眼圈带娃，健身自愈贴人设。',adaptPlan:'📌《带娃间隙动一动》\n⚡开头：娃睡了赶紧动\n📝结构：3个简单动作\n💡金句：「动比不动强」\n🎬结尾：明天继续',videoUrl:'#'},
{title:'经典动画配音二创',track:'配音热点',heat:83,whyViral:'配音反差萌，声音党最爱。',fitReason:'你声音温柔适合配音。',adaptPlan:'📌《用妈妈音配名场面》\n⚡开头：原片段\n📝结构：你的配音+反应\n💡金句：「声音也是戏」\n🎬结尾：点单',videoUrl:'#'},
{title:'带娃周边游plog二创',track:'旅行热点',heat:80,whyViral:'亲子游实用，宝妈爱收藏攻略。',fitReason:'东莞周边你熟，实测稀缺。',adaptPlan:'📌《周末带娃去哪》\n⚡开头：出发\n📝结构：路线+花费+体验\n💡金句：「近处也有风景」\n🎬结尾：下周计划',videoUrl:'#'},
{title:'国风妆容二创',track:'美妆热点',heat:84,whyViral:'国风妆容视觉美，教程收藏高。',fitReason:'你学化妆，国风是正统练习。',adaptPlan:'📌《我的国风妆练习》\n⚡开头：素颜\n📝结构：步骤+翻车点\n💡金句：「练就对了」\n🎬结尾：下次更好',videoUrl:'#'}
];
function todayStr(){var d=new Date();var m=('0'+(d.getMonth()+1)).slice(-2);var day=('0'+d.getDate()).slice(-2);return d.getFullYear()+'-'+m+'-'+day}
function _dayIdx(){var t=new Date();var e=new Date(2026,0,1);return Math.floor((t-e)/86400000)}
function _pick(pool,n){var d=_dayIdx();var len=pool.length;var start=(((d*7)%len)+len)%len;var out=[];for(var i=0;i<n;i++){out.push(pool[(start+i)%len])}return out}
function _dailyNews(){return _pick(NEWS_POOL,8).map(function(it){var o={};for(var k in it)o[k]=it[k];if(!o.time)o.time=todayStr();return o})}
function _dailyInspire(){return {date:todayStr(),platform:'抖音',items:_pick(INSPIRE_POOL,6).map(function(it,i){var o={};for(var k in it)o[k]=it[k];o.rank='今日'+(i+1);return o})}}
function _dailyHot(){return {date:todayStr(),platform:'抖音',items:_pick(HOT_POOL,6).map(function(it,i){var o={};for(var k in it)o[k]=it[k];o.rank='今日'+(i+1);return o})}}

function renderSourceRow(){
 var all=SEED_NEWS.concat(_newsFetched||[]);
 var regions=[{k:'all',t:'🌐 全部',c:''},{k:'国内',t:'🇨🇳 国内',c:'r-guo'},{k:'国际',t:'🌍 国际',c:'r-intl'},{k:'东莞',t:'📍 东莞本地',c:'r-dg'}];
 var rh='';regions.forEach(function(r){rh+='<div class="news-src-tag news-region-tag '+(r.c||'')+(r.k===_newsRegion?' active':'')+'" onclick="filterNewsRegion(\''+r.k+'\')">'+r.t+'</div>'});
 var rbox=document.getElementById('newsRegionRow');if(rbox)rbox.innerHTML=rh;
 var sources=[];all.forEach(function(n){if(sources.indexOf(n.source)<0)sources.push(n.source)});
 var h='<div class="news-src-tag'+( _newsFilter==='all'?' active':'')+'" onclick="filterNews(\'all\')">📰 全部来源</div>';
 sources.forEach(function(s){h+='<div class="news-src-tag'+(s===_newsFilter?' active':'')+'" onclick="filterNews(\''+s.replace(/'/g,"\\'")+'\')">'+escAttr(s)+'</div>'});
 var box=document.getElementById('newsSourceRow');if(box)box.innerHTML=h;
}
function filterNewsRegion(r){_newsRegion=r;renderSourceRow();renderNewsItems();}
function filterNews(src){
 _newsFilter=src;var tags=document.querySelectorAll('#newsSourceRow .news-src-tag');
 tags.forEach(function(t){t.classList.remove('active')});
 if(src==='all'){if(tags[0])tags[0].classList.add('active')}
 else{tags.forEach(function(t){if(t.getAttribute('onclick')&&t.getAttribute('onclick').indexOf(src)>=0)t.classList.add('active')})}
 renderNewsItems();
}
function renderNewsItems(){
 var items=(_newsFetched||_dailyNews()).slice();
 if(_newsFilter!=='all'){items=items.filter(function(n){return n.source===_newsFilter})}
 if(_newsRegion!=='all'){items=items.filter(function(n){return (n.region||'国内')===_newsRegion})}
 var nl=document.getElementById('newsList');if(!nl)return;
 if(!items.length){nl.innerHTML='<div class="news-error">该筛选下暂无新闻，请切换「全部」或刷新试试</div>';return}
 var h='';
 items.forEach(function(n){
  var link=n.link||'#';var region=n.region||'国内';
  var rcls=region==='国际'?'r-intl':region==='东莞'?'r-dg':'r-guo';
  h+='<div class="news-item">';
  h+='<span class="news-region-chip '+rcls+'">'+region+'</span>';
  h+='<div class="news-title">'+escAttr(n.title||'')+'</div>';
  h+='<div class="news-meta-row"><span class="news-source">资讯来源：'+escAttr(n.source||'')+'</span><span class="news-time">｜发布时间：'+escAttr(n.time||'')+'</span></div>';
  if(n.summary)h+='<div class="news-summary">内容摘要：'+escAttr(n.summary)+'</div>';
  h+='<a class="news-link" href="'+escAttr(link)+'" target="_blank" rel="noopener">🔗 点击跳转阅读原文</a>';
  h+='</div>';
 });
  nl.innerHTML=h;
 var st=document.getElementById('newsStatus');if(st)st.textContent='📡 已加载 '+items.length+' 条'+(_newsFetched?'（实时新闻）':'（今日示例 · 实时获取暂不可用）');
}
function renderNews(){renderSourceRow();_newsFetched=null;renderNewsItems();fetchNewsLocal();}
function fetchNewsLocal(){
 fetch('data/news-latest.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json()}).then(function(d){
  if(d&&d.items&&d.items.length){_newsFetched=d.items;renderSourceRow();renderNewsItems();var st=document.getElementById('newsStatus');if(st)st.textContent='📡 已加载 '+d.items.length+' 条'+(d.date?('（更新于 '+d.date+'）'):'')}
  else{_newsFetched=null;renderNewsItems()}
 }).catch(function(e){_newsFetched=null;renderNewsItems()})
}
function refreshNews(){renderNews();showToast('正在刷新实时新闻…','success')}

// === 收藏（选题灵感 / 爆款二创 通用）===
var FAV_KEY_I='growth_v5_fav_inspire',FAV_KEY_H='growth_v5_fav_hot';
var _inspCur=[],_hotCur=[],_inspFav=false,_hotFav=false;
function _favKey(k){return k==='inspire'?FAV_KEY_I:FAV_KEY_H}
function _favArr(k){try{return JSON.parse(localStorage.getItem(_favKey(k)))||[]}catch(e){return[]}}
function _favId(it){return (it.rank||'')+'::'+(it.title||'')}
function _isFav(k,it){var id=_favId(it);return _favArr(k).some(function(f){return _favId(f)===id})}
function _toggleFav(k,it){var arr=_favArr(k);var id=_favId(it);var found=false;for(var i=0;i<arr.length;i++){if(_favId(arr[i])===id){arr.splice(i,1);found=true;break}}if(!found)arr.push(it);localStorage.setItem(_favKey(k),JSON.stringify(arr));return !found}
function _favCount(k){return _favArr(k).length}
function favClick(k,idx,fromFav){var it=fromFav?_favArr(k)[idx]:(k==='inspire'?_inspCur:_hotCur)[idx];if(!it)return;var added=_toggleFav(k,it);showToast(added?'已收藏 ⭐ 拍摄前随时来翻':'已取消收藏','info');if(k==='inspire'){_inspFav?renderInspireFavs():renderInspireData({items:_inspCur,date:''});updateFavBtn('inspire')}else{_hotFav?renderHotFavs():renderHotData({items:_hotCur,date:''});updateFavBtn('hot')}}
function updateFavBtn(k){var b=document.getElementById(k==='inspire'?'inspireFavBtn':'hotFavBtn');if(b)b.textContent='⭐ 我的收藏('+_favCount(k)+')'+((k==='inspire'?_inspFav:_hotFav)?' · 查看中':'')}
function toggleInspireFavView(){_inspFav=!_inspFav;_inspFav?renderInspireFavs():renderInspireData({items:_inspCur,date:''});updateFavBtn('inspire')}
function toggleHotFavView(){_hotFav=!_hotFav;_hotFav?renderHotFavs():renderHotData({items:_hotCur,date:''});updateFavBtn('hot')}
function renderInspireFavs(){var arr=_favArr('inspire');var g=document.getElementById('inspireGrid');if(!g)return;if(!arr.length){g.innerHTML='<div class="ws-notfound">还没有收藏的话题～ 点卡片右上角 ★ 收藏你感兴趣的内容，拍摄前随时来翻找灵感</div>';return}var h='';arr.forEach(function(it,idx){h+='<div class="hot-item">';h+='<button class="fav-btn active" title="取消收藏" onclick="favClick(\'inspire\','+idx+',true)">★</button>';h+='<div class="hot-hd"><span class="hot-rank">'+escAttr(it.rank||'★')+'</span>';if(it.track)h+='<span class="hot-track">'+escAttr(it.track)+'</span>';h+='</div>';h+='<a class="hot-title" href="'+escAttr(it.videoUrl||'#')+'" target="_blank" rel="noopener">'+escAttr(it.title)+' 🔗</a>';if(it.whyViral)h+='<div class="hot-analysis"><b>🔥 火爆原因：</b>'+escAttr(it.whyViral)+'</div>';if(it.idea){h+='<div class="hot-bottom"><div class="hot-bottom-label">💡 原创创作思路</div><div class="hot-inspire">'+escAttr(it.idea)+'</div></div>'}h+='</div>'});g.innerHTML=h}
function renderHotFavs(){var arr=_favArr('hot');var g=document.getElementById('hotGrid');if(!g)return;if(!arr.length){g.innerHTML='<div class="ws-notfound">还没有收藏的话题～ 点卡片右上角 ★ 收藏你感兴趣的内容，拍摄前随时来翻找灵感</div>';return}var h='';arr.forEach(function(it,idx){h+='<div class="hot-item">';h+='<button class="fav-btn active" title="取消收藏" onclick="favClick(\'hot\','+idx+',true)">★</button>';h+='<div class="hot-hd"><span class="hot-rank">'+escAttr(it.rank||'★')+'</span>';if(it.track)h+='<span class="hot-track">'+escAttr(it.track)+'</span>';h+='</div>';h+='<a class="hot-title" href="'+escAttr(it.videoUrl||'#')+'" target="_blank" rel="noopener">'+escAttr(it.title)+' 🔗</a>';if(it.whyViral)h+='<div class="hot-analysis"><b>🔥 火爆原因：</b>'+escAttr(it.whyViral)+'</div>';if(it.fitReason)h+='<div class="hot-fit"><b>🎙 适配你的口播：</b>'+escAttr(it.fitReason)+'</div>';if(it.adaptPlan){h+='<div class="hot-bottom"><div class="hot-bottom-label">🎬 二创改编方案</div><div class="hot-script">'+escAttr(it.adaptPlan)+'</div></div>'}h+='</div>'});g.innerHTML=h}
// === INSPIRE (选题灵感 - 内嵌数据，无需fetch) ===
var INSPIRE_SEED={"date":"2026-07-30","platform":"抖音","track":"各平台赛道单日爆款","items":[{"rank":"TOP1","title":"一人食快手早餐挑战","track":"美食赛道","heat":97,"whyViral":"5分钟挑战类完播率超75%，宝妈群体特别关注——一个人也要好好吃饭的情绪共鸣强，实用又有温度。","idea":"做「5分钟早餐挑战」系列：每天一款+营养标注+食材成本+宝宝版改编。开头3秒直接展示成品，结尾留「明天换什么？」钩子。","videoUrl":"https://www.douyin.com/search/%E4%B8%80%E4%BA%BA%E9%A3%9F%E5%BF%AB%E6%89%8B%E6%97%A9%E9%A4%90"},{"rank":"TOP2","title":"3岁宝宝今日有趣语录","track":"亲子赛道","heat":94,"whyViral":"宝宝语录类是亲子赛道永恒爆款，搞笑+暖心日均播放千万+，真实不摆拍最打动人。","idea":"做「宝宝今日语录」系列：每天一句原话+妈妈解读+表情包字幕。不要刻意教，录真实瞬间。","videoUrl":"https://www.douyin.com/search/3%E5%B2%81%E5%AE%9D%E5%AE%9D%E8%AF%AD%E5%BD%95"},{"rank":"TOP3","title":"一个人带娃的崩溃与自愈","track":"情感赛道","heat":99,"whyViral":"崩溃→重启的情绪弧线是算法最爱，真实情绪+反转结尾完播率极高；但注意走「自愈」不卖惨。","idea":"做「崩溃后30分钟重启」系列：真实崩溃画面→自我调节→微笑重启。核心是「我不是在抱怨，是在自愈」，避免引战。","videoUrl":"https://www.douyin.com/search/%E4%B8%80%E4%B8%AA%E4%BA%BA%E5%B8%A6%E5%A8%83%E5%B4%A9%E6%BA%83%E8%87%AA%E6%84%88"},{"rank":"TOP4","title":"30天重启人生挑战","track":"成长赛道","heat":96,"whyViral":"挑战型内容有陪伴感+激励属性，可视化进度条让人想追更，2026年成长赛道TOP话题。","idea":"做「30天重启挑战」系列：每天1个微改变+进度条+心得。开头手写计划纸，结尾「DayX完成」。","videoUrl":"https://www.douyin.com/search/30%E5%A4%A9%E9%87%8D%E5%90%AF%E4%BA%BA%E7%94%9F%E6%8C%91%E6%88%98"},{"rank":"TOP5","title":"零基础化妆真实记录","track":"美妆赛道","heat":92,"whyViral":"真实记录比完美教程更打动人，成长型内容是美妆新趋势；允许丑→练稳→对比，反而更可信。","idea":"做「陪我学化妆」系列：Day1素颜画眉允许丑，结尾标注进步点。不卖产品，只记录成长。","videoUrl":"https://www.douyin.com/search/%E9%9B%B6%E5%9F%BA%E7%A1%80%E5%8C%96%E5%A6%86%E7%9C%9F%E5%AE%9E%E8%AE%B0%E5%BD%95"},{"rank":"TOP6","title":"159小个子显高穿搭公式","track":"穿搭赛道","heat":95,"whyViral":"具体身高+公式化是最强搜索词组合，159cm穿搭笔记日均搜索10万+，收藏率极高。","idea":"做「159显高5大公式」系列：上短下长/高腰线/尖头鞋+每公式3套实测+速查表。不露脸也能拍。","videoUrl":"https://www.douyin.com/search/159%E5%B0%8F%E4%B8%AA%E5%AD%90%E6%98%BE%E9%AB%98%E7%A9%BF%E6%90%AD"}]};
function renderInspire(){_inspFav=false;renderInspireData(_dailyInspire());fetchInspireLocal()}
function fetchInspireLocal(){fetch('data/inspire-latest.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json()}).then(function(d){if(d&&d.items&&d.items.length){renderInspireData(d);var lb=document.getElementById('inspireLabel');if(lb)lb.textContent='🔥 今日爆款选题 · '+(d.date||'')+(d.platform?(' · '+d.platform):'')}}).catch(function(e){})}
function renderInspireData(d){
  var grid=document.getElementById('inspireGrid');if(!grid)return;
  if(!d||!d.items||!d.items.length){grid.innerHTML='<div class="ws-notfound">今日暂无采集数据，请稍后刷新。</div>';return;}
  var lbl=document.getElementById('inspireLabel');if(lbl)lbl.textContent='🔥 今日爆款选题 · '+escAttr(d.date||'')+(d.platform?(' · '+escAttr(d.platform)):'');
  _inspCur=d.items.slice();
  var h='';
  d.items.forEach(function(it,idx){
    h+='<div class="hot-item">';
    h+='<button class="fav-btn'+(_isFav('inspire',it)?' active':'')+'" title="收藏/取消" onclick="favClick(\'inspire\','+idx+',false)">★</button>';
    h+='<div class="hot-top">';
    h+='<div class="hot-hd"><span class="hot-rank">'+escAttr(it.rank||'TOP')+'</span>';
    if(it.track)h+='<span class="hot-track">'+escAttr(it.track)+'</span>';
    h+='</div>';
    h+='<a class="hot-title" href="'+escAttr(it.videoUrl||'#')+'" target="_blank" rel="noopener">'+escAttr(it.title)+' 🔗</a>';
    h+='<div class="hot-bar-row"><div class="hot-bar"><div class="hot-bar-fill" style="width:'+(it.heat||80)+'%"></div></div><span style="font-size:11px;font-weight:700;color:var(--accent-d);white-space:nowrap">🔥'+(it.heat||80)+'</span></div>';
    if(it.whyViral)h+='<div class="hot-analysis"><b>🔥 火爆原因：</b>'+escAttr(it.whyViral)+'</div>';
    h+='</div>';
    if(it.idea){
      h+='<div class="hot-bottom">';
      h+='<div class="hot-bottom-label">💡 原创创作思路</div>';
      h+='<div class="hot-inspire">'+escAttr(it.idea)+'</div>';
      h+='<a class="course-col-link" href="'+escAttr(it.videoUrl||'#')+'" target="_blank" rel="noopener">▶ 查看原视频</a>';
      h+='</div>';
    }
    h+='</div>';
  });
  grid.innerHTML=h;updateFavBtn('inspire');
}
function refreshInspire(){renderInspire();showToast('已刷新今日爆款选题','success')}
// === HOT (爆款二创 - 内嵌数据，无需fetch) ===
var HOT_SEED={"date":"2026-07-30","platform":"抖音","items":[{"rank":"TOP1","title":"全职妈妈重返职场","track":"全网热点","heat":88,"whyViral":"重返职场是2026年社会关注话题，真实故事转发率极高，自带情绪共鸣和讨论度。","fitReason":"你正在走「自我重启流」，本身就在经历从带娃到重新出发，口播真实有底气，不卖惨反而更打动人。","adaptPlan":"📌《重返职场Day1：准备简历》\n⚡开头3秒：对着镜子说「3年没上班，今天我开始准备」\n📝结构：1)为什么想回去 2)做了哪些准备 3)写给同样迷茫的姐妹一句话\n💡金句：「重启不是从零，是带着3年的成长重新出发」\n🎬结尾：展示今日进度+「明天投递第一份」\n⏱45-60秒","videoUrl":"https://www.douyin.com/search/%E5%85%A8%E8%81%8C%E5%A6%88%E5%A6%88%E9%87%8D%E8%BF%94%E8%81%8C%E5%9C%BA"},{"rank":"TOP2","title":"AI工具突然爆火","track":"全网热点","heat":95,"whyViral":"AI话题持续霸榜，普通人「拿来就能用」的教程收藏率极高，恐慌+好奇双重驱动。","fitReason":"你也在学剪辑/自媒体，可以用「宝妈视角学AI」人设，真实踩坑比科技博主更亲切。","adaptPlan":"📌《宝妈用AI做的第一件事》\n⚡开头3秒：展示AI生成的一段文案「这竟然是AI写的？」\n📝结构：1)我用AI做了什么 2)步骤超简单 3)你能怎么用\n💡金句：「AI不是替代你，是帮你省3小时」\n🎬结尾：「下期教你怎么用AI剪视频」\n⏱60秒","videoUrl":"https://www.douyin.com/search/AI%E5%B7%A5%E5%85%B7%E7%88%86%E7%81%AB"},{"rank":"TOP3","title":"一人食 / 独居生活","track":"全网热点","heat":90,"whyViral":"独居生活态度类是2026年TOP情感共鸣话题，态度>教程，治愈系内容完播率高。","fitReason":"你独自带娃其实也是「一个人扛」，可以把「一个人也要好好过」拍成日常仪式感，极易共情。","adaptPlan":"📌《一个人也要好好吃晚饭》\n⚡开头3秒：一桌简单的饭+字幕「一个人，也要好好吃」\n📝结构：1)今天做了什么菜 2)边吃边说一句心里话 3)对屏幕外的姐妹说晚安\n💡金句：「好好吃饭，是爱自己最便宜的方式」\n🎬结尾：关灯道晚安\n⏱30-45秒","videoUrl":"https://www.douyin.com/search/%E4%B8%80%E4%BA%BA%E9%A3%9F%E7%8B%AC%E5%B1%85%E7%94%9F%E6%B4%BB"},{"rank":"TOP4","title":"宝宝入园焦虑","track":"全网热点","heat":86,"whyViral":"入园季是亲子赛道年度流量高峰，攻略型内容收藏率极高，痛点精准。","fitReason":"娃正要上幼儿园，你是当事人，口播「倒计时30天我们在做什么」真实可信、持续能更。","adaptPlan":"📌《入园倒计时第X天》\n⚡开头3秒：日历划掉一天「离入园还有X天」\n📝结构：1)今天做了什么准备 2)宝宝反应 3)一条实用小贴士\n💡金句：「焦虑的不是孩子，是我们放不下」\n🎬结尾：「明天继续倒计时」\n⏱30-45秒","videoUrl":"https://www.douyin.com/search/%E5%AE%9D%E5%AE%9D%E5%85%A5%E5%9B%AD%E7%84%A6%E8%99%91"},{"rank":"TOP5","title":"女性经济独立","track":"全网热点","heat":80,"whyViral":"经济独立是女性话题永恒核心，路径型内容比情绪型转发率高3倍。","fitReason":"你的核心动机就是「靠自己独立的底气」，口播从100元开始的小实验，不空洞、可执行。","adaptPlan":"📌《100元理财实验》\n⚡开头3秒：100元钞票「100元能理财吗？我来试试」\n📝结构：1)100元怎么分 2)执行过程 3)月底收益\n💡金句：「独立不是有钱才开始，是从100元改变思维」\n🎬结尾：收益数字+「第二个月继续」\n⏱45-60秒","videoUrl":"https://www.douyin.com/search/%E5%A5%B3%E6%80%A7%E7%BB%8F%E6%B5%8E%E7%8B%AC%E7%AB%8B"},{"rank":"TOP6","title":"副业 / 宝妈搞钱","track":"全网热点","heat":92,"whyViral":"宝妈副业是日均搜索50万+话题，实测型比攻略型完播率高，钱的数字最抓人。","fitReason":"你明确想「靠自己赚钱」，口播「这周我试了这个副业」真实收入+时间投入，最能涨粉。","adaptPlan":"📌《宝妈副业实测Day1》\n⚡开头3秒：收入截图「这周副业赚了XX元」\n📝结构：1)副业是什么 2)花了多少时间 3)真实收入+适合度评分\n💡金句：「副业不是一夜暴富，是每天2小时的积累」\n🎬结尾：「下周测另一个」\n⏱45-60秒","videoUrl":"https://www.douyin.com/search/%E5%AE%9D%E5%A6%88%E5%89%AF%E4%B8%9A%E6%90%9E%E9%92%B1"}]};
function renderHot(){_hotFav=false;renderHotData(_dailyHot());fetchHotLocal()}
function fetchHotLocal(){fetch('data/hot-latest.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json()}).then(function(d){if(d&&d.items&&d.items.length){renderHotData(d);var lb=document.getElementById('hotLabel');if(lb)lb.textContent='🎬 今日爆款二创 · '+(d.date||'')+(d.platform?(' · '+d.platform):'')}}).catch(function(e){})}
function renderHotData(d){
  var grid=document.getElementById('hotGrid');if(!grid)return;
  if(!d||!d.items||!d.items.length){grid.innerHTML='<div class="ws-notfound">今日暂无采集数据，请稍后刷新。</div>';return;}
  var lbl=document.getElementById('hotLabel');if(lbl)lbl.textContent='🎬 今日爆款二创 · '+escAttr(d.date||'')+(d.platform?(' · '+escAttr(d.platform)):'');
  _hotCur=d.items.slice();
  var h='';
  d.items.forEach(function(it,idx){
    h+='<div class="hot-item">';
    h+='<button class="fav-btn'+(_isFav('hot',it)?' active':'')+'" title="收藏/取消" onclick="favClick(\'hot\','+idx+',false)">★</button>';
    h+='<div class="hot-top">';
    h+='<div class="hot-hd"><span class="hot-rank">'+escAttr(it.rank||'TOP')+'</span>';
    if(it.track)h+='<span class="hot-track">'+escAttr(it.track)+'</span>';
    h+='</div>';
    h+='<a class="hot-title" href="'+escAttr(it.videoUrl||'#')+'" target="_blank" rel="noopener">'+escAttr(it.title)+' 🔗</a>';
    h+='<div class="hot-bar-row"><div class="hot-bar"><div class="hot-bar-fill" style="width:'+(it.heat||80)+'%"></div></div><span style="font-size:11px;font-weight:700;color:var(--accent-d);white-space:nowrap">🔥'+(it.heat||80)+'</span></div>';
    if(it.whyViral)h+='<div class="hot-analysis"><b>🔥 火爆原因：</b>'+escAttr(it.whyViral)+'</div>';
    if(it.fitReason)h+='<div class="hot-fit"><b>🎙 适配你的口播：</b>'+escAttr(it.fitReason)+'</div>';
    h+='</div>';
    if(it.adaptPlan){
      h+='<div class="hot-bottom">';
      h+='<div class="hot-bottom-label">🎬 二创改编方案</div>';
      h+='<div class="hot-script">'+escAttr(it.adaptPlan)+'</div>';
      h+='<a class="course-col-link" href="'+escAttr(it.videoUrl||'#')+'" target="_blank" rel="noopener">▶ 查看原爆款视频</a>';
      h+='</div>';
    }
    h+='</div>';
  });
  grid.innerHTML=h;updateFavBtn('hot');
}
function refreshHot(){renderHot();showToast('已更新今日爆款二创','success')}
// === RECIPE V3 (膳食指南+四季自动切换+50+炖汤+智能搜索) ===
var ING_DB={
staple:{label:'主食',icon:'🍚',baby:['白米饭','软面条','小馒头','花卷','白米粥','小馄饨','软烙饼','蛋炒饭','面条汤','米粉','南瓜粥','红薯粥','紫薯粥','玉米粥','蒸饭团'],adult:['白米饭','炒饭','面条','馒头','花卷','白米粥','馄饨','烙饼','蛋炒饭','面条汤','米粉','饺子','三明治','寿司饭','蒸饭团']},
protein:{label:'蛋白质',icon:'🥩',baby:['蒸蛋羹','水煮蛋','鸡胸肉丸','虾仁','清蒸鲈鱼','肉末豆腐','鸡蛋饼','鱼肉泥','牛肉末','虾蒸蛋','鸡肉丝','蛋卷','豆腐脑','鸭肉末','瘦肉末蒸蛋'],adult:['煎蛋','番茄炒蛋','虾仁','清蒸鲈鱼','肉末豆腐','鸡蛋饼','青椒肉丝','可乐鸡翅','卤豆腐','鸡肉丝','红烧肉','家常豆腐','莴笋炒肉','清蒸鱼']},
vegetable:{label:'蔬菜',icon:'🥬',baby:['丝瓜','南瓜','番茄','胡萝卜','菠菜','冬瓜','莲藕','花菜','土豆','苋菜','山药','豌豆','黄瓜','白萝卜','鸡毛菜'],adult:['丝瓜','南瓜','番茄','胡萝卜','菠菜','冬瓜','莲藕','花菜','土豆','苋菜','山药','豌豆','黄瓜','白萝卜','鸡毛菜','木耳','芹菜','生菜','茄子']},
soup:{label:'汤品',icon:'🥣',baby:['番茄蛋花汤','冬瓜肉丸汤','丝瓜蛋汤','菠菜豆腐汤','紫菜蛋花汤','南瓜浓汤','山药排骨汤','胡萝卜鸡汤','莲藕排骨汤','鸡汤面'],adult:['番茄蛋花汤','冬瓜排骨汤','丝瓜蛋汤','菠菜豆腐汤','紫菜蛋花汤','酸辣汤','南瓜浓汤','山药排骨汤','莲藕排骨汤','萝卜牛腩汤','鱼头豆腐汤','苦瓜排骨汤','丝瓜虾仁汤','番茄牛肉汤','冬瓜老鸭汤']},
fruitDairy:{label:'水果/奶/加餐',icon:'🍎',baby:['牛奶','苹果','香蕉','桃子','葡萄','蓝莓','猕猴桃','草莓','梨','西瓜','酸奶','奶酪棒','小饼干','溶豆','果泥棒'],adult:['牛奶','苹果','香蕉','桃子','葡萄','蓝莓','猕猴桃','草莓','梨','西瓜','酸奶','芒果','坚果','柠檬水','菠萝']}
};
// === 应季果蔬数据库（精确到每个月，随当前月份自动切换 / 删除不当时令的项）===
var FRUIT_ICON={"橙子": "🍊", "橘子": "🍊", "柑": "🍊", "柚子": "🍊", "苹果": "🍎", "梨": "🍐", "香蕉": "🍌", "草莓": "🍓", "猕猴桃": "🥝", "奇异果": "🥝", "樱桃": "🍒", "车厘子": "🍒", "荔枝": "🍒", "杨梅": "🍒", "李子": "🍒", "桃子": "🍑", "枇杷": "🍑", "杏": "🍑", "西瓜": "🍉", "火龙果": "🍉", "葡萄": "🍇", "芒果": "🥭", "哈密瓜": "🍈", "甜瓜": "🍈", "菠萝": "🍍", "柿子": "🟠", "石榴": "🍎", "无花果": "🟢", "红枣": "🌰", "板栗": "🌰", "龙眼": "🥥", "椰子": "🥥"};
var VEG_ICON={"白菜": "🥬", "菠菜": "🥬", "芹菜": "🥬", "油菜": "🥬", "芥菜": "🥬", "茼蒿": "🥬", "生菜": "🥬", "苋菜": "🥬", "小白菜": "🥬", "油麦菜": "🥬", "韭菜": "🥬", "空心菜": "🥬", "芥蓝": "🥬", "春笋": "🌱", "冬笋": "🌱", "竹笋": "🌱", "豆芽": "🌱", "蚕豆": "🌱", "豌豆苗": "🌱", "莴笋": "🌿", "香椿": "🌿", "荠菜": "🌿", "蒜苗": "🌿", "蒜薹": "🌿", "茭白": "🌿", "秋葵": "🌿", "紫苏": "🌿", "山药": "🥔", "土豆": "🥔", "芋头": "🥔", "芋艿": "🥔", "胡萝卜": "🥕", "萝卜": "🥕", "芜菁": "🥕", "番茄": "🍅", "黄瓜": "🥒", "冬瓜": "🥒", "丝瓜": "🥒", "苦瓜": "🥒", "西葫芦": "🥒", "南瓜": "🎃", "莲藕": "🪷", "花菜": "🥦", "西兰花": "🥦", "菜花": "🥦", "青椒": "🫑", "辣椒": "🫑", "彩椒": "🫑", "茄子": "🍆", "豌豆": "🌽", "玉米": "🌽", "毛豆": "🌽", "豆角": "🌽", "四季豆": "🌽", "大蒜": "🧄", "洋葱": "🧅"};
function fruitIcon(n){return FRUIT_ICON[n]||'🍎'}
function vegIcon(n){return VEG_ICON[n]||'🥬'}
var MONTHLY_DB={
  1:{season:'冬季',header:'❄️ 1月 · 冬季应季果蔬',fruits:['橙子','橘子','柚子','苹果','梨','香蕉','草莓','猕猴桃'],vegetables:['白菜','萝卜','菠菜','芹菜','冬笋','胡萝卜','山药','土豆','韭菜','油菜','芥菜','茼蒿']},
  2:{season:'冬季',header:'❄️ 2月 · 冬季应季果蔬',fruits:['橙子','橘子','柚子','苹果','梨','香蕉','草莓','猕猴桃'],vegetables:['白菜','萝卜','菠菜','芹菜','冬笋','韭菜','山药','土豆','油菜','芥菜','茼蒿','生菜']},
  3:{season:'春季',header:'🌸 3月 · 春季应季果蔬',fruits:['草莓','橙子','橘子','苹果','梨','菠萝'],vegetables:['菠菜','韭菜','春笋','芹菜','油菜','莴笋','荠菜','香椿','豆芽','蒜苗','生菜','小白菜']},
  4:{season:'春季',header:'🌸 4月 · 春季应季果蔬',fruits:['草莓','菠萝','橙子','枇杷','樱桃','苹果'],vegetables:['菠菜','韭菜','春笋','莴笋','荠菜','香椿','豌豆','芦笋','黄瓜','生菜','油麦菜','小白菜']},
  5:{season:'初夏',header:'🌿 5月 · 初夏应季果蔬',fruits:['草莓','枇杷','樱桃','杨梅','桃子','李子','杏','苹果'],vegetables:['黄瓜','番茄','茄子','青椒','空心菜','苦瓜','竹笋','芦笋','蚕豆','豌豆','蒜薹','韭菜']},
  6:{season:'夏季',header:'🍉 6月 · 夏季应季果蔬',fruits:['西瓜','桃子','荔枝','杨梅','李子','樱桃','葡萄','芒果','火龙果','哈密瓜'],vegetables:['黄瓜','番茄','茄子','青椒','冬瓜','丝瓜','苦瓜','空心菜','豆角','韭菜','苋菜','生菜']},
  7:{season:'夏季',header:'🍉 7月 · 夏季应季果蔬',fruits:['西瓜','桃子','荔枝','龙眼','李子','葡萄','芒果','火龙果','哈密瓜','菠萝'],vegetables:['黄瓜','番茄','茄子','青椒','冬瓜','丝瓜','苦瓜','空心菜','豆角','苋菜','莲藕','南瓜']},
  8:{season:'夏季',header:'🍉 8月 · 夏季应季果蔬',fruits:['西瓜','桃子','龙眼','葡萄','芒果','火龙果','哈密瓜','无花果','梨','石榴'],vegetables:['黄瓜','番茄','茄子','青椒','冬瓜','丝瓜','苦瓜','空心菜','豆角','莲藕','南瓜','秋葵']},
  9:{season:'秋季',header:'🍂 9月 · 秋季应季果蔬',fruits:['葡萄','梨','苹果','柿子','石榴','柚子','橙子','猕猴桃','香蕉','哈密瓜'],vegetables:['莲藕','南瓜','山药','胡萝卜','白菜','花菜','番茄','土豆','芹菜','菠菜','芋头','茭白']},
  10:{season:'秋季',header:'🍂 10月 · 秋季应季果蔬',fruits:['苹果','梨','柿子','石榴','柚子','橙子','猕猴桃','香蕉','葡萄','红枣'],vegetables:['莲藕','南瓜','山药','胡萝卜','白菜','花菜','菠菜','芹菜','芋头','茭白','萝卜','韭菜']},
  11:{season:'深秋',header:'🍁 11月 · 深秋应季果蔬',fruits:['橙子','橘子','柚子','苹果','梨','香蕉','猕猴桃','柿子'],vegetables:['白菜','萝卜','胡萝卜','山药','土豆','芹菜','菠菜','花菜','冬笋','莲藕','芥菜']},
  12:{season:'冬季',header:'❄️ 12月 · 冬季应季果蔬',fruits:['橙子','橘子','柚子','苹果','梨','香蕉','草莓','猕猴桃'],vegetables:['白菜','萝卜','菠菜','芹菜','冬笋','胡萝卜','山药','土豆','韭菜','油菜','芥菜','茼蒿']}
};
function getCurrentSeason(){var m=new Date().getMonth()+1;if(m>=3&&m<=5)return'spring';if(m>=6&&m<=8)return'summer';if(m>=9&&m<=11)return'autumn';return'winter'}
var SOUP_NORMAL=[
{name:'番茄蛋花汤',desc:'开胃好消化',effect:['开胃','消化']},
{name:'冬瓜排骨汤',desc:'清热利湿',effect:['清热','利湿','祛湿']},
{name:'丝瓜蛋汤',desc:'清爽解暑',effect:['解暑','清热','清爽']},
{name:'紫菜蛋花汤',desc:'补碘促代谢',effect:['补碘','代谢']},
{name:'菠菜豆腐汤',desc:'补铁补钙',effect:['补铁','补钙']},
{name:'莲藕排骨汤',desc:'养胃补血',effect:['养胃','补血','莲藕']},
{name:'山药排骨汤',desc:'健脾养胃',effect:['健脾','养胃','山药']},
{name:'萝卜牛腩汤',desc:'暖胃助消化',effect:['暖胃','消化']},
{name:'鱼头豆腐汤',desc:'补脑益智',effect:['补脑','益智']},
{name:'苦瓜排骨汤',desc:'清热降火',effect:['清热','降火']},
{name:'南瓜浓汤',desc:'护胃好消化',effect:['护胃','消化']},
{name:'胡萝卜鸡汤',desc:'增强免疫',effect:['免疫','增强']},
{name:'丝瓜虾仁汤',desc:'清热补蛋白',effect:['清热','蛋白质']},
{name:'番茄牛肉汤',desc:'补铁强体',effect:['补铁','强体']},
{name:'冬瓜老鸭汤',desc:'滋阴清热',effect:['滋阴','清热']},
{name:'玉米排骨汤',desc:'健脾开胃',effect:['健脾','开胃']},
{name:'木耳鸡蛋汤',desc:'清肺补血',effect:['清肺','补血']},
{name:'海带排骨汤',desc:'补碘补钙',effect:['补碘','补钙']},
{name:'豆苗肉片汤',desc:'清热明目',effect:['清热','明目']},
{name:'西洋菜排骨汤',desc:'清热润肺',effect:['清热','润肺']},
{name:'芥菜咸蛋汤',desc:'开胃消食',effect:['开胃','消食']},
{name:'腐竹白果汤',desc:'润肺止咳',effect:['润肺','止咳']},
{name:'沙参玉竹瘦肉汤',desc:'润肺养阴',effect:['润肺','养阴','滋阴']},
{name:'木瓜鲫鱼汤',desc:'通乳润肤',effect:['通乳','润肤']},
{name:'白萝卜羊肉汤',desc:'暖胃驱寒',effect:['暖胃','驱寒']},
{name:'土豆牛肉汤',desc:'补脾益气',effect:['补脾','益气','补气']},
{name:'椰子鸡汤',desc:'滋润养颜',effect:['滋润','养颜']},
{name:'百合银耳羹',desc:'润肺安神',effect:['润肺','安神']},
{name:'蘑菇鸡汤',desc:'增强免疫',effect:['免疫','增强']},
{name:'西红柿土豆汤',desc:'开胃健脾',effect:['开胃','健脾']}
];
var SOUP_STEW=[
{name:'银耳莲子羹',desc:'润肺养颜',effect:['润肺','养颜','安神','莲子'],ingredients:'银耳10g+莲子15g+冰糖适量+枸杞5g',steps:'1)银耳泡发2小时撕小朵 2)莲子去芯 3)银耳+莲子冷水入锅，大火煮沸转小火 4)炖40分钟加冰糖+枸杞 5)再炖10分钟至浓稠',tips:'银耳要选朵大肉厚的，泡发充分才能出胶',time:'小火炖40分钟',source:'xiachufang'},
{name:'红枣桂圆鸡汤',desc:'补气养血',effect:['补气','养血','气血','补血'],ingredients:'红枣5颗+桂圆8颗+鸡块200g+姜片3片',steps:'1)鸡块焯水去血沫 2)红枣去核、桂圆去壳 3)所有材料入砂锅加冷水 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'红枣去核不上火，桂圆量不宜过多',time:'炖1小时',source:'xiachufang'},
{name:'山药排骨汤',desc:'健脾养胃',effect:['健脾','养胃','山药','脾胃'],ingredients:'山药200g+排骨200g+姜片3片+枸杞10g',steps:'1)排骨焯水洗净 2)山药去皮切段(戴手套防过敏) 3)排骨+姜片冷水入锅大火煮沸 4)转小火炖30分钟加山药 5)再炖15分钟加枸杞盐调味',tips:'山药去皮一定要戴手套，否则手会痒',time:'炖45分钟',source:'xiachufang'},
{name:'花胶鸡汤',desc:'滋补养颜',effect:['滋补','养颜','胶原蛋白'],ingredients:'花胶15g+鸡块200g+枸杞10g+红枣3颗',steps:'1)花胶提前泡发12小时 2)鸡块焯水 3)花胶+鸡块+红枣冷水入锅 4)大火煮沸转小火炖2小时 5)加枸杞再炖10分钟',tips:'花胶泡发要充分，炖越久越软糯',time:'炖2小时',source:'xiaohongshu'},
{name:'党参黄芪鸡汤',desc:'补气提神',effect:['补气','提神','气虚','疲劳'],ingredients:'党参10g+黄芪10g+鸡块200g+红枣3颗',steps:'1)鸡块焯水 2)党参黄芪洗净 3)所有材料入砂锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'气虚乏力者适用，感冒期间不宜喝',time:'炖1小时',source:'xiachufang'},
{name:'当归羊肉汤',desc:'温补气血',effect:['温补','气血','补血','驱寒'],ingredients:'当归5g+羊肉200g+姜片5片+红枣3颗',steps:'1)羊肉焯水去膻味 2)当归洗净切片 3)羊肉+当归+姜片入锅 4)大火煮沸转小火炖1.5小时 5)加红枣再炖30分钟',tips:'羊肉焯水要彻底，当归量不宜过多',time:'炖1.5小时',source:'xiachufang'},
{name:'百合莲子羹',desc:'安神润肺',effect:['安神','润肺','莲子','百合','睡眠'],ingredients:'百合15g+莲子10g+冰糖适量+银耳5g',steps:'1)百合莲子洗净 2)银耳泡发 3)所有材料入锅加冷水 4)大火煮沸转小火炖30分钟 5)加冰糖调味',tips:'适合失眠多梦者，睡前1小时饮用',time:'炖30分钟',source:'xiachufang'},
{name:'虫草花鸡汤',desc:'增强免疫',effect:['免疫','增强','抗疲劳'],ingredients:'虫草花5g+鸡块200g+枸杞10g+姜片',steps:'1)鸡块焯水 2)虫草花洗净泡10分钟 3)鸡块+虫草花+姜片入锅 4)大火煮沸转小火炖1小时 5)加枸杞再炖10分钟',tips:'虫草花不是冬虫夏草，价格亲民效果也好',time:'炖1小时',source:'douyin'},
{name:'黑豆排骨汤',desc:'补肾强骨',effect:['补肾','强骨','黑豆','骨骼'],ingredients:'黑豆30g+排骨200g+姜片3片',steps:'1)黑豆提前泡4小时 2)排骨焯水 3)黑豆+排骨+姜片入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'黑豆要提前泡软，炖出来才软糯',time:'炖1小时',source:'xiachufang'},
{name:'天麻炖鸽汤',desc:'养脑安神',effect:['养脑','安神','头痛','眩晕'],ingredients:'天麻5g+鸽肉200g+姜片3片+枸杞10g',steps:'1)鸽肉焯水 2)天麻切片 3)鸽肉+天麻+姜片入锅 4)大火煮沸转小火炖1.5小时 5)加枸杞再炖10分钟',tips:'天麻对头痛眩晕有效，鸽肉比鸡肉更滋补',time:'炖1.5小时',source:'xiachufang'},
{name:'沙参玉竹瘦肉汤',desc:'润肺止咳',effect:['润肺','止咳','咳嗽','滋阴'],ingredients:'沙参10g+玉竹10g+瘦肉200g+红枣3颗',steps:'1)瘦肉切块焯水 2)沙参玉竹洗净 3)所有材料入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'适合干咳无痰者，有痰者不宜',time:'炖1小时',source:'xiachufang'},
{name:'枸杞山药排骨汤',desc:'滋肾养肝',effect:['滋肾','养肝','肝肾','山药'],ingredients:'枸杞15g+山药200g+排骨200g+姜片',steps:'1)排骨焯水 2)山药去皮切段 3)排骨+姜片炖30分钟 4)加山药炖15分钟 5)加枸杞再炖10分钟',tips:'枸杞最后放，久煮会破坏营养',time:'炖45分钟',source:'xiachufang'},
{name:'四物汤',desc:'调经养血',effect:['调经','养血','月经','气血'],ingredients:'当归5g+川芎5g+白芍5g+熟地5g+排骨200g',steps:'1)四味药材洗净 2)排骨焯水 3)药材+排骨入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'月经后连喝3天效果最佳，经期不宜',time:'炖1小时',source:'xiaohongshu'},
{name:'八珍汤',desc:'气血双补',effect:['气血','双补','补气','补血'],ingredients:'四物(当归川芎白芍熟地各5g)+四君子(党参白术茯苓甘草各5g)+鸡块200g',steps:'1)八味药材洗净 2)鸡块焯水 3)药材+鸡块入锅 4)大火煮沸转小火炖1.5小时 5)加盐调味',tips:'气血两虚者适用，比四物汤补气效果更强',time:'炖1.5小时',source:'xiachufang'},
{name:'杜仲猪腰汤',desc:'补肾强腰',effect:['补肾','强腰','腰痛','腰膝'],ingredients:'杜仲10g+猪腰1个+姜片5片',steps:'1)猪腰切开去筋膜，盐水浸泡30分钟 2)杜仲洗净 3)猪腰+杜仲+姜片入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'猪腰要去净筋膜否则有异味，杜仲对腰痛有效',time:'炖1小时',source:'xiachufang'},
{name:'黄芪党参乌鸡汤',desc:'大补元气',effect:['补气','元气','气虚','乏力'],ingredients:'黄芪15g+党参10g+乌鸡200g+红枣5颗+姜片',steps:'1)乌鸡焯水 2)黄芪党参洗净 3)乌鸡+药材+红枣入锅 4)大火煮沸转小火炖1.5小时 5)加盐调味',tips:'乌鸡比普通鸡滋补效果更强',time:'炖1.5小时',source:'xiachufang'},
{name:'莲藕排骨汤',desc:'养胃补血',effect:['养胃','补血','莲藕','脾胃'],ingredients:'莲藕200g+排骨200g+红枣5颗+姜片',steps:'1)排骨焯水 2)莲藕去皮切块 3)排骨+莲藕+红枣+姜片入锅 4)大火煮沸转小火炖45分钟 5)加盐调味',tips:'莲藕选粉藕(七孔)炖汤更软糯，脆藕(九孔)适合炒',time:'炖45分钟',source:'xiachufang'},
{name:'百合雪梨汤',desc:'润肺清热',effect:['润肺','清热','咳嗽','百合'],ingredients:'百合15g+雪梨1个+冰糖适量+枸杞5g',steps:'1)百合洗净 2)雪梨去皮切块 3)百合+雪梨入锅加冷水 4)大火煮沸转小火炖30分钟 5)加冰糖+枸杞再炖5分钟',tips:'适合秋季干咳，雪梨要选皮薄汁多的',time:'炖30分钟',source:'xiachufang'},
{name:'陈皮老鸭汤',desc:'理气健脾',effect:['理气','健脾','脾胃','消化'],ingredients:'陈皮5g+老鸭200g+冬瓜200g+姜片',steps:'1)老鸭焯水 2)陈皮泡软刮去白瓤 3)老鸭+陈皮+冬瓜+姜片入锅 4)大火煮沸转小火炖1.5小时 5)加盐调味',tips:'陈皮去白瓤不苦，老鸭比嫩鸭更香',time:'炖1.5小时',source:'xiachufang'},
{name:'灵芝排骨汤',desc:'增强免疫',effect:['免疫','增强','抗疲劳','养生'],ingredients:'灵芝10g+排骨200g+枸杞10g+红枣3颗',steps:'1)排骨焯水 2)灵芝切片 3)排骨+灵芝+红枣入锅 4)大火煮沸转小火炖1小时 5)加枸杞再炖10分钟',tips:'灵芝有苦味是正常的，可多加红枣调和',time:'炖1小时',source:'douyin'},
{name:'玉米胡萝卜排骨汤',desc:'健脾开胃',effect:['健脾','开胃','脾胃','胡萝卜'],ingredients:'玉米1根+胡萝卜150g+排骨200g+姜片',steps:'1)排骨焯水 2)玉米切段、胡萝卜切块 3)所有材料入锅 4)大火煮沸转小火炖45分钟 5)加盐调味',tips:'玉米选甜玉米，胡萝卜要切大块不散',time:'炖45分钟',source:'xiachufang'},
{name:'莲子猪肚汤',desc:'健脾补虚',effect:['健脾','补虚','脾胃','莲子'],ingredients:'莲子15g+猪肚1个+姜片5片+红枣3颗',steps:'1)猪肚用盐+面粉反复搓洗3遍 2)莲子去芯 3)猪肚+莲子+姜片入锅 4)大火煮沸转小火炖1.5小时 5)猪肚取出切条再放回加盐',tips:'猪肚清洗是最关键步骤，要彻底去除异味',time:'炖1.5小时',source:'xiachufang'},
{name:'银耳木瓜汤',desc:'润肤养颜',effect:['养颜','润肤','美容','胶原蛋白'],ingredients:'银耳10g+木瓜200g+冰糖适量+牛奶100ml',steps:'1)银耳泡发2小时撕小朵 2)木瓜去皮切块 3)银耳入锅炖30分钟 4)加木瓜炖15分钟 5)加冰糖+牛奶再炖5分钟',tips:'牛奶最后加，久煮会破坏营养',time:'炖45分钟',source:'xiaohongshu'},
{name:'花生鸡脚汤',desc:'补血强筋',effect:['补血','强筋','骨骼','关节'],ingredients:'花生30g+鸡脚6只+红枣5颗+姜片',steps:'1)鸡脚剪指甲焯水 2)花生泡2小时 3)鸡脚+花生+红枣+姜片入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'花生选红皮花生补血效果更好',time:'炖1小时',source:'xiachufang'},
{name:'白果腐竹猪肚汤',desc:'润肺止咳',effect:['润肺','止咳','咳嗽','肺'],ingredients:'白果10颗+腐竹50g+猪肚1个+姜片',steps:'1)猪肚彻底清洗 2)白果去壳去芯(去芯去毒) 3)猪肚+白果+姜片炖1小时 4)加腐竹炖20分钟 5)加盐调味',tips:'白果必须去芯，芯有毒！限量成人不超过10颗',time:'炖1小时20分',source:'xiachufang'},
{name:'川贝雪梨猪肺汤',desc:'润肺止咳',effect:['润肺','止咳','咳嗽','川贝'],ingredients:'川贝5g+雪梨1个+猪肺150g+姜片',steps:'1)猪肺灌水反复挤压清洗至白净 2)雪梨去皮切块 3)川贝捣碎 4)猪肺+川贝+雪梨入锅 5)大火煮沸转小火炖1小时加盐',tips:'川贝对干咳特效，猪肺清洗要非常彻底',time:'炖1小时',source:'xiachufang'},
{name:'何首乌鸡汤',desc:'补血乌发',effect:['补血','乌发','头发','贫血'],ingredients:'何首乌10g+鸡块200g+红枣5颗+姜片',steps:'1)鸡块焯水 2)何首乌洗净切片 3)鸡块+何首乌+红枣入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'何首乌对血虚脱发有效，不宜长期大量使用',time:'炖1小时',source:'xiachufang'},
{name:'石斛麦冬瘦肉汤',desc:'滋阴润燥',effect:['滋阴','润燥','阴虚','干燥'],ingredients:'石斛10g+麦冬10g+瘦肉200g+红枣3颗',steps:'1)瘦肉焯水 2)石斛麦冬洗净 3)所有材料入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'适合口干舌燥、阴虚体质者',time:'炖1小时',source:'xiachufang'},
{name:'淮山杞子水鱼汤',desc:'滋阴补肾',effect:['滋阴','补肾','阴虚','肾'],ingredients:'淮山20g+枸杞15g+水鱼1只+姜片',steps:'1)水鱼处理干净焯水 2)淮山去皮切块 3)水鱼+淮山+姜片炖1小时 4)加枸杞炖10分钟 5)加盐调味',tips:'水鱼滋阴效果极佳，但处理较麻烦',time:'炖1小时',source:'xiachufang'},
{name:'西洋参炖乌鸡',desc:'补气养阴',effect:['补气','养阴','气虚','阴虚'],ingredients:'西洋参5g+乌鸡200g+红枣3颗+姜片',steps:'1)乌鸡焯水 2)西洋参切片 3)乌鸡+西洋参+红枣入锅 4)大火煮沸转小火炖1.5小时 5)加盐调味',tips:'西洋参性凉不上火，适合气阴两虚者',time:'炖1.5小时',source:'douyin'},
{name:'茯苓薏米排骨汤',desc:'祛湿健脾',effect:['祛湿','健脾','湿气','水肿'],ingredients:'茯苓15g+薏米30g+排骨200g+姜片',steps:'1)薏米提前泡4小时 2)排骨焯水 3)排骨+薏米+茯苓+姜片入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'薏米炒后用祛湿效果更好，生薏米偏凉',time:'炖1小时',source:'xiachufang'},
{name:'海底椰雪梨汤',desc:'润肺清热',effect:['润肺','清热','咳嗽','干燥'],ingredients:'海底椰15g+雪梨1个+冰糖适量+银耳5g',steps:'1)海底椰洗净 2)雪梨去皮切块 3)海底椰+雪梨+银耳入锅 4)大火煮沸转小火炖45分钟 5)加冰糖调味',tips:'海底椰是润肺佳品，口感清甜',time:'炖45分钟',source:'xiaohongshu'},
{name:'五指毛桃排骨汤',desc:'健脾化湿',effect:['健脾','化湿','祛湿','脾胃'],ingredients:'五指毛桃30g+排骨200g+薏米20g+姜片',steps:'1)排骨焯水 2)五指毛桃洗净 3)所有材料入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'五指毛桃有椰香味，是广东特色煲汤料',time:'炖1小时',source:'xiachufang'},
{name:'土茯苓煲龟汤',desc:'祛湿解毒',effect:['祛湿','解毒','湿气','清热'],ingredients:'土茯苓30g+草龟1只+排骨100g+姜片',steps:'1)草龟处理干净焯水 2)土茯苓洗净切片 3)龟+土茯苓+排骨入锅 4)大火煮沸转小火炖2小时 5)加盐调味',tips:'土茯苓祛湿效果强，适合湿热体质',time:'炖2小时',source:'xiachufang'},
{name:'阿胶红枣鸡蛋汤',desc:'补血养颜',effect:['补血','养颜','贫血','气血'],ingredients:'阿胶5g+红枣5颗+鸡蛋1个+冰糖适量',steps:'1)红枣去核煮水15分钟 2)阿胶用热水烊化 3)将烊化阿胶倒入红枣水 4)打入鸡蛋搅散 5)加冰糖调味',tips:'阿胶要烊化(热水溶化)不能直接煮',time:'煮20分钟',source:'xiaohongshu'},
{name:'龙眼肉鸡蛋汤',desc:'补血安神',effect:['补血','安神','失眠','睡眠'],ingredients:'龙眼肉15g+鸡蛋1个+红枣3颗+冰糖',steps:'1)龙眼肉+红枣煮水15分钟 2)打入鸡蛋搅散 3)加冰糖调味 4)小火煮3分钟即可',tips:'睡前1小时喝效果最佳，简单易做',time:'煮20分钟',source:'xiachufang'},
{name:'当归黄芪羊肉汤',desc:'温补气血',effect:['温补','气血','补气','补血','驱寒'],ingredients:'当归10g+黄芪15g+羊肉200g+姜片5片+红枣5颗',steps:'1)羊肉焯水去膻味 2)当归黄芪洗净 3)所有材料入砂锅 4)大火煮沸转小火炖1.5小时 5)加盐调味',tips:'冬天喝最暖，当归补血黄芪补气',time:'炖1.5小时',source:'xiachufang'},
{name:'桂圆莲子百合汤',desc:'安神养心',effect:['安神','养心','失眠','睡眠','莲子'],ingredients:'桂圆10g+莲子15g+百合10g+冰糖适量',steps:'1)莲子去芯百合洗净 2)莲子先炖20分钟 3)加桂圆百合炖20分钟 4)加冰糖调味',tips:'三味搭配是安神经典方',time:'炖40分钟',source:'xiachufang'},
{name:'猴头菇鸡汤',desc:'养胃助消化',effect:['养胃','消化','胃病','脾胃'],ingredients:'猴头菇15g+鸡块200g+姜片3片+红枣3颗',steps:'1)猴头菇泡发2小时反复挤洗去苦味 2)鸡块焯水 3)猴头菇+鸡块+姜片炖1小时 4)加红枣再炖15分钟 5)加盐',tips:'猴头菇泡发要彻底挤洗，否则有苦味',time:'炖1小时',source:'xiachufang'},
{name:'鸡骨草煲猪横脷',desc:'清肝祛湿',effect:['清肝','祛湿','肝','湿气'],ingredients:'鸡骨草30g+猪横脷1条+排骨100g+姜片',steps:'1)猪横脷去膜洗净焯水 2)鸡骨草洗净 3)所有材料入锅 4)大火煮沸转小火炖1.5小时 5)加盐调味',tips:'广东特色祛湿汤，猪横脷是健脾利湿佳品',time:'炖1.5小时',source:'xiachufang'},
{name:'芡实莲子猪肚汤',desc:'固肾健脾',effect:['固肾','健脾','脾胃','肾','莲子'],ingredients:'芡实15g+莲子15g+猪肚1个+红枣5颗',steps:'1)猪肚彻底清洗 2)莲子去芯芡实泡2小时 3)猪肚+芡实+莲子炖1.5小时 4)猪肚取出切条再放回 5)加盐调味',tips:'芡实固肾效果好，与莲子搭配健脾更强',time:'炖1.5小时',source:'xiachufang'},
{name:'乌鸡白凤汤',desc:'调经补血',effect:['调经','补血','月经','气血','女性'],ingredients:'乌鸡200g+白凤菇10g+当归5g+红枣5颗',steps:'1)乌鸡焯水 2)白凤菇洗净 3)乌鸡+当归+红枣炖1小时 4)加白凤菇炖20分钟 5)加盐调味',tips:'月经不调者的经典汤方',time:'炖1小时20分',source:'xiaohongshu'},
{name:'玉竹沙参老鸭汤',desc:'滋阴润燥',effect:['滋阴','润燥','阴虚','干燥'],ingredients:'玉竹10g+沙参10g+老鸭200g+姜片',steps:'1)老鸭焯水 2)玉竹沙参洗净 3)老鸭+玉竹+沙参+姜片入锅 4)大火煮沸转小火炖1.5小时 5)加盐调味',tips:'适合阴虚口干者，老鸭滋阴比嫩鸭强',time:'炖1.5小时',source:'xiachufang'},
{name:'桑葚枸杞汤',desc:'补血明目',effect:['补血','明目','眼睛','肝肾'],ingredients:'桑葚15g+枸杞10g+红枣3颗+冰糖',steps:'1)桑葚枸杞洗净 2)桑葚+红枣煮水15分钟 3)加枸杞煮5分钟 4)加冰糖调味',tips:'桑葚补血明目，新鲜或干品均可',time:'煮20分钟',source:'xiaohongshu'},
{name:'黄精枸杞鸡汤',desc:'补气养阴',effect:['补气','养阴','气虚','疲劳'],ingredients:'黄精10g+枸杞15g+鸡块200g+红枣3颗',steps:'1)鸡块焯水 2)黄精洗净切片 3)鸡块+黄精+红枣炖1小时 4)加枸杞炖10分钟 5)加盐',tips:'黄精是补气养阴佳品，性平不上火',time:'炖1小时',source:'douyin'},
{name:'地虫草排骨汤',desc:'补肺益肾',effect:['补肺','益肾','肺','肾'],ingredients:'地虫草10g+排骨200g+姜片+红枣3颗',steps:'1)排骨焯水 2)地虫草洗净 3)所有材料入锅 4)大火煮沸转小火炖1小时 5)加盐调味',tips:'地虫草又名地参，补肺益肾效果佳',time:'炖1小时',source:'xiachufang'},
{name:'莲藕花生猪骨汤',desc:'养胃补血',effect:['养胃','补血','脾胃','莲藕'],ingredients:'莲藕250g+花生30g+猪骨300g+姜片3片+红枣3颗',steps:'1)莲藕去皮切块 2)花生提前泡2小时 3)猪骨焯水 4)所有材料入锅大火煮沸转小火炖1小时 5)加盐调味',tips:'选粉藕(七孔)炖汤更粉糯，花生补血',time:'炖1小时',source:'xiachufang'},
{name:'莲藕红豆鲫鱼汤',desc:'健脾利湿',effect:['健脾','利湿','脾胃','莲藕','祛湿'],ingredients:'莲藕200g+红豆30g+鲫鱼1条+姜片+瘦肉50g',steps:'1)鲫鱼煎至两面金黄 2)红豆提前泡2小时 3)莲藕切块 4)所有材料入锅加水 5)大火煮沸转小火炖40分钟加盐',tips:'鲫鱼先煎去腥，红豆利水消肿',time:'炖40分钟',source:'xiachufang'},
{name:'章鱼莲藕排骨汤',desc:'补血养血',effect:['补血','养血','莲藕','气血'],ingredients:'莲藕200g+章鱼干30g+排骨250g+姜片+花生20g',steps:'1)章鱼干泡软 2)排骨焯水 3)莲藕切块 4)同入锅炖1小时 5)加盐',tips:'章鱼干提鲜，适合换季补血',time:'炖1小时',source:'xiachufang'},
{name:'羊肚菌炖鸡汤',desc:'增强免疫·健脾',effect:['免疫','增强','健脾','脾胃'],ingredients:'羊肚菌15g+鸡块250g+红枣3颗+枸杞10g+姜片',steps:'1)羊肚菌泡发洗净 2)鸡块焯水 3)所有材料入锅炖1小时 4)加枸杞再炖10分钟',tips:'羊肚菌被誉为菌中之王，提鲜增免疫',time:'炖1小时',source:'xiachufang'},
{name:'羊肚菌排骨汤',desc:'健脾开胃',effect:['健脾','开胃','脾胃'],ingredients:'羊肚菌15g+排骨250g+山药100g+姜片+枸杞',steps:'1)羊肚菌泡发 2)排骨焯水 3)山药切块 4)同炖1小时 5)加盐',tips:'菌香浓郁，孩子也爱喝',time:'炖1小时',source:'xiachufang'},
{name:'无花果雪梨瘦肉汤',desc:'润肺止咳',effect:['润肺','止咳','咳嗽','润燥'],ingredients:'无花果干4颗+雪梨1个+瘦肉200g+南北杏10g+姜片',steps:'1)瘦肉焯水 2)雪梨去核切块 3)无花果南北杏洗净 4)同炖1小时 5)加盐',tips:'无花果清润，雪梨止咳经典组合',time:'炖1小时',source:'xiachufang'},
{name:'无花果苹果瘦肉汤',desc:'润燥健脾',effect:['润燥','健脾','脾胃','滋阴'],ingredients:'无花果干4颗+苹果1个+瘦肉200g+玉竹10g',steps:'1)瘦肉焯水 2)苹果去核切块 3)玉竹洗净 4)同炖50分钟 5)加盐',tips:'苹果健脾，无花果润燥，老少皆宜',time:'炖50分钟',source:'xiaohongshu'},
{name:'无花果猪肺汤',desc:'润肺化痰',effect:['润肺','化痰','咳嗽'],ingredients:'无花果干5颗+猪肺200g+南北杏10g+姜片',steps:'1)猪肺反复灌洗至发白 2)无花果南北杏洗净 3)同炖1.5小时 4)加盐',tips:'猪肺清洗是关键，无花果化痰',time:'炖1.5小时',source:'xiachufang'},
{name:'虎乳菌润肺汤',desc:'润肺止咳化痰',effect:['润肺','止咳','化痰','咳嗽','免疫'],ingredients:'虎乳菌15g+瘦肉200g+南北杏10g+姜片+红枣2颗',steps:'1)瘦肉焯水 2)虎乳菌泡软 3)同炖1小时 4)加盐',tips:'虎乳菌又称虎奶菌，民间润肺佳品',time:'炖1小时',source:'douyin'},
{name:'虎乳菌雪梨汤',desc:'清热润肺',effect:['润肺','清热','咳嗽'],ingredients:'虎乳菌15g+雪梨1个+冰糖适量+银耳5g',steps:'1)雪梨切块 2)虎乳菌泡软 3)同炖45分钟 4)加冰糖调味',tips:'适合干咳少痰，清甜滋润',time:'炖45分钟',source:'xiaohongshu'},
{name:'竹荪鸡汤',desc:'清淡滋补',effect:['滋补','增强','养胃'],ingredients:'竹荪15g+鸡块200g+枸杞10g+姜片',steps:'1)竹荪泡发去网 2)鸡块焯水 3)同炖40分钟 4)加枸杞',tips:'竹荪久煮会烂，最后放',time:'炖40分钟',source:'xiachufang'},
{name:'茶树菇排骨汤',desc:'增强免疫',effect:['免疫','增强','抗疲劳'],ingredients:'茶树菇20g+排骨250g+姜片+红枣3颗',steps:'1)茶树菇泡软 2)排骨焯水 3)同炖1小时 4)加盐',tips:'茶树菇爽脆，菌香浓',time:'炖1小时',source:'xiachufang'},
{name:'霸王花猪骨汤',desc:'清热润肺',effect:['清热','润肺','止咳'],ingredients:'霸王花30g+猪骨300g+南北杏10g+姜片',steps:'1)霸王花泡软 2)猪骨焯水 3)同炖1.5小时 4)加盐',tips:'广东老火汤，清热不寒凉',time:'炖1.5小时',source:'xiachufang'},
{name:'海底椰无花果汤',desc:'润肺清润',effect:['润肺','清热','咳嗽','润燥'],ingredients:'海底椰15g+无花果干4颗+瘦肉200g+雪梨半个',steps:'1)瘦肉焯水 2)所有材料入锅 3)炖1小时 4)加盐',tips:'三重润肺，秋季必备',time:'炖1小时',source:'xiaohongshu'},
{name:'木瓜鲫鱼汤',desc:'健脾消食',effect:['健脾','消食','脾胃','开胃'],ingredients:'木瓜200g+鲫鱼1条+姜片+瘦肉50g',steps:'1)鲫鱼煎金黄 2)木瓜去皮切块 3)同炖30分钟 4)加盐',tips:'产后或消化差都适合',time:'炖30分钟',source:'xiachufang'},
{name:'鲍鱼鸡汤',desc:'滋阴补肾',effect:['滋阴','补肾','益肾','增强'],ingredients:'鲜鲍鱼3只+鸡块200g+枸杞10g+姜片',steps:'1)鲍鱼刷净 2)鸡块焯水 3)同炖1.5小时 4)加枸杞',tips:'鲍鱼鲜美，滋补不燥',time:'炖1.5小时',source:'xiachufang'},
{name:'响螺瘦肉汤',desc:'滋阴润燥',effect:['滋阴','润燥','阴虚'],ingredients:'响螺片30g+瘦肉200g+山药100g+姜片',steps:'1)响螺片泡发 2)瘦肉焯水 3)同炖1.5小时 4)加盐',tips:'响螺滋阴，口感爽脆',time:'炖1.5小时',source:'xiachufang'},
{name:'冬瓜薏米排骨汤',desc:'祛湿消肿',effect:['祛湿','利湿','湿气','水肿','健脾'],ingredients:'冬瓜300g+薏米30g+排骨250g+姜片',steps:'1)薏米炒过泡2小时 2)排骨焯水 3)冬瓜切块 4)同炖1小时 5)加盐',tips:'薏米炒过祛湿不寒凉',time:'炖1小时',source:'xiachufang'},
{name:'苦瓜排骨汤',desc:'清热解暑',effect:['清热','解暑','降火'],ingredients:'苦瓜1根+排骨250g+黄豆30g+姜片',steps:'1)排骨焯水 2)苦瓜去瓤切块 3)黄豆泡软 4)同炖1小时 5)加盐',tips:'苦瓜焯水去苦，夏天喝最好',time:'炖1小时',source:'xiachufang'},
{name:'番茄土豆排骨汤',desc:'开胃健脾',effect:['开胃','健脾','脾胃'],ingredients:'番茄2个+土豆1个+排骨250g+姜片',steps:'1)排骨焯水 2)番茄炒出汁 3)土豆切块 4)同炖50分钟 5)加盐',tips:'酸甜开胃，宝宝也爱喝',time:'炖50分钟',source:'xiachufang'},
{name:'南瓜排骨汤',desc:'养胃健脾',effect:['养胃','健脾','脾胃'],ingredients:'南瓜300g+排骨250g+姜片+枸杞',steps:'1)排骨焯水 2)南瓜切块 3)同炖45分钟 4)加枸杞',tips:'南瓜软糯养胃',time:'炖45分钟',source:'xiachufang'},
{name:'黑豆核桃乌鸡汤',desc:'补肾健脑',effect:['补肾','强骨','乌发'],ingredients:'黑豆30g+核桃30g+乌鸡200g+红枣3颗',steps:'1)黑豆泡4小时 2)乌鸡焯水 3)同炖1.5小时 4)加盐',tips:'核桃补脑，黑豆补肾',time:'炖1.5小时',source:'xiachufang'},
{name:'桃胶银耳羹',desc:'养颜润肤',effect:['养颜','润肤','美容','胶原蛋白'],ingredients:'桃胶10g+银耳10g+皂角米5g+冰糖+红枣',steps:'1)桃胶皂角米泡12小时 2)银耳泡发 3)同炖1小时 4)加冰糖',tips:'桃胶富含植物胶质，养颜',time:'炖1小时',source:'xiaohongshu'},
{name:'赤小豆鲫鱼汤',desc:'祛湿利水',effect:['祛湿','利湿','湿气','水肿'],ingredients:'赤小豆30g+鲫鱼1条+姜片+陈皮2g',steps:'1)鲫鱼煎金黄 2)赤小豆泡2小时 3)同炖40分钟 4)加盐',tips:'赤小豆利湿，配陈皮理气',time:'炖40分钟',source:'xiachufang'},
{name:'菜干猪肺汤',desc:'润肺止咳',effect:['润肺','止咳','咳嗽'],ingredients:'白菜干30g+猪肺200g+南北杏10g+姜片',steps:'1)菜干泡软 2)猪肺洗净 3)同炖1.5小时 4)加盐',tips:'菜干清润，猪肺润肺',time:'炖1.5小时',source:'xiachufang'},
{name:'墨鱼排骨汤',desc:'补血养血',effect:['补血','养血','气血'],ingredients:'干墨鱼1只+排骨250g+莲藕100g+姜片',steps:'1)墨鱼泡发去骨 2)排骨焯水 3)同炖1.5小时 4)加盐',tips:'墨鱼补血，女生经期后喝好',time:'炖1.5小时',source:'xiachufang'},
{name:'花胶瘦肉汤',desc:'滋补养颜',effect:['滋补','养颜','胶原蛋白'],ingredients:'花胶15g+瘦肉200g+红枣3颗+枸杞',steps:'1)花胶泡发12小时 2)瘦肉焯水 3)同炖1小时 4)加枸杞',tips:'花胶配瘦肉更清爽',time:'炖1小时',source:'xiachufang'},
{name:'虫草花龙骨汤',desc:'增强免疫',effect:['免疫','增强','抗疲劳'],ingredients:'虫草花10g+猪龙骨300g+姜片+枸杞',steps:'1)龙骨焯水 2)虫草花泡10分钟 3)同炖1小时 4)加枸杞',tips:'龙骨比排骨更耐炖',time:'炖1小时',source:'xiachufang'},
{name:'南北杏炖雪梨',desc:'止咳润肺',effect:['止咳','润肺','咳嗽'],ingredients:'南北杏15g+雪梨1个+冰糖+川贝3g',steps:'1)雪梨去核 2)南北杏川贝入梨心 3)隔水炖40分钟',tips:'经典止咳方，隔水炖更润',time:'炖40分钟',source:'xiachufang'},
{name:'黑蒜排骨汤',desc:'增强免疫·抗氧化',effect:['免疫','增强','抗疲劳'],ingredients:'黑蒜5瓣+排骨250g+姜片+红枣',steps:'1)排骨焯水 2)黑蒜去皮 3)同炖1小时 4)加盐',tips:'黑蒜甜糯不刺激，抗氧化',time:'炖1小时',source:'douyin'},
{name:'猴头菇排骨汤',desc:'养胃助消化',effect:['养胃','消化','胃病','脾胃'],ingredients:'猴头菇15g+排骨250g+姜片+红枣',steps:'1)猴头菇泡发挤洗 2)排骨焯水 3)同炖1小时 4)加盐',tips:'养胃经典，胃病友好',time:'炖1小时',source:'xiachufang'},
{name:'鹌鹑汤',desc:'健脾益气',effect:['健脾','益气','补气','脾胃'],ingredients:'鹌鹑2只+党参10g+黄芪10g+红枣',steps:'1)鹌鹑焯水 2)药材洗净 3)同炖1小时 4)加盐',tips:'鹌鹑小巧滋补，补气不燥',time:'炖1小时',source:'xiachufang'},
{name:'干贝冬瓜汤',desc:'滋阴清热',effect:['滋阴','清热','利水'],ingredients:'干贝20g+冬瓜300g+瘦肉50g+姜片',steps:'1)干贝泡软 2)冬瓜切块 3)同炖40分钟 4)加盐',tips:'干贝提鲜，冬瓜清热',time:'炖40分钟',source:'xiachufang'},
{name:'葛根鲫鱼汤',desc:'清热生津',effect:['清热','生津','降火'],ingredients:'葛根30g+鲫鱼1条+姜片+瘦肉50g',steps:'1)鲫鱼煎金黄 2)葛根洗净 3)同炖40分钟 4)加盐',tips:'葛根清热，适合燥热',time:'炖40分钟',source:'xiachufang'},
{name:'菠菜猪肝汤',desc:'补血明目',effect:['补血','明目','眼睛','贫血'],ingredients:'菠菜150g+猪肝100g+姜片+枸杞',steps:'1)猪肝切片泡水 2)焯水 3)菠菜焯水 4)同煮10分钟 5)加盐',tips:'猪肝补血，菠菜含铁',time:'煮15分钟',source:'xiachufang'},
{name:'白萝卜羊肉汤',desc:'温补消食',effect:['温补','驱寒','消食','气血'],ingredients:'白萝卜300g+羊肉250g+姜片+红枣',steps:'1)羊肉焯水 2)萝卜切块 3)同炖1.5小时 4)加盐',tips:'萝卜解羊肉膻，温补消食',time:'炖1.5小时',source:'xiachufang'},
{name:'豆腐鲫鱼汤',desc:'健脾利湿',effect:['健脾','利湿','养胃','脾胃'],ingredients:'豆腐1块+鲫鱼1条+姜片+葱',steps:'1)鲫鱼煎金黄 2)加水煮白 3)加豆腐煮10分钟 4)加盐葱',tips:'奶白鱼汤，清淡营养',time:'煮20分钟',source:'xiachufang'},
{name:'核桃黑芝麻糊',desc:'补肾乌发',effect:['补肾','乌发','头发','补血'],ingredients:'核桃30g+黑芝麻30g+糯米20g+冰糖',steps:'1)黑芝麻炒香 2)全部打碎 3)加水煮成糊 4)加冰糖',tips:'当糖水喝，乌发养血',time:'煮20分钟',source:'xiaohongshu'}
];
var ING_KB={
'羊肚菌':{eff:'增强免疫、健脾养胃',pair:'鸡 / 排骨 / 瘦肉'},
'无花果':{eff:'润肺止咳、清润通便',pair:'雪梨 / 瘦肉 / 猪肺'},
'虎乳菌':{eff:'润肺止咳化痰、增强免疫',pair:'瘦肉 / 雪梨 / 南北杏'},
'莲藕':{eff:'养胃补血、凉血生津',pair:'排骨 / 花生 / 鲫鱼'},
'山药':{eff:'健脾养胃、补肾',pair:'排骨 / 瘦肉 / 枸杞'},
'银耳':{eff:'润肺养颜、滋阴',pair:'莲子 / 雪梨 / 红枣'},
'百合':{eff:'润肺安神、止咳',pair:'莲子 / 雪梨 / 银耳'},
'红枣':{eff:'补血补气、养颜',pair:'桂圆 / 鸡肉 / 银耳'},
'桂圆':{eff:'补血安神、助眠',pair:'红枣 / 莲子 / 鸡蛋'},
'枸杞':{eff:'养肝明目、滋肾',pair:'鸡肉 / 排骨 / 菊花'},
'当归':{eff:'补血调经、温补',pair:'羊肉 / 鸡肉 / 红枣'},
'黄芪':{eff:'补气提神、抗疲劳',pair:'党参 / 鸡肉 / 红枣'},
'党参':{eff:'补气健脾',pair:'黄芪 / 鸡肉 / 瘦肉'},
'花胶':{eff:'滋补养颜、补胶原蛋白',pair:'鸡肉 / 瘦肉 / 红枣'},
'虫草花':{eff:'增强免疫、抗疲劳',pair:'鸡肉 / 排骨 / 枸杞'},
'黑豆':{eff:'补肾强骨',pair:'排骨 / 核桃 / 乌鸡'},
'天麻':{eff:'安神、缓解头痛眩晕',pair:'鸽子 / 鱼头 / 瘦肉'},
'沙参':{eff:'润肺止咳、滋阴',pair:'玉竹 / 瘦肉 / 老鸭'},
'玉竹':{eff:'滋阴润燥',pair:'沙参 / 瘦肉 / 老鸭'},
'杜仲':{eff:'补肾强腰',pair:'猪腰 / 排骨 / 牛膝'},
'乌鸡':{eff:'补血调经、滋阴',pair:'黄芪 / 红枣 / 枸杞'},
'排骨':{eff:'健脾养胃、补骨',pair:'莲藕 / 山药 / 玉米'},
'老鸭':{eff:'滋阴清热',pair:'冬瓜 / 沙参 / 玉竹'},
'羊肉':{eff:'温补气血、驱寒',pair:'当归 / 白萝卜 / 生姜'},
'猪肚':{eff:'健脾养胃',pair:'莲子 / 芡实 / 山药'},
'猴头菇':{eff:'养胃助消化',pair:'排骨 / 鸡肉 / 红枣'},
'陈皮':{eff:'理气健脾',pair:'老鸭 / 瘦肉 / 薏米'},
'薏米':{eff:'祛湿消肿',pair:'冬瓜 / 茯苓 / 排骨'},
'茯苓':{eff:'祛湿健脾',pair:'薏米 / 排骨 / 瘦肉'},
'五指毛桃':{eff:'健脾化湿',pair:'排骨 / 薏米 / 鸡肉'},
'土茯苓':{eff:'祛湿解毒',pair:'草龟 / 排骨 / 薏米'},
'芡实':{eff:'固肾健脾',pair:'莲子 / 猪肚 / 山药'},
'西洋参':{eff:'补气养阴',pair:'乌鸡 / 瘦肉 / 枸杞'},
'何首乌':{eff:'补血乌发',pair:'鸡肉 / 红枣 / 黑豆'},
'阿胶':{eff:'补血养颜',pair:'红枣 / 鸡蛋 / 桂圆'},
'桑葚':{eff:'补血明目',pair:'枸杞 / 红枣 / 黑芝麻'},
'黄精':{eff:'补气养阴',pair:'枸杞 / 鸡肉 / 红枣'},
'灵芝':{eff:'增强免疫、抗疲劳',pair:'排骨 / 瘦肉 / 红枣'},
'白果':{eff:'润肺止咳',pair:'腐竹 / 猪肚 / 瘦肉'},
'川贝':{eff:'润肺止咳',pair:'雪梨 / 猪肺 / 瘦肉'},
'海底椰':{eff:'润肺清热',pair:'雪梨 / 无花果 / 瘦肉'},
'石斛':{eff:'滋阴润燥',pair:'瘦肉 / 排骨 / 麦冬'},
'麦冬':{eff:'滋阴润燥',pair:'石斛 / 瘦肉 / 沙参'},
'木瓜':{eff:'养颜润肤、消食',pair:'鲫鱼 / 银耳 / 牛奶'},
'玉米':{eff:'健脾开胃',pair:'排骨 / 胡萝卜 / 胡萝卜'},
'胡萝卜':{eff:'健脾开胃、明目',pair:'排骨 / 玉米 / 牛肉'},
'鸡骨草':{eff:'清肝祛湿',pair:'猪横脷 / 排骨 / 瘦肉'},
'白凤菇':{eff:'调经补血',pair:'乌鸡 / 当归 / 红枣'},
'地虫草':{eff:'补肺益肾',pair:'排骨 / 瘦肉 / 红枣'},
'雪梨':{eff:'润肺清热、止咳',pair:'银耳 / 川贝 / 百合'},
'冬瓜':{eff:'清热利湿、消肿',pair:'薏米 / 排骨 / 瘦肉'},
'花生':{eff:'补血强筋',pair:'排骨 / 鸡脚 / 莲藕'},
'豆腐':{eff:'养胃、补充蛋白',pair:'鲫鱼 / 白菜 / 瘦肉'},
'鲫鱼':{eff:'健脾利湿、养胃',pair:'豆腐 / 木瓜 / 赤小豆'},
'猪腰':{eff:'补肾强腰',pair:'杜仲 / 排骨 / 牛膝'},
'鸽肉':{eff:'养脑安神、滋补',pair:'天麻 / 瘦肉 / 枸杞'},
'竹荪':{eff:'清淡滋补、增强免疫',pair:'鸡肉 / 瘦肉 / 枸杞'},
'茶树菇':{eff:'增强免疫',pair:'排骨 / 鸡肉 / 红枣'},
'霸王花':{eff:'清热润肺',pair:'猪骨 / 南北杏 / 瘦肉'},
'鲍鱼':{eff:'滋阴补肾',pair:'鸡肉 / 瘦肉 / 枸杞'},
'响螺':{eff:'滋阴润燥',pair:'瘦肉 / 山药 / 枸杞'},
'苦瓜':{eff:'清热解暑、降火',pair:'排骨 / 黄豆 / 瘦肉'},
'番茄':{eff:'开胃健脾',pair:'土豆 / 排骨 / 牛肉'},
'南瓜':{eff:'养胃健脾',pair:'排骨 / 小米 / 瘦肉'},
'赤小豆':{eff:'祛湿利水',pair:'鲫鱼 / 薏米 / 陈皮'},
'墨鱼':{eff:'补血养血',pair:'排骨 / 莲藕 / 瘦肉'},
'桃胶':{eff:'养颜润肤',pair:'银耳 / 皂角米 / 红枣'},
'黑蒜':{eff:'增强免疫、抗氧化',pair:'排骨 / 鸡肉 / 瘦肉'},
'鹌鹑':{eff:'健脾益气',pair:'党参 / 黄芪 / 红枣'},
'干贝':{eff:'滋阴清热、提鲜',pair:'冬瓜 / 瘦肉 / 豆腐'},
'葛根':{eff:'清热生津',pair:'鲫鱼 / 瘦肉 / 排骨'},
'菠菜':{eff:'补血明目',pair:'猪肝 / 瘦肉 / 枸杞'},
'白萝卜':{eff:'温补消食、理气',pair:'羊肉 / 排骨 / 鲫鱼'},
'核桃':{eff:'补肾健脑、乌发',pair:'黑芝麻 / 乌鸡 / 黑豆'},
'黑芝麻':{eff:'补肾乌发',pair:'核桃 / 糯米 / 红枣'},
'菜干':{eff:'润肺止咳',pair:'猪肺 / 南北杏 / 瘦肉'},
'南北杏':{eff:'止咳润肺',pair:'雪梨 / 猪肺 / 瘦肉'},
'甘蔗':{eff:'清热生津',pair:'马蹄 / 胡萝卜 / 瘦肉'},
'马蹄':{eff:'清热生津',pair:'甘蔗 / 胡萝卜 / 瘦肉'}};
var NUTRITION_TIPS=['宝宝脾胃差：主食选软烂粥面，蔬菜选丝瓜南瓜番茄等好消化的','避免肥肉：选鸡胸/鲈鱼/虾仁等瘦肉蛋白，好消化不长胖','不要杂粮饭：宝宝选白米/软面，大人正常白米饭即可','当季食材优先：选应季果蔬，营养更足价格更低','不吃生腌三文鱼：熟食为主，海鲜选清蒸鲈鱼/虾仁','早餐加奶：每天一杯牛奶补充钙和蛋白质','午餐必须有蔬菜：每餐至少一种绿色蔬菜','晚餐清淡为主：蛋白质适量，汤类暖胃助眠','水果当季最好：应季水果补充水分和维C','汤品不要过咸：淡汤养胃，盐量控制在每天5g以内','蛋白质交替吃：鸡鱼虾蛋轮换，避免单一','宝宝饮食少油少盐：1-3岁每天盐不超过2g','大人碳水正常：不极端减碳，米饭面条都可以','晚餐7点前吃完：利于消化和睡眠','每餐蔬菜量要够：大人至少150g，宝宝50-80g'];
function seededIdx(seed,len){var x=Math.sin(seed*9301+49297)*233280;return Math.floor(Math.abs(x-Math.floor(x))*len)}
function ingFilter(cat,type,ft){var arr=ING_DB[cat][type];if(ft==='milk')return arr.filter(function(v){return v.indexOf('奶')>=0||v.indexOf('酸奶')>=0||v.indexOf('牛奶')>=0});if(ft==='fruit')return arr.filter(function(v){return v.indexOf('奶')<0&&v.indexOf('酸奶')<0&&v.indexOf('牛奶')<0});return arr}
// 宝宝晚餐专用：清淡好消化食材池（避免牛羊肉/重口，晚餐以暖胃汤收尾）
var BABY_DN_PROTEIN=['蒸蛋羹','虾仁','清蒸鲈鱼','豆腐脑','虾蒸蛋','鸡胸肉丸','鱼肉泥','瘦肉末蒸蛋','鸡蛋饼','肉末豆腐'];
var BABY_DN_VEG=['丝瓜','南瓜','冬瓜','番茄','山药','胡萝卜','白萝卜','菜花','土豆'];
function generateMealSet(setNum){var s=seedOfDay()+setNum*37;var m={};
var bMilk=ingFilter('fruitDairy','baby','milk');var aMilk=ingFilter('fruitDairy','adult','milk');var bFruit=ingFilter('fruitDairy','baby','fruit');var aFruit=ingFilter('fruitDairy','adult','fruit');
m.bf={milk_b:bMilk[seededIdx(s+1,bMilk.length)],milk_a:aMilk[seededIdx(s+2,aMilk.length)],staple_b:ING_DB.staple.baby[seededIdx(s+3,ING_DB.staple.baby.length)],staple_a:ING_DB.staple.adult[seededIdx(s+4,ING_DB.staple.adult.length)],protein_b:ING_DB.protein.baby[seededIdx(s+5,ING_DB.protein.baby.length)],protein_a:ING_DB.protein.adult[seededIdx(s+6,ING_DB.protein.adult.length)],fruit_b:bFruit[seededIdx(s+7,bFruit.length)],fruit_a:aFruit[seededIdx(s+8,aFruit.length)]};
m.ln={staple_b:ING_DB.staple.baby[seededIdx(s+10,ING_DB.staple.baby.length)],staple_a:ING_DB.staple.adult[seededIdx(s+11,ING_DB.staple.adult.length)],protein_b:ING_DB.protein.baby[seededIdx(s+12,ING_DB.protein.baby.length)],protein_a:ING_DB.protein.adult[seededIdx(s+13,ING_DB.protein.adult.length)],vegetable_b:ING_DB.vegetable.baby[seededIdx(s+14,ING_DB.vegetable.baby.length)],vegetable_a:ING_DB.vegetable.adult[seededIdx(s+15,ING_DB.vegetable.adult.length)],soup_b:ING_DB.soup.baby[seededIdx(s+16,ING_DB.soup.baby.length)],soup_a:ING_DB.soup.adult[seededIdx(s+17,ING_DB.soup.adult.length)],fruit_b:bFruit[seededIdx(s+18,bFruit.length)],fruit_a:aFruit[seededIdx(s+19,aFruit.length)]};
var isSoup=seededIdx(s+26,2)===0;
m.dn={staple_b:ING_DB.staple.baby[seededIdx(s+20,ING_DB.staple.baby.length)],staple_a:ING_DB.staple.adult[seededIdx(s+21,ING_DB.staple.adult.length)],protein_b:BABY_DN_PROTEIN[seededIdx(s+22,BABY_DN_PROTEIN.length)],protein_a:ING_DB.protein.adult[seededIdx(s+23,ING_DB.protein.adult.length)],vegetable_b:BABY_DN_VEG[seededIdx(s+24,BABY_DN_VEG.length)],vegetable_a:ING_DB.vegetable.adult[seededIdx(s+25,ING_DB.vegetable.adult.length)],soupOrMilk_b:ING_DB.soup.baby[seededIdx(s+27,ING_DB.soup.baby.length)]+'（汤·暖胃）',soupOrMilk_a:isSoup?ING_DB.soup.adult[seededIdx(s+27,ING_DB.soup.adult.length)]+'（汤）':aMilk[seededIdx(s+28,aMilk.length)]+'（奶）'};
m.tip=NUTRITION_TIPS[seededIdx(s+30,NUTRITION_TIPS.length)];
return m}
function renderRecipe(){
var _base=Math.floor((Date.now()-new Date(2026,0,1))/86400000)%10;var _off=DATA._recipeSet||0;var setNum=(_base+_off)%10;var meal=generateMealSet(setNum);
var nsIdx=(seedOfDay()+(DATA._nsSet||0))%SOUP_NORMAL.length;var tsIdx=(seedOfDay()+(DATA._tsSet||0))%SOUP_STEW.length;var ns=SOUP_NORMAL[nsIdx];var ts=SOUP_STEW[tsIdx];
// Seasonal auto-switch by month
var curMonth=new Date().getMonth()+1;var sd=MONTHLY_DB[curMonth];
var sh='<div class="seasonal-header">'+sd.header+'</div>';
sh+='<div class="seasonal-sub">🍎 当季水果</div>';
sh+='<div class="seasonal-items">';
sd.fruits.forEach(function(f){var ic=fruitIcon(f);sh+='<span class="seasonal-tag seasonal-fruit"><span class="seasonal-icon">'+ic+'</span>'+f+'</span>'});
sh+='</div>';
sh+='<div class="seasonal-sub">🥬 当季蔬菜</div>';
sh+='<div class="seasonal-items">';
sd.vegetables.forEach(function(v){var ic=vegIcon(v);sh+='<span class="seasonal-tag seasonal-veg"><span class="seasonal-icon">'+ic+'</span>'+v+'</span>'});
sh+='</div>';
document.getElementById('recipeSeasonalBox').innerHTML=sh;
// Meal label
document.getElementById('recipeLabel').textContent='📅 今日推荐 · 第 '+((setNum%10)+1)+' 套';
// Meals
var meals=[{label:'早餐',emoji:'🌅',d:meal.bf,type:'bf'},{label:'午餐',emoji:'☀️',d:meal.ln,type:'ln'},{label:'晚餐',emoji:'🌙',d:meal.dn,type:'dn'}];
var h='';
meals.forEach(function(m){
h+='<div class="recipe-meal"><div class="recipe-meal-hd"><span class="emoji">'+m.emoji+'</span><span class="name">'+m.label+'</span><div class="meal-structure">'+(m.type==='bf'?'奶+主食+蛋白质+水果':m.type==='ln'?'主食+蛋白质+蔬菜+汤+水果':'主食+蛋白质+蔬菜+汤/奶')+'</div></div>';
h+='<div class="recipe-row"><span class="recipe-dot kid"></span><span class="recipe-row-label">宝宝</span></div>';
if(m.type==='bf'){h+='<div class="recipe-items">'+m.d.milk_b+' + '+m.d.staple_b+' + '+m.d.protein_b+' + '+m.d.fruit_b+'</div>'}
else if(m.type==='ln'){h+='<div class="recipe-items">'+m.d.staple_b+' + '+m.d.protein_b+' + '+m.d.vegetable_b+' + '+m.d.soup_b+' + '+m.d.fruit_b+'</div>'}
else{h+='<div class="recipe-items">'+m.d.staple_b+' + '+m.d.protein_b+' + '+m.d.vegetable_b+' + '+m.d.soupOrMilk_b+'</div>'}
h+='<div class="recipe-row"><span class="recipe-dot adult"></span><span class="recipe-row-label">成人</span></div>';
if(m.type==='bf'){h+='<div class="recipe-items">'+m.d.milk_a+' + '+m.d.staple_a+' + '+m.d.protein_a+' + '+m.d.fruit_a+'</div>'}
else if(m.type==='ln'){h+='<div class="recipe-items">'+m.d.staple_a+' + '+m.d.protein_a+' + '+m.d.vegetable_a+' + '+m.d.soup_a+' + '+m.d.fruit_a+'</div>'}
else{h+='<div class="recipe-items">'+m.d.staple_a+' + '+m.d.protein_a+' + '+m.d.vegetable_a+' + '+m.d.soupOrMilk_a+'</div>'}
h+='</div>'});
document.getElementById('recipeGrid').innerHTML=h;
document.getElementById('recipeTip').innerHTML='💡 <b>今日贴士：</b>'+meal.tip;
// Soup section with switch buttons
var sh2='<div class="soup-col"><div class="soup-col-hd">🥣 日常汤类 <button class="soup-switch-btn" onclick="switchSoup(\'ns\')">↻ 换一个</button></div><div class="soup-item"><div class="soup-item-name">'+ns.name+'</div><div class="soup-item-method">'+ns.desc+'</div></div></div>';
sh2+='<div class="soup-col"><div class="soup-col-hd">🫖 滋补炖汤 <button class="soup-switch-btn" onclick="switchSoup(\'ts\')">↻ 换一个</button></div><div class="soup-item"><div class="soup-item-name">'+ts.name+'</div><div class="soup-item-method">'+ts.desc+' · '+ts.ingredients+'</div></div></div>';
sh2+='</div>';
document.getElementById('soupDual').innerHTML=sh2}
function refreshRecipe(){DATA._recipeSet=(DATA._recipeSet||0)+1;save(DATA);renderRecipe();showToast('食谱已切换至第 '+((DATA._recipeSet%10)+1)+' 套','success')}
function switchSoup(type){if(type==='ns'){DATA._nsSet=(DATA._nsSet||0)+1}else{DATA._tsSet=(DATA._tsSet||0)+1}save(DATA);renderRecipe();showToast(type==='ns'?'日常汤已切换':'炖汤已切换','success')}
// === SOUP SEARCH (rewritten v4 - ingredient literal-first + KB fallback) ===
function smartSoupSearch(){
 var inputEl=document.getElementById('aiSoupInput');
 var input=inputEl?inputEl.value.trim():'';
 if(!input){showToast('请输入食材或需求关键词','error');return}
 var result=document.getElementById('aiSoupResult');
 if(!result){console.error('aiSoupResult element not found!');return}
 result.style.display='block';
 result.innerHTML='<div style="text-align:center;padding:16px"><div style="display:inline-block;width:24px;height:24px;border:3px solid var(--g5);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite"></div><div style="font-size:13px;color:var(--text-s);margin-top:8px">正在为你匹配「'+input+'」的炖汤方…</div></div>';
 var kw=input.toLowerCase();
 var kws=kw.split(/[\s,，、]+/).filter(function(k){return k.length>0});
 var ingEffectMap={'山药':['健脾','养胃','脾胃','补肾'],'莲藕':['补血','养胃','脾胃'],'莲子':['安神','健脾','补虚','养心'],'银耳':['润肺','养颜','滋阴'],'百合':['润肺','安神','咳嗽'],'红枣':['补血','补气','气血','养颜'],'桂圆':['补血','安神','失眠'],'枸杞':['养肝','明目','滋肾','补气'],'当归':['补血','调经','气血','温补'],'黄芪':['补气','益气','元气','气虚'],'党参':['补气','益气','健脾','气虚'],'花胶':['养颜','滋补','胶原蛋白'],'虫草花':['免疫','增强','抗疲劳'],'黑豆':['补肾','强骨','骨骼'],'天麻':['安神','头痛','眩晕','养脑'],'沙参':['润肺','止咳','滋阴'],'玉竹':['滋阴','润燥','阴虚'],'杜仲':['补肾','强腰','腰痛'],'乌鸡':['补血','调经','气血','女性'],'猪蹄':['养颜','胶原蛋白','补血'],'排骨':['健脾','养胃','骨骼'],'老鸭':['滋阴','清热','阴虚'],'羊肉':['温补','驱寒','气血'],'猪肚':['健脾','养胃','脾胃','补虚'],'猴头菇':['养胃','消化','胃病'],'陈皮':['理气','健脾','消化','脾胃'],'薏米':['祛湿','利湿','湿气','水肿'],'茯苓':['祛湿','健脾','湿气'],'五指毛桃':['健脾','化湿','祛湿'],'土茯苓':['祛湿','解毒','湿热'],'芡实':['固肾','健脾','肾'],'西洋参':['补气','养阴','气虚'],'何首乌':['补血','乌发','头发'],'阿胶':['补血','养颜','贫血','气血'],'桑葚':['补血','明目','眼睛'],'黄精':['补气','养阴','气虚','疲劳'],'灵芝':['免疫','增强','抗疲劳','养生'],'白果':['润肺','止咳','咳嗽'],'川贝':['润肺','止咳','咳嗽'],'海底椰':['润肺','清热','咳嗽'],'石斛':['滋阴','润燥','阴虚'],'麦冬':['滋阴','润燥','阴虚'],'木瓜':['养颜','润肤','美容'],'玉米':['健脾','开胃'],'胡萝卜':['健脾','开胃','明目'],'鸡骨草':['清肝','祛湿','肝'],'白凤菇':['调经','补血','女性'],'地虫草':['补肺','益肾'],'雪梨':['润肺','清热','咳嗽'],'冬瓜':['清热','利湿','祛湿'],'花生':['补血','强筋'],'豆腐':['养胃','蛋白质'],'鲫鱼':['健脾','养胃','利湿'],'猪腰':['补肾','强腰'],'鸽肉':['养脑','安神','滋补'],'羊肚菌':['免疫','增强','健脾'],'无花果':['润肺','止咳','润燥'],'虎乳菌':['润肺','止咳','化痰'],'竹荪':['滋补','增强','养胃'],'茶树菇':['免疫','增强'],'霸王花':['清热','润肺'],'鲍鱼':['滋阴','补肾'],'响螺':['滋阴','润燥'],'苦瓜':['清热','降火'],'番茄':['开胃','健脾'],'南瓜':['养胃','健脾'],'赤小豆':['祛湿','利湿'],'墨鱼':['补血','养血'],'桃胶':['养颜','润肤'],'黑蒜':['免疫','增强'],'鹌鹑':['健脾','益气'],'干贝':['滋阴','清热'],'葛根':['清热','生津'],'菠菜':['补血','明目'],'白萝卜':['温补','消食'],'核桃':['补肾','乌发'],'黑芝麻':['补肾','乌发'],'菜干':['润肺','止咳'],'南北杏':['止咳','润肺'],'甘蔗':['清热','生津'],'马蹄':['清热','生津']};
 var effectMap={'润肺':['润肺','止咳','养阴','清肺','咳嗽'],'祛湿':['祛湿','利湿','化湿','湿气','水肿','健脾'],'滋阴':['滋阴','养阴','润燥','阴虚','干燥'],'补气':['补气','益气','元气','健脾','气虚','疲劳'],'补血':['补血','养血','气血','调经','贫血'],'养胃':['养胃','健脾','脾胃','消化','胃病'],'安神':['安神','养心','睡眠','失眠'],'清热':['清热','降火','解暑','凉','解毒'],'补肾':['补肾','强骨','强腰','益肾','固肾'],'养颜':['养颜','润肤','美容','胶原蛋白'],'增强免疫':['免疫','增强','抗疲劳','养生'],'明目':['明目','眼睛','肝肾'],'调经':['调经','月经','气血','女性'],'温补':['温补','驱寒','气血'],'理气':['理气','健脾','消化','脾胃'],'乌发':['乌发','头发','补血'],'止咳':['止咳','咳嗽','润肺'],'助消化':['消化','养胃','健脾','脾胃','开胃'],'抗疲劳':['抗疲劳','增强','免疫','补气'],'健脾':['健脾','脾胃','养胃','消化'],'清热解毒':['清热','解毒','降火','凉'],'补肺':['补肺','润肺','益肾','肺'],'益肾':['益肾','补肾','固肾','肾'],'失眠':['安神','养心','睡眠','失眠'],'咳嗽':['止咳','咳嗽','润肺'],'疲劳':['抗疲劳','增强','免疫','补气','疲劳'],'气虚':['补气','益气','元气','气虚'],'血虚':['补血','养血','气血','贫血'],'湿气':['祛湿','利湿','化湿','湿气','水肿'],'胃病':['养胃','健脾','脾胃','消化','胃病'],'头痛':['安神','养脑','头痛','眩晕'],'腰痛':['补肾','强腰','腰痛','腰膝'],'贫血':['补血','养血','气血','贫血'],'月经':['调经','月经','气血','女性'],'睡眠':['安神','养心','睡眠','失眠'],'消化':['消化','养胃','健脾','脾胃','开胃'],'免疫力':['免疫','增强','抗疲劳','养生'],'美容':['养颜','润肤','美容','胶原蛋白'],'干燥':['滋阴','润燥','阴虚','干燥'],'水肿':['祛湿','利湿','湿气','水肿'],'驱寒':['温补','驱寒','气血'],'开胃':['健脾','开胃','消化'],'骨骼':['补肾','强骨','骨骼','强筋'],'强腰':['补肾','强腰','腰痛'],'润燥':['滋阴','润燥','阴虚','干燥'],'凉血':['凉血','补血','清热'],'生津':['生津','清热','润燥'],'消食':['消食','开胃','健脾','消化'],'养脑':['养脑','安神','头痛','眩晕'],'活血':['活血','补血','养血'],'护肝':['护肝','养肝','清肝'],'养肝':['养肝','护肝','滋肾'],'利湿':['利湿','祛湿','湿气','水肿'],'降火':['降火','清热','解毒'],'解暑':['解暑','清热','降火'],'固肾':['固肾','补肾','益肾'],'气血':['气血','补血','补气'],'养阴':['养阴','滋阴','润燥']};
 var NEED_EXTRA=new Set(['润燥','凉血','生津','消食','养脑','活血','护肝','养肝','利湿','降火','解暑','固肾','气血','养阴']);
 function isNeed(k){return !!effectMap[k]||NEED_EXTRA.has(k)}
 function scoreDirect(s,k){
  var name=(s.name||'').toLowerCase(),ing=(s.ingredients||'').toLowerCase(),desc=(s.desc||'').toLowerCase();
  if(name.indexOf(k)>=0)return {p:6,r:'名称含「'+k+'」'};
  if(ing.indexOf(k)>=0)return {p:5,r:'食材含「'+k+'」'};
  if(desc.indexOf(k)>=0)return {p:3,r:'简介含「'+k+'」'};
  return {p:0,r:''};
 }
 function scoreEffect(s,k){
  var eff=((s.effect||[]).join(' ')).toLowerCase();var pts=0;var rs=[];
  if(effectMap[k]){effectMap[k].forEach(function(e){if(eff.indexOf(e)>=0){pts+=4;rs.push('功效含「'+e+'」')}})}
  if(ingEffectMap[k]){ingEffectMap[k].forEach(function(e){if(eff.indexOf(e)>=0){pts+=3;rs.push('功效含「'+e+'」')}})}
  return {p:pts,r:rs};
 }
 if(typeof SOUP_STEW==='undefined'||!SOUP_STEW.length){result.innerHTML='<div class="soup-search-card"><div class="soup-search-desc">炖汤数据库暂未加载，请稍后重试。</div></div>';return;}
 var scored=SOUP_STEW.map(function(s){
  var direct=0,eff=0,reasons=[];
  kws.forEach(function(k){
   var d=scoreDirect(s,k);if(d.p){direct+=d.p;if(reasons.indexOf(d.r)<0)reasons.push(d.r);}
   if(isNeed(k)){var e=scoreEffect(s,k);if(e.p){eff+=e.p;e.r.forEach(function(rr){if(reasons.indexOf(rr)<0)reasons.push(rr)})}}
  });
  return {s:s,direct:direct,eff:eff,reasons:reasons};
 });
 var ingKws=kws.filter(function(k){return !isNeed(k)});
 var needKws=kws.filter(function(k){return isNeed(k)});
 var finalList=[];
 if(ingKws.length){
  var ingList=scored.filter(function(x){return x.direct>0}).sort(function(a,b){return b.direct-a.direct});
  finalList=ingList.slice(0,3);
 }
 if(needKws.length && finalList.length<3){
  var effList=scored.filter(function(x){return x.eff>0 && finalList.indexOf(x)<0}).sort(function(a,b){return b.eff-a.eff});
  effList.forEach(function(x){if(finalList.length<3)finalList.push(x)});
 }
 function cardHtml(x){
  var s=x.s;var h='';
  h+='<div class="soup-search-card">';
  h+='<div class="soup-search-card-hd"><span class="soup-search-name">🫖 '+escAttr(s.name)+'</span><span class="soup-search-effect">'+(s.effect||[]).slice(0,4).join(' · ')+'</span></div>';
  h+='<div class="soup-search-desc">'+escAttr(s.desc)+'</div>';
  if(x.reasons&&x.reasons.length)h+='<div class="soup-match-reason">✅ 匹配理由：'+escAttr(x.reasons.slice(0,3).join('；'))+'</div>';
  h+='<div class="soup-search-detail"><b>📋 食材：</b>'+escAttr(s.ingredients)+'</div>';
  h+='<div class="soup-search-detail"><b>📝 步骤：</b>'+escAttr(s.steps)+'</div>';
  h+='<div class="soup-search-detail"><b>💡 小贴士：</b>'+escAttr(s.tips)+'</div>';
  h+='<div class="soup-search-detail"><b>⏱ 炖煮：</b>'+escAttr(s.time)+'</div>';
  h+='<div class="soup-search-links">';
  h+='<a href="https://www.xiaohongshu.com/search_result?keyword='+encodeURIComponent(s.name)+'" target="_blank" class="course-col-link">📕 小红书</a>';
  h+='<a href="https://www.xiachufang.com/search/?keyword='+encodeURIComponent(s.name)+'" target="_blank" class="course-col-link">🍳 下厨房</a>';
  h+='<a href="https://www.douyin.com/search/'+encodeURIComponent(s.name+' 炖汤教程')+'" target="_blank" class="course-col-link">🎵 抖音</a>';
  h+='</div></div>';
  return h;
 }
 function sugCard(ing){
  var kb=ING_KB[ing]||{eff:'（暂未收录详细功效，可搭配瘦肉/排骨/红枣炖煮）',pair:'瘦肉 / 排骨 / 红枣'};
  var name0=ing+'（建议配方）';
  var h='<div class="soup-search-card soup-search-card-sug">';
  h+='<div class="soup-search-card-hd"><span class="soup-search-name">🫖 '+escAttr(name0)+' <span class="soup-sug-badge">建议</span></span><span class="soup-search-effect">'+escAttr(kb.eff)+'</span></div>';
  h+='<div class="soup-search-desc">'+escAttr(kb.eff)+'</div>';
  h+='<div class="soup-search-detail"><b>📋 建议食材：</b>'+escAttr(ing+' '+kb.pair)+'</div>';
  h+='<div class="soup-search-detail"><b>📝 参考步骤：</b>'+escAttr(ing+' 洗净处理好，与 '+kb.pair+' 一同冷水入锅，大火煮沸转小火慢炖，加盐调味（具体时长与火候点击链接查看真实做法）')+'</div>';
  h+='<div class="soup-search-detail"><b>💡 小贴士：</b>本配方为智能建议，实际做法以链接教程为准</div>';
  h+='<div class="soup-search-links">';
  h+='<a href="https://www.xiaohongshu.com/search_result?keyword='+encodeURIComponent(ing+' 炖汤')+'" target="_blank" class="course-col-link">📕 小红书</a>';
  h+='<a href="https://www.xiachufang.com/search/?keyword='+encodeURIComponent(ing+' 炖汤方')+'" target="_blank" class="course-col-link">🍳 下厨房</a>';
  h+='<a href="https://www.douyin.com/search/'+encodeURIComponent(ing+' 炖汤教程')+'" target="_blank" class="course-col-link">🎵 抖音</a>';
  h+='</div></div>';
  return h;
 }
 function footerLinks(){
  var h='<div style="margin-top:12px;font-size:12px;font-weight:700;color:var(--accent-d)">🔗 更多平台搜索"'+escAttr(input)+'"：</div>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">';
  h+='<a href="https://www.xiaohongshu.com/search_result?keyword='+encodeURIComponent(input+' 炖汤')+'" target="_blank" class="course-col-link">📕 小红书搜索更多</a>';
  h+='<a href="https://www.xiachufang.com/search/?keyword='+encodeURIComponent(input+' 炖汤方')+'" target="_blank" class="course-col-link">🍳 下厨房搜索更多</a>';
  h+='<a href="https://www.douyin.com/search/'+encodeURIComponent(input+' 炖汤教程')+'" target="_blank" class="course-col-link">🎵 抖音搜索更多</a>';
  h+='</div>';
  return h;
 }
 if(finalList.length){
  var h='<div style="background:var(--accent-l);border-radius:12px;padding:14px;border:1px solid var(--g6);width:100%">';
  h+='<div style="font-weight:800;font-size:14px;margin-bottom:4px">🔍 为你匹配到 '+finalList.length+' 个炖汤方</div>';
  h+='<div style="font-size:12px;color:var(--text-s);margin-bottom:10px">关键词：'+escAttr(input)+'</div>';
  finalList.forEach(function(x){h+=cardHtml(x)});
  if(ingKws.length){
    ingKws.forEach(function(k){
      if(finalList.length>=3)return;
      h+=sugCard(k);finalList.push({s:{name:k}});
    });
  }
  h+=footerLinks();
  h+='</div>';
  result.innerHTML=h;
  showToast('为你匹配到 '+finalList.length+' 个炖汤方','success');
 } else {
  var h='<div style="background:var(--accent-l);border-radius:12px;padding:14px;border:1px solid var(--g6);width:100%">';
  h+='<div style="font-weight:800;font-size:14px;margin-bottom:6px">🔍 没找到完全匹配的配方，为你生成建议</div>';
  kws.forEach(function(k){ if(finalList.length<3){ h+=sugCard(k); finalList.push({s:{name:k}}); } });
  h+=footerLinks();
  h+='</div>';
  result.innerHTML=h;
  showToast('已为你生成建议配方','success');
 }
}
// === READING (摘读) ===
var READING_POOL=[
{title:'真正的强大，是温柔地对待自己',body:'很多人以为强大就是硬扛、就是不哭、就是咬牙坚持。但真正的强大，是在疲惫的时候允许自己休息，是在失败的时候给自己一个拥抱。\n\n你不必时时刻刻都坚强。生活不是一场需要赢的比赛，而是一段需要感受的旅程。对自己温柔，不是软弱，是智慧。',source:'人民日报夜读',tags:['自我成长','温柔力量','女性独立']},
{title:'每一个坚持的日子，都在为未来铺路',body:'背了10个单词好像什么没记住；运动30分钟好像身材没变化。但请相信：每一个坚持的日子，都在为未来铺路。\n\n就像种子在土里默默生长，你以为它没动静，其实它正在扎根。你今天的每一份努力，都是明天的底气。',source:'人民日报文摘',tags:['坚持','成长','每日进步']},
{title:'独立不是不需要任何人，而是有选择的底气',body:'真正的独立，不是把自己活成一座孤岛，而是：我有能力自己解决问题，也可以选择接受帮助。\n\n独立的本质是——你有选择的底气。你可以选择留下，也可以选择离开；可以选择合作，也可以选择独走。这才是真正的自由。',source:'人民日报夜读',tags:['独立','底气','女性成长']},
{title:'你不必等到完美，才可以开始',body:'很多人迟迟不动，是因为觉得还没准备好。但完美是做出来的，不是等出来的。\n\n想学化妆，就从一支口红开始；想做视频，就先用手机拍第一条。开始的笨拙，好过永远的等待。',source:'洞见',tags:['行动','打破拖延','自我重启']},
{title:'慢一点，也没关系',body:'别人三分钟热度，你三个月才起步，这没什么丢人的。每个人的时区不同。\n\n花不开在春天，也会开在夏天。你只管按自己的节奏走，不必追赶谁。',source:'读者',tags:['松弛感','心态','不焦虑']},
{title:'把日子过成自己喜欢的样子',body:'独立不是离开谁，而是终于可以为自己活一次。哪怕只是今天给自己做顿好吃的，挑一件喜欢的衣服。\n\n生活的小确幸，是你一点点攒回来的。',source:'人民日报夜读',tags:['生活方式','悦己','小确幸']},
{title:'你今天的努力，是明天的底气',body:'你现在学的每一项技能、读的每一本书，都会在某天变成你手里的牌。\n\n底气不是凭空来的，是日复一日的积累堆出来的。别着急看到结果。',source:'人民日报文摘',tags:['积累','底气','成长']},
{title:'允许自己偶尔停下来',body:'一直紧绷的人，迟早会断。累了就歇一歇，不是偷懒，是给自己充电。\n\n就像手机也要充电，人更需要。休息，是为了走更远的路。',source:'洞见',tags:['自我照顾','松弛','能量']},
{title:'最好的贵人，是努力的自己',body:'指望别人拉一把，不如自己长出筋骨。当你开始认真做事，机会自然会找上门。\n\n这世上最稳的依靠，是你不肯放弃的那股劲。',source:'读者',tags:['独立','努力','底气']},
{title:'不必追赶别人的节奏',body:'有人20岁立业，有人30岁才起步，有人40岁重新出发。人生不是赛跑，没有标准答案。\n\n你走你的路，风景自有你的好。',source:'人民日报夜读',tags:['不焦虑','自我接纳','节奏']},
{title:'温柔是一种高级的力量',body:'温柔不是软弱，是看清了生活的难，还愿意好好说话、好好待人。\n\n能温柔待人的人，内心往往最有力量。',source:'洞见',tags:['温柔','力量','修养']},
{title:'你值得被好好对待',body:'别总把最好的一面留给别人，把将就留给自己。你也很重要，值得被珍惜。\n\n先学会爱自己，世界才会用同样的方式对你。',source:'读者',tags:['自爱','悦己','女性成长']},
{title:'成长是把哭声调成静音，再变成微笑',body:'那些咬着牙熬过来的夜晚，终会变成你脸上的从容。\n\n不是不难过了，是学会了自己接住自己。',source:'人民日报夜读',tags:['韧性','成长','自愈']},
{title:'一个人的时候，也要好好吃饭',body:'独处不是孤独。给自己煮一碗热汤，把房间收拾干净，是对生活最基本的尊重。\n\n你怎样对待自己，生活就怎样回馈你。',source:'读者',tags:['独处','自爱','生活']},
{title:'你可以同时害怕和勇敢',body:'想做自媒体又怕被笑，想学跳舞又怕笨拙——害怕不代表你不能做。\n\n勇敢不是没有恐惧，是带着恐惧也往前迈了一步。',source:'洞见',tags:['勇气','突破','行动']},
{title:'把时间花在自己身上，从不亏',body:'化妆、运动、学一门手艺，这些花在自己身上的时间，谁也拿不走。\n\n投资自己，是这辈子最稳的生意。',source:'人民日报文摘',tags:['投资自己','成长','悦己']},
{title:'不必证明给谁看',body:'你过得好不好，不需要向任何人交代。活给自己看，比活给别人看轻松太多。\n\n收回讨好别人的力气，用来成全自己。',source:'读者',tags:['讨好型','做自己','松弛']},
{title:'爱自己，是一生浪漫的开始',body:'先成为自己的光，才能照亮别人。每天给自己一点偏爱，不是自私，是必要。\n\n你值得被爱，首先得是自己给的。',source:'人民日报夜读',tags:['自爱','浪漫','女性成长']},
{title:'迈出第一步，就赢了大多数人',body:'想，都是问题；做，才有答案。很多人停在想，而你肯动手，就已经胜出。\n\n完成比完美重要，出发比到达重要。',source:'洞见',tags:['行动','突破','开始']},
{title:'你的价值，不取决于别人的评价',body:'被夸不一定高，被贬不一定低。别人的嘴，定义不了你的人生。\n\n把评价的尺子拿回自己手里，你就自由了。',source:'读者',tags:['自我价值','独立','底气']},
{title:'生活不会辜负认真的人',body:'你认真做的每一顿饭、每一条视频、 every 一次打卡，生活都记着。\n\n也许不会马上回报，但一定在某个转角等你。',source:'人民日报文摘',tags:['认真','积累','回报']},
{title:'与其羡慕，不如行动',body:'看到别人好，别只酸。问问自己：我能从今天开始做点什么？\n\n羡慕是燃料，行动才是引擎。',source:'洞见',tags:['行动','成长','心态']},
{title:'今天的疲惫，是明天从容的铺垫',body:'带娃的累、家务的烦，都是真实的。但正是这些琐碎，把你磨出了韧性。\n\n今天扛住的，都会变成明天的从容。',source:'读者',tags:['韧性','宝妈','成长']},
{title:'学会说不，也是一种成长',body:'不敢拒绝的人，活得很累。试着对不合理的要求说不打紧，天不会塌。\n\n你的边界，是你保护自己的围墙。',source:'人民日报夜读',tags:['边界','讨好型','成长']},
{title:'你比自己以为的更坚韧',body:'回头看，那些以为过不去的坎，你不都过来了吗？\n\n你比想象中能扛。下次难的时候，记得这点。',source:'洞见',tags:['韧性','自信','自愈']},
{title:'把小事做好，就是大事的开始',body:'每天打卡、每天读一页书、每天化个淡妆——这些小事串起来，就是不一样的你。\n\n别小看微小的坚持。',source:'读者',tags:['坚持','积累','微习惯']},
{title:'愿你手里有活，眼里有光',body:'有一技之长，心里就不慌；有热爱之事，日子就有盼头。\n\n手里有活，眼里就有光，走到哪都不怕。',source:'人民日报文摘',tags:['技能','热爱','底气']},
{title:'不必慌张，好事正在路上',body:'有些事急不来。就像春天的花，时候到了自然开。\n\n稳住，你想要的正在赶来的路上。',source:'读者',tags:['心态','松弛','希望']},
{title:'照顾好自己，才能照顾好所爱',body:'你是妈妈、是女儿、是妻子，但你首先是你自己。先把自己填满，才有余力爱别人。\n\n别等到空了才想起要充电。',source:'人民日报夜读',tags:['自我照顾','宝妈','悦己']},
{title:'每天进步一点点，就够了',body:'不必一口吃成胖子。今天比昨天多懂一点，就是胜利。\n\n量变到质变，需要的是时间，不是速度。',source:'洞见',tags:['微进步','坚持','心态']},
{title:'你正在成为更好的自己',body:'也许变化很小，但方向是对的。每熬过一次想放弃，你就离更好的自己近一点。\n\n请相信这个过程。',source:'读者',tags:['成长','自信','过程']},
{title:'未来的你，会感谢现在不放弃的自己',body:'当下的难，会变成将来的底气。现在的每一次坚持，都是给未来写信。\n\n别停，前方有光。',source:'人民日报文摘',tags:['坚持','希望','未来']}
];
function renderReading(){var s=seedOfDay();var r=READING_POOL[s%READING_POOL.length];var dateStr=(new Date().getMonth()+1)+'月'+new Date().getDate()+'日';var h='<div class="reading-card"><div class="reading-date">📖 '+dateStr+' · 每日言值</div><div class="reading-title">'+r.title+'</div><div class="reading-body">'+r.body.replace(/\n/g,'<br>')+'</div><div class="reading-source">—— '+r.source+'</div><div class="reading-tags">';r.tags.forEach(function(t){h+='<span class="reading-tag">'+t+'</span>'});h+='</div></div>';document.getElementById('readingContent').innerHTML=h}
function refreshReading(){var s=seedOfDay();var r=READING_POOL[(s+1)%READING_POOL.length];var dateStr=(new Date().getMonth()+1)+'月'+new Date().getDate()+'日';var h='<div class="reading-card"><div class="reading-date">📖 '+dateStr+' · 每日言值</div><div class="reading-title">'+r.title+'</div><div class="reading-body">'+r.body.replace(/\n/g,'<br>')+'</div><div class="reading-source">—— '+r.source+'</div><div class="reading-tags">';r.tags.forEach(function(t){h+='<span class="reading-tag">'+t+'</span>'});h+='</div></div>';document.getElementById('readingContent').innerHTML=h;showToast('摘读已更新','success')}
// === DATA SYNC ===
function _favSnap(){try{return {favI:JSON.parse(localStorage.getItem('growth_v5_fav_inspire')||'[]'),favH:JSON.parse(localStorage.getItem('growth_v5_fav_hot')||'[]')}}catch(e){return{favI:[],favH:[]}}}
function _favApply(p){try{if(p&&p.favI)localStorage.setItem('growth_v5_fav_inspire',JSON.stringify(p.favI));if(p&&p.favH)localStorage.setItem('growth_v5_fav_hot',JSON.stringify(p.favH))}catch(e){}}
function openSyncModal(){document.getElementById('syncModal').classList.add('show');var p={v:1,data:DATA};var f=_favSnap();p.favI=f.favI;p.favH=f.favH;document.getElementById('syncCodeOut').value=btoa(unescape(encodeURIComponent(JSON.stringify(p))))}
function closeSyncModal(){document.getElementById('syncModal').classList.remove('show')}
function switchSyncTab(tab){document.getElementById('syncTabExport').classList.toggle('active',tab==='export');document.getElementById('syncTabImport').classList.toggle('active',tab==='import');document.getElementById('syncExportBox').style.display=tab==='export'?'block':'none';document.getElementById('syncImportBox').style.display=tab==='import'?'block':'none'}
function copySyncCode(){var el=document.getElementById('syncCodeOut');el.select();try{navigator.clipboard.writeText(el.value);showToast('同步码已复制','success')}catch(e){document.execCommand('copy');showToast('同步码已复制','success')}}
// 备份为本地文件（最稳妥，推荐）
function downloadBackup(){try{var f=_favSnap();var payload={v:1,ts:Date.now(),data:DATA,favI:f.favI,favH:f.favH};var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});var a=document.createElement('a');var d=new Date();var pad=function(n){return(n<10?'0':'')+n};var name='成长空间备份_'+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'.json';a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(a.href);showToast('备份文件已下载，请妥善保存 💾','success')}catch(e){showToast('下载失败','error')}}
function restoreFromFile(input){var f=input.files&&input.files[0];if(!f)return;var rd=new FileReader();rd.onload=function(){try{var p=JSON.parse(rd.result);if(p&&p.data){DATA=p.data;save(DATA)}_favApply(p);init();closeSyncModal();showToast('已从备份文件恢复 ✅','success')}catch(e){showToast('备份文件格式错误','error')}};rd.readAsText(f)}
function importSyncCode(){var code=document.getElementById('syncCodeIn').value.trim();if(!code){showToast('请粘贴同步码','error');return}try{var p=JSON.parse(decodeURIComponent(escape(atob(code))));if(p&&p.data){DATA=p.data;save(DATA)}_favApply(p);init();closeSyncModal();showToast('数据导入成功','success')}catch(e){showToast('同步码格式错误','error')}}

// === DAILY QUOTE (励志语卡片) ===
var QUOTE_POOL=[
{q:'种一棵树最好的时间是十年前，其次是现在。',a:'丹比萨·莫约',s:'《援助的死亡》'},
{q:'你不需要很厉害才能开始，但你需要开始才能很厉害。',a:'Zig Ziglar',s:' motivational speaker'},
{q:'每一个不曾起舞的日子，都是对生命的辜负。',a:'尼采',s:'《查拉图斯特拉如是说》'},
{q:'生活不是等待暴风雨过去，而是学会在雨中翩翩起舞。',a:'维维安·格林',s:''},
{q:'没有什么胜利可言，挺住意味着一切。',a:'里尔克',s:'《给青年诗人的信》'},
{q:'当你觉得为时已晚的时候，恰恰是最早的时候。',a:'哈佛校训',s:''},
{q:'世界上最勇敢的事，是微笑着面对一切不确定。',a:'佚名',s:''},
{q:'所有的闪光，都是熬过的暗。',a:'佚名',s:''},
{q:'你不能回到过去改变开头，但你可以从现在开始改变结局。',a:'C.S. Lewis',s:''},
{q:'命运给你一个比别人低的起点，是想告诉你用一生去奋斗出一个绝地反击的故事。',a:'佚名',s:''},
{q:'当你穿过暴风雨，你已不再是从前那个人。',a:'村上春树',s:'《海边的卡夫卡》'},
{q:'不要因为走得太远，而忘了为什么出发。',a:'纪伯伦',s:''},
{q:'人生没有白走的路，每一步都算数。',a:'佚名',s:''},
{q:'你要悄悄拔尖，然后惊艳所有人。',a:'佚名',s:''},
{q:'只要你不认输，就有翻盘的机会。',a:'佚名',s:''},
{q:'与其抱怨黑暗，不如提灯前行。',a:'佚名',s:''},
{q:'熬得住出众，熬不住出局。',a:'佚名',s:''},
{q:'温柔要有，但不是妥协。我们要在安静中，不慌不忙地坚强。',a:'林徽因',s:''},
{q:'你做三四月的事，在八九月自有答案。',a:'佚名',s:''},
{q:'一个人至少拥有一个梦想，有一个理由去坚强。',a:'三毛',s:''},
{q:'生活总会给你另一次机会，这个机会叫明天。',a:'佚名',s:''},
{q:'星光不问赶路人，时光不负有心人。',a:'佚名',s:''},
{q:'你今天的努力，是幸运的伏笔；当下的付出，是明日的花开。',a:'佚名',s:''},
{q:'半山腰总是最挤的，你得去山顶看看。',a:'佚名',s:''},
{q:'愿你在迷茫时，坚信你的珍贵。',a:'电影《无问西东》',s:''},
{q:'没有人会让你输，除非你不想赢。',a:'佚名',s:''},
{q:'别怕路长，慢慢走总能抵达。',a:'佚名',s:''},
{q:'把每一个平凡的日子，过成值得回忆的样子。',a:'佚名',s:''},
{q:'当你足够努力，幸运总会和你不期而遇。',a:'佚名',s:''},
{q:'把眼前的事情做到极致，下一步自然会清晰。',a:'佚名',s:''},
{q:'不怕万人阻挡，只怕自己投降。',a:'佚名',s:''},
{q:'无论你正经历着什么，坚持住，你会看见最坚强的自己。',a:'佚名',s:''},
{q:'这世上只有一种成功，就是能用自己喜欢的方式过一生。',a:'佚名',s:''},
{q:'你要相信，你生命里遇到的每一个人、每一件事，都有它的意义。',a:'佚名',s:''},
{q:'种下努力的种子，收获成功的果实。',a:'佚名',s:''},
{q:'今天多一分努力，明天少一分遗憾。',a:'佚名',s:''},
{q:'你所浪费的今天，是昨天殒命之人所渴望的明天。',a:'哈佛校训',s:''},
{q:'破茧成蝶之前，总要独自熬过那段黑暗。',a:'佚名',s:''},
{q:'世上没有绝望的处境，只有对处境绝望的人。',a:'佚名',s:''},
{q:'跌倒了不可怕，可怕的是再也不敢站起来。',a:'佚名',s:''},
{q:'我不是天生强大，我只是天生要强。',a:'佚名',s:''},
{q:'生活磨平了你的棱角，是为了让你滚得更远。',a:'佚名',s:''},
{q:'每个优秀的人，都有一段沉默的时光。那段时光，是付出了很多努力却得不到结果的日子，我们把它叫做扎根。',a:'佚名',s:''},
{q:'不要轻易否定自己，你远比想象中更强大。',a:'佚名',s:''},
{q:'纵有疾风起，人生不言弃。',a:'宫崎骏',s:'《起风了》'},
{q:'人的一切痛苦，本质上都是对自己无能的愤怒。',a:'王小波',s:''},
{q:'只有不回避痛苦和迷茫的人，才有资格去谈乐观与坚定。',a:'佚名',s:''},
{q:'你受的苦，总有一天会照亮你走的路。',a:'佚名',s:''},
{q:'所谓无底深渊，下去也是前程万里。',a:'木心',s:''},
{q:'生命中最伟大的光辉不在于永不坠落，而是坠落后总能再度升起。',a:'曼德拉',s:''},
{q:'做你害怕做的事，害怕自然就会消失。',a:'拉尔夫·爱默生',s:''},
{q:'想，全是问题；做，才是答案。',a:'佚名',s:''},
{q:'人生的路上，如果你懂得体谅、懂得宽容，日子就会很温馨很安宁。',a:'佚名',s:''},
{q:'不管前方的路有多苦，只要走的方向正确，不管多么崎岖不平，都比站在原地更接近幸福。',a:'宫崎骏',s:'《千与千寻》'},
{q:'靠山山会倒，靠人人会跑，只有自己最可靠。',a:'佚名',s:''},
{q:'与其仰望别人，不如点亮自己。',a:'佚名',s:''},
{q:'独立，不是为了证明什么，而是为了不再依附什么。',a:'佚名',s:''},
{q:'一个人最好的状态：眼里写满故事，脸上不见风霜。',a:'佚名',s:''},
{q:'做自己的太阳，无需凭借别人的光。',a:'佚名',s:''},
{q:'当你经济独立了，你才有底气去追求你想要的生活。',a:'佚名',s:''},
{q:'不亏待每一份热情，不讨好任何冷漠。',a:'佚名',s:''},
{q:'温柔且有力量，清醒且独立。',a:'佚名',s:''}
];
var _quoteGradients=[
['#d8f3dc','#b7e4c7'],['#e8f5e9','#c8e6c9'],['#c1dfc4','#a8d5ba'],
['#f0f4f0','#d4e7d4'],['#dcedc8','#c5e1a5'],['#c8e6c9','#a5d6a7'],
['#e0f2e0','#b9e0b9'],['#f1f8e9','#d5e8d5'],['#b7e4c7','#95d5b2']
];
function renderQuote(){
var setNum=DATA._quoteSet||0;
var s=seedOfDay();
var idx=(s+setNum)%QUOTE_POOL.length;
var q=QUOTE_POOL[idx];
var gradIdx=(s+setNum)%_quoteGradients.length;
var grad=_quoteGradients[gradIdx];
var cards=document.querySelectorAll('.quote-card');
if(!cards.length)return;
cards.forEach(function(el){
var inner=el.querySelector('.quote-inner');
if(!inner)return;
inner.style.opacity='0';
inner.style.transform='translateY(6px)';
setTimeout(function(){
inner.innerHTML='<span class="hq-mark">\u201C</span><div class="hq-main"><div class="hq-text">'+q.q+'</div><div class="hq-author">\u2014 '+(q.a||'佚名')+(q.s?' \u00B7 '+q.s:'')+'</div></div><button class="hq-refresh" onclick="refreshQuote()" title="换一句">↻</button><span class="hq-sparkle s1">✦</span><span class="hq-sparkle s2">✧</span>';
inner.style.opacity='1';
inner.style.transform='translateY(0)';
},120);
el.style.background='linear-gradient(135deg,'+grad[0]+','+grad[1]+')';
el.onclick=function(e){if(e.target.classList&&e.target.classList.contains('hq-refresh'))return;refreshQuote()};
});
}
function refreshQuote(){
DATA._quoteSet=(DATA._quoteSet||0)+1;
save(DATA);
renderQuote();
}

// === 首页 HOME ===
function renderHome(){
 var d=new Date();var wd=['日','一','二','三','四','五','六'];var h=d.getHours();
 var g=h<6?'夜深了':h<12?'早安':h<14?'午安':h<18?'下午好':h<22?'晚上好':'夜深了';
 var ge=document.getElementById('homeGreet');if(ge)ge.textContent=g;
 var dte=document.getElementById('homeDate');if(dte)dte.textContent=(d.getMonth()+1)+'月'+d.getDate()+'日 星期'+wd[d.getDay()];
 var sub=document.getElementById('homeSub');if(sub)sub.textContent=(DATA.streak>0?('已连续打卡 '+DATA.streak+' 天 · '):'')+'今天也要好好爱自己 🌱';
 fetchWeather();renderGrowthTree();
}
function renderOverview(){
 var box=document.getElementById('homeOverview');if(!box)return;
 try{
  var ck=DATA.checkins||{};var keys=Object.keys(ck);var done=keys.filter(function(k){return ck[k]}).length;var total=keys.length;
  var st=moneyStats();
  var favI=0,favH=0;try{favI=(JSON.parse(localStorage.getItem(FAV_KEY_I)||'[]')||[]).length}catch(e){};try{favH=(JSON.parse(localStorage.getItem(FAV_KEY_H)||'[]')||[]).length}catch(e){}
  var fav=favI+favH;var streak=DATA.streak||0;var bal=st.balance;
  var items=[
   {ico:'✅',lbl:'今日打卡',val:done+'/'+total,sub:total?(Math.round(done/total*100)+'% 完成'):'去添加任务',cls:(total&&done===total)?'ov-good':''},
   {ico:'🔥',lbl:'连续打卡',val:streak+' 天',sub:streak>0?'坚持就是胜利':'从今天开始',cls:streak>0?'ov-good':''}
  ];
  var h='<div class="ov-grid">';
  items.forEach(function(it){h+='<div class="ov-card '+it.cls+'"><div class="ov-ico">'+it.ico+'</div><div class="ov-lbl">'+it.lbl+'</div><div class="ov-val">'+it.val+'</div><div class="ov-sub">'+it.sub+'</div></div>'});
  h+='</div>';
  box.innerHTML=h;
 }catch(e){console.error('overview fail',e)}
}
// 成长小树：随连续打卡天数生长（0种子→发芽→幼苗→成长期→大树→开花）
function renderGrowthTree(){
 var box=document.getElementById('homeTree');if(!box)return;
 try{
  var s=DATA.streak||0;
  var stage=s<=0?0:s<=2?1:s<=6?2:s<=13?3:s<=29?4:5;
  var names=['一颗种子','破土新芽','青青幼苗','茂盛小树','亭亭绿树','繁花盛开'];
  var trunkH=[8,22,40,64,92,108][stage];
  var canopyR=[10,20,32,44,56,62][stage];
  var leafN=[2,3,6,12,20,26][stage];
  var bloom=stage>=5;
  var cy=146-trunkH-(canopyR*0.4);
  var svg='<svg viewBox="0 0 200 160" class="tree-svg" aria-hidden="true">';
  svg+='<ellipse cx="100" cy="146" rx="44" ry="9" fill="#caa472" opacity=".5"/>';
  if(trunkH>0){svg+='<rect x="94" y="'+(146-trunkH)+'" width="12" height="'+trunkH+'" rx="5" fill="#8a5a3b"/>';svg+='<path d="M100 '+(146-trunkH+6)+' q-14 -6 -20 -18" stroke="#8a5a3b" stroke-width="4" fill="none" stroke-linecap="round"/>';}
  if(canopyR>0){svg+='<circle cx="100" cy="'+cy+'" r="'+canopyR+'" fill="#52b788" opacity=".92"/>';svg+='<circle cx="'+(100-canopyR*0.5)+'" cy="'+(cy+canopyR*0.3)+'" r="'+(canopyR*0.6)+'" fill="#74c69d" opacity=".85"/>';svg+='<circle cx="'+(100+canopyR*0.5)+'" cy="'+(cy-canopyR*0.2)+'" r="'+(canopyR*0.55)+'" fill="#95d5b2" opacity=".82"/>';}
  for(var i=0;i<leafN;i++){var ang=i/leafN*Math.PI*2;var lx=100+Math.cos(ang)*canopyR*0.8;var ly=cy+Math.sin(ang)*canopyR*0.8;svg+='<circle cx="'+lx.toFixed(1)+'" cy="'+ly.toFixed(1)+'" r="3.4" fill="#2d9e6b"/>'}
  if(bloom){for(var j=0;j<9;j++){var a2=j/9*Math.PI*2;var fx=100+Math.cos(a2)*canopyR*0.72;var fy=cy+Math.sin(a2)*canopyR*0.72;svg+='<circle cx="'+fx.toFixed(1)+'" cy="'+fy.toFixed(1)+'" r="4.4" fill="#ff9eb5"/><circle cx="'+fx.toFixed(1)+'" cy="'+fy.toFixed(1)+'" r="1.7" fill="#fff3c4"/>'}}
  svg+='</svg>';
  var msg=s<=0?'种下第一颗种子，从今天打卡开始 🌱':(bloom?'连续 '+s+' 天，小树开花啦，为你骄傲 🌸':'连续 '+s+' 天，小树正在长大 🌿');
  box.innerHTML='<div class="tree-row"><div class="tree-figure">'+svg+'</div><div class="tree-info"><div class="tree-streak"><span class="tree-flame">'+(s>0?'🔥':'🌱')+'</span><span class="tree-streak-num">'+s+'</span><span class="tree-streak-label">天连续打卡</span></div><div class="tree-stage">成长阶段：'+names[stage]+'</div></div></div><div class="tree-msg">'+msg+'</div>';
 }catch(e){console.error('tree fail',e)}
}
// 今日一句英语（贴合英语学习目标，按日切换，可收藏进学习清单）
var DAILY_ENG=[
 {en:'Small steps every day lead to big changes.',zh:'每天一小步，终将带来大改变。'},
 {en:'I am building the life I deserve.',zh:'我正在创造值得拥有的生活。'},
 {en:'Being kind to myself is a kind of strength.',zh:'善待自己，也是一种力量。'},
 {en:'Progress, not perfection.',zh:'要进步，不要求完美。'},
 {en:'I can learn anything I set my mind to.',zh:'只要下定决心，我什么都能学会。'},
 {en:'Rest is part of the work.',zh:'休息，也是努力的一部分。'},
 {en:'My worth is not defined by others.',zh:'我的价值，不由别人定义。'},
 {en:'Today I choose to begin again.',zh:'今天，我选择重新开始。'},
 {en:'Speaking up is a skill I am growing.',zh:'表达，是我正在修炼的能力。'},
 {en:'A calm mind makes a strong mother.',zh:'内心平静，才能做从容的妈妈。'},
 {en:'I invest in myself, and that is never wasted.',zh:'投资自己，从不会被辜负。'},
 {en:'Little by little, I become who I want to be.',zh:'一点点地，我正成为想成为的人。'}
];
function renderHomeEnglish(){
 var box=document.getElementById('homeEng');if(!box)return;
 try{
  var idx=((seedOfDay()%DAILY_ENG.length)+DAILY_ENG.length)%DAILY_ENG.length;
  var it=DAILY_ENG[idx];
  box.innerHTML='<div class="eng-en">'+escAttr(it.en)+'</div><div class="eng-zh">'+escAttr(it.zh)+'</div><button class="eng-save" onclick="saveDailyEng('+idx+')">📥 收进学习清单</button>';
 }catch(e){console.error('eng fail',e)}
}
function saveDailyEng(idx){try{var arr=JSON.parse(localStorage.getItem('growth_v5_eng_fav')||'[]')||[];var it=DAILY_ENG[idx];if(!arr.some(function(x){return x.en===it.en})){arr.push(it);localStorage.setItem('growth_v5_eng_fav',JSON.stringify(arr));showToast('已加入学习清单 📚','success')}else{showToast('这句已经在清单里啦','info')}}catch(e){showToast('保存失败','error')}}
// 日历已按需求移除（不再在首页展示）
function weatherDesc(code){var map={0:['☀️','晴'],1:['🌤','大致晴朗'],2:['⛅','局部多云'],3:['☁️','阴'],45:['🌫','雾'],48:['🌫','雾凇'],51:['🌦','毛毛雨'],53:['🌦','毛毛雨'],55:['🌦','毛毛雨'],56:['🌧','冻雨'],57:['🌧','冻雨'],61:['🌧','小雨'],63:['🌧','中雨'],65:['🌧','大雨'],66:['🌨','冻雨'],67:['🌨','冻雨'],71:['🌨','小雪'],73:['🌨','中雪'],75:['❄️','大雪'],77:['🌨','雪粒'],80:['🌦','阵雨'],81:['🌦','阵雨'],82:['⛈','强阵雨'],85:['🌨','阵雪'],86:['🌨','阵雪'],95:['⛈','雷阵雨'],96:['⛈','雷阵雨伴冰雹'],99:['⛈','雷阵雨伴冰雹']};var it=map[code]||['🌡','未知'];return{emoji:it[0],text:it[1]}}
function dressIndex(t){if(t==null)return{emoji:'👕',label:'舒适就好',tip:'温度未知，按体感穿衣即可'};if(t>=30)return{emoji:'🩱',label:'炎热·清凉为主',tip:'短袖吊带+透气衣物，注意防晒补水'};if(t>=26)return{emoji:'👕',label:'短袖舒适',tip:'短袖短裤正合适，备件薄衫防晒'};if(t>=22)return{emoji:'👚',label:'薄长袖/短袖',tip:'体感舒适，薄长袖或短袖都行'};if(t>=18)return{emoji:'🧥',label:'长袖+薄外套',tip:'早晚加件薄外套，午间可脱'};if(t>=12)return{emoji:'🧥',label:'外套/针织衫',tip:'外套或针织衫保暖，洋葱式穿搭'};if(t>=5)return{emoji:'🧣',label:'厚外套/毛衣',tip:'厚外套加毛衣，注意保暖'};return{emoji:'🧥',label:'羽绒服/保暖',tip:'严寒天气，羽绒服+围巾手套'}}
function weatherHTML(d){var s='<div class="weather-main"><span class="weather-emoji">'+d.wemoji+'</span><span class="weather-temp">'+d.t+'°</span></div>';s+='<div class="weather-deco"><div class="wd-big">'+d.wemoji+'</div><span class="wd-spark s1">✦</span><span class="wd-spark s2">✧</span><span class="wd-spark s3">🌿</span></div>';s+='<div class="weather-desc">'+d.wtext+(d.feels!=null?' ｜ 体感 '+d.feels+'°':'');s+='</div>';s+='<div class="weather-meta">💧 湿度 '+d.rh+'% ｜ 💨 风速 '+Math.round(d.wind)+' km/h'+(d.hi!=null?' ｜ 🌡 最高 '+d.hi+'°/最低 '+d.lo+'°':'');s+='</div>';var di=dressIndex(d.t);s+='<div class="weather-dress"><span class="wd-ico">'+di.emoji+'</span><span class="wd-label">穿衣指数</span><span class="wd-val">'+di.label+'</span><span class="wd-tip">'+di.tip+'</span></div>';if(d.hourly&&d.hourly.length){s+='<div class="home-hourly">';d.hourly.forEach(function(o){s+='<div class="hour-item"><div class="hour-label">'+o.label+'</div><div class="hour-emoji">'+o.e+'</div><div class="hour-t">'+o.t+'°</div></div>'});s+='</div>'}s+='<div class="weather-loc">📍 '+(d.locName||'东莞市寮步镇')+'</div>';return s}
function getGeo(){return new Promise(function(resolve){var def={lat:23.02,lon:113.87,name:'东莞市寮步镇'};try{var c=JSON.parse(localStorage.getItem('growth_v5_geo')||'{}');if(c.ds===TODAY&&c.lat){resolve(c);return}}catch(e){}if(!navigator.geolocation){resolve(def);return}navigator.geolocation.getCurrentPosition(function(pos){var lat=pos.coords.latitude,lon=pos.coords.longitude;reverseGeocode(lat,lon).then(function(name){var g={lat:lat,lon:lon,name:name,ds:TODAY};try{localStorage.setItem('growth_v5_geo',JSON.stringify(g))}catch(e){}resolve(g)}).catch(function(){var g={lat:lat,lon:lon,name:'我的位置',ds:TODAY};try{localStorage.setItem('growth_v5_geo',JSON.stringify(g))}catch(e){}resolve(g)})},function(){var g={lat:def.lat,lon:def.lon,name:def.name,ds:TODAY};try{localStorage.setItem('growth_v5_geo',JSON.stringify(g))}catch(e){}resolve(g)},{enableHighAccuracy:false,timeout:3000,maximumAge:600000})})}
function reverseGeocode(lat,lon){return new Promise(function(resolve,reject){fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+lat+'&longitude='+lon+'&localityLanguage=zh',{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){resolve(j.city||j.locality||j.principalSubdivision||'我的位置')}).catch(function(){reject()})})}
function fetchWeather(){
 var el=document.getElementById('homeWeather');if(!el)return;
 var t=new Date();var ds=t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate();
 el.innerHTML='<div class="home-weather-loading">🌤 正在获取今日天气…</div>';
 getGeo().then(function(geo){
  var key='growth_v5_weather_'+Math.round(geo.lat*100)+'_'+Math.round(geo.lon*100);
  try{var c=JSON.parse(localStorage.getItem(key)||'{}');if(c.ds===ds&&c.t&&c.hourly){el.innerHTML=weatherHTML(c);return}}catch(e){}
  fetch('https://api.open-meteo.com/v1/forecast?latitude='+geo.lat+'&longitude='+geo.lon+'&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&daily=apparent_temperature_max,apparent_temperature_min&hourly=temperature_2m,weather_code&timezone=Asia%2FShanghai',{cache:'no-store'})
  .then(function(r){return r.json()})
  .then(function(j){
    var c=j.current||{};var w=weatherDesc(c.weather_code);var daily=j.daily||{};var hArr=[];
    try{var hv=j.hourly||{};var times=hv.time||[],temps=hv.temperature_2m||[],codes=hv.weather_code||[];for(var i=0;i<times.length;i++){var hh=times[i].slice(11,16);hArr.push({label:hh,e:weatherDesc(codes[i]).emoji,t:Math.round(temps[i])})}}catch(e){}
    var data={ds:ds,locName:geo.name,t:Math.round(c.temperature_2m),feels:c.apparent_temperature!=null?Math.round(c.apparent_temperature):null,rh:c.relative_humidity_2m,wind:c.wind_speed_10m,wemoji:w.emoji,wtext:w.text,hi:(daily.apparent_temperature_max&&daily.apparent_temperature_max[0]!=null)?Math.round(daily.apparent_temperature_max[0]):null,lo:(daily.apparent_temperature_min&&daily.apparent_temperature_min[0]!=null)?Math.round(daily.apparent_temperature_min[0]):null,hourly:hArr};
    try{localStorage.setItem(key,JSON.stringify(data))}catch(e){}
    if(el)el.innerHTML=weatherHTML(data);
  })
  .catch(function(){if(el)el.innerHTML='<div class="home-weather-fallback">🌤 今日天气暂未获取<br><span style="font-size:11px;color:var(--text-f)">联网后自动更新 · '+geo.name+'</span></div>'});
 });
}
// === 破财实录（记账）===
var MONEY_EXPENSE_CATS=[
 {key:'🍜吃喝干饭',color:'#ef9a8d'},
 {key:'🚇交通出行',color:'#7fb8e6'},
 {key:'🛍️购物剁手',color:'#c79be0'},
 {key:'🎤娱乐消遣',color:'#f3c15b'},
 {key:'💊医疗健康',color:'#7ec8a8'},
 {key:'🎁人情往来',color:'#f29bb3'},
 {key:'📈投资理财',color:'#8fd3d0'},
 {key:'✨其它',color:'#b8c0cc'}
];
var MONEY_INCOME_CATS=['💰工资薪水','💹理财收益','🧧转账红包','📦其它'];
function ensureMoney(){if(!DATA.expenses)DATA.expenses=[];if(!DATA._mFilter)DATA._mFilter={type:'all',cat:'all',from:'',to:''}}
function moneyNowMonth(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)}
function fmtMoney(n){n=Number(n)||0;var s=(Math.round(n*100)/100).toFixed(2);return s.replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function moneyColor(r){if(r.type==='income')return 'var(--accent)';var rt=(r.category||'').replace(/^[^\u4e00-\u9fa5A-Za-z]+/,'');for(var i=0;i<MONEY_EXPENSE_CATS.length;i++){if(MONEY_EXPENSE_CATS[i].key===r.category||MONEY_EXPENSE_CATS[i].key.replace(/^[^\u4e00-\u9fa5A-Za-z]+/,'')===rt)return MONEY_EXPENSE_CATS[i].color}return '#b8c0cc'}
function moneyStats(){ensureMoney();var ym=moneyNowMonth();var inc=0,exp=0;DATA.expenses.forEach(function(r){if((r.date||'').slice(0,7)===ym){if(r.type==='income')inc+=r.amount;else exp+=r.amount}});return{income:inc,expense:exp,balance:inc-exp}}
function filteredMoney(){ensureMoney();var f=DATA._mFilter||{};var arr=DATA.expenses.slice();if(f.type==='expense')arr=arr.filter(function(r){return r.type==='expense'});else if(f.type==='income')arr=arr.filter(function(r){return r.type==='income'});if(f.cat&&f.cat!=='all')arr=arr.filter(function(r){return r.category===f.cat});if(f.from)arr=arr.filter(function(r){return (r.date||'')>=f.from});if(f.to)arr=arr.filter(function(r){return (r.date||'')<=f.to});arr.sort(function(a,b){if(a.date!==b.date)return a.date<b.date?1:-1;return (b.createdAt||0)-(a.createdAt||0)});return arr}
function moneyCatOptions(){var fm=DATA._mFilter||{};var opts='<option value="all">全部分类</option>';var cats;if(fm.type==='income')cats=MONEY_INCOME_CATS;else if(fm.type==='expense')cats=MONEY_EXPENSE_CATS.map(function(c){return c.key});else cats=MONEY_EXPENSE_CATS.map(function(c){return c.key}).concat(MONEY_INCOME_CATS);cats.forEach(function(c){opts+='<option value="'+escAttr(c)+'"'+(fm.cat===c?' selected':'')+'>'+escAttr(c)+'</option>'});return opts}
function renderMoneyChart(){ensureMoney();var ym=moneyNowMonth();var map={};var total=0;DATA.expenses.forEach(function(r){if(r.type==='expense'&&(r.date||'').slice(0,7)===ym){map[r.category]=(map[r.category]||0)+r.amount;total+=r.amount}});var html='<div class="money-chart-row"><div class="money-donut-box">';if(total<=0){html+='<div class="money-donut-empty">🍩<div style="font-size:11px;color:var(--text-f);margin-top:6px">本月暂无支出</div></div>'}else{var segs=[];var acc=0;MONEY_EXPENSE_CATS.forEach(function(c){if(map[c.key]){var start=acc/total*360;acc+=map[c.key];var end=acc/total*360;segs.push(c.color+' '+start.toFixed(1)+'deg '+end.toFixed(1)+'deg')}});html+='<div class="money-donut" style="background:conic-gradient('+segs.join(',')+')"><div class="money-donut-center"><div class="money-donut-center-val">¥'+fmtMoney(total)+'</div><div class="money-donut-center-lbl">本月支出</div></div></div>'}html+='</div><div class="money-legend">';if(total<=0){html+='<div class="money-legend-empty">记录支出后，这里会显示各类别占比 📊</div>'}else{MONEY_EXPENSE_CATS.forEach(function(c){if(map[c.key]){var pct=(map[c.key]/total*100).toFixed(1);html+='<div class="legend-item"><span class="legend-dot" style="background:'+c.color+'"></span><span class="legend-name">'+escAttr(c.key)+'</span><span class="legend-amt">¥'+fmtMoney(map[c.key])+'</span><span class="legend-pct">'+pct+'%</span></div>'}})}html+='</div></div>';return html}
function renderMoney(){ensureMoney();var box=document.getElementById('moneyWrap');if(!box)return;var st=moneyStats();var fm=DATA._mFilter||{};var html='';html+='<div class="money-stats"><div class="money-stat"><div class="money-stat-label">本月收入</div><div class="money-stat-val inc">+¥'+fmtMoney(st.income)+'</div></div><div class="money-stat"><div class="money-stat-label">本月支出</div><div class="money-stat-val exp">-¥'+fmtMoney(st.expense)+'</div></div><div class="money-stat"><div class="money-stat-label">本月结余</div><div class="money-stat-val '+(st.balance>=0?'bal-pos':'bal-neg')+'">¥'+fmtMoney(st.balance)+'</div></div></div>';html+=renderMoneyChart();html+='<div class="money-filter"><div class="money-type-toggle"><span class="mt-item'+(fm.type==='all'?' active':'')+'" onclick="switchMoneyType(\'all\')">全部</span><span class="mt-item'+(fm.type==='expense'?' active':'')+'" onclick="switchMoneyType(\'expense\')">支出</span><span class="mt-item'+(fm.type==='income'?' active':'')+'" onclick="switchMoneyType(\'income\')">收入</span></div><select class="money-sel" onchange="setMoneyCat(this.value)">'+moneyCatOptions()+'</select><input type="date" class="money-date" id="moneyFrom" value="'+(fm.from||'')+'" onchange="setMoneyFrom(this.value)"><span class="money-tilde">~</span><input type="date" class="money-date" id="moneyTo" value="'+(fm.to||'')+'" onchange="setMoneyTo(this.value)"><button class="c-btn outline" onclick="resetMoneyFilter()">重置</button></div>';var list=filteredMoney();if(!list.length){html+='<div class="money-empty">🪙 还没有记录，点上方「＋ 记一笔」开始吧～</div>'}else{html+='<div class="money-list">';list.forEach(function(r){var isInc=r.type==='income';html+='<div class="money-item"><div class="money-cat-dot" style="background:'+moneyColor(r)+'"></div><div class="money-main"><div class="money-cat">'+escAttr(r.category)+'</div>'+(r.note?'<div class="money-note">'+escAttr(r.note)+'</div>':'')+'</div><div class="money-right"><div class="money-date-s">'+escAttr(r.date)+'</div><div class="money-amt '+(isInc?'inc':'exp')+'">'+(isInc?'+':'-')+'¥'+fmtMoney(r.amount)+'</div></div><div class="money-ops"><span class="money-op" onclick="editMoneyRecord(\''+r.id+'\')">✎</span><span class="money-op del" onclick="deleteMoneyRecord(\''+r.id+'\')">✕</span></div></div>'});html+='</div>'}box.innerHTML=html;var badge=document.getElementById('moneyBadge');if(badge){badge.textContent='📒';badge.style.background='';badge.style.color=''}}
function switchMoneyType(t){ensureMoney();DATA._mFilter.type=t;DATA._mFilter.cat='all';save(DATA);renderMoney()}
function setMoneyCat(v){ensureMoney();DATA._mFilter.cat=v;save(DATA);renderMoney()}
function setMoneyFrom(v){ensureMoney();DATA._mFilter.from=v;save(DATA);renderMoney()}
function setMoneyTo(v){ensureMoney();DATA._mFilter.to=v;save(DATA);renderMoney()}
function resetMoneyFilter(){ensureMoney();DATA._mFilter={type:'all',cat:'all',from:'',to:''};save(DATA);renderMoney()}
function openMoneyModal(id){ensureMoney();var isEdit=!!id;var r=null;if(isEdit){r=DATA.expenses.find(function(x){return x.id===id});if(!r)return}var title=document.getElementById('moneyModalTitle');if(title)title.textContent=isEdit?'✎ 编辑记录':'＋ 记一笔';var type=r?r.type:'expense';setMoneyModalType(type,true);var amt=document.getElementById('moneyAmount');if(amt)amt.value=r?r.amount:'';var dt=document.getElementById('moneyDate');if(dt)dt.value=r?r.date:TODAY;var nt=document.getElementById('moneyNote');if(nt)nt.value=r?r.note:'';var eid=document.getElementById('moneyEditId');if(eid)eid.value=id||'';fillMoneyCatSelect(type,r?r.category:'');var m=document.getElementById('moneyModal');if(m)m.classList.add('show')}
function setMoneyModalType(t,silent){DATA._mModalType=t;var e=document.getElementById('mmTypeExpense'),i=document.getElementById('mmTypeIncome');if(e)e.classList.toggle('active',t==='expense');if(i)i.classList.toggle('active',t==='income');if(!silent)fillMoneyCatSelect(t,'')}
function fillMoneyCatSelect(type,sel){var sel2=document.getElementById('moneyCat');if(!sel2)return;var cats=type==='income'?MONEY_INCOME_CATS:MONEY_EXPENSE_CATS.map(function(c){return c.key});var html='';cats.forEach(function(c){html+='<option value="'+escAttr(c)+'"'+(c===sel?' selected':'')+'>'+escAttr(c)+'</option>'});sel2.innerHTML=html}
function closeMoneyModal(){var m=document.getElementById('moneyModal');if(m)m.classList.remove('show')}
function saveMoneyRecord(){ensureMoney();var id=document.getElementById('moneyEditId').value;var type=DATA._mModalType||'expense';var amount=parseFloat(document.getElementById('moneyAmount').value);var cat=document.getElementById('moneyCat').value;var date=document.getElementById('moneyDate').value||TODAY;var note=document.getElementById('moneyNote').value.trim();if(!amount||amount<=0){showToast('请输入有效金额','error');return}if(!cat){showToast('请选择类别','error');return}var rec={id:id||('mz'+Date.now()),type:type,amount:Math.round(amount*100)/100,category:cat,date:date,note:note,createdAt:Date.now()};if(id){var idx=DATA.expenses.findIndex(function(x){return x.id===id});if(idx>=0){rec.createdAt=DATA.expenses[idx].createdAt||Date.now();DATA.expenses[idx]=rec}else DATA.expenses.push(rec)}else DATA.expenses.push(rec);save(DATA);closeMoneyModal();renderMoney();showToast(id?'已更新记录':'已记下这一笔 💰','success')}
function deleteMoneyRecord(id){if(!confirm('确定删除这笔记录吗？'))return;ensureMoney();DATA.expenses=DATA.expenses.filter(function(x){return x.id!==id});save(DATA);renderMoney();showToast('已删除','success')}
function editMoneyRecord(id){openMoneyModal(id)}
// === 全局错误捕获（调试用，不影响功能）===
window.addEventListener('error',function(e){var el=document.getElementById('globalErr');if(!el){el=document.createElement('div');el.id='globalErr';el.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99999;background:#ffe0e0;color:#c00;padding:12px 16px;font-size:13px;font-family:monospace;word-break:break-all';document.body.appendChild(el)}el.innerHTML='⚠️ 页面错误：'+(e.message||'')+' <br>📍 '+(e.filename||'').replace(/^.*\//,'')+' :'+(e.lineno||'?')+' col:'+(e.colno||'?')+' <button onclick="this.parentElement.remove()" style="float:right;cursor:pointer">✕</button>'});

// === INIT ===
function init(){try{ensureEnglish();updateDate();renderCheckins();renderQuote();renderHome();['books','bookCats','_bookCat','_bookStatus','_bookKw'].forEach(function(k){if(k in DATA)delete DATA[k]});try{localStorage.removeItem('growth_v5_books_content')}catch(e){};if(!DATA._activePanel||DATA._activePanel==='books'||!document.getElementById('panel-'+DATA._activePanel)){DATA._activePanel='home';save(DATA)}var panel=DATA._activePanel;switchPanel(panel);var tab=DATA._learnTab||'editing';switchLearnTab(tab);renderNews();renderInspire();renderHot();renderRecipe();renderReading();renderMoney()}catch(e){console.error('init partial fail:',e)}}
document.addEventListener('DOMContentLoaded',init);



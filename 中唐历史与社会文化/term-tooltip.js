/**
 * 知识库词条浮窗系统
 * 为故事内页中涉及知识库的概念提供 hover 浮窗简介和跳转功能
 */

// 知识库词条映射表：关键词 → {id: 百科词条ID, summary: 简介}
const TERM_MAP = {
  // === 张老三相关 ===
  '《柳毅传》': { id: 'LIF-09', summary: '唐传奇名篇，李朝威作。书生柳毅为洞庭龙女传书，最终与龙女结为夫妻。是中唐传奇中"人神恋"的代表作。' },
  '柳毅传': { id: 'LIF-09', summary: '唐传奇名篇，李朝威作。书生柳毅为洞庭龙女传书，最终与龙女结为夫妻。是中唐传奇中"人神恋"的代表作。' },
  '柳毅': { id: 'LIF-09', summary: '唐传奇名篇，李朝威作。书生柳毅为洞庭龙女传书，最终与龙女结为夫妻。' },
  '佃户': { id: 'CLS-05', summary: '无田产的农民，租种地主土地，缴纳地租。两税法后，佃户数量激增，处于社会底层。' },
  '户等': { id: 'ECO-06', summary: '两税法按资产划分户等（上上至下下共九等），据此确定税额。但实际执行中，富户贿赂乡吏压低户等，穷人反而被高估。' },
  '下中户': { id: 'ECO-06', summary: '九等户制中的第八等，属于贫困阶层。两税法按户等征税，下中户税负相对较轻但仍是沉重负担。' },
  '下下户': { id: 'ECO-06', summary: '九等户制中最低等级，税负最轻。富户常贿赂乡吏将自己划为下等户以逃税。' },
  '秋税': { id: 'ECO-06', summary: '两税法规定每年夏（六月）、秋（十一月）两次征收，秋税以粮食为主，是农民最主要的税负。' },
  '三丁抽一': { id: 'SYS-06', summary: '藩镇征兵制度，每三个成年男丁中抽调一人服兵役。河朔藩镇常以此方式扩充军力。' },
  '魏博节度使': { id: 'SYS-06', summary: '河朔三镇之一，安史之乱后形成的割据藩镇。节度使集军权、行政权、财权于一身，父死子继已成惯例。' },
  '馎饦': { id: 'LIF-04', summary: '唐代常见面食，类似面疙瘩汤。将面团揪成小块投入沸水煮熟，是平民百姓的日常主食。' },
  '胡饼': { id: 'LIF-04', summary: '源自西域的烤饼，麦面制成，常撒芝麻。唐代极为流行，从宫廷到市井皆食，是重要的干粮。' },
  '里正': { id: 'SYS-04', summary: '唐代基层行政官员，管理一里（约百户）事务，负责户籍登记、征税催役等。' },

  // === 王二麻相关 ===
  '坊门': { id: 'LIF-01', summary: '唐代城市实行坊市制，居民区（坊）四周有围墙，设坊门定时启闭。晨鼓开门，暮鼓关门，即"宵禁"制度。' },
  '西市': { id: 'LIF-01', summary: '长安城两大市场之一（东市、西市），西市尤以国际贸易著称，胡商云集，经营珠宝、香料、丝绸等。' },
  '帛肆': { id: 'LIF-01', summary: '西市中专营丝帛布匹的商铺区域，是唐代纺织品交易的重要场所。' },
  '衣肆': { id: 'LIF-01', summary: '西市中专营成衣的商铺区域，胡商常在此售卖粟特锦等异域织物。' },
  '粟特锦': { id: 'LIF-01', summary: '粟特人（中亚商业民族）织造的锦缎，以联珠纹、对兽纹为特色，是唐代丝绸之路贸易的代表商品。' },
  '上巳节': { id: 'LIF-03', summary: '三月三日，唐代重要节日。长安人倾城出游曲江池畔，踏青饮宴，是春日最盛大的公共节庆。' },
  '曲江': { id: 'LIF-03', summary: '长安城东南的风景区，唐代最著名的公共游乐场所。上巳节、科举放榜后的"曲江宴"均在此举行。' },
  '市署': { id: 'LIF-01', summary: '唐代管理市场的官署，负责物价管控（市估）、商铺管理、度量衡监督等。设市令、市丞等官员。' },
  '市鼓三百声': { id: 'LIF-01', summary: '西市开市的信号——击鼓三百声后正式开始交易，是唐代市场管理制度的一部分。' },
  '越窑青瓷': { id: 'LIF-01', summary: '产于越州（今浙江绍兴），以"秘色瓷"最为名贵。釉色青翠如玉，陆羽《茶经》评为瓷器之首。' },
  '邢窑白瓷': { id: 'LIF-01', summary: '产于邢州（今河北邢台），以白如雪、薄如纸著称。与越窑青瓷并称"南青北白"，是唐代瓷器双璧。' },
  '市估': { id: 'LIF-01', summary: '市署每月公布的官方物价基准，商品交易须参照市估定价。实际交易往往上浮，但不得低于市估。' },
  '牙郎': { id: 'LIF-01', summary: '唐代市场中的中间商/经纪人，专门撮合买卖双方、验货估价、担保交易，收取佣金。' },
  '开元通宝': { id: 'ECO-01', summary: '唐代标准铜钱，重约4克，1贯=1000文。中唐后铜钱短缺，"钱重物轻"问题严重。' },
  '绢帛': { id: 'ECO-01', summary: '唐代重要的货币替代品，一匹绢可折算约800文。两税法后"以钱代物"，但实际交易中绢帛仍广泛使用。' },
  '波斯银币': { id: 'ECO-01', summary: '萨珊波斯银币（迪尔汗），通过丝绸之路流入唐朝，在国际贸易中广泛使用，需"割币"验成色。' },
  '汤饼': { id: 'LIF-04', summary: '唐代面食的统称，包括面条、面片等。热汤煮面，是市井人家的日常饮食。' },
  '一日中的第二餐': { id: 'LIF-04', summary: '唐代普通人家一日两餐（朝食、晡食），午时前后为第二餐。只有富贵人家才一日三餐。' },
  '盐价': { id: 'ECO-02', summary: '唐代盐铁专卖制度下，盐价由官府控制。中唐后盐价飞涨，从每斗十文涨至数百文，百姓苦不堪言。' },
  '宫市': { id: 'EVT-17', summary: '德宗朝弊政之一。宦官以"宫市"名义在市场强行低价购物，价常不及十分之一，商贩不敢拒绝。白居易《卖炭翁》即讽此事。' },
  '白望': { id: 'EVT-17', summary: '宫市中宦官派出的采购人员，凭身份强购市物，"白望"即"白看白拿"之意。商贩见之色变。' },
  '《唐律疏议》': { id: 'SYS-04', summary: '唐代最重要的法典及其官方注释，是中国现存最早最完整的封建法典，对后世法律影响深远。' },
  '宵禁鼓': { id: 'LIF-01', summary: '唐代宵禁制度的执行信号。暮鼓响后坊门关闭，行人不得在街上行走，违者杖二十。' },
  '市令': { id: 'LIF-01', summary: '市署长官，负责管理市场秩序、监督交易、征收商税。品级不高但实权很大。' },
  '粟特胡商': { id: 'LIF-01', summary: '粟特人是中亚著名的商业民族，垄断丝绸之路贸易数百年。唐代长安西市中胡商众多，经营珠宝、香料等。' },
  '醋芹': { id: 'LIF-04', summary: '唐代常见调味菜，以醋腌制的芹菜。杜甫诗"鲜鲫银丝脍，香芹碧涧羹"即指此物。' },
  '韭花': { id: 'LIF-04', summary: '韭菜花制成的调味酱，唐代饮食中常用的佐料，搭配面食尤佳。' },

  // === 李四郎相关 ===
  '《五经正义》': { id: 'SYS-02', summary: '唐代官方钦定的五经注疏，科举明经科的标准教材。孔颖达等奉敕编撰，统一经学解释。' },
  '元微之': { id: 'PER-25', summary: '即元稹，字微之。中唐著名诗人、小说家，与白居易并称"元白"。著有《莺莺传》等传奇名篇。' },
  '《莺莺传》': { id: 'LIF-09', summary: '元稹所作唐传奇，写张生与崔莺莺的爱情悲剧。后世王实甫据此改编为《西厢记》。是唐传奇中爱情题材的巅峰之作。' },
  '崔莺莺': { id: 'LIF-09', summary: '《莺莺传》女主角，出身名门却敢于追求爱情，最终被张生抛弃。"待月西厢下"成为千古名句。' },
  '张生': { id: 'LIF-09', summary: '《莺莺传》男主角，一般认为是元稹自况。"始乱终弃"的典型形象。' },
  '元稹': { id: 'PER-25', summary: '字微之，中唐著名诗人。与白居易并称"元白"，倡导新乐府运动。著有《莺莺传》《连昌宫词》等。' },
  '座主': { id: 'SYS-02', summary: '科举考试中的主考官。唐代考生中举后称主考官为"座主"，形成终身的师生关系（门生-座主），是重要的政治纽带。' },
  '科举': { id: 'SYS-02', summary: '唐代选拔官员的核心制度。明经科考经典记忆，进士科考诗赋策论。中唐后进士科地位远超明经，"三十老明经，五十少进士"。' },
  '考卷不糊名': { id: 'SYS-02', summary: '唐代科举不实行糊名制（宋代才开始），考官能看到考生姓名籍贯，因此家世、人脉往往比才学更重要。' },
  '《诗经》': { id: 'SYS-02', summary: '五经之一，科举明经科必考内容。士子常以手抄经典作为拜见座主的礼物。' },
  '颜真卿': { id: 'PER-08', summary: '唐代著名书法家、忠臣。安史之乱中率先起兵抗敌，后被叛将李希烈杀害。其书法"颜体"刚正雄浑，真迹极为珍贵。' },
  '藩镇': { id: 'SYS-06', summary: '安史之乱后遍布全国的地方军政机构。节度使集军权、行政权、财权于一身，河朔三镇尤为跋扈，形成割据。' },
  '杜牧': { id: 'PER-30', summary: '晚唐著名诗人，与李商隐并称"小李杜"。诗风俊爽，善咏史怀古。《泊秦淮》《阿房宫赋》等为代表作。' },
  '清河崔氏、太原王氏、荥阳郑氏': { id: 'CLS-01', summary: '唐代"五姓七望"中的三大士族门阀。即使科举兴起，这些家族仍凭借世代积累的人脉和声望占据政治优势。' },
  '《泊秦淮》': { id: 'PER-30', summary: '杜牧名诗："烟笼寒水月笼沙，夜泊秦淮近酒家。商女不知亡国恨，隔江犹唱后庭花。"讽刺当权者醉生梦死。' },
  '牛党': { id: 'EVT-22', summary: '牛李党争中以牛僧孺为首的一派，多为科举出身的寒门士子。与李德裕为首的"李党"（门荫贵族）对立数十年。' },
  '吏部': { id: 'SYS-02', summary: '唐代六部之一，掌管官员铨选、考核。科举及第后还需通过吏部"关试"才能正式授官。' },
  '明经': { id: 'SYS-02', summary: '科举考试科目之一，主考儒家经典的记诵。难度低于进士科，地位也远不如进士，"三十老明经"。' },
  '进士': { id: 'SYS-02', summary: '科举考试最重要的科目，考诗赋策论。中唐后进士出身成为入相的黄金门票，"五十少进士"形容其难度。' },
  '国子监': { id: 'SYS-02', summary: '唐代最高学府和教育管理机构，设国子学、太学等。祭酒为最高长官，相当于今天的大学校长。' },
  '祭酒': { id: 'SYS-02', summary: '国子监最高长官，从三品。负责管理全国最高学府，主持经学教育和学术讨论。' },
  '两税法': { id: 'ECO-06', summary: '建中元年（780年）杨炎推行，废除租庸调制，改为按资产征税，每年夏秋两征。是中国税制史上里程碑式变革。' },
  '佃农': { id: 'CLS-05', summary: '无田产的农民，租种地主土地。两税法后土地兼并加剧，大量自耕农沦为佃农，处于社会最底层。' },
  '《霍小玉传》': { id: 'LIF-09', summary: '蒋防所作唐传奇，写歌妓霍小玉与书生李益的爱情悲剧。小玉死后化为厉鬼报复，是唐传奇中最决绝的女性形象。' }
};

// 创建浮窗元素
function createTooltip() {
  const tooltip = document.createElement('div');
  tooltip.id = 'term-tooltip';
  tooltip.innerHTML = `
    <div class="tooltip-title"></div>
    <div class="tooltip-summary"></div>
  `;
  document.body.appendChild(tooltip);
  return tooltip;
}

// 初始化浮窗系统
function initTermTooltips() {
  const tooltip = createTooltip();
  let hideTimeout = null;

  // 为所有带 data-entry 属性的元素绑定事件
  document.querySelectorAll('[data-entry]').forEach(el => {
    el.addEventListener('mouseenter', function(e) {
      clearTimeout(hideTimeout);
      const entryId = this.getAttribute('data-entry');
      const summary = this.getAttribute('data-summary') || '';
      const termName = this.textContent;

      tooltip.querySelector('.tooltip-title').textContent = termName;
      tooltip.querySelector('.tooltip-summary').textContent = summary;
      
      // 定位浮窗
      const rect = this.getBoundingClientRect();
      const tooltipWidth = 320;
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      if (left < 10) left = 10;
      if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = (rect.bottom + 8) + 'px';
      tooltip.classList.add('visible');
    });

    el.addEventListener('mouseleave', function() {
      hideTimeout = setTimeout(() => {
        tooltip.classList.remove('visible');
      }, 200);
    });
  });

  // 浮窗本身的鼠标事件
  tooltip.addEventListener('mouseenter', function() {
    clearTimeout(hideTimeout);
  });
  tooltip.addEventListener('mouseleave', function() {
    hideTimeout = setTimeout(() => {
      tooltip.classList.remove('visible');
    }, 200);
  });
}

// 自动为 .bold 元素匹配知识库词条并添加 data-entry 属性
function autoLinkTerms() {
  document.querySelectorAll('.bold').forEach(el => {
    const text = el.textContent.trim();
    // 尝试精确匹配
    if (TERM_MAP[text]) {
      el.setAttribute('data-entry', TERM_MAP[text].id);
      el.setAttribute('data-summary', TERM_MAP[text].summary);
      el.classList.add('term-link');
    } else {
      // 尝试部分匹配（去掉书名号等）
      const cleanText = text.replace(/[《》""''「」]/g, '');
      for (const [key, val] of Object.entries(TERM_MAP)) {
        const cleanKey = key.replace(/[《》""''「」]/g, '');
        if (cleanText === cleanKey || cleanText.includes(cleanKey) || cleanKey.includes(cleanText)) {
          el.setAttribute('data-entry', val.id);
          el.setAttribute('data-summary', val.summary);
          el.classList.add('term-link');
          break;
        }
      }
    }
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  autoLinkTerms();
  initTermTooltips();
});

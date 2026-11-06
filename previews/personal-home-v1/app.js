'use strict';
const $ = selector => document.querySelector(selector);
const dialog = $('#detail');
const content = $('#detail-content');
let opener;

$('.theme').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  $('.theme').setAttribute('aria-label', dark ? '切换到日间' : '切换到夜间');
  $('.theme').title = dark ? '切换到日间' : '切换到夜间';
});
$('.motion').addEventListener('click', event => {
  const playing = $('.desk').classList.toggle('playing');
  const button = event.currentTarget;
  button.textContent = playing ? 'Ⅱ' : '▶';
  button.setAttribute('aria-pressed', String(playing));
  button.setAttribute('aria-label', playing ? '暂停唱片动效' : '播放唱片动效');
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    document.querySelectorAll('.work').forEach(work => {
      work.hidden = button.dataset.filter !== 'all' && work.dataset.category !== button.dataset.filter;
      if (!work.hidden) count++;
    });
    $('#result-count').textContent = `${count} 件作品`;
  });
});

const projects = {
  pages: {
    title: '拾页', subtitle: '把这次的进度，留给下次的自己。', category: '整理与记录 / 公开模板',
    reason: '每次重新打开一个搁了一阵的想法，都要先想半天：之前做到哪了？所以做了一个小小的上下文文件夹，里面只放当前目标、已经做过的事和下一步。',
    demo: '<label for="next-step">试着写一句「下次继续」</label><textarea id="next-step" maxlength="160">把散落的阅读笔记放到一个入口里</textarea><button class="demo-button" id="save-note">放进接续卡片</button><div class="demo-output" id="saved-note" role="status" hidden></div>',
    ending: '想法可以暂停，重新开始不必靠回忆。文件用普通文字保存，换一个工具也能读。'
  },
  frame: {
    title: '留帧', subtitle: '喜欢的画面，不只是一闪而过。', category: '音乐与画面 / 本地工具',
    reason: '一段影像里，总有想多看几眼的瞬间。我想把它留在每天打开电脑、拿起手机的时候，于是做了一个可以调整取景的小工作台。',
    demo: '<div class="crop-demo"><div class="crop-outline"></div></div><div class="crop-options" role="group" aria-label="取景尺寸"><button class="demo-button" data-crop="wide" aria-pressed="true">横向取景</button><button class="demo-button" data-crop="portrait" aria-pressed="false">竖向取景</button></div>',
    ending: '这里的山与月亮是专为效果稿画的几何图形。正式作品介绍可以讲取景过程，素材只使用明确可公开的内容。'
  },
  box: {
    title: '归盒', subtitle: '把整理变成一个可看清的小动作。', category: '日常小工具 / 桌面应用',
    reason: '下载目录里什么都有，真正困扰我的却是：整理之后还找不找得到？所以先把每个文件要去哪里摆出来，再让人决定。',
    demo: '<div class="sort-demo"><div class="sort-row">周末的云.png <span data-destination="图片">待整理</span></div><div class="sort-row">阅读清单.pdf <span data-destination="文档">待整理</span></div><div class="sort-row">灵感.txt <span data-destination="笔记">待整理</span></div></div><button class="demo-button" id="sort-demo">预览分类</button><p id="sort-feedback" class="demo-caption" role="status">只有三条虚构文件名，不访问本机文件。</p>',
    ending: '这个演示只切换界面状态。真正的工具需要让每一步有依据，也留好撤销的路。'
  },
  edit: {
    title: '轻改', subtitle: '只改一点，别把别的也改了。', category: '日常小工具 / 文档工作流',
    reason: '有时只想改文档里的一个标题，却担心排版跟着变了。这个小工作流从找到目标开始，在副本上改，然后比较前后。',
    demo: '<div class="demo-output" id="edit-example">周末计划\n\n去河边散步。\n带上一本还没读完的书。</div><button class="demo-button" id="edit-demo">把标题改为「周末小记」</button><p id="edit-feedback" class="demo-caption" role="status">演示目标：只替换第一行标题。</p>',
    ending: '它的价值在于把目标和边界说清楚，再把改动交还给使用者检查。'
  }
};
function openDetail(kind, html, trigger) {
  opener = trigger;
  $('#detail-kind').textContent = kind;
  content.innerHTML = html;
  dialog.showModal();
  dialog.scrollTop = 0;
  $('.close').focus();
}
function closeDetail() { dialog.close(); }
$('.close').addEventListener('click', closeDetail);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDetail();
});
dialog.addEventListener('close', () => { content.innerHTML = ''; opener?.focus({preventScroll:true}); });

document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  openDetail('作品手记 · 虚构演示', `<div class="detail-body"><p class="eyebrow">${project.category}</p><h2 id="detail-title">${project.title}</h2><p class="lede">${project.subtitle}</p><h3>为什么会做它</h3><p>${project.reason}</p><h3>动手试一小段</h3><div class="demo-area">${project.demo}<p class="demo-caption">纯界面演示 · 不保存数据、不连接实际服务</p></div><h3>想保留下来的体验</h3><p>${project.ending}</p></div>`, button);
  $('#save-note')?.addEventListener('click', () => {
    const value = $('#next-step').value.trim();
    const output = $('#saved-note'); output.hidden = false;
    output.textContent = value ? `下次，从这里继续：\n${value}\n\n已放入这张演示卡片，关闭后清空。` : '还没有写下一步。写一句就好。';
  });
  document.querySelectorAll('[data-crop]').forEach(control => control.addEventListener('click', () => {
    $('.crop-demo').classList.toggle('portrait', control.dataset.crop === 'portrait');
    document.querySelectorAll('[data-crop]').forEach(other => other.setAttribute('aria-pressed', String(other === control)));
  }));
  $('#sort-demo')?.addEventListener('click', event => {
    const sorted = event.currentTarget.dataset.sorted !== 'true';
    event.currentTarget.dataset.sorted = String(sorted);
    document.querySelectorAll('[data-destination]').forEach(item => { item.textContent = sorted ? `→ ${item.dataset.destination}` : '待整理'; });
    event.currentTarget.textContent = sorted ? '重置演示' : '预览分类';
    $('#sort-feedback').textContent = sorted ? '三条示例已显示建议去向，实际文件没有移动。' : '只有三条虚构文件名，不访问本机文件。';
  });
  $('#edit-demo')?.addEventListener('click', event => {
    const edited = event.currentTarget.dataset.edited !== 'true';
    event.currentTarget.dataset.edited = String(edited);
    $('#edit-example').textContent = `${edited ? '周末小记' : '周末计划'}\n\n去河边散步。\n带上一本还没读完的书。`;
    event.currentTarget.textContent = edited ? '还原标题' : '把标题改为「周末小记」';
    $('#edit-feedback').textContent = edited ? '已替换第一行，下面两句保持原样。' : '演示已还原。';
  });
}));
const notes = [
  {title:'一个文件夹，为什么越整理越乱？',category:'关于整理',paragraphs:['我以前会给文件夹取很认真、很完整的名字。过了几个月，却还是忘了某份东西放在哪里。','后来发现，问题不是分类不够细，而是打开它的时候，不知道该从哪一页开始。现在我会给一个想法留一张入口卡，只写三件事：想做什么，做到哪里，下次继续什么。','先让自己能回来，再慢慢整理里面的房间。']},
  {title:'给小工具留一个「撤销」按钮',category:'做东西的过程',paragraphs:['做小工具时，总想把操作减到一步。但一步完成，也可能意味着来不及看清发生了什么。','我更喜欢先看见变化，再决定是否继续。尤其是整理文件的时候：看得懂去向，比一眨眼收拾完更让人愿意再用一次。','撤销不是失败之后的补丁，也是开始之前的一点安心。']},
  {title:'有些画面，适合慢一点看',category:'音乐与日常',paragraphs:['有时候，记住一段影像的原因不是故事，而是一个光落下来的瞬间。','把画面裁成壁纸时，会发现横屏和竖屏像在讲两件事。原来位于边缘的树，忽然成了中心；原本宽阔的天空，变成了一小段颜色。','喜欢这种没有标准答案的小选择。只是为自己，留住一个愿意再看一眼的瞬间。']}
];
document.querySelectorAll('[data-note]').forEach(button => button.addEventListener('click', () => {
  const note = notes[Number(button.dataset.note)];
  openDetail('随记 · 虚构演示', `<article class="detail-body article-content"><p class="eyebrow">${note.category} / 3 MIN READ</p><h2 id="detail-title">${note.title}</h2>${note.paragraphs.map(p=>`<p>${p}</p>`).join('')}<p class="demo-caption">本篇是为效果稿创作的示例文章，不是站主的真实经历。</p></article>`, button);
}));
$('[data-about]').addEventListener('click', event => openDetail('关于 · 虚构演示', '<div class="detail-body"><p class="eyebrow">HELLO, AGAIN.</p><h2 id="detail-title">我是林舟。</h2><p class="lede">写代码、听音乐，也给生活做一点小东西。</p><p>喜欢那些小而具体的问题：怎么让文件不再乱放，怎么留住喜欢的画面，怎么在隔了一阵后继续一个想法。这个小站把它们放在一起。</p><div class="about-pills"><span>本地工具</span><span>音乐</span><span>记录</span><span>慢慢做</span></div><p>这里不追求每个想法都有结果。有些会长成作品，有些停在纸上，也都可以。</p><p class="demo-caption">人物、介绍和兴趣组合均为虚构示意。正式介绍需由站主确认。</p></div>', event.currentTarget));

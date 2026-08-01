
  var CH = {
    v2: { api: './api/latest-idf.json', mf: function (v) { return '/firmware/zn-1-v2/v' + v + '/manifest.json'; }, name: '原生固件', data: null },
    v1: { api: './api/latest',          mf: function (v) { return '/firmware/zn-1/v' + v + '/manifest.json'; },    name: '经典固件', data: null }
  };
  var cur = 'v2';

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日发布';
  }

  function render(ch) {
    var d = CH[ch].data;
    if (!d) return;
    document.getElementById(ch + '-ver').textContent = 'v' + d.version;
    document.getElementById(ch + '-date').textContent = fmtDate(d.publish_date);
  }

  function renderLog() {
    var d = CH[cur].data;
    var ul = document.getElementById('log-list');
    document.getElementById('log-title').textContent =
      '版本更新内容 · ' + CH[cur].name + (d ? ' v' + d.version : '');
    ul.innerHTML = '';
    var notes = (d && d.release_notes) || [];
    if (!notes.length) { ul.innerHTML = '<li>暂无更新说明</li>'; return; }
    for (var i = 0; i < notes.length; i++) {
      var li = document.createElement('li');
      li.textContent = notes[i];
      ul.appendChild(li);
    }
  }

  function pick(ch) {
    cur = ch;
    document.getElementById('ch-v2').className = 'channel' + (ch === 'v2' ? ' active' : '');
    document.getElementById('ch-v1').className = 'channel' + (ch === 'v1' ? ' active' : '');
    var d = CH[ch].data;
    if (d) document.getElementById('btn').setAttribute('manifest', CH[ch].mf(d.version));
    renderLog();
  }

  ['v2', 'v1'].forEach(function (ch) {
    fetch(CH[ch].api, { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.success) return;
        CH[ch].data = j;
        render(ch);
        if (ch === cur) pick(cur);
      })
      .catch(function (e) { console.warn(ch, 'load failed', e); });
  });

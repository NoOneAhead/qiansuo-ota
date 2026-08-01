
  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日发布';
  }
  fetch('./api/latest-idf.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (!j.success) return;
      document.getElementById('v2-ver').textContent = 'v' + j.version;
      document.getElementById('v2-date').textContent = fmtDate(j.publish_date);
      document.getElementById('log-title').textContent = '版本更新内容 · v' + j.version;
      document.getElementById('btn').setAttribute('manifest', '/firmware/zn-1-v2/v' + j.version + '/manifest.json');
      var ul = document.getElementById('log-list');
      ul.innerHTML = '';
      (j.release_notes || []).forEach(function (n) {
        var li = document.createElement('li');
        li.textContent = n;
        ul.appendChild(li);
      });
    })
    .catch(function (e) { console.warn('load failed', e); });

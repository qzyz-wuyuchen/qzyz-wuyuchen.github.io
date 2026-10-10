/* 黑幕的移动端交互：长按显示、松手/滑动隐藏。
   PC 端的悬停与键盘聚焦由 heimu.css 处理，无需 JS。 */
(function () {
  'use strict';

  var HOLD_MS = 450; // 长按多久显示
  var timer = null;
  var activeEl = null;

  function getHeimu(e) {
    var t = e.target;
    return t && t.closest ? t.closest('.heimu') : null;
  }

  function hide() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (activeEl) {
      activeEl.classList.remove('is-revealed');
      activeEl = null;
    }
  }

  document.addEventListener('touchstart', function (e) {
    var el = getHeimu(e);
    if (!el) return;
    if (e.touches.length > 1) return; // 多指手势（缩放等）不触发

    activeEl = el;
    timer = setTimeout(function () {
      el.classList.add('is-revealed');
    }, HOLD_MS);
  }, { passive: true });

  document.addEventListener('touchend', hide, { passive: true });
  document.addEventListener('touchcancel', hide, { passive: true });
  document.addEventListener('touchmove', hide, { passive: true });

  // 阻止长按弹出系统菜单
  document.addEventListener('contextmenu', function (e) {
    if (getHeimu(e)) e.preventDefault();
  });

  // 键盘操作时也能收起
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') hide();
  });
})();

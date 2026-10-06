(function(){
  var s = 128;
  var c = document.createElement('canvas');
  c.width = s; c.height = s;
  var ctx = c.getContext('2d');
  if(!ctx) return;
  var img = ctx.createImageData(s, s);
  for(var i = 0; i < img.data.length; i += 4){
    var v = Math.random() * 255;
    img.data[i] = v; img.data[i+1] = v; img.data[i+2] = v; img.data[i+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  var grain = document.querySelector('.grain');
  if(grain) grain.style.backgroundImage = 'url(' + c.toDataURL() + ')';
})();

var navToggle = document.getElementById('navToggle');
if(navToggle){
  navToggle.addEventListener('click', function(){
    var open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.nav-links a').forEach(function(link){
    link.addEventListener('click', function(){ document.body.classList.remove('nav-open'); });
  });
}

var form = document.getElementById('signupForm');
if(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var email = document.getElementById('signupEmail');
    if(!email.checkValidity()){ email.focus(); return; }
    form.classList.add('sent');
    var confirm = document.getElementById('signupConfirm');
    if(confirm) confirm.classList.add('show');
  });
}

var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ticker: each page sets window.TICKER_ITEMS before loading this script;
   falls back to a default set if a page doesn't define one */
(function(){
  var track = document.getElementById('tickerTrack');
  if(!track) return;
  var items = window.TICKER_ITEMS || [
    'Nisarg\u2019s Newsletter · issue 01 in draft',
    'The B2B IRL Room · opening soon',
    'B2B IRL: Mumbai · 28 November · first event is live',
    'Homecoming · Toronto, 28 October',
    'B2B IRL: Toronto · next meetup TBA',
    'The Almanack · first print run coming'
  ];
  var html = '';
  for(var pass = 0; pass < 2; pass++){
    items.forEach(function(t){
      html += '<span class="ticker-item">' + t + '<span class="dim">/</span></span>';
    });
  }
  track.innerHTML = html;
})();

(function(){
  var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('in-view'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  els.forEach(function(el){ io.observe(el); });
  setTimeout(function(){
    els.forEach(function(el){ el.classList.add('in-view'); });
  }, 4000);
})();

(function(){
  var header = document.querySelector('header');
  var watermark = document.querySelector('.watermark');
  var ticking = false;
  function update(){
    var y = window.scrollY || window.pageYOffset;
    if(header) header.classList.toggle('scrolled', y > 24);
    if(watermark && !reduceMotion) watermark.style.transform = 'translateY(' + Math.min(y * 0.06, 60) + 'px)';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

(function(){
  var ticket = document.querySelector('.ticket');
  var wrap = document.querySelector('.ticket-wrap');
  if(!ticket || !wrap || reduceMotion) return;
  ticket.addEventListener('animationend', function(e){
    if(e.animationName !== 'stamp-press') return;
    ticket.style.animation = 'none';
    wrap.addEventListener('mousemove', function(ev){
      var r = wrap.getBoundingClientRect();
      var px = (ev.clientX - r.left) / r.width - 0.5;
      var py = (ev.clientY - r.top) / r.height - 0.5;
      ticket.style.setProperty('--tilt-y', (px * 10).toFixed(2) + 'deg');
      ticket.style.setProperty('--tilt-x', (py * -10).toFixed(2) + 'deg');
    });
    wrap.addEventListener('mouseleave', function(){
      ticket.style.setProperty('--tilt-x', '0deg');
      ticket.style.setProperty('--tilt-y', '0deg');
    });
  });
})();

/* countdown to B2B IRL: Mumbai, 28 Nov 2026 (IST) */
(function(){
  var el = document.getElementById('countdown');
  if(!el) return;
  var target = new Date('2026-11-28T00:00:00+05:30').getTime();
  var cells = {};
  ['d','h','m','s'].forEach(function(u){ cells[u] = el.querySelector('[data-unit="' + u + '"]'); });
  function pad(n){ return n < 10 ? '0' + n : '' + n; }
  function tick(){
    var left = Math.max(0, target - Date.now());
    var s = Math.floor(left / 1000);
    cells.d.textContent = Math.floor(s / 86400);
    cells.h.textContent = pad(Math.floor(s % 86400 / 3600));
    cells.m.textContent = pad(Math.floor(s % 3600 / 60));
    cells.s.textContent = pad(s % 60);
    if(left === 0) clearInterval(timer);
  }
  var timer = setInterval(tick, 1000);
  tick();
})();

/* Mumbai application: no backend yet, so it opens a pre-filled email */
(function(){
  var form = document.getElementById('applyForm');
  if(!form) return;
  var note = document.getElementById('applyNote');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var bad = null;
    Array.prototype.forEach.call(form.querySelectorAll('input, textarea'), function(f){
      var ok = f.checkValidity();
      f.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if(!ok && !bad) bad = f;
    });
    if(bad){
      note.className = 'form-note err';
      note.textContent = 'A few fields need a look before you send.';
      bad.focus();
      return;
    }
    var v = function(n){ return form.elements[n].value.trim(); };
    var tracks = Array.prototype.filter.call(form.querySelectorAll('input[name="track"]'), function(c){ return c.checked; })
      .map(function(c){ return c.value; }).join(', ') || 'No preference';
    var body = [
      'Name: ' + v('name'),
      'Email: ' + v('email'),
      'Company: ' + v('company'),
      'Role: ' + v('role'),
      'LinkedIn: ' + (v('linkedin') || 'n/a'),
      'Tracks: ' + tracks,
      '',
      'What I would bring to the room:',
      v('bring')
    ].join('\n');
    var subject = 'Application: B2B IRL Mumbai, 28 Nov (' + v('name') + ')';
    window.location.href = 'mailto:hello@b2birl.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.className = 'form-note ok';
    note.textContent = 'Your email app should open with everything filled in. Hit send to apply. Nothing opened? Email hello@b2birl.com.';
  });
})();

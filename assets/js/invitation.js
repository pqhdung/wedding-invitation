/* =====================
   Init
===================== */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ 
    once: true,
    duration: 1200,   // ⏱️ thời gian chạy (ms)
    easing: 'ease-in-out',
    offset: 120       
  });
});

document.getElementById('enterInvite')?.addEventListener('click', () => {
  const overlay = document.getElementById('welcomeOverlay');

  overlay.classList.remove('show');

  // autoplay hợp lệ mobile
  music.play().then(() => {
    isPlaying = true;
    musicBtn.classList.add('playing');
    musicBtn.classList.remove('paused');
  });

  // refresh animation
  setTimeout(() => {
    AOS.refreshHard();
  }, 500);
});

const API_URL =
  'https://script.google.com/macros/s/AKfycbyYuzf684k7xc1eTrtmKjqivEhgf96WHQY3AsbahC_kiQXilVJkPthr3_1cxYhmCgcDzQ/exec';

/* =====================
   Helpers
===================== */
const $ = id => document.getElementById(id);

const show = el => el && (el.style.display = 'block');
const hide = el => el && (el.style.display = 'none');

const showLoading = () => show($('pageLoading'));
const hideLoading = () => hide($('pageLoading'));

const showLoadingOverlay = () => show($('loadingOverlay'));
const hideLoadingOverlay = () => hide($('loadingOverlay'));

/* =====================
   Open invitation
===================== */
function openInvite(guest) {
  if (!guest || !guest.name) return;

  const hero = document.querySelector('.hero');
  const searchBox = $('searchBox');
  const invite = $('invite');
  const rsvp = $('rsvp');

  hide(hero);
  hide(searchBox);

  show(invite);
  invite.classList.add('show'); // 🔥 DÒNG QUAN TRỌNG

  show(rsvp);

  $('guestDisplay').innerText = guest.name;
  $('guestName').value = guest.title + " " + guest.name;
  $('guestTitle').innerText = 'Thân mời ' + guest.title;


  setTimeout(() => {
    document.getElementById('welcomeOverlay')?.classList.add('show');
  }, 300);

  setTimeout(() => {
    AOS.refresh(); // hoặc AOS.refresh()
  }, 50);

  tryAutoPlayMusic();
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =====================
   Auto load guest
===================== */
function autoLoadGuest() {
  const cached = sessionStorage.getItem('guestData');
  if (!cached) return;

  try {
    const guest = JSON.parse(cached);
    openInvite(guest);
  } catch {
    sessionStorage.removeItem('guestData');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  autoLoadGuest();
});

/* =====================
   Manual check guest
===================== */
window.checkGuest = function () {
  const q = $('guestInput')?.value.trim();
  if (!q) {
    alert('Vui lòng nhập tên hoặc số điện thoại');
    return;
  }

  showLoading();

  fetch(`${API_URL}?guest=${encodeURIComponent(q)}`)
    .then(res => res.json())
    .then(data => {
      hideLoading();

      if (!data?.found) {
        alert('Không tìm thấy thông tin khách mời');
        return;
      }

      sessionStorage.setItem('guestData', JSON.stringify(data.guest));
      openInvite(data.guest);
    })
    .catch(() => {
      hideLoading();
      alert('Có lỗi xảy ra, vui lòng thử lại');
    });
};

/* =====================
   RSVP submit
===================== */
const form = $('rsvpForm');
form?.addEventListener('submit', e => {
  e.preventDefault();

  showLoadingOverlay();

  fetch(API_URL, {
    method: 'POST',
    body: new FormData(form)
  })
    .then(() => {
      hideLoadingOverlay();
      alert('Cảm ơn bạn đã gửi lời chúc 💖');
      form.reset();
    })
    .catch(() => {
      hideLoadingOverlay();
      alert('Gửi thất bại, vui lòng thử lại');
    });
});

/* =====================
   Gallery lightbox
===================== */
// function openLightbox(src) {
//   document.body.classList.add('lightbox-open');
//   const lb = document.getElementById('lightbox');
//   document.getElementById('lightboxImg').src = src;
//   lb.classList.add('show');
// }

// function closeLightbox() {
//   document.body.classList.remove('lightbox-open');
//   document.getElementById('lightbox').classList.remove('show');
// }

// document.querySelectorAll('.gallery-album img').forEach(img => {
//   img.addEventListener('click', () => {
//     $('lightboxImg').src = img.src;
//     // show($('lightbox'));
//     $('lightbox').classList.add('show');
//   });
// });

// document.querySelector('#lightbox .close')
//   ?.addEventListener('click', () => {
//     $('lightbox').classList.remove('show');
//   }
// );

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  // Click ảnh trong gallery → mở lightbox
  document.querySelectorAll('.gallery-album img').forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src);
    });
  });

  // Click nền tối → đóng
  lightbox.addEventListener('click', (e) => {
    // nếu click KHÔNG phải ảnh thì đóng
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Click nút X → đóng
  lightbox.querySelector('.close')?.addEventListener('click', closeLightbox);
}

function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  lightboxImg.src = src;
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden'; // khóa scroll mobile
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');

  lightbox.classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
});

/* =====================
   Scroll reveal
===================== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add('show'));
}, { threshold: 0.3 });

document.querySelectorAll('.album-img')
  .forEach(img => observer.observe(img));

/* =====================
   COUNTDOWN TIMER
===================== */
(function initCountdown() {
  const targetDate = new Date('2026-01-24T17:00:00+07:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minutesEl.innerText = '00';
      secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minutesEl.innerText = String(minutes).padStart(2, '0');
    secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* =====================
   BACKGROUND MUSIC
===================== */
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicControl');

let isPlaying = false;

// click icon để bật / tắt
musicBtn.addEventListener('click', () => {
  if (!isPlaying) {
    music.play().then(() => {
      isPlaying = true;
      musicBtn.classList.remove('paused');
      musicBtn.classList.add('playing');
    }).catch(() => {
      // iOS cần user interaction → click lại OK
    });
  } else {
    music.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.classList.add('paused');
  }
});

// OPTIONAL: tự bật nhạc khi mở thiệp thành công
function tryAutoPlayMusic() {
  music.play().then(() => {
    isPlaying = true;
    musicBtn.classList.remove('paused');
    musicBtn.classList.add('playing');
  }).catch(() => {});
}
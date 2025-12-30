const API_URL = 'https://script.google.com/macros/s/AKfycbyYuzf684k7xc1eTrtmKjqivEhgf96WHQY3AsbahC_kiQXilVJkPthr3_1cxYhmCgcDzQ/exec';

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const openBtn = document.getElementById('openBtn');
const privateMsg = document.getElementById('privateMsg');

/* =====================
   UI helpers
===================== */
function enableOpenBtn() {
  openBtn.disabled = false;
  openBtn.innerText = 'Cùng chúng tôi bước vào lễ đường nhé!';
}

function showPrivateMessage() {
  openBtn.style.display = 'none';
  privateMsg.style.display = 'block';
}

/* =====================
   Auto load guest (OPENING)
===================== */
(async function autoLoadGuest() {
  try {
    // 1️⃣ Có cache → hợp lệ
    const cached = sessionStorage.getItem('guestData');
    if (cached) {
      enableOpenBtn();
      return;
    }

    // 2️⃣ Bắt buộc phải có param
    const id = getParam('id');
    const guest = getParam('guest');

    if (!id && !guest) {
      showPrivateMessage();
      return;
    }

    // 3️⃣ Gọi API check hợp lệ
    const res = await fetch(
      `${API_URL}?${id ? 'id=' + encodeURIComponent(id) : 'guest=' + encodeURIComponent(guest)}`
    );

    const data = await res.json();

    if (data?.found && data.guest) {
      sessionStorage.setItem('guestData', JSON.stringify(data.guest));
      enableOpenBtn();
    } else {
      showPrivateMessage();
    }

  } catch (err) {
    console.error('Opening load failed', err);
    showPrivateMessage();
  }
})();

openBtn.addEventListener('click', () => {
  const opening = document.getElementById('opening');

  opening.style.transition = 'opacity .8s ease';
  opening.style.opacity = 0;

  setTimeout(() => {
    window.location.href = 'invitation.html' + window.location.search;
  }, 800);
});
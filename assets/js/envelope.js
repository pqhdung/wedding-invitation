const opening = document.getElementById('opening');
const envelope = document.getElementById('openingEnvelope');

envelope.addEventListener('click', () => {
  envelope.classList.add('opened');

  const guestId = getParam('id');
  
  // Sau 2s → chuyển page
  setTimeout(() => {
    opening.style.transition = 'opacity .8s ease';
    opening.style.opacity = 0;

    if (guestId) {
    showLoading();

    fetch(`${API_URL}?id=${encodeURIComponent(guestId)}`)
      .then(res => res.json())
      .then(data => {
        hideLoading();

        if (data.found) {
          document.getElementById('guestDisplay').innerText =
            `Anh/Chị ${data.guest.name}`;

          document.getElementById('guestName').value = data.guest.name;
          document.getElementById('rsvp').style.display = 'block';
        } else {
          document.getElementById('rsvp').style.display = 'none';
        }
      });
  }
  
    setTimeout(() => {
      opening.style.display = 'none';
      AOS.init({ once: true });
    }, 800);
  }, 3000);
});
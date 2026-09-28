// Agenda oficial informada pelo responsável pelo projeto.
const BOOKING_URL = 'https://sites.appbarber.com.br/barbeariabarbu-bz17';

const bookingLinks = document.querySelectorAll('[data-booking-placement]');
bookingLinks.forEach((link) => {
  if (BOOKING_URL) {
    link.href = BOOKING_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  link.addEventListener('click', () => {
    const placement = link.dataset.bookingPlacement || 'unknown';
    window.dispatchEvent(new CustomEvent('barbus:booking-click', {
      detail: { placement, destination: BOOKING_URL ? 'appbarber' : 'phone' }
    }));
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'booking_click', {
        placement,
        destination: BOOKING_URL ? 'appbarber' : 'phone'
      });
    }
  });
});

document.querySelectorAll('[data-whatsapp-placement]').forEach((link) => {
  link.addEventListener('click', () => {
    const placement = link.dataset.whatsappPlacement || 'unknown';
    window.dispatchEvent(new CustomEvent('barbus:whatsapp-click', {
      detail: { placement, destination: 'whatsapp' }
    }));
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'whatsapp_click', { placement, destination: 'whatsapp' });
    }
  });
});

const cutShowcase = document.querySelector('[data-cut-showcase]');
if (cutShowcase) {
  const cards = [...cutShowcase.querySelectorAll('[data-cut-card]')];
  const dots = [...cutShowcase.querySelectorAll('[data-cut-to]')];
  let currentIndex = 0;
  let pointerStart = null;

  const showCut = (requestedIndex) => {
    currentIndex = (requestedIndex + cards.length) % cards.length;
    cards.forEach((card, index) => {
      let distance = index - currentIndex;
      if (distance > cards.length / 2) distance -= cards.length;
      if (distance < -cards.length / 2) distance += cards.length;
      card.dataset.position = distance === 0 ? 'current' : distance === -1 ? 'previous' : distance === 1 ? 'next' : 'hidden';
      card.setAttribute('aria-hidden', distance === 0 ? 'false' : 'true');
    });
    dots.forEach((dot, index) => {
      if (index === currentIndex) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  cutShowcase.querySelectorAll('[data-cut-step]').forEach((button) => {
    button.addEventListener('click', () => showCut(currentIndex + Number(button.dataset.cutStep)));
  });
  dots.forEach((dot) => dot.addEventListener('click', () => showCut(Number(dot.dataset.cutTo))));
  cutShowcase.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showCut(currentIndex - 1);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      showCut(currentIndex + 1);
    }
  });
  cutShowcase.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' || event.pointerType === 'pen' || event.button === 0) {
      pointerStart = { x: event.clientX, y: event.clientY };
    }
  });
  cutShowcase.addEventListener('pointerup', (event) => {
    if (!pointerStart) return;
    const horizontalSwipe = event.clientX - pointerStart.x;
    const verticalSwipe = event.clientY - pointerStart.y;
    if (Math.abs(horizontalSwipe) > 45 && Math.abs(horizontalSwipe) > Math.abs(verticalSwipe)) {
      showCut(currentIndex + (horizontalSwipe < 0 ? 1 : -1));
    } else if (event.pointerType === 'mouse' && Math.abs(verticalSwipe) > 45) {
      showCut(currentIndex + (verticalSwipe < 0 ? 1 : -1));
    }
    pointerStart = null;
  });
  cutShowcase.addEventListener('pointercancel', () => { pointerStart = null; });
}

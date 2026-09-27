// Agenda oficial informada pelo responsável pelo projeto.
const BOOKING_URL = 'https://sites.appbarber.com.br/barbeariabarbu-bz17';

const bookingLinks = document.querySelectorAll('.booking-link');
bookingLinks.forEach((link) => {
  if (BOOKING_URL) {
    link.href = BOOKING_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = 'Agendar horário <span aria-hidden="true">↗</span>';
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

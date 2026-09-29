import { refs } from './refs';

export function openModal() {
  refs.modal.classList.add('modal--is-open');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleEscPress);
  refs.modalCloseBtn.addEventListener('click', closeModal);
  refs.modal.addEventListener('click', handleBackdropClick);
}

export function closeModal() {
  refs.modal.classList.remove('modal--is-open');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleEscPress);
  refs.modalCloseBtn.removeEventListener('click', closeModal);
  refs.modal.removeEventListener('click', handleBackdropClick);
}

function handleEscPress(event) {
  if (event.code === 'Escape') {
    closeModal();
  }
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

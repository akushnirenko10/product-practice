import {
  handleCategoryClick,
  handleProductClick,
  initHomePage,
} from './js/handlers';
import { closeModal } from './js/modal';
import { refs } from './js/refs';

//Логіка сторінки Home
document.addEventListener('DOMContentLoaded', initHomePage);
refs.categoriesList.addEventListener('click', handleCategoryClick);
refs.productsList.addEventListener('click', handleProductClick);

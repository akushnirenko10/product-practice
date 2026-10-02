import {
  handleAddToCartBtbClick,
  handleAddToWishlistBtnClick,
  handleCategoryClick,
  handleClearSearchBtnClick,
  handleLoadMoreBtnClick,
  handleProductClick,
  handleScrollTop,
  handleScrollTopBtnClick,
  handleSearchSubmit,
  handleToggleThemeBtnClick,
  initHomePage,
} from './js/handlers';
import { refs } from './js/refs';

//Логіка сторінки Home
document.addEventListener('DOMContentLoaded', initHomePage);
refs.categoriesList.addEventListener('click', handleCategoryClick);
refs.productsList.addEventListener('click', handleProductClick);

refs.searchForm.addEventListener('submit', handleSearchSubmit);
refs.clearSearchBtn.addEventListener('click', handleClearSearchBtnClick);

refs.addToWishlistBtn.addEventListener('click', handleAddToWishlistBtnClick);
refs.addToCartBtn.addEventListener('click', handleAddToCartBtbClick);

refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

window.addEventListener('scroll', handleScrollTop);
refs.scrollTopBtn.addEventListener('click', handleScrollTopBtnClick);

refs.toggleThemeBtn.addEventListener('click', handleToggleThemeBtnClick);

import {
  handleAddToCartBtbClick,
  handleAddToWishlistBtnClick,
  handleProductClick,
  handleScrollTop,
  handleScrollTopBtnClick,
  handleToggleThemeBtnClick,
  initWishlistPage,
} from './js/handlers';
import { loadWishlistProducts } from './js/helpers';
import { refs } from './js/refs';

//Логіка сторінки Wishlist
document.addEventListener('DOMContentLoaded', initWishlistPage);
refs.productsList.addEventListener('click', handleProductClick);

refs.addToWishlistBtn.addEventListener('click', async () => {
  handleAddToWishlistBtnClick();
  await loadWishlistProducts();
});
refs.addToCartBtn.addEventListener('click', handleAddToCartBtbClick);

window.addEventListener('scroll', handleScrollTop);
refs.scrollTopBtn.addEventListener('click', handleScrollTopBtnClick);

refs.toggleThemeBtn.addEventListener('click', handleToggleThemeBtnClick);

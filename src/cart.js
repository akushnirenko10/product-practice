//Логіка сторінки Cart
import {
  handleAddToCartBtbClick,
  handleAddToWishlistBtnClick,
  handleBuyProductsClick,
  handleProductClick,
  handleScrollTop,
  handleScrollTopBtnClick,
  handleToggleThemeBtnClick,
  initCartPage,
  initWishlistPage,
} from './js/handlers';
import { loadCartProducts, loadWishlistProducts } from './js/helpers';
import { refs } from './js/refs';

document.addEventListener('DOMContentLoaded', initCartPage);
refs.productsList.addEventListener('click', handleProductClick);

refs.addToWishlistBtn.addEventListener('click', handleAddToWishlistBtnClick);

refs.addToCartBtn.addEventListener('click', async () => {
  handleAddToCartBtbClick();
  await loadCartProducts();
});

refs.buyProductsBtn.addEventListener('click', handleBuyProductsClick);

window.addEventListener('scroll', handleScrollTop);
refs.scrollTopBtn.addEventListener('click', handleScrollTopBtnClick);

refs.toggleThemeBtn.addEventListener('click', handleToggleThemeBtnClick);

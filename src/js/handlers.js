import iziToast from 'izitoast';
import {
  loadCartProducts,
  loadWishlistProducts,
  showTost,
  toggleActiveClass,
  toggleTheme,
  updateLoadMoreBtn,
} from './helpers';
import { openModal } from './modal';
import {
  getCategories,
  getProductByCategory,
  getProductById,
  getProducts,
  searchProduct,
} from './products-api';
import { refs } from './refs';
import {
  clearProductList,
  hideLoadMoreBtn,
  hideNotFound,
  renderCategories,
  renderProductInModal,
  renderProducts,
  showLoadMoreBtn,
  showLoadMoreBtnLoading,
  showNotFound,
  updateCartSummary,
  updateCounter,
} from './render-function';
import {
  addToCartItems,
  addToWishlistItems,
  getCartItems,
  getTheme,
  getWishlistItems,
  isInCart,
  isInWishlist,
  removeFromCart,
  removeFromStorage,
  removeFromWishlist,
  saveTheme,
} from './storage';
import { STORAGE_KEYS } from './constants';

let currentProductId = null;
let currentPage = 1;

export async function initHomePage() {
  const userTheme = getTheme();
  toggleTheme(userTheme);

  try {
    updateCounter(getWishlistItems(), getCartItems());
    const categories = await getCategories();

    renderCategories(categories);

    const { products, total } = await getProducts(currentPage);
    renderProducts(products);
    showLoadMoreBtn();
    updateLoadMoreBtn(total, currentPage);
  } catch (err) {
    console.log(`Помилка iнiцiалiзацii cторiнки home ${err}`);
  }
}

export async function initWishlistPage() {
  const userTheme = getTheme();
  toggleTheme(userTheme);

  updateCounter(getWishlistItems(), getCartItems());
  await loadWishlistProducts();
}

export async function initCartPage() {
  const userTheme = getTheme();
  toggleTheme(userTheme);

  updateCounter(getWishlistItems(), getCartItems());
  await loadCartProducts();
}

export async function handleCategoryClick(event) {
  const { target } = event;

  if (target.nodeName !== 'BUTTON') {
    return;
  }

  clearProductList();
  hideLoadMoreBtn();

  try {
    const category = target.textContent;

    const allCategoriesButtons = document.querySelectorAll('.categories__btn');
    toggleActiveClass(allCategoriesButtons, target, 'categories__btn--active');

    let productsData;

    if (category === 'All') {
      currentPage = 1;
      productsData = await getProducts(currentPage);
      showLoadMoreBtn();
    } else {
      productsData = await getProductByCategory(category);
    }

    if (productsData.products.length > 0) {
      hideNotFound();
      renderProducts(productsData.products);
    } else {
      showNotFound();
    }
  } catch (err) {
    console.log(`Помилка отримання продуктiв по категорii ${err}`);
  }
}

export async function handleProductClick(event) {
  const productItem = event.target.closest('.products__item');

  if (!productItem) {
    return;
  }

  const productId = Number(productItem.dataset.id);
  currentProductId = productId;
  const product = await getProductById(productId);

  renderProductInModal(product);
  openModal();
}

export async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.searchValue.value.trim();

  if (!query) {
    showTost('Please enter valid search query!', 'error');
    return;
  }

  clearProductList();
  hideLoadMoreBtn();
  try {
    const { products } = await searchProduct(query);

    if (products.length > 0) {
      renderProducts(products);
      hideNotFound();
    } else {
      showNotFound();
    }
  } catch (error) {
    showTost(`Помилка отримання продуктiв по пошуку ${error}`, 'error');
    console.log(`Помилка отримання продуктiв по пошуку ${error}`);
  }
}

export async function handleClearSearchBtnClick(event) {
  refs.searchForm.reset();
  clearProductList();
  currentPage = 1;

  try {
    const { products, total } = await getProducts(currentPage);
    renderProducts(products);
    hideNotFound();
    showLoadMoreBtn();
    updateLoadMoreBtn(total, currentPage);
    const categoryEl = document.querySelector('.categories__btn');
    const allCategoriesBtns = document.querySelectorAll('.categories__btn');
    toggleActiveClass(allCategoriesBtns, categoryEl, 'categories__btn--active');
  } catch (error) {
    showTost(`Помилка отримання продуктiв ${error}`, 'error');
    console.log(`Помилка отримання продуктiв ${error}`);
    showNotFound();
  }
}

export async function handleAddToWishlistBtnClick() {
  if (!currentProductId) {
    return;
  }
  if (isInWishlist(currentProductId)) {
    removeFromWishlist(currentProductId);
    refs.addToWishlistBtn.textContent = 'Add to Wishlist';
    showTost('Removed from Wishlist', 'info');
  } else {
    addToWishlistItems(currentProductId);
    refs.addToWishlistBtn.textContent = 'Remove from Wishlist';
    showTost('Added to Wishlist', 'success');
  }
  updateCounter(getWishlistItems(), getCartItems());
}

export async function handleAddToCartBtbClick(event) {
  if (!currentProductId) {
    return;
  }
  if (isInCart(currentProductId)) {
    removeFromCart(currentProductId);
    refs.addToCartBtn.textContent = 'Add to Cart';
    showTost('Removed from Cart', 'info');
  } else {
    addToCartItems(currentProductId);
    refs.addToCartBtn.textContent = 'Remove from Cart';
    showTost('Added to Cart', 'success');
  }
  updateCounter(getWishlistItems(), getCartItems());
}

export async function handleLoadMoreBtnClick() {
  currentPage += 1;
  showLoadMoreBtnLoading();

  try {
    const { products, total } = await getProducts(currentPage);
    renderProducts(products);
    updateLoadMoreBtn(total, currentPage);
  } catch (error) {
    showTost(`Помилка клiку в loadMoreBtn ${error}`, 'error');
    console.log(`Помилка клiку в loadMoreBtn ${error}`);
  }
}

export function handleBuyProductsClick() {
  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    showTost('Your card is empty!', 'warning');
    return;
  }

  showTost('Tanks for your purchase!', 'success');
  removeFromStorage(STORAGE_KEYS.CART);
  updateCounter(getWishlistItems(), getCartItems([]));
  updateCartSummary([]);
  window.location.reload();
}

export function handleScrollTop() {
  if (window.scrollY > 400) {
    refs.scrollTopBtn.classList.add('scroll-top-btn--visible');
  } else {
    refs.scrollTopBtn.classList.remove('scroll-top-btn--visible');
  }
}

export function handleScrollTopBtnClick() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export function handleToggleThemeBtnClick() {
  const currentTheme = document.body.dataset.theme || 'light';

  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  toggleTheme(newTheme);
  saveTheme(newTheme);
}

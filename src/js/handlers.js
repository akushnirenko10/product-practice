import iziToast from 'izitoast';
import { showTost, toggleActiveClass } from './helpers';
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
  hideNotFound,
  renderCategories,
  renderProductInModal,
  renderProducts,
  showNotFound,
  updateCounter,
} from './render-function';
import {
  addToCartItems,
  addToWishlistItems,
  getCartItems,
  getWishlistItems,
  isInCart,
  isInWishlist,
  removeFromCart,
  removeFromStorage,
  removeFromWishlist,
} from './storage';

let currentProductId = null;

export async function initHomePage() {
  try {
    updateCounter(getWishlistItems(), getCartItems());
    const categories = await getCategories();
    renderCategories(categories);

    const { products } = await getProducts();
    renderProducts(products);
  } catch (err) {
    console.log(`Помилка iнiцiалiзацii cторiнки home ${err}`);
  }
}

export async function handleCategoryClick(event) {
  const { target } = event;

  if (target.nodeName !== 'BUTTON') {
    return;
  }

  clearProductList();

  try {
    const category = target.textContent;
    getProductByCategory(category);

    const allCategoriesButtons = document.querySelectorAll('.categories__btn');
    toggleActiveClass(allCategoriesButtons, target, 'categories__btn--active');

    let productsData;

    if (category === 'All') {
      productsData = await getProducts();
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

  event.target.reset();
}

export async function handleClearSearchBtnClick(event) {
  refs.searchForm.reset();
  clearProductList();

  try {
    const { products } = await getProducts();
    renderProducts(products);
    hideNotFound();
  } catch (error) {
    showTost(`Помилка отримання продуктiв ${error}`, 'error');
    console.log(`Помилка отримання продуктiв ${error}`);
    showNotFound();
  }
}

export async function handleAddToWishlistBtnClick(event) {
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
  console.log(currentProductId);

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

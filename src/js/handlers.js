import { toggleActiveClass } from './helpers';
import { openModal } from './modal';
import {
  getCategories,
  getProductByCategory,
  getProductById,
  getProducts,
} from './products-api';
import {
  clearProductList,
  hideNotFound,
  renderCategories,
  renderProductInModal,
  renderProducts,
  showNotFound,
} from './render-function';

export async function initHomePage() {
  try {
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
  const product = await getProductById(productId);

  renderProductInModal(product);
  openModal();
}

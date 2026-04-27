const store = window.storeData;

const state = {
  activeCategory: store.categories[0].id,
  filter: "all",
  search: "",
  orderType: "매장 이용",
  cart: [],
  selectedMenu: null,
  selectedOptions: {},
  quantity: 1
};

const $ = (selector) => document.querySelector(selector);

const tabsEl = $(".category-tabs");
const titleEl = $(".category-title");
const menuListEl = $(".menu-list");
const menuCountEl = $(".menu-count");
const searchInputEl = $(".search-box input");
const cartPanelEl = $(".cart-panel");
const cartToggleEl = $(".cart-toggle");
const cartSummaryEl = $(".cart-summary");
const cartItemsEl = $(".cart-items");
const totalPriceEl = $(".total-price");
const orderButtonEl = $(".order-button");
const requestEl = $(".request-box textarea");
const modalBackdropEl = $(".modal-backdrop");
const modalImageEl = $(".modal-image");
const modalTitleEl = $("#modal-title");
const modalCategoryEl = $(".modal-category");
const modalBasePriceEl = $(".modal-base-price");
const modalDescriptionEl = $(".modal-description");
const optionGroupsEl = $(".option-groups");
const quantityValueEl = $(".quantity-value");
const addCartButtonEl = $(".add-cart-button");
const toastEl = $(".toast");
const tableLabelEl = $(".table-label");
const orderModalBackdropEl = $(".order-modal-backdrop");
const copyTextEl = $(".copy-text");
const copyKakaoLinkEl = $(".copy-kakao-link");
const copyCloseEl = $(".copy-close");
const copyHelpEl = $(".copy-help");
const copyOrderButtonEl = $(".copy-order-button");
const orderPreviewEl = $(".order-preview");

const formatPrice = (price) => `${price.toLocaleString("ko-KR")}${store.currency}`;
const activeCategory = () => store.categories.find((category) => category.id === state.activeCategory);
const toPrice = (value) => Number(value) || 0;
const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function getMenuOptions(menu) {
  const commonOptions = store.commonOptions || {};
  const fromRefs = (menu.optionRefs || []).map((key) => commonOptions[key]).filter(Boolean);
  return [...fromRefs, ...(menu.options || [])];
}

function renderTabs() {
  tabsEl.innerHTML = store.categories
    .map((category) => {
      const active = category.id === state.activeCategory ? "active" : "";
      return `<button class="${active}" type="button" data-category="${escapeHtml(category.id)}">${escapeHtml(category.label)}</button>`;
    })
    .join("");
}

function getVisibleMenus() {
  const keyword = state.search.trim().toLowerCase();
  return store.menus.filter((menu) => {
    const matchCategory = menu.category === state.activeCategory;
    const matchFilter = state.filter === "all" || menu.badge === "Best";
    const matchSearch = !keyword || `${menu.name} ${menu.description}`.toLowerCase().includes(keyword);
    return matchCategory && matchFilter && matchSearch;
  });
}

function renderMenus() {
  const visibleMenus = getVisibleMenus();
  titleEl.textContent = activeCategory().label;
  menuCountEl.textContent = `${visibleMenus.length}개`;

  if (!visibleMenus.length) {
    menuListEl.innerHTML = `<div class="empty-state">조건에 맞는 메뉴가 없습니다.</div>`;
    return;
  }

  menuListEl.innerHTML = visibleMenus
    .map((menu) => {
      const badge = menu.badge ? `<span class="menu-badge">${escapeHtml(menu.badge)}</span>` : "";
      return `
        <article class="menu-card" data-menu-id="${escapeHtml(menu.id)}" tabindex="0">
          <div class="menu-thumb">
            <img src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" loading="lazy" />
            ${badge}
          </div>
          <div class="menu-copy">
            <h3>${escapeHtml(menu.name)}</h3>
            <p>${escapeHtml(menu.description)}</p>
            <div>
              <strong>${formatPrice(menu.price)}</strong>
              <span>옵션 선택</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function hydrateDefaultOptions() {
  state.selectedOptions = {};
  getMenuOptions(state.selectedMenu).forEach((group, groupIndex) => {
    if (group.type !== "multiple" && group.items.length) {
      state.selectedOptions[groupIndex] = [group.items[0]];
    }
  });
}

function getOptionPrice(options = Object.values(state.selectedOptions)) {
  return options.flat().reduce((sum, option) => sum + toPrice(option.price), 0);
}

function getItemTotal(item) {
  return (toPrice(item.menu.price) + getOptionPrice(item.options)) * item.quantity;
}

function renderOptionModal() {
  const menu = state.selectedMenu;
  const category = store.categories.find((item) => item.id === menu.category);
  const optionGroups = getMenuOptions(menu);

  modalImageEl.src = menu.image;
  modalImageEl.alt = menu.name;
  modalCategoryEl.textContent = category?.label || "메뉴";
  modalTitleEl.textContent = menu.name;
  modalBasePriceEl.textContent = formatPrice(toPrice(menu.price));
  modalDescriptionEl.textContent = menu.description;
  quantityValueEl.textContent = state.quantity;

  optionGroupsEl.innerHTML = optionGroups
    .map((group, groupIndex) => {
      const type = group.type === "multiple" ? "checkbox" : "radio";
      const options = group.items
        .map((item, itemIndex) => {
          const inputId = `option-${groupIndex}-${itemIndex}`;
          const checked = type === "radio" && itemIndex === 0 ? "checked" : "";
          return `
            <label class="option-chip" for="${escapeHtml(inputId)}">
              <input
                id="${escapeHtml(inputId)}"
                type="${type}"
                name="option-${escapeHtml(groupIndex)}"
                value="${itemIndex}"
                data-group-index="${groupIndex}"
                data-item-index="${itemIndex}"
                ${checked}
              />
              <span>${escapeHtml(item.label)}</span>
              ${item.price ? `<em>+${formatPrice(item.price)}</em>` : ""}
            </label>
          `;
        })
        .join("");

      return `
        <fieldset class="option-group">
          <legend>${escapeHtml(group.name)}${group.required ? "" : " 선택"}</legend>
          <div class="option-list">${options}</div>
        </fieldset>
      `;
    })
    .join("");

  hydrateDefaultOptions();
  updateAddCartButton();
}

function updateAddCartButton() {
  const unitPrice = toPrice(state.selectedMenu.price) + getOptionPrice();
  addCartButtonEl.textContent = `${formatPrice(unitPrice * state.quantity)} 담기`;
}

function openModal(menuId) {
  state.selectedMenu = store.menus.find((menu) => menu.id === menuId);
  state.quantity = 1;
  renderOptionModal();
  modalBackdropEl.hidden = false;
  document.body.classList.add("modal-open");
  $(".modal-close").focus();
}

function closeModal() {
  modalBackdropEl.hidden = true;
  document.body.classList.remove("modal-open");
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.cart.reduce((sum, item) => sum + getItemTotal(item), 0);

  cartSummaryEl.textContent = `${count}개 · ${formatPrice(total)}`;
  totalPriceEl.textContent = formatPrice(total);
  orderButtonEl.disabled = state.cart.length === 0;

  if (!state.cart.length) {
    cartItemsEl.innerHTML = `<p class="empty-cart">아직 담긴 메뉴가 없습니다.</p>`;
    return;
  }

  cartItemsEl.innerHTML = state.cart
    .map((item, index) => {
      const options = item.options.flat();
      const optionHtml = options.length
        ? options
            .map((option) => {
              const tone = option.label === "Ice" ? "ice" : option.label === "Hot" ? "hot" : "";
              return `<span class="option-tag ${tone}">${escapeHtml(option.label)}</span>`;
            })
            .join("")
        : `<span class="option-tag">옵션 없음</span>`;
      return `
        <div class="cart-item">
          <div>
            <strong>${escapeHtml(item.menu.name)}</strong>
            <div class="cart-options">${optionHtml}</div>
            <em>${item.quantity}개 · ${formatPrice(getItemTotal(item))}</em>
          </div>
          <div class="cart-actions">
            <button type="button" data-cart-action="decrease" data-index="${index}" aria-label="${escapeHtml(item.menu.name)} 수량 줄이기">−</button>
            <button type="button" data-cart-action="increase" data-index="${index}" aria-label="${escapeHtml(item.menu.name)} 수량 늘리기">+</button>
            <button class="remove" type="button" data-cart-action="remove" data-index="${index}" aria-label="${escapeHtml(item.menu.name)} 삭제">삭제</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toastEl.classList.remove("show"), 2300);
}

function buildOrderText() {
  const lines = [`[${store.name} 주문]`, `테이블: ${store.tableName}`, `방식: ${state.orderType}`, ""];

  state.cart.forEach((item, index) => {
    const optionText = item.options.flat().map((option) => option.label).join(", ");
    lines.push(`${index + 1}. ${item.menu.name} ${item.quantity}개`);
    if (optionText) lines.push(`   옵션: ${optionText}`);
    lines.push(`   금액: ${formatPrice(getItemTotal(item))}`);
  });

  const request = requestEl.value.trim();
  lines.push("", `총액: ${totalPriceEl.textContent}`);
  if (request) lines.push(`요청사항: ${request}`);
  return lines.join("\n");
}

async function copyOrderAndOpenKakao() {
  const orderText = buildOrderText();
  openOrderModal(orderText, "주문 내용을 확인해 주세요. 자동 복사를 시도합니다.");
  try {
    await navigator.clipboard.writeText(orderText);
    setOrderModalHelp("주문 내용이 복사되었습니다. 카카오톡 채널에 붙여넣어 주세요.");
  } catch {
    setOrderModalHelp("자동 복사가 막혔습니다. 아래 복사 버튼을 눌러 주세요.");
  }
}

function openOrderModal(orderText, helpText) {
  toastEl.classList.remove("show");
  window.clearTimeout(showToast.timer);
  setOrderModalHelp(helpText);
  copyTextEl.value = orderText;
  copyKakaoLinkEl.href = store.kakaoUrl;
  renderOrderPreview();
  orderModalBackdropEl.hidden = false;
  document.body.classList.add("modal-open");
  copyOrderButtonEl.focus();
}

function setOrderModalHelp(message) {
  copyHelpEl.textContent = message;
}

function renderOrderPreview() {
  const items = state.cart
    .map((item) => {
      const optionText = item.options.flat().map((option) => option.label).join(", ");
      return `
        <div class="order-preview__item">
          <div>
            <strong>${escapeHtml(item.menu.name)}</strong>
            <span>${escapeHtml(optionText || "옵션 없음")}</span>
          </div>
          <em>${item.quantity}개 · ${formatPrice(getItemTotal(item))}</em>
        </div>
      `;
    })
    .join("");

  orderPreviewEl.innerHTML = `
    <div class="order-preview__meta">
      <span>테이블</span>
      <strong>${escapeHtml(store.tableName)}</strong>
      <span>방식</span>
      <strong>${escapeHtml(state.orderType)}</strong>
    </div>
    <div class="order-preview__items">${items}</div>
    <div class="order-preview__total">
      <span>총 주문금액</span>
      <strong>${escapeHtml(totalPriceEl.textContent)}</strong>
    </div>
  `;
}

async function copyCurrentOrderText() {
  try {
    await navigator.clipboard.writeText(copyTextEl.value);
    setOrderModalHelp("주문 내용이 복사되었습니다. 카카오톡 채널에 붙여넣어 주세요.");
  } catch {
    copyTextEl.focus();
    copyTextEl.select();
    setOrderModalHelp("복사가 막혔습니다. 선택된 주문 내용을 직접 복사해 주세요.");
  }
}

function closeOrderModal() {
  orderModalBackdropEl.hidden = true;
  document.body.classList.remove("modal-open");
}

tabsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  state.activeCategory = button.dataset.category;
  renderTabs();
  renderMenus();
});

$(".toolbar").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
  renderMenus();
});

$(".order-type").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-order-type]");
  if (!button) return;
  state.orderType = button.dataset.orderType;
  document.querySelectorAll(".order-type button").forEach((item) => item.classList.toggle("active", item === button));
});

searchInputEl.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderMenus();
});

menuListEl.addEventListener("click", (event) => {
  const card = event.target.closest(".menu-card");
  if (card) openModal(card.dataset.menuId);
});

menuListEl.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".menu-card");
  if (!card) return;
  event.preventDefault();
  openModal(card.dataset.menuId);
});

optionGroupsEl.addEventListener("change", (event) => {
  const input = event.target;
  if (!input.matches("input")) return;

  const groupIndex = input.dataset.groupIndex;
  const group = getMenuOptions(state.selectedMenu)[groupIndex];
  const selectedItem = group.items[input.dataset.itemIndex];

  if (input.type === "radio") {
    state.selectedOptions[groupIndex] = [selectedItem];
  } else {
    const current = state.selectedOptions[groupIndex] || [];
    state.selectedOptions[groupIndex] = input.checked
      ? [...current, selectedItem]
      : current.filter((option) => option.label !== selectedItem.label);
  }

  updateAddCartButton();
});

$(".quantity-minus").addEventListener("click", () => {
  state.quantity = Math.max(1, state.quantity - 1);
  quantityValueEl.textContent = state.quantity;
  updateAddCartButton();
});

$(".quantity-plus").addEventListener("click", () => {
  state.quantity += 1;
  quantityValueEl.textContent = state.quantity;
  updateAddCartButton();
});

addCartButtonEl.addEventListener("click", () => {
  const wasCartOpen = cartPanelEl.classList.contains("open");
  state.cart.push({
    menu: state.selectedMenu,
    options: Object.values(state.selectedOptions),
    quantity: state.quantity
  });
  renderCart();
  closeModal();
  cartPanelEl.classList.toggle("open", wasCartOpen);
  cartToggleEl.setAttribute("aria-expanded", String(wasCartOpen));
  showToast("장바구니에 담았습니다.");
});

$(".modal-close").addEventListener("click", closeModal);
modalBackdropEl.addEventListener("click", (event) => {
  if (event.target === modalBackdropEl) closeModal();
});

copyCloseEl.addEventListener("click", closeOrderModal);
copyOrderButtonEl.addEventListener("click", copyCurrentOrderText);
orderModalBackdropEl.addEventListener("click", (event) => {
  if (event.target === orderModalBackdropEl) closeOrderModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!modalBackdropEl.hidden) closeModal();
  if (!orderModalBackdropEl.hidden) closeOrderModal();
});

cartToggleEl.addEventListener("click", () => {
  const open = cartPanelEl.classList.toggle("open");
  cartToggleEl.setAttribute("aria-expanded", String(open));
});

cartItemsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-cart-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const item = state.cart[index];
  if (!item) return;

  if (button.dataset.cartAction === "increase") item.quantity += 1;
  if (button.dataset.cartAction === "decrease") item.quantity -= 1;
  if (button.dataset.cartAction === "remove" || item.quantity <= 0) state.cart.splice(index, 1);

  renderCart();
});

orderButtonEl.addEventListener("click", copyOrderAndOpenKakao);

tableLabelEl.textContent = store.tableName;
renderTabs();
renderMenus();
renderCart();

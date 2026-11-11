const cars = [
  {
    id: "bmw-x5",
    make: "BMW",
    model: "X5",
    trim: "xDrive40i · M Sport",
    year: 2023,
    price: 58900,
    mileage: "18,420 mi",
    body: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    badge: "CARX PICK",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
    description: "A confident, comfortable SUV with a beautifully finished cabin, all-wheel drive, and plenty of room for the everyday and the occasional escape."
  },
  {
    id: "mercedes-c-class",
    make: "Mercedes-Benz",
    model: "C-Class",
    trim: "C 300 · AMG Line",
    year: 2022,
    price: 42900,
    mileage: "21,650 mi",
    body: "Sedan",
    fuel: "Petrol",
    transmission: "Automatic",
    badge: "LOW MILEAGE",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80",
    description: "Effortlessly stylish and thoughtfully equipped, this C-Class brings a refined drive, elegant details, and everyday comfort together."
  },
  {
    id: "porsche-911",
    make: "Porsche",
    model: "911 Carrera",
    trim: "Carrera · PDK",
    year: 2023,
    price: 112500,
    mileage: "8,200 mi",
    body: "Coupe",
    fuel: "Petrol",
    transmission: "Automatic",
    badge: "JUST ARRIVED",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    description: "An iconic sports car with exhilarating performance, unmistakable design, and the kind of precision that makes every drive an occasion."
  },
  {
    id: "tesla-model-3",
    make: "Tesla",
    model: "Model 3",
    trim: "Long Range · AWD",
    year: 2023,
    price: 36400,
    mileage: "12,150 mi",
    body: "Electric",
    fuel: "Electric",
    transmission: "Automatic",
    badge: "ELECTRIC",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80",
    description: "A sleek, all-electric sedan with impressive range, all-wheel drive, and a clean, modern interior made for a simpler kind of commute."
  },
  {
    id: "audi-q5",
    make: "Audi",
    model: "Q5",
    trim: "45 TFSI · S line",
    year: 2022,
    price: 39750,
    mileage: "24,080 mi",
    body: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    badge: "GREAT VALUE",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80",
    description: "A versatile premium SUV with a composed ride, smart all-wheel drive, and the thoughtful, understated finish Audi does so well."
  },
  {
    id: "lexus-rx",
    make: "Lexus",
    model: "RX 350",
    trim: "Premium · AWD",
    year: 2021,
    price: 35500,
    mileage: "29,740 mi",
    body: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    badge: "CARX PICK",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80",
    description: "Quietly capable and exceptionally comfortable, this RX is a well-kept premium SUV that makes the miles feel easy."
  }
];

const grid = document.querySelector("#car-grid");
const searchInput = document.querySelector("#search-input");
const bodyFilter = document.querySelector("#body-filter");
const sortSelect = document.querySelector("#sort-select");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const savedToggle = document.querySelector("#saved-toggle");
const savedCount = document.querySelector("#saved-count");
const dialog = document.querySelector("#car-dialog");
const cartDialog = document.querySelector("#cart-dialog");
const favoriteStorageKey = "carx-saved-cars";
const cartStorageKey = "carx-cart";

function readCarSet(storageKey) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return new Set(Array.isArray(saved) ? saved.filter((id) => cars.some((car) => car.id === id)) : []);
  } catch (error) {
    console.warn(`Could not read ${storageKey} from local storage.`, error);
    return new Set();
  }
}

const savedCars = readCarSet(favoriteStorageKey);
const cart = readCarSet(cartStorageKey);
let showSavedOnly = false;

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

function saveFavorites() {
  try {
    localStorage.setItem(favoriteStorageKey, JSON.stringify([...savedCars]));
  } catch (error) {
    console.warn("Could not save favorite cars.", error);
  }
}

function saveCart() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify([...cart]));
  } catch (error) {
    console.warn("Could not save cart to local storage.", error);
  }
}

function createCarCard(car) {
  const article = document.createElement("article");
  article.className = "car-card";

  const photo = document.createElement("div");
  photo.className = "car-photo";
  const image = document.createElement("img");
  image.src = car.image;
  image.alt = `${car.year} ${car.make} ${car.model}`;
  image.loading = "lazy";
  image.onerror = () => {
    image.remove();
    photo.style.background = "linear-gradient(135deg, #d9dcd7, #aeb3ae)";
    photo.setAttribute("aria-label", `${car.year} ${car.make} ${car.model} image unavailable`);
  };
  photo.append(image);

  const badge = document.createElement("span");
  badge.className = "car-badge";
  badge.textContent = car.badge;
  photo.append(badge);

  const favorite = document.createElement("button");
  favorite.className = `favorite-button${savedCars.has(car.id) ? " is-saved" : ""}`;
  favorite.type = "button";
  favorite.setAttribute("aria-label", `${savedCars.has(car.id) ? "Remove" : "Save"} ${car.make} ${car.model}`);
  favorite.setAttribute("aria-pressed", String(savedCars.has(car.id)));
  favorite.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z"></path></svg>';
  favorite.addEventListener("click", () => {
    if (savedCars.has(car.id)) savedCars.delete(car.id);
    else savedCars.add(car.id);
    saveFavorites();
    updateSavedCount();
    renderCars();
  });
  photo.append(favorite);

  const info = document.createElement("div");
  info.className = "car-info";
  const titleRow = document.createElement("div");
  titleRow.className = "car-title-row";
  const title = document.createElement("h3");
  title.className = "car-title";
  title.textContent = `${car.make} ${car.model}`;
  const year = document.createElement("span");
  year.className = "car-year";
  year.textContent = car.year;
  titleRow.append(title, year);

  const trim = document.createElement("p");
  trim.className = "car-trim";
  trim.textContent = car.trim;

  const specs = document.createElement("div");
  specs.className = "car-specs";
  [`${car.mileage}`, car.body, car.fuel].forEach((value) => {
    const spec = document.createElement("span");
    spec.textContent = value;
    specs.append(spec);
  });

  const bottom = document.createElement("div");
  bottom.className = "car-bottom";
  const price = document.createElement("strong");
  price.className = "car-price";
  price.textContent = formatPrice(car.price);
  const details = document.createElement("button");
  details.className = "details-button";
  details.type = "button";
  details.textContent = "View details ↗";
  details.addEventListener("click", () => openCarDetails(car));
  const actions = document.createElement("div");
  actions.className = "car-actions";
  const addToCart = document.createElement("button");
  addToCart.className = `cart-add-button${cart.has(car.id) ? " is-added" : ""}`;
  addToCart.type = "button";
  addToCart.setAttribute("aria-label", `${cart.has(car.id) ? "Remove" : "Add"} ${car.make} ${car.model} ${cart.has(car.id) ? "from" : "to"} cart`);
  addToCart.setAttribute("aria-pressed", String(cart.has(car.id)));
  addToCart.textContent = cart.has(car.id) ? "Added ✓" : "Add to cart";
  addToCart.addEventListener("click", () => toggleCartItem(car));
  actions.append(details, addToCart);
  bottom.append(price, actions);

  info.append(titleRow, trim, specs, bottom);
  article.append(photo, info);
  return article;
}

function getVisibleCars() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedBody = bodyFilter.value;
  const filtered = cars.filter((car) => {
    const matchesQuery = `${car.make} ${car.model} ${car.trim} ${car.body} ${car.fuel}`.toLowerCase().includes(query);
    return matchesQuery &&
      (selectedBody === "all" || car.body === selectedBody) &&
      (!showSavedOnly || savedCars.has(car.id));
  });

  const sorters = {
    featured: () => 0,
    "price-low": (a, b) => a.price - b.price,
    "price-high": (a, b) => b.price - a.price,
    "year-new": (a, b) => b.year - a.year || a.price - b.price
  };
  return filtered.sort(sorters[sortSelect.value] || sorters.featured);
}

function renderCars() {
  if (!grid) return;
  const visibleCars = getVisibleCars();
  grid.replaceChildren(...visibleCars.map(createCarCard));
  emptyState.hidden = visibleCars.length !== 0;
  grid.hidden = visibleCars.length === 0;
  resultsCount.textContent = showSavedOnly
    ? `Showing ${visibleCars.length} saved ${visibleCars.length === 1 ? "car" : "cars"}`
    : `Showing ${visibleCars.length} of ${cars.length} cars`;
}

function updateSavedCount() {
  if (savedCount) savedCount.textContent = savedCars.size;
}

function toggleCartItem(car) {
  if (cart.has(car.id)) cart.delete(car.id);
  else cart.add(car.id);
  saveCart();
  renderCart();
  renderCars();
  renderFeaturedCars();
}

function renderCart() {
  const items = cars.filter((car) => cart.has(car.id));
  const cartItems = document.querySelector("#cart-items");
  if (!cartItems) return;
  const cartEmpty = document.querySelector("#cart-empty");
  const cartFooter = document.querySelector("#cart-footer");
  const checkoutForm = document.querySelector("#checkout-form");
  const total = items.reduce((sum, car) => sum + car.price, 0);

  document.querySelector("#cart-count").textContent = items.length;
  document.querySelector("#cart-title-count").textContent = `(${items.length})`;
  cartItems.replaceChildren();
  items.forEach((car) => {
    const item = document.createElement("article");
    item.className = "cart-item";
    const image = document.createElement("img");
    image.src = car.image;
    image.alt = "";
    image.loading = "lazy";
    const details = document.createElement("div");
    details.className = "cart-item-details";
    const title = document.createElement("h3");
    title.textContent = `${car.year} ${car.make} ${car.model}`;
    const price = document.createElement("p");
    price.textContent = formatPrice(car.price);
    details.append(title, price);
    const remove = document.createElement("button");
    remove.className = "cart-remove";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${car.make} ${car.model} from cart`);
    remove.addEventListener("click", () => toggleCartItem(car));
    item.append(image, details, remove);
    cartItems.append(item);
  });

  cartEmpty.hidden = items.length > 0;
  cartFooter.hidden = items.length === 0;
  if (items.length === 0) checkoutForm.hidden = true;
  document.querySelector("#cart-total").textContent = formatPrice(total);
}

function openCarDetails(car) {
  document.querySelector("#dialog-title").textContent = `${car.year} ${car.make} ${car.model}`;
  document.querySelector("#dialog-price").textContent = formatPrice(car.price);
  document.querySelector("#dialog-description").textContent = car.description;
  document.querySelector("#dialog-image").style.backgroundImage = `url("${car.image}")`;
  const specs = document.querySelector("#dialog-specs");
  specs.replaceChildren();
  [`${car.mileage}`, car.body, car.fuel, car.transmission, car.trim].forEach((value) => {
    const spec = document.createElement("span");
    spec.textContent = value;
    specs.append(spec);
  });
  const contactLink = document.querySelector(".dialog-contact");
  contactLink.href = `mailto:hello@carx.example?subject=${encodeURIComponent(`I'm interested in the ${car.year} ${car.make} ${car.model}`)}`;
  contactLink.textContent = cart.has(car.id) ? "Remove from cart" : "Add to cart";
  contactLink.onclick = (event) => {
    event.preventDefault();
    toggleCartItem(car);
    contactLink.textContent = cart.has(car.id) ? "Remove from cart" : "Add to cart";
  };
  dialog.showModal();
}

if (searchInput && bodyFilter && sortSelect && savedToggle) {
  searchInput.addEventListener("input", renderCars);
  bodyFilter.addEventListener("change", renderCars);
  sortSelect.addEventListener("change", renderCars);
  savedToggle.addEventListener("click", () => {
    showSavedOnly = !showSavedOnly;
    savedToggle.setAttribute("aria-pressed", String(showSavedOnly));
    renderCars();
  });
  document.querySelector("#clear-filters").addEventListener("click", () => {
    searchInput.value = "";
    bodyFilter.value = "all";
    showSavedOnly = false;
    savedToggle.setAttribute("aria-pressed", "false");
    renderCars();
  });
}

if (dialog) {
  document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

document.querySelector("#header-search").addEventListener("click", () => {
  if (!searchInput) {
    window.location.href = "product.html?focusSearch=1#inventory";
    return;
  }
  searchInput.focus();
  searchInput.scrollIntoView({ block: "center", behavior: "smooth" });
});
if (searchInput && new URLSearchParams(window.location.search).has("focusSearch")) {
  window.requestAnimationFrame(() => searchInput.focus({ preventScroll: true }));
}
document.querySelector("#cart-open").addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});
document.querySelector("#cart-close").addEventListener("click", () => cartDialog.close());
document.querySelector("#cart-browse").addEventListener("click", () => cartDialog.close());
cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) cartDialog.close();
});
document.querySelector("#checkout-start").addEventListener("click", () => {
  const checkoutForm = document.querySelector("#checkout-form");
  checkoutForm.hidden = false;
  checkoutForm.scrollIntoView({ block: "nearest", behavior: "smooth" });
});
document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (cart.size === 0) return;

  const paymentMethod = new FormData(event.currentTarget).get("payment-method");
  const items = cars.filter((car) => cart.has(car.id));
  const total = items.reduce((sum, car) => sum + car.price, 0);
  const receiptNumber = `CARX-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`;
  const receiptItems = document.querySelector("#receipt-items");
  receiptItems.replaceChildren();
  items.forEach((car) => {
    const item = document.createElement("article");
    item.className = "receipt-item";
    const description = document.createElement("div");
    const model = document.createElement("strong");
    model.textContent = `Model: ${car.model}`;
    const make = document.createElement("span");
    make.textContent = `Make: ${car.make}`;
    description.append(model, make);
    const price = document.createElement("strong");
    price.textContent = formatPrice(car.price);
    item.append(description, price);
    receiptItems.append(item);
  });

  document.querySelector("#receipt-number").textContent = receiptNumber;
  document.querySelector("#receipt-date").textContent = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date());
  document.querySelector("#receipt-payment").textContent = paymentMethod;
  document.querySelector("#receipt-payment-note").textContent = paymentMethod === "Cash"
    ? "Receipt created. This does not reserve the car. Please contact CARX to confirm your order and pay in cash when collecting."
    : "Receipt created. This does not reserve the car. Contact CARX for bank details and confirmation; no payment is taken online.";
  document.querySelector("#receipt-total").textContent = formatPrice(total);
  document.querySelector("#receipt-continue").href = "product.html#inventory";

  cart.clear();
  saveCart();
  event.currentTarget.reset();
  renderCart();
  cartDialog.close();
  document.querySelector("#receipt-dialog").showModal();
});
document.querySelector("#receipt-print").addEventListener("click", () => window.print());
document.querySelector("#receipt-continue").addEventListener("click", () => {
  document.querySelector("#receipt-dialog").close();
});
document.querySelectorAll("#year").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

function renderFeaturedCars() {
  const track = document.querySelector("#featured-track");
  if (!track) return;
  track.replaceChildren(...cars.map(createCarCard));
}

function setupFeaturedHero() {
  const hero = document.querySelector("#hero-image");
  if (!hero) return;
  const featuredCars = [cars[0], cars[2], cars[3]];
  const dots = document.querySelector("#hero-dots");
  let activeIndex = 0;
  let timer;

  function showFeaturedCar(index) {
    activeIndex = (index + featuredCars.length) % featuredCars.length;
    const car = featuredCars[activeIndex];
    hero.style.backgroundImage = `linear-gradient(90deg, rgba(17,19,18,.91) 0%, rgba(17,19,18,.75) 38%, rgba(17,19,18,.1) 100%), url("${car.image.replace("w=1000", "w=2000")}")`;
    document.querySelector("#hero-eyebrow").textContent = `${car.badge} · ${car.year}`;
    document.querySelector("#hero-title").innerHTML = `${car.make}<br /><span>${car.model}</span>`;
    document.querySelector("#hero-description").textContent = car.description;
    document.querySelector("#hero-price").textContent = formatPrice(car.price);
    document.querySelector("#hero-current").textContent = String(activeIndex + 1).padStart(2, "0");
    dots.querySelectorAll("button").forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", String(dotIndex === activeIndex));
    });
  }

  featuredCars.forEach((car, index) => {
    const dot = document.createElement("button");
    dot.className = "hero-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show ${car.year} ${car.make} ${car.model}`);
    dot.setAttribute("aria-current", String(index === 0));
    dot.addEventListener("click", () => {
      showFeaturedCar(index);
      startTimer();
    });
    dots.append(dot);
  });
  document.querySelector("#hero-total").textContent = ` / ${String(featuredCars.length).padStart(2, "0")}`;
  document.querySelector("#hero-previous").addEventListener("click", () => {
    showFeaturedCar(activeIndex - 1);
    startTimer();
  });
  document.querySelector("#hero-next").addEventListener("click", () => {
    showFeaturedCar(activeIndex + 1);
    startTimer();
  });
  function startTimer() {
    window.clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = window.setInterval(() => showFeaturedCar(activeIndex + 1), 6000);
    }
  }
  showFeaturedCar(0);
  startTimer();
}

const featuredTrack = document.querySelector("#featured-track");
if (featuredTrack) {
  renderFeaturedCars();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let carouselTimer;

  function scrollFeatured(direction) {
    const firstCard = featuredTrack.querySelector(".car-card");
    if (!firstCard) return;
    const gap = Number.parseFloat(window.getComputedStyle(featuredTrack).columnGap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    const maxScroll = featuredTrack.scrollWidth - featuredTrack.clientWidth;

    if (direction > 0 && featuredTrack.scrollLeft >= maxScroll - 8) {
      featuredTrack.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction < 0 && featuredTrack.scrollLeft <= 8) {
      featuredTrack.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    featuredTrack.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  function stopFeaturedCarousel() {
    window.clearInterval(carouselTimer);
  }

  function startFeaturedCarousel() {
    stopFeaturedCarousel();
    if (reducedMotion.matches || document.hidden) return;
    carouselTimer = window.setInterval(() => scrollFeatured(1), 3500);
  }

  document.querySelector("#featured-previous").addEventListener("click", () => {
    scrollFeatured(-1);
    startFeaturedCarousel();
  });
  document.querySelector("#featured-next").addEventListener("click", () => {
    scrollFeatured(1);
    startFeaturedCarousel();
  });
  featuredTrack.addEventListener("pointerenter", stopFeaturedCarousel);
  featuredTrack.addEventListener("pointerleave", startFeaturedCarousel);
  featuredTrack.addEventListener("focusin", stopFeaturedCarousel);
  featuredTrack.addEventListener("focusout", (event) => {
    if (!featuredTrack.contains(event.relatedTarget)) startFeaturedCarousel();
  });
  document.addEventListener("visibilitychange", startFeaturedCarousel);
  reducedMotion.addEventListener("change", startFeaturedCarousel);
  startFeaturedCarousel();
}

setupFeaturedHero();
updateSavedCount();
renderCart();
renderCars();

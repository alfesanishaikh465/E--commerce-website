const STORAGE_KEY = "products";
const CART_KEY = "cart";

/* LOGIN CREDENTIALS */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const BUYER_USERNAME = "buyer";
const BUYER_PASSWORD = "buyer123";

/* DOM */

const productsEl = document.getElementById("products");
const countEl = document.getElementById("count");

const cartCountEl = document.getElementById("cartCount");
const cartListEl = document.getElementById("cartList");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

/* SAMPLE PRODUCTS */

function sampleSVG(text){

  return `data:image/svg+xml;charset=utf-8,
  ${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
    <rect width='100%' height='100%' fill='#eef6ff'/>
    <text x='50%' y='50%' dominant-baseline='middle'
    text-anchor='middle'
    font-size='36'
    fill='#0b7ddb'>
    ${text}
    </text>
  </svg>`)}
  `;
}

function seedProducts(){

  if(!localStorage.getItem(STORAGE_KEY)){

    const products = [

      {
        id:1,
        name:"Classic Watch",
        price:49.99,
        desc:"Luxury water resistant watch",
        img:sampleSVG("Watch")
      },

      {
        id:2,
        name:"Headphones",
        price:79,
        desc:"Wireless deep bass headphones",
        img:sampleSVG("Headphones")
      },

      {
        id:3,
        name:"Backpack",
        price:59,
        desc:"Modern laptop backpack",
        img:sampleSVG("Backpack")
      }

    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  }

}

/* STORAGE */

function getProducts(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function getCart(){
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* RENDER PRODUCTS */

function renderProducts(filter=""){

  const products = getProducts().filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  productsEl.innerHTML = "";

  countEl.textContent = products.length;

  products.forEach(product => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `

      <div class="thumb"
      style="background-image:url('${product.img}')">
      </div>

      <h3>${product.name}</h3>

      <p>${product.desc}</p>

      <p class="price">$${product.price}</p>

      <div class="card-buttons">

        <button onclick="addToCart(${product.id})">
        Add To Cart
        </button>

        <button onclick="buyNow(${product.id})">
        Buy Now
        </button>

      </div>
    `;

    productsEl.appendChild(card);

  });

}

/* BUYER LOGIN */

document.getElementById("buyerLoginBtn")
.addEventListener("click", () => {

  const username =
  document.getElementById("buyerUsername").value;

  const password =
  document.getElementById("buyerPassword").value;

  if(
    username === BUYER_USERNAME &&
    password === BUYER_PASSWORD
  ){

    alert("Buyer Login Successful");

    document.getElementById("buyerLoginBox")
    .style.display = "none";

    document.getElementById("buyerWelcome")
    .style.display = "block";

  }else{
    alert("Invalid Buyer Credentials");
  }

});

document.getElementById("buyerLogoutBtn")
.addEventListener("click", () => {

  document.getElementById("buyerLoginBox")
  .style.display = "block";

  document.getElementById("buyerWelcome")
  .style.display = "none";

});

/* ADMIN LOGIN */

document.getElementById("adminLoginBtn")
.addEventListener("click", () => {

  const username =
  document.getElementById("adminUsername").value;

  const password =
  document.getElementById("adminPassword").value;

  if(
    username === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ){

    alert("Admin Login Successful");

    document.getElementById("adminLoginBox")
    .style.display = "none";

    document.getElementById("adminPanel")
    .style.display = "block";

  }else{
    alert("Invalid Admin Credentials");
  }

});

document.getElementById("adminLogoutBtn")
.addEventListener("click", () => {

  document.getElementById("adminLoginBox")
  .style.display = "block";

  document.getElementById("adminPanel")
  .style.display = "none";

});

/* ADD PRODUCT */

document.getElementById("addProduct")
.addEventListener("click", () => {

  const name =
  document.getElementById("pName").value;

  const price =
  document.getElementById("pPrice").value;

  const desc =
  document.getElementById("pDesc").value;

  const image =
  document.getElementById("pImage").files[0];

  if(!name || !price || !image){
    alert("Fill all required fields");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e){

    const products = getProducts();

    products.push({
      id:Date.now(),
      name,
      price,
      desc,
      img:e.target.result
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products)
    );

    renderProducts();

    alert("Product Added");

  };

  reader.readAsDataURL(image);

});

/* CART */

function addToCart(id){

  const product =
  getProducts().find(p => p.id === id);

  const cart = getCart();

  cart.push(product);

  saveCart(cart);

  renderCart();

}

function renderCart(){

  const cart = getCart();

  cartCountEl.textContent = cart.length;

  cartListEl.innerHTML = "";

  if(cart.length === 0){

    cartListEl.innerHTML = "<p>Cart is empty</p>";

    return;
  }

  cart.forEach((item,index) => {

    const div = document.createElement("div");

    div.innerHTML = `
      <p>
      ${item.name} - $${item.price}
      <button onclick="removeCart(${index})">
      X
      </button>
      </p>
    `;

    cartListEl.appendChild(div);

  });

}

function removeCart(index){

  const cart = getCart();

  cart.splice(index,1);

  saveCart(cart);

  renderCart();

}

/* BUY NOW */

function buyNow(id){

  const product =
  getProducts().find(p => p.id === id);

  modal.classList.add("show");

  modalBody.innerHTML = `
    <p>${product.name}</p>
    <p>Total: $${product.price}</p>
  `;

}

/* MODAL */

document.getElementById("closeModal")
.addEventListener("click", () => {

  modal.classList.remove("show");

});

document.getElementById("payNow")
.addEventListener("click", () => {

  alert("Payment Successful");

  modal.classList.remove("show");

  localStorage.removeItem(CART_KEY);

  renderCart();

});

/* SEARCH */

document.getElementById("searchBtn")
.addEventListener("click", () => {

  const q =
  document.getElementById("q").value;

  renderProducts(q);

});

/* SORT */

document.getElementById("sortPrice")
.addEventListener("click", () => {

  const products =
  getProducts().sort((a,b) => a.price - b.price);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products)
  );

  renderProducts();

});

/* RESET */

document.getElementById("clearProducts")
.addEventListener("click", () => {

  localStorage.removeItem(STORAGE_KEY);

  seedProducts();

  renderProducts();

});

/* CLEAR CART */

document.getElementById("clearCart")
.addEventListener("click", () => {

  localStorage.removeItem(CART_KEY);

  renderCart();

});

/* INIT */

seedProducts();

renderProducts();

renderCart();
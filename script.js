const bar = document.getElementById("bar");
const nav = document.querySelector(".navbar");
const close = document.getElementById("close");
let product = null;

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}
if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

// For single product
var mainImg = document.getElementById("mainImg");
var smallImg = document.getElementsByClassName("small-img");
for (let i = 0; i < smallImg.length; i++) {
  smallImg[i].onclick = function () {
    mainImg.src = smallImg[i].src;
  };
}
document.addEventListener("DOMContentLoaded", () => {
  let product = null;
  //for dynamicall add product
  fetch("products.json")
    .then((res) => res.json())
    .then((products1) => {
      const tempContainer = document.getElementById("items");
      const tempPro = document.getElementById("product");
      products1.forEach((product) => {
        const { brand, id, image, icon, price, rating, title } = product;
        const clone = tempPro.content.cloneNode(true);
        clone.querySelector("img").src = product.image[0];
        clone.querySelector("span").innerText = product.brand;
        clone.querySelector("h5").innerText = product.title;
        clone.querySelector("h4").innerText = `$${product.price}`;
        let stars = "";
        for (let i = 0; i < 5; i++) {
          if (i < product.rating) {
            stars += `<i class="ri-star-s-fill"></i>`;
          } else {
            stars += `<i class="ri-star-s-line"></i>`;
          }
        }
        clone.querySelector(".star").innerHTML = stars;
        const cart = clone.querySelector("a i");
        cart.className = product.icon + " cart";
        const cardId = clone.querySelector(".cardValue");
        cardId.setAttribute("id", `card${id}`);
        cardId.addEventListener("click", () => {
          window.location.href = `sProduct.html?id=${product.id}`;
        });
        tempContainer.appendChild(clone);
      });
    });
  // Product.html
  const useParams = new URLSearchParams(window.location.search);
  const prodId = useParams.get("id");
  fetch("products.json")
    .then((res) => res.json())
    .then((proudcts) => {
      product = proudcts.find((p) => p.id == prodId);
      if (!product) return;
      document.getElementById("mainImg").src = product;
      document.querySelector(".single-pro-details h4").innerText =
        product.title;
      document.querySelector(
        ".single-pro-details h2"
      ).innerText = `$${product.price}`;
      const mainImg = document.getElementById("mainImg");
      mainImg.src = product.image[0];
      const smalGrp = document.querySelector(".small-img-grp");
      smalGrp.innerHTML = "";
      product.image.forEach((img, i) => {
        const div = document.createElement("div");
        div.classList.add("small-img-col");
        const thumbImg = document.createElement("img");
        thumbImg.src = img;
        thumbImg.classList.add("small-img");
        thumbImg.width = 100;
        thumbImg.addEventListener("click", () => {
          document.getElementById("mainImg").src = img;
        });
        div.appendChild(thumbImg);
        smalGrp.appendChild(div);
      });
    });
  const addCart = document.getElementById("addToCart");
  if (addCart) {
    addCart.addEventListener("click", function () {
      if (!product) return;

      const cartProduct = {
        id: product.id,
        title: product.title,
        price: product.price,
        img: product.image[0],
        qty: parseInt(document.getElementById("qty").value),
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingProd = cart.find((item) => item.id == cartProduct.id);

      if (existingProd) {
        existingProd.qty += cartProduct.qty;
        existingProd.img = cartProduct.img;
      } else {
        cart.push(cartProduct);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      showToast();
    });
  }
  function showToast() {
    const toastBox = document.getElementById("toastBox");
    let toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = `Product Added <i class="ri-checkbox-circle-fill"></i>`;
    toastBox.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
  const cartItems = document.getElementById("cartItems");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartTotal = document.getElementById("cartTotal");
  if (cartItems) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    function renderCart() {
      cartItems.innerHTML = "";
      let subtotal = 0;
      cart.forEach((item, index) => {
        const row = document.createElement("tr");
        const totalItem = item.price * item.qty;
        subtotal += totalItem;
        row.innerHTML = `
        <td><button class="removeBtn" data-index="${index}">❌</button></td>
        <td><img src="${item.img}" width="80"/></td>
        <td>${item.title}</td>
        <td>$${item.price}</td>
        <td>
          <input type="number" min="1" value="${item.qty}" 
                 data-index="${index}" class="qtyInput"/>
        </td>
        <td>$${totalItem.toFixed(2)}</td>
      `;
        cartItems.appendChild(row);
      });
      if (cartSubtotal && cartTotal) {
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
      }
    }

    cartItems.addEventListener("input", (e) => {
      if (e.target.classList.contains("qtyInput")) {
        let idx = e.target.dataset.index;
        cart[idx].qty = parseInt(e.target.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    });

    cartItems.addEventListener("click", (e) => {
      if (e.target.classList.contains("removeBtn")) {
        let idx = e.target.dataset.index;
        cart.splice(idx, 1); // remove item
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    });
    renderCart();
  }
});

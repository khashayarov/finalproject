//khashayar oveisi

function ElementBuilder(name) {
    this.element = document.createElement(name),
    this.text = function(text) {
        return this.element.textContent = text,
        this
    }
    ,
    this.type = function(type) {
        return this.element.type = type,
        this
    }
    ,
    this.appendTo = function (parent) {
        if (parent instanceof ElementBuilder) {
          parent.build().appendChild(this.element);
          return this;
        } else {
          parent.appendChild(this.element);
          return this;
        }
      }

    ,
    this.placeholder = function(pl) {
        return this.element.placeholder = pl,
        this
    }
    ,
    this.hide = function() {
        return this.element.style.display = "none",
        this
    }
    ,
    this.show = function() {
        return this.element.style.display = "block",
        this
    }
    ,
    this.className = function(cn) {
        return this.element.className = cn,
        this
    }
    ,
    this.onclick = function(onc) {
        return this.element.onclick = onc,
        this
    }
    ,
    this.html = function(ht) {
        return this.element.innerHTML = ht,
        this
    }
    ,
    this.value = function(val) {
        return this.element.value = val,
        this
    }
    ,
    this.build = function() {
        return this.element
    }
    ,

    this.on = function(first, sc) {
        return this.element.addEventListener(first, sc),
        this
    }
    ,
    this.getValue = function() {
        return this.element.value
    }
    ,
    this.src = function(src) {
        return this.element.src = src,
        this
    }
    ,

    //for give me on sale items
    this.dataset = function(ds) {
        return this.element.dataset = ds,
        this
    }
}
const builder = {
    create: function (name) {
        return new ElementBuilder(name);
      }
};
////


//items , price , id , title , image
const ALL_PRODUCTS_DATA = ' {"items": [{"sys": { "id": "1" },  "fields": {  "title": "queen panel bed","price": 10.99,"image": { "fields": { "file": { "url": "./images/product-1.jpeg" } } }}},{"sys": { "id": "2" },"fields": {"title": "king panel bed","price": 12.99,"image": { "fields": { "file": { "url": "./images/product-2.jpeg" } } }}},{"sys": { "id": "3" },"fields": {"title": "single panel bed","price": 12.99,"image": { "fields": { "file": { "url": "./images/product-3.jpeg" } } }}},{"sys": { "id": "4" },"fields": {"title": "twin panel bed","price": 22.99,"image": { "fields": { "file": { "url": "./images/product-4.jpeg" } } }}},{"sys": { "id": "5" },"fields": {"title": "fridge","price": 88.99,"image": { "fields": { "file": { "url": "./images/product-5.jpeg" } } }}},{"sys": { "id": "6" },"fields": {"title": "dresser","price": 32.99,"image": { "fields": { "file": { "url": "./images/product-6.jpeg" } } }}},{"sys": { "id": "7" },"fields": {"title": "couch","price": 45.99,"image": { "fields": { "file": { "url": "./images/product-7.jpeg" } } }}},{"sys": { "id": "8" },"fields": {"title": "table","price": 33.99,"image": { "fields": { "file": { "url": "./images/product-8.jpeg" } } }}}]}';


class Product {
    constructor({id, title, price, image}) {
        this.id = id,
        this.title = title,
        this.price = price,
        this.image = image
    }
    render() {
        const art = builder
        .create("article")
        .className("product")

          , imdiv = builder
          .create("div")
          .className("img-container")
          .appendTo(art);

          builder
          .create("img")
          .className("product-img")
          .src(this.image)
          .appendTo(imdiv);

        const btn = builder
        .create("button")
        .dataset({
            id: this.id
        })
        .html('<i class="fas fa-shopping-cart">Add to cart</i>')
        .className("bag-btn")
        .appendTo(imdiv)
        .on("click", ()=>{
            cart.add(this.id)
        });

        return builder.create("i").className("fas fa-shopping-cart").appendTo(btn),
        builder.create("h3").text(this.title).appendTo(art),
        art.build()
    }
}

////all items info :)
class ProductManager {
    constructor() {
        const itm = JSON.parse(ALL_PRODUCTS_DATA);
        this.products = itm.items.map( itm =>
            new Product({
            id: itm.sys.id,
            title: itm.fields.title,
            price: itm.fields.price,
            image: itm.fields.image.fields.file.url
        }))
    }
    render() {
        const pr = document.querySelector(".products-center");
        this.products.forEach( t => {
            pr.appendChild(t.render())
        }
        )
    }
    get(pid) {
        return this.products.find( t => t.id === pid)
    }
}
const editProduct = new ProductManager;
editProduct.render();


///about items
class CartItem {
    constructor({productId, increase, decrease}) {
        this.productId = productId,
        this.quantity = 1,
        this.product = editProduct.get(productId),
        this.increase = increase,
        this.decrease = decrease
        
    }
    inc() {
        this.quantity++
    }
    dec() {
        return --this.quantity
    }
    getPrice() {
        return this.product.price * this.quantity
    }
    



    render() {
        const crt =
         builder
         .create("div")
         .className("cart-item");

        builder
        .create("img")
        .src(this.product.image)
        .appendTo(crt);

        const d =
         builder
         .create("div")
         .appendTo(crt);

        builder
        .create("h4")
        .text(this.product.title)
        .appendTo(d),

        builder
        .create("h5")
        .text(this.product.price)
        .appendTo(d),

        builder
        .create("h6")
        .text("decrease item to '0' for remove")
        .appendTo(d);


        const n =
         builder
         .create("div")
         .appendTo(crt);
         
        return builder.create("i").dataset({
            id: this.productId
        }).className("fas fa-chevron-up")
        .on("click", ()=>this.increase(this.productId))
        .appendTo(n),

        builder
        .create("p")
        .className("item-amount")
        .text(this.quantity)
        .appendTo(n),

        builder
        .create("i")
        .dataset({
            id: this.productId
        }).className("fas fa-chevron-down")
        .on("click", ()=>this.decrease(this.productId))
        .appendTo(n),

        crt.build()
    }
}


////add. dl. inc. and dec. :)
class Cart {
    constructor({carts, totalPrice, clearBtn, cartItemscount}) {
        this.open = !1,
        this.items = [],
        this.carts = carts,
        this.totalPrice = totalPrice,
        this.clearBtn = clearBtn,
        this.cartItemscount = cartItemscount
    }

    //changing 
    toggle() {
        const co = document.querySelector(".cart-overlay")
          , crrt = document.querySelector(".cart");
        if(this.open){
            (co.classList.remove("transparentBcg"),
        crrt.classList.remove("showCart"),
        this.open = !1)
        } else{(co.classList.add("transparentBcg"),
        crrt.classList.add("showCart"),
        this.open = !0)} 
    }
    add(itemm) {
        const t = this.items.find( t => t.productId === itemm);
        if(t){
            t.inc()
        }else{
            this.items.push(new CartItem({
                productId: itemm,
                increase: this.inc.bind(this),
                decrease: this.dec.bind(this)
            }))
            
        } this.render()
    }

    
    remove(itemm) {
        this.items = this.items.filter( t => t.productId !== itemm),
        this.render()
    }
    inc(itemm) {
        const t = this.items.find( t => t.productId === itemm);
        t && (t.inc(),
        this.render())
    }
    dec(itemm) {
        const t = this.items.find( t => t.productId === itemm);
        if (t) {
            0 === t.dec() && this.remove(itemm),
            this.render()
        }
    }
    clear() {
        this.items = [],
        this.toggle(),
        this.render()
    }
    render() {
        this.carts.innerHTML = "";
        let e = 0
          , t = 0;
        this.items.forEach(n=>{
            e += n.getPrice(),
            t += n.quantity,
            this.carts.appendChild(n.render())
        }
        ),
        this.totalPrice.textContent = e,
        this.cartItemscount.textContent = t
    }
}
const cart = new Cart({
    carts: document.querySelector(".carts"),
    totalPrice: document.querySelector(".totalprice"),
    clearBtn: document.querySelector(".clear-items"),
    cartItemscount: document.querySelector(".cart-items")
})
  , cartBtn = document.querySelector(".cart-btn")
  , closeBtn = document.querySelector(".close-cart")
  , clearBtn = document.querySelector(".clear-items");

clearBtn.addEventListener("click", () => cart.clear()),
cartBtn.addEventListener("click", () => cart.toggle()),
closeBtn.addEventListener("click", () => cart.toggle());

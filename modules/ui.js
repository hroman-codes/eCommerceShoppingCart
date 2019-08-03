// cart items
let cart = [];
// buttons
let buttonsDOM = [];
// display the products
class UI {
  displayProducts(products) {
    // store the result HTML
    let result = '';

    // loop through each product
    products.forEach(product => {
      // console.log('this is the product', product);
      result += `
      <!-- single product -->
      <article class="product">
        <div class="img-container">
          <img
            src=${product.imageURL}
            alt="product"
            class="product-img"
          >
          <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart"></i>
            add to cart
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      <!-- end of single product -->
      `
    })

    productsDOM.innerHTML = result;
  }
  getBagButtons(){
    const buttons = [...document.querySelectorAll('.bag-btn')]
    buttonsDOM = buttons;

    buttons.forEach(button => {
      let id =  button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      if(inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      }
      // add event listener to listen for the add to cart click
      button.addEventListener('click', event => {
        // change the text of the button to 'in cart'
        event.target.innerText = 'In Cart'
        // disable the event from triggering itself
        event.target.disabled = true;
        // get products from products
        // copy over the products and add a property with the amount 1
        const cartItem = {...Storage.getProducts(id), amount: 1};
        // console.log(cartItem);
        // add products to the cart
        // copy over the cart and add the cartitem
        cart = [...cart, cartItem];
        // save the cart in local storage
        let store = Storage.saveCart(cart);
        // method to set the cart value
        this.setCartValues(cart);
        // display cart item by calling the addCartItem
        // function and pass in cartItem as an argument
        this.addCartItem(cartItem);
        // now show the cart
        this.showCart();
      })
    })
  }
  setCartValues(cart) {
    // store the temp and items total
    let tempTotal = 0;
    let itemsTotal = 0;
    // loop through the cart and add up the amount and price
    cart.map(item => {
      // subscribe to the tempTotal and itemsTotal
      tempTotal += item.price * item.amount
      itemsTotal += item.amount
    })
    // console.log('tempTotal ==>', tempTotal)
    // console.log('itemsTotal', itemsTotal)

    // update the shopping cart icon to reflect tempTotal
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    // console.log(cartTotal, cartItems);
  }
  // function to the cart items to the DOM
  // shopping cart overlay
  addCartItem(item) {
    // console.log('this is the item object =>', item);
    // create a div
    const div = document.createElement('div')
    // add a class to the div called cart-item
    div.classList.add('cart-item')
    // set the div inner html to the shopping cart item
    // replace the item title, item price, item id, item amount
    div.innerHTML = `<img src=${item.imageURL} alt="product">
        <div>
          <h4>${item.title}</h4>
          <h5>${item.price}</h5>
          <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
          <i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`

    cartContent.appendChild(div);
    // console.log(cartContent);
  }
  showCart() {
    // add a class that triggers the tranparent background
    cartOverlay.classList.add('transparentBcg');
    // add a class to show the actual cart
    cartDOM.classList.add('showCart');
  }
  setupAPP() {
    // once the dom is loaded get the cart from the localStorage
    cart = Storage.getCart();
    // then set the cart values to be updated if we find items in local storage
    this.setCartValues(cart);
    // then populate the cart with the item to be reflected in the shopping cart
    this.populateCart(cart);
    // when you click on the cart button show the shopping cart
    cartBtn.addEventListener('click', this.showCart);
    // when you click on the close cart button then close the cart
    closeCartBtn.addEventListener('click', this.hideCart);
  }
  populateCart() {
    // for each of the cart items found add the CartItem to the shopping cart
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    // remove the transparent background
    cartOverlay.classList.remove('transparentBcg');
    // hide the cart
    cartDOM.classList.remove('showCart');
  }
  cartLogic() {
    // add an event listener that removes all items from the cart
    clearCartBtn.addEventListener('click', ()=> {
      this.clearCart();
    });
    // cart functionality, add event listener to capture
    // console.log('this: outside the cartLogic()', this);
    cartContent.addEventListener('click', event => {
      console.log('event:', event)
      // since we relied on bubbling the event, if the button clicked
      // has class named remove-item
      if(event.target.classList.contains('remove-item')) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        console.log('id:', id);
        cartContent.removeChild(removeItem.parentElement.parentElement);
        // console.log('this: inside cartLogic()', this);
        // console.log('this:', this.removeItem(id));
        this.removeItem(id)
      } else if (event.target.classList.contains('fa-chevron-up')) {
        // grab the event
        let addAmount = event.target;
        // grab the data
        let id = addAmount.dataset.id;
        // console.log('id:', id);
        // find the item that we are clicking on in the array cart with the find()
        let tempItem = cart.find(item => {
          console.log('id:', id);
          console.log('item', item);
          console.log('item.id', item.id);
          console.log(id === item.id);
          return item.id === id;
        });
        // when chevup is clicked increment the amount
        tempItem.amount = tempItem.amount + 1
        // save the new amount to the cart
        Storage.saveCart(cart);
        // update the cart values
        this.setCartValues(cart);
        // update the text to reflect the new item amount
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains('fa-chevron-down')) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        console.log(id)

        let tempItem = cart.find(item => item.id === id);
        console.log('tempItem:', tempItem);

        tempItem.amount = tempItem.amount - 1;
        // if the item amount is 0
        if(tempItem.amount > 0) {
          // update the local sotrage to save the cart
          Storage.saveCart(cart);
          // update the values in the cart
          this.setCartValues(cart);
          // update the text amount to reflect the new amount in the cart
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          // remove the item from the cart once we decrement to 0 items
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    // get all id's of the items in the cart
    let cartItems = cart.map(item => item.id);
    // console.log(cartItems);
    // once I get the ID remove all the items
    cartItems.forEach(id => this.removeItem(id));
    // remove all of items from the DOM cart when I clear the cart
    console.log('cartContent.children', cartContent.children);
    while(cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0])
    }
    // hide the cart
    this.hideCart();
  }
  removeItem(id) {
    // console.log('this is the ==>', id)
    // filter the cart if the item.id does not equal to
    // the current id being removed return it
    cart = cart.filter(item => item.id !== id);
    // update/set the cartvalues
    this.setCartValues(cart);
    // update the Storage to save the cart
    Storage.saveCart(cart)
    // store the single button we are click on

    let button = this.getSingleButton(id);
    console.log('this is the button b=>',button);
    // add the addCart button back to the items
    button.disabled = false;
    // set the button inner html back to original button
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
  }
  getSingleButton(id){
    // find the button ID that was in the cart and match it to the button dataset id
    // and match it to the id that I am passing it.
    // console.log('this is the id', id);
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

// export const displayProducts = UI.prototype.displayProducts;
// export const getBagButtons = UI.prototype.getBagButtons;
// export const setCartValues = UI.prototype.setCartValues;
// export const addCartItem = UI.prototype.addCartItem;
// export const showCart = UI.prototype.showCar;
// export const setupAPP = UI.prototype.setupAPP;
// export const populateCart = UI.prototype.populateCart;
// export const hideCart = UI.prototype.hideCart;
// export const cartLogic = UI.prototype.cartLogic;
// export const clearCart = UI.prototype.clearCart;
// export const removeItem = UI.prototype.removeItem;
// export const getSingleButton = UI.prototype.getSingleButton;

const displayProducts = UI.prototype.displayProducts;
const getBagButtons = UI.prototype.getBagButtons();
const setCartValues = UI.prototype.setCartValues;
const addCartItem = UI.prototype.addCartItem;
const showCart = UI.prototype.showCar;
const setupAPP = UI.prototype.setupAPP;
const populateCart = UI.prototype.populateCart;
const hideCart = UI.prototype.hideCart;
const cartLogic = UI.prototype.cartLogic;
const clearCart = UI.prototype.clearCart;
const removeItem = UI.prototype.removeItem;
const getSingleButton = UI.prototype.getSingleButton;

export default {
  displayProducts,
  getBagButtons,
  setCartValues,
  addCartItem,
  showCart,
  setupAPP,
  populateCart,
  hideCart,
  cartLogic,
  clearCart,
  removeItem,
  getSingleButton
}

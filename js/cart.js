const cart = function(){
    const cartBtn = document.querySelector('.button-cart');
    const cart = document.getElementById('modal-cart');
    const closeBtn = document.querySelector('.modal-close');
    const goodsContainer = document.querySelector('.long-goods-list');
    const cartTable = document.querySelector('.cart-table__goods');
    const modalForm = document.querySelector('.modal-form');
    const totalPrice = document.querySelector('.card-table__total');

    const deleteCartItem = id => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.filter( good => {
            return good.id !== id;
        });
        localStorage.setItem('cart',JSON.stringify(newCart));
        cartRender(JSON.parse(localStorage.getItem('cart')));
    };

    const plusCartItem = id => { 
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map( good => {
            if (good.id === id) {
                good.count++;
            }
            return good;
        });
        localStorage.setItem('cart',JSON.stringify(newCart));
        cartRender(JSON.parse(localStorage.getItem('cart')));
    };

    const minusCartItem = id => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map(good => {
            if (good.id === id) {
                if (good.count > 0) {
                    good.count--;
                }
            }
            return good;
        });
        localStorage.setItem('cart',JSON.stringify(newCart));
        cartRender(JSON.parse(localStorage.getItem('cart')));
    };

    const addToCart= id => {
        const goods = JSON.parse(localStorage.getItem('goods'));
        const clickedGoods=goods.find(good=>good.id===id);
        const cart = localStorage.getItem('cart') ?
        JSON.parse(localStorage.getItem('cart')) : [];

        if (cart.some(good => good.id === clickedGoods.id)) {           
            cart.map(good=>{
                if (good.id === clickedGoods.id) {
                    good.count++;  
                }
                return good;
            });
        }
        else {
            clickedGoods.count=1;
            cart.push(clickedGoods);   
        }

        localStorage.setItem('cart',JSON.stringify(cart));
    };

    const cartRender = goods => {
        cartTable.innerHTML = '';
        let price = 0;

        goods.forEach( good => {
            const tr = document.createElement('tr');
            price += +good.count * +good.price;

            tr.innerHTML = `
            <td>${good.name}</td>
            <td>${good.price}$</td>
            <td><button class="cart-btn-minus" "="">-</button></td>
            <td>${good.count}</td>
            <td><button class="cart-btn-plus" "="">+</button></td>
            <td>${good.price * good.count}$</td>
            <td><button class="cart-btn-delete" "="">x</button></td>
            `;

            cartTable.append(tr);

            tr.addEventListener('click', (event) => {
                if(event.target.classList.contains('cart-btn-minus')){
                    minusCartItem(good.id);
                }
                else if(event.target.classList.contains('cart-btn-plus')){
                    plusCartItem(good.id);
                }
                else if(event.target.classList.contains('cart-btn-delete')){
                    deleteCartItem(good.id); 
                }
            });
        });

        totalPrice.textContent = price;
    };

    const sendForm = (name, phone) => {
        const cartArray = localStorage.getItem('cart') ?
        JSON.parse(localStorage.getItem('cart')) : [];

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cartArray,
                name: name, 
                phone: phone
            })
        })
        .then( () => {
            cart.style.display = '';
            localStorage.removeItem('cart');
        });
    };

    modalForm.addEventListener('submit', event => {
        event.preventDefault();
        const placeInput = document.querySelectorAll('.modal-input');
        let phone = '', name = '';

        placeInput.forEach( input => {
            if(input.name==='nameCustomer'){
                name += input.value;
            }
            else if(input.name === 'phoneCustomer'){
                phone += input.value;
            }
        });
        if (phone === '' || name === '') {
            alert('Нобходимо заполнить форму!');
        } 
        else {
            sendForm(name, phone);
        }
    });
    
    cartBtn.addEventListener('click',()=>{
        const cartArray=localStorage.getItem('cart') ?
        JSON.parse(localStorage.getItem('cart')) : [];
        cartRender(cartArray);
        cart.style.display='flex';
    });
    
    closeBtn.addEventListener('click', ()=>{
        cart.style.display = '';
    });

    cart.addEventListener('click', event => {
        if (!event.target.closest('.modal') && event.target.classList.contains('overlay')){
            cart.style.display = '';
        }
    });

    window.addEventListener('keydown', event => {
        if ( event.key === 'Escape'){
            cart.style.display = '';
        }
    });

    if(goodsContainer){
        goodsContainer.addEventListener('click',(event)=>{
            event.preventDefault();
            if(event.target.closest('.add-to-cart')){
                const buttonToCart=event.target.closest('.add-to-cart');
                const goodId=buttonToCart.dataset.id;
                addToCart(goodId);
            }
        });
    }
};

cart();
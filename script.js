const products=[
{id:1,name:'Lamb Tee',gender:'Unisex',price:48,category:'tops',tag:'TEE',img:'assets/lamb-tee.png',desc:'Boxy fit',sizeSuggestion:'Regular size'},
{id:2,name:'I Love Jesus Tee',gender:'Unisex',price:48,category:'tops',tag:'TEE',img:'assets/i-heart-jesus-tee.png',desc:'Boxy fit',sizeSuggestion:'Regular size'},
{id:3,name:'Bible Belt Tee',gender:'Unisex',price:48,category:'tops',tag:'TEE',img:'assets/forgive-my-sins-tee.png',desc:'Boxy fit',sizeSuggestion:'Regular size'},
{id:4,name:'Redeemed Button-Up Shirt',gender:'Unisex',price:43,category:'tops',tag:'BUTTON-UP',img:'assets/redeemed-button-up.png',desc:'Boxy fit',sizeSuggestion:'Regular size'},
{id:5,name:'“What Can’t God Do?” Tee',gender:'Unisex',price:48,category:'tops',tag:'TEE',img:'assets/internet-camo-tee.png',desc:'Boxy fit',sizeSuggestion:'Regular size'},
{id:6,name:'Chosen Raglan Tee',gender:'Womens',price:43,category:'tops',tag:'RAGLAN',img:'assets/chosen-raglan.webp',desc:'Tight fitting tee',sizeSuggestion:'Regular size'},
{id:7,name:'Chosen Baby Tee',gender:'Womens',price:43,category:'tops',tag:'BABY TEE',img:'assets/chosen-black-tee.png',desc:'Boxy fit',sizeSuggestion:'Regular size'},
{id:8,name:'Dove Zip-Up Hoodie',gender:'Unisex',price:62,category:'outerwear',tag:'HOODIE',img:'assets/agnus-zip-hoodie-front.png',backImg:'assets/agnus-zip-hoodie-back.png',desc:'Boxy fit',sizeSuggestion:'Regular size, size-up for a more oversized fit'},
{id:9,name:'Vintage Agnus - Dei Long Sleeve',gender:'Unisex',price:48,category:'tops',tag:'LONG SLEEVE',img:'assets/agnus-26-long-sleeve.png',desc:'Loose fit with a thin, somewhat transparent material',sizeSuggestion:'Regular size, size-up for a more oversized fit'},
{id:10,name:'Vintage Agnus - Dei Shorts',gender:'Unisex',price:50,category:'bottoms',tag:'SHORTS',img:'assets/agnus-shorts.png',desc:'Loose fit with a thin, somewhat transparent material',sizeSuggestion:'Regular size, size-up for a more oversized fit'}
];
let cart=JSON.parse(localStorage.getItem('agnusCart')||'[]');let currentProduct=null;
const $=s=>document.querySelector(s);const money=n=>'$'+n.toFixed(2);
function renderProducts(filter='all'){const grid=$('#products');grid.innerHTML='';products.filter(p=>filter==='all'||p.category===filter).forEach(p=>{const el=document.createElement('article');el.className='product';el.innerHTML=`<button class="product-img" data-id="${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="quick">VIEW PRODUCT ↗</span></button><div class="product-meta"><span>${p.name}</span><span>${money(p.price)}</span></div>`;grid.appendChild(el)});}
function openProduct(id){currentProduct=products.find(p=>p.id===id);$('#modalImg').src=currentProduct.img;$('#modalImg').alt=currentProduct.name;$('#modalBack').hidden=!currentProduct.backImg;$('#modalBack').textContent='BACK VIEW ↔';$('#modalBack').dataset.back='0';$('#modalCategory').textContent=currentProduct.gender+' · '+currentProduct.tag;$('#modalName').textContent=currentProduct.name;$('#modalPrice').textContent=money(currentProduct.price);$('#modalDesc').innerHTML=`${currentProduct.desc}<br><strong>SIZE SUGGESTION:</strong> ${currentProduct.sizeSuggestion}`;$('#productModal').classList.add('show');$('#overlay').classList.add('show');document.body.style.overflow='hidden'}
function closeModal(){ $('#productModal').classList.remove('show'); if(!$('#cartDrawer').classList.contains('open')){$('#overlay').classList.remove('show');document.body.style.overflow=''} }
function save(){localStorage.setItem('agnusCart',JSON.stringify(cart));renderCart();}
function add(item){cart.push(item);save();closeModal();openCart()}
function renderCart(){const wrap=$('#cartItems');$('#cartCount').textContent=cart.length;wrap.innerHTML='';let total=0;if(!cart.length){wrap.innerHTML='<p style="color:#777;line-height:1.6">Your cart is empty.<br><br>Shop the collection.</p>'}cart.forEach((item,i)=>{total+=item.price;const row=document.createElement('div');row.className='cart-row';row.innerHTML=`<img src="${item.img}" alt=""><div><h4>${item.name}</h4><p>SIZE ${item.size} · ${money(item.price)}</p><button class="remove" data-index="${i}">REMOVE</button></div>`;wrap.appendChild(row)});$('#cartTotal').textContent=money(total)}
function openCart(){$('#cartDrawer').classList.add('open');$('#overlay').classList.add('show');document.body.style.overflow='hidden'}
function closeCart(){$('#cartDrawer').classList.remove('open');if(!$('#productModal').classList.contains('show')){$('#overlay').classList.remove('show');document.body.style.overflow=''}}
renderProducts();renderCart();
document.addEventListener('click',e=>{const prod=e.target.closest('[data-id]');if(prod)openProduct(+prod.dataset.id);const rem=e.target.closest('.remove');if(rem){cart.splice(+rem.dataset.index,1);save()}});
$('#modalClose').onclick=closeModal;$('#cartOpen').onclick=openCart;$('#cartClose').onclick=closeCart;$('#overlay').onclick=()=>{closeModal();closeCart()};
$('#modalBack').onclick=()=>{if(!currentProduct||!currentProduct.backImg)return;const back=$('#modalBack').dataset.back==='1';$('#modalImg').src=back?currentProduct.img:currentProduct.backImg;$('#modalBack').dataset.back=back?'0':'1';$('#modalBack').textContent=back?'BACK VIEW ↔':'FRONT VIEW ↔'};
$('#addToCart').onclick=()=>{if(currentProduct)add({...currentProduct,size:$('#modalSize').value})};
$('#checkout').onclick=async()=>{
  if(!cart.length){ alert('Your cart is empty.'); return; }
  const button=$('#checkout'); button.disabled=true; button.textContent='LOADING…';
  try{
    const response=await fetch('/api/create-checkout-session',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({items:cart.map(item=>({id:item.id,size:item.size,quantity:1}))})
    });
    const data=await response.json();
    if(!response.ok) throw new Error(data.error||'Checkout could not be started.');
    window.location.href=data.url;
  }catch(err){
    alert(err.message);
    button.disabled=false; button.innerHTML='CHECKOUT <span>↗</span>';
  }
};
$('#newsletterForm').onsubmit=e=>{e.preventDefault();$('#signupMsg').textContent='You’re on the list. Welcome to AGNUS-DEI.';e.target.reset()};

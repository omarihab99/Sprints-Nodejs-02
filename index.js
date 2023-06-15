const dotenv = require('dotenv');
dotenv.config();
const APP_ID = process.env.APP_ID;
const CURRENCY_API = `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}`;
let currenyRate;
(function(){
  fetch(CURRENCY_API)
  .then(response => response.json())
  .then(data => {
    currenyRate = data.rates.EGP;
  })
  .catch(error => {
    console.log(error);
  });
})();
const getCategories = async () => {
  try {
    const response = fetch("https://api.escuelajs.co/api/v1/categories");
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getProduct = async (ID) => {
  try {
    const response = await fetch(
      `https://api.escuelajs.co/api/v1/products/?categoryId=${ID}`
    );
    return response;
  } catch (error) {
    // console.log(error);
  }
};
const arr = [];

getCategories()
  .then(response=> response.json())
  .then(categories=> {
    const innerPromises = categories.map(category=>{
      return getProduct(category.id).then(response=> response.json()).then(products=>({
        category,
        products
      })).catch(error=> {
        // console.log(error);
      });
    });
    return Promise.allSettled(innerPromises);
  }).then(data=> {
    
    data.forEach((element)=>{
      element.value?.products.forEach(product=> {
        product.price = parseFloat((product.price * currenyRate).toFixed(2));
      });
    });
    data.forEach((element)=>{
      if(element && element.value) {console.log(element.value);}
    });    
  }).catch(error=> {
    console.log('Error',error);
  })

console.log("IMLOADED");
checkoutUrl = window.location.protocol + '//' + window.location.hostname + '/checkout?';


window.addEventListener("breezeBroadcast", (event) => {
  const eventData = event.detail;
  window.cartData = eventData.value;
});

function clickNative(){
  const checkoutButton = document.querySelector('button[type="button"][data-testid="Checkout-button"]');
  checkoutButton.click();
}

async function onProductPage(props){
  try{
    let cartItems = null;
    const decodedProps = atob(props);
    const jsonProps = JSON.parse(decodedProps);
    console.log(">>>>", "prince props2", jsonProps)
    if (jsonProps !== null){
      cartItems = [jsonProps];
    }
    console.log("cartItems",cartItems);
    if (cartItems !== null && cartItems.length > 0){
      for (let i = 0; i < cartItems.length; i++) {
        console.log(">>>> 1", cartItems[i])
        const currentItemTitle = cartItems[i].title;
        console.log(">>>> 2", currentItemTitle)
        const currentItemTitleLower = currentItemTitle.toLowerCase();
        console.log(">>>> 3: ",currentItemTitleLower,currentItemTitleLower.includes('subscription'))
        if (currentItemTitleLower.includes('subscription')) {
          console.log("redirect to native1")
          await clickNative()
          return false;
        }
      }
      // window.openBreezeCheckout();
      return true;
    }
  }catch(e){
    console.error("Breeze| Exception| onProductPage: ",e)
  }
  await clickNative()
  return false;
}

window.breeze = {
  onCheckoutButtonClick: async (props) => {
    let cartItems = null;
    try{
      if (props !== null){
        console.log(">>>> product page")
        const res = await onProductPage(props)
        return res;
      }else{
        console.log(">>>> cart page")
        const cartItems = window.cartData.items;
        console.log("cartItems",cartItems);
        for (let i = 0; i < cartItems.length; i++) {
          console.log(">>>> 1", cartItems[i])
          const currentItemTitle = cartItems[i].title;
          console.log(">>>> 2", currentItemTitle)
          const currentItemTitleLower = currentItemTitle.toLowerCase();
          console.log(">>>> 3: ",currentItemTitleLower,currentItemTitleLower.includes('subscription'))
          if (currentItemTitleLower.includes('subscription')) {
            console.log("redirect to native1")
            window.location.href = checkoutUrl;
            return false;
          }
        }
        // window.openBreezeCheckout();
        return true;
      }
    } catch(e){
      console.error("Breeze| Exception| onCart: ",e)
    }
    window.location.href = checkoutUrl;
    return false;
  }
};
const androidSafeAreaCalculator = () => {
  // const navigationBarHeight = 0; // You can adjust this to match your design
  // const screenHeight = window.screen.height;
  // const windowHeight = window.innerHeight;

  // // Calculate the safe area top
  // const safeAreaTop = Math.abs(screenHeight - windowHeight);
  // return safeAreaTop + "px";
  return "44px";
};

function nonceGenerator(length: number) {
  let nonce = "";
  const allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    nonce = nonce.concat(allowed.charAt(Math.floor(Math.random() * allowed.length)));
  }
  return nonce;
}

export { androidSafeAreaCalculator, nonceGenerator };

document.addEventListener("DOMContentLoaded", () => {
  const togglePasswordLogin = document.querySelector("#togglePasswordLogin");
  const passwordInputLogin = document.querySelector("#password-login");

  const togglePasswordRegister = document.querySelector("#togglePasswordRegister");
  const passwordInputRegister = document.querySelector("#password-register");

  if (togglePasswordLogin && passwordInputLogin) {
    togglePasswordLogin.addEventListener("click", function () {
      const type = passwordInputLogin.getAttribute("type") === "password" ? "text" : "password";
      passwordInputLogin.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  }

  if (togglePasswordRegister && passwordInputRegister) {
    togglePasswordRegister.addEventListener("click", function () {
      const type = passwordInputRegister.getAttribute("type") === "password" ? "text" : "password";
      passwordInputRegister.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  }

  const flipContainer = document.getElementById("authFlip");
  const goToRegister = document.getElementById("goToRegister");
  const goToLogin = document.getElementById("goToLogin");

  if (flipContainer && goToRegister && goToLogin) {
    goToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      flipContainer.classList.add("flipped");
    });

    goToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      flipContainer.classList.remove("flipped");
    });
  }
});

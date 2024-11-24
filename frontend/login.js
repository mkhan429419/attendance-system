document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
      email: email,
      password: password,
    };
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "none";

    fetch("../backend/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("response data", responseData);
        if (responseData.success) {
          const redirectUrl = responseData.redirect.replace("/public/", "/");
          window.location.href = "../frontend" + redirectUrl;
        } else {
          errorMessage.textContent =
            responseData.error || "Login failed, please try again.";
          errorMessage.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        errorMessage.textContent =
          "An unexpected error occurred. Please try again.";
        errorMessage.style.display = "block";
      });
  });

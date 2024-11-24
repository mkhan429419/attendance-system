document
  .getElementById("registration-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const fullname = document.getElementById("fullname").value;
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {
      document.getElementById("error-message").style.display = "block";
      return;
    }
    const data = {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      fullname: fullname,
      role: role,
    };
    fetch("../backend/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success) {
          window.location.href = "login.html";
        } else {
          document.getElementById("error-message").style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("error-message").style.display = "block";
      });
  });

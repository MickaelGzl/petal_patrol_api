document.addEventListener("DOMContentLoaded", () => {
  const openEye = document.getElementById("openEye");
  const closeEye = document.getElementById("closeEye");
  const form = document.getElementById("form");
  const resMessage = document.getElementById("res");

  closeEye.style.display = "none";

  openEye.addEventListener("click", () => {
    openEye.previousElementSibling.type = "text";
    openEye.style.display = "none";
    closeEye.style.display = "block";
  });

  closeEye.addEventListener("click", () => {
    closeEye.previousElementSibling.previousElementSibling.type = "password";
    closeEye.style.display = "none";
    openEye.style.display = "block";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { value } = openEye.previousElementSibling;
    if (value.length > 8) {
      resMessage.innerText =
        "Votre mot de passe doit faire plus de 8 caractères.";
      return;
    }
    try {
      const loc = window.location;
      const params = window.location.pathname.split("/");
      const res = await fetch(
        `${loc.protocol}//${loc.host}/api/user/reset-password/${params[3]}/${params[4]}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: value,
          }),
        }
      );
      const data = await res.json();
      resMessage.innerText = data.message;
      openEye.previousElementSibling.value = "";
    } catch (e) {
      console.error(e);
      resMessage.innerText =
        "Erreur lors de la modificaiton de votre mot de passe.";
    }
  });
});

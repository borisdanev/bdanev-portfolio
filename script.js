import { object, string } from "yup";
import isEmail from "validator/lib/isEmail";
const form = document.querySelector("form");
const inputs = form.querySelectorAll(".form-control");
const websiteLinks = document.querySelectorAll(".website-link");
const schema = object({
  firstName: string()
    .min(3, "Min lenght is 3")
    .required("Please fill this field"),
  email: string().test(
    "is-valid",
    () => "Invalid email",
    (value) => isEmail(value)
  ),
  message: string().required("Please fill this field"),
});
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = {
    firstName: inputs[0].value,
    email: inputs[1].value,
    message: inputs[2].value,
  };
  try {
    await schema.validate(data, { abortEarly: false });
    const formData = new FormData(e.target);
    await fetch(e.target.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
    inputs.forEach((input) => {
      const parent = input.parentElement;
      const errorElements = parent.querySelectorAll(".error-message");
      errorElements.forEach((el) => parent.removeChild(el));
      input.value = "";
    });
    const messageEl = form.querySelector(".success-message");
    messageEl.classList.add("active-message");
    setTimeout(() => messageEl.classList.remove("active-message"), 1000);
  } catch (err) {
    inputs.forEach((input) => {
      const parent = input.parentElement;
      const id = input.id.replace(/[-_]+(.)/g, (_, character) =>
        character.toUpperCase()
      );
      const errorElements = [...parent.querySelectorAll(".error-message")];
      const errors = [...err.inner]
        .map((item) => ({
          path: item.path,
          message: item.message,
        }))
        .filter((item) => item.path === id);
      errorElements.forEach((el) => parent.removeChild(el));
      errors.forEach((error) =>
        parent.insertAdjacentHTML(
          "beforeend",
          `<p class="text-danger error-message">${error.message}</p>`
        )
      );
    });
  }
};
form.addEventListener("submit", handleSubmit);
websiteLinks.forEach((item) =>
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const url = item.href;
    window.open(url, "_blank");
  })
);
document
  .querySelectorAll(".blurry")
  .forEach((item) => item.classList.remove("blurry"));
const intersectionCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const className = target.dataset.className;
    target.classList.remove(className);
  });
};
const observer = new IntersectionObserver(intersectionCallback, {
  root: null,
  threshold: window.innerWidth > 762 ? 0.06 : 0.1,
});
const setObserver = (className) => {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach((el) => {
    el.dataset.className = className;
    observer.observe(el);
  });
};
setObserver("slide-from-left");
setObserver("slide-from-right");
setObserver("slide-from-down");
setObserver("zoom-out");

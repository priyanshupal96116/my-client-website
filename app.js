console.log("JavaScript is working!");

document.body.insertAdjacentHTML(
  "beforeend",
  '<button id="testBtn">Click Me</button><p id="result"></p>'
);

document.getElementById("testBtn").addEventListener("click", function () {
  document.getElementById("result").textContent =
    "Success! JavaScript is working.";
});

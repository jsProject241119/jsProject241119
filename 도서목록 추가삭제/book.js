const $title = document.querySelector("#title");
const $author = document.querySelector("#author");
const $save = document.querySelector("#save");

const $bookList = document.querySelector("#bookList");

$save.addEventListener("click", function (e) {
  e.preventDefault();

  const item = document.createElement("li");
  item.innerHTML = `
  
  ${$title.value} - ${$author.value}
  <span class="delButton"> 삭제 </button>
  
  
  
  `;
  $bookList.appendChild(item);

  $title.value = "";
  $author.value = "";

  const delButtons = document.querySelectorAll(".delButton");
  for (let delButton of delButtons) {
    delButton.addEventListener("click", function(){
      this.parentNode.remove(this.parentNode);

    })
  }
});

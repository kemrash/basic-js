(() => {
  // Функция запрета кнопки Tab
  function disableKeyDownTab(event) {
    if (event.key === "Tab") {
      event.preventDefault();
    }
  }

  // Функция добавления spiner
  function $createSpiner() {
    const $findSpiner = document.querySelector(".spiner");

    if ($findSpiner) {
      return;
    }

    const $findBody = document.querySelector(".page"),
      $createDivSpiner = document.createElement("div"),
      $createImgSpiner = document.createElement("img");

    $createDivSpiner.classList.add("spiner");

    $createImgSpiner.classList.add("spiner__img");
    $createImgSpiner.src = "img/spiner.svg";
    $createImgSpiner.alt = "Загрузка";

    $createDivSpiner.append($createImgSpiner);
    $findBody.prepend($createDivSpiner);

    document.addEventListener("keydown", disableKeyDownTab);
  }

  // Функция удаления spiner
  function $deleteSpiner() {
    const $findSpiner = document.querySelector(".spiner");

    if ($findSpiner) {
      $findSpiner.remove();
      document.removeEventListener("keydown", disableKeyDownTab);
    }
  }

  $createSpiner();

  window.$createSpiner = $createSpiner;
  window.$deleteSpiner = $deleteSpiner;
})();

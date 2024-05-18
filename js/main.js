(() => {
  const SERVER_URL = "http://localhost:3000/",
    sorting = {
      id: true,
      snl: false,
      createdAt: false,
      updatedAt: false,
      active: "id",
    },
    maskOptions = {
      mask: "+{7} (000) 000-00-00",
    },
    MAX_CONTACT_INPUT_IN_PAGE = 10;

  let contactInputInPage = 0,
    shouldRefocusCloseBtn = false,
    timeInput;

  // Функция чтения списка клиентов с сервера
  async function readClientInServer() {
    let response = await fetch(SERVER_URL + "api/clients").catch(() => false),
      data;

    if (response.status === 200 || response.status === 201) {
      data = await response.json();

      for (let item of data) {
        item = normalizeData(item);
      }
    } else {
      if (!response) {
        data = {
          errors: [{ message: "Что-то пошло не так..." }],
        };
        response = {
          status: 500,
        };
      } else {
        data = await respondingToServerErrors(response);
      }
    }

    return {
      data,
      response,
    };
  }

  // Функция получение клиента по его ID
  async function readClientinServerId(id) {
    const response = await fetch(SERVER_URL + "api/clients/" + id).catch(
        () => false
      ),
      status = response.status;

    let data;

    if (response.status === 200 || response.status === 201) {
      data = await response.json();
      data = normalizeData(data);
    } else {
      data = await respondingToServerErrors(response);
    }

    return {
      data,
      response,
    };
  }

  // Функция добавления клиента на сервер
  async function onSave(clientObj) {
    const response = await fetch(SERVER_URL + "api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientObj),
      }).catch(() => false),
      data = await respondingToServerErrors(response);

    return {
      data,
      response,
    };
  }

  // Функция изминения клиента на сервере
  async function onСhange(id, clientObj) {
    const response = await fetch(SERVER_URL + "api/clients/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientObj),
      }).catch(() => false),
      data = await respondingToServerErrors(response);

    return {
      data,
      response,
    };
  }

  // Функция передачи поискового запроса на сервер
  async function searchInServer(value) {
    const response = await fetch(SERVER_URL + "api/clients?search=" + value);

    let data = await response.json();

    for (let item of data) {
      item = normalizeData(item);
    }

    return data;
  }

  // Функция удаления клиента
  async function onDelete(id) {
    const response = await fetch(SERVER_URL + "api/clients/" + id, {
        method: "DELETE",
      }).catch(() => false),
      data = await respondingToServerErrors(response);

    return {
      data,
      response,
    };
  }

  // Функция реагирования на ошибки сервера
  async function respondingToServerErrors(response) {
    let data = {},
      message;

    if (response && response.status) {
      switch (response.status) {
        case 200:
        case 201:
          break;

        case 422:
          data = await response.json();

          if (data) {
            data.errors.forEach((element) => {
              if (element.message) {
                switch (element.message) {
                  case "Не указано имя":
                  case "Не указана фамилия":
                  case "Не все добавленные контакты полностью заполнены":
                    break;

                  default:
                    message = "Что-то пошло не так...";
                    break;
                }
              } else {
                message = "Что-то пошло не так...";
              }
            });
          } else {
            message = "Что-то пошло не так...";
          }
          break;

        case 404:
          message = "Клиент не найден.";
          break;

        case 500:
          message = "Ошибка сервера, обратитесь к администратору.";
          break;

        default:
          message = "Что-то пошло не так...";
          break;
      }
    } else {
      message = "Что-то пошло не так...";
    }

    if (message) {
      data.errors = [
        {
          message: message,
        },
      ];
    }

    return data;
  }

  // Функция вывода сообщения об ошибках в теге p
  function $createErrrorsP(obj) {
    if (
      !obj.data.errors ||
      obj.response.status === 200 ||
      obj.response.status === 201
    ) {
      return;
    } else {
      let $createErrrorsP = document.querySelector(".text_errors"),
        errorsText = "Ошибки: ";

      if (!$createErrrorsP) {
        $createErrrorsP = $p();
        $createErrrorsP.classList.add("text", "text_errors");
      }

      if (obj.data.errors) {
        obj.data.errors.forEach((error) => {
          errorsText += error.message + ". ";
        });

        $createErrrorsP.textContent = errorsText;
      } else {
        $createErrrorsP.textContent = errorsText + "Что-то пошло не так...";
      }

      return $createErrrorsP;
    }
  }

  // Функция добавления в массив клиентов объекта Date и элемента snl
  function normalizeData(item) {
    item.createdAt = new Date(item.createdAt);
    item.updatedAt = new Date(item.updatedAt);

    if (item.lastName) {
      item.snl = `${item.surname} ${item.name} ${item.lastName}`;
    } else {
      item.snl = `${item.surname} ${item.name}`;
    }

    return item;
  }

  // Функция создания header
  function $createHeader() {
    const $createHeaderElement = document.createElement("header"),
      $createHeaderContainer = $createContainer(),
      $createLogo = $a(),
      $createLogoPic = document.createElement("picture"),
      $createLogoSource = document.createElement("source"),
      $createLogoImg = document.createElement("img"),
      $createHeaderLabel = $label(),
      $createHeaderSpan = $span(),
      $createHeaderInput = $input();

    $createHeaderElement.classList.add("header");
    $createHeaderElement.ariaLive = "polite";

    $createHeaderContainer.classList.add("header__container");
    $createLogo.classList.add("logo");

    $createLogoPic.classList.add("logo__pic");

    $createLogoSource.setAttribute("media", "(max-width: 726px)");
    $createLogoSource.setAttribute("srcset", "img/logo-320.svg");

    $createLogoImg.classList.add("logo__img");
    $createLogoImg.src = "img/logo.svg";
    $createLogoImg.alt = "Skillbus";

    $createHeaderLabel.classList.add("header__label");

    $createHeaderSpan.classList.add("visually-hidden");
    $createHeaderSpan.textContent = "Поиск";

    $createHeaderInput.classList.add("header__input");
    $createHeaderInput.id = "searchInput";
    $createHeaderInput.type = "search";
    $createHeaderInput.placeholder = "Введите запрос";

    $createLogoPic.append($createLogoSource, $createLogoImg);
    $createLogo.append($createLogoPic);
    $createHeaderLabel.append($createHeaderSpan, $createHeaderInput);
    $createHeaderContainer.append($createLogo, $createHeaderLabel);
    $createHeaderElement.append($createHeaderContainer);

    return $createHeaderElement;
  }

  // Функция создания container
  function $createContainer() {
    const $containerElement = $div();
    $containerElement.classList.add("container");

    return $containerElement;
  }

  //Функция создания subtitle
  function $subtitle() {
    $subtitleElement = document.createElement("h2");

    return $subtitleElement;
  }

  //Функция создания p
  function $p() {
    $pElement = document.createElement("p");

    return $pElement;
  }

  //Функция создания a
  function $a() {
    $aElement = document.createElement("a");

    return $aElement;
  }

  //Функция создания tr
  function $tr() {
    $trElement = document.createElement("tr");

    return $trElement;
  }

  //Функция создания th
  function $th() {
    $thElement = document.createElement("th");

    return $thElement;
  }

  //Функция создания td
  function $td() {
    $tdElement = document.createElement("td");

    return $tdElement;
  }

  //Функция создания label
  function $label() {
    $labelElement = document.createElement("label");

    return $labelElement;
  }

  //Функция создания input
  function $input() {
    $inputElement = document.createElement("input");

    return $inputElement;
  }

  //Функция создания span
  function $span() {
    $spanElement = document.createElement("span");

    return $spanElement;
  }

  //Функция создания button
  function $btn() {
    $btnElement = document.createElement("button");

    return $btnElement;
  }

  //Функция создания ul
  function $ul() {
    $ulElement = document.createElement("ul");

    return $ulElement;
  }

  //Функция создания li
  function $li() {
    $liElement = document.createElement("li");

    return $liElement;
  }

  //Функция создания div
  function $div() {
    $divElement = document.createElement("div");

    return $divElement;
  }

  // Функция создания svg
  function $svg() {
    const $createSvgArrow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    $createSvgArrow.classList.add("table__svg");
    $createSvgArrow.setAttributeNS(null, "viewBox", "0 0 10 10");
    $createSvgArrow.setAttributeNS(null, "width", "12");
    $createSvgArrow.setAttributeNS(null, "height", "12");

    return $createSvgArrow;
  }

  // Функция создания кнопки заголовка таблицы и обработка события нажатия на неё
  function $clickEventSortBtn(value) {
    const $sortBtn = $btn();
    $sortBtn.classList.add("btn-reset", "table__thbtn");

    switch (value) {
      case "id":
        $sortBtn.ariaLabel = "Ид сортировка";
        break;

      case "snl":
        $sortBtn.ariaLabel = "Фамилия Имя Отчество сортировка";
        break;

      case "createdAt":
        $sortBtn.ariaLabel = "Дата и время создания сортировка";
        break;

      case "updatedAt":
        $sortBtn.ariaLabel = "Последние изменения сортировка";
        break;
    }

    $sortBtn.addEventListener("click", () => {
      sorting[value] = !sorting[value];
      sorting.active = value;
      $renderTable();
    });

    return $sortBtn;
  }

  // Функция создания секции hero
  function $createHero() {
    const $createHeroElement = document.createElement("section"),
      $createHeroContainer = $createContainer(),
      $createHeroSubtitle = $subtitle(),
      $createWrapTable = $div(),
      $createTable = document.createElement("table"),
      $createThead = document.createElement("thead"),
      $createTrThead = $tr(),
      $createThId = $th(),
      $createThIdBtn = $clickEventSortBtn("id"),
      $createThIdSvg = $svg(),
      $createThSNL = $th(),
      $createThSNLSpan = $span(),
      $createThSNLBtn = $clickEventSortBtn("snl"),
      $createThSNLSvg = $svg(),
      $createThCreatedAt = $th(),
      $createThCreatedAtBtn = $clickEventSortBtn("createdAt"),
      $createThCreatedAtSvg = $svg(),
      $createThUpdatedAt = $th(),
      $createThUpdatedAtBtn = $clickEventSortBtn("updatedAt"),
      $createThUpdatedAtSvg = $svg(),
      $createThContacts = $th(),
      $createThActions = $th(),
      $createTbody = document.createElement("tbody"),
      $createBtn = $btn();

    $createHeroElement.classList.add("hero");
    $createHeroElement.ariaLive = "polite";

    $createHeroSubtitle.classList.add("title", "hero__subtitle");
    $createHeroSubtitle.textContent = "Клиенты";

    $createWrapTable.classList.add("hero__wrap");

    $createTable.classList.add("table");
    $createThead.classList.add("table__thead");
    $createTrThead.classList.add("table__tr", "table__tr_th");
    $createThId.classList.add("table__th", "table__th_id");
    $createThSNL.classList.add("table__th", "table__th_snl");
    $createThCreatedAt.classList.add("table__th", "table__th_created");
    $createThUpdatedAt.classList.add("table__th", "table__th_updated");
    $createThContacts.classList.add("table__th", "table__th_contacts");
    $createThActions.classList.add("table__th", "table__th_actions");

    $createTbody.classList.add("table__tbody");
    $createTbody.id = "tbody";

    $createThId.textContent = "ID";
    $createThId.id = "id";

    $createThIdSvg.id = "idSvg";
    $createThIdSvg.innerHTML = `
      <path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z"/>
    `;

    $createThSNL.textContent = "Фамилия Имя Отчество";
    $createThSNL.id = "snl";

    $createThSNLSvg.id = "snlSvg";
    $createThSNLSvg.innerHTML = `
      <path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z"/>
    `;

    $createThSNLSpan.classList.add("table__thspan");
    $createThSNLSpan.textContent = " А-Я";

    $createThCreatedAt.textContent = "Дата и время создания";
    $createThCreatedAt.id = "createdAt";

    $createThCreatedAtSvg.id = "createdAtSvg";
    $createThCreatedAtSvg.innerHTML = `
      <path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z"/>
    `;

    $createThUpdatedAt.textContent = "Последние изменения";
    $createThUpdatedAt.id = "updatedAt";

    $createThUpdatedAtSvg.id = "updatedAtSvg";
    $createThUpdatedAtSvg.innerHTML = `
      <path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z"/>
    `;

    $createThContacts.textContent = "Контакты";
    $createThActions.textContent = "Действия";

    $createBtn.classList.add("btn-reset", "hero__btn");
    $createBtn.innerHTML = `
    <svg width='23' height='16' viewBox='0 0 23 16' xmlns='http://www.w3.org/2000/svg'>
      <path d='M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z'/>
    </svg>
     Добавить клиента
     `;

    $createBtn.addEventListener("click", () => {
      $createBtn.after($createModalWithForm({ onSave, onClose, onDelete }));
    });

    $createThId.append($createThIdSvg, $createThIdBtn);
    $createThSNL.append($createThSNLSvg, $createThSNLSpan, $createThSNLBtn);
    $createThCreatedAt.append($createThCreatedAtSvg, $createThCreatedAtBtn);
    $createThUpdatedAt.append($createThUpdatedAtSvg, $createThUpdatedAtBtn);
    $createTrThead.append(
      $createThId,
      $createThSNL,
      $createThCreatedAt,
      $createThUpdatedAt,
      $createThContacts,
      $createThActions
    );
    $createThead.append($createTrThead);
    $createTable.append($createThead, $createTbody);
    $createWrapTable.append($createTable);
    $createHeroContainer.append(
      $createHeroSubtitle,
      $createWrapTable,
      $createBtn
    );
    $createHeroElement.append($createHeroContainer);

    return $createHeroElement;
  }

  // Функция создания и прорисовки строк таблицы
  async function $renderTable() {
    $createSpiner();
    const answerServer = await readClientInServer();
    $deleteSpiner();

    if (
      answerServer.response.status === 200 ||
      answerServer.response.status === 201
    ) {
      let clientsList = [];

      if (answerServer.data) {
        clientsList = [...$sortClientsList(answerServer.data)];

        const $tbody = document.getElementById("tbody");
        $tbody.innerHTML = "";

        if (clientsList.length > 0) {
          for (const clientObj of clientsList) {
            const $clientTr = $createClientTr(clientObj);

            $tbody.append($clientTr);
          }
        }

        tooltip();
      }
    } else {
      $createErrrorsTr(answerServer);
    }
  }

  // Функция показа в таблице информации о ошибках
  function $createErrrorsTr(answerServer) {
    const $tbody = document.getElementById("tbody");

    if ($tbody) {
      $tbody.innerHTML = "";

      let $errrorsTr = document.querySelector(".table__tr_error");

      const $errrorsTd = $td();

      if (!$errrorsTr) {
        $errrorsTr = $tr();
      }

      $errrorsTr.classList.add("table__tr", "table__tr_error");

      $errrorsTd.classList.add("text", "text_tderrors");
      $errrorsTd.setAttribute("colspan", "6");
      $errrorsTd.textContent = "Ошибки: " + answerServer.data.errors[0].message;

      const $heroBtn = document.querySelector(".hero__btn"),
        $searchInput = document.getElementById("searchInput");

      if ($heroBtn) {
        $heroBtn.setAttribute("disabled", true);
      }

      if ($searchInput) {
        $searchInput.setAttribute("disabled", true);
      }

      $errrorsTr.append($errrorsTd);
      $tbody.append($errrorsTr);
    }
  }

  // Функция отправки на сортировку и изменение визуальное таблиц при ней
  function $sortClientsList(clientsArr) {
    document.querySelectorAll(".table__th").forEach(($clientTh) => {
      const $svgArrow = document.getElementById($clientTh.id + "Svg");

      if ($clientTh.id) {
        if (sorting[$clientTh.id]) {
          $svgArrow.innerHTML = `
            <path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z"/>
          `;
        } else {
          $svgArrow.innerHTML = `
            <path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z"/>
          `;
        }
      }

      if ($clientTh.id === sorting.active) {
        $clientTh.classList.add("table__th_activ");
      } else {
        $clientTh.classList.remove("table__th_activ");
      }
    });

    sortArr(clientsArr, sorting.active, sorting[sorting.active]);

    return clientsArr;
  }

  // Функция сортировки
  function sortArr(arr, prop, dir) {
    arr.sort((a, b) => {
      if (dir) {
        if (a[prop] < b[prop]) return -1;
      } else {
        if (a[prop] > b[prop]) return -1;
      }
    });

    return arr;
  }

  // Функция к строке прибавит 0 если цифра меньше 10, вернёт строку
  function zeroFirst(string) {
    const MAX_NUMBER = 10;

    string = Number(string);
    if (string < MAX_NUMBER) {
      string = "0" + String(string);
    }

    return string;
  }

  //Функция создания time
  function $createTime(data) {
    const $createTime = document.createElement("time"),
      $createSpanDYM = $span(),
      $createSpanHM = $span(),
      createYear = data.getFullYear(),
      createMonth = zeroFirst(Number(data.getMonth()) + 1),
      createDate = zeroFirst(data.getDate()),
      createHours = zeroFirst(data.getHours()),
      createMinutes = zeroFirst(data.getMinutes());

    $createTime.classList.add("table__time");
    $createTime.dateTime = `${createYear}-${createMonth}-${createDate}T${createHours}:${createMinutes}`;

    $createSpanDYM.classList.add("table__span");
    $createSpanDYM.textContent = `${createDate}.${createMonth}.${createYear}`;

    $createSpanHM.classList.add("table__span");
    $createSpanHM.textContent = `${createHours}:${createMinutes}`;

    $createTime.append($createSpanDYM, $createSpanHM);

    return $createTime;
  }

  // Функция создания телефона в формате кодов
  function phoneNumber(number) {
    const reg = /\b(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/g;
    number = number.replace(reg, "$1 ($2) $3-$4-$5");

    return number;
  }

  // Функция создания li с button и выбора изображения контакта
  function $createContacsLi(type, value) {
    const $contactLi = $li(),
      $contactBtn = $btn();

    $contactLi.classList.add("list__item");

    $contactBtn.classList.add("btn-reset", "list__btn");

    $contactBtn.setAttribute("data-content", `**${type}**: ${value}`);

    switch (type) {
      case "Телефон":
        value = phoneNumber(value);

        $contactBtn.setAttribute("data-content", `**${type}**: ${value}`);

        $contactBtn.innerHTML = `
              <svg class="list__svg list__svg_phone" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                  <circle cx="8" cy="8" r="8" fill="#9873FF"/>
                  <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
                </g>
             </svg>
            `;
        break;

      case "Email":
        $contactBtn.innerHTML = `
              <svg class="list__svg list__svg_email" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
              </svg>
            `;
        break;

      case "Facebook":
        $contactBtn.innerHTML = `
              <svg class="list__svg list__svg_facebook" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                  <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
                </g>
              </svg>
            `;
        break;

      case "VK":
        $contactBtn.innerHTML = `
              <svg class="list__svg list__svg_vk" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                  <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
                </g>
              </svg>
            `;
        break;

      default:
        $contactBtn.innerHTML = `
              <svg class="list__svg list__svg_other" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
              </svg>
            `;
        break;
    }

    $contactBtn.ariaLabel = type;

    $contactLi.append($contactBtn);

    $contactBtn.addEventListener("focus", () => {
      const tooltip = $contactBtn.nextElementSibling;
      if (tooltip) {
        tooltipVisible(tooltip);
      }
    });

    $contactBtn.addEventListener("mouseover", () => {
      const tooltip = $contactBtn.nextElementSibling;
      if (tooltip) {
        tooltipVisible(tooltip);
      }
    });

    return $contactLi;
  }

  // Функция создания поля "Контакты"
  function $createContacts(contactsArr) {
    const $createWrap = $ul(),
      CONTACT_MAX_VISIBLE_BTN = 5,
      CONTACT_MAX_VISIBLE_BTN_IF_WRAP_BTN = CONTACT_MAX_VISIBLE_BTN - 1;

    $createWrap.classList.add("list-reset", "list");

    for (
      let i = 0;
      (i < contactsArr.length &&
        contactsArr.length <= CONTACT_MAX_VISIBLE_BTN) ||
      (i < CONTACT_MAX_VISIBLE_BTN_IF_WRAP_BTN &&
        contactsArr.length > CONTACT_MAX_VISIBLE_BTN_IF_WRAP_BTN);
      i++
    ) {
      const $itemLi = $createContacsLi(
        contactsArr[i].type,
        contactsArr[i].value
      );
      $createWrap.append($itemLi);
    }

    if (contactsArr.length > CONTACT_MAX_VISIBLE_BTN) {
      const $wrapLi = $li(),
        $wrapBtn = $btn();

      $wrapLi.classList.add("list__item");

      $wrapBtn.classList.add("btn-reset", "list__btn", "list__btn-wrap");
      $wrapBtn.textContent =
        "+" + Number(contactsArr.length - CONTACT_MAX_VISIBLE_BTN_IF_WRAP_BTN);
      $wrapBtn.ariaLabel =
        "Показать еще +" +
        Number(contactsArr.length - CONTACT_MAX_VISIBLE_BTN_IF_WRAP_BTN) +
        " контактов";

      $wrapLi.append($wrapBtn);
      $createWrap.append($wrapLi);

      for (
        let i = CONTACT_MAX_VISIBLE_BTN_IF_WRAP_BTN;
        i < contactsArr.length;
        i++
      ) {
        const $itemHiddenLi = $createContacsLi(
          contactsArr[i].type,
          contactsArr[i].value
        );

        $itemHiddenLi.style.display = "none";

        $createWrap.append($itemHiddenLi);
      }

      document.addEventListener("click", (e) => {
        const clickCreateWrap = e.composedPath().includes($createWrap),
          wrapChildren = $createWrap.getElementsByTagName("li");

        if (clickCreateWrap) {
          if (e.target === $wrapBtn) {
            $wrapLi.style.display = "none";

            for (
              let i = CONTACT_MAX_VISIBLE_BTN;
              i < wrapChildren.length;
              i++
            ) {
              wrapChildren[i].style.display = "block";
            }
          }
        }

        if (!clickCreateWrap) {
          $wrapLi.style.display = "block";

          for (let i = CONTACT_MAX_VISIBLE_BTN; i < wrapChildren.length; i++) {
            wrapChildren[i].style.display = "none";
          }
        }
      });
    }

    return $createWrap;
  }

  // Функция создания поля "Действия"
  function $createActions(id) {
    const $createWrap = $div(),
      $copyBtn = $btn(),
      $editBtn = $btn(),
      $deleteBtn = $btn();

    $createWrap.classList.add("table__wrap");

    $editBtn.classList.add(
      "btn-reset",
      "table__actionbtn",
      "table__actionbtn_edit"
    );
    $editBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7" clip-path="url(#clip0_224_718)">
          <path d="M2 11.5002V14.0002H4.5L11.8733 6.62687L9.37333 4.12687L2 11.5002ZM13.8067 4.69354C14.0667 4.43354 14.0667 4.01354 13.8067 3.75354L12.2467 2.19354C11.9867 1.93354 11.5667 1.93354 11.3067 2.19354L10.0867 3.41354L12.5867 5.91354L13.8067 4.69354Z" fill="#9873FF"/>
        </g>
        <defs>
          <clipPath id="clip0_224_718">
            <rect width="16" height="16" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      Изменить
    `;

    $deleteBtn.classList.add(
      "btn-reset",
      "table__actionbtn",
      "table__actionbtn_delete"
    );
    $deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7" clip-path="url(#clip0_224_723)">
          <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
        </g>
        <defs>
          <clipPath id="clip0_224_723">
            <rect width="16" height="16" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      Удалить
    `;

    $copyBtn.classList.add(
      "btn-reset",
      "table__actionbtn",
      "table__actionbtn_copy"
    );

    const svgPaper = `
      <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1 0 0 1 12 12)">
            <path
              style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill-rule: nonzero; opacity: 1;"
              transform=" translate(-12, -12)"
              d="M 2 2 L 2 18 L 4 18 L 4 4 L 18 4 L 18 2 L 2 2 z M 6 6 L 6 22 L 22 22 L 22 6 L 6 6 z M 8 8 L 20 8 L 20 20 L 8 20 L 8 8 z"
              stroke-linecap="round"
            />
        </g>
      </svg>
    `;

    $copyBtn.innerHTML = svgPaper + "Скопировать ссылку";

    $editBtn.addEventListener("click", async () => {
      $createSpiner();
      const editClient = await readClientinServerId(id);
      $deleteSpiner();

      if (
        editClient.response.status === 200 ||
        editClient.response.status === 201
      ) {
        $editBtn.after(
          $createModalWithForm({ onSave, onClose, onDelete }, editClient.data)
        );
      } else {
        $editBtn.after($createModalWithTextError({ onClose }, editClient));
      }
    });

    $deleteBtn.addEventListener("click", () => {
      $deleteBtn.after($createModalDeleteClient(id, { onDelete, onClose }));
    });

    $copyBtn.addEventListener("click", () => {
      const locationHref = window.location.href,
        text = locationHref + "#id=" + id;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          copyBtnsEditTextContent();

          $copyBtn.innerHTML = svgPaper + "Cсылка скопирована";
        })
        .catch(() => {
          copyBtnsEditTextContent();

          $copyBtn.innerHTML = svgPaper + "Не удается скопировать";
        });
    });

    $createWrap.append($editBtn, $deleteBtn, $copyBtn);

    return $createWrap;
  }

  // Функция ищет кнопки копирования клиента и меняет текст на стандартный
  function copyBtnsEditTextContent() {
    const svgPaper = `
      <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1 0 0 1 12 12)">
          <path
            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill-rule: nonzero; opacity: 1;"
            transform=" translate(-12, -12)"
            d="M 2 2 L 2 18 L 4 18 L 4 4 L 18 4 L 18 2 L 2 2 z M 6 6 L 6 22 L 22 22 L 22 6 L 6 6 z M 8 8 L 20 8 L 20 20 L 8 20 L 8 8 z"
            stroke-linecap="round"
          />
        </g>
      </svg>
    `;

    document.querySelectorAll(".table__actionbtn_copy").forEach((el) => {
      if (el.textContent.trim() === "Cсылка скопирована") {
        el.innerHTML = svgPaper + "Скопировать ссылку";
      }
    });
  }

  // Функция создания строки таблицы с пользователем
  function $createClientTr(clientObj) {
    const $createTrClient = $tr(),
      $createTdIdClient = $td(),
      $createTdSNLClient = $td(),
      $createTdCreatedAtClient = $td(),
      $createTimeCreatedAtClient = $createTime(clientObj.createdAt),
      $createTdUpdatedAtClient = $td(),
      $createTimeUpdatedAtClient = $createTime(clientObj.updatedAt),
      $createTdContactsClient = $td(),
      $createTdActionsClient = $td();

    $createTrClient.classList.add("table__tr", "table__tr_td");
    $createTrClient.id = clientObj.id;

    $createTdIdClient.classList.add("table__td", "table__td_id");
    $createTdIdClient.textContent = clientObj.id;

    $createTdSNLClient.classList.add("table__td", "table__td_snl");
    $createTdSNLClient.textContent = clientObj.snl;

    $createTdCreatedAtClient.classList.add("table__td");
    $createTdUpdatedAtClient.classList.add("table__td");
    $createTdContactsClient.classList.add("table__td");

    if (clientObj.contacts) {
      $createTdContactsClient.append($createContacts(clientObj.contacts));
    }

    $createTdActionsClient.classList.add("table__td");
    $createTdActionsClient.append($createActions(clientObj.id));

    $createTdCreatedAtClient.append($createTimeCreatedAtClient);
    $createTdUpdatedAtClient.append($createTimeUpdatedAtClient);
    $createTrClient.append(
      $createTdIdClient,
      $createTdSNLClient,
      $createTdCreatedAtClient,
      $createTdUpdatedAtClient,
      $createTdContactsClient,
      $createTdActionsClient
    );

    return $createTrClient;
  }

  // Функция настройки tippy (tooltip)
  function tooltip() {
    tippy("[data-content]", {
      content(reference) {
        const dataString = reference.getAttribute("data-content"),
          $type = $span(),
          dataType = dataString.replace(/(^\*\*|\*.*)/g, ""),
          dataValue = dataString.replace(/(.*?:)/i, "").trim(),
          $divTypeAndValue = $div();

        $type.classList.add("tooltip", "tooltip_type");
        $type.textContent = dataType + ": ";

        switch (dataType) {
          case "Телефон":
            const $aTel = $a();

            $aTel.classList.add("tooltip", "tooltip_value", "tooltip_phone");
            $aTel.href = "tel:" + cleaningTel(dataValue);
            $aTel.textContent = dataValue;

            $divTypeAndValue.append($type, $aTel);

            $aTel.addEventListener("blur", () => {
              tooltipHidden($aTel);
            });
            break;

          case "Email":
            const $aEmail = $a();

            $aEmail.classList.add("tooltip", "tooltip_value", "tooltip_url");
            $aEmail.href = "mailto:" + dataValue;
            $aEmail.textContent = dataValue;

            $divTypeAndValue.append($type, $aEmail);

            $aEmail.addEventListener("blur", () => {
              tooltipHidden($aEmail);
            });
            break;

          case "Facebook":
          case "VK":
            const $aUrl = $a();

            $aUrl.classList.add("tooltip", "tooltip_value", "tooltip_url");
            $aUrl.setAttribute("target", "_blank");
            $aUrl.href = dataValue;
            $aUrl.textContent = dataValue;

            $divTypeAndValue.append($type, $aUrl);

            $aUrl.addEventListener("blur", () => {
              tooltipHidden($aUrl);
            });
            break;

          default:
            const $spanValue = $span();

            $spanValue.classList.add(
              "tooltip",
              "tooltip_value",
              "tooltip_other"
            );
            $spanValue.textContent = dataValue;

            $divTypeAndValue.append($type, $spanValue);
            break;
        }

        return $divTypeAndValue;
      },
      allowHTML: true,
      interactive: true,
      delay: 100,

      popperOptions: {
        modifiers: [
          {
            name: "applyStyle",
            enabled: true,
            phase: "afterWrite",
            fn: ({ state }) => {
              state.styles.popper.opacity = 1;
            },
          },
        ],
      },
    });
  }

  // Функция скрытия tooltip
  function tooltipHidden(element) {
    const $tooltip = element.closest("[data-tippy-root]");

    $tooltip.style.opacity = "0";
    $tooltip.style.visibility = "hidden";
  }

  // Функция показа tooltip если скрыт
  function tooltipVisible(element) {
    if (getComputedStyle(element).visibility === "hidden") {
      element.style.opacity = "1";
      element.style.visibility = "visible";
    }
  }

  // Функция заготовки модального окна
  function $createModal() {
    const $createModalBox = $div(),
      $createModalContent = $div(),
      $createCloseBtn = $btn();

    $createModalBox.classList.add("modal");
    $createModalContent.classList.add("modal__content");
    $createModalBox.ariaLive = "assertive";

    $createCloseBtn.classList.add("btn-reset", "modal__closebtn");
    $createCloseBtn.ariaLabel = "Закрыть всплывающее окно";
    $createCloseBtn.innerHTML = `
      <svg width="29" height="29" viewBox="0 0 29 29" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2332 7.73333L21.2665 6.76666L14.4998 13.5334L7.73318 6.7667L6.76652 7.73336L13.5332 14.5L6.76654 21.2667L7.73321 22.2333L14.4998 15.4667L21.2665 22.2334L22.2332 21.2667L15.4665 14.5L22.2332 7.73333Z" fill="#B0B0B0"/>
      </svg>
    `;

    $createModalContent.append($createCloseBtn);
    $createModalBox.append($createModalContent);

    $createModalContent.addEventListener("click", (event) => {
      event._isClickWithInModal = true;
    });

    $createModalBox.addEventListener("click", (event) => {
      if (event._isClickWithInModal) return;
      onClose($createModalBox);
    });

    $createCloseBtn.addEventListener("click", () => {
      onClose($createModalBox);
    });

    contactInputInPage = 0;

    return {
      $createModalBox,
      $createModalContent,
      $createCloseBtn,
    };
  }

  // Функция добавления модального окна для удаления контакта
  function $createModalDeleteClient(id, { onDelete, onClose }) {
    const modal = $createModal(),
      $modalBox = modal.$createModalBox,
      $modalContent = modal.$createModalContent,
      $closeBtn = modal.$createCloseBtn,
      $createModalDeleteSubtitle = $subtitle(),
      $createModalText = $p(),
      $createDeletBtn = $btn(),
      $createCancelBtn = $btn();

    $closeBtn.ariaLabel = "Закрыть";

    $createModalDeleteSubtitle.classList.add("title", "modal__title");
    $createModalDeleteSubtitle.textContent = "Удалить клиента";

    $createModalText.classList.add("text", "modal__text");
    $createModalText.innerHTML =
      "Вы&nbsp;действительно хотите удалить данного клиента?";

    $createDeletBtn.classList.add("btn-reset", "modal__btn");
    $createDeletBtn.innerHTML = `
    Удалить
    <svg class="modal__svg" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1.00008 6.03996C1.00008 8.82344 3.2566 11.08 6.04008 11.08C8.82356 11.08 11.0801 8.82344 11.0801 6.03996C11.0801 3.25648 8.82356 0.999956 6.04008 0.999956C5.38922 0.999956 4.7672 1.1233 4.196 1.348" stroke="#B89EFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
    </svg>
    `;

    $createCancelBtn.classList.add("btn-reset", "btn", "btn_underline");
    $createCancelBtn.textContent = "Отмена";

    $modalContent.append(
      $createModalDeleteSubtitle,
      $createModalText,
      $createDeletBtn,
      $createCancelBtn
    );

    $createDeletBtn.addEventListener("click", async () => {
      $createDeletBtn.disabled = true;
      $createSpiner();

      const answerServer = await onDelete(id);

      $deleteSpiner();
      $createDeletBtn.disabled = false;

      if (
        answerServer.response.status === 200 ||
        answerServer.response.status === 201
      ) {
        $modalBox.remove();
        $renderTable();
      } else {
        const $errrorsP = $createErrrorsP(answerServer);

        if ($errrorsP) {
          const $modalP = $modalContent.querySelector(".modal__text");

          if ($modalP) {
            $modalP.classList.add("modal__text_mbnone");
          }

          $createDeletBtn.before($errrorsP);
        }
      }
    });

    $createCancelBtn.addEventListener("click", () => {
      onClose($modalBox);
    });

    return $modalBox;
  }

  // Функция добавления модального окна с формой взаимодействия с клиентом
  function $createModalWithForm({ onClose, onDelete }, clientObj = false) {
    const modal = $createModal(),
      $modalBox = modal.$createModalBox,
      $modalContent = modal.$createModalContent,
      $createModalSubtitle = $subtitle(),
      $createModalWrap = $div(),
      $createModalFieldset = document.createElement("fieldset"),
      $createModalForm = document.createElement("form"),
      $createFormWrapInput = $div(),
      $createSaveBtn = $btn(),
      $createBtnAction = $btn();

    let $createAddContactBtn = $btn();

    $modalContent.classList.add("modal__content_withForm");
    $createModalWrap.classList.add("modal__wrap");
    $createModalSubtitle.classList.add(
      "title",
      "modal__title",
      "modal__title_withForm"
    );

    $createModalSubtitle.id = "id-group-label";

    if (clientObj) {
      const $createModalSpanId = $span();

      $createModalSpanId.classList.add("text", "modal__desc");

      $createModalSubtitle.textContent = "Изменить данные";
      $createModalSpanId.textContent = "ID: " + clientObj.id;

      $createModalWrap.append($createModalSubtitle, $createModalSpanId);
    } else {
      $createModalSubtitle.textContent = "Новый клиент";

      $createModalWrap.append($createModalSubtitle);
    }

    $createModalFieldset.classList.add("fieldset-reset");
    $createModalFieldset.setAttribute("aria-labelledby", "id-group-label");

    $createModalForm.classList.add("form");
    $createModalForm.id = "form";

    $createFormWrapInput.classList.add("form__wrap");

    const SUM_INPUT_SURNAME_PLUS_NAME_PLUS_LASTNAME = 3,
      NUMBER_INPUT_SURNAME = 1,
      NUMBER_INPUT_NAME = 2,
      NUMBER_INPUT_LASTNAME = 3;

    for (let i = 1; i <= SUM_INPUT_SURNAME_PLUS_NAME_PLUS_LASTNAME; i++) {
      const $createModalLabel = $label(),
        $createLabelSpanWrap = $span(),
        $createLabelSpan = $span(),
        $createModalInput = $input();

      $createModalLabel.classList.add("form__label");
      $createLabelSpanWrap.classList.add("form__span", "form__span_wrap");
      $createLabelSpan.classList.add("form__span", "form__span_color");
      $createModalInput.classList.add("form__input");

      $createModalInput.type = "text";
      $createModalInput.setAttribute("autocomplete", "off");

      $createLabelSpan.textContent = "*";

      if (i === NUMBER_INPUT_SURNAME) {
        $createLabelSpanWrap.textContent = "Фамилия";

        $createModalInput.ariaLabel = "Фамилия обязательно к заполнению";
        $createModalInput.name = "surname";
        $createModalInput.id = "surname";

        if (clientObj.surname) {
          $createLabelSpanWrap.classList.add("focusin");

          $createModalInput.value = clientObj.surname;
        }
      }

      if (i === NUMBER_INPUT_NAME) {
        $createLabelSpanWrap.textContent = "Имя";

        $createModalInput.ariaLabel = "Имя обязательно к заполнению";
        $createModalInput.name = "name";
        $createModalInput.id = "name";

        if (clientObj.name) {
          $createLabelSpanWrap.classList.add("focusin");

          $createModalInput.value = clientObj.name;
        }
      }

      if (i === NUMBER_INPUT_LASTNAME) {
        $createLabelSpanWrap.textContent = "Отчество";

        $createModalInput.ariaLabel = "Отчество";
        $createModalInput.name = "lastname";
        $createModalInput.id = "lastname";

        $createLabelSpan.textContent = "";

        if (clientObj.lastName) {
          $createLabelSpanWrap.classList.add("focusin");

          $createModalInput.value = clientObj.lastName;
        }
      }

      $createLabelSpanWrap.append($createLabelSpan);
      $createModalLabel.append($createLabelSpanWrap, $createModalInput);
      $createFormWrapInput.append($createModalLabel);

      $createModalInput.addEventListener("focus", () => {
        $createLabelSpanWrap.classList.add("focusin");
      });

      $createModalInput.addEventListener("blur", () => {
        if (!$createModalInput.value.trim()) {
          $createLabelSpanWrap.classList.remove("focusin");
        }
      });

      $createModalInput.addEventListener("input", () => {
        if ($createModalLabel.classList.contains("error")) {
          $createModalLabel.classList.remove("error");
        }
      });
    }

    $createAddContactBtn.classList.add("btn-reset", "form__addbtn");
    $createAddContactBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_224_3502)">
          <path d="M7.99998 4.66671C7.63331 4.66671 7.33331 4.96671 7.33331 5.33337V7.33337H5.33331C4.96665 7.33337 4.66665 7.63337 4.66665 8.00004C4.66665 8.36671 4.96665 8.66671 5.33331 8.66671H7.33331V10.6667C7.33331 11.0334 7.63331 11.3334 7.99998 11.3334C8.36665 11.3334 8.66665 11.0334 8.66665 10.6667V8.66671H10.6666C11.0333 8.66671 11.3333 8.36671 11.3333 8.00004C11.3333 7.63337 11.0333 7.33337 10.6666 7.33337H8.66665V5.33337C8.66665 4.96671 8.36665 4.66671 7.99998 4.66671ZM7.99998 1.33337C4.31998 1.33337 1.33331 4.32004 1.33331 8.00004C1.33331 11.68 4.31998 14.6667 7.99998 14.6667C11.68 14.6667 14.6666 11.68 14.6666 8.00004C14.6666 4.32004 11.68 1.33337 7.99998 1.33337ZM7.99998 13.3334C5.05998 13.3334 2.66665 10.94 2.66665 8.00004C2.66665 5.06004 5.05998 2.66671 7.99998 2.66671C10.94 2.66671 13.3333 5.06004 13.3333 8.00004C13.3333 10.94 10.94 13.3334 7.99998 13.3334Z" fill="#9873FF"/>
        </g>
        <defs>
          <clipPath id="clip0_224_3502">
            <rect width="16" height="16" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      Добавить контакт
    `;

    $createSaveBtn.classList.add("btn-reset", "modal__btn", "modal__btn_form");
    $createSaveBtn.type = "submit";
    $createSaveBtn.innerHTML = `
    Сохранить
    <svg class="modal__svg" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1.00008 6.03996C1.00008 8.82344 3.2566 11.08 6.04008 11.08C8.82356 11.08 11.0801 8.82344 11.0801 6.03996C11.0801 3.25648 8.82356 0.999956 6.04008 0.999956C5.38922 0.999956 4.7672 1.1233 4.196 1.348" stroke="#B89EFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
    </svg>
    `;

    $createBtnAction.classList.add(
      "btn-reset",
      "btn",
      "btn_underline",
      "btn_center"
    );

    if (clientObj) {
      $createBtnAction.textContent = "Удалить клиента";
      $createBtnAction.addEventListener("click", async () => {
        $createSaveBtn.disabled = true;
        $createSpiner();
        const answerServer = await onDelete(clientObj.id);
        $deleteSpiner();
        $createSaveBtn.disabled = false;

        if (
          answerServer.response.status === 200 ||
          answerServer.response.status === 201
        ) {
          $modalBox.remove();
          history.pushState(null, null, "index.html");
          $renderTable();
        } else {
          const $errrorsP = $createErrrorsP(answerServer);

          if ($errrorsP) {
            const $addContactsBtn = document.querySelector(".form__addbtn");

            if ($addContactsBtn) {
              $addContactsBtn.classList.add("form__addbtn_mbnone");
            }

            $createSaveBtn.before($errrorsP);
          }
        }
      });
    } else {
      $createBtnAction.textContent = "Отмена";
      $createBtnAction.addEventListener("click", () => {
        onClose($modalBox);
      });
    }

    $createModalForm.append(
      $createFormWrapInput,
      $createAddContactBtn,
      $createSaveBtn
    );
    $createModalFieldset.append($createModalForm);
    $modalContent.append(
      $createModalWrap,
      $createModalFieldset,
      $createBtnAction
    );

    let $formUl;

    if (clientObj && clientObj.contacts.length > 0) {
      $formUl = $createFormUl($modalContent, $createAddContactBtn);

      $createAddContactBtn.before($formUl);

      clientObj.contacts.forEach((contactObj) => {
        const $contactItem = $createContactField(contactObj);

        $formUl.append($contactItem);

        contactInputInPage++;

        if (contactInputInPage >= MAX_CONTACT_INPUT_IN_PAGE) {
          $createAddContactBtn = $btnAddContactEnabled($createAddContactBtn);
        }
      });
    }

    $createAddContactBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (contactInputInPage === 0) {
        $formUl = $createFormUl($modalContent, $createAddContactBtn);

        $createAddContactBtn.before($formUl);
      }

      const $contactField = $createContactField();

      $formUl.append($contactField);

      contactInputInPage++;

      if (contactInputInPage >= MAX_CONTACT_INPUT_IN_PAGE) {
        $createAddContactBtn = $btnAddContactEnabled($createAddContactBtn);
      }
    });

    if (clientObj) {
      eventSubmit($createModalForm, clientObj.id);
    } else {
      eventSubmit($createModalForm);
    }

    return $modalBox;
  }

  // Функция добавления модального окна с текстом о ошибках
  function $createModalWithTextError({ onClose }, answerServer) {
    const modal = $createModal(),
      $modalBox = modal.$createModalBox,
      $modalContent = modal.$createModalContent,
      $createdSubtitle = $subtitle();

    $modalContent.classList.add("modal__content_bigpadding");

    $createdSubtitle.classList.add("title", "modal__title");
    $createdSubtitle.textContent = "Информация";

    const $errrorsP = $createErrrorsP(answerServer);

    if ($errrorsP) {
      $modalContent.append($createdSubtitle, $errrorsP);
      $createdSubtitle.classList.add("modal__title_mandpnone");
    }

    return $modalBox;
  }

  // Функция закрытия модального окна
  function onClose($modalElement) {
    $modalElement.remove();
    shouldRefocusCloseBtn = false;
    history.pushState(null, null, "index.html");
    $renderTable();
  }

  // Функция создания списка контактов над кнопкой в форме
  function $createFormUl($addModalContent, $addContactBtn) {
    const $createFormList = $ul();
    $createFormList.classList.add("list-reset", "form__list");

    $addContactBtn.classList.add("form__addbtn_mb");
    $addModalContent.classList.add("modal__content_pb");

    return $createFormList;
  }

  // Функция поля контакта
  function $createContactField(contactObj = false) {
    const $createContac = $li(),
      $contactItemInput = $input(),
      $createDeletLiBtn = $btn();

    let $contactItemBtn = $btn();

    $createContac.classList.add("form__item", "contact");

    $contactItemInput.classList.add("contact__input");
    $contactItemInput.name = "contact";
    $contactItemInput.setAttribute("autocomplete", "off");
    changePlaceholderInput($contactItemInput);

    $createDeletLiBtn.classList.add("btn-reset", "contact__btn");
    $createDeletLiBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
        <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
      </svg>
    `;
    $createDeletLiBtn.ariaLabel = "Удалить строку с данными контакта";
    $createDeletLiBtn.setAttribute("aria-hidden", "true");

    if (contactObj.value) {
      $contactItemInput.value = contactObj.value;

      $createDeletLiBtn.classList.add("contact__btn_open");
      $createDeletLiBtn.removeAttribute("aria-hidden", "true");
    }

    $createContac.append($contactItemBtn, $contactItemInput, $createDeletLiBtn);

    $contactItemBtn = $contactBtnAndList(
      $contactItemBtn,
      $contactItemInput,
      contactObj.type
    );

    $contactItemInput.addEventListener("input", () => {
      if ($createContac.classList.contains("error")) {
        $createContac.classList.remove("error");
      }

      const inputText = $contactItemInput.value.trim();

      let testEmptyTel = false;

      if ($contactItemInput._mask) {
        const testUnmaskedValue = String(
            $contactItemInput._mask._unmaskedValue
          ),
          testValue = String($contactItemInput._mask._value);

        if (
          (testValue === "+7 (" &&
            testUnmaskedValue === "7" &&
            inputText === "+7") ||
          (testValue === "+7" && testUnmaskedValue === "7" && inputText === "+")
        ) {
          testEmptyTel = true;
        }
      }

      if (inputText) {
        $createDeletLiBtn.classList.add("contact__btn_open");
        $createDeletLiBtn.removeAttribute("aria-hidden", "true");
      }
      if (!inputText || testEmptyTel) {
        $createDeletLiBtn.classList.remove("contact__btn_open");
        $createDeletLiBtn.setAttribute("aria-hidden", "true");
        $contactItemInput.value = "";
      }
    });

    $createDeletLiBtn.addEventListener("click", (e) => {
      e.preventDefault();
      $createContac.remove();

      if (contactInputInPage >= MAX_CONTACT_INPUT_IN_PAGE) {
        let $addBtn = document.querySelector(".form__addbtn");
        $addBtn = $btnAddContactEnabled($addBtn, true);
      }

      contactInputInPage--;

      if (contactInputInPage === 0) {
        document.querySelector(".form__list").remove();

        document
          .querySelector(".modal__content_withForm")
          .classList.remove("modal__content_pb");

        document
          .querySelector(".form__addbtn")
          .classList.remove("form__addbtn_mb");
      }
    });

    return $createContac;
  }

  // Функция фильтрации выпадающего списка
  function createFilterContactTypeArr(contactType = false) {
    const contactTypeArr = ["Телефон", "Email", "Facebook", "VK", "Другое"];

    let filterContactTypeArr;

    if (contactType) {
      filterContactTypeArr = contactTypeArr.filter(
        (type) => type !== contactType
      );
    } else {
      filterContactTypeArr = contactTypeArr.filter(
        (type) => type !== "Телефон"
      );
    }

    return filterContactTypeArr;
  }

  // Функция кнопки с выпадающим списком
  function $contactBtnAndList(
    $contactBtn,
    $contactItemInput,
    type = "Телефон"
  ) {
    const $createContactSvgArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      ),
      $contactList = $ul();

    if ($contactItemInput._mask) {
      $contactItemInput._mask.destroy();
    }

    switch (type) {
      case "Телефон":
        $contactItemInput.type = "tel";
        $contactItemInput._mask = IMask($contactItemInput, maskOptions);
        break;

      default:
        $contactItemInput.type = "text";
        break;
    }

    $contactBtn.classList.add("btn-reset", "contact__dropdown");

    $contactList.classList.add("list-reset", "contacts__list");

    $createContactSvgArrow.classList.add("contact__svg");
    $createContactSvgArrow.setAttributeNS(null, "viewBox", "0 0 12 12");
    $createContactSvgArrow.setAttributeNS(null, "width", "12");
    $createContactSvgArrow.setAttributeNS(null, "height", "12");
    $createContactSvgArrow.innerHTML = `
      <g clip-path="url(#clip0_224_4425)">
        <path d="M1.49503 3.69003C1.25003 3.93503 1.25003 4.33003 1.49503 4.57503L5.65003 8.73003C5.84503 8.92503 6.16003 8.92503 6.35503 8.73003L10.51 4.57503C10.755 4.33003 10.755 3.93503 10.51 3.69003C10.265 3.44503 9.87003 3.44503 9.62503 3.69003L6.00003 7.31003L2.37503 3.68503C2.13503 3.44503 1.73503 3.44503 1.49503 3.69003Z" fill="#9873FF"/>
      </g>
      <defs>
        <clipPath id="clip0_224_4425">
          <rect width="12" height="12" fill="white" transform="translate(0 12) rotate(-90)"/>
        </clipPath>
      </defs>
    `;

    $contactBtn.textContent = type;
    $contactBtn.append($createContactSvgArrow);

    const filterContactTypeArr = createFilterContactTypeArr(type);

    filterContactTypeArr.forEach((contactType) => {
      const $createContactItem = $li(),
        $createContactItemBtn = $btn();

      $createContactItem.classList.add("contact__item");
      $createContactItemBtn.classList.add("btn-reset", "contact__itembtn");

      $createContactItemBtn.textContent = contactType;

      $createContactItem.append($createContactItemBtn);
      $contactList.append($createContactItem);

      $createContactItemBtn.addEventListener("click", (e) => {
        e.preventDefault();

        $contactList.remove();
        $contactBtn = $contactBtnAndList(
          $contactBtn,
          $contactItemInput,
          contactType
        );
      });
    });

    $contactBtn.after($contactList);

    document.addEventListener("click", (e) => {
      const clickWithinContactItemBtn = e.composedPath().includes($contactBtn);

      if (!clickWithinContactItemBtn) {
        $contactList.classList.remove("contacts__list_open");
        $createContactSvgArrow.classList.remove("contact__svg_open");
      } else {
        e.preventDefault();

        $contactList.classList.toggle("contacts__list_open");
        $createContactSvgArrow.classList.toggle("contact__svg_open");
      }
    });

    return $contactBtn;
  }

  // Функция показа/скрытия кнопки с добавлением контакта
  function $btnAddContactEnabled($addBtn, enabled = false) {
    if (enabled) {
      $addBtn.disabled = false;
      $addBtn.removeAttribute("aria-hidden", "true");
    } else {
      $addBtn.disabled = true;
      $addBtn.setAttribute("aria-hidden", "true");
    }

    return $addBtn;
  }

  // Функция для работы с формой добавления/редактирования клиента
  function eventSubmit($form, id = false) {
    $form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameClient = $form.querySelector("#name").value.trim(),
        surnameClient = $form.querySelector("#surname").value.trim(),
        lastNameClient = $form.querySelector("#lastname").value.trim(),
        $saveBtn = $form.querySelector(".modal__btn_form");

      const newObjClientData = {
        name: strUpLower(nameClient),
        surname: strUpLower(surnameClient),
        lastName: strUpLower(lastNameClient),
      };

      let errorLog = "Ошибки: ";

      errorLog = testValidErrors(errorLog, newObjClientData.surname, "Фамилия");
      errorLog = testValidErrors(errorLog, newObjClientData.name, "Имя");
      errorLog = testValidErrors(
        errorLog,
        newObjClientData.lastName,
        "Отчество"
      );

      newObjClientData.contacts = [];

      if (contactInputInPage !== 0) {
        const formList = $form.querySelectorAll(".contact");

        formList.forEach((contact) => {
          const contactDataObj = {};

          contactDataObj.type = contact
            .querySelector(".contact__dropdown")
            .textContent.trim();

          const contactInput = contact.querySelector(".contact__input"),
            contactInputValue = contactInput.value.trim();

          if (contactInputValue) {
            if (contactDataObj.type === "Телефон") {
              if (contactInput._mask.unmaskedValue.length === 11) {
                contactDataObj.value = "+" + contactInput._mask.unmaskedValue;
              } else {
                errorLog += `Поле ${contactDataObj.type} имеет не полный номер. `;

                contact.classList.add("error");
              }
            } else if (contactDataObj.type === "Email") {
              if (!testValidEmail(contactInputValue)) {
                errorLog += `Поле Email имеет не корректный адрес. `;

                contact.classList.add("error");
              } else {
                contactDataObj.value = contactInputValue.toLowerCase();
              }
            } else if (
              (contactDataObj.type === "Facebook" ||
                contactDataObj.type === "VK") &&
              !testValidUrl(contactInputValue)
            ) {
              errorLog += `Поле ${contactDataObj.type} имеет не корректный адрес. `;

              contact.classList.add("error");
            } else {
              contactDataObj.value = contactInputValue;
            }

            newObjClientData.contacts.push(contactDataObj);
          } else {
            errorLog += `Поле ${contactDataObj.type} должно быть заполнено. `;

            contact.classList.add("error");
          }
        });
      }

      const LENGTH_OF_EMPTY_ERROR_LOG = 8;

      if (errorLog.length > LENGTH_OF_EMPTY_ERROR_LOG) {
        let $createErrrorsP = $form.querySelector(".text_errors");

        if (!$createErrrorsP) {
          $createErrrorsP = $p();
          $createErrrorsP.classList.add("text", "text_errors");

          const $addContactsBtn = $form.querySelector(".form__addbtn");
          $addContactsBtn.classList.add("form__addbtn_mbnone");
        }

        $createErrrorsP.textContent = errorLog;

        $saveBtn.before($createErrrorsP);
      } else {
        $saveBtn.disabled = true;

        let answerServer;

        $createSpiner();

        if (id) {
          answerServer = await onСhange(id, newObjClientData);
        } else {
          answerServer = await onSave(newObjClientData);
        }

        $deleteSpiner();

        $saveBtn.disabled = false;

        if (
          answerServer.response.status === 200 ||
          answerServer.response.status === 201
        ) {
          document.querySelector(".modal").remove();
          contactInputInPage = 0;
          history.pushState(null, null, "index.html");
          $renderTable();
        } else {
          const $errrorsP = $createErrrorsP(answerServer);

          if ($errrorsP) {
            const $addContactsBtn = $form.querySelector(".form__addbtn");

            if ($addContactsBtn) {
              $addContactsBtn.classList.add("form__addbtn_mbnone");
            }

            $saveBtn.before($errrorsP);
          }
        }
      }
    });
  }

  // Функция проверки валидации полей Имя, Фамилия и Отчество
  function testValidErrors(errorLog, value, testNaming) {
    const regex = /^[а-яА-ЯёЁ]+$/;

    let result, idName;

    if (testNaming !== "Отчество") {
      result = regex.test(value);

      if (!result) {
        errorLog += `Поле ${testNaming} должно быть заполнено и содержать буквы на кириллице в одно слово. `;

        if (testNaming === "Фамилия") {
          idName = "surname";
        }

        if (testNaming === "Имя") {
          idName = "name";
        }
      }
    } else {
      if (value) {
        result = regex.test(value);

        if (!result) {
          errorLog += `Поле Отчество должно быть пустым или содержать буквы на кириллице в одно слово. `;
          idName = "lastname";
        }
      }
    }

    if (idName) {
      const $childInput = document.getElementById(idName),
        $parentLabel = $childInput.parentElement;

      $parentLabel.classList.add("error");
    }

    return errorLog;
  }

  // Функция проверки валидации полей email
  function testValidEmail(value) {
    const emailRegExp =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

    return emailRegExp.test(value);
  }

  // Функция проверки валидации полей URL
  function testValidUrl(url) {
    const urlRegExp = /(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}\/.*?$/i;

    return urlRegExp.test(url);
  }

  // Функция преобразования строки к виду: первая буква заглавная, после нижний регистр.
  function strUpLower(str) {
    const beginStr = str.substring(0, 1).toUpperCase(),
      endStr = str.substring(1).toLowerCase();

    return beginStr + endStr;
  }

  // Функция очистки номера телефона
  function cleaningTel(str) {
    const regex = /[\s\(\)-]/g;

    return str.replace(regex, "");
  }

  // Функция изменения placeholder у contact__input (если такие есть) в зависимости от ширины экрана
  function changePlaceholderContactInput() {
    const $contactInputs = document.querySelectorAll(".contact__input");

    if ($contactInputs) {
      $contactInputs.forEach((input) => {
        changePlaceholderInput(input);
      });
    }
  }

  // Функция изменяния placeholder у input в зависимости от ширины экрана
  function changePlaceholderInput(input) {
    const MAX_WIDTH_PLACEHOLDER_CHANGE = 425;

    if (window.innerWidth >= MAX_WIDTH_PLACEHOLDER_CHANGE) {
      input.placeholder = "Введите данные контакта";
    } else {
      input.placeholder = "Введите данные";
    }
  }

  // Функция открытия модального окна если есть locationHash
  async function openModalHash(locationHash) {
    const regex = /^#id=[\d]+$/;

    if (regex.test(locationHash)) {
      $createSpiner();

      const id = locationHash.replace("#id=", ""),
        answerServerId = await readClientinServerId(id),
        $heroWrap = document.querySelector(".hero__wrap");

      $deleteSpiner();

      if (
        answerServerId.response.status === 200 ||
        answerServerId.response.status === 201
      ) {
        $heroWrap.before(
          $createModalWithForm(
            { onSave, onClose, onDelete },
            answerServerId.data
          )
        );
      } else {
        $heroWrap.before(
          $createModalWithTextError({ onClose }, answerServerId)
        );
      }

      shouldRefocusCloseBtn = true;
    }
  }

  // Функция отслеживания изменений в hash
  function hashChange(e) {
    const newHash = e.currentTarget.location.hash;

    if (newHash) {
      const $oldModal = document.querySelector(".modal");

      if ($oldModal) {
        $oldModal.remove();
      }

      openModalHash(newHash);
    }
  }

  // Функция возврощает фокус на кнопку закрытия модального окна если shouldRefocusCloseBtn = true
  function refocusCloseBtn(event) {
    if (event.key === "Tab" && shouldRefocusCloseBtn) {
      event.preventDefault();
      document.querySelector(".modal__closebtn").focus();
      shouldRefocusCloseBtn = false;
    }
  }

  // Функция обработки ввода в поле поиска
  function $searchInputProcessing() {
    const $searchInput = document.getElementById("searchInput");

    $searchInput.addEventListener("input", () => {
      clearTimeout(timeInput);

      timeInput = setTimeout(async () => {
        const inputValue = $searchInput.value.trim();

        if (inputValue) {
          const serverData = await searchInServer(inputValue);

          $searchAutocompleteRender($searchInput, serverData);
        } else {
          $searchAutocompleteRender($searchInput);
        }
      }, 300);
    });

    $searchInput.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();

        searchArrowUpOrDown($searchInput, "ArrowDown");
      }
    });
  }

  // Функция рендера поиска с автозаполнением
  function $searchAutocompleteRender($input, data = false) {
    let $searchList = document.querySelector(".search-list");

    if (!data || data.length === 0) {
      if ($searchList) searchListHidden($searchList);

      return;
    }

    if (!$searchList) {
      $searchList = $ul();
      $searchList.classList.add("list-reset", "search-list");

      $input.after($searchList);
    }

    $searchList.innerHTML = "";

    data.forEach((item) => {
      const $searchItem = $li(),
        $searchBtn = $btn();

      $searchItem.classList.add("search-list__item");

      $searchBtn.classList.add("btn-reset", "search-list__btn");
      $searchBtn.textContent = item.name + " " + item.surname;

      $searchItem.append($searchBtn);
      $searchList.append($searchItem);

      $searchBtn.addEventListener("click", () => {
        searchClear();
        moveToElementAndflashing(item.id);
      });

      $searchBtn.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          searchClear();
          moveToElementAndflashing(item.id);
        }
      });

      $searchBtn.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();

          searchArrowUpOrDown($searchItem, "ArrowUp");
        }
      });

      $searchBtn.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();

          searchArrowUpOrDown($searchItem, "ArrowDown");
        }
      });
    });
  }

  // Функция нажатия в поиске стрелки вверх или вниз.
  function searchArrowUpOrDown(element, direction) {
    let $nextElement;

    if (direction === "ArrowUp") {
      $nextElement = element.previousElementSibling;
    }

    if (direction === "ArrowDown") {
      $nextElement = element.nextElementSibling;
    }

    if (direction === "ArrowUp" && !$nextElement) {
      document.getElementById("searchInput").focus();

      return;
    }

    if ($nextElement) {
      const $nextSearchBtn = $nextElement.querySelector(".search-list__btn");

      if ($nextSearchBtn) {
        $nextSearchBtn.focus();
      }
    }
  }

  // Функция скрытия листа поиска.
  function searchListHidden($list) {
    const REMOVE_TIME = 450;

    $list.classList.add("search-list_hidden");

    setTimeout(() => {
      $list.remove();
    }, REMOVE_TIME);
  }

  // Функция очистки поиска и удаление списка.
  function searchClear() {
    const $searchInput = document.getElementById("searchInput"),
      $searchList = document.querySelector(".search-list");

    if ($searchInput) {
      $searchInput.value = "";
    }

    if ($searchList) {
      searchListHidden($searchList);
    }
  }

  // Функция прокрутка до нужного места в странице и выделение.
  function moveToElementAndflashing(id) {
    const $liTable = document.getElementById(id),
      FLASHING_TIME = 4500;

    $liTable.classList.add("active");
    $liTable.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      $liTable.classList.remove("active");
    }, FLASHING_TIME);
  }

  // Функция общей визуализации страницы
  async function $createPage() {
    const $body = document.body,
      $header = $createHeader(),
      $main = document.createElement("main"),
      $title = document.createElement("h1"),
      $hero = $createHero(),
      locationHash = location.hash;

    $title.classList.add("visually-hidden");
    $title.textContent = "Система управления контактными данными клиентов.";

    $main.append($title, $hero);
    $body.append($header, $main);

    await $renderTable();

    if (locationHash) {
      openModalHash(locationHash);
    }

    $searchInputProcessing();

    window.addEventListener("resize", changePlaceholderContactInput);
    window.addEventListener("hashchange", hashChange);
    document.addEventListener("keydown", refocusCloseBtn);
  }

  $createPage();
})();

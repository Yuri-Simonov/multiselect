// Переменные
const msDropdownList = document.querySelector(".ms__dropdown");
const msDropdownItems = document.querySelectorAll(".ms__dropdown-item");
const msInput = document.querySelector(".ms__input");
const msChose = document.querySelector(".ms__chose");

// Открытие дропдауна при клике по полю ввода
msChose &&
	msChose.addEventListener("click", (event) => {
		if (!event.target.closest(".ms__chose-item")) {
			msDropdownList.classList.remove("ms__dropdown_hidden");
		}
	});

// Закрытие поля ввода при клике вне него
document.addEventListener("click", (event) => {
	if (!event.target.closest(".ms")) {
		msDropdownList.classList.add("ms__dropdown_hidden");
	}
});

// Инпут в фокусе = раскрываем список
msInput &&
	msInput.addEventListener("focus", () => {
		msDropdownList.classList.remove("ms__dropdown_hidden");
	});

// Клик по элементу выпадающего списка
msDropdownList &&
	msDropdownList.addEventListener("click", (event) => {
		if (event.target.classList.contains("ms__dropdown-item_chose")) {
			searchChoseElement(event.target.textContent);
		} else if (event.target.classList.contains("ms__dropdown-item")) {
			createNewElement("li", ["ms__chose-item"], event, msChose);
			msInput.value = "";
			checkInputValue();
		}
		msInput.focus();
	});

// Создание нового html-элемента
function createNewElement(tag, styles, event, parent) {
	const newElement = document.createElement(tag);
	newElement.classList.add(...styles);
	newElement.textContent = event.target.textContent;
	parent.prepend(newElement);
	event.target.classList.toggle("ms__dropdown-item_chose");
}

// Поиск выбранного элемента из списка
function searchChoseElement(text) {
	msDropdownItems.forEach((item) => {
		if (text.toLowerCase() === item.textContent.toLowerCase()) {
			item.classList.remove("ms__dropdown-item_chose");
			deleteElement(text);
		}
	});
}

// Удаление элемента из поля ввода
function deleteElement(text) {
	const msChoseItems = document.querySelectorAll(".ms__chose-item");
	msChoseItems.forEach((item) => {
		if (text.toLowerCase() === item.textContent.toLowerCase()) {
			item.remove();
		}
	});
}

// Клик по выбранному элементу в поле ввода
document.addEventListener("click", (event) => {
	if (event.target.closest(".ms__chose-item")) {
		searchChoseElement(event.target.textContent);
	}
});

let visiblemsDropdownItems;
// Поиск элементов из выпадающего списка при вводе
msInput &&
	msInput.addEventListener("input", () => {
		checkInputValue();

		visiblemsDropdownItems = document.querySelectorAll(
			".ms__dropdown-item_visible"
		);
	});

// Проверка совпадений текста в инпуте с элементами выпадающего списка
function checkInputValue() {
	msDropdownItems.forEach((item) => {
		if (
			item.textContent
				.trim()
				.toLowerCase()
				.includes(msInput.value.trim().toLowerCase())
		) {
			item.classList.remove("ms__dropdown-item_hidden");
			item.classList.add("ms__dropdown-item_visible");
		} else {
			item.classList.add("ms__dropdown-item_hidden");
			item.classList.remove("ms__dropdown-item_visible");
		}
	});
}

// ================================
// ЕСЛИ НУЖНО УПРАВЛЕНИЕ КЛАВИАТУРЫ
// ================================

// Счетчик
let counter = -1;

// обработка событий клавиш "Вверх", "Вниз" и "Enter"
msInput &&
	msInput.addEventListener("keydown", (event) => {
		const items = msInput.value ? visiblemsDropdownItems : msDropdownItems;

		if (event.code === "ArrowUp" || event.code === "ArrowDown") {
			resetActiveClass();
			event.code === "ArrowUp" ? counter-- : counter++;
			checkCurrentCounter(items);
			items[counter].classList.add("ms__dropdown-item_current");
		}

		if (event.code === "Enter") {
			const currentDropdownItem = document.querySelector(
				".ms__dropdown-item_current"
			);
			currentDropdownItem && currentDropdownItem.click();
			// resetToInitialState();
		}
	});

// Проверка текущего значения счетчика
function checkCurrentCounter(items) {
	if (counter >= items.length) {
		counter = 0;
	}
	if (counter < 0) {
		counter = items.length - 1;
	}
	return counter;
}

// Сброс активного класса у элемента
function resetActiveClass() {
	msDropdownItems.forEach((item) => {
		item.classList.remove("ms__dropdown-item_current");
	});
}

// Сброс счетчика, если наводим мышкой
msDropdownList &&
	msDropdownList.addEventListener("mouseover", () => {
		resetToInitialState();
	});

// Возврат к первоначальному состоянию
function resetToInitialState() {
	counter = -1;
	resetActiveClass();
}

// Удаление выбранных элементов клавишами
msInput &&
	msInput.addEventListener("keydown", (event) => {
		const msChoseItems = document.querySelectorAll(".ms__chose-item");

		if (
			msInput.selectionStart === 0 &&
			event.code === "Backspace" &&
			msChoseItems.length
		) {
			msChoseItems[msChoseItems.length - 1].click();
		}
	});

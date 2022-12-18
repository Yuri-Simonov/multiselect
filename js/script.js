// Переменные
const dropdownList = document.querySelector(".multiselect__dropdown");
const dropdownItems = document.querySelectorAll(".multiselect__dropdown-item");
const multiselectInput = document.querySelector(".multiselect__input");
const multiselectChoised = document.querySelector(".multiselect__choised");

// Открытие дропдауна при клике по полю ввода
multiselectChoised &&
	multiselectChoised.addEventListener("click", (event) => {
		if (!event.target.closest(".multiselect__choised-item")) {
			dropdownList.classList.remove("multiselect__dropdown_hidden");
		}
	});

// Закрытие поля ввода при клике вне него
document.addEventListener("click", (event) => {
	if (!event.target.closest(".multiselect")) {
		dropdownList.classList.add("multiselect__dropdown_hidden");
	}
});

// Инпут в фокусе = раскрываем список
multiselectInput &&
	multiselectInput.addEventListener("focus", () => {
		dropdownList.classList.remove("multiselect__dropdown_hidden");
	});

// Клик по элементу выпадающего списка
dropdownList &&
	dropdownList.addEventListener("click", (event) => {
		if (
			event.target.classList.contains(
				"multiselect__dropdown-item_choised"
			)
		) {
			searchChoisedElement(event.target.textContent);
		} else if (
			event.target.classList.contains("multiselect__dropdown-item")
		) {
			createNewElement(
				"li",
				["multiselect__choised-item"],
				event,
				multiselectChoised
			);
			checkInputValue();
		}
		multiselectInput.focus();
	});

// Создание нового html-элемента
function createNewElement(tag, styles, event, parent) {
	const newElement = document.createElement(tag);
	newElement.classList.add(...styles);
	newElement.textContent = event.target.textContent;
	parent.prepend(newElement);
	event.target.classList.toggle("multiselect__dropdown-item_choised");
	multiselectInput.value = "";
}

// Поиск выбранного элемента из списка
function searchChoisedElement(text) {
	dropdownItems.forEach((item) => {
		if (text.toLowerCase() === item.textContent.toLowerCase()) {
			item.classList.remove("multiselect__dropdown-item_choised");
			deleteElement(text);
		}
	});
}

// Удаление элемента из поля ввода
function deleteElement(text) {
	const multiselectChoisedItems = document.querySelectorAll(
		".multiselect__choised-item"
	);
	multiselectChoisedItems.forEach((item) => {
		if (text.toLowerCase() === item.textContent.toLowerCase()) {
			item.remove();
		}
	});
}

// Клик по выбранному элементу в поле ввода
document.addEventListener("click", (event) => {
	if (event.target.closest(".multiselect__choised-item")) {
		searchChoisedElement(event.target.textContent);
	}
});

let visibleDropdownItems;
// Поиск элементов из выпадающего списка при вводе
multiselectInput &&
	multiselectInput.addEventListener("input", () => {
		dropdownList.classList.remove("multiselect__dropdown_hidden");
		checkInputValue();

		visibleDropdownItems = document.querySelectorAll(
			".multiselect__dropdown-item_visible"
		);
	});

// Проверка совпадений текста в инпуте с элементами выпадающего списка
function checkInputValue() {
	dropdownItems.forEach((item) => {
		if (
			item.textContent
				.trim()
				.toLowerCase()
				.includes(multiselectInput.value.trim().toLowerCase())
		) {
			item.classList.remove("multiselect__dropdown-item_hidden");
			item.classList.add("multiselect__dropdown-item_visible");
		} else {
			item.classList.add("multiselect__dropdown-item_hidden");
			item.classList.remove("multiselect__dropdown-item_visible");
		}
	});
}

// ================================
// ЕСЛИ НУЖНО УПРАВЛЕНИЕ КЛАВИАТУРЫ
// ================================

// Счетчик
let counter = -1;

// обработка событий клавиш "Вверх", "Вниз" и "Enter"
multiselectInput &&
	multiselectInput.addEventListener("keydown", (event) => {
		// if (event.code === "ArrowUp") {
		// 	resetActiveClass();
		// 	counter--;
		// 	checkCurrentCounter();
		// 	visibleDropdownItems[counter].classList.add(
		// 		"multiselect__dropdown-item_current"
		// 	);
		// }
		// if (event.code === "ArrowDown") {
		// 	resetActiveClass();
		// 	counter++;
		// 	checkCurrentCounter();
		// 	visibleDropdownItems[counter].classList.add(
		// 		"multiselect__dropdown-item_current"
		// 	);
		// }

		const items = multiselectInput.value
			? visibleDropdownItems
			: dropdownItems;

		if (event.code === "ArrowUp" || event.code === "ArrowDown") {
			resetActiveClass();
			event.code === "ArrowUp" ? counter-- : counter++;
			checkCurrentCounter(items);
			items[counter].classList.add("multiselect__dropdown-item_current");
		}

		if (event.code === "Enter") {
			const currentDropdownItem = document.querySelector(
				".multiselect__dropdown-item_current"
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
	dropdownItems.forEach((item) => {
		item.classList.remove("multiselect__dropdown-item_current");
	});
}

// Сброс счетчика, если наводим мышкой
dropdownList &&
	dropdownList.addEventListener("mouseover", () => {
		resetToInitialState();
	});

// Возврат к первоначальному состоянию
function resetToInitialState() {
	counter = -1;
	resetActiveClass();
}

// Удаление выбранных элементов клавишами
multiselectInput &&
	multiselectInput.addEventListener("keydown", (event) => {
		const multiselectChoisedItems = document.querySelectorAll(
			".multiselect__choised-item"
		);

		if (
			multiselectInput.selectionStart === 0 &&
			event.code === "Backspace" &&
			multiselectChoisedItems.length
		) {
			multiselectChoisedItems[multiselectChoisedItems.length - 1].click();
		}
	});

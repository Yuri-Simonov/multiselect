const msDropdownList = document.querySelector(".ms__dropdown");
const msDropdownItems = document.querySelectorAll(".ms__dropdown-item");
const msInput = document.querySelector(".ms__input");
const msChose = document.querySelector(".ms__chose");

msChose &&
	msChose.addEventListener("click", (event) => {
		if (!event.target.closest(".ms__chose-item")) {
			msDropdownList.classList.remove("ms__dropdown_hidden");
		}
	});

document.addEventListener("click", (event) => {
	if (!event.target.closest(".ms")) {
		msDropdownList.classList.add("ms__dropdown_hidden");
	}
	if (event.target.closest(".ms__chose-item")) {
		searchChoseElement(event.target.textContent);
	}
});

msInput.addEventListener("focus", (event) => {
	msDropdownList.classList.remove("ms__dropdown_hidden");
});

msDropdownList &&
	msDropdownList.addEventListener("click", (event) => {
		if (event.target.classList.contains("ms__dropdown-item_chose")) {
			searchChoseElement(event.target.textContent);
		} else if (event.target.classList.contains("ms__dropdown-item")) {
			createNewElement("li", ["ms__chose-item"], event, msChose);
		}
		msInput.value = "";
		checkInputValue();
		msInput.focus();
	});

function createNewElement(tag, styles, event, parent) {
	const newElement = document.createElement(tag);
	newElement.classList.add(...styles);
	newElement.textContent = event.target.textContent;
	parent.prepend(newElement);
	event.target.classList.add("ms__dropdown-item_chose");
}

function searchChoseElement(text) {
	msDropdownItems.forEach((item) => {
		if (text.toLowerCase() === item.textContent.toLowerCase()) {
			item.classList.remove("ms__dropdown-item_chose");
			deleteElement(text);
		}
	});
}

function deleteElement(text) {
	const msChoseItems = document.querySelectorAll(".ms__chose-item");
	msChoseItems.forEach((item) => {
		if (text.toLowerCase() === item.textContent.toLowerCase()) {
			item.remove();
		}
	});
}

let visibleDropdownItems;
msInput &&
	msInput.addEventListener("input", (event) => {
		checkInputValue();

		visibleDropdownItems = document.querySelectorAll(
			".ms__dropdown-item_visible"
		);
	});

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

let counter = -1;

msInput &&
	msInput.addEventListener("keydown", (event) => {
		const items = msInput.value ? visibleDropdownItems : msDropdownItems;

		if (event.code === "ArrowUp" || event.code === "ArrowDown") {
			event.code === "ArrowUp" ? counter-- : counter++;
			checkCurrentCounter(items);
			resetActiveClass();
			items[counter].classList.add("ms__dropdown-item_current");
		}

		if (event.code === "Enter") {
			const currentDropdownItem = document.querySelector(
				".ms__dropdown-item_current"
			);
			currentDropdownItem && currentDropdownItem.click();
			// resetToInitialState();
		}

		const msChoseItems = document.querySelectorAll(".ms__chose-item");
		if (
			msInput.selectionStart === 0 &&
			event.code === "Backspace" &&
			msChoseItems.length
		) {
			msChoseItems[msChoseItems.length - 1].click();
		}
	});

function checkCurrentCounter(items) {
	if (counter >= items.length) {
		counter = 0;
	}
	if (counter < 0) {
		counter = items.length - 1;
	}
	return counter;
}

function resetActiveClass() {
	msDropdownItems.forEach((item) => {
		item.classList.remove("ms__dropdown-item_current");
	});
}

msDropdownList &&
	msDropdownList.addEventListener("mouseover", (event) => {
		resetToInitialState();
	});

function resetToInitialState() {
	counter = -1;
	resetActiveClass();
}

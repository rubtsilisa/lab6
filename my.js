// Главная функция для обновления цены
function updatePrice() {
  console.log("--- Начало пересчета цены ---");
  
  // Получаем текущее количество из input
  let quantityInput = document.getElementById("quantity");
  let quantity = parseInt(quantityInput.value) || 1; // Если не число, используем 1
  
  // Проверяем валидность количества
  if (quantity < 1) {
    quantity = 1;
    quantityInput.value = 1;
  } else if (quantity > 100) {
    quantity = 100;
    quantityInput.value = 100;
  }
  
  console.log("Количество:", quantity);
  
  // Находим выбранный тип услуги через радиокнопки
  let prodTypeRadios = document.getElementsByName("prodType");
  let selectedType = "1"; // Значение по умолчанию
  
  // Перебираем радиокнопки чтобы найти выбранную
  prodTypeRadios.forEach(function(radio) {
    if (radio.checked) {
      selectedType = radio.value;
    }
  });
  
  console.log("Выбранный тип услуги:", selectedType);
  
  // Получаем базовые цены из функции
  let prices = getPrices();
  let basePrice = 0;
  let priceIndex = parseInt(selectedType) - 1; // Преобразуем в индекс (0,1,2)
  
  // Получаем базовую цену для выбранного типа услуги
  if (priceIndex >= 0 && priceIndex < prices.prodTypes.length) {
    basePrice = prices.prodTypes[priceIndex];
  }
  
  console.log("Базовая цена:", basePrice);
  
  // ===== УПРАВЛЕНИЕ ВИДИМОСТЬЮ ДОПОЛНИТЕЛЬНЫХ ОПЦИЙ =====
  
  // Для типа услуги 2 (Расширенная) показываем селект с опциями
  let selectDiv = document.getElementById("selectOptions");
  if (selectedType === "2") {
    selectDiv.style.display = "block";
    console.log("Показан селект опций");
  } else {
    selectDiv.style.display = "none";
    console.log("Скрыт селект опций");
  }
  
  // Для типа услуги 3 (Премиум) показываем чекбоксы со свойствами
  let checkboxDiv = document.getElementById("checkboxProperties");
  if (selectedType === "3") {
    checkboxDiv.style.display = "block";
    console.log("Показаны чекбоксы свойств");
  } else {
    checkboxDiv.style.display = "none";
    console.log("Скрыты чекбоксы свойств");
  }
  
  // ===== РАСЧЕТ ДОПОЛНИТЕЛЬНЫХ СТОИМОСТЕЙ =====
  
  let additionalPrice = 0;
  
  // Обрабатываем выбранную опцию из селекта (только для типа 2)
  if (selectedType === "2") {
    let optionSelect = document.getElementById("prodOptions");
    let selectedOption = optionSelect.value;
    let optionMultiplier = prices.prodOptions[selectedOption] || 0;
    
    // Рассчитываем дополнительную стоимость как процент от базовой
    additionalPrice += basePrice * optionMultiplier;
    console.log("Выбранная опция:", selectedOption, "Множитель:", optionMultiplier);
  }
  
  // Обрабатываем выбранные свойства из чекбоксов (только для типа 3)
  if (selectedType === "3") {
    let checkboxes = document.querySelectorAll('#checkboxProperties input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        let propertyMultiplier = prices.prodProperties[checkbox.name] || 0;
        
        // Рассчитываем дополнительную стоимость как процент от базовой
        additionalPrice += basePrice * propertyMultiplier;
        console.log("Выбранное свойство:", checkbox.name, "Множитель:", propertyMultiplier);
      }
    });
  }
  
  // ===== ФИНАЛЬНЫЙ РАСЧЕТ ЦЕНЫ =====
  
  // Итоговая цена = (базовая цена + дополнительные стоимости) × количество
  let totalPrice = (basePrice + additionalPrice) * quantity;
  
  console.log("Дополнительная стоимость:", additionalPrice);
  console.log("Итоговая цена:", totalPrice);
  console.log("--- Конец пересчета цены ---\n");
  
  // Обновляем отображение цены на странице
  let prodPriceElement = document.getElementById("prodPrice");
  prodPriceElement.innerHTML = Math.round(totalPrice) + " рублей";
  
  // Добавляем детализацию расчета для пользователя
  let detailText = ` (${quantity} × ${Math.round(basePrice + additionalPrice)} руб.)`;
  prodPriceElement.innerHTML += `<small>${detailText}</small>`;
}

/**
 * Функция возвращает объект с ценами и множителями
 * 
 * Структура объекта:
 * - prodTypes: массив базовых цен для каждого типа услуги
 * - prodOptions: объект с множителями для опций (в долях от 1)
 * - prodProperties: объект с множителями для свойств (в долях от 1)
 */
function getPrices() {
  return {
    // Базовые цены для трех типов услуг
    prodTypes: [1000, 2000, 3000],
    
    // Множители для опций (в долях от 1: 0.1 = +10%, 0.15 = +15%)
    prodOptions: {
      option1: 0,      // Стандартная опция - без доплаты
      option2: 0.1,    // Расширенная опция - +10%
      option3: 0.15    // Профессиональная опция - +15%
    },
    
    // Множители для свойств (в долях от 1)
    prodProperties: {
      prop1: 0.05,     // Приоритетное обслуживание - +5%
      prop2: 0.1       // Срочное выполнение - +10%
    }
  };
}

/**
 * ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
 * 
 * Этот код выполняется когда вся DOM-структура страницы загружена
 */
window.addEventListener('DOMContentLoaded', function (event) {
  console.log("Страница загружена, инициализация калькулятора...");
  
  // ===== НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ =====
  
  // Обработчик изменения количества
  let quantityInput = document.getElementById("quantity");
  quantityInput.addEventListener("input", function(event) {
    console.log("Изменено количество:", event.target.value);
    updatePrice();
  });
  
  // Обработчики для радиокнопок типа услуги
  let prodTypeRadios = document.getElementsByName("prodType");
  prodTypeRadios.forEach(function(radio) {
    radio.addEventListener("change", function(event) {
      console.log("Изменен тип услуги:", event.target.value);
      updatePrice();
    });
  });
  
  // Обработчик для селекта опций
  let optionSelect = document.getElementById("prodOptions");
  optionSelect.addEventListener("change", function(event) {
    console.log("Изменена опция:", event.target.value);
    updatePrice();
  });
  
  // Обработчики для чекбоксов свойств
  let checkboxes = document.querySelectorAll('#checkboxProperties input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", function(event) {
      console.log("Изменен чекбокс:", event.target.name, "Состояние:", event.target.checked);
      updatePrice();
    });
  });
  
  // Первоначальный расчет цены
  updatePrice();
  
  console.log("Калькулятор инициализирован успешно!");
});

/**
 * ДОПОЛНИТЕЛЬНАЯ ФУНКЦИОНАЛЬНОСТЬ ДЛЯ ВАЛИДАЦИИ
 */

// Функция для валидации ввода количества
function validateQuantity(input) {
  let value = parseInt(input.value);
  if (isNaN(value) || value < 1) {
    input.value = 1;
  } else if (value > 100) {
    input.value = 100;
  }
}

// Экспорт функций для тестирования (если нужно)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { updatePrice, getPrices, validateQuantity };

}

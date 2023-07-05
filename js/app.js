/**
 * @see https://cdnjs.com/libraries/dayjs
 * @see https://day.js.org/docs/en/i18n/i18n
 */
dayjs.locale("de");

const assets = {
  male: ["male_01.d6f82abd.png", "male_02.51a94a2c.png", "male_03.63f61f4c.png", "male_04.142854cb.png", "male_05.201f1c4d.png"],
  female: ["female_01.b6fe98a3.png", "female_02.d9500124.png", "female_03.bf7dda16.png", "female_04.0c5032a6.png", "female_05.0ff2f17d.png"],
};

const bmis = ["15-17%", "17-25%", "25-30%", "30-35%", "35-40%"];

const values = {
  gender: "",
  /**
   * Currently, there are only 5 body types,
   * we take the middle one as default.
   */
  bodyType: 2,
  age: 0,
  height: 0,
  targetWeight: 0,
  currentWeight: 0,
  estimatedDays: 0,
  currentDate: null,
  targetDate: null,
};

const DOMElements = {
  maleBtn: document.querySelector(".btn-male"),
  femaleBtn: document.querySelector(".btn-female"),
  heroSection: document.querySelector("#hero"),
  mainSection: document.querySelector("#main"),
  sliderSection: document.querySelector("#slider"),
  sliderImage: document.querySelector("#slider-image"),
  sliderRange: document.querySelector("#range"),
  sliderSubmitBtn: document.querySelector("#slider-submit-btn"),
  loader: document.querySelector("#loader"),
  loaderCounter: document.querySelector("#loader-counter"),
  swipeHandMale: document.querySelector(".body__swipe--hand--male"),
  bodyArrowBtnMale: document.querySelector(".body__arrow--box-male"),
  currentWeightTspanSvg: document.querySelector("#current-weight-tspan-svg"),
  targetWeightTspanSvg: document.querySelector("#target-weight-tspan-svg"),
  estimateDaysTspan: document.querySelector("#estimate-days-tspan"),
  bodyUpdateTextToSpan: document.querySelector(".body__update--text-to span"),

  form: {
    section: document.querySelector("#form"),
    element: document.querySelector("#form-element"),
    currentWeight: document.querySelector("#current-weight"),
    targetWeight: document.querySelector("#target-weight"),
    height: document.querySelector("#height"),
    age: document.querySelector("#age"),
    currentWeightError: document.querySelector("#current-weight-error"),
    targetWeightError: document.querySelector("#target-weight-error"),
    heightError: document.querySelector("#height-error"),
    ageError: document.querySelector("#age-error"),
  },
  result: {
    section: document.querySelector("#result"),
    targetWeight: document.querySelector("#target-weight-span"),
    currentDate: document.querySelector("#current-date-span"),
    targetDate: document.querySelector("#target-date-span"),
    currentImage: document.querySelector("#current-image"),
    targetImage: document.querySelector("#target-image"),
    estimatedDays: document.querySelector("#estimated-days"),
    currentDateInChart: document.querySelector("#current-date-in-chart"),
    targetDateInChart: document.querySelector("#target-date-in-chart"),
    bmi: document.querySelector("#bmi"),
  },
};

const DOMHelpers = {
  hideHeroSection: function () {
    DOMElements.heroSection.style.display = "none";
  },
  hideMainSection: function () {
    DOMElements.mainSection.style.display = "none";
  },
  initSliderSection: function () {
    const gender = values.gender;
    const bodyType = values.bodyType;

    const images = assets[gender];

    DOMElements.sliderImage.setAttribute("src", `./media/${images[bodyType]}`);
    DOMElements.sliderSection.style.display = "block";
  },
  hideSliderSection: function () {
    DOMElements.sliderSection.style.display = "none";
  },
  showFormSection: function () {
    DOMElements.form.section.style.display = "block";
  },
  hideFormSection: function () {
    DOMElements.form.section.style.display = "none";
  },
  initResultSection: function () {
    DOMElements.result.section.style.display = "block";

    const images = assets[values.gender];

    DOMElements.result.targetImage.setAttribute("src", `./media/${images[0]}`);
    DOMElements.result.currentImage.setAttribute("src", `./media/${images[values.bodyType]}`);

    DOMElements.result.bmi.textContent = bmis[values.bodyType];
    DOMElements.result.targetWeight.textContent = values.targetWeight;
    DOMElements.result.estimatedDays.textContent = values.estimatedDays;
    DOMElements.targetWeightTspanSvg.textContent = values.targetWeight;
    DOMElements.currentWeightTspanSvg.textContent = values.currentWeight;

    /**
     * @see https://day.js.org/docs/en/parse/string-format
     */
    DOMElements.result.currentDate.textContent = values.currentDate.format("DD MMMM");
    DOMElements.result.targetDate.textContent = values.targetDate.format("DD MMMM");

    DOMElements.result.targetDateInChart.textContent = values.targetDate.format("DD MMMM YYYY");
    DOMElements.result.currentDateInChart.textContent = values.currentDate.format("DD MMMM YYYY");
  },
  showLoader: function () {
    DOMElements.loader.style.display = "block";
  },
  hideLoader: function () {
    DOMElements.loader.style.display = "none";
  },

  hideSwipeHandMale: function () {
    DOMElements.swipeHandMale.style.display = "none";
  },

  moveBackTo: function () {
    DOMElements.form.section.style.display = "none";
  },

  moveBackToSlider: function () {
    DOMElements.sliderSection.style.display = "block";
  },
};

/**
 * Form init (main) section.
 */
DOMElements.maleBtn.addEventListener("click", function () {
  values.gender = "male";

  DOMHelpers.hideHeroSection();
  DOMHelpers.hideMainSection();
  DOMHelpers.initSliderSection();
});

DOMElements.bodyArrowBtnMale.addEventListener("click", function () {
  DOMHelpers.moveBackTo();
  DOMHelpers.moveBackToSlider();
});

DOMElements.femaleBtn.addEventListener("click", function () {
  values.gender = "female";

  DOMHelpers.hideHeroSection();
  DOMHelpers.hideMainSection();
  DOMHelpers.initSliderSection();
});

/**
 * Slider section.
 */
DOMElements.sliderRange.addEventListener("input", function () {
  values.bodyType = this.value;
  const images = assets[values.gender];
  DOMElements.sliderImage.setAttribute("src", `./media/${images[values.bodyType]}`);
  DOMHelpers.hideSwipeHandMale();
});

/**
 * Form section.
 */
DOMElements.sliderSubmitBtn.addEventListener("click", function () {
  DOMHelpers.hideSliderSection();
  DOMHelpers.showFormSection();
});

DOMElements.form.element.addEventListener("submit", function (event) {
  event.preventDefault();

  let hasErrors = false;

  values.age = DOMElements.form.age.value;
  values.height = DOMElements.form.height.value;
  values.targetWeight = DOMElements.form.targetWeight.value;
  values.currentWeight = DOMElements.form.currentWeight.value;

  if (!values.age) {
    hasErrors = true;
    DOMElements.form.ageError.style.display = "block";
  } else {
    DOMElements.form.ageError.style.display = "none";
  }

  if (!values.height || values.height <= 0) {
    hasErrors = true;
    DOMElements.form.heightError.style.display = "block";
  } else {
    DOMElements.form.heightError.style.display = "none";
  }

  if (!values.targetWeight || values.targetWeight <= 0) {
    hasErrors = true;
    DOMElements.form.targetWeightError.style.display = "block";
  } else {
    DOMElements.form.targetWeightError.style.display = "none";
  }

  if (!values.currentWeight || values.currentWeight <= 0) {
    hasErrors = true;
    DOMElements.form.currentWeightError.style.display = "block";
  } else {
    DOMElements.form.currentWeightError.style.display = "none";
  }

  if (!hasErrors) {
    // estimatedDays code goes here
    const estimatedDays = daysToLoseWeight(values.currentWeight, values.targetWeight, values.height, values.age, values.gender);

    /**
     * @see https://day.js.org/docs/en/manipulate/add
     */
    values.currentDate = dayjs();
    values.targetDate = values.currentDate.add(estimatedDays, "day"); // replace 40 with "estimatedDays" variable
    values.estimatedDays = estimatedDays;
    DOMElements.estimateDaysTspan.textContent = estimatedDays;
    DOMElements.bodyUpdateTextToSpan.textContent = estimatedDays;

    DOMHelpers.showLoader();
    DOMHelpers.hideFormSection();

    animateCounter();

    setTimeout(() => {
      DOMHelpers.hideLoader();
      DOMHelpers.initResultSection();
    }, 1000);
  }
});

/**
 * Helper methods.
 */
function animateCounter() {
  let animationLoaderCounter = 0;

  const intervalRef = setInterval(function () {
    animationLoaderCounter += 1;

    if (animationLoaderCounter >= 90) {
      clearInterval(intervalRef);
    }

    DOMElements.loaderCounter.textContent = `${animationLoaderCounter}%`;
  }, 9);
}

function daysToLoseWeight(_currentWeight, _targetWeight, _height, _age, _gender) {
  const weight = _currentWeight; // current weight in kg
  const targetWeight = _targetWeight; // target weight in kg
  const height = _height; // height in cm
  const age = _age; // age in years
  const gender = _gender; // "male" or "female"

  let bmr;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const dailyCalorieIntake = bmr * 1.2 - 500;
  const weightLossRate = 0.5; // losing 0.5 kg per week is a safe and healthy rate
  const weeksToLoseWeight = (weight - targetWeight) / weightLossRate;
  const timeToLoseWeight = weeksToLoseWeight * 7; // converting weeks to days

  return Math.round(timeToLoseWeight);
}

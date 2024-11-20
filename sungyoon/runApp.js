// 전역 변수
const runData = [];
const $yearSelect = document.getElementById("year");
const $monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");
const $noonSelect = document.getElementById("noon");
const $hourSelect = document.getElementById("hour");
const $minuteSelect = document.getElementById("minute");
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();
const currentHour = new Date().getHours();
const currentMinute = new Date().getMinutes();
const noons = ["오전", "오후"];
const $submitBtn=document.querySelector('.submit-btn');
const $closeBtn=document.querySelector('.close-btn');
const $modalOverlay = document.querySelector('.modal-overlay');
const $modal=document.querySelector('.modal-content');
const $memo = document.getElementById('memo');
let runKillo=0;
let runtimeHour=0;
let runtimeMinute=0;
let runtimeSecond=0;

// 이벤트 리스너
document.addEventListener("DOMContentLoaded", () => {
  for (let year = currentYear; year > currentYear - 20; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    $yearSelect.appendChild(option);
  }
  for (let month = 12; month >= 1; month--) {
    const option = document.createElement("option");
    option.value = month;
    option.textContent = month;
    $monthSelect.appendChild(option);
  }
  for (let hour = 0; hour <= 12; hour++) {
    const option = document.createElement("option");
    option.value = hour;
    option.textContent = hour;
    $hourSelect.appendChild(option);
  }
  for (let min = 0; min < 60; min++) {
    const option = document.createElement("option");
    option.value = min;
    option.textContent = min;
    $minuteSelect.appendChild(option);
  }

  // 일 목록 생성
  function updateDays() {
    const year = parseInt($yearSelect.value);
    const month = parseInt($monthSelect.value);

    const daysInMonth = new Date(year, month, 0).getDate();
    daySelect.innerHTML = "";

    for (let day = daysInMonth; day >= 1; day--) {
      const option = document.createElement("option");
      option.value = day;
      option.textContent = day;
      daySelect.appendChild(option);
    }
  }
  noons.forEach((noon) => {
    const option = document.createElement("option");
    option.value = noon;
    option.textContent = noon;
    $noonSelect.appendChild(option);
  });
  // 기본값 설정
  $yearSelect.value = currentYear;
  $monthSelect.value = currentMonth;
  $hourSelect.value = currentHour;
  $hourSelect.value = currentHour % 12;
  $minuteSelect.value = currentMinute;
  // 일 목록 초기화 및 기본값 설정
  updateDays();
  daySelect.value = currentDay;
});

document.addEventListener("DOMContentLoaded", () => {
  const slots = document.querySelectorAll(".number-display");

  slots.forEach((slot) => {
    const upButton = slot.previousElementSibling;
    const downButton = slot.nextElementSibling;

    upButton.addEventListener("click", () => {
      let currentNumber = parseInt(slot.textContent);
      currentNumber = (currentNumber + 1) % 10;
      slot.textContent = currentNumber;
    });

    downButton.addEventListener("click", () => {
      let currentNumber = parseInt(slot.textContent);
      currentNumber = (currentNumber - 1 + 10) % 10;
      slot.textContent = currentNumber;
    });
  });
 
});
function getData(){
  const slots = document.querySelectorAll(".number-display");
  let tmp ='';
  runKillo=0;
  runtimeHour=0;
  runtimeMinute=0;
  runtimeSecond=0;
  //거리 추출
  slots.forEach((slot,idx)=>{
    if(idx>3) return;
    if(idx===2) tmp+='.';
    tmp+=slot.textContent;
  })
  runKillo=parseFloat(tmp);
  //시간 추출
  let tmpH = slots[4].textContent+slots[5].textContent;
  runtimeHour= parseInt(tmpH);
  let tmpM = slots[6].textContent+slots[7].textContent;
  runtimeMinute= parseInt(tmpM);
  let tmpS = slots[8].textContent+slots[9].textContent;
  runtimeSecond= parseInt(tmpS);
}
function modalClose(){
  $modal.style.display='none';
  $modalOverlay.style.display='none';
}
$closeBtn.addEventListener('click',()=>{
  modalClose();
})
$submitBtn.addEventListener('click',()=>{
  getData();
  const newRun = {
    id :  String(Math.random()),
    memo : $memo.value,
    Killo : runKillo,
    hour : runtimeHour,
    minute : runtimeMinute,
    second : runtimeSecond
  }
  runData.push(newRun);
  console.log(JSON.stringify(runData)); 
  // modalClose();
})
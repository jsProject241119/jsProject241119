// 전역 변수
const runData = [
  {
		"id":"1",
		"memo":"아침 러닝",
		"date":"2024-11-14",
		"time":"09:10",
		"Killo":9.8,
		"hour":1,
		"minute":10,
		"second":23
	},
  {
		"id":"2",
		"memo":"목요일 저녁 러닝",
		"date":"2024-11-21",
		"time":"20:30",
		"Killo":11.5,
		"hour":1,
		"minute":8,
		"second":15
	}
];
const $runList = document.getElementById("runList");
const $submitBtn = document.querySelector(".submit-btn");
const $closeBtn = document.querySelector(".close-btn");
const $modalOverlay = document.querySelector(".modal-overlay");
const $modal = document.querySelector(".modal-content");
const $memo = document.getElementById("memo");
const $date = document.getElementById("date");
const $time = document.getElementById("time");
const $addBtn = document.getElementById("add-btn");
const slots = document.querySelectorAll(".number-display");
const $periodBtns = document.querySelector(".period-btns");
let selectedPeriod ="today";
let $runDataF=[];

let runKillo = 0;
let runtimeHour = 0;
let runtimeMinute = 0;
let runtimeSecond = 0;

document.addEventListener("DOMContentLoaded", () => {
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
  render();
});
//모달의 슬롯 번호 취합
function getData() {
  const slots = document.querySelectorAll(".number-display");
  let tmp = "";
  runKillo = 0;
  runtimeHour = 0;
  runtimeMinute = 0;
  runtimeSecond = 0;
  //거리 추출
  slots.forEach((slot, idx) => {
    if (idx > 3) return;
    if (idx === 2) tmp += ".";
    tmp += slot.textContent;
  });
  runKillo = parseFloat(tmp);
  //시간 추출
  let tmpH = slots[4].textContent + slots[5].textContent;
  runtimeHour = parseInt(tmpH);
  let tmpM = slots[6].textContent + slots[7].textContent;
  runtimeMinute = parseInt(tmpM);
  let tmpS = slots[8].textContent + slots[9].textContent;
  runtimeSecond = parseInt(tmpS);
}
//보드 렌더
function renderBoardHandler() {
  //선택된 기간 감지
  if(selectedPeriod==="today"){
    $runDataF = runData.filter(run=>run.date===getFormattedDate())
  }else if(selectedPeriod==="week"){
    $runDataF = runData.filter(run=>run.id==1);
  }else if(selectedPeriod==="month"){
    $runDataF = runData.filter(run=>run.date.split('-')[1]==new Date().getMonth()+1)
    console.log(runData[0].date.split('-')[1]); 
  }else{
    alert('버그발생')
  }
  //거리합 표시
  const $boardKillo = document.getElementById("board-killo");
  const sumDistance = $runDataF.reduce((sum, run) => {
    return (sum += run.Killo);
  }, 0);
  $boardKillo.textContent = sumDistance + "km";
  //시간합 표시
  const $boardHour = document.getElementById("board-hour");
  let sumSecond = $runDataF.reduce((sum, run) => {
    return (sum += run.second);
  }, 0);
  let sumMinute = $runDataF.reduce((sum, run) => {
    return (sum += run.minute);
  }, 0);
  let sumHour = $runDataF.reduce((sum, run) => {
    return (sum += run.hour);
  }, 0);
  let tmp = 0;
  tmp = Math.floor(sumSecond / 60);
  sumSecond = sumSecond % 60;
  sumMinute = sumMinute + tmp;
  tmp = Math.floor(sumMinute / 60);
  sumMinute = sumMinute % 60;
  sumHour = sumHour + tmp;
  document.getElementById("board-hour").textContent = sumHour;
  document.getElementById("board-minute").textContent = sumMinute;
  document.getElementById("board-second").textContent = sumSecond;
  //평균 페이스 계산
  const averageSpeed = calculateAverageSpeed(
    sumDistance,
    sumHour,
    sumMinute,
    sumSecond
  );
  const roundAverage = Math.round(averageSpeed * 100) / 100;
  document.getElementById("board-phase").textContent = roundAverage;
}
//렌더하기
function render() {
  $runList.innerHTML = "";
  runData.forEach((run) => {
    $newLi = document.createElement("li");
    $newLi.classList.add("added");
    $newLi.dataset.id=run.id;
    $newLi.innerHTML = `
      <div class="info"
        <span>${run.date}</span>
        <span>${run.memo}</span>
        <span>${run.Killo}km</span>
      </div>
      <div class="icon"><span class="lnr lnr-cross"></span></div>
    `;
    $runList.append($newLi);
  });
  renderBoardHandler();
  getToday();
}
//평균 시속 구하기
function calculateAverageSpeed(distanceKm, hours, minutes, seconds) {
  let averageSpeed = 0;
  if (!distanceKm && !hours && !minutes && !seconds) {
    return 0;
  }
  const totalHours = hours + minutes / 60 + seconds / 3600;

  averageSpeed = distanceKm / totalHours;

  return averageSpeed; // km/h
}

//오늘 날짜 한글로 가져오기
function getToday() {
  const today = new Date();
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("today").textContent = formatter.format(today);
}
//yyyy--mm--dd형식 오늘
function getFormattedDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
//모달 닫기 기능
function modalClose() {
  $modal.style.display = "none";
  $modalOverlay.style.display = "none";
  $memo.value = "";
  $date.value = "";
  $time.value = "";
  slots.forEach((e) => (e.textContent = 0));
}
//모달 열기 기능
function modalOpen() {
  $modal.style.display = "block";
  $modalOverlay.style.display = "block";
  setToday();
}
function setToday(){
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  $date.value = formattedDate;
  const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0'); // 시 두 자리
        const minutes = String(now.getMinutes()).padStart(2, '0'); // 분 두 자리

        const currentTime = `${hours}:${minutes}`;
  $time.value = currentTime;
}
$closeBtn.addEventListener("click", () => {
  modalClose();
});
//모달 제출
$submitBtn.addEventListener("click", () => {
  getData();
  const newRun = {
    id: String(Math.random()),
    memo: $memo.value,
    date: $date.value,
    time: $time.value,
    Killo: runKillo,
    hour: runtimeHour,
    minute: runtimeMinute,
    second: runtimeSecond,
  };
  //필수요건 검증
  let isTimeSet;
  if (!newRun.hour && !newRun.minute && !newRun.second) {
    isTimeSet = false;
  } else isTimeSet = true;
  if (!newRun.date || !newRun.time || !newRun.Killo || !isTimeSet) {
    alert("날짜/시간/거리 는 필수 항목입니다.");
    return;
  }
  runData.push(newRun);
  render();
  console.log(JSON.stringify(runData));
  modalClose();
});
//추가하기
$addBtn.addEventListener("click", () => {
  modalOpen();
});
//삭제하기
$runList.addEventListener('click',e=>{
  if(!e.target.matches('.lnr-cross'))return;
  const $targetLi = e.target.closest('.added');
  const dataId = $targetLi.dataset.id;
  // runData = runData.filter(run => dataId !== run.id);
  runData.splice(0,runData.length,...runData.filter(run=>run.id!==dataId));
  render();
});
// 기간 필터링 버튼 리스너
$periodBtns.addEventListener('click',e=>{
  if(!e.target.matches('.period-btn'))return;
  if(e.target.matches('#today-btn')){
    selectedPeriod = "today";
    renderBoardHandler();
  }
  if(e.target.matches('#week-btn')){
    selectedPeriod = "week";
    renderBoardHandler();
  }
  if(e.target.matches('#month-btn')){
    selectedPeriod = "month";
    renderBoardHandler();
  }
})
const today = new Date();
const a = today.getDate();
const b = setToday
console.log(a);
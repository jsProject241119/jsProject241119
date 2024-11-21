// 전역 변수
const runData = [];
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
  //거리합 표시
  const $boardKillo = document.getElementById("board-killo");
  const sumDistance = runData.reduce((sum, run) => {
    return (sum += run.Killo);
  }, 0);
  $boardKillo.textContent = sumDistance + "km";
  //시간합 표시
  const $boardHour = document.getElementById("board-hour");
  let sumSecond = runData.reduce((sum, run) => {
    return (sum += run.second);
  }, 0);
  let sumMinute = runData.reduce((sum, run) => {
    return (sum += run.minute);
  }, 0);
  let sumHour = runData.reduce((sum, run) => {
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
//오늘 날짜 가져오기
function getToday() {
  const today = new Date();
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("today").textContent = formatter.format(today);
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
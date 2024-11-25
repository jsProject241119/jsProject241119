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
		"second":23,
		"pace":8.35
	},
  {
		"id":"2",
		"memo":"목요일 저녁 러닝",
		"date":"2024-11-21",
		"time":"20:30",
		"Killo":11.5,
		"hour":1,
		"minute":8,
		"second":15,
		"pace":10.1
	},
  {
		"id":"3",
		"memo":"",
		"date":"2024-11-25",
		"time":"20:30",
		"Killo":11.5,
		"hour":1,
		"minute":8,
		"second":15,
		"pace":10.1
	},
  {
		"id":"4",
		"memo":"",
		"date":"2024-11-26",
		"time":"20:30",
		"Killo":5,
		"hour":0,
		"minute":40,
		"second":15,
		"pace":10.1
	},
  {
		"id":"5",
		"memo":"",
		"date":"2024-11-27",
		"time":"20:30",
		"Killo":8,
		"hour":0,
		"minute":50,
		"second":55,
		"pace":10.1
	},
  {
		"id":"6",
		"memo":"",
		"date":"2024-11-24",
		"time":"20:30",
		"Killo":6,
		"hour":0,
		"minute":50,
		"second":23,
		"pace":10.1
	},
];
const test1 = calculateAverageSpeed(11.5,1,8,15);
// console.log(test1);
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
let myChart;
let runKillo = 0;
let runtimeHour = 0;
let runtimeMinute = 0;
let runtimeSecond = 0;

//해당 일자가 속한 주 계산
function getTargetWeek(targetDay){
  const today = new Date(targetDay);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return {
    getWeekStart : ()=>new Date(weekStart),
    getWeekEnd : ()=>new Date(weekEnd)
  }
}
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
    const thisWeek = getTargetWeek(new Date());
    const weekStart=getFormattedDate(thisWeek.getWeekStart());
    const weekEnd=getFormattedDate(thisWeek.getWeekEnd());
    $runDataF = runData.filter(run=>run.date>=weekStart&&run.date<=weekEnd);
  }else if(selectedPeriod==="month"){
    $runDataF = runData.filter(run=>run.date.split('-')[1]==new Date().getMonth()+1)
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
//==========렌더하기==============
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
      <span class="lnr lnr-redo"></span>
      <span class="lnr lnr-cross"></span>
      </div>
    `;
    $runList.append($newLi);
  });
  renderBoardHandler();
  renderChart()
  getToday();
  iconHover();
  redoOpen();

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
//yyyy--mm--dd형식 변환기
function getFormattedDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
//mm/dd 형식 변환기
function monthAndDay(date = new Date()){
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
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
  const averageSpeed = calculateAverageSpeed(
    runKillo,
    runtimeHour,
    runtimeMinute,
    runtimeSecond
  );
  const roundAverage = Math.round(averageSpeed * 100) / 100;
  const newRun = {
    id: String(Math.random()),
    memo: $memo.value,
    date: $date.value,
    time: $time.value,
    Killo: runKillo,
    hour: runtimeHour,
    minute: runtimeMinute,
    second: runtimeSecond,
    pace: roundAverage
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
//공배열 검증 후 평균내고 페이스를 소수점 2자리까지 출력
function ArrayToAverage(arr){
  if(arr.length===0) return 0;
  const sumDis = arr.reduce((sum,data)=>sum+=data.Killo,0);
  const sumHour = arr.reduce((sum,data)=>sum+=data.hour,0);
  const sumMinute = arr.reduce((sum,data)=>sum+=data.minute,0);
  const sumSecond = arr.reduce((sum,data)=>sum+=data.second,0);
  const avrPace = calculateAverageSpeed(sumDis,sumHour,sumMinute,sumSecond);
  return Math.round(avrPace*100)/100;

}
//아이콘 호버
function iconHover(){
const $lnr = document.querySelectorAll('.lnr');
$lnr.forEach(lnr=>{
  lnr.addEventListener('mouseover',e=>{
    lnr.style.color='lightblue';
  })
})
$lnr.forEach(lnr=>{
  lnr.addEventListener('mouseout',e=>{
    lnr.style.color='black';
  })
})
}
//수정 이벤트 리스너
function redoOpen(){
  document.querySelectorAll('.lnr-redo').forEach(redo=>{
    redo.addEventListener('click',e=>{
      modalOpen();
    })
  })
}
function renderChart(){
  if(myChart) myChart.destroy();
  const thisWeek = getTargetWeek(new Date());
  const weekStart = thisWeek.getWeekStart();
  const sun = monthAndDay(weekStart);
  const fullSun = getFormattedDate(weekStart);
  const mon = monthAndDay(new Date(weekStart.setDate(weekStart.getDate()+1)));
  const fullMon = getFormattedDate(weekStart);
  const tue = monthAndDay(new Date(weekStart.setDate(weekStart.getDate()+1)));
  const fullTue = getFormattedDate(weekStart);
  const wed = monthAndDay(new Date(weekStart.setDate(weekStart.getDate()+1)));
  const fullWed = getFormattedDate(weekStart);
  const thu = monthAndDay(new Date(weekStart.setDate(weekStart.getDate()+1)));
  const fullThu = getFormattedDate(weekStart);
  const fri = monthAndDay(new Date(weekStart.setDate(weekStart.getDate()+1)));
  const fullFri = getFormattedDate(weekStart);
  const sat = monthAndDay(new Date(weekStart.setDate(weekStart.getDate()+1)));
  const fullSat = getFormattedDate(weekStart);
  const sunRun = runData.filter(data=>data.date==fullSun).reduce((sum,data)=>sum+=data.Killo,0)
  const monRun = runData.filter(data=>data.date==fullMon).reduce((sum,data)=>sum+=data.Killo,0)
  const tueRun = runData.filter(data=>data.date==fullTue).reduce((sum,data)=>sum+=data.Killo,0)
  const wedRun = runData.filter(data=>data.date==fullWed).reduce((sum,data)=>sum+=data.Killo,0)
  const thuRun = runData.filter(data=>data.date==fullThu).reduce((sum,data)=>sum+=data.Killo,0)
  const friRun = runData.filter(data=>data.date==fullFri).reduce((sum,data)=>sum+=data.Killo,0)
  const satRun = runData.filter(data=>data.date==fullSat).reduce((sum,data)=>sum+=data.Killo,0)
  const sunPace = ArrayToAverage(runData.filter(data=>data.date==fullSun));
  const monPace = ArrayToAverage(runData.filter(data=>data.date==fullMon));
  const tuePace = ArrayToAverage(runData.filter(data=>data.date==fullTue));
  const wedPace = ArrayToAverage(runData.filter(data=>data.date==fullWed));
  const thuPace = ArrayToAverage(runData.filter(data=>data.date==fullThu));
  const friPace = ArrayToAverage(runData.filter(data=>data.date==fullFri));
  const satPace = ArrayToAverage(runData.filter(data=>data.date==fullSat));
const ctx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar', // 차트 종류 (bar, line, pie 등)
    data: {
      labels: [sun, mon, tue, wed, thu, fri, sat], // 라벨
      datasets: [
        {
        label: 'run km',
        data: [sunRun, monRun, tueRun, wedRun, thuRun, friRun, satRun], // 데이터 값
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      },
      {
        label: 'run pace',
        data: [sunPace, monPace, tuePace, wedPace, thuPace, friPace, satPace], // 데이터 값
        type: 'line',
        borderWidth: 2,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
        ],
        borderColor:[
          'rgba(255, 99, 132, 0.7)',
        ]
      
      },
    ],
    },
    options: {
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
document.querySelector('.chart-period').addEventListener('click',e=>{
  if(!e.target.matches('.btn')) return;
  console.log(e.target);
})

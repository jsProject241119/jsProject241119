// 전역 변수
const runData = [];
const $runList = document.getElementById('runList')
const $submitBtn=document.querySelector('.submit-btn');
const $closeBtn=document.querySelector('.close-btn');
const $modalOverlay = document.querySelector('.modal-overlay');
const $modal=document.querySelector('.modal-content');
const $memo = document.getElementById('memo');
const $date = document.getElementById('date');
const $time = document.getElementById('time');
const $addBtn = document.getElementById('add-btn');
const slots = document.querySelectorAll(".number-display");
let runKillo=0;
let runtimeHour=0;
let runtimeMinute=0;
let runtimeSecond=0;



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
//렌더
function renderBoardHandler(){
  const $boardKillo = document.getElementById('board-killo');
  const $boardHour = document.getElementById('board-hour');
  const sumDistance = runData.reduce((sum,run)=>{
    return sum+=run.Killo
  },0);
  $boardKillo.textContent=sumDistance+'km';
}
function render(){
  $runList.innerHTML='';
  runData.forEach(run=>{
    $newLi = document.createElement('li');
    $newLi.classList.add('added');
    $newLi.textContent=run.memo;
    $runList.append($newLi);
  })
  renderBoardHandler();
}
function modalClose(){
  $modal.style.display='none';
  $modalOverlay.style.display='none';
  $memo.value='';
  $date.value='';
  $time.value='';
  slots.forEach(e=>e.textContent=0);
}
function modalOpen(){
  $modal.style.display='block';
  $modalOverlay.style.display='block';
}
$closeBtn.addEventListener('click',()=>{
  modalClose();
})
$submitBtn.addEventListener('click',()=>{
  getData();
  const newRun = {
    id :  String(Math.random()),
    memo : $memo.value,
    date : $date.value,
    time : $time.value,
    Killo : runKillo,
    hour : runtimeHour,
    minute : runtimeMinute,
    second : runtimeSecond
  }
  runData.push(newRun);
  console.log(JSON.stringify(runData));
  render();
  modalClose();
})
$addBtn.addEventListener('click',()=>{
  modalOpen();
})
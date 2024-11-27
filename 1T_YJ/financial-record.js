//====== 전역 변수 영역 =======//
// 서버와 통신할 데이터
let records = [
  {
    id: "1",
    date: "2024-11-03",
    recordTypeInput: "수입",
    price: 1000000,
    content: "용돈",
  },
  {
    id: "2",
    date: "2024-11-10",
    recordTypeInput: "지출",
    price: 20000,
    content: "식사",
  },
  {
    id: "3",
    date: "2024-11-12",
    recordTypeInput: "지출",
    price: 100000,
    content: "쇼핑",
},
];

//======= DOM 가져오기 영역 ========//
const $expenseBtn = document.getElementById("expenseBtn");
const $incomeBtn = document.getElementById("incomeBtn");
const $submitBtn = document.getElementById("submitBtn");
const $dateInput = document.getElementById("dateInput");
const $priceInput = document.getElementById("priceInput");
const $contentInput = document.getElementById("contentInput");
const $recordsUl = document.getElementById("record-list");
const $totalAmount = document.getElementById("totalAmount");
const $totalExpense = document.getElementById("totalExpense");
const $totalIncome = document.getElementById("totalIncome");
const $closeBtn = document.getElementById("closeBtn")
const $inputcontainer = document.getElementById("input-container")
const $addBtn = document.getElementById("add-button")



let recordTypeInput = "지출";

//======= 함수 정의 영역 ========//

function saveRecords(){
    localStorage.setItem('recordList',JSON.stringify(records));
}

function loadRecords(){
    const recordsJson = localStorage.getItem('recordList');
    if(recordsJson){
        records = JSON.parse(recordsJson);

    }
    renderRecords();
}

function renderRecords() {

    records.sort((a,b) => new Date(a.date)- new Date(b.date));

    $recordsUl.innerHTML ='';
    records.forEach((record) => {
        const $li = document.createElement("li");
    $li.classList.add("record-list-item");
    $li.dataset.id = record.id;
    const formattedPrice = Math.abs(record.price).toLocaleString();
    const displayPrice = record.price < 0? `-${formattedPrice}원`:`+${formattedPrice}원`
    $li.innerHTML = `
    <div>${record.date}</div>
            <div>${record.recordTypeInput}</div>
            <div id ="userPrice"> ${displayPrice} </div>
            <div> ${record.content} </div>
            <div class="remove"><span class="lnr lnr-cross-circle"></span></div>
        
    `;
    $recordsUl.append($li);
});
saveRecords();
AddTotalRecords();
}

function recordRemoveHandler(e){
    
    if(!e.target.matches('.remove span')) return;

    const isConfirmed = confirm("정말로 삭제하시겠습니까?");
    
    if(!isConfirmed) return;
    
    const $targetLi = e.target.closest('.record-list-item');
    const dataId = $targetLi.dataset.id;
   
    const index = records.findIndex((record) => dataId === record.id);
    records.splice(index,1);
    
    // 배열 리렌더링
    renderRecords();
}

function recordInsertHandler(e){
    const dateInput = $dateInput.value;
    const priceInput = parseFloat($priceInput.value);
    const contentInput = $contentInput.value;

    if(!dateInput || !priceInput){
        alert('날짜와 금액은 필수로 입력해주세요');
        return;
    }
   
    const formattedPrice = recordTypeInput === '지출' ? -priceInput : +priceInput;
    
    const newRecord = {
        id: String(Math.random()),
        date:dateInput,
        recordTypeInput: recordTypeInput,
        price: formattedPrice,
        content:contentInput
    };
    
   records.push(newRecord);
   
   renderRecords();

   $dateInput.value ='';
   $contentInput.value='';
   $priceInput.value='';

   

}
function AddTotalRecords(){
    let totalAmount=0;
    let totalExpense=0;
    let totalIncome=0;

    records.forEach(record =>{
        const price =parseFloat(record.price);
        totalAmount += price;

        if(price < 0){
            totalExpense += Math.abs(price);
        }
        else{
            totalIncome += price;
        }
    })

$totalAmount.textContent = `${totalAmount.toLocaleString()}원`
$totalExpense.textContent = `${totalExpense.toLocaleString()}원`
$totalIncome.textContent = `${totalIncome.toLocaleString()}원`

}




//======== 이벤트 핸들러 ========//
$recordsUl.addEventListener('click',recordRemoveHandler)


$expenseBtn.addEventListener("click", () => {
  recordTypeInput = "지출";
  $expenseBtn.classList.add("expense-active");
  $incomeBtn.classList.remove("income-active");
});
$incomeBtn.addEventListener("click", () => {
  recordTypeInput = "수입";
  $incomeBtn.classList.add("income-active");
  $expenseBtn.classList.remove("expense-active");
});

$submitBtn.addEventListener('click',recordInsertHandler)

$submitBtn.addEventListener('mouseover',()=>{
    $submitBtn.classList.add("submit-btn-active");
    
})
$contentInput.addEventListener('keydown',(e)=>{
    if(e.key ==='Enter'){
$submitBtn.click()
    }

})
$addBtn.addEventListener('click',()=>{
    $addBtn.classList.add('cover');
    $inputcontainer.classList.add('show');

    $expenseBtn.classList.add("expense-active");
})

$closeBtn.addEventListener('click',()=>{
    $inputcontainer.classList.remove('show')
    $addBtn.classList.remove('cover')
})


//============= 코드 실행 영역 ============//
loadRecords();
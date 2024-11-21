const $expenseBtn = document.getElementById('expenseBtn')
const $incomeBtn = document.getElementById('incomeBtn')
const $submitBtn = document.getElementById('submitBtn')
const $dateInput = document.getElementById('dateInput')
const $priceInput = document.getElementById('priceInput')
const $contentInput = document.getElementById('contentInput')
const $recordsUl = document.getElementById('record-list')

let recordType = "expense"


$expenseBtn.addEventListener('click',()=>{
recordType ='expense';
$expenseBtn.classList.add('expense-active');
$incomeBtn.classList.remove('income-active');



})

$incomeBtn.addEventListener('click',()=>{
    recordType = "income"
    $incomeBtn.classList.add("income-active");
    $expenseBtn.classList.remove("expense-active");
})

$submitBtn.addEventListener('click',()=>{
    const dateInput = $dateInput.value
    const price = $priceInput.value
    const content = $contentInput.value

    const listItem = document.createElement('li');
    listItem.innerHTML =`
    <div>${dateInput}</div>
    <div>${recordType === "expense" ? "지출": "수입"}</div>
    <div>${Number(price)}원</div>
    <div>${content}</div>
    `
    listItem.classList.add(recordType);
    $recordsUl.appendChild(listItem);

    $priceInput.value ='';
    $contentInput.value ='';

})

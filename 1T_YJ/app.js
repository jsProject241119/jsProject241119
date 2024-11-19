
//=================상수영역===============//
const ADD = '+';
const SUB = '-';

//============전역변수 영역=============//
let records =[
    {
        id:'1',
        price:'10000',
        content:'라멘'
    },
    {
        id:'2',
        price:'2000',
        content:'커피'
    },
    {
        id:'3',
        price:'6000',
        content:'교통비'
    },
    {
        id: '4',
        price: '1000000',
        content:'용돈'
    }

]

//============DOM 가져오기===============//

 // 입력태그 가져오기
 const $InputPrice = document.getElementById('price')
 const $InputContent = document.getElementById('content')
 const $expenseBtn = document.getElementById('expense')
 const $incomeBtn = document.getElementById('income')
 const $RecordlistUl = document.getElementById('record-list')
 const $saveBtn = document.getElementById('save')



 //=======함수 정의 영역======//
 // 로컬 스토리지에 records 배열 저장해두기
 function saveRecords(){
    localStorage.setItem('recordList',JSON.stringify(records))
 }
 function loadRecords(){
    const recordJson = localStorage.getItem('recordList');
    if(recordJson){
        records = JSON.parse(recordJson);
    }
    RenderRecords();
 }

 function RenderRecords(){
    $RecordlistUl.innerHTML = '';

    records.forEach(record =>{
        const $li =document.createElement('li');
        $li.classList.add('record-item');
        $li.dataset.id = record.id;
        $li.innerHTML =`
        <span class = "">${record.price}</span>
        <span class ="">${record.content}</span>
        <label class="remove"><span class ="lnr-cross-circle"></span></label>
        `
        $RecordlistUl.append($li);

        saveRecords();
    })
}
function RecordInsertHandler(e) {
    e.preventDefault();
    const priceText = $InputPrice.value;
    const Content = $InputContent.value;
    const newRecord = {
        id:String(Math.random()),
        price:priceText,
        content: Content

    };
    records.push(newRecord);

    RenderRecords();

    $InputPrice.value =''
    $InputContent.value =''

}






//  =========이벤트 등록==============//
$expenseBtn.addEventListener('click',e =>{

})
$incomeBtn.addEventListener('click',e =>{

})
$saveBtn.addEventListener('click',e =>{
    RecordInsertHandler
})
 


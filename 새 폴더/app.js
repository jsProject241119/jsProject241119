
// 아이콘 들어갈 컨테이너
const $numbers = document.getElementById('numbers');

// 숫자 45개 생성하기
for (let i = 1; i <= 45; i ++) {
    const $div = document.createElement('div');
    $div.classList.add('circle');
    $div.textContent = i;

    $numbers.append($div);
} 

// 아이콘 클릭 이벤트 등록하기
$numbers.addEventListener('click', e => {
    console.log('클릭!');
});
//========= 전역 변수 영역 ========//
// 저장된 책 정보를 담을 배열
let bookList = [];

//========= DOM 가져오기 영역 ========//
const $bookTitleInput = document.getElementById('book-title');
const $bookAuthorInput = document.getElementById('book-author');
const $startDateInput = document.getElementById('start-date');
const $endDateInput = document.getElementById('end-date');
const $bookReviewInput = document.getElementById('book-review');
const $saveButton = document.getElementById('save-btn');
const $cancelButton = document.getElementById('cancel-btn');
const $bookListUl = document.getElementById('book-list');

//========= 함수 정의 영역 ========//

// 책 정보를 화면에 렌더링하는 함수
function renderBookList() {
  // 기존 리스트 초기화
  $bookListUl.innerHTML = '';

  // 배열의 각 책 정보를 화면에 추가
  bookList.forEach((book, index) => {
    // 책 정보를 담을 li 요소 생성
    const $li = document.createElement('li');
    $li.classList.add('book-item');

    // li 내부에 들어갈 HTML 작성
    $li.innerHTML = `
      <h3>${book.title} (${book.author})</h3>
      <p>독서 기간: ${book.startDate} ~ ${book.endDate}</p>
      <p>${book.review}</p>
      <button class="delete-btn" data-index="${index}">삭제</button>
    `;

    // 삭제 버튼 클릭 이벤트 등록
    const $deleteButton = $li.querySelector('.delete-btn');
    $deleteButton.addEventListener('click', () => {
      // 삭제 버튼을 누른 책 정보를 배열에서 제거
      bookList.splice(index, 1);
      renderBookList(); // 리스트 다시 렌더링
    });

    // li 요소를 ul에 추가
    $bookListUl.appendChild($li);
  });
}

// 책 정보를 저장하는 함수
function saveBookInfo(event) {
  event.preventDefault(); // 폼 기본 동작 막기

  // 입력된 값 가져오기
  const title = $bookTitleInput.value.trim();
  const author = $bookAuthorInput.value.trim();
  const startDate = $startDateInput.value;
  const endDate = $endDateInput.value;
  const review = $bookReviewInput.value.trim();

  // 입력 값 유효성 검사
  if (!title || !author || !startDate || !endDate || !review) {
    alert('빈칸의 텍스트를 입력해주세요.');
    return;
  }

  // 책 정보를 객체로 생성
  const newBook = {
    title,
    author,
    startDate,
    endDate,
    review,
  };

  // 배열에 책 정보 추가
  bookList.push(newBook);

  // 책 정보 리스트 렌더링
  renderBookList();

  // 입력 필드 초기화
  $bookTitleInput.value = '';
  $bookAuthorInput.value = '';
  $startDateInput.value = '';
  $endDateInput.value = '';
  $bookReviewInput.value = '';
}

//========= 이벤트 등록 영역 ========//
// 저장하기 버튼 클릭 이벤트
$saveButton.addEventListener('click', saveBookInfo);

// 취소하기 버튼 클릭 이벤트
$cancelButton.addEventListener('click', (event) => {
  event.preventDefault(); // 폼 기본 동작 막기
  // 입력 필드 초기화
  $bookTitleInput.value = '';
  $bookAuthorInput.value = '';
  $startDateInput.value = '';
  $endDateInput.value = '';
  $bookReviewInput.value = '';
});

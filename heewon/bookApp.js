
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

// 로컬스토리지
// 책 정보 배열을 로컬 스토리지에 저장하는 함수
function saveToLocalStorage() {
  localStorage.setItem('bookList', JSON.stringify(bookList));
}

// 로컬 스토리지에서 책 정보를 불러오는 함수
function loadFromLocalStorage() {
  const savedBooks = localStorage.getItem('bookList');
  if (savedBooks) {
    bookList = JSON.parse(savedBooks);
    renderBookList();
  }
}

// 페이지 로드 시 로컬 스토리지에서 데이터 불러오기
window.addEventListener('DOMContentLoaded', loadFromLocalStorage);

// 책 정보를 추가하거나 삭제할 때마다 로컬 스토리지에 저장
function renderBookList() {
  // 기존 리스트 초기화
  $bookListUl.innerHTML = '';
  
  bookList.forEach((book, index) => {
    // (기존 코드와 동일)
    const $li = document.createElement('li');
    $li.classList.add('book-item');
    $li.innerHTML = `
      <h3>${book.title} (${book.author})</h3>
      <p>독서 기간: ${book.startDate} ~ ${book.endDate}</p>
      <p>${book.review}</p>
      <button class="delete-btn" data-index="${index}">삭제</button>
    `;

    const $deleteButton = $li.querySelector('.delete-btn');
    $deleteButton.addEventListener('click', () => {
      bookList.splice(index, 1);
      renderBookList(); // 리스트 다시 렌더링
      saveToLocalStorage(); // 로컬 스토리지에 저장
    });

    $bookListUl.appendChild($li);
  });

  // 로컬 스토리지에 데이터 저장
  saveToLocalStorage();
}


// 날짜 유효성 검사

function validateDates(startDate, endDate) {
  if (new Date(startDate) > new Date(endDate)) {
    alert('시작 날짜는 종료 날짜보다 늦을 수 없습니다.');
    return false;
  }
  return true;
}


// //===================책 제목 검색하기==============
// const $searchInput = document.getElementById('search-input');

// // 검색 필터링 함수
// function searchBooks() {
//   const searchQuery = $searchInput.value.toLowerCase();

//   const filteredBooks = bookList.filter(book =>git 
//     book.title.toLowerCase().includes(searchQuery) ||
//     book.author.toLowerCase().includes(searchQuery)
//   );

//   // 필터링된 책만 렌더링
//   renderFilteredBookList(filteredBooks);
// }

// // 검색 입력 필드 이벤트 등록
// $searchInput.addEventListener('input', searchBooks);

// // 필터링된 책 리스트 렌더링 함수
// function renderFilteredBookList(filteredBooks) {
//   $bookListUl.innerHTML = '';
//   filteredBooks.forEach((book, index) => {
//     const $li = document.createElement('li');
//     $li.classList.add('book-item');
//     $li.innerHTML = `
//       <h3>${book.title} (${book.author})</h3>
//       <p>독서 기간: ${book.startDate} ~ ${book.endDate}</p>
//       <p>${book.review}</p>
//       <button class="delete-btn" data-index="${index}">삭제</button>
//     `;
//     $bookListUl.appendChild($li);
//   });
// }

// 책 제목 검색
const $searchInput = document.getElementById('search-input');
const $bookListUl = document.getElementById('book-list');

// 검색 필터링 함수
function searchBooks() {
  const searchQuery = $searchInput.value.toLowerCase();

  const filteredBooks = bookList.filter(book =>
    book.title.toLowerCase().includes(searchQuery) ||
    book.author.toLowerCase().includes(searchQuery)
  );

  // 필터링된 책만 렌더링
  renderFilteredBookList(filteredBooks);
}

// 검색 입력 필드 이벤트 등록
$searchInput.addEventListener('input', searchBooks);

// 필터링된 책 리스트 렌더링 함수
function renderFilteredBookList(filteredBooks) {
  // 리스트 비우기
  $bookListUl.innerHTML = '';

  if (filteredBooks.length === 0) {
    // 검색 결과가 없을 경우 메시지 표시
    $bookListUl.innerHTML = '<li>검색 결과가 없습니다.</li>';
  } else {
    // 필터링된 책 리스트 렌더링
    filteredBooks.forEach((book, index) => {
      const $li = document.createElement('li');
      $li.classList.add('book-item');
      $li.innerHTML = `
        <h3>${book.title} (${book.author})</h3>
        <p>독서 기간: ${book.startDate} ~ ${book.endDate}</p>
        <p>${book.review}</p>
        <button class="delete-btn" data-index="${index}">삭제</button>
      `;
      $bookListUl.appendChild($li);
    });
  }
}

//========= 전역 변수 영역 ========//
// 저장된 책 정보를 담을 배열
let bookList = [];

//========= DOM 가져오기 영역 ========//
const $bookTitleInput = document.getElementById("book-title");
const $bookAuthorInput = document.getElementById("book-author");
const $startDateInput = document.getElementById("start-date");
const $endDateInput = document.getElementById("end-date");
const $bookReviewInput = document.getElementById("book-review");
const $saveButton = document.getElementById("save-btn");
const $cancelButton = document.getElementById("cancel-btn");
const $bookListUl = document.getElementById("book-list");

const $searchInput = document.getElementById("search-input");
const $searchButton = document.getElementById("search-btn");

//========= 함수 정의 영역 ========//

// 1. 책 정보를 화면에 렌더링하는 함수
function renderBookList() {
  // 기존 리스트 초기화
  $bookListUl.innerHTML = "";

  // 배열의 각 책 정보를 화면에 추가
  bookList.forEach((book, index) => {
    // 책 정보를 담을 li 요소 생성
    const $li = document.createElement("li");
    $li.classList.add("book-item");

    // li 내부에 들어갈 HTML 작성
    $li.innerHTML = `
      <h3>${book.title} (${book.author})</h3>
      <p>독서 기간: ${book.startDate} ~ ${book.endDate}</p>
      <p>${book.review}</p>
      <button class="delete-btn" data-index="${index}">삭제</button>
    `;

    // 삭제 버튼 클릭 이벤트 등록
    const $deleteButton = $li.querySelector(".delete-btn");
    $deleteButton.addEventListener("click", () => {
      // 삭제 확인 대화창
      const confirmDelete = confirm("정말로 삭제하시겠습니까?");
      if (confirmDelete) {
        // 삭제 버튼을 누른 책 정보를 배열에서 제거
        bookList.splice(index, 1);
        renderBookList(); // 리스트 다시 렌더링
        saveToLocalStorage(); // 로컬 스토리지 업데이트
      }
    });

    // li 요소를 ul에 추가
    $bookListUl.appendChild($li);
  });
}

// 2. 책 정보를 저장하는 함수
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
    alert("내용을 모두 입력해 주세요.");
    return;
  }

  // 날짜 유효성 검사
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  // 시작 날짜와 종료 날짜 비교
  if (endDateObj < startDateObj) {
    alert("종료 날짜는 시작 날짜보다 이전일 수 없습니다.");
    return;
  }

  // 날짜 형식 검사 (예: YYYY-MM-DD 형식)
  if (isNaN(startDateObj) || isNaN(endDateObj)) {
    alert("유효한 날짜 형식을 입력해 주세요. (YYYY-MM-DD)");
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
  saveToLocalStorage(); // 로컬 스토리지에 저장

  // 입력 필드 초기화
  $bookTitleInput.value = "";
  $bookAuthorInput.value = "";
  $startDateInput.value = "";
  $endDateInput.value = "";
  $bookReviewInput.value = "";
}

// 3. 책 목록 정렬 함수 (날짜순, 제목순)
function sortBooksByTitle() {
  bookList.sort((a, b) => b.title.localeCompare(a.title));
  renderBookList();
}

function sortBooksByDate() {
  bookList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  renderBookList();
}

// 4. 책 검색기능 추가
function searchBooks() {
  const searchTerm = $searchInput.value.trim().toLowerCase(); // 검색어 소문자로 변환
  if (!searchTerm) {
    renderBookList(); // 검색어가 없으면 전체 목록을 다시 렌더링
    return;
  }

  // 검색어를 포함한 책만 필터링
  const filteredBooks = bookList.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(searchTerm);
    const authorMatch = book.author.toLowerCase().includes(searchTerm);
    return titleMatch || authorMatch;
  });
  
  renderFilteredBookList(filteredBooks); // 필터링된 책 목록을 렌더링
}

// 5. 필터링된 책 목록을 렌더링 하는 함수
function renderFilteredBookList(filteredBooks) {
  $bookListUl.innerHTML = ""; // 기존 목록 초기화

  filteredBooks.forEach((book, index) => {
    // 책 정보를 담을 li 요소 생성
    const $li = document.createElement("li");
    $li.classList.add("book-item");

    // li 내부에 들어갈 HTML 작성
    $li.innerHTML = `
      <h3>${book.title} (${book.author})</h3>
      <p>독서 기간: ${book.startDate} ~ ${book.endDate}</p>
      <p>${book.review}</p>
      <button class="delete-btn" data-index="${index}">삭제</button>
    `;

    // 삭제 버튼 클릭 이벤트 등록
    const $deleteButton = $li.querySelector(".delete-btn");
    $deleteButton.addEventListener("click", () => {
      const confirmDelete = confirm("정말로 삭제하시겠습니까?");
      if (confirmDelete) {
        bookList.splice(index, 1); // 배열에서 책 정보 삭제
        renderBookList(); // 리스트 다시 렌더링
        saveToLocalStorage(); // 로컬 스토리지 업데이트
      }
    });

    $bookListUl.appendChild($li); // li 요소를 ul에 추가
  });
}

// 검색 버튼 클릭 시 검색 기능 실행
$searchButton.addEventListener("click", searchBooks);

// 엔터 키로도 검색할 수 있도록 이벤트 추가
$searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBooks();
  }
});

// ===== 로컬 스토리지 ===== //
//로컬 스토리지 저장
function saveToLocalStorage() {
  localStorage.setItem("bookList", JSON.stringify(bookList));
}
// -> 배열을 문자열로 변환해야 하기 때문에 JSON.stringify() 사용

// 로컬 스토리지에서 불러오기
function loadFromLocalStorage() {
  const saveBooks = JSON.parse(localStorage.getItem("bookList")) || [];
  bookList = saveBooks;
  renderBookList();
}
// -> 가져온 데이터가 문자열이기 때문에 JSON.parse()로 다시 배열로 변환함. 데이터가 없을 경우 기본값으로 빈 배열[]을 사용

//========= 이벤트 등록 영역 ========//
// 저장하기 버튼 클릭 이벤트
$saveButton.addEventListener("click", saveBookInfo);

// 취소하기 버튼 클릭 이벤트
$cancelButton.addEventListener("click", (event) => {
  event.preventDefault(); // 폼 기본 동작 막기
  // 입력 필드 초기화
  $bookTitleInput.value = "";
  $bookAuthorInput.value = "";
  $startDateInput.value = "";
  $endDateInput.value = "";
  $bookReviewInput.value = "";
});

// 페이지 로드 시 로컬스토리지 데이터 불러오기
window.addEventListener("DOMContentLoaded", loadFromLocalStorage);
// -> DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드된 후 실행됨

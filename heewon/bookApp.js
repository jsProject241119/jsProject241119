<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>도서관리 프로그램</title>
  <!-- favicon -->
  <link rel="icon" href="./favicon.png">
  <!-- css -->
  <link rel="stylesheet" href="bookStyle.css">
  <!-- linear icons -->
  <link rel="stylesheet" href="https://cdn.linearicons.com/free/1.0.0/icon-font.min.css">
  <link href="https://hangeul.pstatic.net/hangeul_static/css/nanum-barun-gothic.css" rel="stylesheet">
  <!-- script -->
  <script src="bookApp.js" defer></script>
</head>

<body>
  <!-- 상단 홈박스 -->
  <section>
    <div id="header-box">
      <div id="home-box">
        <a href="#">
          <i class="fas fa-home"></i>
        </a>
        <div id="menu-box">
          <a href="#">
            <i class="fas fa-book"></i>
          </a>
          <a href="#">
            <i class="fas fa-search-dollar"></i>
          </a>
          <a href="#">
            <i class="fas fa-running"></i>
          </a>
          <a href="#">
            <i class="fas fa-gamepad"></i>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- 헤더 -->
  <header>
    <div class="container">
      <h1>Book Log <i class="fas fa-book"></i></h1>
    </div>
  </header>

  <!-- 메인 콘텐츠 -->
  <main class="container">
    <!-- 입력 섹션 -->
    <section class="input-section">
      <form class="book-form">
        <!-- 책 제목 입력 -->
        <label for="book-title">책 제목:</label>
        <input type="text" id="book-title" placeholder="책 제목을 입력하세요" required />

        <!-- 저자 입력 -->
        <label for="book-author">저자:</label

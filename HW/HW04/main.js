//Canvas Element 불러오기
const canvas = document.getElementById('NumberScreenCanvas');
const ctx = canvas.getContext('2d');

// 캔버스에 세그먼트를 그리는 함수
function drawSegment(x, y, width, height) {
    ctx.fillStyle = "black"; // 색 추가
    ctx.fillRect(x, y, width, height);
  }
  
  // 입력된 숫자를 디지털 숫자로 변환하여 그리는 함수
  function drawNum(number) {
    // 각 숫자에 대한 세그먼트 배열
    const segments = [
      [1, 1, 1, 0, 1, 1, 1], // 0
      [0, 0, 1, 0, 0, 1, 0], // 1
      [1, 0, 1, 1, 1, 0, 1], // 2
      [1, 0, 1, 1, 0, 1, 1], // 3
      [0, 1, 1, 1, 0, 1, 0], // 4
      [1, 1, 0, 1, 0, 1, 1], // 5
      [1, 1, 0, 1, 1, 1, 1], // 6
      [1, 0, 1, 0, 0, 1, 0], // 7
      [1, 1, 1, 1, 1, 1, 1], // 8
      [1, 1, 1, 1, 0, 1, 1]  // 9
    ];
  
    // 세그먼트와 숫자의 크기 및 간격 설정
    const digitWidth = 40; // 숫자 하나 넓이
    const digitHeight = 80; // 숫자 하나 높이
    const segmentGap = 5; // 사이 빈칸
    const totalDigits = 9; // 총 숫자
    const totalSegments = 7; // 총 획 수
    const totalSegmentWidth = totalSegments * digitWidth + (totalDigits - 1) * segmentGap; // 간격을 제외한 세그먼트의 총 너비
    const startX = (canvas.width - totalSegmentWidth) / 2; // 세그먼트를 가운데로 정렬하기 위해 조정
    const startY = (canvas.height - digitHeight) / 2 - 20; // 캔버스를 위로 이동
  
    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const numberWidth = totalDigits * (digitWidth + segmentGap) - segmentGap;
    const startXWithPadding = (canvas.width - numberWidth) / 2;
  
    // 입력된 숫자 각 자리에 대해 디지털 숫자 그리기
    for (let i = 0; i < number.length; i++) {
      const digit = parseInt(number[i]);
      const digitSegments = segments[digit];
      const x = startXWithPadding + i * (digitWidth + segmentGap);
  
      // 7획 세그먼트 그리기
      for (let j = 0; j < digitSegments.length; j++) {
        if (digitSegments[j]) {
          switch(j) {
            case 0:
              drawSegment(x + segmentGap, startY, digitWidth - segmentGap * 2, segmentGap);
              break;
            case 1:
              drawSegment(x, startY + segmentGap, segmentGap, (digitHeight - segmentGap * 2) / 2);
              break;
            case 2:
              drawSegment(x + digitWidth - segmentGap, startY + segmentGap, segmentGap, (digitHeight - segmentGap * 2) / 2);
              break;
            case 3:
              drawSegment(x + segmentGap, startY + digitHeight / 2 - segmentGap / 2, digitWidth - segmentGap * 2, segmentGap);
              break;
            case 4:
              drawSegment(x, startY + digitHeight / 2 + segmentGap / 2, segmentGap, (digitHeight - segmentGap * 2) / 2);
              break;
            case 5:
              drawSegment(x + digitWidth - segmentGap, startY + digitHeight / 2 + segmentGap / 2, segmentGap, (digitHeight - segmentGap * 2) / 2);
              break;
            case 6:
              drawSegment(x + segmentGap, startY + digitHeight - segmentGap, digitWidth - segmentGap * 2, segmentGap);
              break;
          }
        }
      }
    }
  }
  
  // 숫자 변환 버튼 클릭 시 호출되는 함수
  function convertNumber() {
    const numberInput = document.getElementById('numberInput').value;
    // 입력된 값이 9자리 숫자이고 숫자로만 이루어져 있는지 확인
    if (numberInput.length === 9 && /^\d+$/.test(numberInput)) {
      drawNum(numberInput); // 디지털 숫자로 변환하여 그리기
    } else {
      alert('9자리 숫자를 입력해주세요.'); // 잘못된 입력 경고 메시지 표시
    }
  }
  
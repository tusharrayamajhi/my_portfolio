let outer = document.querySelector(".outer");
for(let i = 0;i<81;i++){
    let div = document.createElement("div");
    outer.appendChild(div);
    div.setAttribute("class","inner");
    
}
const inner = document.querySelectorAll(".inner");
for(let div of inner){
div.addEventListener("click",()=>{
    for(let box of inner){
        box.removeAttribute("style");
    }
        div.style.backgroundColor = "green";
    })
}



const numberbox = document.querySelector(".number");
for(let i = 1;i<=9;i++){
    let div = document.createElement("div");
    numberbox.appendChild(div);
    div.innerText = i;
    div.setAttribute("class","nums");
}
let number = document.querySelectorAll(".nums");
for(let num of number){
    num.addEventListener("click",()=>{
        const inner2 = document.querySelectorAll(".inner");
        for(let div of inner2){
            if(div.style.backgroundColor === "green"){
                let i = num.innerText;
                div.innerText = i;
            }
        }
    })      
}

document.querySelector(".reset").addEventListener("click",()=>{
    const inner = document.querySelectorAll(".inner");
    for(div of inner){
        div.removeAttribute("style");
        div.innerText = "";
    }
})
document.querySelector(".delete").addEventListener("click",()=>{
    const inner = document.querySelectorAll(".inner");
    for(div of inner){
        if(div.style.backgroundColor == "green"){
            div.innerText = "";
        }
    }
})
let sudokuBoard = [];
document.querySelector(".solve").addEventListener("click",()=>{
    sudokuBoard = [];
    const inner3 = document.querySelectorAll(".inner");
    let row2 = [];
    for(let div of inner3){
        let num;
        if(div.innerText == ''){
            num = 0;
        }else{
            num = parseInt(div.innerText);
        }
        row2.push(num);
        if(row2.length == 9){
            sudokuBoard.push(row2);
            row2 = [];
        }
    }
    const isValid = isValidSudoku(sudokuBoard);
    let inners = document.querySelectorAll(".inner");
    if (isValid) {
      solveSudoku(sudokuBoard, 0, 0)
        let i =0;
        let j =0;
      for(div of inners){
        div.innerText = sudokuBoard[i][j];
        j++;
        if(j == 9){
          i++;
          j=0;
        }
      }
    }else{
      alert("solution doesn't exits");
    }
    
})



function isValidSudoku(board) {
  // Check rows
  for (let i = 0; i < 9; i++) {
      const seen = new Set();
      for (let j = 0; j < 9; j++) {
          const num = board[i][j];
          if (num === 0) continue; // Skip empty cells
          if (seen.has(num)) return false;
          seen.add(num);
      }
  }

  // Check columns
  for (let j = 0; j < 9; j++) {
      const seen = new Set();
      for (let i = 0; i < 9; i++) {
          const num = board[i][j];
          if (num === 0) continue; // Skip empty cells
          if (seen.has(num)) return false;
          seen.add(num);
      }
  }

  // Check 3x3 subgrids (boxes)
  for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
          const seen = new Set();
          for (let i = boxRow * 3; i < boxRow * 3 + 3; i++) {
              for (let j = boxCol * 3; j < boxCol * 3 + 3; j++) {
                  const num = board[i][j];
                  if (num === 0) continue; // Skip empty cells
                  if (seen.has(num)) return false;
                  seen.add(num);
              }
          }
      }
  }

  return true;
}





function isSafe(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
          return false;
      }
  }

  // Check the row
  for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
          return false;
      }
  }

  // Check the 3x3 matrix
  const r = Math.floor(row / 3) * 3;
  const c = Math.floor(col / 3) * 3;
  for (let i = r; i <= r + 2; i++) {
      for (let j = c; j <= c + 2; j++) {
          if (board[i][j] === num) {
              return false;
          }
      }
  }
  return true;
}

function solveSudoku(board, row, col) {
  if (row === 9) {
      return true;
  }

  let newRow = row;
  let newCol = col + 1;
  if (col + 1 === 9) {
      newRow = row + 1;
      newCol = 0;
  }

  if (board[row][col] !== 0) {
      return solveSudoku(board, newRow, newCol);
  }

  for (let num = 1; num <= 9; num++) {
      if (isSafe(board, row, col, num)) {
          board[row][col] = num;
          if (solveSudoku(board, newRow, newCol)) {
              return true;
          }
          board[row][col] = 0;
      }
  }

  return false;
}


let boxes = document.querySelectorAll(".box");
let resetGameBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turn0 = true;//playerX, playerO
let count = 0; // Track button clicks for draw condition

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    turn0 = true;
    count = 0; // Reset the count
    enableBoxes();
    msgContainer.classList.add("hide");
}

boxes.forEach((box) =>{
    box.addEventListener("click", () =>{
        if(turn0){
            box.innerText = "O";
            box.classList.add("o-mark");
            turn0 = false;
        }
        else{
            box.innerText = "X";
            box.classList.add("x-mark");
            turn0 = true;
        }
        box.disabled = true;
        count++; // Increment count on each click
        
        checkWinner();
    });
});

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("x-mark", "o-mark"); // Remove color classes
    }
};

const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
    }
};

const showWinner = (winner) =>{
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const showDraw = () => {
    msg.innerText = "It's a Draw! Game Over";
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () =>{
    let winner = null;
    
    for(let pattern of winPatterns){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val != "" && pos2Val != "" && pos3Val != ""){
            if(pos1Val === pos2Val && pos2Val == pos3Val){
                winner = pos1Val;
                showWinner(winner);
                return; // Exit early if winner found
            }
        }
    }
    
    // Check for draw condition - if no winner and all boxes filled
    if(count === 9 && winner === null){
        showDraw();
    }
};

newGameBtn.addEventListener("click", resetGame);
resetGameBtn.addEventListener("click", resetGame);
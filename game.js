const createPlayer = (name) => {
    let cpuControlled = false;
    let myTurn = false;
    let points = 0;
    const cards = {
        triangle: 4,
        circle: 4,
        square: 4
    }

    const field = {
        left: "empty",
        right: "empty"
    }
    const approved = false;
    const setField = (location, attack) => {
        if (cards[attack] <= 0) {
            console.log("card not in deck")
            return 0;
        }
        field[location] = attack;
        cards[attack]--;
    }
    const addPoints = (amount) => {
        points = points + amount;
    }
    const getPoints = () => points;
    return {
        myTurn:myTurn,
        cpuControlled:cpuControlled,
        name: name,
        cards: cards,
        field: field,
        approved:approved,
        getPoints: getPoints,
        setField: setField,
        addPoints: addPoints
    }
}

const compareFields = (homeField, awayField) => {
    let leftResult = compareCards(homeField.left, awayField.left)
    let rightResult = compareCards(homeField.right, awayField.right)

    return [leftResult, rightResult]
}

const shapeComparisonObject = {
    "triangle": "square",
    "square": "circle",
    "circle": "triangle"
}

const compareCards = (card1, card2) => {
    //check if one card defeats the other
    if (shapeComparisonObject[card1] == card2) {
        //card 1 beats card2
        // console.log(`${card1} beats ${card2}`)
        return 1
    } else if (shapeComparisonObject[card2] == card1) {
        //card 2 beats card1
        // console.log(`${card1} loses to ${card2}`)
        return -1
    } else if (card1 == card2) {
        //card are equal
        // console.log(`${card1} draws with ${card2}`)
        return 0
    } else {
        //invalid card
        console.log(`${card1} or ${card2} is an invalid card.
        Valid cards are :: triangle square and circle`)
        return "invalid"
    }
}

const playerBattle = (player1, player2) => {
    //compare the players fields, assign points, then reset.
    console.log("playerBattle", player1.field, player2.field)
    console.log("playerBattle", player1, player2)
    //compare fields to generate the round object
    let round = compareFields(player1.field, player2.field)

    //Assign the points
    for (let locationScore of round) {
        if (locationScore == 1) {
            player1.addPoints(1)
        } else if (locationScore == 0) {

        } else if (locationScore == -1) {
            player2.addPoints(1)
        }
    }

    console.log(player1.getPoints(), player2.getPoints())
    // returns a score
}

const clearFields = (player1, player2) => {
    player1.setField("left", "empty")
    player1.setField("right", "empty")

    player2.setField("left", "empty")
    player2.setField("right", "empty")
}

const gameLoop = () => {
    //runs one round
    let gameResults = {
        rounds: 0,
        timeElapsed: 0,
        player1Score: 0,
        player2Score: 0,

    }

    console.log("battle")
    playerBattle(p1, p2)
    gameResults.rounds++;

    gameResults.player1Score = p1.getPoints()
    gameResults.player2Score = p2.getPoints()
    render(domPlayer1, p1);
    render(domPlayer2, p2);
    return gameResults;

}

//generate random number
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
//generate choice for cpu
const generateChoice = (playerData) =>{
    let validCards = [];
    let choice;
    
    for(let card in playerData.cards){
        console.log(card)
        
        if(playerData.cards[card] > 0){
            validCards.push(card)
        }
    }
    //generate choice
    console.log(validCards)
    choice = validCards[getRandomInt(validCards.length)]
    playerData.cards[choice]--;
    
    
    return choice;
}

//Event Handlers
const handleLocationSelection = (player, playerData) => (e) => {
    //depending on which field was selected 

    let locationSide = Array.from(e.target.classList).filter(c => c == "left" || c == "right")[0]
    //remove other classes
    e.target.classList.remove("triangle", "circle", "square")
    //set location type to current selected card type
    console.log("player.selectedCardType", player)
    if (!!player.selectedCardType) {
        e.target.classList.add(player.selectedCardType)
        console.log("type", player.selectedCardType)
        playerData.field[locationSide] = player.selectedCardType;
    } else {
        //if no card is selected let us know
        console.log("no card selected")
    }

    //set selected card to none
}
const handleCardSelection = (player) => (e) => {
    //depending on which players deck was selected using dataset name

    player.selectedCard = e.target;
    player.selectedCardType = Array.from(e.target.classList).filter(c => c == "triangle" || c == "circle" || c == "square")[0] //use [-data] instaed

    //remove selected class from other cards
    for (let domCard of Array.from(player.deck.children)) {
        domCard.classList.remove("selected")
    }
    //toggle it on this card
    player.selectedCard.classList.toggle("selected")


}
const handleApproval = (playerData, left, right) => (e) => {
    //depending on which players submit button was selected
    console.log("player", playerData, left, right)
    e.preventDefault();
    console.log("approval clicked!", e.target, left, right)
    let leftCardType = Array.from(left.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
    let rightCardType = Array.from(right.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
    // console.log(Array.from(left.classList).filter(c => c == "circle" || c=="square" || c == "triangle"))
    // console.log(Array.from(right.classList).filter(c => c == "circle" || c=="square" || c == "triangle"))
    //subtract 1 from player cards object
    console.log("playerCardTypes", leftCardType, rightCardType)
    if (playerData.cards[leftCardType] > 0 && playerData.cards[leftCardType]) {
        playerData.cards[leftCardType]--;
        playerData.cards[rightCardType]--;
        //give fields and playerData approve status
        left.classList.add("approved")
        right.classList.add("approved")
        playerData.approved = true;
        //remove this on round submit
    } else {
        console.log("error Missing either", leftCardType, rightCardType)
    }
    //re render the cards

}
const handleRoundSubmit = (p1Data, p1Left, p1Right,p2Data, p2Left, p2Right) => (e) => {
    //check if p2 is controlled by a CPU. 
    if(p2Data.cpuControlled && p1Data.approved){
        //generate p2Data computer choices based on its current deck
        console.log()
        
        console.log("p1 and bot p2", p1Data, p1Left, p1Right,p2Data, p2Left, p2Right)
        e.preventDefault();
        console.log("round submit clicked against bot!", e.target,)
        let p1LeftCardType = Array.from(p1Left.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
        let p1RightCardType = Array.from(p1Right.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
        
        let p2LeftCardType =  generateChoice(p2Data)
        let p2RightCardType =  generateChoice(p2Data)
        
        p2Data.field["left"] = p2LeftCardType;
        p2Data.field["right"] = p2RightCardType;
        
        p2Left.classList.remove("triangle", "circle", "square")
        p2Right.classList.remove("triangle", "circle", "square")
        
        p2Left.classList.add(p2LeftCardType)
        p2Right.classList.add(p2RightCardType)
        //handle location selection for p2
        
        console.log(p2LeftCardType,p2RightCardType)
        
        console.log("players CardTypes", p1LeftCardType, p1RightCardType, p2LeftCardType, p2RightCardType)
        
        p1Left.classList.remove("approved")
        p1Right.classList.remove("approved")
        
        p1Data.approved = false;
    
        gameLoop();
        
        return;
    }

    //confirm both players approved
    if(!(p1Data.approved && p2Data.approved)){
        console.log("ERROR, approval required by both players")
        return;
    }
    console.log("players", p1Data, p1Left, p1Right,p2Data, p2Left, p2Right)
    e.preventDefault();
    console.log("round submit clicked!", e.target,)
    let p1LeftCardType = Array.from(p1Left.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
    let p1RightCardType = Array.from(p1Right.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
    
    let p2LeftCardType = Array.from(p2Left.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
    let p2RightCardType = Array.from(p2Right.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
    // console.log(Array.from(left.classList).filter(c => c == "circle" || c=="square" || c == "triangle"))
    // console.log(Array.from(right.classList).filter(c => c == "circle" || c=="square" || c == "triangle"))
    //subtract 1 from player cards object
    console.log("players CardTypes", p1LeftCardType, p1RightCardType, p2LeftCardType, p2RightCardType)

    p1Data.cards[p1LeftCardType]--;
    p1Data.cards[p1RightCardType]--;
    
    p2Data.cards[p2LeftCardType]--;
    p2Data.cards[p2RightCardType]--;
    
    p1Left.classList.remove("approved")
    p1Right.classList.remove("approved")
        
    p2Left.classList.remove("approved")
    p2Right.classList.remove("approved")
    
    p1Data.approved = false;
    p2Data.approved = false;
    //battle current field vs opponent hand
    gameLoop();

}
const handleOpponentToggle = (player,playerData) => (e) =>{
    //this function will toggle the functionality of the
    //players event listeners,
    //on player2's turn the cpu will make its choice,
    //for now this is random
    player.cpuControlled = e.target.checked;
    console.log(player.name," cpuControlled", player.cpuControlled )
    //we can use this cpuControlled check in other event listener functions
}
//Players 
const name1 = "michael"
const name2 = "bbeg"
const p1 = createPlayer(name1);
const p2 = createPlayer(name2);

p1.myTurn = true;

//Html Players
const domPlayer1 = {}
domPlayer1.div = document.getElementById("player1")
domPlayer1.deck = domPlayer1.div.getElementsByClassName("cards")[0]
domPlayer1.left = domPlayer1.div.getElementsByClassName("left")[0]
domPlayer1.right = domPlayer1.div.getElementsByClassName("right")[0]
domPlayer1.approval = domPlayer1.div.getElementsByClassName("approval")[0]
domPlayer1.selectedCard;
domPlayer1.selectedCardType;

const domPlayer2 = {}
domPlayer2.div = document.getElementById("player2")
domPlayer2.deck = domPlayer2.div.getElementsByClassName("cards")[0]
domPlayer2.left = domPlayer2.div.getElementsByClassName("left")[0]
domPlayer2.right = domPlayer2.div.getElementsByClassName("right")[0]
domPlayer2.approval = domPlayer2.div.getElementsByClassName("approval")[0]
domPlayer2.selectedCard;
domPlayer2.selectedCardType;

//submit round 
const roundSubmitButton = document.getElementById("round-submit");
//toggle cpu player
const toggleOpponentBox = document.getElementById("toggle-cpu");
//Assign html players event listeners
domPlayer1.left.addEventListener("click", handleLocationSelection(domPlayer1, p1))
domPlayer1.right.addEventListener("click", handleLocationSelection(domPlayer1, p1))

domPlayer1.approval.addEventListener("click", handleApproval(p1, domPlayer1.left, domPlayer1.right))

domPlayer2.left.addEventListener("click", handleLocationSelection(domPlayer2, p2))
domPlayer2.right.addEventListener("click", handleLocationSelection(domPlayer2, p2))

domPlayer2.approval.addEventListener("click", handleApproval(p2, domPlayer2.left, domPlayer2.right))

//submit round listner
roundSubmitButton.addEventListener("click",handleRoundSubmit(p1, domPlayer1.left, domPlayer1.right,p2, domPlayer2.left, domPlayer2.right))
//toggle players listener
toggleOpponentBox.addEventListener("click",handleOpponentToggle(p2,domPlayer2))
//generate decks based on player data
const render = (player, playerData) => {

    //remove all cards
    while (player.deck.firstChild) {
        player.deck.removeChild(player.deck.firstChild);
    }

    //generate new cards
    for (let shape in playerData.cards) {
        for (let i = 0; i < playerData.cards[shape]; i++) {
            let cardDiv = document.createElement("img")
            //add shape to this card
            cardDiv.classList.add(shape)
            cardDiv.src = `assets/${shape}-card.svg`;
            cardDiv.dataset.playerName = playerData.name
            cardDiv.classList.add("card")

            player.deck.appendChild(cardDiv)
            cardDiv.addEventListener("click", handleCardSelection(player))
        }
    }
}

//render each player once
render(domPlayer1, p1);
render(domPlayer2, p2);

//TODO a global button to submit both fields
//the current submit event handler will basically be changed to an "approval" check from each player before ending the round
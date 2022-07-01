

//triangle defeat square defeat circle defeat triangle

const createPlayer = (name) => {
    let points = 0;
    const cards = 
    {triangle:4,
    circle:4,
    square:4}
    
    const field = {left:"empty",right:"empty"}
    const setField = (location,attack) => {
        if(cards[attack] <= 0){
            console.log("card not in deck")
            return 0;
        }
        field[location] = attack;
        cards[attack]--;
    }
    const addPoints = (amount) => {
        points = points+amount;
    }
    const getPoints = () => points;
    return{
        name:name,
        cards:cards,
        field:field,
        getPoints:getPoints,
        setField:setField,
        addPoints:addPoints
    }
}

const compareFields = (homeField,awayField) => {
    let leftResult = compareCards(homeField.left,awayField.left) 
    let rightResult = compareCards(homeField.right,awayField.right) 
    
    return[leftResult,rightResult]
}

const shapeComparisonObject = {"triangle":"square",
"square":"circle",
"circle":"triangle"
}

const compareCards = (card1,card2) =>{
    //check if one card defeats the other
    if(shapeComparisonObject[card1] == card2){
        //card 1 beats card2
        // console.log(`${card1} beats ${card2}`)
        return 1
    }
    else if(shapeComparisonObject[card2] == card1){
        //card 2 beats card1
        // console.log(`${card1} loses to ${card2}`)
        return -1
    }
    else if(card1 == card2){
        //card are equal
        // console.log(`${card1} draws with ${card2}`)
        return 0
    }
    else{
        //invalid card
        console.log(`${card1} or ${card2} is an invalid card.
        Valid cards are :: triangle square and circle`)
        return "invalid"
    }
}



const playerBattle = (player1,player2) => {
    //compare the players fields, assign points, then reset.
    console.log("playerBattle",player1.field, player2.field)

    //compare fields to generate the round object
    let round = compareFields(michael.field,opponent.field)
    
    //Assign the points
    for(let locationScore of round){
        if(locationScore == 1){
            player1.addPoints(1)
        }
        else if(locationScore == 0){
            
        }
        else if(locationScore == -1){
            player2.addPoints(1)
        }
    }
    // console.log("points", player1.getPoints(), player2.getPoints())
    // console.log("players",player1,player2)
    console.log(player1.getPoints(),player2.getPoints())
    // returns a score
}

const clearFields = (player1,player2) => {
    player1.setField("left","empty")
    player1.setField("right","empty")

    player2.setField("left","empty")
    player2.setField("right","empty")
}

let michael = createPlayer("michael");
let opponent = createPlayer("bbeg");

//placeholder
opponent.setField("left","square")
opponent.setField("right","square")



// playerBattle(michael,opponent)


const gameLoop = () => {
    //runs one round
    let gameResults = {
        rounds:0,
        timeElapsed:0,
        player1Score:0,
        player2Score:0,
        
    }
    
    playerBattle(michael,opponent)
    gameResults.rounds++;
    
    console.log("michael.score",michael.getPoints())
    gameResults.player1Score = michael.getPoints()
    gameResults.player2Score = opponent.getPoints()
    
    render();
    return gameResults;
    
}
//need a way to advance the game, add points, go to the next step, and then complete the game 
let domPlayer1 = document.getElementById("player1")
let domPlayer1Deck = domPlayer1.getElementsByClassName("cards")[0]
let domPlayer1Left = domPlayer1.getElementsByClassName("left")[0]
let domPlayer1Right = domPlayer1.getElementsByClassName("right")[0]
let domPlayer1Submit = domPlayer1.getElementsByClassName("submit")[0]
let currentSelectedCard;
let currentSelectedCardType;

let handleLocationSelection = (e) => {
    let locationSide = Array.from(e.target.classList).filter(c => c == "left" || c =="right")[0]
    //remove other classes
    e.target.classList.remove("triangle","circle","square")
    //set location type to current selected card type
    if(!!currentSelectedCardType){
        e.target.classList.add(currentSelectedCardType)
        console.log("type",currentSelectedCardType)
        michael.field[locationSide] = currentSelectedCardType;
    }
    else{
        //if no card is selected let us know
        console.log("no card selected")
    }
    
    //set selected card to none
}
let handleCardSelection = (e) => {
    currentSelectedCard= e.target;
    currentSelectedCardType = Array.from(e.target.classList).filter(c => c == "triangle" || c =="circle" || c=="square")[0] //use [-data] instaed
    
    //remove selected class from other cards
    for(let domCard of Array.from(domPlayer1Deck.children)){
        domCard.classList.remove("selected")
    }
    //toggle it on this card
    currentSelectedCard.classList.toggle("selected")
}
let handleSubmit = (left,right) =>  (e) => {
    e.preventDefault();
    console.log("submit clicked!",e.target, left,right)
    let leftCardType = Array.from(left.classList).filter(c => c == "circle" || c=="square" || c == "triangle")[0];
    let rightCardType = Array.from(right.classList).filter(c => c == "circle" || c=="square" || c == "triangle")[0];
    // console.log(Array.from(left.classList).filter(c => c == "circle" || c=="square" || c == "triangle"))
    // console.log(Array.from(right.classList).filter(c => c == "circle" || c=="square" || c == "triangle"))
    //subtract 1 from player cards object
    if(michael.cards[leftCardType] > 0 && michael.cards[leftCardType]){
        michael.cards[leftCardType]--;
        michael.cards[rightCardType]--;
        //battle current field vs opponent hand
        gameLoop();
    }
    else{
        console.log("error Missing either",leftCardType,rightCardType)
    }
    //re render the cards
    
}
domPlayer1Left.addEventListener("click",handleLocationSelection)
domPlayer1Right.addEventListener("click",handleLocationSelection)

domPlayer1Submit.addEventListener("click",handleSubmit(domPlayer1Left,domPlayer1Right))

//generate deck
let render = () => {
    
    //remove all cards
    while (domPlayer1Deck.firstChild) {
        domPlayer1Deck.removeChild(domPlayer1Deck.firstChild);
    }
    
    //generate new cards
    for(let shape in michael.cards){
    for(let i = 0; i <michael.cards[shape]; i++){
        let cardDiv = document.createElement("div")
        //add shape to this card
        cardDiv.classList.add(shape)
        
        cardDiv.classList.add("card")
        
        domPlayer1Deck.appendChild(cardDiv)
        cardDiv.addEventListener("click",handleCardSelection)
    }
}
}

render();
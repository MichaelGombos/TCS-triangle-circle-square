

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

const promptFieldInput = (player1,player2) => {
    
    let player1FullField = prompt(`Player1${player1.name} enter your field input seperated by spaces`)
    let player2FullField = prompt(`Player2${player2.name} enter your field input seperated by spaces`)
    
    // let player1FullField  = "triangle triangle"
    // let player2FullField = "square squre"
    
    player1.field.left = player1FullField.split(" ")[0]
    player1.field.right = player1FullField.split(" ")[1]
    
    player2.field.left = player2FullField.split(" ")[0]
    player2.field.right = player2FullField.split(" ")[1]
}

const playerBattle = (player1,player2) => {
    //compare the players fields, assign points, then reset.
    
    //ask the user for field input
    promptFieldInput(player1,player2)
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


michael.setField("left","triangle")
michael.setField("right","square")

opponent.setField("left","square")
opponent.setField("right","square")



// playerBattle(michael,opponent)


const gameLoop = () => {
    let gameResults = {
        rounds:0,
        timeElapsed:0,
        player1Score:0,
        player2Score:0,
        
    }
    
    console.log("michael.score",michael.getPoints())
    while (michael.getPoints() < 3 && opponent.getPoints() < 3){
        //request for input
        playerBattle(michael,opponent)
        gameResults.rounds++;
    }

    console.log("michael",michael)
    console.log("michael.score",michael.getPoints())
    gameResults.player1Score = michael.getPoints()
    gameResults.player2Score = opponent.getPoints()
    
    return gameResults;
}
console.log(gameLoop());
//need a way to advance the game, add points, go to the next step, and then complete the game 
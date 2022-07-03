const createPlayer = (name) => {
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
        name: name,
        cards: cards,
        field: field,
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


    playerBattle(p1, p2)
    gameResults.rounds++;

    gameResults.player1Score = p1.getPoints()
    gameResults.player2Score = p2.getPoints()
    render(domPlayer1, p1);
    render(domPlayer2, p2);
    return gameResults;

}
//need a way to advance the game, add points, go to the next step, and then complete the game 

//Event Handlers
let handleLocationSelection = (player, playerData) => (e) => {
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
let handleCardSelection = (player) => (e) => {
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
let handleSubmit = (playerData, left, right) => (e) => {
    //depending on which players submit button was selected
    console.log("player", playerData, left, right)
    e.preventDefault();
    console.log("submit clicked!", e.target, left, right)
    let leftCardType = Array.from(left.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
    let rightCardType = Array.from(right.classList).filter(c => c == "circle" || c == "square" || c == "triangle")[0];
    // console.log(Array.from(left.classList).filter(c => c == "circle" || c=="square" || c == "triangle"))
    // console.log(Array.from(right.classList).filter(c => c == "circle" || c=="square" || c == "triangle"))
    //subtract 1 from player cards object
    console.log("playerCardTypes", leftCardType, rightCardType)
    if (playerData.cards[leftCardType] > 0 && playerData.cards[leftCardType]) {
        playerData.cards[leftCardType]--;
        playerData.cards[rightCardType]--;
        //battle current field vs opponent hand
        gameLoop();
    } else {
        console.log("error Missing either", leftCardType, rightCardType)
    }
    //re render the cards

}

//Players
let name1 = "michael"
let name2 = "bbeg"
let p1 = createPlayer(name1);
let p2 = createPlayer(name2);

//Html Players
let domPlayer1 = {}
domPlayer1.div = document.getElementById("player1")
domPlayer1.deck = domPlayer1.div.getElementsByClassName("cards")[0]
domPlayer1.left = domPlayer1.div.getElementsByClassName("left")[0]
domPlayer1.right = domPlayer1.div.getElementsByClassName("right")[0]
domPlayer1.submit = domPlayer1.div.getElementsByClassName("submit")[0]
domPlayer1.selectedCard;
domPlayer1.selectedCardType;

let domPlayer2 = {}
domPlayer2.div = document.getElementById("player2")
domPlayer2.deck = domPlayer2.div.getElementsByClassName("cards")[0]
domPlayer2.left = domPlayer2.div.getElementsByClassName("left")[0]
domPlayer2.right = domPlayer2.div.getElementsByClassName("right")[0]
domPlayer2.submit = domPlayer2.div.getElementsByClassName("submit")[0]
domPlayer2.selectedCard;
domPlayer2.selectedCardType;

//Assign html players event listeners
domPlayer1.left.addEventListener("click", handleLocationSelection(domPlayer1, p1))
domPlayer1.right.addEventListener("click", handleLocationSelection(domPlayer1, p1))

domPlayer1.submit.addEventListener("click", handleSubmit(p1, domPlayer1.left, domPlayer1.right))

domPlayer2.left.addEventListener("click", handleLocationSelection(domPlayer2, p2))
domPlayer2.right.addEventListener("click", handleLocationSelection(domPlayer2, p2))

domPlayer2.submit.addEventListener("click", handleSubmit(p2, domPlayer2.left, domPlayer2.right))

//generate decks based on player data
let render = (player, playerData) => {

    //remove all cards
    while (player.deck.firstChild) {
        player.deck.removeChild(player.deck.firstChild);
    }

    //generate new cards
    for (let shape in playerData.cards) {
        for (let i = 0; i < playerData.cards[shape]; i++) {
            let cardDiv = document.createElement("div")
            //add shape to this card
            cardDiv.classList.add(shape)
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
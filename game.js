

//triangle defeat square defeat circle defeat triangle

let createPlayer = (name) => {
    const cards = 
    {triangle:4,
    circle:4,
    square:4}
    
    let field = {left:"empty",right:"empty"}
    let setField = (location,attack) => {
        field[location] = attack;
    }
    let getField = ()=> {
        return field;
    }
    let getDeck = ()=> {
        return cards;
    }
    return{
        name:name,
        cards:cards,
        field:field,
        setField:setField,
    }
}

let compareFields = (homeField,awayField) => {
    let leftResult = compareCards(homeField.left,awayField.left) 
    let rightResult = compareCards(homeField.right,awayField.right) 
    
    console.log("leftResult",leftResult)
    console.log("rightResult",rightResult)
}

let shapeComparisonObject = {"triangle":"square",
"square":"circle",
"circle":"triangle"
}
let compareCards = (card1,card2) =>{
    //check if one card defeats the other
    if(shapeComparisonObject[card1] == card2){
        //card 1 beats card2
        console.log(`${card1} beats ${card2}`)
        return 1
    }
    else if(shapeComparisonObject[card2] == card1){
        //card 2 beats card1
        console.log(`${card2} beats ${card1}`)
        return -1
    }
    else if(card1 == card2){
        //card are equal
        console.log(`${card1} draws with ${card2}`)
        return 0
    }
    else{
        //invalid card
        console.log(`${card1} or ${card2} is an invalid card.
        Valid cards are :: triangle square and circle`)
    }
}

let michael = createPlayer("michael");
let opponent = createPlayer("bbeg");

michael.setField("left","triangle")
michael.setField("right","square")

opponent.setField("left","square")
opponent.setField("right","square")

console.log(compareFields(michael.field,opponent.field))
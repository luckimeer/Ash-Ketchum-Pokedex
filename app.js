// DOM Objects
const leftScreen = document.querySelector('.left-screen');
const rightScreen = document.querySelector('.right-container__screen');
const pokeName = document.querySelector('.name');
const pokeId = document.querySelector('.id');
const pokeFrontImg = document.querySelector('.front');
const pokeBackImg = document.querySelector('.back');
const pokeTypeOne = document.querySelector('.pokemon-type-one');
const pokeTypeTwo = document.querySelector('.pokemon-type-two');
const pokeWeight = document.querySelector('.pokemon-weight');
const pokeHeight = document.querySelector('.pokemon-height');
const pokeExperience = document.querySelector('.level-screen');
const onOff = document.querySelector('.on-blue-btn');
const pokeListItems = document.querySelectorAll('.list-item');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');
const welcomeMsg = document.querySelector('.welcome-screen');
const stats = document.querySelector('.stats');


// Constants and Variables
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];

let prevUrl = null;
let nextUrl = null;

const options = {
    strings: ['Hi there 👋🏼 I\'m Ash Ketchum. Thanks for visiting my Pokedex.', 'These are all the Pokemon that exist within the Pokemon world. Enjoy, thank you for visiting! Click on a Pokemon on the Right screen to get started!'],
    showCursor: false, 
    typeSpeed: 75,
    backSpeed: 50
};


// Functions
const startPokedex = () => {
    leftScreen.classList.remove('hide');
    welcomeMsg.classList.remove('hide');
    let typed = new Typed('.welcome-screen', options);
    rightScreen.classList.remove('hide');
};

const resetScreen = () => {
    leftScreen.classList.remove('hide');
    welcomeMsg.classList.add('hide');
    stats.classList.remove('hide');
    for (const type of TYPES) {
        leftScreen.classList.remove(type);
    }
};

const fetchPokeList = url => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const { results, previous, next } = data;
            prevUrl = previous;
            nextUrl = next;

            for (let i = 0; i < pokeListItems.length; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];

                if (resultData) {
                    const { name, url } = resultData;
                    const urlArray = url.split('/')
                    const id = urlArray[urlArray.length -2];
                    pokeListItem.textContent = id + '. ' + name;
                } else {
                    pokeListItem.textContent = '';
                }
            }
        });

};

const fetchPokeData = id => {
    // get data for left side of screen
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {

        resetScreen();

        pokeName.textContent = data['name'];
        pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
        pokeWeight.textContent = data['weight'];
        pokeHeight.textContent = data['height'];

        const dataTypes = data['types'];
        const dataFirstType = dataTypes[0];
        const dataSecondType = dataTypes[1];
        pokeTypeOne.textContent = dataTypes[0]['type']['name'];

        if(dataSecondType) {
            pokeTypeTwo.textContent = dataSecondType['type']['name'];
        } else {
            pokeTypeTwo.textContent = '';
            pokeTypeTwo.classList.add('hide');
        }

        leftScreen.classList.add(dataFirstType['type']['name']);


        pokeFrontImg.src = data['sprites']['front_default'];
        pokeBackImg.src = data['sprites']['back_default'];

        pokeExperience.textContent = 'XP: ' + data['base_experience'];
    });
};

const handleLefttButtonClick = () => {
    if(prevUrl) {
        fetchPokeList(prevUrl);
    }
};

const handleRightButtonClick = () => {
    if(nextUrl) {
        fetchPokeList(nextUrl);
    }
};

const handleListItemClick = (e) => {
    if(!e.target) return;

    const listItem = e.target;
    if(!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
};



// Event Listeners
leftBtn.addEventListener('click', handleLefttButtonClick);
rightBtn.addEventListener('click', handleRightButtonClick);
onOff.addEventListener('click', startPokedex);

for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
};


// Initialize app
fetchPokeList('https://pokeapi.co/api/v2/pokemon?limit=0&offset=20')
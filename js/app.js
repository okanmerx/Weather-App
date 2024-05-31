const apiKey = 'Ù¾ÙÎùïÝ9ë¸nu×½yç§{w';
const input = document.querySelector('input')
const form = document.querySelector('form')

let cities = {}

const renderCityCard = (city) => {
    const { name, description, icon, temp, country, time } = city;

    const date = new Date(time * 1000); // last update time
    const now = new Date();
    const difference = Math.round((now - date) / 1000 / 60);  // time since last update

    
    const html = `
        <div class="col" data-name="${name}, ${country}">
        <div class="city">
            <h2 class="city-name">
            <span>${name}</span>
            <span class="country-code">${country}</span>
            <i class="bi bi-x-circle-fill close-icon text-danger"></i>
            </h2>
            <div class="city-temp">${temp}<sup>°F</sup></div>
            <figure>
            <img
                src="https://openweathermap.org/img/wn/${icon}@2x.png"
                class="city-icon"
                alt="icon"
            />
            <figcaption>${description}</figcaption>
            </figure>
            <div class="card-footer">
            <small class="text-body-secondary"
                >Last updated ${difference} mins ago</small
            >
            </div>
        </div>
        </div>
  `

   
    document.querySelector('.cities').insertAdjacentHTML("beforeend", html)
}

function renderError(message) {
    document.querySelector('.error-message').textContent = message
}



form.addEventListener('submit', (e) => {
    e.preventDefault()
    renderError('')
    const city = input.value
    getData(city)
    form.reset()
})

async function getData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${btoa(apiKey)}&units=imperial`;

    try {
        const res = await axios.get(url)
        console.log(res)

        const cityAndCountry = res.data.name + ', ' + res.data.sys.country

        if (!cities[cityAndCountry]) {
            cities[cityAndCountry] = {
                description: res.data.weather[0].description,
                icon: res.data.weather[0].icon,
                temp: res.data.main.temp,
                country: res.data.sys.country,
                name: res.data.name,
                time: res.data.dt,
                id: res.data.id
            }

            
            localStorage.setItem('cities', JSON.stringify(cities))

            
            renderCityCard(cities[cityAndCountry])
        } else {
            throw new Error(`${city} is already in our list!`)
        }
    } catch (err) {
        console.log(err)
        renderError(err.message)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cities = JSON.parse(localStorage.getItem('cities')) || {}
    console.log(cities)
    
    Object.keys(cities).forEach((cityName) => {
        getData(cityName)
    })
})


setInterval(() => {
   
    document.querySelector('.cities').innerHTML = ''
    
    Object.values(cities).forEach((city) => {
        console.log(city)
        renderCityCard(city)
    })
}, 10000)


document.querySelector('.cities').addEventListener('click', (e) => {
    if (e.target.classList.contains('close-icon')) {
        const card = e.target.closest('.col')
        
        const city = card.dataset.name
        
        delete cities[city]
        
        card.remove()

        localStorage.setItem('cities', JSON.stringify(cities))
    }
})





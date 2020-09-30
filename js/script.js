const gallery = document.getElementById('gallery');
const randomUserUrl = 'https://randomuser.me/api/?nat=us&results=12';

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function generateHTML (data) {
    const users = data.results;
    let html = ``;
    for(let user of users) {
        html += `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src=${user.picture.large} alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="card-text">${user.email}</p>
                    <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
            </div>       
        `;
    }
    gallery.insertAdjacentHTML('beforeend', html);
}

fetchData(randomUserUrl)
    .then(generateHTML)
    .catch( err => {
        gallery.insertAdjacentHTML('beforeend', '<h2>Something went wrong!</h2>');
        console.error(err)
    });
const URL = 'https://api.github.com/';
const app = document.querySelector('#app');
// ROUTING
const locationResolver = (location) => {
    if (location === '#users' || location === '#repos') {
        if (!document.getElementById(`${location.slice(1)}`).classList.contains('active')) {
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            document.getElementById(`${location.slice(1)}`).classList.add("active");
        }
    }
    switch (location) {
        case "#users" :
            app.innerHTML = `<form id="myForm" class="searchUsers" onsubmit="getUsers()">
                                <input placeholder="Search for users" id="search" type="text"/>
                             </form>
                             <div id="results" class="flexStyle"></div>`;
            break;
        case "#repos" :
            app.innerHTML = `<form id="form" class="searchRepo" onsubmit="getRepo()">
                                <input placeholder="Search Repo" id="search" type="text"/>
                             </form>
                             <div id="results"></div>`;
            break;
        case `#user/${location.slice(6)}` :
            getRepoForUser(1, location.slice(6));
            app.innerHTML = `<div id="results"></div>`;
            break;
    }
};

window.addEventListener('load', (event) => {
    const location = window.location.hash;
    if (location) {
        locationResolver(location)
    }
});

window.addEventListener('popstate', (event) => {
    const location = window.location.hash;
    if (location) {
        locationResolver(location)
    }
});

// GET USERS AND RENDER
function getUsers(page = 1) {
    event.preventDefault();
    let search = document.getElementById("search").value;
    let query = search.split(' ').join('');
    fetch(`${URL}search/users?q=${query}&page=${page}&per_page=20`)
        .then((result) => result.json())
        .then((data) => {
            document.getElementById("results").innerHTML =
                `<div class="pagination">
                   <button id="prev" onClick="prevPage('user')">Prev</button>
                   <button id="next" onClick="nextPage('user')">Next</button>
                   </div>${ data.items.map(item =>
                    `<div class="userContent">
                       <a href="#user/${item.login}"
                        onClick="locationResolver(this.href)">
                        <img src="${item.avatar_url}" class="image"/>
                        </a> 
                        <div>${item.login}</div>
                     </div>`)} 
                   <div class="pagination">
                   <button id="prev" onClick="prevPage('user')">Prev</button>
                   <button id="next" onClick="nextPage('user')">Next</button>
                   </div>`
        })
}

const pageAdd = (function (isAdd) {
    let counter = 1;
    return function (isAdd) {
        isAdd ? counter += 1 : counter !== 1 ? counter -= 1 : counter;
        return counter;
    }
})();

function nextPage(page, user) {
    page === 'user' ? getUsers(pageAdd(true)) : page === 'repo' ?
        getRepo(pageAdd(true)) : getRepoForUser(pageAdd(true), user);
}

function prevPage(page, user) {
    page === 'user' ? getUsers(pageAdd(false)) : page === 'repo' ?
        getRepo(pageAdd(false), user) : getRepoForUser(pageAdd(false), user);
}

// GET REPOS AND RENDER
function getRepo(page = 1) {
    event.preventDefault();
    let search = document.getElementById("search").value;
    let query = search.split(' ').join('');
    fetch(`${URL}search/repositories?q=${query}&page=${page}&per_page=20`)
        .then((result) => result.json())
        .then((data) => {
            document.getElementById("results").innerHTML =
                `<div class="pagination">
                        <button  id="prev" onClick="prevPage('repo')">Prev</button >
                        <button  id="next" onClick="nextPage('repo')">Next</button >
                     </div>${ data.items.map(item =>
                    `<div class="repoContent">
                        <div>${item.name}</div>
                        <a href="${item.owner.html_url}">${item.url}</a>
                     </div>`)}
                     <div class="pagination">
                        <button  id="prev" onClick="prevPage('repo')">Prev</button >
                        <button  id="next" onClick="nextPage('repo')">Next</button >
                     </div>`
        })

}

// GET USERS REPOS AND RENDER
function getRepoForUser(page, user, url) {
    fetch(`${URL}users/${user}/repos?page=${page}&per_page=20`)
        .then((result) => result.json())
        .then((data) => {
            document.getElementById("results").innerHTML =
                ` <div class="userContent">
                       <img src="${data[0].owner.avatar_url}" class="image"/>
                        <div>${user}</div>
                     </div>
                     <div class="pagination">
                        <button  id="prev" onClick="prevPage('repoUser', '${user}')">Prev</button >
                        <button  id="next" onClick="nextPage('repoUser', '${user}')">Next</button >
                     </div>
                ${ data.map(item =>
                    `<div class="repoContent">
                        <div>${item.name}</div>
                        <a href="${item.owner.html_url}">${item.url}</a>
                     </div>`)}
                     <div class="pagination">
                        <button  id="prev" onClick="prevPage('repoUser', '${user}')">Prev</button >
                        <button  id="next" onClick="nextPage('repoUser', '${user}')">Next</button >
                     </div>`
        })

}

import axios from "axios";const CLIENT_ID = "Iv1.c4510db6cbbb970f";const SEC = "65676523e6026cf9afbb2cc32ed950c0ea3b9240";const params = `?client_id=${CLIENT_ID}&client_secret=${SEC}`;function getUserProfiles(username){    return axios.get(`https://api.github.com/users/${username}${params}`)        .then((user) => user.data);}function getRepos(username){    return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`)}function getStarCount(repos){    return repos.data.reduce((count, repo) => {        return count + repo.stargazers_count;    }, 0)}function calculateScore(profile, repos){    const followers = profile.followers;    const stars = getStarCount(repos);            return (followers * 3 ) + stars;}function handleerror(err){    if(err){        console.warn(err)        return !1;    }}function getUserData(player){    return axios.all([        getUserProfiles(player),        getRepos(player)    ])        .then((data) => {        const [profile, repos] = data;                return{            profile: profile,            score: calculateScore(profile, repos)        }    })}function sortPlayers (players){    return players.sort((a,b) => b.score - a.score)}const API_CALLS = {        fetchPopularRepos: function (language) {        let encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}        &sort=stars&order=desc&type=Repositories`);        return axios.get(encodedURI)            .then((response) => response.data.items)    },        battle: function(players){        return axios.all(players.map(getUserData))            .then(sortPlayers)            .catch(handleerror)    }    };export default API_CALLS;
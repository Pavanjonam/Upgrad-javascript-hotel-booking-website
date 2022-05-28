
const API_URL = "https://travel-advisor.p.rapidapi.com/";
const travelAdvisorHost = "travel-advisor.p.rapidapi.com";
const travelAdvisorKey = "7a54bb848fmshfb488ece4937a3fp167955jsn3f87ad320431";


let viewMore = () => {
    let viewMoreButtonElement = document.getElementById("view-more-button");
    if (viewMoreButtonElement.innerText == "View More") {
        document.getElementById("view-more-city-cards").style.display = "block";
        viewMoreButtonElement.innerText = "View Less";
    }
    else {
        document.getElementById("view-more-city-cards").style.display = "none";
        viewMoreButtonElement.innerText = "View More";
    }
}


let debounce = (func, wait, immediate) => {
    let timeout;
    return function executedFunction() {
        let context = this;
        let args = arguments;
        let later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

let search = () => {
    let currentFocus;
    let searchInputElement = document.getElementById("search-input");

    searchInputElement.addEventListener("input", debounce(function (e) {

        let newValue = this.value;

        let xhr = new XMLHttpRequest();
        if (!newValue || newValue.length < 3) {
            closeAllLists();
            return false;
        }

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {

                closeAllLists();
                const data = JSON.parse(this.responseText).data;
                const geos = data.filter((element) => {
                    return element.result_type === "geos"
                });
                let loactionList = [];
                geos.forEach((element) => {
                    loactionList.push(element.result_object.name);
                });
                currentFocus = -1;

                let searchListDiv = document.createElement("div");
                searchListDiv.setAttribute("id", searchInputElement.id + "search-list");
                searchListDiv.setAttribute("class", "search-items");

                searchInputElement.parentNode.appendChild(searchListDiv);

                for (let i = 0; i < loactionList.length; i++) {

                    if ((loactionList[i].toUpperCase()).includes(newValue.toUpperCase())) {

                        let listElementDiv = document.createElement("div");
                        listElementDiv.setAttribute("onClick", "window.location='list.html?city=" + loactionList[i] + "'");
                        listElementDiv.innerText = loactionList[i];

                        listElementDiv.innerHTML += "<input type='hidden' value='" + loactionList[i] + "'>";

                        listElementDiv.addEventListener("click", function (e) {

                            searchInputElement.value = this.getElementsByTagName("input")[0].value;

                            closeAllLists();
                        });
                        searchListDiv.appendChild(listElementDiv);
                    }
                }
            }
        });

        xhr.open("GET", API_URL + "locations/auto-complete?lang=en_US&units=km&query=" + newValue);
        xhr.setRequestHeader("x-rapidapi-host", travelAdvisorHost);
        xhr.setRequestHeader("x-rapidapi-key", travelAdvisorKey);

        xhr.send();

    }, 500));

    let closeAllLists = elmnt => {

        let x = document.getElementsByClassName("search-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != searchInputElement) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", e => {
        closeAllLists(e.target);
    });
}


search();

disableLoader();

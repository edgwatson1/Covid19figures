let summaryData;

var getData = fetch("https://api.covid19api.com/summary")
  .then((response) => response.json())
  .then((data) => {
    summaryData = data;
    countriesArray = data.Countries;
    renderAllData();
  });

const renderAllData = () => {
  date.innerHTML = moment(summaryData.Date).format("MMMM Do YYYY, h:mm:ss a");

  const rowCreator = summaryData.Countries.map((countryArray) => {
    return rowHTML(countryArray);
  });
  rowCreator.unshift(globalRowCreator());
  tableRow.innerHTML = rowCreator.join("");
};

const displayMatches = () => {
  const matches = filterFunc(countriesArray, searchInput.value);
  if (matches.length > 0) {
    const rowCreator = matches.map((countryArray) => {
      return rowHTML(countryArray);
    });
    rowCreator.unshift(globalRowCreator());
    tableRow.innerHTML = rowCreator.join("");
  } else {
    return (tableRow.innerHTML = globalRowCreator() + "<h2>No matches</h2>");
  }
};

const filterFunc = (countriesToFilter, wordToMatch) => {
  const regex = new RegExp(wordToMatch, "gi");
  return countriesToFilter.filter((country) => {
    return country.Country.match(regex);
  });
};

const globalRowCreator = () => {
  let globalRow = `<tr class="global-data">
            <td>Global</td>    
            <td>${summaryData.Global.NewConfirmed.toLocaleString()}</td>
            <td>${summaryData.Global.TotalConfirmed.toLocaleString()}</td>
            <td>${summaryData.Global.NewDeaths.toLocaleString()}</td>
            <td>${summaryData.Global.TotalDeaths.toLocaleString()}</td>
            <td>${summaryData.Global.NewRecovered.toLocaleString()}</td>
            <td>${summaryData.Global.TotalRecovered.toLocaleString()}</td>
        </tr>`;
  return globalRow;
};

const rowHTML = (countryArray) => {
  return `<tr>
            <td>${countryArray.Country}</td>
            <td>${countryArray.NewConfirmed.toLocaleString()}</td>
            <td>${countryArray.TotalConfirmed.toLocaleString().toLocaleString()}</td>
            <td>${countryArray.NewDeaths.toLocaleString().toLocaleString()}</td>
            <td>${countryArray.TotalDeaths.toLocaleString().toLocaleString()}</td>
            <td>${countryArray.NewRecovered.toLocaleString().toLocaleString()}</td>
            <td>${countryArray.TotalRecovered.toLocaleString().toLocaleString()}</td>
           
          </tr>`;
};

// DOM manipulation

const tableRow = document.querySelector("tbody");
const searchInput = document.querySelector("input");
const date = document.getElementById("date");

searchInput.addEventListener("change", displayMatches);
searchInput.addEventListener("keyup", displayMatches);

window.onload = function () {
  searchInput.value = "";
};

// sort-function
let reversed = true;

const countrySortDescending = (property) => {
  if (reversed === true) {
    if (browser === "F") {
      reversed = !reversed;
      summaryData.Countries.sort((a, b) =>
        b[property] < a[property] ? -1 : 1
      );
    } else {
      reversed = !reversed;
      summaryData.Countries.sort((a, b) =>
        b[property] > a[property] ? 1 : -1
      );
    }
  } else {
    if (reversed === false) {
      if (browser === "F") {
        reversed = !reversed;
        summaryData.Countries.sort((a, b) =>
          b[property] < a[property] ? 1 : -1
        );
      } else {
        reversed = !reversed;
        summaryData.Countries.sort((a, b) =>
          b[property] > a[property] ? -1 : 1
        );
      }
    }
  }
  searchInput.value !== "" ? displayMatches() : renderAllData();
};

navigator.sayswho = (function () {
  var ua = navigator.userAgent,
    tem,
    M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return "IE " + (tem[1] || "");
  }
  if (M[1] === "Chrome") {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) return tem.slice(1).join(" ").replace("OPR", "Opera");
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(" ");
})();

const browser = navigator.sayswho[0];

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);

buildPlot("Amzn")
// Submit Button handler
function handleSubmit() {
    
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input value from the form
    var stock = d3.select("#stockInput").node().value;
    console.log(stock);
 
    // clear the input value
    d3.select("#stockInput").node().value = "";

    // Build the plot with the new stock
    buildPlot(stock);
}



function buildPlot(stock) {
    console.log("hey I'm in my function")
    var apiKey = "ZmcsrcxBxu3Y5ykz_yge";
    var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=2017-01-01&end_date=2018-11-22&api_key=${apiKey}`;

    d3.json(url).then(function(data) {
        console.log("hey I'm in my response")
        // extract each of these from `data.dataset`
        var name = data.dataset.name;
        var stock = data.dataset.dataset_code;
        var startDate = data.dataset.start_date;
        var endDate = data.dataset.end_date;
        // for these values, you'' need to apply `.map()` to each row in the `data.dataset.data` array, mapping from `row` to `row[i]` (where `i` is the number of the index for the value you want to extract)
        var dates = data.dataset.data.map(row => row[0]);
        var openPrices = data.dataset.data.map(row => row[1]);
        var highPrices = data.dataset.data.map(row => row[2]);
        var lowPrices = data.dataset.data.map(row => row[3]);
        var closePrices = data.dataset.data.map(row => row[4]);

        getMonthlyData();
        d3.select("#pagetitle").text(name.split(" (")[0])

        // Create a trace object for the main line
        // set type to 'scatter',
        // set mode to 'lines',
        // set name to be the `name` variable defined above
        // set x to be the `dates` variable
        // set y to be the `closePrices` variable
        // set line to be an object, with the color property set to "#17BECF"
        var trace1 = {
            type: "scatter",
            mode: "lines",
            name : name,
            x: dates,
            y: closePrices,
            line: {
                color: "#17BECF"
            }
        };

        // Create a trace object for the candlestick
        // set type to 'candlestick',
        // set x to be the `dates` variable
        // set high to be the `highPrices` variable
        // set low to be the `lowPrices` variable
        // set open to be the `openPrices` variable
        // set close to be the `closePrices` variable
        var trace2 = {
            type: "candlestick",
            x: dates,
            high: highPrices,
            low: lowPrices,
            open: openPrices,
            close: closePrices
        };
        

        var data = [trace1, trace2];

        var layout = {
            title: `${stock} closing prices`,
            xaxis: {
                range: [startDate, endDate],
                type: "date"
            },
            yaxis: {
                autorange: true,
                type: "linear"
            },
            showlegend: false
        };

        Plotly.newPlot("plot", data, layout);

    });
}

function getMonthlyData() {
    // Queries the QUANDL API, then upacks the data results and calls `buildTable()`
    var apiKey = "ZmcsrcxBxu3Y5ykz_yge";
    var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2017-01-01&end_date=2018-11-22&collapse=monthly&api_key=${apiKey}`;

    // use d3 to request the json, then parse the data
    d3.json(queryUrl).then(function(data) {
        var dates = data.dataset.data.map(row => row[0]);
        var openPrices = data.dataset.data.map(row => row[1]);
        var highPrices = data.dataset.data.map(row => row[2]);
        var lowPrices = data.dataset.data.map(row => row[3]);
        var closePrices = data.dataset.data.map(row => row[4]);
        var volume = data.dataset.data.map(row => row[5]);

        buildTable(dates, openPrices, highPrices, lowPrices, closePrices, volume);
    });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closePrices, volume) {
    // Render an HTML table to the page, containing the data unpacked from the QUANDL API result
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    var trow;
    for (var i = 0; i < 12; i++) {
        trow = tbody.append("tr");
        trow.append("td").text(dates[i]);
        trow.append("td").text(openPrices[i]);
        trow.append("td").text(highPrices[i]);
        trow.append("td").text(lowPrices[i]);
        trow.append("td").text(closePrices[i]);
        trow.append("td").text(volume[i]);
    }
}

buildPlot();
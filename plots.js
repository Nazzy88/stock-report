var apiKey = "YOUR API KEY HERE";

function buildPlot() {
    var url = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2017-01-01&end_date=2018-11-22&api_key=${apiKey}`;

    d3.json(url).then(function(data) {

        // Grab values from the response json object to build the plots
        var name = data.dataset.name;
        var stock = data.dataset.dataset_code;
        var startDate = data.dataset.start_date;
        var endDate = data.dataset.end_date;
        var dates = data.dataset.data.map(row => row[0]);
        var openPrices = data.dataset.data.map(row => row[1]);
        var highPrices = data.dataset.data.map(row => row[2]);
        var lowPrices = data.dataset.data.map(row => row[3]);
        var closePrices = data.dataset.data.map(row => row[4]);

        getMonthlyData();

        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: name,
            x: dates,
            y: closePrices,
            line: {
                color: "#17BECF"
            }
        };

        // Candlestick Trace
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

    var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`;
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
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    var trow;
    for (var i = 0; i < 12; i++) {
        trow = tbody.append("tr");
        trow.append("td").text(dates[i]);
        trow.append("td").text(openPrices[i]);
        trow.append("td").text(highPrices[i]);
        trow.append("td").text(lowPrices[i]);
        trow.append("td").text(closingPrices[i]);
        trow.append("td").text(volume[i]);
    }
}

buildPlot();
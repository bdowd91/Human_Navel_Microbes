// get graphs
function retrieveGraphs(selectedID) {
  d3.json("data/samples.json").then(function (data) {
    var metadata = data.metadata;
    var samples = data.samples;

    // filter data variables to get correct data
    var metadataFilter = metadata.filter(result => result.id == selectedID);
    var metadataResults = metadataFilter[0]
    var samplesFilter = samples.filter(result => result.id == selectedID);
    var samplesResults = samplesFilter[0]

    // get data
    var sample_values = samplesResults.sample_values;
    var otu_ids = samplesResults.otu_ids;
    var otu_labels = sampleResults.otu_labels;


    // bar graph

    var barGraph = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      marker: {
        color: 'rgb(142,124,195)'
      },
      type: "bar",
      orientation: "h"
    };
    var barData = [barTrace];
    var barLayout = {
      title: "Top 10 OTU",
      yaxis: {
        tickmode: "linear"
      },
      margin: {
          left: 100,
          right: 100,
          top: 100,
          bottom: 30
      }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // bubble chart
    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: otu_ids
      }
    };

    var bubbleData = [bubbleTrace];
    var bubbleLayout = {
      xaxis: {
        title: "OTU_ID"
      },
      height: 600,
      width: 1000
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // gauge
    // get data for washing frequency 
    var wfreq = metadataResults.wfreq;
    console.log(wfreq)

    var gaugeTrace = {
        type: "indicator",
        value: wfreq,
        title: {
            text: "Belly Button Washing Frequency (Weekly)"
        },
        mode: "gauge+number",
        gauge: {
            axis: {
                range: [null, 9]
            },
            steps: [{
                    range: [0, 1],
                    color: "#ffffe4"
                },
                {
                    range: [1, 2],
                    color: "#dff2c5"
                },
                {
                    range: [2, 3],
                    color: "#c7e3a8"
                },
                {
                    range: [3, 4],
                    color: "#b1d38d"
                },
                {
                    range: [4, 5],
                    color: "#9ec374"
                },
                {
                    range: [5, 6], 
                    color: "#8cb25a"
                }, 
                {
                    range: [6, 7], 
                    color: "#7aa241"
                },
                {
                    range: [7, 8],
                    color: "#6a9127"
                },
                {
                    range: [8,9],
                    color: "#5a8100"
                }   
            ]
          }
    };

    var gaugeData = [gaugeTrace];

    var gaugeLayout = {
        width: 500,
        heihgt:400,
        margin: {
            top: 20, 
            bottom: 40, 
            left: 75,
        }
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};

function displayDemographics(selectedID) {
    d3.json("data/samples.json").then(function (data) {
      var metadata = data.metadata; 
      var results = metadata.filter(meta => meta.id.toString() == selectedID)[0];
      var demographicInfo = d3.select("#sample-metadata");
      
      demographicInfo.html("");

      Object.entries(results).forEach((key) => {
        demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
      });
    });
};


function optionChanged(selectedID) {
    displayGraphs(selectedID);
    displayDemographicInfo(selectedID);
};

function init() {
    var dropdown = d3.select("#selDataset");

    d3.json("data/samples.json").then(function (data) {
        console.log(data);
        var ids = data.names;

        ids.forEach(id => {
            dropdown.append("option").text(id).property("value", id)
        });

        // functions to display the first result
        displayGraphs(ids[0]);
        displayDemographicInfo(id[0]);
    });
};

init();
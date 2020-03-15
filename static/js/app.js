function buildMetadata(sample) {
// Use d3.json() to fetch data from JSON file
d3.json('/metadata/${sample}').then((data) => {
    console.log(data);
    // Select the panel with id of '#sample-metadata'
    var metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata.html("");

    //'Object.entries' to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value])) => {
        console.log(key, value);
        // Use d3 to select the panel with id of '#sample-metadata'
        metadata.append("h6").text(`${key}: ${value}`);

        //'.html' to clear any existing metadata
        metadata.html("");
        
    };


};

function buildCharts(sample) {
    // Use d3.json to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then((data) => {
        console.log(data);
        var otu_ids = data.otu_ids;
        var otu_labels = data.otu_labels;
        var sample_values = data.sample_values;

    // Build bubble chart using the sample data
        var bubblelayout_1 ={
            margin:{t:0}, 
            hovermode: "closest", 
            xaxis: {title: "OTU ID"}
        };
        let bubbleData_1 = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers", 
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ]
        Plotly.newPlot("bubble", bubbleData_1, bubblelayout_1);

    // Build Pie Chart
    var pieData_1 = [
        {
            values: sample_values.slice(0,10), 
            labels: otu_ids.slice(0,10), 
            hovertext: otu_labels.slice(0,10), 
            hoverinfo: "hovertext", 
            type: "pie"
        }
    ];
    var pieLayout_1 = {
        margin: {t: 0, 1: 0}
    };

    Plotly.newPlot("pie", pieData_1, pieLayout_1);
    });
};

function init() {
    //Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    //Use list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        //Use first sample from list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Get new data each time a new sample is selected
    var bubbleSelector = d3.select("bubble");
    bubbleSelector.html(""); 
    buildCharts(newSample);
    buildMetadata(newSample); 
    console.log("We are registering a change.")
    console.log(newSample)
}

// Initialize the dashboard 
init();
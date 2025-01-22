// Function to run on page load
function init() {
  // Use d3 to select the dropdown with id of `#selDataset`
  let dropDown = d3.select("#selDataset");

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleIDs = data.names;

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < sampleIDs.length; i++) {
      dropDown
      // .append() creates a new element
      .append("option")
      // .text() sets the text content of the selected element
      .text(sampleIDs[i])
      // .property() is used to get or set properties on the selected element
      .property("value", sampleIDs[i]);
    }

    // Get the first sample from the list
    let firstSample = sampleIDs[0];

    // Build charts and metadata panel with the first sample
    // createCharts and fetchMetadata are user-defined functions
    createCharts(firstSample);
    populateMetadata(firstSample);
  });
}

// function to build both charts
function createCharts(firstSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    // sampleObj represents the current element being processed in the array
    let filteredSample = samples.filter(sampleObject => sampleObject.id == firstSample);
    let sampleData = filteredSample[0];

    // Get the otu_ids, otu_labels, and sample_values
    let sampleValues = sampleData.sample_values;
    let otuIDs = sampleData.otu_ids;
    let otuLabels = sampleData.otu_labels;

    // Build a Bubble Chart
    let bubbleChart = [
      {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: 'Portland'
        }
      }
    ];

    // Render the Bubble Chart
    let bubbleChartLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      margin: { t: 30 },
      hovermode: 'closest',
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      height: 600,
      width: 1250
    };

    Plotly.newPlot("bubble", bubbleChart, bubbleChartLayout);
  

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // first i need to sort my sample_values and the otu_ids in descending order
    // after sorting, slice the first 10 elements
    let barYTicks = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    let barChart = [
      {
        y: barYTicks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        marker: {
          color: 'rgba(56,124,58,0.8)'
        },
        type: 'bar',
        orientation: "h"
      }
    ];

    //combine sample_values and otu_ids
    //let combinedData = otuIDs.map((id, index) => ({
     // otu_id: id,
     // sample_value: sampleValues[index]
    //}));

    // sort the combined data
    //combinedData.sort((a, b) => b.sample_value - a.sample_value);

    //slice the first 10 elements
    //let first10Samples = combinedData.slice(0, 10);

    //reverse the array
    //first10Samples.reverse();
     // console.log(first10Samples);

    //extract the sorted data
    //let sortedOtu_ids = first10Samples.map(data => data.otu_id);
    //let sortedSample_values = first10Samples.map(data => data.sample_value);

    // Build a Bar Chart
    //let barChart = [
     // {
       // type: 'bar',
       // x: sortedSample_values,
       // y: sortedOtu_ids.map(id => id.toString()),
       // orientation: 'h',
       // width: 1
     // }
   // ];

    let barChartLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t:30, l:150 },
      xaxis: {
        title: 'Number of Bacteria'
      },
      height: 600,
      width: 800
    };

    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    Plotly.newPlot("bar", barChart, barChartLayout);
  });
}


// Build charts and metadata panel each time a new sample is selected
// Build the metadata panel
function populateMetadata(firstSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metaData.filter(sampleObj => sampleObj.id == firstSample);
    let sampleMetadata = filteredMetadata[0];
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let key in sampleMetadata) {
      metadataPanel.append("h6").text(`${key.toUpperCase()}: ${sampleMetadata[key]}`);
    }
  });
}


// Function for event listener
function optionChanged(newSample) {
  createCharts(newSample);
  populateMetadata(newSample);
}

// Initialize the dashboard
init();

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  //metadataSample=`/metadata/${sample}`
  d3.json(`/metadata/${sample}`).then(function(jsonSample) {

      console.log("json returned: ", jsonSample);
      // Use d3 to select the panel with id of `#sample-metadata`
      var panel=d3.select(`#sample-metadata`)
    
      // Use `.html("") to clear any existing metadata
      panel.html("")
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(jsonSample).forEach(function([key, value]){
      
        panel.append("p").text(`${key}: ${value}`);
      });
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    
  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var data_plot = `/samples/${sample}`;

  d3.json(data_plot).then(function(data){
    var x = data.otu_ids;
    var y = data.sample_values;
    var text = data.otu_labels;
  
    var bubble = {
      x: x,
      y: y,
      text: text,
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
      }
    };

    var data = [bubble];
    var layout = {
      title: "Bubble plot for the data",
      xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    d3.json(data_plot).then(function(data){
      var values = data.sample_values.slice(0,10);
      var labels = data.otu_ids.slice(0,10);
      var hovertext = data.otu_labels.slice(0,10);
      
    var pie_chart = [{
        values: values,
        lables: labels,
        hovertext: hovertext,
        type: "pie"
      }];
      Plotly.newPlot('pie',pie_chart);
    });
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

// Function to generate a color 
function pickHex(color1, color2, weight) {
  console.log("inside pickHex()");
  
  var w1 = weight * 50;
  var w2 = 1 - w1;
  var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
  Math.round(color1[1] * w1 + color2[1] * w2),
  Math.round(color1[2] * w1 + color2[2] * w2)];
  return rgb;
}


// Function to add the dropdown for samples
function addDropdown() {
  console.log("inside addDropdown()");
  
  // put list of sample names into an array
  sampleNames = [];
  queryURL = 'http://localhost:5000/names';
  // assign to sampleNames array
  d3.json(queryURL, function (error, response) {
    if (error) {
      console.log(error);
    }
    else {
      sampleNames = response;

      // Add each item as option to dropdown  
      for (var i = 0; i < sampleNames.length; i++) {
        d3.select("#samplesDropdown").append("option")
          .attr("value", sampleNames[i]["name"])
          .text(sampleNames[i]);
      }

      optionChanged(sampleNames[0]);

    }
  });

}

// create a default pie chart and scatter plot
function init() {
  console.log("inside init()");
  
  // default pie chart 
  var data = [{
    values: [19, 26, 55, 88],
    labels: ["Section 1", "Section 2", "Section 3", "Section 4"],
    text: ["A", "B", "C", "D"],
    type: "pie"
  }];

  var layout = {
    margin: {
      b: 0,
      t: 10,
      pad: 0
    },
    title: false,
    height: 375,
    width: 500
  };

  Plotly.plot("pie", data, layout);



  var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 11, 12, 13],
    text: ['A size: 40', 'B size: 60', 'C size: 80', 'D size: 100'],
    mode: 'markers',
    hoverinfo: 'text',
    marker: {
      color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
      size: [40, 60, 80, 100]
    }
  };

  var data = [trace1];

  var layout = {
    margin: {
      l: 25,
      r: 200,
      b: 35,
      t: 10,
      pad: 0
    },
    xaxis: {title: "OTU ID's"},

    showlegend: false,
    height: 400,
    width: 1200
  };

  Plotly.newPlot('scatterPlot', data, layout);

}



// Function to restyle Pie chart and Scatter Plot
function updatePlots(newdata) {
  console.log("inside updatePlots()");
  
  // Declare variables
  scatterPlotText = [];
  scatterPlotColor = []; 
  otuDescTop10 = []; 
  otuDescAll  = [];

  // Get the otu_id 
  queryURL = 'http://localhost:5000/otu';

  d3.json(queryURL, function (error, response) {
    otuDescAll = response;

    
    for (var i = 0; i < 10; i++) {
      otuDescTop10.push(otuDescAll[newdata[0].otu_id[i]]);
    }

    
    for (var i = 0; i < newdata[0].otu_id.length; i++) {
      scatterPlotText.push("(" + newdata[0].otu_id[i] + "," + newdata[0].sample_values[i] + ")" + "<br>" + otuDescAll[newdata[0].otu_id[i]]);
      color1 = pickHex([0, 0, 51], [51, 0, 0], ((i) / newdata[0].otu_id.length));
      color2 = 'rgb(' + color1[0] + ', ' + color1[1] + ', ' + color1[2] + ')';
      scatterPlotColor.push(color2);
    }

    // Restyle scatter plot 
    Plotly.restyle("scatterPlot", "text", [scatterPlotText]);
    Plotly.restyle("scatterPlot", "marker.color", [scatterPlotColor]);


  });

  // Get html element for pie chart
  var PIE = document.getElementById("pie");
    
  // Restyle the pie chart   
  Plotly.restyle(PIE, "values", [[newdata[0].sample_values][0].slice(0, 10)]);
  Plotly.restyle(PIE, "labels", [[newdata[0].otu_id][0].slice(0, 10)]);
  Plotly.restyle(PIE, "text", [otuDescTop10]);


  // Restyle the scatter plot  
  Plotly.restyle("scatterPlot", "x", [newdata[0].otu_id]);
  Plotly.restyle("scatterPlot", "y", [newdata[0].sample_values]);
  Plotly.restyle("scatterPlot", "marker.size", [newdata[0].sample_values]);

}


// create default Pie Chart and Scatter Plot
init();

// create dropdown list of samples
addDropdown();
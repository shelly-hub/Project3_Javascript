// Save the API URL
let allUrl = "http://127.0.0.1:5000/api/summary"

ScrollReveal().reveal('#title-page');
ScrollReveal().reveal('#subtitles-page', {delay: 200});
ScrollReveal().reveal('.well', {delay: 400});
ScrollReveal().reveal('#sprite', {delay: 500});
ScrollReveal().reveal('.dropdown', {delay: 500});
ScrollReveal().reveal('.panel-primary', {delay: 700});
ScrollReveal().reveal('#radar', {delay: 900});
ScrollReveal().reveal('#boxplot', {delay: 1500});
ScrollReveal().reveal('#type-chart', {delay: 2000});
ScrollReveal().reveal('#type-chart-description', {delay: 2000});

// API call for default appearance
d3.json(allUrl).then(function(data) {
    console.log(data);

    // Save default query
    let defaultQuery = "bulbasaur";

    // Send query to each function
    buildSprites(defaultQuery, data);
    buildMetaData(defaultQuery, data);
    buildRadarChart(defaultQuery, data);
    buildTypeChart(defaultQuery, data);

});

// Generate the new sample dataset on change
function newDataset() {
    let input = document.getElementById("userInput").value.toLowerCase();
    console.log(input);

    d3.json(allUrl).then(function(data) {
        
        // Save new query URL
        let newQuery = input;

        // Save test variable
        let testVar = 0

        // Remove child nodes
        let parentNode = document.querySelector('#result-check');
        removeAllChildNodes(parentNode);

        // Search for matching result
        for (i=0; i < data.metadata.length; i++) {
            if (data.metadata[i].Name === newQuery) {
                
                // Send query to each function
                buildSprites(newQuery, data);
                buildMetaData(newQuery, data);
                buildRadarChart(newQuery, data);
                buildTypeChart(newQuery, data);

                // Change test variable
                testVar = testVar + 1
            };
        };

        if (testVar === 0) {

            //Append new result
            let searchResult = d3.select('#result-check');
            searchResult.append("h5").text("Sorry, no matching result found!");
        };
    });
};

// Function for Pokemon Sprites
function buildSprites(pokemon, data) {

    // Declare image options variable
    let imageOptions = [];

    // Collect image options
    for (i = 0; i < data.sprites.length; i++) {
        if (data.sprites[i].Name === pokemon) {
            imageOptions.push(data.sprites[i].Sprites_default);
            imageOptions.push(data.sprites[i].Sprites_shiny);
        };
    };

    // Assign default image
    let imageDefault = imageOptions[0];
    document.getElementById("img-tag").src = String(imageDefault);

    // Save location of dropdown menu
    let dropMenuSprite = d3.select('#selDatasetSprite');

    //Remove all child nodes
    let parentNode = document.querySelector('#selDatasetSprite');
    removeAllChildNodes(parentNode);

    // Create dropdown menu values
    dropMenuSprite.append("option").text("Default").property("value", imageOptions[0]);
    dropMenuSprite.append("option").text("Shiny").property("value", imageOptions[1]);

};

// Function for changing Pokemon Sprites
function optionChanged(newSprite) {

    // Display new sprite
    let imageNew = newSprite;
    document.getElementById("img-tag").src = String(imageNew);

};

// Pokemon Info function
function buildMetaData(pokemon, data) {
    
    // Declare metadata variable
    let sampleMetaRaw = [];
    
    // Collect metadata
    for (i = 0; i < data.metadata.length; i++) {
        if (data.metadata[i].Name === pokemon) {
            sampleMetaRaw.push(data.metadata[i]);
        };
    };

    // Clean data
    let sampleMetaClean = {
        Name: capitaliseString(sampleMetaRaw[0].Name),
        'Number ID': sampleMetaRaw[0].id,
        Weight: (String(sampleMetaRaw[0].Weight) + " kg"),
    };

    console.log(sampleMetaClean);

    // Save metadata html location
    let metadataLocation = d3.select('#sample-metadata');

    // Remove all child nodes
    let parentNode = document.querySelector('#sample-metadata');
    removeAllChildNodes(parentNode);

    // Display metadata text
    for (let key in sampleMetaClean) {
        metadataLocation.append("h6").append("b").text(key + ": " + sampleMetaClean[key]).property("value")
    };

    // Append type data to metadata text
    for (i = 0; i < data.metadata.length; i++) {
        if (data.metadata[i].Name === pokemon) {
            metadataLocation.append("h6").append("b").text("Type 1: " + capitaliseString(data.metadata[i].Type_1)).property("value");
            if (data.metadata[i].Type_2 != 'NaN') {
                metadataLocation.append("h6").append("b").text("Type 2: " + capitaliseString(data.metadata[i].Type_2)).property("value");
            };
        };
    };

};

// Build Statistics Radar Chart function
function buildRadarChart(pokemon, data) {

    // Declare statistics variable
    let sampleStatsRaw = [];

    // Collect values
    for (i = 0; i < data.statistics.length; i++) {
        if (data.statistics[i].Name === pokemon) {
            sampleStatsRaw.push(data.statistics[i])
        };
    };

    // Clean data
    let sampleStatsClean = {
        Attack: sampleStatsRaw[0].Attack,
        Defense: sampleStatsRaw[0].Defense,
        'Sp.Atk': sampleStatsRaw[0].Special_attack,
        'Sp.Def': sampleStatsRaw[0].Special_defense,
        HP: sampleStatsRaw[0].Hp,
        Speed: sampleStatsRaw[0].Speed
    };

    // Collect Statistic Names & Values
    let statNames = [];
    let statValues = [];

    for (let key in sampleStatsClean) {
        statNames.push(key);
        statValues.push(sampleStatsClean[key]);
    };

    // Create Radar Plot
    let radarData = [{
        type: 'scatterpolar',
        r: statValues,
        theta: statNames,
        fill: 'toself',
        name: 'Base Stats'
    }];

    let radarLayout = {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 300]
            }
        },
        showlegend: false,
        title: 'Base Statistics'
    };

    Plotly.newPlot("radar", radarData, radarLayout);

    // Send data to Boxplot function
    buildBoxplotChart(pokemon, data, sampleStatsClean);

};

// Capitalisation Formatting function
function capitaliseString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Remove all child nodes upon sample change function
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

// Build BoxplotChart
function buildBoxplotChart(pokemon, data, sampleStatsClean) {
        
    // Collect all data for each stat
    // Declare Variable Lists
    let allAttack = [];
    let allDefense = [];
    let allSpAttack = [];
    let allSpDefense = [];
    let allHP = [];
    let allSpeed = [];

    // Collect values
    for (i = 0; i < data.statistics.length; i++) {
        allHP.push(data.statistics[i].Hp);
        allAttack.push(data.statistics[i].Attack);
        allDefense.push(data.statistics[i].Defense);
        allSpAttack.push(data.statistics[i].Special_attack);
        allSpDefense.push(data.statistics[i].Special_defense);
        allSpeed.push(data.statistics[i].Speed);
    };

    // Save data
    let dataBoxplot = [
    {
        x: allSpeed,
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: 0,
        type: 'box',
        name: 'Speed'
    },
    {
        y: ['Speed'],
        x: [sampleStatsClean.Speed],
        name: capitaliseString(pokemon),
        text: (capitaliseString(pokemon) + ': ' + sampleStatsClean.Speed),
        marker: {size:15, color: '#FF0000'}
    },
    {
        x: allHP,
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: 0,
        type: 'box',
        name: 'HP'
    },
    {
        y: ['HP'],
        x: [sampleStatsClean.HP],
        name: capitaliseString(pokemon),
        text: (capitaliseString(pokemon) + ': ' + sampleStatsClean.HP),
        marker: {size:15, color: '#FF0000'}
    },
    {
        x: allSpDefense,
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: 0,
        type: 'box',
        name: 'Sp.Def'
    },
    {
        y: ['Sp.Def'],
        x: [sampleStatsClean['Sp.Def']],
        name: capitaliseString(pokemon),
        text: (capitaliseString(pokemon) + ': ' + sampleStatsClean['Sp.Def']),
        marker: {size:15, color: '#FF0000'}
    },
    {
        x: allSpAttack,
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: 0,
        type: 'box',
        name: 'Sp.Atk'
    },
    {
        y: ['Sp.Atk'],
        x: [sampleStatsClean['Sp.Atk']],
        name: capitaliseString(pokemon),
        text: (capitaliseString(pokemon) + ': ' + sampleStatsClean['Sp.Atk']),
        marker: {size:15, color: '#FF0000'}
    },
    {
        x: allDefense,
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: 0,
        type: 'box',
        name: 'Defense'
    },
    {
        y: ['Defense'],
        x: [sampleStatsClean.Defense],
        name: capitaliseString(pokemon),
        text: (capitaliseString(pokemon) + ': ' + sampleStatsClean.Defense),
        marker: {size:15, color: '#FF0000'}
    },
    {
        x: allAttack,
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: 0,
        type: 'box',
        name: 'Attack',
        marker: {color: '#47D2C1'}
    },
    {
        y: ['Attack'],
        x: [sampleStatsClean.Attack],
        name: capitaliseString(pokemon),
        text: (capitaliseString(pokemon) + ': ' + sampleStatsClean.Attack),
        marker: {size:15, color: '#FF0000'}
    }];

    // Save layout
    let layoutBoxplot = {
        title: 'Comparison of Base Stats (All Pokemon)',
        showlegend: false
    };


    Plotly.newPlot('boxplot', dataBoxplot, layoutBoxplot);
};

// Type Chart damage function
function buildTypeChart(pokemon, data) {

    // Retrieve type data
    let sampleTypes = []

    for (i = 0; i < data.metadata.length; i++) {
        if (data.metadata[i].Name === pokemon) {
            sampleTypes.push(data.metadata[i].Type_1);
            if (data.metadata[i].Type_2 != 'NaN') {
                sampleTypes.push(data.metadata[i].Type_2);
            };
        };
    };

    // Save data for all types
    let typesInfo = [
    {
        Type: 'normal',
        yValues: 'Normal',
        zValues: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0, 1.0, 1.0, 0.5, 1.0]
    },
    {
        Type: 'fire',
        yValues: 'Fire',
        zValues: [1.0, 0.5, 0.5, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 0.5, 1.0, 2.0, 1.0]
    },
    {
        Type: 'water',
        yValues: 'Water',
        zValues: [1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 1.0, 1.0]
    },
    {
        Type: 'grass',
        yValues: 'Grass',
        zValues: [1.0, 0.5, 2.0, 0.5, 1.0, 1.0, 1.0, 0.5, 2.0, 0.5, 1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 0.5, 1.0]
    },
    {
        Type: 'electric',
        yValues: 'Electric',
        zValues: [1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0]
    },
    {
        Type: 'ice',
        yValues: 'Ice',
        zValues: [1.0, 0.5, 0.5, 2.0, 1.0, 0.5, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0]
    },
    {
        Type: 'fighting',
        yValues: 'Fighting',
        zValues: [2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 0.5, 0.5, 0.5, 2.0, 0, 1.0, 2.0, 2.0, 0.5]
    },
    {
        Type: 'poison',
        yValues: 'Poison',
        zValues: [1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 0, 2.0]
    },
    {
        Type: 'ground',
        yValues: 'Ground',
        zValues: [1.0, 2.0, 1.0, 0.5, 2.0, 1.0, 1.0, 2.0, 1.0, 0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0, 2.0, 1.0]
    },
    {
        Type: 'flying',
        yValues: 'Flying',
        zValues: [1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0, 0.5, 1.0]
    },
    {
        Type: 'psychic',
        yValues: 'Psychic',
        zValues: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 0, 0.5, 1.0]
    },
    {
        Type: 'bug',
        yValues: 'Bug',
        zValues: [1.0, 0.5, 1.0, 2.0, 1.0, 1.0, 0.5, 0.5, 1.0, 0.5, 2.0, 1.0, 1.0, 0.5, 1.0, 2.0, 0.5, 0.5]
    },
    {
        Type: 'rock',
        yValues: 'Rock',
        zValues: [1.0, 2.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 0.5, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0]
    },
    {
        Type: 'ghost',
        yValues: 'Ghost',
        zValues: [0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 1.0]
    },
    {
        Type: 'dragon',
        yValues: 'Dragon',
        zValues: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 0]
    },
    {
        Type: 'dark',
        yValues: 'Dark',
        zValues: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 0.5]
    },
    {
        Type: 'steel',
        yValues: 'Steel',
        zValues: [1.0, 0.5, 0.5, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 0.5, 2.0]
    },
    {
        Type: 'fairy',
        yValues: 'Fairy',
        zValues: [1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 0.5, 1.0]
    }];

    let colorscaleValues = [
        [0, '#000000'],
        [0.25, '#C70039'],
        [0.5, '#FFFFFF'],
        [1, '#8BE63D']
    ];

    let yValuesFiltered = [];
    let zValuesFiltered = [];

    for (let i=0; i < typesInfo.length; i++) {
        for (let j=0; j < sampleTypes.length; j++){
            if (typesInfo[i].Type === sampleTypes[j]) {
                yValuesFiltered.push(typesInfo[i].yValues),
                zValuesFiltered.push(typesInfo[i].zValues)
            };
        };
    };

    let xValues = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

    let dataHeatmap = [{
        x: xValues,
        y: yValuesFiltered,
        z: zValuesFiltered,
        zmin: 0,
        zmax: 2,
        type: 'heatmap',
        colorscale: colorscaleValues,
        showscale: false,
        xgap: 2,
        ygap: 2
    }];

    let layoutHeatmap = {
        title: 'Effectiveness of Attacks (upon Opponents per Type)',
        annotations: [],
        xaxis: {
          ticks: '',
          side: 'top',
          title: 'Defending Pokemon'
        },
        yaxis: {
          ticks: '',
          ticksuffix: ' ',
          autosize: true,
          title: 'Attacking Pokemon',
        },
        margin: {t: 140, b: 20},
      };
      
      for ( let i = 0; i < yValuesFiltered.length; i++ ) {
        for ( let j = 0; j < xValues.length; j++ ) {
          let currentValue = zValuesFiltered[i][j];
          if (currentValue != 1.0) {
            var textColor = 'white';
          } else{
            var textColor = 'black';
          }
          let result = {
            xref: 'x1',
            yref: 'y1',
            x: xValues[j],
            y: yValuesFiltered[i],
            text: zValuesFiltered[i][j],
            font: {
              family: 'Arial',
              size: 12,
              color: 'rgb(50, 171, 96)'
            },
            showarrow: false,
            font: {
              color: textColor
            }
          };
          layoutHeatmap.annotations.push(result);
        }
      }
    
    Plotly.newPlot('type-chart', dataHeatmap, layoutHeatmap);

};
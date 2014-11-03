/*
Audio Visualizer by Raathigeshan.
Modified by Sabry Moulana
*/

$(document).ready(function () {
    // main entry point to the application
    var visualizer = new AudioVisualizer();
    visualizer.initialize();
    visualizer.createBars();
    visualizer.setupAudioProcessing();
    visualizer.handleDrop();  
});


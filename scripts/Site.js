/*
Audio Visualizer by Raathigeshan.
http://raathigesh.com/
*/

$(document).ready(function () {
    var visualizer = new AudioVisualizer();
    visualizer.initialize();
    visualizer.createBars();
    visualizer.setupAudioProcessing();
    visualizer.handleDrop();  
});


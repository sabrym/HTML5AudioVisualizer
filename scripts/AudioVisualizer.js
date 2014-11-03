var AudioVisualizer = function(){
    /// <summary>
    /// s this instance.
    /// </summary>
    /// <returns></returns>
    var
        numberOfBars = ko.observable(10),
        scene,
        camera,
        renderer,
        controls,
        bars = new Array(),
        javascriptNode,
        audioContext,
        sourceBuffer,
        analyser,
        setupAudioProcessing = function() {
            audioContext = new AudioContext();

            //create the javascript node
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
            javascriptNode.connect(audioContext.destination);

            //create the source buffer
            sourceBuffer = audioContext.createBufferSource();

            //create the analyser node
            analyser = audioContext.createAnalyser();
            analyser.smoothingTimeConstant = 0.3;
            analyser.fftSize = 512;

            //connect source to analyser
            sourceBuffer.connect(analyser);

            //analyser to speakers
            analyser.connect(javascriptNode);

            //connect source to analyser
            sourceBuffer.connect(audioContext.destination);

            //this is where we animates the bars
            javascriptNode.onaudioprocess = function () {

                // get the average for the first channel
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);

                //render the scene and update controls
                renderer.render(scene, camera);
                controls.update();

                var step = Math.round(array.length / numberOfBars());

                //Iterate through the bars and scale the z axis
                for (var i = 0; i < numberOfBars(); i++) {
                    var value = array[i * step] / 4;
                    value = value < 1 ? 1 : value;
                    bars[i].scale.z = value;
                }
            };
        },

        start = function (buffer) {
            audioContext.decodeAudioData(buffer, decodeAudioDataSuccess, decodeAudioDataFailed);            

            function decodeAudioDataSuccess(decodedBuffer) {
                sourceBuffer.buffer = decodedBuffer;
                sourceBuffer.start(0);
            }

            function decodeAudioDataFailed() {
                debugger;
            }
        },

        getRandomColor = function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        handleDrop = function () {
            //drag Enter
            document.body.addEventListener("dragenter", function () {

            }, false);

            //drag over
            document.body.addEventListener("dragover", function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            }, false);

            //drag leave
            document.body.addEventListener("dragleave", function () {

            }, false);

            //drop
            document.body.addEventListener("drop", function (e) {
                e.stopPropagation();

                e.preventDefault();

                //get the file
                var file = e.dataTransfer.files[0];
                var fileName = file.name;

                $("#guide").text("Playing " + fileName);

                var fileReader = new FileReader();

                fileReader.onload = function (e) {
                    var fileResult = e.target.result;
                    var fileType = 'audio/mp3';
                    if(file.type.match(fileType)){
                       start(fileResult);
                    }
                    else{
                        alert('Unsupported file');
                    }
                };

                fileReader.onerror = function (e) {
                    debugger;
                };

                fileReader.readAsArrayBuffer(file);
            }, false);
        },

        createBars = function() {
            //iterate and create bars
            for (var i = 0; i < numberOfBars(); i++) {

                //create a bar
                var barGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

                //create a material
                var material = new THREE.MeshPhongMaterial({
                    color: getRandomColor(),
                    ambient: 0x808080,
                    specular: 0xffffff
                });

                //create the geometry and set the initial position
                bars[i] = new THREE.Mesh(barGeometry, material);
                bars[i].position.set(i - numberOfBars() / 2, 0, 0);

                //add the created bar to the scene
                scene.add(bars[i]);
            }
        },

        mobileFileUpload = function() {
            // if the client is a mobile browser
            // then we push a file upload popup
            // assign that to the Audio context
        },

        handleUnknownOrUnsupportedFileType = function() {
            // this function would be called wherever a 
            // file is uploaded by the user
            return throw Error('Unsupported File');
        },
        
        isFileValid = function (audioFile){
            if(audioFile)
            {

            }
        },

        initialize = function() {
            //generate a ThreeJS Scene
            scene = new THREE.Scene();

            //get the width and height
            var WIDTH = window.innerWidth,
                HEIGHT = window.innerHeight;

            //get the renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(WIDTH, HEIGHT);

            //append the rederer to the body
            document.body.appendChild(renderer.domElement);

            //create and add camera
            camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 20000);
            camera.position.set(0, 45, 0);
            scene.add(camera);

            //update renderer size, aspect ratio and projection matrix on resize
            window.addEventListener('resize', function () {
                var WIDTH = window.innerWidth,
                    HEIGHT = window.innerHeight;

                renderer.setSize(WIDTH, HEIGHT);
                camera.aspect = WIDTH / HEIGHT;
                camera.updateProjectionMatrix();

            });

            //background color of the scene
            renderer.setClearColor(0x333F47, 1);

            //create a light and add it to the scene
            var light = new THREE.PointLight(0xffffff);
            light.position.set(-100, 200, 100);
            scene.add(light);

            //Add interation capability to the scene
            controls = new THREE.OrbitControls(camera, renderer.domElement);
        };

        return {
            initialize: initialize,
            createBars: createBars,
            handleDrop: handleDrop,
            setupAudioProcessing: setupAudioProcessing,
            numberOfBars: numberOfBars
        };
    };

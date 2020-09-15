let audioIN = { audio: true };
//  audio is true, for recording 

// Access the permission for use 
// the microphone 
let playAudio;
navigator.mediaDevices.getUserMedia(audioIN)

    // 'then()' method returns a Promise 
    .then(function(mediaStreamObj) {

        // Connect the media stream to the 
        // first audio element 
        let audio = document.getElementById('ses_container');
        //returns the recorded audio via 'audio' tag 

        // 'srcObject' is a property which  
        // takes the media object 
        // This is supported in the newer browsers 
        if ("srcObject" in audio) {
            audio.srcObject = mediaStreamObj;
        } else { // Old version 
            audio.src = window.URL
                .createObjectURL(mediaStreamObj);
        }

        // It will play the audio 
        /*audio.onloadedmetadata = function (ev) { 
  
          // Play the audio in the 2nd audio 
          // element what is being recorded 
          audio.play(); 
        }; */

        // Start record 
        let start = document.getElementById('btnStart');

        // Stop record 
        let stop = document.getElementById('btnStop');

        // 2nd audio tag for play the audio 
        //let playAudio = document.getElementById('adioPlay');
        playAudio = document.createElement("audio");

        // This is the main thing to recorde  
        // the audio 'MediaRecorder' API 
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        // Pass the audio stream  

        // Start event 
        start.addEventListener('click', function(ev) {

        })
        start.addEventListener('touchstart', function(ev) {
            start.style.color = "red";
            mediaRecorder.start();
            // console.log(mediaRecorder.state); 
        })
        start.addEventListener('mousedown', function(ev) {
            start.style.color = "red";
            mediaRecorder.start();
            // console.log(mediaRecorder.state); 
        })

        // Stop event 
        start.addEventListener('mouseup', function(ev) {
            mediaRecorder.stop();
            start.style.color = "black";
            // console.log(mediaRecorder.state); 
        });
        start.addEventListener('touchend', function(ev) {
            mediaRecorder.stop();
            start.style.color = "black";
            // console.log(mediaRecorder.state); 
        });
        start.addEventListener('mouseleave', function(ev) {
            mediaRecorder.stop();
            start.style.color = "black";
            // console.log(mediaRecorder.state); 
        });

        // Play event 
        playAudio.addEventListener('click', function(ev) {
            audio.play();
            // console.log(mediaRecorder.state); 
        });

        // If audio data available then push  
        // it to the chunk array 
        mediaRecorder.ondataavailable = function(ev) {
            dataArray.push(ev.data);
        }

        // Chunk array to store the audio data  
        let dataArray = [];

        // Convert the audio data in to blob  
        // after stopping the recording 
        mediaRecorder.onstop = function(ev) {
            //if(audio.duration>=1 && audio.duration!=Infinity){
            // blob of type mp3 
            let audioData = new Blob(dataArray, { 'type': 'audio/mp3;' });
            // After fill up the chunk  
            // array make it empty 
            dataArray = [];

            // Creating audio url with reference  
            // of created blob named 'audioData' 
            let audioSrc = window.URL
                .createObjectURL(audioData);
            blob2base64(audioData);
            // Pass the audio url to the 2nd video tag 
            //playAudio.src = blob2base64(audioData);
            //playAudio.setAttribute("controls", "");

            // Emit message to server
            // socket.emit('chatMessage', playAudio.outerHTML);
            //}
        }
    })

    // If any error occurs then handles the error  
    .catch(function(err) {
        console.log(err.name, err.message);
    });

 function blob2base64(superBuffer) {

    var reader = new window.FileReader();
    reader.readAsDataURL(superBuffer);
    reader.onloadend = async function() {
        base64 = reader.result;
        base64 = base64.split(',')[1];
        playAudio.src = "data:audio/mp3;base64," + base64;
        playAudio.setAttribute("controls", "");
        await sleep(300);
        playAudio.setAttribute("preload", "metadata");
        playAudio.setAttribute("duration",playAudio.duration);
        var sure;
        sure=playAudio.duration;
        console.log("Süre1:" + sure);
        emitMess(sure);
    }
}

function emitMess(sure){
    console.log("Süre2:" + sure);
        if (sure >= 1 && sure != Infinity) {
            // Emit message to server
            socket.emit('chatMessage', playAudio.outerHTML);
            
        }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
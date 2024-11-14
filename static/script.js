let isListening = false;
var flag_speech = 0;
// console.log('script.js');
const button = document.getElementById('js-button');
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new Recognition();
recognition.lang = 'ja-JP';
recognition.continuous = true;
recognition.interimResults = true;

button.addEventListener('click', function(){
    if(isListening){
        recognition.stop();
        isListening = false;
        button.classList.remove('on');
    }else{
        recognition.start();
        isListening = true;
        button.classList.add('on');
    }
});



function vr_function(){
    console.log(isListening);
    
    console.log('recognition');//test

    // //ONの時は音声認識ストップ
    // if(isListening){
    //     recognition.stop();
    //     isListening = false;
    //     button.classList.remove('on');
    // }else{//OFFの時は音声認識開始
    //     recognition.start();
    //     isListening = true;
    //     button.classList.add('on');
    // }

    const status_text = document.getElementById('js-status');
    console.log('status_text');//test

    recognition.onsoundstart = function() {
        status_text.textContent = "※認識中";
    };
    recognition.onnomatch = function() {
        status_text.textContent = "※もう一度試してください";
    };
    recognition.onerror = function() {
        status_text.textContent = "※エラー";
        if(flag_speech == 0)
          vr_function();
    };
    recognition.onsoundend = function() {
        status_text.textContent = "※停止中";
          vr_function();
    };
    
    //show result
    const resulDiv = document.getElementById('js-result');
    const messageDiv = document.getElementById('js-message');
    recognition.onresult = function(event){
        const results = event.results;//認識結果
        for(let i = 0; i < results.length; i++){
            if(results[i].isFinal){
                resulDiv.textContent = results[i][0].transcript;
                //データ送信
                data = results[i][0].transcript;
                $.ajax({
                    url:'/',
                    type:'POST',
                    data:{text:data}
                }).done(function(data){
                    if(data != "null"){
                        messageDiv.textContent = "!"+data.message;
                    }
                }).fail(function(){
                    messageDiv.textContent = "通信エラー";
                });
                
                vr_function();
            }else{
                resulDiv.textContent = "[途中経過] " + results[i][0].transcript;
                // flag_speech = 1;
            }
        }
    }
        // const resultText = results[results.length - 1][0].transcript.trim();
        // if(PrevResult == resultText){
        //     return;
        // }
    // flag_speech = 0;
    // recognition.start();
}


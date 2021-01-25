window.addEventListener('load', e =>{
    var strike = document.querySelector('#strike')
    var start = document.querySelector('#start')
    var pause = document.querySelector('#pause')
    var t_e = {}
    var intID 
    

    // plays sound
    function audio_play(name){
        var audio = new Audio('./sounds/' + name + '.mp3')
        audio.play();
    }

    // logs the beat
    function beat(tempo,subdivison){
        delay = 60000/tempo
        var cnt = 0

        intID = setInterval(function(){
            
            if(cnt > subdivison){
                tt = new Date()
                t_e = tt.getTime()
            }
            cnt += 1
        },delay)
    }


    // evaluates timing accuracy
    function timing(t_e,tempo){
        var t = new Date()
        var t_o = t.getTime()
        
        
        if(t_o > t_e + 0.5*6E4/tempo){    
            var delta = t_e + 6E4/tempo - t_o 
            var score = -Math.exp(delta/1000)
        }
        else{          
            var delta = t_o - t_e      
            var score = Math.exp(delta/1000)
        }

        console.log(score)
    }
    
    
    strike.addEventListener('click',function(){
        audio_play('strike')
        timing(t_e,120)
        
    })

    start.addEventListener('click', e => {
        beat(120,4)
    })

    pause.addEventListener('click', function(){
        clearInterval(intID)
    })

    
})
window.addEventListener('load', e =>{
    var strike = document.querySelector('#strike')
    var intID 
    var t = new Date()
    var m = new Math()

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
                console.log(t.getTime())
            }
        },delay)
    }


    // evaluates timing accuracy
    function timing(t_e){
        var t_o = t.getTime()
        var delta = t_e - t_o
        
        if(delta < 1){                      // rushing
            var score = -m.exp(delta/1000)
        }
        else{                              // dragging
            var score = m.exp(delta/1000)
        }
        return score
    }
    
    
    strike.addEventListener('click',function(){
        audio_play('strike')
        
    })
})
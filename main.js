window.addEventListener('load', e =>{
    var strike = document.querySelector('#strike')
    
    // plays sound
    function audio_play(name){
        var audio = new Audio('./sounds/' + name + '.mp3')
        audio.play();
    }

    function timing(t_e){
        var t = new Date()
        var m = new Math()
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
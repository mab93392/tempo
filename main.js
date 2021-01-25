window.addEventListener('load', e =>{
    var strike = document.querySelector('#strike')
    var start = document.querySelector('#start')
    var pause = document.querySelector('#pause')
    var count = document.querySelector('#count')
    var ctx = count.getContext('2d')
    var t_e = {}
    var cnt = 0
    var intID 
    
    // count box setup
    ctx.strokeRect(15,15,25,25)
    ctx.fill()
    ctx.fillText('1',25,26)
    

    // plays sound
    function audio_play(name){
        var audio = new Audio('./sounds/' + name + '.mp3')
        audio.play();
    }

    // logs the beat
    function beat(tempo,subdivison){
        delay = 60000/tempo
        

        intID = setInterval(function(){
            cnt += 1
            ctx.clearRect(15,15,25,25)

            if(cnt >= subdivison){
                tt = new Date()
                t_e = tt.getTime()
                c = cnt % subdivison + 1
                ctx.fillText(c.toString(),25,26)
                
            }
            else{
                ctx.fillText(cnt.toString(),25,26)
            }
            
        },delay)
    }


    // evaluates timing accuracy
    function timing(t_e,tempo){
        var t = new Date()
        var t_o = t.getTime()
        
        
        if(t_o > t_e + 0.5*6E4/tempo){           // rushing  
            var delta = t_e + 6E4/tempo - t_o 
            var score = -Math.exp(delta/1000)
        }
        else{                                    // dragging
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
window.addEventListener('load', e =>{
    var strike = document.querySelector('#strike')
    var start = document.querySelector('#start')
    var pause = document.querySelector('#pause')
    var count = document.querySelector('#count')
    var ctx = count.getContext('2d')
    var t_e = {}
    var cnt = 0
    var intID1
    
    // count box setup
    ctx.strokeRect(15,15,25,25)
    ctx.fill()
    ctx.fillText('1',25,26)
    
    // pause
    function pse(){
        clearInterval(intID1)

    }

    // plays sound
    function audio_play(name){
        var audio = new Audio('./sounds/' + name + '.mp3')
        audio.play();
    }

    // logs the beat
    function beat(tempo,subdivision,bpms){ //bpms = beats per measure
        delay = 60000/tempo // one beat
        
        // first loop handles beat
        intID1 = setInterval(function(){
            var intID2 // interval id for subdivision clock
            cnt += 1
            ctx.clearRect(15,15,25,25) // clears countbox
            let sub_cnt = 1
            
            if(cnt > bpms){ // after count off
                
                intID2 = setInterval(function(){
                    tt = new Date()
                    t_e = tt.getTime()
                    
                    if(sub_cnt == subdivision){
                        clearInterval(intID2)
                        sub_cnt = 1
                        
                    }
                    else{
                        sub_cnt += 1
                        
                    }
                },delay/subdivision)
                
                //handles count box
                if(cnt % bpms == 0){          // last beat 
                    c = bpms
                }
                else{                         // all other beats
                    c = cnt % bpms 
                }

                ctx.fillText(c.toString(),25,26)//updates count box

            }
            else{ // during count off
                
                ctx.fillText(cnt,25,26) // updates countbox
            }
            
        },delay)
    }


    // evaluates timing accuracy
    function timing(t_e,tempo,subdivision){
        var t = new Date()
        var t_o = t.getTime()
        
        
        if(t_o > t_e + 6E4/tempo/subdivision){           // rushing  
            var delta = t_e - t_o
            var score = -Math.exp(delta/1000)
        }
        else{                                    // dragging
            var delta = t_o - t_e      
            var score = Math.exp(delta/1000)
        }

    }
    
    
    strike.addEventListener('click',function(){
        audio_play('strike')
        timing(t_e,120,1)
        
    })

    start.addEventListener('click', e => {
        beat(60,1,6)
    })

    pause.addEventListener('click', function(){
        pse()
    })

    
})
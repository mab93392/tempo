window.addEventListener('load', e =>{
    const strike = document.querySelector('#strike')
    const start = document.querySelector('#start')
    const pause = document.querySelector('#pause')
    const canvas = document.querySelector('#canvas')
    const bpms_inp = document.querySelector('#bpms')
    const sub_inp = document.querySelector('#subdivision')
    const tap_t = document.querySelector('#tap')
    const tmp_inp = document.querySelector('#tempo')
    const tmp_rst = document.querySelector('#tmp_rst')
    const stk_snd = document.querySelector('#strike_sound')
    const bt_snd = document.querySelector('#beat_sound')
    const subd_snd = document.querySelector('#sub_div_sound')
    const cnt_snd = document.querySelector('#cntdn_sound')
    const ctx = canvas.getContext('2d')
    let tempo 
    let strike_snd = {volume: 0.2, name:'strike'}
    let beat_snd = {volume: 0.2, name:'beat'}
    let subdiv_snd = {volume: 0.2, name:'subdiv'}
    let cntdn_snd = {volume: 0.2, name:'cntdn'}
    let t_e = {}
    let cnt = 0
    let intID1
    let tap_i = 0
    let taps = []

 
    // game display frame work
    function disp_setup(){
        ctx.beginPath()
        ctx.arc(200,235,150,7*Math.PI/6,11*Math.PI/6,false)
        ctx.stroke()
    
        ctx.beginPath()
        ctx.moveTo(200,235)
        ctx.lineTo(70,160)
        ctx.stroke()
    
        ctx.beginPath()
        ctx.moveTo(200,235)
        ctx.lineTo(330,160)
        ctx.stroke()
    
        ctx.beginPath()
        ctx.moveTo(200,235)
        ctx.lineTo(200,85)
        ctx.stroke()
    }

    disp_setup() // initializes display

    // draws game output
    function error_draw(score){
        ctx.clearRect(65,80,265,165)
        disp_setup()
        max_er = Math.exp(6E4/tempo/subdivision/1000)
        k = score/max_er
        let angle

        if(k > 0){
            angle = 3*Math.PI/2 - (Math.PI/3)*(score - 1)/(max_er - 1)
        }  
        else{
            angle = 3*Math.PI/2 - (Math.PI/3)*(score + 1)/(max_er - 1)

        }
        
        ctx.beginPath()
        ctx.moveTo(200,235)
        ctx.lineTo(200 + 150*Math.cos(angle),235 + 150*Math.sin(angle))
        ctx.stroke()

    }

    
    // average
    function mean(arr){
        l = arr.length
        let sum = 0
        for(let i = 0; i < l; i++){
            sum = sum + arr[i]
        }
        return sum/l
    }

    // count box setup
    ctx.strokeRect(15,15,45,45)
    ctx.fillText('1',25,26)
    
    //border setup
    ctx.strokeRect(0,0,canvas.width,canvas.height)
    

    // pause
    function pse(){
        clearInterval(intID1)

    }
    // handles a tap for tempo option
    function tap_temp(){
        diff = []
        diff_i = tap_i - 1
        now = new Date()
        taps.push(now.getTime())
        if(taps.length > 2){
            for(let i = 1; i < taps.length; i++){
                diff.push(taps[i] - taps[i-1])
            }
            tmp = Math.round(60/(mean(diff)/1000))
            tmp_inp.setAttribute('value',tmp.toString())
        }
    }

    // plays sound
    function audio_play(name,volume){
        let audio = new Audio('./sounds/' + name + '.mp3')
        audio.volume = volume
        audio.play();
        
    }

    // logs the beat
    function beat(){ //bpms = beats per measure
        delay = 60000/tempo // one beat
        
        // first loop handles beat
        intID1 = setInterval(function(){
            let intID2 // interval id for subdivision clock
            cnt += 1
            ctx.clearRect(15,15,45,45) // clears countbox
            let sub_cnt = 1
            
            audio_play(beat_snd.name,beat_snd.volume)
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
                audio_play(cntdn_snd.name,cntdn_snd.volume)
            }
        },delay)
    }


    // evaluates timing accuracy
    function timing(){
        let t = new Date()
        let t_o = t.getTime()
        let delta 
        let score

        if(t_o > t_e + 6E4/tempo/subdivision/2){           // rushing  
            delta = t_e + 6E4/tempo/subdivision - t_o
            score = -Math.exp(delta/1000)
        }
        else{                                    // dragging
            delta = t_o - t_e      
            score = Math.exp(delta/1000)
        }

        return score
    }
    
    // resets values
    function reset(){
        taps.length = 0
        bpms = []
        tempo = []
        subdivision = []
        bpms_inp.value = ''
        sub_inp.value = ''
        tmp_inp.value = ''
        ctx.clearRect(15,15,45,45)
        ctx.fillText('1',25,26)
    }

    
    strike.addEventListener('click',function(){
        audio_play(strike_snd.name,strike_snd.volume)
        error_draw(timing())
    })

    start.addEventListener('click', function(){
        tempo = parseFloat(tmp_inp.value)
        bpms = parseFloat(bpms_inp.value)
        subdivision = parseFloat(sub_inp.value)
        beat()
    })

    pause.addEventListener('click', function(){
        pse()
    })

    tap_t.addEventListener('click',function(){
        tap_temp()
    })
    
    tmp_rst.addEventListener('click',function(){
        reset()
    })

    stk_snd.addEventListener('click',function(){
        if(strike_snd.volume == 0.2){
            stk_snd.textContent = "Strike Sound: Off"
            strike_snd.volume = 0
        }
       else if(strike_snd.volume == 0){
           stk_snd.textContent = "Strike Sound: On"
           strike_snd.volume = 0.2
        }
    })

    bt_snd.addEventListener('click',function(){
        if(beat_snd.volume == 0.2){
            bt_snd.textContent = "Beat Sound: Off"
            beat_snd.volume = 0
        }
       else if(beat_snd.volume == 0){
           bt_snd.textContent = "Beat Sound: On"
           beat_snd.volume = 0.2
        }
    })

    subd_snd.addEventListener('click', function(){
        if(subdiv_snd.volume == 0.2){
            subd_snd.textContent = "Subdivision Sound: Off"
            beat_snd.volume = 0
        }
       else if(subdiv_snd.volume == 0){
           subd_snd.textContent = "Subdivision Sound: On"
           subdiv_snd.volume = 0.2
        }
    })

    cnt_snd.addEventListener('click',function(){
        if(cntdn_snd.volume == 0.2){
            cnt_snd.textContent = "Count Off Sound: Off"
            cntdn_snd.volume = 0
        }
       else if(cntdn_snd.volume == 0){
           cnt_snd.textContent = "Count Off Sound: On"
           cntdn_snd.volume = 0.2
        }
    })

    
})
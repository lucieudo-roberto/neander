
const {createApp} = Vue

import components from './vue/components.js'
import Compiler    from './compile.js'
import Neander    from './neander.js'


const app = createApp({

    data() {
        
        let editor = { show: 0 }

        let machin = {
            opcodes: '',
            bnt_txt: 'init',
            sts_run: false,
            rmemory: new Array(255).fill(0),
            vlspeed: 100,
            updates: 0,
            neander: 0
        }

        let status = {
            data: { acm: 1, add: 2, pgc: 3},
            colo: ' darkorange',
            logs: ' welcome to neander-web'
        }
        
        return {
           editor, machin, status
        }
    },
    
    methods: {
        app_editor_show() { this.editor.show = 1 },
        app_editor_hidd() { this.editor.show = 0 },
        
        app_opcode_push(value) {
            let _op = value.replaceAll(" ","")

            if ( _op.length > 0 ) { 
                _op = _op.match(/([\d]{1,3}:[\d]{1,3})/gm) 
                this.machin.opcodes = _op
            } // remover isso daqui 
        },

        app_rspeed_conf(value) { this.machin.vlspeed = value },
    
        blink(box, id, vel) {
              box[id].classList.remove('blink-animation')
              box[id].style.animationDuration = `${vel/1000}s`
              box[id].offsetWidth
              box[id].classList.add('blink-animation')
        },

        fc_run() { 
            const src_code = window.localStorage.getItem('neander-code')
            const obj_code = new Compiler(src_code).compiler()
            const ram_graf = document.querySelectorAll('.ram-cell')

            if( this.machin.sts_run == false ) {
                this.machin.bnt_txt = 'stop'
                this.machin.sts_run = true
        
                if ( obj_code.status == false ) {
                    this.status.colo = 'red'
                    this.status.logs = obj_code.data;
                    this.machin.bnt_txt = 'init'
                    this.machin.sts_run = false
                }else {
                    this.status.colo = 'green'
                    this.machin.neander = new Neander(obj_code.data)
                    this.machin.neander.run(this.machin.vlspeed)
                    this.machin.neander.set_ram(this.machin.opcodes)
                    
                    this.machin.updates = setInterval(()=> {
                        this.status.data = this.machin.neander.data;
                        this.blink(ram_graf,this.machin.neander.data.add,this.machin.vlspeed)
                        this.machin.rmemory = this.machin.neander.mram;
                        this.status.logs = this.machin.neander.logs
                    },this.machin.vlspeed)
                }
            }else {
            	this.status.colo = 'darkorange'
                clearInterval(this.machin.updates)
                this.machin.bnt_txt = 'init'
                this.machin.sts_run = false
                this.machin.neander.stop()
            }
        }
    }  
})

for ( let comp of components ) {
    app.component(comp.name,comp)
}

app.mount('#app')
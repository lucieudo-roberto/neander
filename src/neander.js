
const _hex2dec = (value) => {
    return parseInt(`0x${value}`)
}


export default class {
    constructor( code ) {
        if ( code != null && code.length > 0  ) {
            this.mram = new Array(255).fill(0)
            this.logs = ''
            this.init = false 
            this.data = { acm: 0, add: 0, pgc: 0}
            
            code.forEach((value, index) => { this.mram[index] = value;});
        }
        else {return null}
    }

    opcodes = {
        x1: () => {},                                          
        x6: () => { // hlt
            this.init = false 
            clearInterval(this.stat)
        },               
        x8: () => { 
            this.data.acm = ~ this.data.acm
        },             
        x5: () => {
            this.logs = 'neander: call jmp' 
        },  
        
        x2: () => { // sta
            let indice = _hex2dec(this.mram[this.data.add+1])
            this.mram[indice] = this.data.acm.toString(16)
        },

        x3: () => { // lda
            let indice = _hex2dec(this.mram[this.data.add+1])
            this.data.acm = _hex2dec(this.mram[indice])
        },
        x4: () => { // add
            let indice = _hex2dec(this.mram[this.data.add+1])
            this.data.acm += _hex2dec(this.mram[indice])
        },
        
        x7: () => { //and
            let indice = _hex2dec(this.mram[this.data.add+1])
            this.data.acm = this.data.acm & _hex2dec(this.mram[indice])
        },

        x9: () => { //jn
            if ( this.data.acm < 0 ) {
                let indice = _hex2dec(this.mram[this.data.add+1])
                this.data.add = (_hex2dec(this.mram[indice])-1)
            }
        },

        xa: () => { //jz
            if ( this.data.acm == 0 ) {
                let indice = _hex2dec(this.mram[this.data.add+1])
                this.data.add = (_hex2dec(this.mram[indice])-1)
            }
        },

        xb: () => { //or
            
        }
    }
    
    set_ram(data) {
        if ( data != null ) {
            for ( let x of data ) {
                let _values = x.split(':')
                this.mram[_values[1]] = parseInt(_values[0]).toString(16)
            } 
        }
    }

    run(vel) {
    	let main_id = this.mram.findIndex((x)=> x == 'xd');
    	
    	this.data.add = (main_id != -1 ) ? main_id : 0;
    
        this.stat = setInterval(() => {
            if ( this.mram[this.data.add] in this.opcodes ) {
                this.opcodes[this.mram[this.data.add]]()
            }

            this.data.pgc = ( this.data.pgc >= 255 ) ? 0 : this.data.pgc += 1 
            this.data.add = ( this.data.add >= 255 ) ? 0 : this.data.add += 1 
            this.init = true
        },vel)
    }
        
    stop(){
        this.init = false 
        this.data = { acm: 0, add: false, pgc: 0}
        clearInterval(this.stat)
    }
}

// module.exports = Neander
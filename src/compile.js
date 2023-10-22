
export default class {
    
    constructor( _source_ ) {
        if ( typeof(_source_) == 'string' ) {
            this.source = _source_.toLowerCase().split('\n').filter(Boolean)
            this.source = ( this.source.length == 0 ) ? false : this.source
        }else {
            this.source = false          
        }
    }

    opcodes = { 'nop':'x1','sta':'x2','lda':'x3',
                'add':'x4','jmp':'x5','and':'x7',
                'not':'x8','hlt':'x6','jn':'x9',
                'jz':'xa','or':'xb'}
                
    tokenizer() {
        let out = []
        if (this.source != false ) {
            for ( let line of this.source ) {
                let aux = []
                let cax = line.trim().split(' ').filter(Boolean)
           
                let cmd = cax[0]
                let add = cax[1] != undefined  ? cax[1] : false
                   
                if ( cmd[0] != ';') {
                    aux.push(cmd)
                    if ( add != false && add[0] != ';' ) aux.push(add);
                    out.push(aux)
                }
            }
            return out
        }
        return false
    }

    parse( code_matrix ) {
        
        if ( code_matrix == false ) {
            return { status: ['error, code void'], data: 0 }
        }
      
        let error = [] 
        let saida = code_matrix.flat()

        code_matrix.forEach((code,line)=> {    
            if ( code.length == 2 ) {
                let opcode_exist = code[0] in this.opcodes
                let parant_valid = !isNaN(parseInt(code[1]))

                if ( ! opcode_exist ) { // if mnomic not exist
                    error.push(`line: ${line+1} :[${code[0]}] ${code[1]}, not a mnomic`);
                }
                    
                if ( ! parant_valid ) { // if parameter not a number
                    let jmp_ops = { 'jmp':0,'jz':1,'jn':2}
       
                    if ( code[0] in jmp_ops ) {
        				// tratar o forma correta do label aqui
                         error.push(`line: ${line+1} [${code[0]}] ${code[1]}, label format ivalid`);
                    }else {
                    	 error.push(`line: ${line+1} ${code[0]} ${code[1]}, expects an int value, not a str`);
                    }
                }
                if (  parant_valid ) { // if parameter is a number
                    if ( parseInt(code[1]) >= 128 || parseInt(code[1]) <= -127 ){
                        error.push(`line: ${line+1} :${code[0]} [${code[1]}], overflow 8 bits`)
                    }        
                }
            } else {
                let opcode_exist = code[0] in this.opcodes
                if (! opcode_exist ) {
                    if ( parseInt(code[0]) || code[0].charAt(code[0].length-1) != ':') {
                        error.push(`line: ${line+1} [${code[0]}], not a mnomic `);
                    }
                }
            }
        });

        return { status: error, data: saida }
    }

    compiler() {
        let code_parsed = this.parse(this.tokenizer())
        if ( code_parsed.status.length == 0  ) {

            let outpt = code_parsed.data;
            
             outpt.forEach((command, index) => {
                if ( `${command}`.indexOf(':') > -1 ) {
                        for ( let x=0; x<outpt.length; x++) {
                            if ( outpt[x] == command.slice(0,-1) ) outpt[x] = index;
                        }
                        outpt[index] = (command == 'init:' ) ? 'xd' : `xc`
                }else {
                    if ( command in this.opcodes ) outpt[index] = this.opcodes[command];
                    if (parseInt(command)) {
                    	outpt[index] = (parseInt(command)).toString(16);
                    }
                }
            });

            return {status: true, data: outpt}
        }

        return {status: false, data: code_parsed.status}
       
    }
}

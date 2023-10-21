

const status_grid = {
    name: 'status-grid',
    template: `
        <div class='status-grid'>
            <i class='ic'> acm: {{status.acm}}</i>
            <i class='ic'> pgc: {{status.pgc}}</i>
            <i class='ic'> end: {{status.add}}</i>
        </div>
    `,
    props: ['status']
};

const status_line = {
    name: 'status-line',
    template: `<div class='status_line' :style="'background-color:'+ status"></div>`,
    props:['status']
};

const console_log = {
    name: 'console-log',
    template: `<pre class='console-log'>{{erros}}</pre>`,
    props:['erros']
};

const inputs_data = {
    name: 'inputs-data',
    template: `
        <div class='data-input'>
            <label class='data-inp-label'>
                <span>value:adress</span>
                <input @change='attr_value' type='text' id='adress-vals'/>
            </label>
            
            <label class='data-inp-label'>
                <span>speed </span>
                <select @change='attr_speed' id='run-speed'>
                    <option value='50'> 0s</option>
                    <option value='500'>0.5s</option>
                    <option value='600'>0.6s </option>
                    <option value='700'>0.7s</option>
                    <option value='900'>0.9s</option>
                    <option value='1000'>1.0s</option>
                    <option value='2000'>2.0s</option>
                    <option value='3000'>3.0s</option>
                </select>
            </label>
        </div>
    `,
    
    methods: {
        attr_value(e) {this.$emit('opcode',e.target.value)},
        attr_speed(e) {this.$emit('rspeed',e.target.value)}
    }
}

const memory_grid = {
    name: 'memory-grid',
    template: `
        <div class='memory-grid'>
            <i v-for='byte in ram_buffer' class='ram-cell'>{{byte}}</i>
        </div>
    `,
    
    props: ['ram_buffer']
}

const actions = {
    name: 'actions',
    template: `
        <div class='action-code'>
            <button @click='show_edit'>edit</button>
            <button @click='exec_code'>{{init_label}}</button>
        </div>
    `,

    methods : {
        exec_code() { return this.$emit('exec-code')},
        show_edit() { return this.$emit('open-edit')}
    },

    props: ['init_label']
}

const editor = {
    name: 'editor',
    template: `
        <div v-if='show_editor' class='ghostx-wind'>
            <div class='editor-code'>
                <textarea v-model='src_code' class='sorce-code'></textarea>
                <div class='editor-buttons'>
                    <button @click='save_code' class='edit-save-bnt'>save</button>
                    <button @click='clse_edit' class='edit-exit-bnt'>exit</button>
                </div>
            </div>
        </div>
    `,

    setup() {
        const buff_back = window.localStorage.getItem('neander-code')
        const src_code = (( buff_back == null ) ? ' ;welcome to neander-web !' : buff_back)
        return {src_code}     
    },

    methods: {
        save_code() {
            window.localStorage.setItem('neander-code',this.src_code)
            alert('code saved')
        },
        clse_edit() {return this.$emit('exit-edit')}
    },

    props: ['show_editor']
}


export default  [ 
    status_grid,status_line,console_log,
    inputs_data,memory_grid,editor,actions
]

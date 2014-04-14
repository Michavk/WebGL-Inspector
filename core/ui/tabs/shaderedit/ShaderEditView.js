(function () {
    var ui = glinamespace("gli.ui");

    var ShaderEditView = function (w, elementRoot) {
        var self = this;
        this.window = w;
        this.elements = {
            view: elementRoot.getElementsByClassName("window-right-inner")[0]
        };

        this.currentProgram = null;
    };

    ShaderEditView.prototype.testChange = function() {
        var self = this;
    }

    ShaderEditView.prototype.shaderChanged = function() {
        var gl = this.window.context;
        var vs = this.program.shaders[0];
        var ps = this.program.shaders[1];

        var vsSrc = this.editorVS.getValue();
        var psSrc = this.editorPS.getValue();
        gl.shaderSource(vs, vsSrc);
        gl.shaderSource(ps, psSrc);

        gl.compileShader(vs);
        gl.compileShader(ps);

       if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(vs));
            return null;
        }

       if (!gl.getShaderParameter(ps, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(ps));
            return null;
        }

        shaderProgram = this.program;
        gl.attachShader(shaderProgram, vs);
        gl.attachShader(shaderProgram, ps);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
    }

    ShaderEditView.prototype.setProgram = function (program) {
        this.currentProgram = program;

        var node = this.elements.view;
        while (node.hasChildNodes()) {
          node.removeChild(node.firstChild);
        }

        if (program) {
            this.program = program;
            var view = this.elements.view;
            var width = view.clientWidth / 2;
            var height = view.clientHeight;

            twoColumn = document.createElement("div");
            twoColumn.className = "wrap";
            view.appendChild(twoColumn);

            leftCol = document.createElement("div");
            leftCol.className = "left_col";
            leftCol.style.width = width;
            leftCol.style.height = height;
            leftCol.style.background = "#222222";
            twoColumn.appendChild(leftCol);
            bottomLeftColFrame = document.createElement("div");
            bottomLeftColFrame.innerHTML = 
                '<p class="left_col" style="font-family:arial;color:white;font-size:14px;background-color:#222222;width:20%"> \
                        Vertex Shader \
                 </p> \
                 <button class="right_col" id="vsLoadButton" style="height:5%">Load</button> \
                ';

            rightCol = document.createElement("div");
            rightCol.className = "right_col";
            rightCol.style.width = width;
            rightCol.style.height = height;
            rightCol.style.background = "#222222";            
            twoColumn.appendChild(rightCol);
            bottomRightColFrame = document.createElement("div");
            bottomRightColFrame.innerHTML = 
                '<p class="left_col" style="font-family:arial;color:white;font-size:14px;background-color:#222222;width:20%"> \
                        Fragment Shader \
                 </p> \
                 <button class="right_col" id="fsLoadButton" style="height:5%">Load</button> \
                ';

            editorViewVS = document.createElement("div");
            editorViewVS.id = "editorVS";
            editorViewVS.textContent  = program.getVertexShader(gl).source;

            this.elements.view.scrollTop = 0;
            leftCol.appendChild(editorViewVS);
            leftCol.appendChild(bottomLeftColFrame);

            // Initialize ACE editor
            this.editorVS = ace.edit("editorVS");
            this.editorVS.getSession().setUseWorker(false);
            this.editorVS.setTheme("ace/theme/monokai");
            this.editorVS.getSession().setMode("ace/mode/c_cpp");

            editorViewPS = document.createElement("div");
            editorViewPS.id = "editorPS";
            editorViewPS.textContent  = program.getFragmentShader(gl).source;

            this.elements.view.scrollTop = 0;
            rightCol.appendChild(editorViewPS);
            rightCol.appendChild(bottomRightColFrame);

            // Initialize ACE editor
            this.editorPS = ace.edit("editorPS");
            this.editorPS.getSession().setUseWorker(false);
            this.editorPS.setTheme("ace/theme/monokai");
            this.editorPS.getSession().setMode("ace/mode/c_cpp");

            var elem = this;

            $("#vsLoadButton").click(function() { elem.shaderChanged(); });

            $("#fsLoadButton").click(function() { elem.shaderChanged(); });

            // this.editorVS.getSession().on("change", function() { elem.shaderChanged(); });

            // this.editorPS.getSession().on("change", function() { elem.shaderChanged(); });

            this.testChange();
        }
    };

    ui.ShaderEditView = ShaderEditView;
})();

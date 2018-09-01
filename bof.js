var taint = require("./taint");

Interceptor.attach(ptr("0x4005B6"), { //main
    onEnter: function(args) {
        console.log("[x] enter main()");
        taint.startTracing()
        var p = Memory.readPointer(this.context.rsi.add(8));
        var l = Memory.readCString(p).length;
        //console.log(Memory.readCString(p));
        taint.memory.taint(p, l);
        taint.report()
    }
});

Interceptor.attach(ptr("0x4005df"),  //main before printf, stop tracing
    function() {
        taint.stopTracing();
        taint.report()
        
        console.log("rbp = " + this.context.rbp);
        
        if(taint.memory.isTainted(this.context.rbp, 8)) {
            console.log("BOF !!!");
            send("bof");
        }
    }
);


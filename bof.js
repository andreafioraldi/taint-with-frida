
Interceptor.attach(ptr("0x4005B6"), { //main
    onEnter: function(args) {
        console.log("[x] enter main()");
        startTracing()
        var p = Memory.readPointer(this.context.rsi.add(8));
        var l = Memory.readCString(p).length;
        //console.log(Memory.readCString(p));
        for(var i = 0; i <= l; ++i)
            taintMem(p.add(i));
        taintReport()
    }
});

Interceptor.attach(ptr("0x4005df"),  //main before printf, stop tracing
    function() {
        stopTracing();
        taintReport()
        console.log("rbp = " + this.context.rbp);
        if(findTaintedMem(this.context.rbp) !== -1) {
            console.log("BOF !!!");
            send("bof");
        }
    }
);


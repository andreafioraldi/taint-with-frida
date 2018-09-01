
Interceptor.attach(ptr("0x400603"), function () { //main
    console.log("[x] enter main()");
    startTracing();
});

Interceptor.attach(ptr("0x400596"), { //foo
    onEnter: function(args) {
        console.log("[x] enter foo()");
        for(var i = 0; i < 40; ++i)
            taintMem(this.context.rdi.add(i));
        taintReport()
    },
    onLeave: function(retval) {
        console.log("[x] leave foo()");
        stopTracing();
        taintReport();
    }
});



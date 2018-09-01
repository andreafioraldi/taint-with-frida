var taint = require("./taint");

Interceptor.attach(ptr("0x400603"), function () { //main
    console.log("[x] enter main()");
    taint.startTracing();
});

Interceptor.attach(ptr("0x400596"), { //foo
    onEnter: function(args) {
        console.log("[x] enter foo()");
        taint.memory.taint(this.context.rdi, 40);
        taint.report()
    },
    onLeave: function(retval) {
        console.log("[x] leave foo()");
        taint.stopTracing();
        taint.report()
    }
});



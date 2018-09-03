var taint = require("./taint");

taint.syscallPreHook = function(ctx) {
    var sn = ctx.rax.toInt32();
    taint.log("foo", "syscall index = " + sn);
    if(sn == 0) { //read
        taint.memory.taint(ctx.rsi, ctx.rdx);
        taint.report();
    }
    else if(sn == 60 || sn == 231) { //exit || exit_group
        taint.log("foo", "exiting");
        taint.stopTracing();
        taint.report()
    }
}

taint.syscallPostHook = function(ctx) {
    taint.log("foo", "syscall ret = " + ctx.rax);
}

Interceptor.attach(ptr("0x400643"), //main
    function() {
        taint.log("foo", "enter main()");
        taint.startTracing(true); //hook syscalls
    }
);


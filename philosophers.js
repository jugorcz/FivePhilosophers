var Fork = function() {
    this.state = 0;
    return this;
}

Fork.prototype.acquire = function(cb) { 
    // zaimplementuj funkcje acquire, tak by korzystala z algorytmu BEB
    // (http://pl.wikipedia.org/wiki/Binary_Exponential_Backoff), tzn:
    // 1. przed pierwsza proba podniesienia widelca Filozof odczekuje 1ms
    // 2. gdy proba jest nieudana, zwieksza czas oczekiwania dwukrotnie
    //    i ponawia probe itd.
    
    var that = this;
    var acquire = function(timeout, cb) {
        if(that.state == 0) {
            that.state = 1;
            cb() //minimal node.js utility for handling common callback scenarios
        }
        else {
            setTimeout(function() { acquire(2*timeout, cb); }, timeout);
        }
    }
	//setTomeout(function to call when the timer elapses, number of milliseconds to wait before calling)
    setTimeout(function() { acquire(2, cb); }, 1)
}

Fork.prototype.release = function() { 
    this.state = 0; 
}

///////////////////////////////////////////////////////////////////////

var Philosopher = function(id, forks) {
    this.id = id;
    this.forks = forks;
    this.f1 = id % forks.length;
    this.f2 = (id+1) % forks.length;
    return this;
}

Philosopher.prototype.startNaive = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    // zaimplementuj rozwiazanie naiwne
    // kazdy filozof powinien 'count' razy wykonywac cykl
    // podnoszenia widelcow -- jedzenia -- zwalniania widelcow
    
    var loop = function(count) {
        forks[f1].acquire(function() { 
            console.log("Philosopher " + id + ": left fork acquired (" + f1 + ")");
            forks[f2].acquire(function() { 
                console.log("Philosopher " + id + ": right fork acquired (" + f2 + ")"); 
                setTimeout(function() {
                    console.log("Philosopher " + id + ": forks released (" + f1 + ", " + f2 + ")");
                    forks[f1].release();
                    forks[f2].release();
                    count--;
                    if(count > 0)
                        loop(count)
                }, Math.floor((Math.random() * 2000) + 1));
            }); 
        } );
    }   

    loop(count);
}

Philosopher.prototype.startAsym = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    // zaimplementuj rozwiazanie asymetryczne
    // kazdy filozof powinien 'count' razy wykonywac cykl
    // podnoszenia widelcow -- jedzenia -- zwalniania widelcow
    
    var loop = function(count) {
		//jeśli id jest parzyste weź lewy widelec, w przciwnym wypadku prayc
        forks[(id % 2 == 0) ? f1 : f2].acquire(function() { 
            console.log("Philosopher " + id + ": left fork acquired (" + f1 + ")");
            forks[(id % 2 == 0) ? f2 : f1].acquire(function() { 
                console.log("Philosopher " + id + ": right fork acquired (" + f2 + ")"); 
                setTimeout(function() {
                    console.log("Philosopher " + id + ": forks released (" + f1 + ", " + f2 + ")");
                    forks[f1].release();
                    forks[f2].release();
                    count--;
                    if(count > 0)
                        loop(count)
                }, Math.floor((Math.random() * 2000) + 1));
            }); 
        } );
    }   

    loop(count);
}

Philosopher.prototype.startConductor = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    
    // zaimplementuj rozwiazanie z kelnerem
    // kazdy filozof powinien 'count' razy wykonywac cykl
    // podnoszenia widelcow -- jedzenia -- zwalniania widelcow

    var loop = function(count) {
        conductor.acquire(function() {
            console.log("Philosopher " + id + ": allowed to a table");
            forks[(id % 2 == 0) ? f1 : f2].acquire(function() { 
                console.log("Philosopher " + id + ": left fork acquired (" + f1 + ")");
                forks[(id % 2 == 0) ? f2 : f1].acquire(function() { 
                    console.log("Philosopher " + id + ": right fork acquired (" + f2 + ")"); 
                    setTimeout(function() {
                        console.log("Philosopher " + id + ": forks released (" + f1 + ", " + f2 + ")" + ", got back from table");
                        forks[f1].release();
                        forks[f2].release();
                        conductor.release();
                        count--;
                        if(count > 0)
                        {
                            loop(count)
                        }
                    }, Math.floor((Math.random() * 2000) + 1));
                }); 
            });
        });
    }

    loop(count);
}

///////////////////////////////////////////////////////////////////////

var Conductor = function(count) {
    this.count = count;
    return this;
}

Conductor.prototype.acquire = function(cb) { 
    // zaimplementuj funkcje acquire, tak by korzystala z algorytmu BEB
    // (http://pl.wikipedia.org/wiki/Binary_Exponential_Backoff), tzn:
    // 1. przed pierwsza proba podniesienia widelca Filozof odczekuje 1ms
    // 2. gdy proba jest nieudana, zwieksza czas oczekiwania dwukrotnie
    //    i ponawia probe itd.
    
    var that = this;
    var acquire = function(timeout, cb) {
        if(that.count > 0) {
            that.count--;
            cb()
        }
        else {
            setTimeout(function() { acquire(2*timeout, cb); }, timeout);
        }
    }

    setTimeout(function() { acquire(2, cb); }, 1)
}

Conductor.prototype.release = function() { 
    this.count++; 
}

///////////////////////////////////////////////////////////////////////



var forkCount = 5;
var philosopherCount = 5;
conductor = new Conductor(forkCount - 1);
var forks = [];
var philosophers = []
for (var i = 0; i < forkCount; i++) {
    forks.push(new Fork());
}

for (var i = 0; i < philosopherCount; i++) {
    philosophers.push(new Philosopher(i, forks));
}

for (var i = 0; i < philosopherCount; i++) {
    philosophers[i].startNaive(1);
}

//node philosophers.js 

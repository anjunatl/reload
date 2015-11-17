describe('reload.js', function() {
  beforeEach(function() {
    spyOn(window.location, 'reload');
    spyOn(console, 'error');
  });

  it('throws error when no url is supplied', function() {
    var url = null;
    var fn = function() { return "0.1.2"; };
    var interval = 10000;

    expect(function() {
      reload.ifThisChangesOverTime(url, interval, fn);
    }).toThrowError();
  });

  it('throws error when an empty url is supplied', function() {
    var url = "";
    var fn = function() { return "0.1.2"; };
    var interval = 10000;

    expect(function() {
      reload.ifThisChangesOverTime(url, interval, fn);
    }).toThrowError();
  });

  it('throws error when no lookup function is supplied', function() {
    var url = "version.json";
    var fn = null;
    var interval = 10000;

    expect(function() {
      reload.ifThisChangesOverTime(url, interval, fn);
    }).toThrowError();
  });

  it('throws error when no interval is supplied', function() {
    var url = "version.json";
    var fn = function() { return "0.1.2"; };
    var interval = null;

    expect(function() {
      reload.ifThisChangesOverTime(url, interval, fn);
    }).toThrowError();
  });

  it('throws error when the interval supplied is not a number', function() {
    var url = "version.json";
    var fn = function() { return "0.1.2"; };
    var interval = "ducks";

    expect(function() {
      reload.ifThisChangesOverTime(url, interval, fn);
    }).toThrowError();
  });

  it('throws error when the time interval is negative', function() {
    var url = "version.json";
    var fn = function() { return "0.1.2"; };
    var interval = -42;

    expect(function() {
      reload.ifThisChangesOverTime(url, interval, fn);
    }).toThrowError();
  });

  it('throws error when the lookup function is not a function', function() {
      var url = "version.json";
      var fn = function() { return "0.1.2"; };
      var interval = 1000;

      expect(function() {
        reload.ifThisChangesOverTime(url, fn, interval);
      }).toThrowError();
    });

  it('starts working if you gave it parameters it likes', function() {
    var url = "version.json";
    var fn = function() { return "0.1.2"; };
    var interval = 1000;

    spyOn(window, 'setInterval');
    reload.ifThisChangesOverTime(url, interval, fn);
    expect(window.setInterval).toHaveBeenCalled();
  });

  it('reloads immediately when now() is invoked', function() {
    reload.now();
    expect(window.location.reload).toHaveBeenCalled();
  });


});

describe('reload.js asynchronously fails', function() {
  var server, originalTimeout;

  beforeEach(function(done) {
    spyOn(console, 'error');
    server = sinon.fakeServer.create();
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    server.autoRespond = true;

    server.respondWith(function(request) {
      request.respond(404);
      done();
    });

    var interval = 1000;
    var getter = function(data) {
      return data.version;
    };

    reload.ifThisChangesOverTime("version.json", interval, getter);
  });

  afterEach(function() {
    server.restore();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('when it polls for something that does not exist', function(done) {
    expect(console.error).toHaveBeenCalled();
    done();
  });
});

describe('reload.js asynchronously succeeds', function() {
  var server, originalTimeout;

  beforeEach(function(done) {
    spyOn(reload, 'now');
    server = sinon.fakeServer.create();
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    server.autoRespond = true;

    var counter = 0;
    var responder = function(request) {
      if (counter < 2) {
        request.respond(200, "Content-Type: application/json", JSON.stringify({"version": "0.0.1"}));
      }
      if (counter == 2) {
        request.respond(200, "Content-Type: application/json",JSON.stringify({version: "0.0.2"}));
        done();
      }
      counter++;
    };

    server.respondWith(responder);

    var interval = 100;
    var getter = function(data) {
      return data.version;
    };

    reload.ifThisChangesOverTime("version.json", interval, getter);
  });

  afterEach(function() {
    server.restore();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('when it polls for something that exists that changes over time', function(done) {
    expect(reload.now).toHaveBeenCalled();
    done();
  });
});
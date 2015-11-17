(function(document, window) {

  var thingWeAreWatching;

  window.reload.ifThisChangesOverTime = ifThisChangesOverTime;

  function ifThisChangesOverTime(url, timeInterval, functionThatReturnsTheThingWeAreWatching) {
    if (!url || url.trim() === "") {
      throw new Error("[reload] ifThisChangesOverTime - url not supplied");
    }
    if (!functionThatReturnsTheThingWeAreWatching) {
      throw new Error("[reload] ifThisChangesOverTime - functionThatReturnsTheThingWeAreWatching not supplied");
    }
    if(typeof functionThatReturnsTheThingWeAreWatching !== "function") {
      throw new Error("[reload] ifThisChangesOverTime - functionThatReturnsTheThingWeAreWAtching is not a function");
    }
    if (timeInterval === null) {
      throw new Error("[reload] ifThisChangesOverTime - timeInterval not supplied");
    }
    if (typeof timeInterval !== "number") {
      throw new Error("[reload] ifThisChangesOverTime - timeInterval supplied is not a number");
    }
    if (timeInterval < 0) {
      throw new Error("[reload] ifThisChangesOverTime - timeInterval is negative. What do you think you are, a Time Lord?");
    }

    _ifThisChangesOverTime(url, functionThatReturnsTheThingWeAreWatching, timeInterval, _ajaxPollerProvider);
  }

  function _ifThisChangesOverTime(url, functionThatReturnsTheThingWeAreWatching, timeInterval, pollerProvider) {
    var poller = pollerProvider(url, _getSuccessHandler(functionThatReturnsTheThingWeAreWatching), _getFailureHandler());
    setInterval(poller, timeInterval);
  }

  function _ajaxPollerProvider(url, success, failure) {
    return function() {
      var xmlHttpRequest = new XMLHttpRequest();
      xmlHttpRequest.open('GET', url, true);
      xmlHttpRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.responseText);
            success(data);
          } else {
            failure();
          }
        }
      };

      xmlHttpRequest.send();
      xmlHttpRequest = null;
    };
  }

  function _getSuccessHandler(functionThatReturnsTheThingWeAreWatching) {
    return function(data) {
      var thingIsCurrently = functionThatReturnsTheThingWeAreWatching(data);
      if (!thingWeAreWatching) {
        thingWeAreWatching = thingIsCurrently;
      } else {
        if (thingWeAreWatching !== thingIsCurrently) {
          window.reload.now();
        }
      }
    }
  }

  function _getFailureHandler() {
    return function(data){
      console.error("[reload] ifThisChangesOverTime - error while polling url", data);
    }
  }
})(document, window);
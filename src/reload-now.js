(function(document, window) {

  window.reload.now = doItNow;


  function doItNow() {
    doReload();
  }


  function doReload() {
    window.location.reload();
  }


})(document, window);
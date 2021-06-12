(function () {
  var iframe = document.getElementById('iframe');
  var imageCount = document.images.length;
  var failedImage = [];
  var successfulImage = [];
  var failed = false;
  var SUCCESSFUL_URL =
    'shopee://com.print.image.load/success?data=' + encodeURIComponent('{}');
  var FAILED_URL =
    'shopee://com.print.image.load/failure?data=' + encodeURIComponent('{}');

  function sendMessage(msg, maxNum) {
    var num = 0;
    maxNum = maxNum || 20;
    var interval = setInterval(() => {
      if (num > maxNum) {
        clearInterval(interval);
      }
      window.postMessage(msg);
      num++;
    }, 1000);
  }

  function getCapture() {
    html2canvas(document.body, {
      allowTaint: true,
      useCORS: true,
    }).then((canvas) => {
      var imageUrl = canvas.toDataURL();
      sendMessage(imageUrl);
    });
  }

  var timer = setTimeout(function () {
    if (successfulImage.length !== imageCount) {
      sendMessage('error');
      iframe.src = FAILED_URL;
      failed = true;
    }
  }, 7000);
  if (imageCount === 0) {
    clearTimeout(timer);
    getCapture();
    iframe.src = SUCCESSFUL_URL;
  }
  for (var index = 0; index < imageCount; index++) {
    const imageOnLoad = function () {
      if (failed) return;
      successfulImage.push(image);
      if (successfulImage.length === imageCount) {
        clearTimeout(timer);
        getCapture();
        iframe.src = SUCCESSFUL_URL;
      }
    };
    var image = document.images[index];
    if (image.complete) imageOnLoad();
    image.onload = imageOnLoad;
    image.onerror = function () {
      sendMessage('error');
      iframe.src = FAILED_URL;
      failedImage.push(image);
    };
  }

  var ua = navigator.userAgent;
  function isAndroid() {
    return /Android/i.test(ua);
  }
  function isIos() {
    return /iPhone|iPad|iPod|iOS/i.test(ua);
  }
  function isWeb() {
    return /windows|win32|win64|wow32|wow64|macintosh|macintel|x11/i.test(ua);
  }
  function getPlatform() {
    if (isWeb()) return 'web';
    if (isAndroid()) return 'android';
    if (isIos()) return 'ios';
    return '';
  }
  var page = document.querySelector('#container');
  var classList = page.getAttribute('class');
  page.setAttribute(
    'class',
    classList ? classList + ' ' + getPlatform() : getPlatform()
  );
})();

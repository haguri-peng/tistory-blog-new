export default function loadScript(url: string, mode: string) {
  return new Promise<void>(function (resolve, reject) {
    const script = document.createElement('script');

    if (mode == 'async') {
      script.async = true;
    } else if (mode == 'defer') {
      script.defer = true;
    }

    script.onload = function () {
      // document.body.removeChild(script);
      resolve();
    };

    script.onerror = function () {
      document.body.removeChild(script);
      reject(new Error('Script loading is failed.'));
    };

    script.src = url;

    document.body.appendChild(script);
  });
}

const { Skin } = require('tistory-skin');
const blogUrl = 'https://blog-url.tistory.com/'; // Blog url (e.g. https://haguri-peng.tistory.com/)
const tsSession = 'TSSESSION value'; // Cookies's TSSESSION (로그인한 이후 '개발자 도구 > Application > Storage > Cookies'에서 확인)

(async () => {
  // Skin 정보 확인
  const skin = new Skin(blogUrl, tsSession);
  let { data } = await skin.prepare();

  /**
   * [Response(data)]
   * skinname
   * html
   * css
   * files.list
   * files.totalSize
   */
  console.log(data.files.list);
})();

const fs = require('fs');
const walk = require('walk');
const { Skin } = require('tistory-skin');

const blogUrl = 'https://haguri-peng.tistory.com/'; // Blog url (e.g. https://haguri-peng.tistory.com/)
const tsSession = '421f6c7edca8f04855c87c5e73b9ea3384314685'; // Cookies's TSSESSION (로그인 할 때마다 값이 변경됩니다. 로그인한 이후 '개발자 도구 > Application > Storage > Cookies'에서 확인)
const excpFlLst = ['sidebar', 'skinSettings', 'GoodNoteSticker']; // 삭제 예외 대상 (빌드 후 업로드 하면서 이미 등록된 파일을 clear 하는데, 이때 삭제하지 않도록 예외 처리할 파일명을 작성)

function readHtmlFileSync(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error('파일을 읽는 중 오류가 발생했습니다:', err);
    return null;
  }
}

async function changeHtml(skin) {
  console.log('+++++ changeHtml +++++');

  const { data } = await skin.prepare();
  const css = data.css;
  const isPreview = false;

  // dist/index.html
  const htmlString = readHtmlFileSync('dist/index.html');

  // console.log(htmlString);
  // console.log(css);

  if (htmlString) {
    const { data: previewUrl } = await skin.axiosInstance.post(
      '/manage/design/skin/html.json',
      {
        html: htmlString,
        css,
        isPreview,
      },
    );

    console.log(previewUrl);

    return true;
  } else {
    return null;
  }
}

async function clear(skin) {
  console.log('+++++ clear +++++');

  /**
   * [prepare Response(data)]
   * skinname
   * html
   * css
   * files.list
   * files.totalSize
   */
  const { data } = await skin.prepare();
  const uploadedFiles = data.files.list;

  uploadedFiles.forEach(async (fileinfo) => {
    const fileName = fileinfo.url.replace(
      /https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(.*?)/,
      '$1',
    );

    // 삭제 예외 대상(excpFlLst)인 경우에 pass
    let bExcp = false;
    for (const excpFile of excpFlLst) {
      if (fileName.indexOf(excpFile) > -1) {
        console.log(fileName);
        bExcp = true;
        break;
      }
    }
    if (!bExcp) {
      await skin.unlink(fileName);
    }
  });
}

async function upload(skin, dist) {
  console.log('+++++ upload +++++');

  const walker = walk.walk(dist, { followLinks: false });

  walker.on('file', async (root, stat, next) => {
    // images 폴더에 있는 파일만 업로드
    if (root.indexOf('/images') > -1) {
      console.log(`${root}/${stat.name}`);
      await skin.upload(root + '/' + stat.name);
    }

    next();
  });
}

(async () => {
  // Skin 정보 확인
  const skin = new Skin(blogUrl, tsSession);

  const result = await changeHtml(skin);
  if (result) {
    await clear(skin);

    await upload(skin, 'dist');
  }
})();

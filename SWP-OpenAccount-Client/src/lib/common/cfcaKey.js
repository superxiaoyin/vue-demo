export var numberKeyboard = null;
var blankDivId = '__blank-div__';
var sipBoxId = '';

        // 初始化
    function initNumberKeyboard() {
        //创建键盘对象
        if(numberKeyboard == null){
          numberKeyboard = new CFCAKeyboard(KEYBOARD_TYPE_NUMBER);
        }
        
          //绑定输入框
        numberKeyboard.bindInputBox('psd');
        numberKeyboard.bindInputBox('repsd');
        numberKeyboard.setCipherType(CIPHER_TYPE_SM2,'psd');
        numberKeyboard.setCipherType(CIPHER_TYPE_SM2,'repsd');
  
        
        //键盘显示回调
        numberKeyboard.setKeyboardShowCallback(keyboardShowCallback);
        numberKeyboard.setKeyboardHideCallback(keyboardHideCallback);
        
        
      }
      function initSipBoxNum(SipBoxId,random){
         //设置密码输入框最大输入长度
        numberKeyboard.setMaxLength(6, SipBoxId);
        // 关闭安全键盘的遮挡自动滚动特性, 通过键盘显示和隐藏回调自定义滚动
        numberKeyboard.setAutoScroll(false, SipBoxId);
        // 由于输入框是password, 关闭末位明文显示
        // numberKeyboard.showLastCharacter(false, SipBoxId);
        var passwordInput = window.document.getElementById(SipBoxId);
        passwordInput.addEventListener('focus', function (evt) {
          passwordInput.blur();
          numberKeyboard.bindInputBox(SipBoxId);
          //初始化光标状态
          document.getElementById('psdCursor').style.display = 'none';
          document.getElementById('repsdCursor').style.display = 'none';
          // 激活光标enableCursor必须在bindInputBox之后调用，且在showKeyboard之前调用
          numberKeyboard.enableCursor(SipBoxId + 'Cursor', 'blue', 500);
          numberKeyboard.setServerRandom(random, SipBoxId);
          //键盘排列：0代表不乱序，1代表仅数字乱序，2代表全部乱序
          // numberKeyboard.setRandomType(0,SipBoxId);
          // 显示键盘会遮挡输入框，默认的滚动不好用，需要自定义处理
          numberKeyboard.showKeyboard();
        }, false);
      }
      export function initInput(random){
          initNumberKeyboard();
          initSipBoxNum('psd',random);
          initSipBoxNum('repsd',random);
      }
      // 键盘显示回调
      function keyboardShowCallback(keyboard, sipBoxId) {
        // ios系统键盘弹出时，页面的scollTop会变
        // 在系统键盘显示的情况下弹出安全键盘, 需要滚动到初始化状态, 否则以下计算会出现问题
        window.scrollTo(0, 0);
        // 窗口高度
        var windowHeight = getWindowAvailableHeight();
        // 键盘的高度
        var keyboardHeight = keyboard.getKeyboardHeight();
        var elementInput = document.getElementById('repsd');
        // 输入框基于当前窗口的位置和大小
        var inputBounding = elementInput.getBoundingClientRect();
        // 计算出需要滚动的距离
        var needScrollDistance = keyboardHeight + inputBounding.bottom - windowHeight;
        if (needScrollDistance > 0) {
          // 当前页面已无法滚动，需要空白DIV进行填充, 将页面撑高再滚动
          var blankElement = document.getElementById(blankDivId);
          if (!blankElement) {
            blankElement = document.createElement('div');
            blankElement.id = blankDivId;
          }
          // 由于当前界面的内容区域样式为positon:absolute；需要创建一个足够高的div，将页面撑起来
          blankElement.style.height = (windowHeight + needScrollDistance + 10) + 'px';
          document.body.appendChild(blankElement);
        }
        // 进行滚动
        // 在某些ios版本的微信上，微信存在隐藏系统键盘未恢复窗口的bug，
        // 导致整个窗口出现偏移，并且会影响界面点击，所以最后都需要进行滚动，将窗口还原
        window.scrollBy(0, needScrollDistance);
      }
  
      // 键盘隐藏回调
      function keyboardHideCallback(keyboard, sipBoxId) {
        var blankElement = document.getElementById(blankDivId);
        if (blankElement && blankElement.parentNode) {
          blankElement.parentNode.removeChild(blankElement);
        }
      }
  
      // 窗口高度
      function getWindowAvailableHeight() {
        var clientHeight = (document.compatMode === 'CSS1Compat'
            ? document.documentElement.clientHeight
            : document.body.clientHeight);
        // 高度以window.innerHeight为基准，如果不存在则使用clientHeight
        return window.innerHeight || clientHeight;
      }

      // 点击安全键盘外部隐藏安全键盘
      document.addEventListener('touchstart', function(evt) {
          var elem = evt.srcElement || evt.target;
          var noNeedHideIds = [
              'CFCA_KEYBOARD_0', 'psd','repsd',
          ];
          while (elem) {
              if (noNeedHideIds.indexOf(elem.id) !== -1) {
              return;
              }
              elem = elem.parentNode;
          }
          numberKeyboard.hideKeyboard();
      }, false);

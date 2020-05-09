import {doPost} from 'sslib/common/Net.js';

let common = {
  /**
     * 获取授权时间
     * @param {*} data 
     */
    getConfigList(data){
      return doPost('debitcard/getConfigList.do', data).then(
        // 服务器正常返回
        function (result) {
          // 业务成功
          if (result.code == 0) {
            return result;
          } else {
            // 业务失败
            console.log('result error : ' + JSON.stringify(result));
          }
        },
        // 异常处理
        function (rej) {
          console.log('rej exception : ' + JSON.stringify(rej));
        }
      );
    },
    //设置授权时间
    modifyConfig(data){
      return doPost('debitcard/modifyConfig.do', data).then(
        // 服务器正常返回
        function (result) {
          // 业务成功
          if (result.code == 0) {
            return result;
          } else {
            // 业务失败
            console.log('result error : ' + JSON.stringify(result));
          }
        },
        // 异常处理
        function (rej) {
          console.log('rej exception : ' + JSON.stringify(rej));
        }
      );
    },
    isNull(str){
        if ( str == "" || str == null) {
            return true;
        } 
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },
    
  
   

}
export default common
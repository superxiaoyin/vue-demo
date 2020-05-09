/**
 * server端定义的respCodeMap:有变更需要修改
 */
let respCodeMap = {
	
};

/**
 * 服务端返回错误码处理
 */
export function getErrorMsg(code, desc) {
	return respCodeMap[code] || desc || '抱歉，网络不给力，请您稍后重试!';
}
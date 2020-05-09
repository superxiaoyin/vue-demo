import {doPost} from 'sslib/common/Net'
import {getSessionStorage,setSessionStorage,deleteSessionStorage,showToast,setStorage,getStorage} from 'sslib/common/extend'
import {OpenActionFunction,SignDataFunction,EncryptPasswordFunction} from 'sslib/common/SnJsBridge'
/**
 * 获取服务器返回数据
 */
export function getServerData(url,data,showFlag){
    return new Promise((res,rej)=>{
        doPost(url,data,showFlag).then(result=>{
            res(result);
        },
        reject=>{
            rej(reject);
        })
    })
}
/**
 *  路由跳转页
 * */
export function openRouterByValue(name,value,_this){
    _this.$router.push({name: name, query:value});
} 

/**
 *  路由返回页
 * */
export function backRouterByValue(name,value,_this){
    _this.$router.isBack = true;
    _this.$router.push({name: name, query:value});
}
/**
 *  打开app原生页面 
 */
export function openNativePage(action,dataList,responseKeyList){
    const openJson ={
        action,
        dataList,
        responseKeyList
    }
    return new Promise((res,rej)=>{
        OpenActionFunction(openJson).then(result=>{
            res(result);
        },
        reject=>{
            rej(reject);
        })
    })
}
/**
 * 
 * 格式化产品名称
 */
export function getName(pName){            
    if(!!~pName.indexOf('月月红')){
        return '月月红'
    }else if(!!~pName.indexOf('随心存')){
        return '随心存'
    }else{
        return pName
    }
}
/**
 * 
 * 格式化产品起存金额
 */
export function getAmount(amount){
    if(!!amount&&Number(amount)>0){
        if(Number(amount)>=10000000){
            return Number(amount)/1000000+'万'
        }else{
            return amount/100
        }
        
    }
    return 0
}
/**
 * 格式化产品起存日期
 */
export function getYear(days){
    if(days){
        return Number(days)/365
    }
    return 0;
}
/**
 * 格式化身份证日期
 */
export function formatDate(date){
    let reg =/[\u4e00-\u9fa5]/g;
    let year,month,day = "";
    if(date){
        if(reg.test(date)){//如果包含中文
           return date.replace(reg,'-').substr(0,date.length-1);
        }else{
            year = date.substr(0,4);
            month = date.substr(4,2);
            day = date.substr(-2); 
            return year+"-"+month+"-"+day;           
        }
    }
    return ""
}
/**
 * 格式化产品信息
 */
export function formatProduct(product){
    if(!product){
        return {};
    }
    product.pTitle = getName(product.pName)
    product.start = product.startAmount;
    product.startAmount = getAmount(product.startAmount);
    product.period = product.dueTime;
    product.dueTime = getYear(product.dueTime);
    return product;
}
/**
 * 格式化账号选择列表数据
 */
export function formatSelectList(list,balanceFlag){
    let selectList = [];
    if(!!list&&list.length){
        selectList = list.map(item=>{
            let bankName = item.bankName || '泸州银行';
            return balanceFlag?{
                title:`${bankName}(${item.account.substr(-4)})`,
                account: item.account,
                bankName: bankName,
                bankId: item.bankId || item.bankMemberId,
                name: item.name || "",
                balance: item.accountBalance
            }:{
                title:`${bankName}(${(item.cardNumber||item.accountNo).substr(-4)})`,
                account: item.cardNumber || item.accountNo,
                name: item.name || "",
                bankId: item.bankId || item.bankMemberId,
                bankName: bankName,
            }
        })
    }
    return selectList;
}
/**
 * 获取卡包中未绑定当前Ⅱ类户的一类户列表
 */
export function getNonSuperList(cardList,superList){
    let nonSuperList = [];
    if(!!cardList&&!!superList){
        for(let item of cardList){
            if(item.cardType === 10){
                let flag = superList.every(it=>{
                    return item.cardNumber !== it.accountNo
                })
                if(flag||!superList.length){
                    nonSuperList.push(item);
                }
            }
        }
    }
    return nonSuperList;
}
/**
 * 水电气数据
 */
export const chargeData = {
    1:{title:'水费',type:[{dispValue: "月结",title: "月结",value: 1},{dispValue: "预存",title: "预存",value: 2}],institutionName:"兴泸水务"},
    2:{title:'电费',type:[{dispValue: "月结",title: "月结",value: 1},{dispValue: "预存",title: "预存",value: 2}],institutionName:"国网泸州供电公司"},
    3:{title:'气费',type:[{dispValue: "月结",title: "月结",value: 1},{dispValue: "预存",title: "预存",value: 2}],institutionName:"泸州华润兴泸燃气有限公司"},
}

/**
 * 小应用配置数据
 */
export const appList = [
    {
        'appName': '开通Ⅱ类户',
        'appUrl': 'openaccount.html#/',
        'comLogoUrl': '../resource/img/23account.png',
        'appIndex': 1
    },
    {
        'appName': '个人财富',
        'appUrl': 'personalwealth.html',
        'comLogoUrl': '../resource/img/personal_wealth.png',
        'appIndex': 2
    },
    {
        'appName': '我的卡包',
        'appUrl': 'mycard.html',
        'comLogoUrl': '../resource/img/mycard.png',
        'appIndex': 3
    },
    // {
    //     'appName': '话费充值',
    //     'appUrl': 'recharge.html',
    //     'comLogoUrl': '../resource/img/accountOverview.svg',
    //     'appIndex': 4
    // },
    {
        'appName': '水费缴纳',
        'appUrl': 'charge.html?chargeType=1',
        'comLogoUrl': '../resource/img/water.png',
        'appIndex': 5
    },
    {
        'appName': '电费缴纳',
        'appUrl': 'charge.html?chargeType=2',
        'comLogoUrl': '../resource/img/electricity.png',
        'appIndex': 6
    },
    {
        'appName': '气费缴纳',
        'appUrl': 'charge.html?chargeType=3',
        'comLogoUrl': '../resource/img/gas.png',
        'appIndex': 7
    },
    // {
    //     'appName': '测试',
    //     'appUrl': 'test.html',
    //     'comLogoUrl': '../resource/img/gas.png',
    //     'appIndex': 7
    // }
]

/**
 * 理财配置数据
 */
export const wealthMap= {
    '月月红':[{title:'产品亮点',value:'一次性存入本金，每月取息',iconUrl:'../resource/img/wealth/icon_light.png'},{title:'发行单位',value:'泸州银行',iconUrl:'../resource/img/wealth/icon_unit.png'},{title:'产品概述',value:'一次性存入本金，每月取息',iconUrl:'../resource/img/wealth/icon_summary.png'},{title:'销售状态',value:'在售',iconUrl:'../resource/img/wealth/icon_state.png'}],
    '随心存':[{title:'产品亮点',value:'随存随取',iconUrl:'../resource/img/wealth/icon_light.png'},{title:'发行单位',value:'泸州银行',iconUrl:'../resource/img/wealth/icon_unit.png'},{title:'产品概述',value:'无限支取次数，按档计息',iconUrl:'../resource/img/wealth/icon_summary.png'},{title:'销售状态',value:'在售',iconUrl:'../resource/img/wealth/icon_state.png'}]
}

/**
 * 添加银行卡错误信息
 */
export const cardError= {
    1:'验证码校验失败',
    2:'卡状态异常',
    3:'非本人银行卡',
    4:'预留手机号错误',
    5:'非本行卡账号',
    6:'非一类户账号',
    7:'该账户在黑名单中'
}

/**
 * 删除浏览器缓存数据
 */
export function deleteBusinessData(key){
    if(getSessionStorage(key)){
        deleteSessionStorage(key);
    }
}
/**
 * 浏览器获取缓存数据 
 */
export function getBusinessData(key){
    if(getSessionStorage(key)){
        var data = JSON.parse(getSessionStorage(key))
        return data;
    }
    return null;
}

/**
 * 浏览器存储缓存数据
 */
export function setBusinessData(key,value){
    setSessionStorage(key,JSON.stringify(value||{}));
}

/**
 * 浏览器获取缓存数据 
 */
export function getLocalData(key){
    if(getStorage(key)){
        var data = JSON.parse(getStorage(key))
        return data;
    }
    return null;
}

/**
 * 浏览器存储缓存数据
 */
export function setLocalData(key,value){
    setStorage(key,JSON.stringify(value||{}));
}

/**
 * 数字转中文
 */
export function num2Cn(num){
    var chnNumChar         = ["零","一","二","三","四","五","六","七","八","九"];
    var chnUnitSection     = ["","万","亿","万亿","亿亿"];
    var unitPos = 0;
    var strIns = '', chnStr = '';
    var needZero = false;
    if(num === 0){
       return chnNumChar[0];
    }

    while(num > 0){
        var section = num % 10000;
        if(needZero){
              chnStr = chnNumChar[0] + chnStr;
        }
        strIns = SectionToChinese(section);
        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = (section < 1000) && (section > 0);
        num = Math.floor(num / 10000);
        unitPos++;
    }

    return chnStr;
}


function SectionToChinese(section){
      var chnNumChar         = ["零","一","二","三","四","五","六","七","八","九"];
      var chnUnitChar     = ["","十","百","千"];
      var strIns = '', chnStr = '';
      var unitPos = 0;
      var zero = true;
      while(section > 0){
        var v = section % 10;
        if(v === 0){
          if(!zero){
            zero = true;
            chnStr = chnNumChar[v] + chnStr;
          }
        } else{
          zero = false;
          strIns = chnNumChar[v];
          strIns += chnUnitChar[unitPos];
          chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
    }
    if(chnStr[0]==="一"&&chnStr[1]==="十"){
        chnStr = chnStr.replace(chnStr[0],"");
    }
    return chnStr;
 }

/**
 * 获取签名
 */
export function getSignData(data){
    return new Promise((res,rej)=>{
        SignDataFunction({'inputData':JSON.stringify(data)}).then(function(responseData){
            if(0 == responseData.retCode){
                res(responseData);
            }else{
                showToast('签名失败','middle');
            }
        },        
        reject=>{
            rej(reject);
        });
    }) 
}


/**
 * 获取签名
 */
export function getEncryptPassword(data){
    return new Promise((res,rej)=>{
        EncryptPasswordFunction({'inputData':JSON.stringify(data)}).then(function(responseData){
            if(0 == responseData.ret){
                res(responseData);
            }else{
                showToast('密码加密失败','middle');
            }
        },        
        reject=>{
            rej(reject);
        });
    }) 
}

const professionList = {
    "00000":"国家机关、党群组织、企业、事业单位负责人",
    "10000":"专业技术人员",
    "10200":"工程技术人员",
    "10300":"农业技术人员",
    "10400":"飞机和船舶技术人员",
    "10500":"卫生专业技术人员",
    "10600":"经济业务人员",
    "10700":"金融业务人员",
    "10800":"法律专业人员",
    "10900":"教学人员",
    "11000":"文学艺术工作人员",
    "11100":"体育工作人员",
    "11200":"新闻出版、文化工作人员",
    "11300":"宗教职业者",
    "11400":"其他专业技术人员",
    "20100":"行政办公人员",
    "20200":"安全保卫和消防人员",
    "20300":"邮政和电信业务人员",
    "30100":"购销人员",
    "30200":"仓储人员",
    "30300":"餐饮服务人员",
    "30400":"饭店、旅游及健身娱乐场所服务人员",
    "30500":"运输服务人员",
    "30600":"医疗卫生辅助服务人员",
    "30700":"社会服务和居民生活服务人员",
    "40100":"种植业生产人员",
    "40200":"林业生产及野生动植物保护人员",
    "40300":"畜牧业生产人员",
    "40400":"渔业生产人员",
    "40500":"水利设施管理养护人员",
    "40900":"其他农、林、牧、渔、水利业生产人员",
    "50100":"勘测及矿物开采人员",
    "50200":"金属冶炼、轧制人员",
    "50400":"化工产品生产人员",
    "50600":"机械制造加工人员",
    "50700":"机电产品装配人员",
    "51000":"机械设备修理人员",
    "51100":"电子元器件与设备制造、装配、调试及维修人员",
    "51200":"橡胶和塑料制品生产人员",
    "51300":"纺织、针织、印染人员",
    "51400":"裁剪、缝纫和皮革、毛皮制品加工制作人员",
    "51500":"粮油、食品、饮料生产加工及饲料生产加工人员",
    "51600":"烟草及其制品加工人员",
    "51700":"药品生产人员",
    "51800":"木材加工、人造板生产、木制品制作及制浆、造纸和纸制品生产加工人员",
    "51900":"建筑材料生产加工人员",
    "52000":"玻璃、陶瓷、搪瓷及其制品生产加工人员",
    "52100":"广播影视制品制作、播放及文物保护作业人员",
    "52200":"印刷人员",
    "52300":"工艺、美术品制作人员",
    "52400":"文化教育、体育用品制作人员",
    "52500":"工程施工人员",
    "52600":"运输设备操作",
    "99999":"无业"
}

export function getProfessionList(){
    let list = [];
    if(!!professionList){
        for ( let [key,val] of Object.entries(professionList)){
            let data = {};
            data.title = val;
            data.dispValue = val;
            data.value = key;
            list.push(data);
        }
    }
    return list;
}
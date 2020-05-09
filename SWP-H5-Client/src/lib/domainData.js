//二级域名

export const domainMap = [
    { id: 'yqturl', name: '', zkId: 'approval.subPath' },
    { id: 'accounturl', name: '', zkId: 'account.subPath' },
    { id: 'balanceurl', name: '', zkId: 'matchAccount.subPath' },
    { id: 'offlineurl', name: '', zkId: 'offlinePay.subPath' },
    { id: 'billurl', name: '', zkId: 'wdss.subPath' },
    { id: 'wealthurl', name: '', zkId: 'wealth.subPath' },
    { id: 'helppcurl', name: '/pages/xmgjNoCertHelp.html', zkId: 'wdss.subPath' },
    { id: 'helpappurl', name: '/pages/xmgjNoCertHelp.html', zkId: 'wdss.subPath' },
    { id: 'payrolldetailurl', name: '/home/payroll.do?active=16', zkId: 'payroll.subPath' },
    { id: 'walleturl', name: '/home/mywallet.do?active=605', zkId: 'wallet.subPath' },
    { id: 'walletdetailurl', name: '/home/wealth.do?active=13', zkId: 'wealth.subPath' },
    { id: 'companyurl', name: '/company/createcpy.html', zkId: 'company.subPath' }
];


//POC演示测试开关 默认为false
export const POCTEST = 'false';

//是否显示虚拟转账 "1"：显示，"0"：不显示；
export const cons_showeCurrency = "0";

//1：审批不同意不让选择下一次处理人; 0：自由流程
export const cons_disagreeFlag = 0;

//CA证书开关
export const CAON = 'true';

//0：不需要增发密码器功能; 1：需要增发密码器功能
export const cons_bbBindFlag = 0;

//0：不需要密码器同步功能,隐藏"密码器账号同步"项; 1：需要密码器同步功能 ,显示"密码器账号同步"项
export const cons_bbUploadFlag = 0;
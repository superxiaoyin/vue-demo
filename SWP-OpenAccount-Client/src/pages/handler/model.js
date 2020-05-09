export class WealthPayModel{
    constructor(amount,payerAccount,pName,pCode,finance,timeStamp){
        this.cpyId = -1;
        this.businessType = 1;
        this.pType = 1;
        this.amount = amount;
        this.payerAccount = payerAccount;
        this.pName = pName;
        this.pCode = pCode;
        this.extraInfo = {signData:{}};
        this.finance = finance;
        this.timeStamp = timeStamp;
    }
}

export class WealthRedeemModel{
    constructor(bankFinanceNo,amount,payeeAccount,pName,pCode,finance,timeStamp){
        this.bankFinanceNo = bankFinanceNo;
        this.cpyId = -1;
        this.businessType = 1;
        this.pType = 1;
        this.amount = amount;
        this.payeeAccount = payeeAccount;
        this.pName = pName;
        this.pCode = pCode;
        this.extraInfo = {signData:{}};
        this.finance = finance;
        this.timeStamp = timeStamp;
    }
}

export class ChargePayModel{
    constructor(name,userNo,account,money,feeType,bankName){
        this.name = name;
        this.userNo = userNo;
        this.account = account;
        this.money = money;
        this.feeType = feeType;
        this.bankName = bankName;
        this.extraInfo = {signData:{}};
    }
}

export class OperatePayModel{
    constructor(payerAccount,payerName,payeeAccount,payeeName,amount,timeStamp){
        this.payerAccount = payerAccount;
        this.payerName = payerName;
        this.payeeAccount = payeeAccount;
        this.payeeName = payeeName;
        this.amount = amount;
        this.extraInfo = {signData:{}};
        this.timeStamp = timeStamp;
    }
}

export class CardInfoModel{
    constructor(cardData){
        this.name = cardData.name;
        this.sex = cardData.sex;
        this.birthday = cardData.birth;
        this.idNo = cardData.idcard;
        // this.cardType = '身份证';
        this.idType = 1;
        // this.issueDate = cardData.issueDate;
        this.validate = cardData.validDate;
        this.invalidate = cardData.inValidDate;
        this.licenceAuthority = cardData.authority;
        this.nation = cardData.nation;
        this.nationality = "中国";
        this.registAddress = cardData.address;
    }
}

export class QRCPayModel{
    constructor(txnID,txnAmt,payerAccount,payerName,deviceId){
        this.txnID = txnID;
        this.txnAmt = txnAmt;
        this.payerAccount = payerAccount;
        this.payerName = payerName;
        this.deviceId = deviceId;
        this.extraInfo = {signData:{}};
        this.payType = 1
    }
}
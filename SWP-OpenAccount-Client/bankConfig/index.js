'use strict'

const copy = require('./copy');//引入复制模块
const bankconf = require('../bankConfig/bank.env'); //引入银行配置
const path = require('path');
const argv = process.argv;//node 参数获取

console.log('银行渠道为：', argv.slice(2));

let bankName = bankconf[argv.slice(2) || 'default'];
let entry_img = path.resolve(__dirname, bankName.entry.src_dir);
let entry_style = path.resolve(__dirname, bankName.entry.components_style);
let entry_biscomponents_img = path.resolve(__dirname, bankName.entry.biscomponents_img);
let output_img = path.resolve(__dirname, bankName.output.src_dir);
let output_style = path.resolve(__dirname, bankName.output.components_style);
let output_biscomponents_img = path.resolve(__dirname, bankName.output.biscomponents_img);
copy.copyDir(entry_img, output_img);
copy.copyDir(entry_biscomponents_img, output_biscomponents_img);
copy.copyDir(entry_style, output_style);
/**
 * Created by 圆环之理 on 2018/8/22.
 *
 * 功能：连接数据库
 *
 */
'use strict';

import mysql from 'mysql';
import config from 'config-lite'; //获取基本信息
import LogInfo from '../util/log4jsUtil'; //自定义日志文件，后面我们将会说明

const log = new LogInfo();
const defaultConfig = config(__dirname);

const db = mysql.createConnection(defaultConfig.mySqlLink);

db.connect(handleError);

// mysql错误处理
function handleError (err) {
    if (err) {
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect();
        } else {
            console.error(err.stack || err);
        }
    }
}

// 新的连接
db.on('connection', function (connection) {
    console.log('======mySql数据库连接成功======');
    log.info('mySql数据库连接成功.端口号：' + config.port); //自定义日志存储
});

// 队列中等待可用连接的回调函数被触发时
db.on('enqueue', function () {
    console.log('======mySql有新的查询======');
    log.info('mySql数据库有新的查询.端口号：' + config.port); //自定义日志存储
});


db.on('error',function (error) {
    console.error('mongooDB数据库连接错误：' + error);
    log.debug('mongooDB数据库连接成功.' + error); //自定义日志存储
    db.connect(handleError);
});

db.on('end',function () {
    console.log('mongooDB数据库断开，请重新连接.');
    log.trace('mongooDB数据库断开，请重新连接.');
    db.connect(handleError);
});

export default db;
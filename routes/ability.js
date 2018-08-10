/**
 * Created by 圆环之理 on 2018/8/5.
 *
 * 功能：特性列表路由
 *
 */
'use strict';

const express = require('express');
const router = express.Router();
const mysql = require('../shared/mysql');

const linkSql = new mysql();

router.get('/', async function(req, res, next) {
    let { offSet = '0', limit = '10' } = req.query;
    offSet = offSet !== 'NaN' ? offSet * 1 : 0;
    limit = limit * 1 + offSet;
    const data = await linkSql.query_next_until_data('ability_list', 'ability_id', offSet, limit);
    res.render('ability', { data, offSet });
});

router.get('/child', async function(req, res, next) {
    const { id } = req.query;
    const last = await linkSql.query_specify_last('ability_list', 'ability_id');
    const info = await linkSql.query_specify_data('ability_list', 'ability_id', id);
    const length = info.length > 0;
    const data = length > 0 ? info[0] : [];
    const lastFlag = length > 0 ? info[0].ability_id === last[0].ability_id : false;
    res.render('abilityChild', { data, lastFlag });
});

module.exports = router;
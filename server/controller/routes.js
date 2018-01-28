var models = require('../models');
var express = require('express');
var path = require('path');
var cheerio = require('cheerio');
var request = require('request');

models.sequelize.sync();

var router = express.Router();

router.get('/', function(req, res) {
  models.Stat.findAll().then((stats) => {
    var teamStats = [];
		// teamStats.push(stats);
    stats.forEach((stat) => {
      teamStats.push(stat);
    });
    console.log(teamStats[5])
    res.render('home', {
      stats: teamStats
    });
    // res.json(stats);
  });
});


router.get("/api/scrape", function(req,res){
	request('http://www.nfl.com/stats/categorystats?archive=false&conference=null&role=TM&offensiveStatisticCategory=TOTAL_YARDS&defensiveStatisticCategory=null&season=2017&seasonType=REG&tabSeq=2&qualified=false&Submit=Go', function(err, response, html){
		if (err) {
			throw err
		}
		var $ = cheerio.load(html);
		var results = [];
		$('#result').each(function(){
			var tr = $(this).find("tr");
			tr.each(function(){
				var teamName = $(this).find("td").eq(1).text().trim();
				var yardsPerGame = $(this).find("td").eq(6).text().trim();
				if(teamName !== ""){
					results.push({team: teamName, ypg: yardsPerGame});
				}
			});
		});
		res.json(results)
	});
});

module.exports = router;

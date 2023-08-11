const view = require('./view');
const fm = require('./fileH');
module.exports = [
	{
		mM:'get',
		'/'(req,res){
			view.go('app',req,res);
		}
	},
	{
		mM:'get',
		'/scripts'(req,res){
			fm.do(req,res);
		}
	},
	{
		mM:'get',
		'/file'(req,res){
			fm.do(req,res);
		}
	},
	{
		mM:'get',
		'/styles'(req,res){
			fm.do(req,res);
		}
	}
];

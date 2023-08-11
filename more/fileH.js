const fs = require('fs');
module.exports = {
	do(req,res){
		this[req.path](req.query.fn,res,req.query.dir,req.query.type);
	},
	"/scripts"(fn,res){
		res.file(`./more/public/scripts/${fn}.js`);
	},
	"/styles"(fn,res){
		res.file(`./more/public/scripts/${fn}.css`);
	},
	"/file"(fn,res,cDir='public/media',type='image/png'){
		//handline filetype.
		res.file(`./more/${cDir}/${fn}`,{'content-type':type});
	}
}
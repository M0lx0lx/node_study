var connect= require('connect');

var app= connect()
	.use('/root',function(req, res, next){
		console.log('root \n 1 \n')
		next()
	})
	.use(function(req, res, next){
        console.log('2 \n')
		next()
	})
	.use('/child',function(req, res, next){
		console.log('child \n 3')
		next()
	})
	.use(function(req, res, next){
			res.setHeader('Content-Type','text/html');
			res.write('<p>give you that books</p>');
			res.end('welcome to the session demo. refresh!');
	});
	app.listen(3000);

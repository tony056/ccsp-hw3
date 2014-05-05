var fs = require('fs');
var itemsFilePathname = __dirname + '/../data/test.json'; 

exports.list = function(req, res){
		//console.log('fsafas');
		fs.readFile(itemsFilePathname, 'utf8', function(err, data){
			var all = [];
			if(err){
				console.log('err');
			}
			all = JSON.parse(data);
			
			res.json(all);
		});
};

exports.create = function(req, res){
			
		var all = [];
		var item = {
			"id": req.body.id,
			"position": parseInt(req.body.position, 10),
			"text": req.body.text,
			'status': (req.body.status === true)
		};

		fs.readFile(itemsFilePathname, function(err, data){
			
			if(!err){
				if(data !== null)
					//console.log(data);
					all = JSON.parse(data);
			}
			//console.log('a: '+ (all));
			if(all.length > 0)
				item['id'] = all[all.length - 1].id + 1;
			else
				item['id'] = 0;
			if(item.position === 0){
				all.forEach(function(element, index, array){
					if(element.position >= item.position){
						element.position += 1;
					}
				});
			}
			all.push(item);

			fs.writeFile(itemsFilePathname, JSON.stringify(all), function(err){
				if(err){
					throw err;
				}
				//callback(item);
				var result = 1;
				res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });

			});
		});
};

function shiftPosition(source, status, position){
	source.forEach(function(element, index, array){
		if(element.status === status && element.position > position){
			element.position -= 1;
		}
	});
};

function sortArray(source){
	source.sort(function(a, b){
		var position1 = a.position;
		var position2 = b.position;
		return position1 - position2;
	});
};

exports.deleteItem = function(req, res){
	var removeId = parseInt(req.params.id, 10);
	console.log('remove: '+ typeof removeId);
	fs.readFile(itemsFilePathname, 'utf8', function(err, data){
		var all = [];
		if(!err){
			all = JSON.parse(data);
		}
		//var target = -1;
		all.forEach(function(element, index, array){
			console.log('ele: '+typeof element.id);
			if(element.id === removeId){
				//console.log('yes');
				shiftPosition(all, element.status, element.position);
				array.splice(index, 1);
			}
		});
		sortArray(all);
		fs.writeFile(itemsFilePathname, JSON.stringify(all), function(err){
			if (err) { throw err; }
			var result = 1;
			res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
		});
	});
};

exports.update = function(req, res){
	var all = [];
	fs.readFile(itemsFilePathname, 'utf8', function(err, data){
		if(!err){
			all = JSON.parse(data);
		}
		all.forEach(function(element, index, array){
			if(element.id === parseInt(req.params.id, 10)){
				element.status = true;
			}
		});
		fs.writeFile(itemsFilePathname, JSON.stringify(all), function(err){
			if(err) {
				throw err;
			}
			var result = 1;
			res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
		});
	});
};

exports.move = function(req, res){
	var all = [];
	fs.readFile(itemsFilePathname, 'utf8', function(err, data){
		if(!err){
			all = JSON.parse(data);
		}
		var new_position = parseInt(req.params.new_position, 10);
		var target_id = parseInt(req.params.id, 10);
		var prev_position = -1;
		for(var i = 0;i < all.length; i++){
			if(all[i].id === target_id)
				prev_position = all[i].position;
		}
		all.forEach(function(element, index, array){
			if(element.id === target_id && element.position !== new_position){
				element.position = new_position;
			}else if(element.position >= new_position){
				element.position += 1;
			}
			if(element.position > prev_position && element.position < new_position){
				element.position -= 1;
			}
		});
		fs.writeFile(itemsFilePathname, JSON.stringify(all), function(err){
			if (err) { throw err; }
			var result = 1;
			res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
		});
	});
}
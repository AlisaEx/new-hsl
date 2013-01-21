define([
  	'dojo/dom',
	'dojo/request'
], function(dom,request){
	var photos = [];
	console.log("Flickr init...");

	var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bec64c9c0f28889dc6e0c5ef7be3511f&user_id=60827818%40N07&tags=publish&format=json&nojsoncallback=1';

	request.get(url, {
		handleAs: 'json',
		headers: {
			'X-Requested-With': null
		}
	}).then(function(data){
		//console.log(data.photos.photo);
		for(i = 0; i< data.photos.photo.length; i++) {

			photo = data.photos.photo[i];

			url = "http://farm" + photo['farm'] + ".staticflickr.com/" + photo["server"] + "/" + photo["id"] + "_" + photo["secret"] + "_b.jpg"
			title = photo['title'];

			photos[i] = [title,url];
		}
		console.log(photos);
	});
})

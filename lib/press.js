/* press.js */

var Private = function() {

};

Private.prototype.is_method = function( method ) {
	if( 'undefined' === typeof method || null === method ) {
		return false;
	}
	method = method.toUpperCase();
	if( 'PUT' === method || 'GET' === method || 'DELETE' === method ) {
		return true;
	}
	return false;
};

Private.prototype.is_action = function( action ) {
	if( 'favorite' === action || 'archive' === action ||  'watch' === action ||  'read' === action || 'see' === action || 'listen' === action ||  'post' === action ||  'checkin' === action ||  '' === action ) {
		return true;
	}
	return false; 
};

Private.prototype.is_service = function( service ) {
	if( 'undefined' === typeof service || null === service ) {
		return false;
	}
	service = service.toLowerCase();
	if(  'facebook' === service || 'google' === service || 'linkedin' === service || 'twitter' === service || 'windows' === service || 'foursquare' === service || 'yahoo' === service ||  'github' === service || 'tumblr' === service ) {
		return true;
	}
	return false;
};

/* Reply */

Private.prototype.is_reply = function( obj ) {
	return false;
};

/* Utilities */

/* */
/* Begin Utilities */
/* */

Private.prototype.is_object = function( obj ) {
	return true;
};

Private.prototype.is_array = function( obj ) {
	return true;
};

Private.prototype.is_date = function( obj ) {
	return true;
};

Private.prototype.has_model = function( attr ) {
	if( 'undefined' !== typeof attr && null !== attr ) {
		if( 'location' === attr || 'author' === attr || 'published' === attr || 'views' === attr || 'clicks' === attr || 'link' === attr || 'status' === attr || 'content' === attr || 'video' === attr || 'audio' === attr || 'image' === attr || 'place' === attr ) {
			return true;
		}
	} 
	return false;
};

Private.prototype.is_model = function( obj ) {

};

/* */
/* End Utilities 
/* */

/* Objects */

/* */
/* Begin Objects */
/* */

/* Link */

/* Example: 
 * 	{ url: required
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, clicks: { stats object: optional }
 *	, views: { stats object: optional }
 * 	}
 * */

Private.prototype.is_link = function( obj ) {
	
	var model = {
		url: true
		, image: false
		, title: false
		, description: false
		, author: false
		, publisher: false
		, clicks: false
		, views: false
	};

	return Private.prototype.is_model( obj, model );

};

/* Status */

/* Example: 
 * 	{ text: required
 * 	, image: { image object: optional }
 * 	, video: { video object: optional }
 * 	, audio: { audio object: optional }
 *	, location: { location object: optional } 
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 * 	, views: optional
 * 	, comments_count: optional
 * 	, comments: optional
 * 	}
 * */

Private.prototype.is_status = function( obj ) {

	var model = {
		link: false
		, text: false
		, location: false
		, image: false
		, author: false
		, publisher: false
		, image: false
		, video: false
		, audio: false
		, views: false
		, comments_count: false
		, comments: false
	};


	return Private.prototype.is_model( obj, model );

};

/* Content */

/* Example: 
 * 	{ link: { link object: optional }
 * 	, text: required
 * 	, image: { image object: optional }
 * 	, video: { video object: optional }
 * 	, audio: { audio object: optional }
 * 	, title: optional
 *	, description: optional
 *	, location: { location object: optional } 
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 * 	, views: optional
 * 	, comments_count: optional
 * 	, comments: optional
 * 	}
 * */

Private.prototype.is_content = function( obj ) {

	var model = {
		link: false
		, text: false
		, location: false
		, image: false
		, vidio: false
		, audio: false
		, author: false
		, publisher: false
		, image: false
		, title: { string: false }
		, description: { string: false }
		, views: false
		, comments_count: false
		, comments: false
	};

	return Private.prototype.is_model( obj, model );

};

/* Audio */

/* Example: 
 * 	{ link: { link object: required }
 *	, source: { source object: optional }
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, location: { location object: optional } 
 *	, length: optional
 *	, begin: optional
 *	, end: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 * 	}
 * */

Private.prototype.is_audio = function( obj ) {

	var model = {
		link: true
		, source: false
		, location: false
		, image: false
		, author: false
		, publisher: false
		, length: { 'number': false }
		, begin: { 'number': false }
		, end: { 'number': false }
		, image: false
		, title: { string: false }
		, description: { string: false }
		, views: false
		, comments_count: false
		, comments: false
	};

	return Private.prototype.is_model( obj, model );

};

/* Video */

/* Example: 
 * 	{ link: { link object: required }
 *	, source: { source object: optional }
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, location: { location object: optional } 
 *	, length: optional
 *	, begin: optional
 *	, end: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 * 	}
 * */

Private.prototype.is_video = function( obj ) {

	var model = {
		link: true
		, format: { 'string': false }
		, source: false
		, location: false
		, image: false
		, author: false
		, publisher: false
		, length: { 'number': false }
		, begin: { 'number': false }
		, end: { 'number': false }
		, image: false
		, title: { string: false }
		, description: { string: false }
		, views: false
		, comments_count: false
		, comments: false
	};

	return Private.prototype.is_model( obj, model );

};

/* Image */

/* Example: 
 * 	{ link: { link object: required }
 *	, source: { source object: optional }
 *	, location: { location object: optional } 
 * 	, title: optional
 *	, description: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 * 	}
 * */

Private.prototype.is_image = function( obj ) {

	var model = {
		link: true
		, source: false
		, location: false
		, author: false
		, publisher: false
		, image: false
		, title: { string: false }
		, description: { string: false }
		, views: false
		, comments_count: false
		, comments: false
	};

	return Private.prototype.is_model( obj, model );

};

/* Place */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: required } 
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.prototype.is_place = function( obj ) {

	var model = {
		link: false
		, location: true
		, image: false
		, title: { string: false }
		, description: { string: false }
		, views: false
		, comments_count: false
		, comments: false
		, contents_count: false
		, contents: false
	};

	return Private.prototype.is_model( obj, model );

};

/* Stats */

/* Example: 
 *	{ source: { source object: optional }
 * 	, title: optional
 * 	, link: { link object: optional }
 *	, description: optional
 *	, data: required
 *	, location: { location object: optional } 
 * 	}
 * */

Private.prototype.is_stats = function( obj ) {

	var model = {
		link: false
		, location: false
		, source: false
		, title: { string: false }
		, description: { string: false }
		, data: true
	};

	return Private.prototype.is_model( obj, model );

};

Private.prototype.is_clicks = function( obj ) {
	return this.is_stats( obj );
};

Private.prototype.is_views = function( obj ) {
	return this.is_stats( obj );
};

/* Location */

/* Example: 
 * 	{ link: { link object: optional }
 * 	, image: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 * 	}
 * */

Private.prototype.is_location = function( obj ) {

	var model = {
		link: false
		, longitude: { number: true }
		, latitude: { number: true }
		, image: false
		, name: { string: false }
		, description: { string: false }
		, views: false
		, contents_count: false
		, contents: { array: false }
	};

	return Private.prototype.is_model( obj, model );

};

/* Author */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, name: required
 *	, description: optional
 *	, views: { stats object: optional }
 *	, content_count: { stats object: optional }
 *	, content: optional
 * 	}
 * */

Private.prototype.is_author = function( obj ) {

	var model = {
		link: false
		, location: false
		, image: false
		, name: { string: true }
		, description: { string: true }
		, views: false
		, contents_count: false
		, contents: { array: false }
	};

	return Private.prototype.is_model( obj, model );

};


/* Publisher */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, name: required
 *	, description: optional
 *	, views: { stats object: optional }
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.prototype.is_publisher = function( obj ) {

	var model = {
		link: false
		, location: false
		, image: false
		, name: { string: true }
		, description: { string: true }
		, views: false
		, contents_count: false
		, contents: { array: false }
	};

	return Private.prototype.is_model( obj, model );

};


/* Source */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, name: required string
 *	, description: optional string
 *	, views: { stats object: optional }
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.prototype.is_source = function( obj ) {

	var model = {
		link: false
		, format: false
		, location: false
		, image: false
		, name: { string: false }
		, description: { string: false }
		, views: false
		, contents_count: false
		, contents: { array: false }
	};

	return Private.prototype.is_model( obj, model );

};


/* */
/* End Objects */
/* */

/* */
/* Begin Actions */
/* */

/* Favorite */

Private.prototype.favorite = function( req ) { return false; };

Private.prototype.favorite.revert = function( req ) { return false; };

/* Archive */

Private.prototype.archive = function( req ) { return false; };

Private.prototype.archive.revert = function( req ) { return false; };

/* Watch */

Private.prototype.watch = function( req ) { return false; };

Private.prototype.watch.revert = function( req ) { return false; };

/* Read */

Private.prototype.read = function( req ) { return false; };

Private.prototype.read.revert = function( req ) { return false; };

/* See */

Private.prototype.see = function( req ) { return false; };

Private.prototype.see.revert = function( req ) { return false; };

/* Listen */

Private.prototype.listen = function( req ) { return false; };

Private.prototype.listen.revert = function( req ) { return false; };

/* Checkin */

Private.prototype.checkin = function( req ) { return false; };

Private.prototype.checkin.revert = function( req ) { return false; };

/* Say */

Private.prototype.say = function( req ) { return false; };

Private.prototype.say.revert = function( req ) { return false; };

/* Trash */

Private.prototype.trash = function( req ) { return false; };

Private.prototype.trash.revert = function( req ) { return false; };

/* */
/* End Actions */
/* */

/* */
/* Begin Services */
/* */

/* Tumblr */

Private.prototype.tumblr = function( req ) { return false; };
Private.prototype.tumblr.favorite = function( req ) { return false; };
Private.prototype.tumblr.favorite.revert = function( req ) { return false; };
Private.prototype.tumblr.archive = function( req ) { return false; };
Private.prototype.tumblr.archive.revert = function( req ) { return false; };
Private.prototype.tumblr.watch = function( req ) { return false; };
Private.prototype.tumblr.watch.revert = function( req ) { return false; };
Private.prototype.tumblr.read = function( req ) { return false; };
Private.prototype.tumblr.read.revert = function( req ) { return false; };
Private.prototype.tumblr.see = function( req ) { return false; };
Private.prototype.tumblr.see.revert = function( req ) { return false; };
Private.prototype.tumblr.listen = function( req ) { return false; };
Private.prototype.tumblr.listen.revert = function( req ) { return false; };
Private.prototype.tumblr.checkin = function( req ) { return false; };
Private.prototype.tumblr.checkin.revert = function( req ) { return false; };
Private.prototype.tumblr.say = function( req ) { return false; };
Private.prototype.tumblr.say.revert = function( req ) { return false; };
Private.prototype.tumblr.trash = function( req ) { return false; };
Private.prototype.tumblr.trash.revert = function( req ) { return false; };

/* Facebook */

Private.prototype.facebook = function( req ) { return false; };
Private.prototype.facebook.favorite = function( req ) { return false; };
Private.prototype.facebook.favorite.revert = function( req ) { return false; };
Private.prototype.facebook.archive = function( req ) { return false; };
Private.prototype.facebook.archive.revert = function( req ) { return false; };
Private.prototype.facebook.watch = function( req ) { return false; };
Private.prototype.facebook.watch.revert = function( req ) { return false; };
Private.prototype.facebook.read = function( req ) { return false; };
Private.prototype.facebook.read.revert = function( req ) { return false; };
Private.prototype.facebook.see = function( req ) { return false; };
Private.prototype.facebook.see.revert = function( req ) { return false; };
Private.prototype.facebook.listen = function( req ) { return false; };
Private.prototype.facebook.listen.revert = function( req ) { return false; };
Private.prototype.facebook.checkin = function( req ) { return false; };
Private.prototype.facebook.checkin.revert = function( req ) { return false; };
Private.prototype.facebook.say = function( req ) { return false; };
Private.prototype.facebook.say.revert = function( req ) { return false; };
Private.prototype.facebook.trash = function( req ) { return false; };
Private.prototype.facebook.trash.revert = function( req ) { return false; };

/* Twitter */

Private.prototype.twitter = function( req ) { return false; };
Private.prototype.twitter.favorite = function( req ) { return false; };
Private.prototype.twitter.favorite.revert = function( req ) { return false; };
Private.prototype.twitter.archive = function( req ) { return false; };
Private.prototype.twitter.archive.revert = function( req ) { return false; };
Private.prototype.twitter.watch = function( req ) { return false; };
Private.prototype.twitter.watch.revert = function( req ) { return false; };
Private.prototype.twitter.read = function( req ) { return false; };
Private.prototype.twitter.read.revert = function( req ) { return false; };
Private.prototype.twitter.see = function( req ) { return false; };
Private.prototype.twitter.see.revert = function( req ) { return false; };
Private.prototype.twitter.listen = function( req ) { return false; };
Private.prototype.twitter.listen.revert = function( req ) { return false; };
Private.prototype.twitter.checkin = function( req ) { return false; };
Private.prototype.twitter.checkin.revert = function( req ) { return false; };
Private.prototype.twitter.say = function( req ) { return false; };
Private.prototype.twitter.say.revert = function( req ) { return false; };
Private.prototype.twitter.trash = function( req ) { return false; };
Private.prototype.twitter.trash.revert = function( req ) { return false; };

/* Github */

Private.prototype.github = function( req ) { return false; };
Private.prototype.github.favorite = function( req ) { return false; };
Private.prototype.github.favorite.revert = function( req ) { return false; };
Private.prototype.github.archive = function( req ) { return false; };
Private.prototype.github.archive.revert = function( req ) { return false; };
Private.prototype.github.watch = function( req ) { return false; };
Private.prototype.github.watch.revert = function( req ) { return false; };
Private.prototype.github.read = function( req ) { return false; };
Private.prototype.github.read.revert = function( req ) { return false; };
Private.prototype.github.see = function( req ) { return false; };
Private.prototype.github.see.revert = function( req ) { return false; };
Private.prototype.github.listen = function( req ) { return false; };
Private.prototype.github.listen.revert = function( req ) { return false; };
Private.prototype.github.checkin = function( req ) { return false; };
Private.prototype.github.checkin.revert = function( req ) { return false; };
Private.prototype.github.say = function( req ) { return false; };
Private.prototype.github.say.revert = function( req ) { return false; };
Private.prototype.github.trash = function( req ) { return false; };
Private.prototype.github.trash.revert = function( req ) { return false; };

/* Google */

Private.prototype.google = function( req ) { return false; };
Private.prototype.google.favorite = function( req ) { return false; };
Private.prototype.google.favorite.revert = function( req ) { return false; };
Private.prototype.google.archive = function( req ) { return false; };
Private.prototype.google.archive.revert = function( req ) { return false; };
Private.prototype.google.watch = function( req ) { return false; };
Private.prototype.google.watch.revert = function( req ) { return false; };
Private.prototype.google.read = function( req ) { return false; };
Private.prototype.google.read.revert = function( req ) { return false; };
Private.prototype.google.see = function( req ) { return false; };
Private.prototype.google.see.revert = function( req ) { return false; };
Private.prototype.google.listen = function( req ) { return false; };
Private.prototype.google.listen.revert = function( req ) { return false; };
Private.prototype.google.checkin = function( req ) { return false; };
Private.prototype.google.checkin.revert = function( req ) { return false; };
Private.prototype.google.say = function( req ) { return false; };
Private.prototype.google.say.revert = function( req ) { return false; };
Private.prototype.google.trash = function( req ) { return false; };
Private.prototype.google.trash.revert = function( req ) { return false; };

/* Yahoo */

Private.prototype.yahoo = function( req ) { return false; };
Private.prototype.yahoo.favorite = function( req ) { return false; };
Private.prototype.yahoo.favorite.revert = function( req ) { return false; };
Private.prototype.yahoo.archive = function( req ) { return false; };
Private.prototype.yahoo.archive.revert = function( req ) { return false; };
Private.prototype.yahoo.watch = function( req ) { return false; };
Private.prototype.yahoo.watch.revert = function( req ) { return false; };
Private.prototype.yahoo.read = function( req ) { return false; };
Private.prototype.yahoo.read.revert = function( req ) { return false; };
Private.prototype.yahoo.see = function( req ) { return false; };
Private.prototype.yahoo.see.revert = function( req ) { return false; };
Private.prototype.yahoo.listen = function( req ) { return false; };
Private.prototype.yahoo.listen.revert = function( req ) { return false; };
Private.prototype.yahoo.checkin = function( req ) { return false; };
Private.prototype.yahoo.checkin.revert = function( req ) { return false; };
Private.prototype.yahoo.say = function( req ) { return false; };
Private.prototype.yahoo.say.revert = function( req ) { return false; };
Private.prototype.yahoo.trash = function( req ) { return false; };
Private.prototype.yahoo.trash.revert = function( req ) { return false; };

/* Windows */

Private.prototype.windows = function( req ) { return false; };
Private.prototype.windows.favorite = function( req ) { return false; };
Private.prototype.windows.favorite.revert = function( req ) { return false; };
Private.prototype.windows.archive = function( req ) { return false; };
Private.prototype.windows.archive.revert = function( req ) { return false; };
Private.prototype.windows.watch = function( req ) { return false; };
Private.prototype.windows.watch.revert = function( req ) { return false; };
Private.prototype.windows.read = function( req ) { return false; };
Private.prototype.windows.read.revert = function( req ) { return false; };
Private.prototype.windows.see = function( req ) { return false; };
Private.prototype.windows.see.revert = function( req ) { return false; };
Private.prototype.windows.listen = function( req ) { return false; };
Private.prototype.windows.listen.revert = function( req ) { return false; };
Private.prototype.windows.checkin = function( req ) { return false; };
Private.prototype.windows.checkin.revert = function( req ) { return false; };
Private.prototype.windows.say = function( req ) { return false; };
Private.prototype.windows.say.revert = function( req ) { return false; };
Private.prototype.windows.trash = function( req ) { return false; };
Private.prototype.windows.trash.revert = function( req ) { return false; };

/* Foursquare */

Private.prototype.foursquare = function( req ) { return false; };
Private.prototype.foursquare.favorite = function( req ) { return false; };
Private.prototype.foursquare.favorite.revert = function( req ) { return false; };
Private.prototype.foursquare.archive = function( req ) { return false; };
Private.prototype.foursquare.archive.revert = function( req ) { return false; };
Private.prototype.foursquare.watch = function( req ) { return false; };
Private.prototype.foursquare.watch.revert = function( req ) { return false; };
Private.prototype.foursquare.read = function( req ) { return false; };
Private.prototype.foursquare.read.revert = function( req ) { return false; };
Private.prototype.foursquare.see = function( req ) { return false; };
Private.prototype.foursquare.see.revert = function( req ) { return false; };
Private.prototype.foursquare.listen = function( req ) { return false; };
Private.prototype.foursquare.listen.revert = function( req ) { return false; };
Private.prototype.foursquare.checkin = function( req ) { return false; };
Private.prototype.foursquare.checkin.revert = function( req ) { return false; };
Private.prototype.foursquare.say = function( req ) { return false; };
Private.prototype.foursquare.say.revert = function( req ) { return false; };
Private.prototype.foursquare.trash = function( req ) { return false; };
Private.prototype.foursquare.trash.revert = function( req ) { return false; };

/* Linkedin */

Private.prototype.linkedin = function( req ) { return false; };
Private.prototype.linkedin.favorite = function( req ) { return false; };
Private.prototype.linkedin.favorite.revert = function( req ) { return false; };
Private.prototype.linkedin.archive = function( req ) { return false; };
Private.prototype.linkedin.archive.revert = function( req ) { return false; };
Private.prototype.linkedin.watch = function( req ) { return false; };
Private.prototype.linkedin.watch.revert = function( req ) { return false; };
Private.prototype.linkedin.read = function( req ) { return false; };
Private.prototype.linkedin.read.revert = function( req ) { return false; };
Private.prototype.linkedin.see = function( req ) { return false; };
Private.prototype.linkedin.see.revert = function( req ) { return false; };
Private.prototype.linkedin.listen = function( req ) { return false; };
Private.prototype.linkedin.listen.revert = function( req ) { return false; };
Private.prototype.linkedin.checkin = function( req ) { return false; };
Private.prototype.linkedin.checkin.revert = function( req ) { return false; };
Private.prototype.linkedin.say = function( req ) { return false; };
Private.prototype.linkedin.say.revert = function( req ) { return false; };
Private.prototype.linkedin.trash = function( req ) { return false; };
Private.prototype.linkedin.trash.revert = function( req ) { return false; };

/* */
/* End Services */
/* */

Private.prototype.oauth = function( req ) {

	var oauth = { return false; };

	switch( req.service ) }
		case 'facebook':
			// Facebook (oAuth 2)
			oauth = new OAuth2( facebookId, facebookSecret, "https://graph.facebook.com" );
			break;
		case 'twitter':
			break;
			// Twitter (oAuth 1.0)
			oauth = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", twitterId, twitterSecret, "1.0", twitterCallbackAddress || null, "HMAC-SHA1");

		case 'github':

			// Github (oAuth 2)
			oauth = new OAuth2( githubId, githubSecret, "https://github.com", "/login/oauth/authorize", "/login/oauth/access_token", "HMAC-SHA1" );
			oauth.setAccessTokenName("oauth_token");
			break;
		case 'google':
			// Google (oAuth 2)
			oauth = new OAuth2( googleId, googleSecret,  "", "https://accounts.google.com/o/oauth2/auth", "https://accounts.google.com/o/oauth2/token" );
			break;
		case 'tumblr':
			// Tumblr (oauth 1.0)
			oauth = new OAuth( "http://www.tumblr.com/oauth/request_token", "http://www.tumblr.com/oauth/access_token", tumblrId, tumblrSecret, "1.0", tumblrCallbackAddress || null, "HMAC-SHA1" );
			break;
		case 'yahoo':
			// Yahoo (oauth 1.0)
			oauth = new OAuth( "https://api.login.yahoo.com/oauth/v2/get_request_token", "https://api.login.yahoo.com/oauth/v2/get_token", yahooId, yahooSecret, "1.0", yahooCallbackAddress || null, "HMAC-SHA1" );
			break;
		case 'foursquare':
			// Foursquare (oAuth 2)
			oauth = new OAuth2( foursquareId, foursquareSecret, "https://foursquare.com", "/oauth2/authenticate", "/oauth2/access_token", "HMAC-SHA1" );
			service.foursquare.setAccessTokenName("oauth_token");
			break;
		case 'linkedin':
			// Linkedin (oauth 1.0)
			oauth = new OAuth( "https://api.linkedin.com/uas/oauth/requestToken", "https://api.linkedin.com/uas/oauth/accessToken", linkedinId, linkedinSecret, "1.0", linkedinCallbackAddress || null, "HMAC-SHA1" );
			break;
		case 'windows':
			// Windows Live (oAuth 2)
			oauth = new OAuth2( windowsId, windowsSecret, "https://oauth.live.com", "/authorize", "/token", "HMAC-SHA1" );
			service.windows.setAccessTokenName("oauth_token");
			break;
		default: 
			break;
	}
	return oauth;
};


var Public = function( req ) {
	//check for service and access_token
		//build oAuth object, add to req.oauth

};

module.exports = new Public();

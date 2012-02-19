/* press.js */

var Private = function() {

};

Private.is_method = function( method ) {
	if( 'undefined' === typeof method || null === method ) {
		return false;
	}
	method = method.toUpperCase();
	if( 'PUT' === method || 'GET' === method || 'DELETE' === method ) {
		return true;
	}
	return false;
};

Private.is_action = function( action ) {
	if( 'favorite' === action || 'archive' === action ||  'watch' === action ||  'read' === action || 'see' === action || 'listen' === action ||  'post' === action ||  'checkin' === action ||  '' === action ) {
		return true;
	}
	return false; 
};

Private.is_service = function( service ) {
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

Private.is_reply = function( obj ) {
	return false;
};

/* Utilities */

/* */
/* Begin Utilities */
/* */

//TODO: Real implementation w/checks for object and if so make sure it has 1+ iterable own properties.
Private.is_empty = function( obj ) {
	if( null === obj || 'undefined' === typeof obj || ( 'string' === typeof obj && '' === obj ) || ( 'undefined' !== typeof obj.length && 0 === obj.length ) ) {
		return true;
	}
	if( this.is_object( obj ) && !this.has_attributes ) {
		return true;
	}
	return false;
};

Private.is_date = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : obj instanceof Date;
};

Private.is_number = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : 'number' === typeof obj;
};

Private.is_boolean = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : 'boolean' === typeof obj;
};

//note that is_empty filters out empty strings, i.e. ''
Private.is_string = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : 'string' === typeof obj;
};

Private.is_object = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : ( 'object' === typeof obj && !this.is_array( obj ) );
};

Private.has_attributes = function( obj ) {
	if( !this.is_object( obj ) ) {
		return false;
	}
	var attr;
	for( attr in obj ) {
		if( obj.hasOwnProperty( attr ) ) {
			return true;
		}
	}
	return false;
};

Private.is_array = function( obj ) {
	return ( this.is_empty( obj ) ) ? false : obj instanceof Array;
};

Private.get_model = function( type ) {
	var model = null;
	switch( type ) {
		'link':
			model = {
				url: true
				, image: false
				, title: false
				, description: false
				, author: false
				, publisher: false
				, clicks: false
				, views: false
			};
			break;
		'status':
			model = {
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
			break;
		'content': 
			model = {
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
			break;
		'audio': 
			model = {
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
			break;
		'video':
			model = {
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
			break;
		'image':
			model = {
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
			break;
		'place':
			model = {
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
			break;
		'stats':
			model = {
				link: false
				, location: false
				, source: false
				, title: { string: false }
				, description: { string: false }
				, data: true
			};
			break;
		'location':
			model = {
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
			break;
		'author':
			model = {
				link: false
				, location: false
				, image: false
				, name: { string: true }
				, description: { string: true }
				, views: false
				, contents_count: false
				, contents: { array: false }
			};
			break;
		'publisher':
			model = {
				link: false
				, location: false
				, image: false
				, name: { string: true }
				, description: { string: true }
				, views: false
				, contents_count: false
				, contents: { array: false }
			};
			break;
		'source':
			model = {
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
			break;
		default:
			break;

	};
	return model;
};

Private.has_model = function( attr ) {
	if( 'undefined' !== attr && null !== attr && null !== this.get_model( attr ) ) {
		return true;
	} 
	return false;
};

Private.is_model = function( obj, model ) {
	//object can't be model if there is no object or is no model
	if( !this.is_object( obj ) || !this.is_object( model ) ) {
		return false;
	} else {	
		var attr, item;
		for( attr in obj ) {

			item = obj[ attr ];

			if( this.is_object( item ) ) {
				
				if( this.has_model( attr ) ) {
					if( !this.is_model( obj, this.get_model( attr ) ) {
						return false;
					}
				}

				//not a model attribute, so enforce item level specs
				var attr2;
				for( attr2 in model[ attr ] ) {	
					if( 'undefined' !== typeof model[ attr] && true === model[ attr ] ) {
						if( this.is_empty( obj[ attr ] ) ) {
							return false;
						}
					}
					if( 'function' === typeof this[ 'is_' + attr2 ] ) {
						if( false === this[ 'is_' + attr2 ]( obj[ attr ] ) ) {
							return false;
						}
					}
				}

			} else if( this.is_boolean( item ) ) {	
				if( true === item ) {
					if( this.has_model( attr ) ) {
						if( !this.is_model( obj, this.get_model( attr ) ) {
							return false;
						}
					} else {
						if( 'undefined' === typeof item || null === item ) {
							return false;
						}	
					}
				} else if( false === item ) {
					if( 'undefined' !== typeof item && null !== item ) {
						if( true === item && this.has_model( attr ) && !this.is_model( obj, this.get_model( attr ) ) {
							return false;
						}
					}
				}
			}	
		}
	}

	return true;
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

Private.is_link = function( obj ) {
	return this.is_model( obj, this.get_model( 'link' ) );
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

Private.is_status = function( obj ) {
	return this.is_model( obj, this.get_model( 'status' ) );
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

Private.is_content = function( obj ) {
	return this.is_model( obj, this.get_model( 'content' ) );
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

Private.is_audio = function( obj ) {
	return this.is_model( obj, this.get_model( 'audio' ) );
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

Private.is_video = function( obj ) {
	return this.is_model( obj, this.get_model( 'video' ) );
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

Private.is_image = function( obj ) {
	return this.is_model( obj, this.get_model( 'image' ) );
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

Private.is_place = function( obj ) {
	return this.is_model( obj, this.get_model( 'place' ) );
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

Private.is_stats = function( obj ) {
	return this.is_model( obj, this.get_model( 'stats' );
};

Private.is_clicks = function( obj ) {
	return this.is_stats( obj );
};

Private.is_views = function( obj ) {
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

Private.is_location = function( obj ) {
	return this.is_model( obj, this.get_model( 'location' ) );
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

Private.is_author = function( obj ) {
	return this.is_model( obj, this.get_model( 'author' ) );
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

Private.is_publisher = function( obj ) {
	return this.is_model( obj, this.get_model( 'publisher' ) );
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

Private.is_source = function( obj ) {
	return this.is_model( obj, this.get_model( 'source' ) );
};


/* */
/* End Objects */
/* */

/* */
/* Begin Actions */
/* */

/* Action Utilities */

// accepts an array of services or a single service passed as string
// throws an error if services aren't valid
Private.apply_action = function( request, revert ) {
	var services = request.services
	  , actions = reqest.actions || request.action;

	if( this.is_empty( services ) || this.is_empty( actions ) ) {
		throw new Error( 'Must pass non-empty services and action' );
		return false;	
	};

	var revert = ( true === revert ) ? true : false
	  , x = 0
	  , xlen = services.length
	  , y = 0
	  , ylen = ( 'string' === actions ) ? 0 : actions.length
	  , service
	  , str = this.is_string( services )
	  , str2 = this.is_string( actions );

	if( !this.is_array( services ) && false === str ) {
		throw new Error( 'Cannot apply action to an empty or non-array (note: accepts single string) of services.' );
		return false;
	}
	if( !this.is_array( actions ) && false === str2 ) {
		throw new Error( 'Cannot apply an empty or non array action.' );
		return false;
	}
	if( true === str ) {
		services = [ services ];
	}
	if( true === str2 ) {
		actions = [ actions ];
	}
	for( x = 0; x < xlen; x += 1 ) {
		service = services[ x ];
		if( 'undefined' === typeof Private[ service ] ) {
			throw new Error( 'Cannot apply action to an invalid service.' );
			return false;
		}
		if( 'function' === typeof Private[ service ][ action ] ) {
			throw new Error( 'Cannot apply invalid action or non-function.' );
			return false;
		}
		if( false === revert ) {
			Private[ service ][ action ]( request );
		} else {
			Private[ service ][ action ].revert( request );
		}
	}
};

/* Favorite */

Private.favorite = function( req ) {
	this.apply_action( req );
};

Private.favorite.revert = function( req ) {
	this.apply_action( req, true );
};

/* Archive */

Private.archive = function( req ) {
	this.apply_action( req );
};

Private.archive.revert = function( req ) {
	this.apply_action( req, true );
};

/* Watch */

Private.watch = function( req ) {
	this.apply_action( req );
};

Private.watch.revert = function( req ) {
	this.apply_action( req, true );
};

/* Read */

Private.read = function( req ) {
	this.apply_action( req );
};

Private.read.revert = function( req ) {
	this.apply_action( req, true );
};

/* See */

Private.see = function( req ) {
	this.apply_action( req );
};

Private.see.revert = function( req ) {
	this.apply_action( req, true );
};

/* Listen */

Private.listen = function( req ) {
	this.apply_action( req );
};

Private.listen.revert = function( req ) {
	this.apply_action( req, true );
};

/* Checkin */

Private.checkin = function( req ) {
	this.apply_action( req );
};

Private.checkin.revert = function( req ) {
	this.apply_action( req, true );
};

/* Say */

Private.say = function( req ) {
	this.apply_action( req );
};

Private.say.revert = function( req ) {
	this.apply_action( req, true );
};

/* Trash */

Private.trash = function( req ) {
	this.apply_action( req );
};

Private.trash.revert = function( req ) {
	this.apply_action( req, true );
};

/* */
/* End Actions */
/* */

/* */
/* Begin Services */
/* */

/* Tumblr */

Private.tumblr = function( req ) { return false; };

Private.tumblr.favorite = function( req ) { return false; };

Private.tumblr.favorite.revert = function( req ) { return false; };

Private.tumblr.archive = function( req ) { return false; };

Private.tumblr.archive.revert = function( req ) { return false; };

Private.tumblr.watch = function( req ) { return false; };

Private.tumblr.watch.revert = function( req ) { return false; };

Private.tumblr.read = function( req ) { return false; };

Private.tumblr.read.revert = function( req ) { return false; };

Private.tumblr.see = function( req ) { return false; };

Private.tumblr.see.revert = function( req ) { return false; };

Private.tumblr.listen = function( req ) { return false; };

Private.tumblr.listen.revert = function( req ) { return false; };

Private.tumblr.checkin = function( req ) { return false; };

Private.tumblr.checkin.revert = function( req ) { return false; };

Private.tumblr.say = function( req ) { return false; };

Private.tumblr.say.revert = function( req ) { return false; };

Private.tumblr.trash = function( req ) { return false; };

Private.tumblr.trash.revert = function( req ) { return false; };

/* Facebook */

Private.facebook = function( req ) { return false; };
Private.facebook.favorite = function( req ) { return false; };
Private.facebook.favorite.revert = function( req ) { return false; };
Private.facebook.archive = function( req ) { return false; };
Private.facebook.archive.revert = function( req ) { return false; };
Private.facebook.watch = function( req ) { return false; };
Private.facebook.watch.revert = function( req ) { return false; };
Private.facebook.read = function( req ) { return false; };
Private.facebook.read.revert = function( req ) { return false; };
Private.facebook.see = function( req ) { return false; };
Private.facebook.see.revert = function( req ) { return false; };
Private.facebook.listen = function( req ) { return false; };
Private.facebook.listen.revert = function( req ) { return false; };
Private.facebook.checkin = function( req ) { return false; };
Private.facebook.checkin.revert = function( req ) { return false; };
Private.facebook.say = function( req ) { return false; };
Private.facebook.say.revert = function( req ) { return false; };
Private.facebook.trash = function( req ) { return false; };
Private.facebook.trash.revert = function( req ) { return false; };

/* Twitter */

Private.twitter = function( req ) { return false; };
Private.twitter.favorite = function( req ) { return false; };
Private.twitter.favorite.revert = function( req ) { return false; };
Private.twitter.archive = function( req ) { return false; };
Private.twitter.archive.revert = function( req ) { return false; };
Private.twitter.watch = function( req ) { return false; };
Private.twitter.watch.revert = function( req ) { return false; };
Private.twitter.read = function( req ) { return false; };
Private.twitter.read.revert = function( req ) { return false; };
Private.twitter.see = function( req ) { return false; };
Private.twitter.see.revert = function( req ) { return false; };
Private.twitter.listen = function( req ) { return false; };
Private.twitter.listen.revert = function( req ) { return false; };
Private.twitter.checkin = function( req ) { return false; };
Private.twitter.checkin.revert = function( req ) { return false; };
Private.twitter.say = function( req ) { return false; };
Private.twitter.say.revert = function( req ) { return false; };
Private.twitter.trash = function( req ) { return false; };
Private.twitter.trash.revert = function( req ) { return false; };

/* Github */

Private.github = function( req ) { return false; };
Private.github.favorite = function( req ) { return false; };
Private.github.favorite.revert = function( req ) { return false; };
Private.github.archive = function( req ) { return false; };
Private.github.archive.revert = function( req ) { return false; };
Private.github.watch = function( req ) { return false; };
Private.github.watch.revert = function( req ) { return false; };
Private.github.read = function( req ) { return false; };
Private.github.read.revert = function( req ) { return false; };
Private.github.see = function( req ) { return false; };
Private.github.see.revert = function( req ) { return false; };
Private.github.listen = function( req ) { return false; };
Private.github.listen.revert = function( req ) { return false; };
Private.github.checkin = function( req ) { return false; };
Private.github.checkin.revert = function( req ) { return false; };
Private.github.say = function( req ) { return false; };
Private.github.say.revert = function( req ) { return false; };
Private.github.trash = function( req ) { return false; };
Private.github.trash.revert = function( req ) { return false; };

/* Google */

Private.google = function( req ) { return false; };
Private.google.favorite = function( req ) { return false; };
Private.google.favorite.revert = function( req ) { return false; };
Private.google.archive = function( req ) { return false; };
Private.google.archive.revert = function( req ) { return false; };
Private.google.watch = function( req ) { return false; };
Private.google.watch.revert = function( req ) { return false; };
Private.google.read = function( req ) { return false; };
Private.google.read.revert = function( req ) { return false; };
Private.google.see = function( req ) { return false; };
Private.google.see.revert = function( req ) { return false; };
Private.google.listen = function( req ) { return false; };
Private.google.listen.revert = function( req ) { return false; };
Private.google.checkin = function( req ) { return false; };
Private.google.checkin.revert = function( req ) { return false; };
Private.google.say = function( req ) { return false; };
Private.google.say.revert = function( req ) { return false; };
Private.google.trash = function( req ) { return false; };
Private.google.trash.revert = function( req ) { return false; };

/* Yahoo */

Private.yahoo = function( req ) { return false; };
Private.yahoo.favorite = function( req ) { return false; };
Private.yahoo.favorite.revert = function( req ) { return false; };
Private.yahoo.archive = function( req ) { return false; };
Private.yahoo.archive.revert = function( req ) { return false; };
Private.yahoo.watch = function( req ) { return false; };
Private.yahoo.watch.revert = function( req ) { return false; };
Private.yahoo.read = function( req ) { return false; };
Private.yahoo.read.revert = function( req ) { return false; };
Private.yahoo.see = function( req ) { return false; };
Private.yahoo.see.revert = function( req ) { return false; };
Private.yahoo.listen = function( req ) { return false; };
Private.yahoo.listen.revert = function( req ) { return false; };
Private.yahoo.checkin = function( req ) { return false; };
Private.yahoo.checkin.revert = function( req ) { return false; };
Private.yahoo.say = function( req ) { return false; };
Private.yahoo.say.revert = function( req ) { return false; };
Private.yahoo.trash = function( req ) { return false; };
Private.yahoo.trash.revert = function( req ) { return false; };

/* Windows */

Private.windows = function( req ) { return false; };
Private.windows.favorite = function( req ) { return false; };
Private.windows.favorite.revert = function( req ) { return false; };
Private.windows.archive = function( req ) { return false; };
Private.windows.archive.revert = function( req ) { return false; };
Private.windows.watch = function( req ) { return false; };
Private.windows.watch.revert = function( req ) { return false; };
Private.windows.read = function( req ) { return false; };
Private.windows.read.revert = function( req ) { return false; };
Private.windows.see = function( req ) { return false; };
Private.windows.see.revert = function( req ) { return false; };
Private.windows.listen = function( req ) { return false; };
Private.windows.listen.revert = function( req ) { return false; };
Private.windows.checkin = function( req ) { return false; };
Private.windows.checkin.revert = function( req ) { return false; };
Private.windows.say = function( req ) { return false; };
Private.windows.say.revert = function( req ) { return false; };
Private.windows.trash = function( req ) { return false; };
Private.windows.trash.revert = function( req ) { return false; };

/* Foursquare */

Private.foursquare = function( req ) { return false; };
Private.foursquare.favorite = function( req ) { return false; };
Private.foursquare.favorite.revert = function( req ) { return false; };
Private.foursquare.archive = function( req ) { return false; };
Private.foursquare.archive.revert = function( req ) { return false; };
Private.foursquare.watch = function( req ) { return false; };
Private.foursquare.watch.revert = function( req ) { return false; };
Private.foursquare.read = function( req ) { return false; };
Private.foursquare.read.revert = function( req ) { return false; };
Private.foursquare.see = function( req ) { return false; };
Private.foursquare.see.revert = function( req ) { return false; };
Private.foursquare.listen = function( req ) { return false; };
Private.foursquare.listen.revert = function( req ) { return false; };
Private.foursquare.checkin = function( req ) { return false; };
Private.foursquare.checkin.revert = function( req ) { return false; };
Private.foursquare.say = function( req ) { return false; };
Private.foursquare.say.revert = function( req ) { return false; };
Private.foursquare.trash = function( req ) { return false; };
Private.foursquare.trash.revert = function( req ) { return false; };

/* Linkedin */

Private.linkedin = function( req ) { return false; };
Private.linkedin.favorite = function( req ) { return false; };
Private.linkedin.favorite.revert = function( req ) { return false; };
Private.linkedin.archive = function( req ) { return false; };
Private.linkedin.archive.revert = function( req ) { return false; };
Private.linkedin.watch = function( req ) { return false; };
Private.linkedin.watch.revert = function( req ) { return false; };
Private.linkedin.read = function( req ) { return false; };
Private.linkedin.read.revert = function( req ) { return false; };
Private.linkedin.see = function( req ) { return false; };
Private.linkedin.see.revert = function( req ) { return false; };
Private.linkedin.listen = function( req ) { return false; };
Private.linkedin.listen.revert = function( req ) { return false; };
Private.linkedin.checkin = function( req ) { return false; };
Private.linkedin.checkin.revert = function( req ) { return false; };
Private.linkedin.say = function( req ) { return false; };
Private.linkedin.say.revert = function( req ) { return false; };
Private.linkedin.trash = function( req ) { return false; };
Private.linkedin.trash.revert = function( req ) { return false; };

/* */
/* End Services */
/* */

Private.oauth = function( req ) {

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

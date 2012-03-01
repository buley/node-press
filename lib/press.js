/* press.js */

var OAuth = require("oauth").OAuth
, OAuth2 = require("oauth").OAuth2
, OAuthUtils = require('oauth/lib/_utils.js')
, querystring = require("querystring");


var Private = function() {

};

Private.prefix = 'press';

Private.service = function( service ) {
	if( 'undefined' !== typeof Private.service[ service ] ) {
		return Private.service[ service ];
	}
	return null;
};

Private.to = function( type ) {
	if( 'undefined' !== typeof Private.to[ type ] ) {
		return Private.to[ type ];
	}
	return null;
};

Private.to.facebook = {};
Private.to.twitter = {};
Private.to.google = {};
Private.to.tumblr = {};
Private.to.linkedin = {};
Private.to.yahoo = {};
Private.to.windows = {};
Private.to.foursquare = {};
Private.to.github = {};


/* */
/* Object Mapping */
/* */

/* Facebook */

/* 
 * Facebook note model:
 *
 *
 *    { id: string
 *    , from:
 *        { name: string
 *        , canvas_name: string
 *        , namespace: string
 *        , id: string
 *        }
 *    , subject%: string
 *    , message%%: string
 *    , icon: string
 *    , created_time: string
 *    , updated_time: string
 *    , comments:
 *        { data: [ //begin comments data
 *            { id: string
 *            , from:
 *                { name: string
 *                , id: string
 *                }
 *            , message: string
 *            , created_time: string
 *            }
 *	      , ... ], //end comments data
 *        , paging: { next: string }
 *    	  }
 *    , type%%: 'note'
 *    }
 *
 * % Optional at creation
 * %% Required at creation
 *
 * http://developers.facebook.com/docs/reference/api/note/
 *
 * */

Private.to.facebook.note = function( note ) {

	var model = {
		subject: ( Private.emptyPath( 'title', note ) ) ? null : note.title
		, message: ( Private.emptyPath( 'text', note ) ) ? null : note.text
		, type: 'note'
	};	

	return model;

};


/* Facebook comment (post) model:
 *
 * { message%%: required string
 * , message_tags: { field_name: [ { id: string, name: string, offset: string, length: number? }, ... ], ... }
 * , from: { id: string, name: string }
 * , to: [ { id: string, name: string }, ... ]
 * , id: string
 * , created_time: string
 * , updated_time: string
 * , likes: string
 * , object_id: number
 * , likes: { data: [ { name: string, id: string }, ... ], count: number }
 * , place: { id: string, name: string }
 * , story: string
 * , story_tags: { field_name: [ { id: string, name: string, offset: string, length: number? }, ... ], ... }
 * , comments: [ { id: string, from: string, message: string, created_time: string }, ... ]
 * , application: { name: string, id: string }
 * , picture%: string
 * , name%: string
 * , link: string
 * , caption%: string
 * , description%: string
 * , source%: string
 * , user_likes*: string (*only returned if sessioned user likes comment)
 * , type%%: 'link' || 'photo' || 'video'
 * , privacy: { value: string (EVERYONE, ALL_FRIENDS, NETWORKS_FRIENDS, FRIENDS_OF_FRIENDS, CUSTOM), friends*: string (must be specified if value is set to CUSTOM; EVERYONE, NETWORKS_FRIENDS (friends of friends), FRIENDS_OF_FRIENDS, ALL_FRIENDS, SOME_FRIENDS, SELF, NO_FRIENDS (network only) ), networks: string (comma-seperated network IDs or 1 for all user's network), allow*: string (*specified when friends is set to SOME_FRIENDS; comma-seperated friend IDs and/or user IDs), deny*: string (*specified when friends is set to SOME_FRIEND; comma-seperated friend IDs and/or user IDs ) ), description: string (comma-sperated lists of valid country, city and language) }
 * , actions: [ { name: string, link: string }, ... ]
 * , icon: string
 * , properties: [ { name: string, text: string }, ... ]
 * }
 *
 * %% Required at creation 
 *
 * http://developers.facebook.com/docs/reference/api/Comment/
 *
 * */

Private.to.facebook.comment = function( comment ) {

	/* comment in reply to an object (post, event, etc.)
	var model = {
		message: comment.text		
		, type: 'comment'
	};*/
/* xxx */
	var model = {
		message: ( Private.emptyPath( 'text', comment ) ) ? null : comment.text
		, type: 'status'
	};

	return model;

};


/* Facebook link model: 
 *
 * { id: string
 * , from: { id: string, name: string }
 * , link%: string
 * , name%: string
 * , caption%: string
 * , comments: [ //begin link comments
 * 	{ id: string
 * 	, from: { id: string, name: string }
 *	, message: string
 * 	, created_time: string
 * 	, likes: number?
 *	} ] //end link comments
 * , description%: string
 * , picture%: string (valid URI)
 * , message%: string
 * , type: 'link'
 * }
 *
 * http://developers.facebook.com/docs/reference/api/link/
 *
 * { message%%: required string
 * , message_tags: { field_name: [ { id: string, name: string, offset: string, length: number? }, ... ], ... }
 * , from: { id: string, name: string }
 * , to: [ { id: string, name: string }, ... ]
 * , id: string
 * , created_time: string
 * , updated_time: string
 * , likes: string
 * , object_id: number
 * , likes: { data: [ { name: string, id: string }, ... ], count: number }
 * , place: { id: string, name: string }
 * , story: string
 * , story_tags: { field_name: [ { id: string, name: string, offset: string, length: number? }, ... ], ... }
 * , comments: [ { id: string, from: string, message: string, created_time: string }, ... ]
 * , application: { name: string, id: string }
 * , picture%: string
 * , name%: string
 * , link%: string
 * , caption%: string
 * , description%: string
 * , source%: string
 * , user_likes*: string (*only returned if sessioned user likes comment)
 * , type%%: 'link' || 'photo' || 'video'
 * , privacy: { value: string (EVERYONE, ALL_FRIENDS, NETWORKS_FRIENDS, FRIENDS_OF_FRIENDS, CUSTOM), friends*: string (must be specified if value is set to CUSTOM; EVERYONE, NETWORKS_FRIENDS (friends of friends), FRIENDS_OF_FRIENDS, ALL_FRIENDS, SOME_FRIENDS, SELF, NO_FRIENDS (network only) ), networks: string (comma-seperated network IDs or 1 for all user's network), allow*: string (*specified when friends is set to SOME_FRIENDS; comma-seperated friend IDs and/or user IDs), deny*: string (*specified when friends is set to SOME_FRIEND; comma-seperated friend IDs and/or user IDs ) ), description: string (comma-sperated lists of valid country, city and language) }
 * , actions: [ { name: string, link: string }, ... ]
 * , icon: string
 * , properties: [ { name: string, text: string }, ... ]
 * }
 * 
 * http://developers.facebook.com/docs/reference/api/post/
 *
 * */

Private.to.facebook.link = function( link ) {
	var result = {
		link: ( Private.emptyPath( 'url', link ) ) ? null : link.url
		, name: ( Private.emptyPath( 'title', link ) ) ? null : link.title
		, description: ( Private.emptyPath( 'description', link ) ) ? null : link.description
		, caption: ( Private.emptyPath( 'source.name', link ) ) ? null : link.source.name
		, picture: ( Private.emptyPath( 'thumbnail.url', link ) ) ? null : link.thumbnail.url
		, message: ( Private.emptyPath( 'text', link ) ) ? null : link.text
		, type: 'link'
	};
	return result;
};


/* Facebook audio model:
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.facebook.audio = function( audio ) {
	return false;
};


/* Facebook video model:
 *
 * { id: string
 * , from: 
 * 	{ name: string
 *	, category: string
 *	, id: string }
 * , name%: string
 * , description%: string
 * , picture%: string (valid URI)
 * , source%: string (valid URI)
 * , format: [ 
 * 	{ embed_html: string
 *	, width: number 
 *	, height: number
 *	, filter: string ("native", "720x720", "480x480", "130x130")
 *	, picture: string (valid URI) 
 *	}
 *	, ... ]
 * , comments:
 * 	{ data: //begin link comments
 *	    [ { id: string
 * 	    , from: { id: string, name: string }
 *	    , message: string
 * 	    , created_time: string
 * 	    , likes: number?
 *	    } ] //end link comments
 * 	}
 * }
 * , embed_html: string (HTML)
 * , icon: string (valid URI)
 * , created_time: string (ISO-8601 date)
 * , updated_time: string (ISO-8601 date)
 * , type: 'video'
 * , paging: { next: string (valid URI) }
 * }
 *
 * % Optional on creation
 * %% Required on creation
 *
 * http://developers.facebook.com/docs/reference/api/video/
 *
 * */

Private.to.facebook.video = function( video ) {
	var result = {
		name: video.title
		, description: video.description
		, picture: video.thumbnail.link.url
		, source: video.source.link.url
		, 'type': video
	};
	return result;
};

/* Facebook image (photo) model:
 *
 * { name: string
 * , description: string
 * , message%: string
 * , picture: string (valid URI)
 * , source%: string (valid URI) || multipartdata (on creation)
 * , height: number
 * , width: number
 * , link: string (valid URI)
 * , images: [ { height: number, width: number, source: string (valid URI) }, {...} ]
 * , position: number
 * , created_time: string (ISO-8601 date)
 * , updated_time: string (ISO-8601 date)
 * }
 *
 * http://developers.facebook.com/docs/reference/api/photo/
 *
 * */

Private.to.facebook.image = function( image ) {
	var result = {
		message: image.title
		, source: null //TODO: Support multipart form data
		, 'type': 'photo'
	};
	return result;
};


/* Facebook person (user) model:
 *
 * { id: string
 * , name: string
 * , first_name: string
 * , middle_name: string
 * , last_name: string
 * , gender: string
 * , locale: string
 * , languages: array [ { 'id': string, 'name': string }, ... ]
 * , link: string (valid URI)
 * , username: string
 * , third_party_id: string
 * , installed: { type: string, id: string, installed: bool (present only when true) }
 * , timezone: number
 * , updated_time: string (ISO-8601 date)
 * , verified: boolean
 * , bio: string
 * , birthday: string (format MM/DD/YY)
 * , education: [ { 'year': string, type: string, school: { name: string, id: string, type: string, year*: string, degree*: string, concentration*: string, classes: [ { ??? } ] }, ... ]
 * , email: string (RFC822 email address)
 * , hometown: { name: string, id: string }
 * , interested_in: [ 'foo', 'bar', ... ]
 * , location: { name: string, id: string }
 * , political: string
 * , quotes: string
 * , relationship_status: string
 * , religion: string
 * , significant_other: { name: string, id: string }
 * , video_upload_limits: { length: string?, size: string? }
 * , website: string (valid URI)
 * , work: [ { employer: string?, location: { name?: string?, id: string? }?, position: string?, start_date: string?, end_date: string? }, ... ]
 * }
 *
 * http://developers.facebook.com/docs/reference/api/user/
 *
 * */

Private.to.facebook.person = function( person ) {
	/* N/A: Cannot create person via API */
	return false;
};


/* Facebook organization (group) model:
 *
 * { id: string
 * , version: number (0=old type, 1=current)
 * , icon: string (valid URI)
 * , owner: { name: string, id: string }
 * , name: string
 * , description: string
 * , category: string
 * , link: string (valid URI)
 * , privacy: string ('OPEN', 'CLOSED' or 'SECRET')
 * , updated_time: string (ISO-8601 date)
 * }
 * 
 * http://developers.facebook.com/docs/reference/api/group/
 *
 * */

Private.to.facebook.organization = function( organization ) {
	var result = {
		id: ( Private.emptyPath( 'ids.facebook', organization ) ) ? null :  organization.ids.facebook
		, link: ( Private.emptyPath( 'link.url', organization ) ) ? null :  organization.link.url
		, icon: ( Private.emptyPath( 'thumbnail.link.url', organization ) ) ? null :  organization.thumbnail.link.url
		, name: ( Private.emptyPath( 'name', organization ) ) ? null :  organization.name
		, description: ( Private.emptyPath( 'description', organization ) ) ? null :  organization.description
	};
	return result;
};


/* Facebook entity (page) model:
 *
 * { id: string
 * , name: string
 * , link: string (valid URI)
 * , category: string
 * , is_published: boolean
 * , username: string
 * , likes: number
 * , location:
 * 	{ street: string
 * 	, city: string
 * 	, state: string
 * 	, country: string
 * 	, zip: string
 * 	, latitude: number
 * 	, longitude: number
 * 	}
 * , phone: string
 * , checkins: number
 * , picture: string (valid URI?)
 * , website: string (valid URI?)
 * , talking_about_count: number
 * , company_overview: string
 * , mission: string
 * , about: string
 * , access_token: string* (only provided if administator)
 * }
 * 
 * http://developers.facebook.com/docs/reference/api/page/
 *
 * */

Private.to.facebook.entity = function( entity ) {
	/* N/A: Cannot create a Facebook entity (page) via API */
	return false;
};


/* Facebook checkin model
 * { id: string
 * , from: { id: string, name: string }
 * , tags%: [ { id: string, name: string }, ... ]
 * , place%: { id: string, name: string, location: { latitude: number, longitude: number } || string (on creation)
 * , application: { name: string, id: string, canvas_name: string, namespace: string }
 * , coordinates%: { latitude: number?, longitude: number? } 
 * , created_time: string
 * , likes: number
 * , message%: string
 * , comments: [ { id: string, from: { id: string, name: string }, message: string, created_time: string }
 * , type: 'checkin'
 * }
 *
 * https://developers.facebook.com/docs/reference/api/checkin/
 *
 * */

Private.to.facebook.checkin = function( checkin ) {
	var result = {
		coordinates: {
			latitude: ( Private.emptyPath( 'location.latitude', checkin ) ) ? null : checkin.location.latitude
			, longitude: ( Private.emptyPath( 'location.longitude', checkin ) ) ? null : checkin.location.longitude
		}
		, place: ( Private.emptyPath( 'location.ids.facebook', checkin ) ) ? null : checkin.location.ids.facebook
		, message: ( Private.emptyPath( 'text', checkin ) ) ? null : checkin.text
		, picture: ( Private.emptyPath( 'image.link.url', checkin ) ) ? null : checkin.image.link.url
		, tags: null //TODO: Allow tagging, esp own UID?
		, type: 'checkin'
	};
	return result;
};



/* Twitter */

/* 
 * Twitter note model:
 * { 
 * 	N/A
 * }
 *
 * */

Private.to.twitter.note = function( note ) {
	return false;
};


/* Twitter comment model:
 * { coordinates: ?
 * , created_at: string (ISO/RFC?)
 * , truncated: boolean
 * , favorited: boolean
 * , id_str: string
 * , entities: {
 * 	urls: [
 * 		{ expanded_url: string
 * 		, url: string
 * 		, indices: [ number, number ]
 * 		, display_url: string }, ... ]
 * 		} 
 * 	], hashtags: [
 * 		{ text: string
 * 		, indices: [ number, number ]
 * 		}, ...
 * 	], user_mentions: [
 *		{ name: string
 *		, id_str: string
 *		, id: number
 *		, indices: [ number, number ]
 *		, screen_name: string
 *		}, ...
 * 	] }
 * , in_reply_to_user_id_str: string
 * , text: string
 * , contributors: ?
 * , id: string
 * , retweet_count: number
 * , in_reply_to_status_id_str: string
 * , geo: { type: string ("Point"), coordinates: [ number, number ] }
 * , retweeted: boolean
 * , possibly_sensitive: boolean
 * , in_reply_to_user_id: number
 * , place: ?
 * , source: string (HTML)
 * , user: { profile_sidebar_border_color: string
 * 	   , profile_background_tile: boolean
 * 	   , profile_sidebar_fill_color: string
 * 	   , name: string
 * 	   , profile_image_url: string (valid URI)
 * 	   , created_at: string (RFC/ISO?)
 * 	   , location: string
 * 	   , profile_link_color: string
 * 	   , follow_request_sent: ?
 * 	   , is_translator: boolean
 * 	   , id_str: string
 * 	   , favourites_count: number
 * 	   , default_profile: false
 * 	   , url: string
 * 	   , contributors_enabled: boolean
 * 	   , id: number
 * 	   , utc_offset: ?
 * 	   , profile_image_url_https: string (valid URI)
 * 	   , profile_user_background_image: boolean
 * 	   , listed_count: number
 * 	   , followers_count: number
 * 	   , lang: string
 * 	   , profile_text_color: string
 * 	   , protected: boolean
 * 	   , profile_background_image_url_https: string (valid URI)
 * 	   , description: string
 * 	   , geo_enabled: boolean
 * 	   , verified: boolean
 * 	   , profile_background_color: string
 * 	   , time_zone: ?
 * 	   , notifications: ?
 * 	   , statuses_count: number
 * 	   , friends_count: number
 * 	   , default_profile_image: boolean
 * 	   , profile_background_image_url: string
 * 	   , screen_name: string
 * 	   , following: ?
 * 	   , show_all_inline_media: boolean
 * 	   }
 * , in_reply_to_screen_name: string
 * , in_reply_to_status_id: number
 * 
 * }
 *
 * http://developers.twitter.com/docs/reference/api/Comment/
 * */
Private.to.twitter.comment = function( comment ) {
	if ( 'undefined' !== typeof comment.image  && null !== comment.image ) {
		return false; //TODO: support update_with_media via multipart uploads 
		//https://github.com/felixge/node-formidable will do the trick nicely
		//https://dev.twitter.com/docs/api/1/post/statuses/update_with_media
	} else {
		return  {
			status: ( Private.emptyPath( 'text', comment ) ) ? null :  comment.text
			, in_reply_to_status_id: ( Private.emptyPath( 'target.ids.twitter', comment ) ) ? null :  comment.target.ids.twitter
			, lat: ( Private.emptyPath( 'location.latitude', comment ) ) ? null :  comment.location.latitude
			, long: ( Private.emptyPath( 'location.longitude', comment ) ) ? null :  comment.location.longitude
			, place_id: ( Private.emptyPath( 'location.ids.twitter', comment ) ) ? null :  comment.location.ids.twitter
			, display_coordinates: 'false' //no thanks on a pin at exact location
			, trim_user: 'false' //don't return only status author's numerical id
			, include_entities: 'true' //add an entities node w/tweet metadata
		} //true/false need to be strings else broken sigs
	}
};

/* Twitter link model: 
 * {
 *	N/A
 * }
 *
 * */

Private.to.twitter.link = function( link ) {
	return false;
};


/* Twitter audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.twitter.audio = function( audio ) {
	return false;
};

/* Twitter video model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.twitter.video = function( video ) {
	return false;
};


/* Twitter image (photo) model:
 * { sizes:
 * 	{ large:
 * 		{ w: number
 * 		, h: number
 * 		, resize: string ("fit", "crop") 
 * 		}
 * 	, medium:  
 * 		{ w: number
 * 		, h: number
 * 		, resize: string ("fit", "crop") 
 * 		}
 * 	, small:  
 * 		{ w: number
 * 		, h: number
 * 		, resize: string ("fit", "crop") 
 * 		}
 * 	, thumb:  
 * 		{ w: number
 * 		, h: number
 * 		, resize: string ("fit", "crop") 
 * 		}
 *	}
 * , media_url_https: string (valid URI)
 * , expanded_url: string (valid URI)
 * , id_str: string
 * , url: string
 * , id: number
 * , type: "photo"
 * , indices: [ number, number ]
 * , display_url: string
 * , media_url: string
 * }
 *
 * https://dev.twitter.com/docs/api/1/post/statuses/update_with_media
 *
 * */

Private.to.twitter.image = function( image ) {
	//TODO: Enable twitter image posting using multipart uploads
	//https://github.com/felixge/node-formidable
	return false;
};

/* Twitter person (user) model:
 * { profile_sidebar_border_color: string
 * , profile_background_tile: boolean
 * , profile_sidebar_fill_color: string
 * , name: string
 * , profile_image_url: string (valid URI)
 * , created_at: string (RFC/ISO?)
 * , location: string
 * , profile_link_color: string
 * , follow_request_sent: ?
 * , is_translator: boolean
 * , id_str: string
 * , favourites_count: number
 * , default_profile: false
 * , url: string
 * , contributors_enabled: boolean
 * , id: number
 * , utc_offset: ?
 * , profile_image_url_https: string (valid URI)
 * , profile_user_background_image: boolean
 * , listed_count: number
 * , followers_count: number
 * , lang: string
 * , profile_text_color: string
 * , protected: boolean
 * , profile_background_image_url_https: string (valid URI)
 * , description: string
 * , geo_enabled: boolean
 * , verified: boolean
 * , profile_background_color: string
 * , time_zone: ?
 * , notifications: ?
 * , statuses_count: number
 * , friends_count: number
 * , default_profile_image: boolean
 * , profile_background_image_url: string
 * , status:
 * 	{ coordinates: ?
 * 	, created_at: string (ISO/RFC?)
 * 	, truncated: boolean
 * 	, favorited: boolean
 * 	, id_str: string
 * 	, entities: {
 * 		urls: [
 * 			{ expanded_url: string
 * 			, url: string
 * 			, indices: [ number, number ]
 * 			, display_url: string }, ... ]
 * 			} 
 * 		], hashtags: [
 * 			{ text: string
 * 			, indices: [ number, number ]
 * 			}, ...
 * 		], user_mentions: [
 *			{ name: string
 *			, id_str: string
 *			, id: number
 *			, indices: [ number, number ]
 *			, screen_name: string
 *			}, ...
 * 		] }
 * 	, in_reply_to_user_id_str: string
 * 	, text: string
 * 	, contributors: ?
 * 	, id: string
 * 	, retweet_count: number
 * 	, in_reply_to_status_id_str: string
 * 	, geo: { type: string ("Point"), coordinates: [ number, number ] }
 * 	, retweeted: boolean
 * 	, possibly_sensitive: boolean
 * 	, in_reply_to_user_id: number
 * 	, place: ?
 * 	}
 * , screen_name: string
 * , following: ?
 * , show_all_inline_media: boolean
 * }
 *
 * https://dev.twitter.com/docs/api/1/get/users/show
 * */

Private.to.twitter.person = function( person ) {
	/* N/A: Cannot create person via API */
	return false;
};


/* Twitter organization (list) model:
 * { slug: string
 * , created_at: string (ISO-8601 date)
 * , name%%: string
 * , full_name: string
 * , description: string
 * , mode%: string ("public", "private")
 * , following: boolean
 * , user: { profile_sidebar_border_color: string
 * 	   , profile_background_tile: boolean
 * 	   , profile_sidebar_fill_color: string
 * 	   , name: string
 * 	   , profile_image_url: string (valid URI)
 * 	   , created_at: string (RFC/ISO?)
 * 	   , location: string
 * 	   , profile_link_color: string
 * 	   , follow_request_sent: ?
 * 	   , is_translator: boolean
 * 	   , id_str: string
 * 	   , favourites_count: number
 * 	   , default_profile: false
 * 	   , url: string
 * 	   , contributors_enabled: boolean
 * 	   , id: number
 * 	   , entities: {
 * 		urls: [
 * 			{ expanded_url: string
 * 			, url: string
 * 			, indices: [ number, number ]
 * 			, display_url: string }, ... ]
 * 			} 
 * 		], hashtags: [
 * 			{ text: string
 * 			, indices: [ number, number ]
 * 			}, ...
 * 		], user_mentions: [
 *			{ name: string
 *			, id_str: string
 *			, id: number
 *			, indices: [ number, number ]
 *			, screen_name: string
 *			}, ...
 * 		] }
 * 	   , utc_offset: ?
 * 	   , profile_image_url_https: string (valid URI)
 * 	   , profile_user_background_image: boolean
 * 	   , listed_count: number
 * 	   , followers_count: number
 * 	   , lang: string
 * 	   , profile_text_color: string
 * 	   , protected: boolean
 * 	   , profile_background_image_url_https: string (valid URI)
 * 	   , description: string
 * 	   , geo_enabled: boolean
 * 	   , verified: boolean
 * 	   , profile_background_color: string
 * 	   , time_zone: ?
 * 	   , notifications: ?
 * 	   , statuses_count: number
 * 	   , friends_count: number
 * 	   , default_profile_image: boolean
 * 	   , profile_background_image_url: string
 * 	   , screen_name: string
 * 	   , following: ?
 * 	   , show_all_inline_media: boolean
 * 	   }
 * , member_count: number
 * , id_str: string
 * , subscriber_count: number
 * , id: number
 * , uri: string
 * }
 * 
 * http://developers.twitter.com/docs/reference/api/group/
 * */

//TODO: Allow override to private for enhanced privacy

Private.to.twitter.organization = function( organization ) {
	var result = {
		id: ( Private.emptyPath( 'ids.twitter', organization ) ) ? null :  organization.ids.facebook
		, uri: ( Private.emptyPath( 'link.url', organization ) ) ? null :  organization.link.url
		, mode: "public"
		, icon: ( Private.emptyPath( 'thumbnail.link.url', organization ) ) ? null :  organization.thumbnail.link.url
		, name: ( Private.emptyPath( 'name', organization ) ) ? null :  organization.name
		, description: ( Private.emptyPath( 'description', organization ) ) ? null :  organization.description
	};
	return result;
};


/* Twitter entity (page) model:
 * { 
 * 	N/A
 * }
 * 
 * */

Private.to.twitter.entity = function( entity ) {
	return false;
};


/* Twitter checkin model
 * { 
 * 	N/A
 * }
 * 
 * */

Private.to.twitter.checkin = function( checkin ) {
	return false;
};




/* Tumblr */

//TODO: function that takes type and obj
Private.to.tumblr = Private.to.tumblr || {};

/* 
 * Tumblr note model:
 * { title%: string
 *   , body%%: string (HTML ok)
 *   , note_count: number
 *   , tags: [ 'foo', ... ] 
 *   , reblog_key: string
 *   , format: string
 *   , timestamp: number
 *   , date: string (GMT time RFC/ISO ?)
 *   , type: string
 *   , post_url: string
 *   , bookmarklet*: boolean (*exists only if true)
 *   , mobile*: boolean (*exists only if true)
 *   , source_url*: boolean (*exists only if there's a content source)
 *   , source_title*: boolean (*exists only if there's a content source)
 *   , total_posts: number
 * }
 *
 * http://www.tumblr.com/docs/en/api/v2#text-posts
 * */
Private.to.tumblr.note = function( note ) {
	var result = {
		body: ( Private.emptyPath( 'text', note ) ) ? null :  note.text
		, title: ( Private.emptyPath( 'title', note ) ) ? null :  note.title
		, type: 'text'
	};
	return result;
};

/* Tumblr comment (reblog) model:
 *
 * { id: number
 * , reblog_key: number
 * , comment: string
 * }
 *
 * */
Private.to.tumblr.comment = function( comment ) {
	var result = {
		reblog_key: ( Private.emptyPath( 'target.ids.tumblr', comment ) ) ? null : comment.target.ids.tumblr
		, comment: ( Private.emptyPath( 'text', comment ) ) ? null :  comment.text
		, type: ( Private.emptyPath( 'type', comment ) ) ? null :  comment.type
	};
	return result;
};

/* Tumblr link model: 
 *
 * { title%: string
 * , url%: string
 * , description%: string
 * , note_count: number
 * , tags: [ 'foo', ... ] 
 * , reblog_key: string
 * , format: string
 * , timestamp: number
 * , date: string (GMT time RFC/ISO ?)
 * , type: string
 * , post_url: string
 * , bookmarklet*: boolean (*exists only if true)
 * , mobile*: boolean (*exists only if true)
 * , source_url*: boolean (*exists only if there's a content source)
 * , source_title*: boolean (*exists only if there's a content source)
 * , total_posts: number
 * }
 *
 * % Optional at creation
 *
 * http://www.tumblr.com/docs/en/api/v2#link-posts
 *
 * */
Private.to.tumblr.link = function( link ) {
	var result = {
		title: ( Private.emptyPath( 'title', link ) ) ? null :  link.title
		, url: ( Private.emptyPath( 'url', link ) ) ? null :  link.url
		, description: ( Private.emptyPath( 'description', link ) ) ? null :  link.description
		, type: 'link'
	};
	return result;
};

/* Tumblr audio model:
 * { caption: string
 * , player: string
 * , plays: string
 * , album_art: string
 * , artist: string
 * , album: string
 * , track_name: string
 * , track_number: number
 * , year: number
 * , note_count: number
 * , tags: [ 'foo', ... ] 
 * , reblog_key: string
 * , format: string
 * , timestamp: number
 * , date: string (GMT time RFC/ISO ?)
 * , type: string
 * , post_url: string
 * , bookmarklet*: boolean (*exists only if true)
 * , mobile*: boolean (*exists only if true)
 * , source_url*: boolean (*exists only if there's a content source)
 * , source_title*: boolean (*exists only if there's a content source)
 * , total_posts: number
 * }
 *
 * http://www.tumblr.com/docs/en/api/v2#audio-posts
 * */
Private.to.tumblr.audio = function( audio ) {
	return false;
};

/* Tumblr video model:
 * { caption: string
 * , player: [ { width: number, embed_code: string }, ... ]
 * , note_count: number
 * , tags: [ 'foo', ... ] 
 * , reblog_key: string
 * , format: string
 * , timestamp: number
 * , date: string (GMT time RFC/ISO ?)
 * , type: string
 * , post_url: string
 * , bookmarklet*: boolean (*exists only if true)
 * , mobile*: boolean (*exists only if true)
 * , source_url*: boolean (*exists only if there's a content source)
 * , source_title*: boolean (*exists only if there's a content source)
 * , total_posts: number
 * }
 * 
 * http://www.tumblr.com/docs/en/api/v2#video-posts
 * */
Private.to.tumblr.video = function( video ) {

};

/* Tumblr image (photo) model:
 * { caption: string
 * , photos: [ { caption: strinbg, alt_sizes: [ { width: number, height: number, url: string (valid URI) }, ... ]
 * , height: number
 * , width: number
 * }
 *
 * http://www.tumblr.com/docs/en/api/v2#photo-posts
 * */
Private.to.tumblr.image = function( image ) {

};

/* Tumblr person (user) model:
 * { following: numner
 * , default_post_format: string ('html', 'markdown' or 'raw')
 * , name: string
 * , likes: number
 * , blogs: [
 * 	{ name: string
 * 	, url: string
 * 	, title: string
 * 	, primary: boolean
 * 	, followers: number
 * 	, tweet: number(auto, Y or N?)
 * 	}, ...
 * ] }
 *
 * http://www.tumblr.com/docs/en/api/v2#user-methods
 * */
Private.to.tumblr.person = function( person ) {
	/* N/A: Cannot create person via API */	
};


/* Tumblr organization (group) model:
 * { 
 * 	N/A
 * }
 * 
 * */

Private.to.tumblr.organization = function( organization ) {
	return false;
};

/* Tumblr entity (blog) model:
 * { title: string
 * , posts: string
 * , name: string
 * , updated: number
 * , description: string
 * , ask: boolean
 * , ask_anon: boolean
 * , likes: number
 * }
 *
 * http://www.tumblr.com/docs/en/api/v2#blog-info
 * */

Private.to.tumblr.entity = function( entity ) {
	/* N/A: Cannot create a Tumblr entity (blog) via API */
};

/* Tumblr checkin model
 * { 
 * 	N/A
 * }
 * 
 * */

Private.to.tumblr.checkin = function( checkin ) {
	return false;
};




/* Linkedin */

/* 
 * Linkedin note (group post) model:
 * { id: number
 * , type: string (standard, news)
 * , category: string (discussion)
 * , creator: 
 * , title%: string
 * , summary%: string
 * , creationTimestamp: string (RFC/ISO?)
 * , relationToViewer:
 * 	{ isFollowing: boolean
 * 	, isLiked: boolean
 * 	, availableActions: string (add-comment, flag-as-inappropriate, categorize-as-job, categorize-as-promotion, follow, like, reply-privately)
 * 	}
 * , likes: ?
 * , comments: ?
 * , attachment: string (valid URI)
 * , siteGroupPostUrl: string (valid URI)
 * }
 *
 * % Optional on creation
 *
 * http://developer.linkedin.com/documents/groups-fields
 * */

Private.to.linkedin.note = function( note ) {
	return  { title: ( Private.emptyPath( 'title', note ) ) ? null : note.title
		, summary: ( Private.emptyPath( 'text', note ) ) ? null : note.text
	        };
};


/* Linkedin comment model:
 * { comment: string
 * , visibility: {
 *	code: string ("anyone", "connections-only")
 * } }
 *
 * http://developer.linkedin.com/documents/share-api
 *
 * */

//TODO: allow user override of privacy code for increased privacy

Private.to.linkedin.comment = function( comment ) {
	var result = {
		comment: ( Private.emptyPath( 'text', comment ) ) ? null : comment.text
		, visibility: { code: 'anyone' } //prefer the public 
	};
	return result;
};


/* Linkedin link model: 
 * { comment: string
 * , content: {
 * 	title: string (max 200 char)
 * 	, submittedUrl: string (valid URI) //TODO: verify casing
 * 	, submittedImageUrl: string (valid URI) //TODO: verfiy casing
 * 	, description: string (max 256 char)
 * }, visibility: {
 *	code: string ("anyone", "connections-only")
 * } }
 *
 * http://developer.linkedin.com/documents/share-api
 *
 * */

//TODO: allow user override of privacy code for increased privacy

//TODO: enforce character limits

Private.to.linkedin.link = function( link ) {
	var result = {
		comment: ( Private.emptyPath( 'text', link ) ) ? null : link.text
		, content: {
			title: ( Private.emptyPath( 'title', link ) ) ? null : link.title
			, submittedUrl: ( Private.emptyPath( 'url', link ) ) ? null : link.url
			, submittedImageUrl: ( Private.emptyPath( 'thumbnail.url', link ) ) ? null : link.thumbnail.url
			, description: ( Private.emptyPath( 'description', link ) ) ? null : link.description
		}
		, visibility: { code: 'anyone' } //prefer the public 
	};
	return result;
};


/* Linkedin audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.linkedin.audio = function( audio ) {
	return false;
};

/* Linkedin video model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.linkedin.video = function( video ) {
	return false;
};


/* Linkedin image model:
 * { 
 *
 * 	N/A
 * }
 *
 * */

Private.to.linkedin.image = function( image ) {

};


/* Linkedin person (user) model:
 *
 * { id: string
 * , firstName: string
 * , lastName: string
 * , headline: string
 * , industry: string
 * , pictureUrl: string (valid URI)
 * , location:i
 * 	{ country: { code: string }
 * 	, name: string
 * 	}
 * , siteStandardProfileRequest:
 * 	{ url: string (valid URI) }
 * , apiStandardProfileRequest:
 * 	{ headers: 
 * 		{ "_total": number
 * 		, values: [ { name: string, value: string } ]
 * 	, url: string
 * 	}
 * , memberUrlResources:
 * 	{ "_total": number*
 * 	, values: [ { name: string, url: string } ]
 * 	}
 * , distance: number
 * , relationToViewer:
 * 	{ distance: number }
 * , numReccomenders: number
 * , currentStatus: string?
 * , currentStatusTimestamp: ?
 * , connections:
 * 	{ "_total": number }
 * , summary: string
 * , positions: {
 *      "_total": number
 *      , values: [ {
 *          company: {
 *              industry: string
 *              , name: string
 *          }
 *          , id: number
 *          , isCurrent: boolean
 *          , startDate: {
 *              month: number
 *              , year: number
 *          }
 *          , summary: string
 *          , title: string
 *      }, ... ]
 * }, educations: {
 *      "_total": number
 *      , values: [{
 *          degree: string
 *          , endDate: {
 *              year: number
 *          }
 *          , fieldOfStudy: string
 *          , id: number
 *          , schoolName: string
 *          , startDate: {
 *              year: number
 *          }
 *      }
 * }
 *
 * http://developer.linkedin.com/documents/profile-api
 *
 * */

Private.to.linkedin.person = function( person ) {
	/* N/A: Cannot create person via API */
	return false;	
};


/* Linkedin organization (group) model:
 *
 * { id: number
 * , name: string
 * , shortDescription: string
 * , description: string
 * , relationToViewer: 
 * 	{ membershipState: string (blocked, non-member, awaiting-confirmation, awaiting-parent-group-confirmation, member, moderator, manager, owner)
 * 	, availableActions: string (Add-post, Leave, View-posts)
 * 	}
 * , posts: ?
 * , countsByCategory: ?
 * , isOpenToNonMembers: boolean
 * , category: string (alumni, corporate, conference, network, philanthropic, professional, other)
 * , websiteUrl: string (valid URI)
 * , siteGroupUrl: string (valid URI)
 * , locale: string
 * , location:
 * 	{ country: string
 * 	, postalCode: string?
 * 	}
 * , allowMemberInvites: boolean
 * , smallLogoUrl: string (valid URI)
 * , largeLogoUrl: string (valid URI)
 * , numMembers: number
 * }
 *
 * http://developer.linkedin.com/documents/groups-fields
 *
 * */

Private.to.linkedin.organization = function( organization ) {
	/* N/A: Can't create Linkedin organization (group) via API */
	return false;
};


/* Linkedin entity (company) model:
 *
 * { id: number
 * , universalName: string
 * , name: string
 * , ticker: string
 * , stockExchange: string (ASE, NYS, NMS, LSE, FRA, GER, PAR)
 * , logoUrl: string (valid URI)
 * , description: string
 * , companyType: { code: string (C, D, E, G, N, O, P, S), name: string }
 * , industry: string
 * , size: string
 * , specialties:
 * 	{ "_total": number
 * 	, values: [ 'foo', ... ] 
 * 	}
 * , blogRssUrl: string (valid URI)
 * , twitterId: string
 * , squareLogoUrl: string (valid URI)
 * , locations:
 * 	{ "_total": number
 * 	, values: [
 * 		{ address:
 * 			{ street1: string
 * 			, street2: string
 * 			, city: string
 * 			, state: string
 * 			, postalCode: number
 * 			, countryCode: number
 * 			, regionCode: number
 * 			}
 * 		, contact_info:
 * 			{ phone1: string
 * 			, phone2: string
 * 			, fax: string
 * 			}
 * 		}, isActive: boolean
 * 		, isHeadquarters: boolean
 * 		, description: string
 *
 * 	], ... }
 * , foundedYear: number
 * , endYear: number
 * , numFollowers: number
 * , emailDomains
 * 	{ "_total": number
 * 	, values: [ 'foo@bar.com', ... ] 
 *	}
 * , websiteUrl: string (valid URI)
 * , status:
 * 	{ code: string (OPR, OPS, RRG, OOB, ACQ)
 * 	, name: string 
 * 	}
 * , employeeCountRange:
 * 	{ code: string (A, B, C, D, E, F, G, H, I)
 * 	, name: string
 * 	} 	
 * }

 * 
 * http://developer.linkedin.com/documents/company-lookup-api-and-fields
 * */

Private.to.linkedin.entity = function( entity ) {
	/*  N/A: Can't create Linkedin entity (company) via API */
	return false;	
};


/* Linkedin checkin model
 * { 
 * 	N/A
 * }
 * 
 * */

Private.to.linkedin.checkin = function( checkin ) {
	return false;
};



/* Github */

/* Github node (gist) model:
 * { url: string (valid URI)
 * , id: string
 * , description: string
 * , public: boolean
 * , user: 
 * 	{ login: string
 * 	, id: number
 * 	, avatar_url: string (valid URI)
 * 	, gravatar_id: string (md5 hex)
 * 	, url: string (valid URI)
 * 	}
 * , files: 
 * 	{ 'foo.ext':
 * 		{ size: number
 * 		, filename: string
 * 		, raw_url: string (valid URI)
 * 		, content: string
 * 		}
 *	, ... 
 *	}
 * , comments: number
 * , html_url: string (valid URI) 
 * , git_pull_url: string (valid URI) 
 * , git_push_url: string (valid URI) 
 * , created_at: string (RFC/ISO? date)
 * , forks: [
 * 	{ user:
 *	 	{ login: string
 * 		, id: number
 * 		, avatar_url: string (valid URI)
 * 		, gravatar_id: string (md5 hex)
 * 		, url: string (valid URI)
 * 		}
 * 	, url: string (valid URI)
 * 	, created_at: string (ISO/RFC? date)
 * 	}, ...
 * , history: [
 * 	{ user:
 *	 	{ login: string
 * 		, id: number
 * 		, avatar_url: string (valid URI)
 * 		, gravatar_id: string (md5 hex)
 * 		, url: string (valid URI)
 * 		}
 * 	, url: string (valid URI)
 * 	, version: string (hash)
 * 	, committed_at: string (ISO/RFC? date)
 *	, change_status: 
 * 		{ deletions: number
 * 		, additions: number
 * 		, total: number 
 *		}
 * 	}, ...
 * ] }
 */

//TODO: Allow private override for increased privacy

//TODO: Allow filename override

Private.to.github.note = function( note ) {
	var result = {
		description: ( Private.emptyPath( 'title', note ) ) ? null :  note.title
		, public: true
		, files: { 'file1.txt': { content: ( ( Private.emptyPath( 'text', note ) ) ? null :  note.text ) } }
	};
	return result;
};


/* Github comment model:
 * { 
 * 	TODO: http://developer.github.com/v3/gists/comments/
 * }
 *
 * */
Private.to.github.comment = function( comment ) {
	return false;
};


/* Github link model: 
 * { 
 * 	N/A
 * }
 *
 * */

Private.to.github.link = function( link ) {
	return false;
};


/* Github audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.github.audio = function( audio ) {
	return false;
};

/* Github video model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.github.video = function( video ) {
	return false;
};


/* Github image model:
 * { 
 * 	N/A
 * }
 *
 * */

Private.to.github.image = function( image ) {
	return false;
};


/* Github person (user) model:
 *
 * { login: string
 * , id: number
 * , avatar_url: string (valid URI)
 * , gravatar_id: string (md5 hash)
 * , url: string (valid URI)
 * , name: string
 * , company: string
 * , blog: string (valid URI)
 * , location: string
 * , email: string (valid email RFC?)
 * , hireable: boolean
 * , bio: string
 * , public_repos: number
 * , public_gists: number
 * , followers: number
 * , following: number
 * , html_url: string
 * , created_at: string (RFC/ISO? date)
 * , type: string (User)
 * }
 *
 * Authed user only also has these fields:
 *
 * { total_private_repos: 100
 * , owned_private_repos: 100
 * , private_gists: number
 * , disk_usage: number
 * , collaborators: number
 * , plan:
 * 	{ name: string (Medium)
 * 	,  space: number
 * 	, collaborators: number
 * 	, private_repos: number
 * }
 *
 * http://developer.github.com/v3/users/
 *
 */

Private.to.github.person = function( person ) {
	/* N/A: Cannot create person via API */
	return false;	
};


/* Github organization (orgs) model:
 *
 * { login: string
 * , id: number
 * , avatar_url: string (valid URI)
 * , url: string (valid URI)
 * , name: string
 * , company: string
 * , blog: string (valid URI)
 * , location: string
 * , email: string (valid email RFC?)
 * , bio: string
 * , public_repos: number
 * , public_gists: number
 * , followers: number
 * , following: number
 * , html_url: string
 * , created_at: string (RFC/ISO? date)
 * , type: string (Organization)
 * }
 *
 * Authed account only also has these fields:
 *
 * { total_private_repos: 100
 * , owned_private_repos: 100
 * , private_gists: number
 * , disk_usage: number
 * , collaborators: number
 * , billing_email: string (valid email RFC?)
 * , plan:
 * 	{ name: string (Medium)
 * 	, space: number
 * 	, private_repos: number
 * 	}
 * }
 *
 * http://developer.github.com/v3/orgs/
 * */

Private.to.github.organization = function( organization ) {
	var result = {
		id: ( Private.emptyPath( 'ids.github', organization ) ) ? null :  organization.ids.github
		, url: ( Private.emptyPath( 'link.url', organization ) ) ? null :  organization.link.url
		, avatar_url: ( Private.emptyPath( 'thumbnail.link.url', organization ) ) ? null :  organization.thumbnail.link.url
		, name: ( Private.emptyPath( 'name', organization ) ) ? null :  organization.name
		, bio: ( Private.emptyPath( 'description', organization ) ) ? null :  organization.description
		, location: ( Private.emptyPath( 'location.name', organization ) ) ? null :  organization.location.name
	};
	return result;
};


/* Github entity (repository) model:
 * 
 * { url: string (valid URI)
 * , html_url: string (valid URI)
 * , clone_url: string (valid URI)
 * , git_url: string (valid URI)
 * , ssh_url: string (valid URI)
 * , svn_url: string (valid URI)
 * , id: string
 * , description: string
 * , public: boolean
 * , owner: 
 * 	{ login: string
 * 	, id: number
 * 	, avatar_url: string (valid URI)
 * 	, gravatar_id: string (md5 hex)
 * 	, url: string (valid URI)
 * 	}
 * , name: string
 * , description: string
 * , homepage: string (valid URI)
 * , language: ?
 * , private: boolean
 * , fork: boolean
 * , forks: number
 * , watchers: number
 * , size: number
 * , master_branch: string
 * , open_issues: number
 * , pushed_at: string (RFC/ISO? date)
 * , created_at: string (RFC/ISO? date)
 * }
 *
 * http://developer.github.com/v3/repos/
 * */
Private.to.github.entity = function( entity ) {
	/*  N/A: Can't create Github entity (repo) via API */
	return false;
};


/* Github checkin model
 * { 
 * 	N/A
 * }
 * 
 * */

Private.to.github.checkin = function( checkin ) {
	return false;
};



/* Foursquare */

/* Foursquare note model:
 * 
 * { 
 * 	N/A
 * }
 *
 * */

Private.to.foursquare.note = function( note ) {
	return false;
};


/* Foursquare comment (tip) model:
 *  
 *     { id: string
 *     , createdAt: number
 *     , text: string
 *     , venue: {
 *         id: string
 *         , name: string
 *         , contact: {
 *             phone: string
 *             formattedPhone: string
 *         }
 *         , location: {
 *             address: string
 *             , crossStreet: string
 *             , lat: number
 *             , lng: number
 *             , postalCode: string
 *             , city: string
 *             , state: string
 *             , country: string
 *         }
 *         , categories: [ {
 *             id: string
 *             , name: string
 *             , pluralName: string
 *             , shortName: string
 *             , icon: {
 *                 prefix: string
 *                 , sizes: [ number, ... ]
 *                 , name: string
 *             }
 *             , primary: boolean
 *         }, ... ]
 *         , verified: boolean
 *         , stats: {
 *             checkinsCount: number
 *             , usersCount: number
 *             , tipCount: number
 *         }
 *     }
 *     , user: {
 *         id: string
 *         , firstName: string
 *         , lastName: string
 *         , photo: string
 *         , gender: string
 *         , homeCity: string
 *         , canonicalUrl: string
 *     }
 *     , todo: {
 *         count: number
 *         , groups: [ {
 *             type: string
 *             , name: string
 *             , count: number
 *             , items: [ {
 *                 id: string
 *                 , firstName: string
 *                 , photo: string
 *                 , gender: string
 *                 , homeCity: string
 *                 , canonicalUrl: string
 *             }, ... ]
 *     }
 *     , done: {
 *         count: number
 *         , groups: [ {
 *             type: string
 *             , name: string
 *             , count: number
 *             , items: [ {
 *                 id: string
 *                 , firstName: string
 *                 , photo: string
 *                 , gender: string
 *                 , homeCity: string
 *                 , canonicalUrl: string
 *             }, ... ]
 *         }]
 *     }
 *     listed: {
 *         groups: [ {
 *             type: string
 *             , name: string
 *             , count: number
 *             , items: [ {
 *                 id: string
 *                 , name: string
 *                 , description: string
 *                 , user: {
 *                     id: string
 *                     , firstName: string
 *                     , lastName: string
 *                     , photo: string
 *                     , gender: string
 *                     , homeCity: string
 *                     , canonicalUrl: string
 *                 }
 *                 , editable: boolean
 *                 , public: boolean
 *                 , collaborative: boolean
 *                 , url: string
 *                 , canonicalUrl: string
 *                 , createdAt: number
 *                 , updatedAt: number
 *                 , photo: {
 *                     id: string
 *                     , createdAt: number
 *                     , url: string
 *                     , sizes: {
 *                         count: number
 *                         , items: [ {
 *                             url: string
 *                             , width: number
 *                             , height: number
 *                         }, ... ]
 *                     }
 *                     , user: {
 *                         id: string
 *                         , firstName: string
 *                         , photo: string
 *                         , gender: string
 *                         , homeCity: string
 *                         , canonicalUrl: string
 *                     }
 *                     , visibility: string
 *                 }
 *                 , type: string
 *                 , followers: {
 *                     count: number
 *                 }
 *                 , listItems: {
 *                     count: number
 *                     , items: [ {
 *                         id: string
 *                         , createdAt: number
 *                         , todo: boolean
 *                         , done: boolean
 *                         , visitedCount: number
 *                         , tip: {
 *                             id: string
 *                             , createdAt: number
 *                             , text: string
 *                             , todo: {
 *                                 count: number
 *                             }
 *                             , done: {
 *                                 count: number
 *                             }
 *                             , user: {
 *                                 , id: string
 *                                 , firstName: string
 *                                 , lastName: string
 *                                 , photo: string
 *                                 , gender: string
 *                                 , homeCity: string
 *                                 , canonicalUrl: string
 *                             }
 *                         }
 *                         , photo: {
 *                             id: string
 *                             , createdAt: number
 *                             , url: string
 *                             , sizes: {
 *                                 count: number
 *                                 , items: [ {
 *                                     url: string
 *                                     , width: number
 *                                     , height: number
 *                                 }, ... ]
 *                             }
 *                             , user: {
 *                                 , id: string
 *                                 , firstName: string
 *                                 , photo: string
 *                                 , gender: string
 *                                 , homeCity: string
 *                                 , canonicalUrl: string
 *                             }
 *                             , visibility: string
 *                         }
 *                         listed: {
 *                             count: number
 *                             , items: []
 *                         }
 *                     }]
 *                 }
 *             }]
 *         }]
 *     }
 *
 *
 * }
 * https://developer.foursquare.com/docs/tips/tips
 *
 * */

Private.to.foursquare.comment = function( comment ) {
	//TODO: foursquare comment mapping in reply to place
};


/* Foursquare link model: 
 * { 
 *
 * 	N/A
 * }
 *
 * */

Private.to.foursquare.link = function( link ) {
	return false;
};


/* Foursquare audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.foursquare.audio = function( audio ) {
	return false;
};

/* Foursquare video model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.foursquare.video = function( video ) {
	return false;
};


/* Foursquare image (photo) model:
 *
 * {
 *     id: string
 *     , createdAt: number
 *     , url: string
 *     , sizes: {
 *         count: number
 *         , items: [ {
 *             url: string
 *             , width: number
 *             , height: number
 *         }, ... ]
 *     }
 *     , source: {
 *         name: string
 *         , url: string
 *     }
 *     user: {
 *         id: string
 *         , firstName: string
 *         , lastName: string
 *         , photo: string
 *         , gender: string
 *         , homeCity: string
 *         , canonicalUrl: string
 *     }
 *     , visibility: string
 *     , venue: {
 *         id: string
 *         , name: string
 *         , contact: {}
 *         , location: {
 *             address: string
 *             , crossStreet: string
 *             , lat: number
 *             , lng: number
 *             , postalCode: string
 *             , city: string
 *             , state: string
 *             , country: string
 *         }
 *         categories: [ {
 *             id: string
 *             , name: string
 *             , pluralName: string
 *             , shortName: string
 *             , icon: {
 *                 prefix: string
 *                 , sizes: [ number, ... ]
 *                 , name: string
 *             }
 *             , primary: boolean
 *         }, ... ]
 *         , verified: boolean
 *         , stats: {
 *             checkinsCount: number
 *             , usersCount: number
 *             , tipCount: number
 *         }
 *     }
 *     , tip: {
 *         id: string
 *         , createdAt: number
 *         , text: string
 *         , todo: {
 *             count: number
 *         }
 *         , done: {
 *             count: number
 *         }
 *     }
 * }
 * 
 * https://developer.foursquare.com/docs/photos/photos
 *
 * */

Private.to.foursquare.image = function( image ) {
 	//TODO: foursquare image upload when targeting valid location object
};


/* Foursquare person (user) model:
 *
 * {
 *     id: string
 *     , firstName: string
 *     , lastName: string
 *     , photo: string
 *     , gender: string
 *     , homeCity: string
 *     , canonicalUrl: string
 *     , type: string
 *     , relationship: string
 *     , contact: {
 *         phone: string
 *         , email: string
 *         , facebook: string
 *     }
 *     , pings: boolean
 *     , badges: {
 *         count: number
 *     }
 *     , mayorships: {
 *         count: number
 *         , items: []
 *     }
 *     , checkins: {
 *         , count: number
 *         , items: [ {
 *             id: string
 *             , createdAt: number
 *             , type: string
 *             , shout: string
 *             , timeZone: string
 *             , venue: {
 *                 id: string
 *                 , name: string
 *                 , contact: {
 *                     phone: string
 *                     formattedPhone: string
 *                 }
 *                 location: {
 *                     address: string
 *                     , crossStreet: string
 *                     , lat: 40.77784431287658
 *                     , lng: -73.97862678587563
 *                     , postalCode: string
 *                     , city: string
 *                     , state: string
 *                     , country: string
 *                 }
 *                 , categories: [{
 *                     id: string
 *                     , name: string
 *                     , pluralName: string
 *                     , shortName: string
 *                     , icon: {
 *                         prefix: string
 *                         , sizes: [ number, ... ]
 *                         name: string
 *                     }
 *                     , primary: boolean
 *                 } ]
 *                 , verified: boolean
 *                 , stats: {
 *                     checkinsCount: number
 *                     , usersCount: number
 *                     , tipCount: number
 *                 }
 *             }
 *             photos: {
 *                 count: number
 *                 , items: [ {
 *                     id: string
 *                     , createdAt: number
 *                     , url: string
 *                     , sizes: {
 *                         count: number
 *                         , items: [ {
 *                             url: string
 *                             , width: number
 *                             , height: number
 *                         }, ... ]
 *                     }
 *                     , user: {
 *                         id: string
 *                         , firstName: string
 *                         , lastName: string
 *                         , photo: string
 *                         , gender: string
 *                         , homeCity: string
 *                         , canonicalUrl: string
 *                         , relationship: string
 *                     }
 *                     , visibility: string
 *                 }, ... ]
 *             }
 *             , comments: {
 *                 count: number
 *                 , items: [ ? ]
 *             }
 *             , source: {
 *                 , name: string
 *                 , url: string
 *             }
 *         }, ... ] //end checkins
 *     }
 *     , friends: {
 *         count: number
 *         , groups: [ {
 *             type: string
 *             , name: string
 *             , count: number
 *             , items: [ {
 *                 id: string
 *                 , firstName: string
 *                 , lastName: string
 *                 , photo: string
 *                 , gender: string
 *                 , homeCity: string
 *                 , canonicalUrl: string
 *                 , relationship: string
 *             }, ... ] // end items
 *         }, ... ] //end groups
 *     }
 *     , following: {
 *         count: number
 *     }
 *     , requests: {
 *         count: number
 *     }
 *     , tips: {
 *         count: number
 *     }
 *     , todos: {
 *         count: number
 *     }
 *     , photos: {
 *         count: number
 *     }
 *     , scores: {
 *         recent: number
 *         , max: number
 *         , goal: number
 *         , checkinsCount: number
 *     }
 * }
 *
 * https://developer.foursquare.com/docs/users/users
 *
 */

Private.to.foursquare.person = function( person ) {
	/* N/A: Cannot create person via API */
};


/* Foursquare organization (venue group) model:
 *
 * {
 *	TODO: https://developer.foursquare.com/docs/venuegroups/venuegroups
 * }
 *
 * */

Private.to.foursquare.organization = function( organization ) {
	return false;
};


/* Foursquare entity (venue) model
 *
 * {
 *     id: string
 *     , name: string
 *     , contact: {
 *         phone: string
 *         , formattedPhone: string
 *     }
 *     , location: {
 *         address: string
 *         , crossStreet: string
 *         , lat: number
 *         , lng: number
 *         , postalCode: string
 *         , city: string
 *         , state: string
 *         , country: string
 *     }
 *     , categories: [ {
 *         id: string
 *         , name: string
 *         , pluralName: string
 *         , shortName: string
 *         , icon: {
 *             prefix: string
 *             , sizes: [ number, ... ]
 *             , name: string
 *         }
 *         , primary: boolean
 *     }, ... ] //end categories
 *     , verified: boolean
 *     , stats: {
 *         checkinsCount: number
 *         , usersCount: number
 *         , tipCount: number
 *         , photoCount: number
 *     }
 *     , url: string
 *     , createdAt: number
 *     , menu: {
 *         url: string
 *         , mobileUrl: string
 *     }
 *     , hereNow: {
 *         , count: number
 *         , summary: string
 *         , groups: [ { //begin groups
 *             type: string
 *             , name: string
 *             , count: number
 *             , items: [ { //begin items
 *                 id: string
 *                 , createdAt: number
 *                 , type: string
 *                 , timeZone: string
 *                 , user: {
 *                     id: string
 *                     , firstName: string
 *                     , lastName: string
 *                     , photo: string
 *                     , gender: string
 *                     , homeCity: string
 *                     , canonicalUrl: string
 *                 }
 *             }, ... ] //end items
 *         } ]//end groups
 *     }
 *     , mayor: {
 *         count: number
 *         , user: {
 *             id: string
 *             , firstName: string
 *             , photo: string
 *             , gender: string
 *             , homeCity: string
 *             , canonicalUrl: string
 *         }
 *     }
 *     , tips: {
 *         count: number
 *         , groups: [ { //begin groups
 *             type: string
 *             , name: string
 *             , count: number
 *             , items: [ { //begin items
 *                 id: string
 *                 , createdAt: number
 *                 , text: string
 *                 , todo: {
 *                     count: number
 *                 }
 *                 , done: {
 *                     count: number
 *                 }
 *                 , user: {
 *                     id: string
 *                     , firstName: string
 *                     , lastName: string
 *                     , photo: string
 *                     , gender: string
 *                     , homeCity: string
 *                     , canonicalUrl: string
 *                 }
 *             }, ... ] //end items
 *         }, ... ] //end groups
 *     }
 *     , tags: [ string, ... ]
 *     , specials: {
 *         count: number
 *         , items: [ ? ]
 *     }
 *     , shortUrl: string
 *     , canonicalUrl: string
 *     , timeZone: string
 *     , beenHere: {
 *         count: number
 *     }
 *     , photos: {
 *         count: number
 *         , summary: string
 *         , groups: [ { //begin groups
 *             type: string
 *             , name: string
 *             , count: number
 *             , items: [ { //begin items
 *                 id: string
 *                 , createdAt: number
 *                 , url: string
 *                 , sizes: {
 *                     count: number
 *                     , items: [{
 *                         url: string
 *                         , width: number
 *                         , height: number
 *                     }, ... ] //end items
 *                 }
 *                 , source: {
 *                     name: string
 *                     , url: string
 *                 }
 *                 , user: {
 *                     id: string
 *                     , firstName: string
 *                     , lastName: string
 *                     , photo: string
 *                     , gender: string
 *                     , homeCity: string
 *                     , canonicalUrl: string
 *                 }
 *                 , visibility: string
 *             }, ... ] //end items
 *         }, ... ] //end groups
 *     }
 *     , listed: {
 *         groups: [ { //begin groups
 *             type: string
 *             , name: string
 *             , count: number
 *             , items: [ { //begin group items
 *                 id: string
 *                 , name: string
 *                 , description: string
 *                 , user: {
 *                     id: string
 *                     , firstName: string
 *                     , lastName: string
 *                     , photo: string
 *                     , gender: string
 *                     , homeCity: string
 *                     , canonicalUrl: string
 *                 }
 *                 , editable: boolean
 *                 , public: boolean
 *                 , collaborative: boolean
 *                 , url: string
 *                 , canonicalUrl: string
 *                 , createdAt: number
 *                 , updatedAt: number
 *                 , photo: {
 *                     id: string
 *                     , createdAt: number
 *                     , url: string
 *                     , sizes: {
 *                         count: number
 *                         , items: [ { //begin items
 *                             url: string
 *                             , width: number
 *                             , height: number
 *                         }, ... ] //end items
 *                     }
 *                     , user: {
 *                         id: string
 *                         , firstName: string
 *                         , lastName: string
 *                         , photo: string
 *                         , gender: string
 *                         , homeCity: string
 *                         , canonicalUrl: string
 *                     }
 *                     , visibility: string
 *                 }
 *                 , type: string
 *                 , followers: {
 *                     count: number
 *                 }
 *                 , listItems: {
 *                     count: number
 *                     , items: [ { //begin group items
 *                         id: string
 *                         , createdAt: number
 *                         , todo: boolean
 *                         , done: boolean
 *                         , visitedCount: number
 *                         , tip: {
 *                             id: string
 *                             , createdAt: number
 *                             , text: string
 *                             , todo: {
 *                                 count: number
 *                             }
 *                             , done: {
 *                                 count: number
 *                             }
 *                             , user: {
 *                                 id: string
 *                                 , firstName: string
 *                                 , lastName: string
 *                                 , photo: string
 *                                 , gender: string
 *                                 , homeCity: string
 *                                 , canonicalUrl: string
 *                             }
 *                         }
 *                         listed: {
 *                             count: number
 *                             , items: [ ? ]
 *                         }
 *                     } ] // end group items
 *                 }
 *             }, ... ] //end group items
 *         }, ... ] //end group
 *     }
 * }
 *
 * https://developer.foursquare.com/docs/venues/venues
 *
 * */

Private.to.foursquare.entity = function( entity ) {
	/*  N/A: Can't create Foursquare entity (venue) via API */
	return false;
};


/* Foursquare checkin model:
 *
 *     { id: string
 *     , createdAt: number
 *     , type: string
 *     , shout: string
 *     , timeZone: string
 *     , user:
 *         { id: string
 *         , firstName: string
 *         , photo: string
 *         , gender: string
 *         , homeCity: string
 *         , canonicalUrl: string
 *         , type: string
 *         }
 *     , venue: {
 *         id: string
 *         , name: string
 *         , contact:
 *             { phone: string
 *             , formattedPhone: string
 *             }
 *         , location:
 *             { address: string
 *             , lat: number
 *             , lng: number
 *             , postalCode: string
 *             , city: string
 *             , state: string
 *             , country: string
 *             }
 *         , categories: [ //begin venue categories
 *             { id: string
 *             , name: string
 *             , pluralName: string
 *             , shortName: string
 *             , icon: {
 *                 { prefix: string
 *                 , sizes: [ number, ... ]
 *                 , name: string
 *                 }
 *             , primary: boolean
 *             }
           , ... ] //end venue categories
 *         , verified: boolean
 *         , stats:
 *             { checkinsCount: number
 *             , usersCount: number
 *             , tipCount: number
 *             }
 *         , url: string
 *     }
 *     , source:
 *         { name: string
 *         , url: string
 *         }
 *     , photos:
 *         { count: number
 *         , items: [ //begin photo items
 *             { id: string
 *             , createdAt: number
 *             , url: string
 *             , sizes: {
 *                 { count: number
 *                 , items: [ //begin photo size items
 *                     { url: string
 *                     , width: number
 *                     , height: number
 *                     }
 *                 , ... ] //end photo size items
 *                 }
 *             , user:
 *                 { id: string
 *                 , firstName: string
 *                 , photo: string
 *                 , gender: string
 *                 , homeCity: string
 *                 , canonicalUrl: string
 *                 , type: string
 *                 }
 *             , visibility: string
 *         }, ... ] //end photo items
 *     }
 *     , score:
 *         { scores: [ ? ]
 *         , total: number
 *     	   }
 * }
 *
 * https://developer.foursquare.com/docs/checkins/checkins
 *
 * */

 // TODO: Allow overriding of broadcast setting for enhanced privacy
Private.to.foursquare.checkin = function( checkin ) {
	var result = {
		ll: ( Private.emptyPath( 'location.latitude', checkin ) || Private.emptyPath( 'location.longitude', checkin ) ) ? null : checkin.location.latitude + ',' +  checkin.location.longitude
		, venueId: ( Private.emptyPath( 'location.ids.foursquare', checkin ) ) ? null : checkin.location.ids.foursquare
		, venue: ( Private.emptyPath( 'location.name', checkin ) ) ? null : checkin.location.name
		, shout: ( Private.emptyPath( 'text', checkin ) ) ? null : checkin.text
		, broadcast: 'public'
		, type: 'checkin'
		, eventId: null //TODO: support events model e.g. checkin.event.ids.foursquare
	};	
	return result;
};


/* Windows */

/* Windows note model:
 * 
 * { 
 * 	TODO: http://msdn.microsoft.com/en-us/library/hh243648.aspx#file
 * }
 *
 * */

Private.to.windows.note = function( note ) {
	return false;
};


/* Windows comment (activity) model:
 *
 * { from:
 * 	{ name: string
 * 	, id: string 
 * 	}
 * , message%: string
 * , name: string
 * }
 *
 * http://msdn.microsoft.com/en-us/library/hh243648.aspx#activity
 *
 * */

Private.to.windows.comment = function( comment ) {
	var result = {
		message: ( Private.emptyPath( 'text', comment ) ) ? null : comment.text
		, visibility: { code: 'anyone' } //prefer the public 
	};
	return result;
};


/* Windows link (activity) model: 
 *
 * { from:
 * 	{ name: string
 * 	, id: string 
 * 	}
 * , message: string
 * , link: string (valid URI)
 * , description: string
 * , picture: string (valid URI)
 * , name: string
 * }
 *
 * http://msdn.microsoft.com/en-us/library/hh243648.aspx#activity
 *
 * */

Private.to.windows.link = function( link ) {
	var result = {
		message: ( Private.emptyPath( 'text', link ) ) ? null : link.text
		, name: ( Private.emptyPath( 'title', link ) ) ? null : link.title
		, link: ( Private.emptyPath( 'url', link ) ) ? null : link.url
		, picture: ( Private.emptyPath( 'thumbnail.url', link ) ) ? null : link.thumbnail.url
		, description: ( Private.emptyPath( 'description', link ) ) ? null : link.description
	};
	return result;
};


/* Windows audio model:
 *
 * {
 *	TODO: http://msdn.microsoft.com/en-us/library/hh243648.aspx#audio
 * }
 *
 * */

Private.to.windows.audio = function( audio ) {
	return false;
};

/* Windows video model:
 *
 * { from:
 * 	{ name: string
 * 	, id: string 
 * 	}
 * , message: string
 * , link: string (valid URI)
 * , description: string
 * , picture: string (valid URI)
 * , name: string
 * , source: string
 * }
 *
 * http://msdn.microsoft.com/en-us/library/hh243648.aspx#activity
 *
 * TODO: http://msdn.microsoft.com/en-us/library/hh243648.aspx#video
 *
 * */

Private.to.windows.video = function( video ) {
	return false;
};


/* Windows image (photo) model:
 *
 * {
 *	TODO: http://msdn.microsoft.com/en-us/library/hh243648.aspx#photo
 * }
 *
 * */

Private.to.windows.image = function( image ) {
	return false;
};


/* Windows person (user) model:
 *
 *    { id: string 
 *    , name: string 
 *    , first_name: string 
 *    , last_name: string 
 *    , link: string 
 *    , birth_day: number
 *    , birth_month: number
 *    , birth_year: number
 *    , work: [
 *       {
 *          employer: {
 *             name: string
 *          }
 *          , position: {
 *             name: string
 *          }
 *       }
 *    ] 
 *    , gender: string 
 *    , emails: {
 *       preferred: string
 *       , account: string 
 *       , personal: string 
 *       , business: string
 *       , other: string
 *    }, 
 *    addresses: {
 *       personal: {
 *          street: string 
 *          , street_2: string 
 *          , city: string 
 *          , state: string 
 *          , postal_code: string 
 *          , region: string
 *       }, 
 *       business: {
 *          street: string 
 *          , street_2: string 
 *          , city: string 
 *          , state: string 
 *          , postal_code: string 
 *          , region: string
 *       }
 *    } 
 *    , phones: {
 *       personal: string 
 *       , business: string 
 *       , mobile: null
 *    }
 *    , locale: string 
 *    , updated_time: string
 *    }	
 *
 * http://msdn.microsoft.com/en-us/library/hh243648.aspx#user
 *
 */

Private.to.windows.person = function( person ) {
	/* N/A: Cannot create person via API */	
};


/* Windows organization model:
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.windows.organization = function( organization ) {
	return false;
};


/* Windows entity model
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.windows.entity = function( entity ) {
	return false;
};


/* Windows checkin model:
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.windows.checkin = function( checkin ) {
	return false;
};


/* Yahoo */

/* Yahoo note model:
 * 
 * { 
 * 	N/A
 * }
 *
 * */

Private.to.yahoo.note = function( note ) {
	return false;
};


/* Yahoo comment model:
 *
 * { message%: string
 * , lastStatusModified: string
 * , uri: string 
 * }
 *
 * http://developer.yahoo.com/social/rest_api_guide/status-resource.html#status-json_obj_syntax
 *
 * */

Private.to.yahoo.comment = function( comment ) {
	var result = {
		status: {
			message: ( Private.emptyPath( 'text', comment ) ) ? null : comment.text
		}
	};
	return result;
};


/* Yahoo link model: 
 *
 * { 
 * 	N/A
 * }
 *
 * */

Private.to.yahoo.link = function( link ) {
	return false;
};


/* Yahoo audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.yahoo.audio = function( audio ) {
	return false;
};

/* Yahoo video model:
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.yahoo.video = function( video ) {
	return false;
};


/* Yahoo image (photo) model:
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.yahoo.image = function( image ) {
	return false;
};

/* Yahoo person (user) model:
 *
 * { uri: string (valid URI)
 * , guid: string
 * , birthdate: string (date format MM/DD)
 * , count: number
 * , total: number
 * , displayAge: number
 * , created: string (RFC/ISO? date)
 * , updated: string (RFC/ISO? date)
 * , familyName: string
 * , gender: string
 * , phones: [ string, ... ]
 * , givenName: string
 * , memberSince: string (RFC/ISO? date)
 * , image: 
 * 	{ height: number
 * 	, width: number
 * 	, size: string
 * 	, imageUrl: string (valid URI)
 * 	}
 * , interests: [
 * 	{ declaredInterests: [ string, ... ]
 * 	, interestCategory: string
 * 	}
 * , lang: string
 * , location: string
 * , lookingFor: [ string (FRIENDSHIP, NETWORKING), ... ]
 * , nickname: string
 * , profileUrl: string (valid URI)
 * , relationshipStatus: string ("MARRIED", ?)
 * , schools: [
 * 	{ id: number
 * 	, schoolName: string
 * 	, schoolType: string
 * 	, schoolYear: string
 * 	}, ... 
 * ]
 * , status:
 * 	{ lastStatusModified: string (date format YYYY-MM-DD)
 * 	, message: string
 * 	}
 * , timeZone: string
 * , works: [
 * 	{ current: boolean
 * 	, id: number
 * 	, startDate: string (date format YYYY-MM-DD)
 * 	, title: string
 * 	, workName: string
 * 	}, ...
 * ]
 * , isConnected: boolean
 * } 
 *
 * http://developer.yahoo.com/social/rest_api_guide/extended-profile-resource.html
 *
 */

Private.to.yahoo.person = function( person ) {
	//TODO: model person and map yahoo object
};


/* Yahoo organization model:
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.yahoo.organization = function( organization ) {
	return false;
};


/* Yahoo entity model
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.yahoo.entity = function( entity ) {
	return false;
};


/* Yahoo checkin model:
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.yahoo.checkin = function( checkin ) {
	return false;
};

/* */
/* End Object Mapping */
/* */

/* */

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
	if( 'favorite' === action || 'archive' === action ||  'watch' === action ||  'read' === action || 'view' === action || 'listen' === action ||  'post' === action ||  'checkin' === action ||  '' === action ) {
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
		case 'link':
			model = {
				url: true
				, text: false
				, image: false
				, thumbnail: false
				, source: false
				, title: false
				, description: false
				, author: false
				, publisher: false
				, clicks: false
				, views: false
				, comments_count: false
				, comments: false
				, ids: { object: false }
			};
			break;
		case 'comment':
			model = {
				link: false
				, text: false
				, location: false
				, image: false
				, thumbnail: false
				, author: false
				, publisher: false
				, image: false
				, video: false
				, audio: false
				, views: false
				, comments_count: false
				, comments: false
				, ids: { object: false }
			};
			break;
		case 'note': 
			model = {
				link: false
				, text: false
				, location: false
				, image: false
				, thumbnail: false
				, vidio: false
				, audio: false
				, author: false
				, publisher: false
				, title: { string: false }
				, description: { string: false }
				, views: false
				, comments_count: false
				, comments: false
				, ids: { object: false }
			};
			break;
		case 'audio': 
			model = {
				link: true
				, source: false
				, location: false
				, image: false
				, thumbnail: false
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
				, ids: { object: false }
			};
			break;
		case 'video':
			model = {
				link: true
				, format: { 'string': false }
				, source: false
				, location: false
				, image: false
				, thumbnail: false
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
				, ids: { object: false }
			};
			break;
		case 'image':
			model = {
				link: true
				, source: false
				, thumbnail: false
				, location: false
				, author: false
				, publisher: false
				, image: false
				, title: { string: false }
				, description: { string: false }
				, views: false
				, comments_count: false
				, comments: false
				, ids: { object: false }
			};
			break;
		case 'place':
			model = {
				link: false
				, location: true
				, image: false
				, thumbnail: false
				, title: { string: false }
				, description: { string: false }
				, views: false
				, comments_count: false
				, comments: false
				, contents_count: false
				, contents: false
				, ids: { object: false }
			};
			break;
		case 'stats':
			model = {
				link: false
				, location: false
				, source: false
				, title: { string: false }
				, description: { string: false }
				, data: true
				, ids: { object: false }
			};
			break;
		case 'location':
			model = {
				link: false
				, longitude: { number: true }
				, latitude: { number: true }
				, image: false
				, thumbnail: false
				, name: { string: false }
				, description: { string: false }
				, ids: { object: false }
			};
			break;
		case 'person':
			model = {
				link: false
				, location: false
				, image: false
				, thumbnail: false
				, name: { string: true }
				, description: { string: true }
				, views: false
				, contents_count: false
				, contents: { array: false }
				, ids: { object: false }
			};
			break;
		case 'organization':
			model = {
				link: false
				, location: false
				, image: false
				, thumbnail: false
				, name: { string: true }
				, description: { string: true }
				, views: false
				, contents_count: false
				, contents: { array: false }
				, ids: { object: false }
			};
			break;
		case 'source':
			model = {
				link: false
				, format: false
				, location: false
				, image: false
				, thumbnail: false
				, name: { string: false }
				, description: { string: false }
				, views: false
				, contents_count: false
				, contents: { array: false }
				, ids: { object: false }
			};
			break;
		case 'entity':
			model = {
				link: false
				, location: false
				, image: false
				, thumbnail: false
				, name: { string: true }
				, description: { string: true }
				, contents_count: false
				, contents: { array: false }
				, ids: { object: false }
			};
			break;
		case 'checkin': 
			model = {
				link: false
				, location: true
				, image: false
				, thumbnail: false
				, text: { string: false }
				, ids: { object: false }
				, comments_count: false
				, comments: false
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
					if( !this.is_model( obj, this.get_model( attr ) ) ) {
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
						if( !this.is_model( obj, this.get_model( attr ) ) ) {
							return false;
						}
					} else {
						if( 'undefined' === typeof item || null === item ) {
							return false;
						}	
					}
				} else if( false === item ) {
					if( 'undefined' !== typeof item && null !== item ) {
						if( true === item && this.has_model( attr ) && !this.is_model( obj, this.get_model( attr ) ) ) {
							return false;
						}
					}
				}
			}	
		}
	}

	return true;
};

Private.emptyPath = function( path, object ) {

	if( -1 !== path.indexOf( '.' ) ) {
		var pieces = path.split( '.' );
		var piece = pieces.shift();
		if ( 'undefined' !== typeof piece && null !== typeof piece && 'undefined' !== typeof object[ piece ] && null !== object[ piece ]  ) {
			return Private.emptyPath( pieces.join( '.' ), object[ piece ] );
		} else {
			return true;
		}
	} else {
		return ( 'undefined' !== typeof object[ path ] && null !== object[ path ]  ) ? false : true;
	}
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
 * 	, text: string
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
 * 	, source: { source object: optional }
 * 	, title: optional
 *	, description: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, clicks: { stats object: optional }
 *	, views: { stats object: optional }
 * 	, ids: optional
 * 	}
 * */

Private.is_link = function( obj ) {
	return this.is_model( obj, this.get_model( 'link' ) );
};

/* Comment */

/* Example: 
 * 	{ text: required
 * 	, link: { link object: optional }
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
 * 	, video: { video object: optional }
 * 	, audio: { audio object: optional }
 *	, location: { location object: optional } 
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 * 	, views: { stats object: optional }
 * 	, comments_count: { stats object: optional }
 * 	, comments: [ { comment object: optional }, ... ]
 * 	, ids: optional
 * 	}
 * */

Private.is_comment = function( obj ) {
	return this.is_model( obj, this.get_model( 'comment' ) );
};

/* Note */

/* Example: 
 * 	{ link: { link object: optional }
 * 	, text: required
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
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
 *	, ids: optional
 * 	}
 * */

Private.is_note = function( obj ) {
	return this.is_model( obj, this.get_model( 'note' ) );
};

/* Audio */

/* Example: 
 * 	{ link: { link object: required }
 *	, source: { source object: optional }
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
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
 *	, ids: optional
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
 * 	, thumbnail: { image object: optional }
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
 *	, ids: optional
 * 	}
 * */

Private.is_video = function( obj ) {
	return this.is_model( obj, this.get_model( 'video' ) );
};

/* Image */

/* Example: 
 * 	{ link: { link object: required }
 *	, source: { source object: optional }
 * 	, thumbnail*: { image object: optional } //*MUST not be present for image objects used as thumbnails
 *	, location: { location object: optional } // this is due to would-be infinite recursion
 * 	, title: optional
 *	, description: optional
 *	, author: { author object: optional }
 *	, publisher: { publisher object: optional }
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 *	, ids: optional
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
 * 	, thumbnail: { image object: optional }
 * 	, title: optional
 *	, description: optional
 *	, views: { stats object: optional }
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 *	, ids: optional
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
	return this.is_model( obj, this.get_model( 'stats' ) );
};

Private.is_clicks = function( obj ) {
	return this.is_stats( obj );
};

Private.is_views = function( obj ) {
	return this.is_stats( obj );
};

/* Location */

/* Example: 
 * 	{ ids: { key val pairs: optional, ... }
 *	, link: { link object: optional }
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
 * 	, latitude: number
 *	, longitude: number
 * 	}
 * */

Private.is_location = function( obj ) {
	return this.is_model( obj, this.get_model( 'location' ) );
};

/* Person */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
 * 	, name: required
 *	, description: optional
 *	, views: { stats object: optional }
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 *	, ids: optional
 * 	}
 * */

Private.is_person = function( obj ) {
	return this.is_model( obj, this.get_model( 'person' ) );
};


/* Organization */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
 * 	, name: required
 *	, description: optional
 *	, views: { stats object: optional }
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.is_organization = function( obj ) {
	return this.is_model( obj, this.get_model( 'organization' ) );
};


/* Source */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
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

/* Entity */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: optional } 
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
 * 	, name: required
 *	, description: optional
 *	, views: { stats object: optional }
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.is_entity = function( obj ) {
	return this.is_model( obj, this.get_model( 'entity' ) );
};

/* Checkin */

/* Example: 
 * 	{ link: { link object: optional }
 *	, location: { location object: required } 
 * 	, image: { image object: optional }
 * 	, thumbnail: { image object: optional }
 * 	, text: optional
 *	, comments_count: { stats object: optional }
 *	, comments: optional
 *	, contents_count: { stats object: optional }
 *	, contents: optional
 * 	}
 * */

Private.is_checkin = function( obj ) {
	return this.is_model( obj, this.get_model( 'checkin' ) );
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
Private.apply_actions = function( request, revert ) {
	
	//check for service and access_token
	if( 'undefined' === typeof request[ 'tokens' ] ) {
		throw new Error( 'Accessing a service requires tokens' );
	}
	
	var services = request.services
	  , actions = request.actions || request.action;

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
	  , action
	  , str = this.is_string( services )
	  , str2 = this.is_string( actions )
	  , result = {};

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

	for( y = 0; y < ylen; y += 1 ) {
		action = actions[ y ];
		for( x = 0; x < xlen; x += 1 ) {
			service = services[ x ];
			if( 'undefined' === typeof Private[ service ] ) {
				throw new Error( 'Cannot apply action to an invalid service.' );
				return false;
			}
			if( 'function' !== typeof Private[ service ][ action ] ) {
				throw new Error( 'Cannot apply invalid action or non-function.' );
				return false;
			}
			if( 'undefined' === typeof result[ action ] ) {
				result[ action ] = {};
			}
			if( 'undefined' === typeof result[ action ][ service ] ) {
				result[ action ][ service ] = {};
			}
			if( false === revert ) {
				result[ action ][ service ] = Private[ service ][ action ]( request );
			} else {
				result[ action ][ service ] = Private[ service ][ action ].revert( request );
			}
		}
	}
	return result;
};

/* All-purpose */

Private.do = function( req ) {
	return this.apply_actions( req );
};

/* Favorite */

Private.favorite = function( req ) {
	req.actions = [ 'favorite' ];
	return this.apply_actions( req );
};

Private.favorite.revert = function( req ) {
	req.actions = [ 'favorite' ];
	return this.apply_actions( req, true );
};

/* Archive */

Private.archive = function( req ) {
	req.actions = [ 'archive' ];
	return this.apply_actions( req );
};

Private.archive.revert = function( req ) {
	req.actions = [ 'archive' ];
	return this.apply_actions( req, true );
};

/* Watch */

Private.watch = function( req ) {
	req.actions = [ 'watch' ];
	return this.apply_actions( req );
};

Private.watch.revert = function( req ) {
	req.actions = [ 'watch' ];
	return this.apply_actions( req, true );
};

/* Read */

Private.read = function( req ) {
	req.actions = [ 'read' ];
	return this.apply_actions( req );
};

Private.read.revert = function( req ) {
	req.actions = [ 'read' ];
	return this.apply_actions( req, true );
};

/* See */

Private.view = function( req ) {
	req.actions = [ 'view' ];
	return this.apply_actions( req );
};

Private.view.revert = function( req ) {
	req.actions = [ 'view' ];
	return this.apply_actions( req, true );
};

/* Listen */

Private.listen = function( req ) {
	req.actions = [ 'listen' ];
	return this.apply_actions( req );
};

Private.listen.revert = function( req ) {
	req.actions = [ 'listen' ];
	return this.apply_actions( req, true );
};

/* Checkin */

Private.checkin = function( req ) {
	req.actions = [ 'checkin' ];
	return this.apply_actions( req );
};

Private.checkin.revert = function( req ) {
	req.actions = [ 'checkin' ];
	return this.apply_actions( req, true );
};

/* Say */

Private.post = function( req ) {
	req.actions = [ 'post' ];
	return this.apply_actions( req );
};

Private.post.revert = function( req ) {
	req.actions = [ 'post' ];
	return this.apply_actions( req, true );
};

/* Trash */

Private.trash = function( req ) {
	req.actions = [ 'trash' ];
	return this.apply_actions( req );
};

Private.trash.revert = function( req ) {
	req.actions = [ 'trash' ];
	return this.apply_actions( req, true );
};

/* */
/* End Actions */
/* */

/* */
/* Request Utilities  */
/* */

Private.request = function() {
	
};

Private.request.post = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback, bypass ) {
	console.log( 'post', url, oauth_token, oauth_token_secret, post_body, post_content_type, typeof callback, bypass );
	return oauth.post( url, oauth_token, oauth_token_secret, post_body, post_content_type, callback, bypass );
};

Private.request.get = function( oauth, url, oauth_token, oauth_token_secret, callback, extra_headers ) {
	console.log( 'get', url, oauth_token, oauth_token_secret, typeof callback, extra_headers );
	return oauth.get( url, oauth_token, oauth_token_secret, callback, extra_headers );
};

Private.request.put = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback ) {
	return oauth.put( url, oauth_token, oauth_token_secret, post_body, post_content_type, callback );
};

Private.request.delete = function( oauth, url, oauth_token, oauth_token_secret, callback ) {
	return oauth.delete( url, oauth_token, oauth_token_secret, callback );
};

Private.request.querystring = function( obj ) {
	return querystring.stringify( obj );
	/*
	var str, attr, inc = 0;
	for( attr in obj ) {
		if( obj.hasOwnProperty( attr ) ) {
			if( 0 === inc ) {
				return querystring.stringify( obj );
				str = attr + '=' + querystring.stringify( obj[ attr ] );
			} else {
				str = str + '&' + attr + '=' + querystring.stringify( obj[ attr ] );
			}
			inc += 1;
		}
	};
	return encodeURIComponent( str );
	*/
};

/* */
/* Begin Services */
/* */

/* Tumblr */

Private.tumblr = function( req ) { return false; };

Private.tumblr.favorite = function( req ) {
	// /user/like
	//http://www.tumblr.com/docs/en/api/v2#posts
	return false; };

Private.tumblr.favorite.revert = function( req ) {
	// /user/unlike
	//http://www.tumblr.com/docs/en/api/v2#posts
	return false; };

Private.tumblr.archive = function( req ) { return false; };

Private.tumblr.archive.revert = function( req ) { return false; };

Private.tumblr.watch = function( req ) { return false; };

Private.tumblr.watch.revert = function( req ) { return false; };

Private.tumblr.read = function( req ) { return false; };

Private.tumblr.read.revert = function( req ) { return false; };

Private.tumblr.view = function( req ) { return false; };

Private.tumblr.view.revert = function( req ) { return false; };

Private.tumblr.listen = function( req ) { return false; };

Private.tumblr.listen.revert = function( req ) { return false; };

Private.tumblr.checkin = function( req ) { return false; };

Private.tumblr.checkin.revert = function( req ) { return false; };

//Supports note, commentTK, link types
Private.tumblr.post = function( req ) { 

	//http://www.tumblr.com/docs/en/api/v2#posts
	console.log('tumblr',req.tokens.tumblr);
	console.log('action object',req.data);

	var url, query;
	if( 'note' === req.type ) {
		if( 'undefined' === typeof req.data.target.ids || 'undefined' === typeof req.data.target.ids.tumblr ) {
			console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
		}
		url = 'http://api.tumblr.com/v2/blog/' + req.data.target.ids.tumblr + '/post';
		query = Private.to.tumblr.note( req.data );
	} else if( 'comment' === req.type ) {
		if( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.ids && 'undefined' !== typeof req.data.target.ids.tumblr ) {
			url = 'http://api.tumblr.com/v2/blog/' + req.data.target.ids.tumblr + '/reblog';
			query = Private.to.tumblr.comment( req.data );
		}
	} else if( 'link' === req.type ) {
		if( 'undefined' === typeof req.data.target.ids || 'undefined' === typeof req.data.target.ids.tumblr ) {
			console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
		}
		url = 'http://api.tumblr.com/v2/blog/' + req.data.target.ids.tumblr + '/post';
		query = Private.to.tumblr.link( req.data );
	}
	var type = req.type;
	console.log('TUMBLR url',url);
	console.log('tumblr translated object',query);

	var token = req.tokens.tumblr;
	var secret = req.secrets.tumblr;

	var postbody = Private.request.querystring( query );
	url = url + '?' + postbody;
	var callback = function( status_code,data ) {
		console.log("DEBUG", typeof status_code, status_code, typeof data, data );
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		var item_id = data.response.id;
		var item_url = null;

		console.log("GETTING",'http://api.tumblr.com/v2/blog/' + req.data.target.ids.tumblr + '/posts?id=' + item_id);
		var res2 = Private.request.get( Private.service.tumblr, 'http://api.tumblr.com/v2/blog/' + req.data.target.ids.tumblr + '/posts?id=' + item_id + '&api_key=' + tumblrId, token, secret, function(res2,res3) {

			//console.log("TUMBLR FISH",typeof res2,res2,typeof res3,res3);	
			var data2;
			if( 'string' === typeof res3 ) {
				data2 = JSON.parse( res3 );
			}
			console.log("KNOTS",data2);
			var posts = data2.response.posts;
			var x = 0;
			for( x = 0; x < posts.length; x += 1 ) { 
				if( 'undefined' !== typeof posts[ x ] ) {
					
					if( null === item_url ) {
						item_url = posts[ x ].post_url;
					} else if( 'string' === typeof item_url ) {
						item_url = [ item_url, posts[ x ].post_url ];
					} else {
						item_url.push( posts[ x ].post_url );
					}

				}
			};


			console.log( "TUMBLR ID", item_id, item_url );

		} );
	
	};

	console.log("DOING POST",typeof Private.service.tumblr, url, token, secret, null, '', callback, false);
	var res = Private.request.post( Private.service.tumblr, url, token, secret, postbody, null, callback );
	console.log("RESSSSULT", res);

	return res;
};

Private.tumblr.post.revert = function( req ) {
	//delete
	//http://www.tumblr.com/docs/en/api/v2#posts
	return false; };


Private.tumblr.trash = function( req ) { return false; };

Private.tumblr.trash.revert = function( req ) { return false; };

/* Facebook */

Private.facebook = function( req ) { return false; };
Private.facebook.favorite = function( req ) {
	//https://developers.facebook.com/docs/opengraph/actions/
	return false;
};
Private.facebook.favorite.revert = function( req ) { return false; };
Private.facebook.archive = function( req ) { return false; };
Private.facebook.archive.revert = function( req ) { return false; };
Private.facebook.watch = function( req ) { return false; };
Private.facebook.watch.revert = function( req ) { return false; };
Private.facebook.read = function( req ) {
	var access_token = req.tokens.facebook;	
	console.log('ACCESS TOKEN',access_token);
	return false;
};
Private.facebook.read.revert = function( req ) { return false; };
Private.facebook.view = function( req ) { return false; };
Private.facebook.view.revert = function( req ) { return false; };
Private.facebook.listen = function( req ) { return false; };
Private.facebook.listen.revert = function( req ) { return false; };
Private.facebook.checkin = function( req ) { return false; };
Private.facebook.checkin.revert = function( req ) { return false; };

//
Private.facebook.post = function( req ) {

	console.log('facebook',req.tokens.twitter);
	console.log('action object',req.data);

	var url, query;
	if( 'note' === req.type ) {
       		url = 'https://graph.facebook.com/me/notes';
		query = Private.to.facebook.note( req.data );
	} else if( 'comment' === req.type ) {
       		url = 'https://graph.facebook.com/me/feed';	
		//if response to item: /objectid/comments
		query = Private.to.facebook.comment( req.data );
	} else if( 'link' === req.type ) {
       		url = 'https://graph.facebook.com/me/links';
		query = Private.to.facebook.link( req.data );
	}

	var token = req.tokens.facebook;
	var secret = req.secrets.facebook;

	console.log('facebook translated object', query );
	var postbody = Private.request.querystring( query );
	var callback = function( status_code, data ) {
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		status_code = data.statusCode;
		var item_id = null;//data.id;
		var item_url = null;//data.html_url;
		var attr, filename;
		console.log('t1',data);
		if( 'undefined' !== typeof data ) {
			console.log('t2', typeof data, data.id, data.html_url );
			if( 'undefined' !== typeof data.id ) {
				item_id = data.id;
			}
			if( 'undefined' !== typeof data.html_url ) {
				//none here
			}
		};
		if( null === item_url && null !== item_id && 'note' === req.data.type ) {
			item_url = 'https://www.facebook.com/note.php?note_id=' + item_id;
		}
		console.log( "FACEBOOK ID", item_id, item_url );
	};

	console.log("DOING POST",typeof Private.service.facebook, url, token, secret, postbody, '', callback);
	//var res = Private.service.facebook._request( "POST", url, {}, postbody, token, callback);
	//Private.request.post = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback ) {

	var res = Private.request.post( Private.service.facebook, url, token, secret, postbody, null, callback );
	//var res = Private.request.get( Private.service.twitter, url, token, secret, callback );
	console.log("RESSSSULT");
	console.log(res);

};
Private.facebook.post.revert = function( req ) { return false; };
Private.facebook.trash = function( req ) { return false; };
Private.facebook.trash.revert = function( req ) { return false; };

/* Twitter */

/* Implemented: 
 *	- favorite (favorite)
 *	- favorite.revert (unfavorite)
 *	- post (tweet) 
 *	- post.revert (untweet)
 * */


Private.twitter = function( req ) { return false; };

Private.twitter.favorite = function( req ) {
	//https://dev.twitter.com/docs/api/1/post/favorites/create/%3Aid
	var url = 'https://api.twitter.com/1/favorites/create/';
	var token = req.tokens.twitter;
	var secret = req.secrets.twitter;

	var id = req.data.id;
	var query = {};
	
	url += id + '.json';

	var callback = function( req ) {
		console.log("DEBUG", typeof req, req );
		if( 'string' === typeof req ) {
			req = JSON.parse( req );
		}
		var data = req.data, status_code = req.status_code;
		console.log( 'Twitter post favorite' );
       		console.log( 'STATUS CODE: ' + JSON.stringify( status_code ) );
		console.log( 'STRING: ' + JSON.stringify( data ) );
	};

	return Private.request.post( Private.service.twitter, url, token, secret, query );
};

Private.twitter.favorite.revert = function( req ) {
};

Private.twitter.archive = function( req ) { return false; };

Private.twitter.archive.revert = function( req ) { return false; };

Private.twitter.watch = function( req ) { return false; };

Private.twitter.watch.revert = function( req ) { return false; };

Private.twitter.read = function( req ) { return false; };

Private.twitter.read.revert = function( req ) { return false; };

Private.twitter.view = function( req ) { return false; };

Private.twitter.view.revert = function( req ) { return false; };

Private.twitter.listen = function( req ) { return false; };

Private.twitter.listen.revert = function( req ) { return false; };

Private.twitter.checkin = function( req ) { return false; };

Private.twitter.checkin.revert = function( req ) { return false; };

// Supports comment, imageTK types
Private.twitter.post = function( req ) {
	console.log('twitter',req.tokens.twitter);
	console.log('action object',req.data);
	if( 'comment' === req.type ) {
		//https://dev.twitter.com/docs/api/1/post/statuses/update
		var url = 'http://api.twitter.com/1/statuses/update.json';
		//var url = 'http://api.twitter.com/1/statuses/home_timeline.json';
		var token = req.tokens.twitter;
		var secret = req.secrets.twitter;

		var query = Private.to.twitter.comment( req.data );

		var postbody = Private.request.querystring( query );
		var callback = function( status_code, data ) {
			if( 'string' === typeof data ) {
				data = JSON.parse( data );
			}
			var item_id = data.id_str;
			var item_url = 'https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str;
			console.log("TWITTER ID",item_id, item_url );
		};
		console.log("DOING POST",url, token);
		//var res = Private.request.post( Private.service.twitter, url, token, secret, query );
		//var res = Private.request.post( Private.service.twitter, url, token, secret, postbody, 'application/javascript', callback );
		var res = Private.request.post( Private.service.twitter, url, token, secret, query, null, callback );
		//var res = Private.service.twitter.post( url, token, secret, {'status':'testing123456789'} );
		//var res = Private.request.get( Private.service.twitter, url, token, secret, callback );
		//var res = Private.service.twitter._performSecureRequest( token, secret, "POST", url, {}, postbody, null, callback, {} );	
		console.log("RESSSSULT");
		console.log(res);
	}
};

Private.twitter.post.revert = function( req ) {
	//https://dev.twitter.com/docs/api/1/post/statuses/destroy/%3Aid
	return false;
};

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

Private.github.view = function( req ) { return false; };

Private.github.view.revert = function( req ) { return false; };

Private.github.listen = function( req ) { return false; };

Private.github.listen.revert = function( req ) { return false; };

Private.github.checkin = function( req ) { return false; };

Private.github.checkin.revert = function( req ) { return false; };

Private.github.post = function( req ) {


	console.log('github',req.tokens.twitter);
	console.log('action object',req.data);
	var query = Private.to.github.note( req.data );
	console.log('translated object',query);
	var url = 'https://api.github.com/gists';
	var token = req.tokens.github;
	var secret = req.secrets.github;
	var postbody = JSON.stringify( query );
	var callback = function( data ) {
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		status_code = data.statusCode;
		data = data.data;
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		var item_id = null;//data.id;
		var item_url = null;//data.html_url;
		var attr, filename;
		console.log('t1',data);
		if( 'undefined' !== typeof data ) {
			console.log('t2', typeof data, data.id, data.html_url );
			if( 'undefined' !== typeof data.id ) {
				item_id = data.id;
			}
			if( 'undefined' !== typeof data.html_url ) {
				item_url = data.html_url;
			}
		};
		console.log( "GITHUB", item_id, item_url );
	};

	//appl
	var contenttype = 'application/json';
	console.log("DOING POST",typeof Private.service.github, url, token, secret, postbody, contenttype, callback, false );

	var res = Private.request.post( Private.service.github, url, token, secret, postbody, contenttype, callback, false );
	console.log("RESSSSULT", res);

	return res;

};

Private.github.post.revert = function( req ) {
	//http://developer.github.com/v3/gists/
	return false; };

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
Private.google.view = function( req ) { return false; };
Private.google.view.revert = function( req ) { return false; };
Private.google.listen = function( req ) { return false; };
Private.google.listen.revert = function( req ) { return false; };
Private.google.checkin = function( req ) { return false; };
Private.google.checkin.revert = function( req ) { return false; };
Private.google.post = function( req ) { return false; };
Private.google.post.revert = function( req ) { return false; };
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

Private.yahoo.read = function( req ) {
	//http://developer.yahoo.com/social/rest_api_guide/Single-update-resource.html
	return false;
};

Private.yahoo.read.revert = function( req ) { return false; };

Private.yahoo.view = function( req ) { return false; };

Private.yahoo.view.revert = function( req ) { return false; };

Private.yahoo.listen = function( req ) { return false; };

Private.yahoo.listen.revert = function( req ) { return false; };

Private.yahoo.checkin = function( req ) { return false; };

Private.yahoo.checkin.revert = function( req ) { return false; };

// Supports comments, links
Private.yahoo.post = function( req ) {
	//http://developer.yahoo.com/social/rest_api_guide/status-resource.html#status-json_obj_syntax	

	console.log('yahoo',req.tokens.yahoo);
	console.log('action object',req.data);
	if( 'comment' === req.type ) {
		var query = Private.to.yahoo.comment( req.data );
		console.log('translated object',query);
		console.log('is there a target id?', req.target );
		var target_id = '';
		if( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.ids ) {
			target_id = req.data.target.ids.yahoo;
		} else {
			console.log('needs a user guid to post to');
			return false;
		}
		var url = 'http://social.yahooapis.com/v1/user/' + target_id + '/profile/status';
		var token = req.tokens.yahoo;
		var secret = req.secrets.yahoo;

		//var postbody = Private.request.querystring( query );
	
		var postbody = JSON.stringify( query );
		var callback = function( status_code, data ) {

			var res = Private.request.get( Private.service.yahoo, url, token, secret, function( status2, data2 ) {
				console.log("FIRST",typeof status2, status2);
				console.log("DEBUG", typeof data2, data2 );
				if( 'string' === typeof data2 && '' !== data2 ) {
					console.log("PARSING",data2);
					data = JSON.parse( data2 );
				} else {
					if( '' === data2) {
						console.log("EMPTY DATA");
					}
				}
				var item_id2 = data2.id;
				var item_url2 = null;
				console.log("YAHOO", item_id2, item_url2, data2 );
			}, { 'Content-Type': 'application/json' } );
		};

		console.log("DOING PUT",typeof Private.service.yahoo, url, token, secret, postbody, 'application/json', callback);

		var res = Private.request.put( Private.service.yahoo, url, token, secret, postbody, 'application/json', callback );
		console.log("RESSSSULT", res);

		return res;
	}
};

Private.yahoo.post.revert = function( req ) { return false; };

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
Private.windows.view = function( req ) { return false; };
Private.windows.view.revert = function( req ) { return false; };
Private.windows.listen = function( req ) { return false; };
Private.windows.listen.revert = function( req ) { return false; };
Private.windows.checkin = function( req ) { return false; };
Private.windows.checkin.revert = function( req ) { return false; };
Private.windows.post = function( req ) { 

	//http://msdn.microsoft.com/en-us/library/hh243648.aspx#activity
	console.log('windows',req.tokens.windows);
	console.log('action object',req.data);
	var query;
	if( 'comment' === req.type ) {
		query = Private.to.windows.comment( req.data );
	} else if ( 'link' === req.type ) {
		query = Private.to.windows.link( req.data );
	}


	console.log('translated object',query);
	console.log('is there a target id?', req.target );
	var target_id = '';
	var url = 'https://apis.live.net/v5.0/me/share';
	var token = req.tokens.windows;
	var secret = req.secrets.windows;

	var postbody = JSON.stringify( query ); //Private.request.querystring( query );
	var callback = function( req ) {
		console.log("DEBUG", typeof req, req );
		if( 'string' === typeof req ) {
			req = JSON.parse( req );
		}
		var data = req.data, status_code = req.status_code;
		console.log('xxx',typeof data, data );
		var item_id = data.id;
		var item_url = null;
		console.log( 'WINDOWS',item_id,item_url);
	};

	console.log("DOING POST",typeof Private.service.windows, url, token, secret, postbody, 'application/json', callback);

	var res = Private.request.post( Private.service.windows, url, token, secret, postbody, 'application/json', callback );
	console.log("RESSSSULT", res);

	return res;


};
Private.windows.post.revert = function( req ) { return false; };
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
Private.foursquare.view = function( req ) { return false; };
Private.foursquare.view.revert = function( req ) { return false; };
Private.foursquare.listen = function( req ) { return false; };
Private.foursquare.listen.revert = function( req ) { return false; };

Private.foursquare.checkin = function( req ) {
	//https://developer.foursquare.com/docs/checkins/add
	return false;
};

Private.foursquare.checkin.revert = function( req ) { return false; };

Private.foursquare.post = function( req ) {
	//https://developer.foursquare.com/docs/checkins/addcomment
	//https://developer.foursquare.com/docs/tips/add
	//https://developer.foursquare.com/docs/photos/add
	return false;
};

Private.foursquare.post.revert = function( req ) {
	//https://developer.foursquare.com/docs/checkins/deletecomment	
	return false;
};

Private.foursquare.trash = function( req ) { return false; };

Private.foursquare.trash.revert = function( req ) { return false; };

/* Linkedin */

Private.linkedin = function( req ) { return false; };

//group posts and social streams
Private.linkedin.favorite = function( req ) {
	//https://developer.linkedin.com/documents/groups-api
	return false;
};

Private.linkedin.favorite.revert = function( req ) { return false; };

Private.linkedin.archive = function( req ) { return false; };

Private.linkedin.archive.revert = function( req ) { return false; };

Private.linkedin.watch = function( req ) { return false; };

Private.linkedin.watch.revert = function( req ) { return false; };

Private.linkedin.read = function( req ) { return false; };

Private.linkedin.read.revert = function( req ) { return false; };

Private.linkedin.view = function( req ) { return false; };

Private.linkedin.view.revert = function( req ) { return false; };

Private.linkedin.listen = function( req ) { return false; };

Private.linkedin.listen.revert = function( req ) { return false; };

Private.linkedin.checkin = function( req ) { return false; };

Private.linkedin.checkin.revert = function( req ) { return false; };


// Supports note (group post), comment (status) and link
Private.linkedin.post = function( req ) {
	//https://developer.linkedin.com/documents/share-api

	//http://msdn.microsoft.com/en-us/library/hh243648.aspx#activity
	console.log('linkedin',req.tokens.linkedin);
	console.log('action object',req.data);
	var query;
	var url;

	if( 'comment' === req.type ) {
		query = Private.to.linkedin.comment( req.data );
		url = 'http://api.linkedin.com/v1/people/~/shares';
	} else if ( 'link' === req.type ) {
		query = Private.to.linkedin.link( req.data );
		url = 'http://api.linkedin.com/v1/people/~/shares';
	} else if ( 'note' === req.type ) {
		console.log('is there a target id?', req.target );
		if( 'undefined' === typeof req.target || 'undefined' === typeof req.target.ids || 'group' !== req.target.types.linkedin || 'undefined' === typeof req.target.ids.linkedin ) {
			console.log('must defined a linkedin target group id and make the target type "group"',req);
			return false;
		}
		query = Private.to.linkedin.note( req.data );
		url = 'http://api.linkedin.com/v1/groups/' + req.target.ids.linkedin + '/posts';
	}

	console.log('translated object',query);
	console.log('DOING URL',url);
	var token = req.tokens.linkedin;
	var secret = req.secrets.linkedin;
	var postbody = JSON.stringify( query );
	//var postbody = Private.request.querystring( query );
	console.log("POST BODY",postbody);
	//url = url +'?' + postbody;
	var callback = function( status_code, data ) {
		console.log("DEBUG", typeof data, data );

		if( 'string' === typeof data ) {
			if(t  '' === data.replace(/\s/g, '' ) ) {
				data = null;
			} else {
				data = JSON.parse( data );
			}
		}
		var url2 = 'http://api.linkedin.com/v1/people/~/network/updates?scope=self';
		var res2 = Private.request.get( Private.service.linkedin, url2, token, secret, function( status_code2, data2 ) {
			console.log("DATA2",typeof data2,data2);
			console.log( 'linkedin post (status) posted' );
			console.log( 'linkedin STATUS CODE: ' + JSON.stringify( status_code2 ) );
			console.log( 'linkedinu STRING: ' + JSON.stringify( data2 ) );
		}, { 'x-li-format': 'json' } );
	};
	//postbody = '<?xml version="1.0" encoding="UTF-8"?><share><comment>83% of employers will use social media to hire: 78% LinkedIn, 55% Facebook, 45% Twitter [SF Biz Times] http://bit.ly/cCpeOD</comment><content><title>Survey: Social networks top hiring tool - San Francisco Business Times</title><submitted-url>http://sanfrancisco.bizjournals.com/sanfrancisco/stories/2010/06/28/daily34.html</submitted-url><submitted-image-url>http://images.bizjournals.com/travel/cityscapes/thumbs/sm_sanfrancisco.jpg</submitted-image-url></content><visibility><code>anyone</code></visibility></share>';
	console.log("DOING POST",typeof Private.service.linkedin, url, token, secret, postbody, 'application/json', callback);

	var res = Private.request.post( Private.service.linkedin, url, token, secret, postbody, 'application/json', callback );
	console.log("RESSSSULT", res);

	return res;

};

Private.linkedin.post.revert = function( req ) { return false; };

Private.linkedin.trash = function( req ) { return false; };

Private.linkedin.trash.revert = function( req ) { return false; };

/* */
/* End Services */
/* */

var Public = function() {

};

Public.prototype.request = function( request, connection, type ) {

	if( 'socket' === type ) {
		var response = Private.do( request );
		connection.emit( Private.prefix, response );
	}

};

Public.prototype.service = function( service ) {
	return Private.service( service );
};

Public.prototype.secrets = function( path ) {

	if( 'undefined' === typeof path || null === path ) {
		throw new Error( 'Keypath cannot be empty' );
	}

	var auth_keys = require( path ); 

	for( var key in auth_keys ) { 
		global[ key ]= auth_keys[ key ]; 
	}

	// Twitter (oAuth 1.0)
	Private.service.twitter = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", twitterId, twitterSecret, "1.0", twitterCallbackAddress || null, "HMAC-SHA1");

	// Facebook (oAuth 2)
	Private.service.facebook = new OAuth2( facebookId, facebookSecret, "https://graph.facebook.com" );

	// Google (oAuth 2)
	Private.service.google = new OAuth2( googleId, googleSecret,  "", "https://accounts.google.com/o/oauth2/auth", "https://accounts.google.com/o/oauth2/token" );

	// Foursquare (oAuth 2)
	Private.service.foursquare = new OAuth2( foursquareId, foursquareSecret, "https://foursquare.com", "/oauth2/authenticate", "/oauth2/access_token", "HMAC-SHA1" );
	Private.service.foursquare.setAccessTokenName("oauth_token");

	// Tumblr (oauth 1.0)
	Private.service.tumblr = new OAuth( "http://www.tumblr.com/oauth/request_token", "http://www.tumblr.com/oauth/access_token", tumblrId, tumblrSecret, "1.0", tumblrCallbackAddress || null, "HMAC-SHA1" );

	// Github (oAuth 2)
	Private.service.github = new OAuth2( githubId, githubSecret, "https://github.com", "/login/oauth/authorize", "/login/oauth/access_token", "HMAC-SHA1" );
	Private.service.github.setAccessTokenName("access_token");

	// Yahoo (oauth 1.0)
	Private.service.yahoo = new OAuth( "https://api.login.yahoo.com/oauth/v2/get_request_token", "https://api.login.yahoo.com/oauth/v2/get_token", yahooId, yahooSecret, "1.0", yahooCallbackAddress || null, "HMAC-SHA1" );

	// Linkedin (oauth 1.0)
	Private.service.linkedin = new OAuth( "https://api.linkedin.com/uas/oauth/requestToken", "https://api.linkedin.com/uas/oauth/accessToken", linkedinId, linkedinSecret, "1.0", linkedinCallbackAddress || null, "HMAC-SHA1" );

	// Windows Live (oAuth 2)
	Private.service.windows = new OAuth2( windowsId, windowsSecret, "https://oauth.live.com", "/authorize", "/token", "HMAC-SHA1" );


};

Public.prototype.favorite = function( req ) {
	return Private.favorite( req );
};

Public.prototype.unfavorite = function( req ) {
	return Private.favorite( req, true );
};

Public.prototype.archive = function( req ) {
	return Private.archive( req );
};

Public.prototype.unarchive = function( req ) {
	return Private.archive( req, true );
};

Public.prototype.watch = function( req ) {
	return Private.watch( req, true );
};

Public.prototype.unwatch = function( req ) {
	return Private.watch( req, true );
};

Public.prototype.read = function( req ) {
	return Private.read( req, true );
};

Public.prototype.unread = function( req ) {
	return Private.read( req, true );
};

Public.prototype.view = function( req ) {
	return Private.view( req );
};

Public.prototype.unview = function( req ) {
	return Private.view( req, true );
};

Public.prototype.listen = function( req ) {
	return Private.listen( req );
};

Public.prototype.unlisten = function( req ) {
	return Private.listen( req, true );
};

Public.prototype.checkin = function( req ) {
	return Private.checkin( req );
};

Public.prototype.uncheckin = function( req ) {
	return Private.checkin( req, true );
};

Public.prototype.post = function( req ) {
	return Private.post( req );
};

Public.prototype.unpost = function( req ) {
	return Private.post( req, true );
};

Public.prototype.trash = function( req ) {
	return Private.trash( req );
};

Public.prototype.untrash = function( req ) {
	return Private.trash( req, true );
};

// Public API

module.exports = new Public();

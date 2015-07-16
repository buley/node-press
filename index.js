

var OAuth = require("oauth").OAuth
, OAuth2 = require("oauth").OAuth2
, OAuthUtils = require('oauth/lib/_utils.js')
, querystring = require("querystring")
, AS = require("node-as");

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
	console.log("TO FACEBOOK",link);
	var result = {
		link: ( Private.emptyPath( 'link.url', link ) ) ? null : link.link.url
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
 * , location:
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
	if ( 'undefined' === typeof path || 'undefined' === typeof object ) {
		return true;
	}
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
Private.apply_actions = function( request, connection, revert, on_success, on_error ) {
	
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
				throw new Error( 'Cannot apply action to an invalid service.', service );
				return false;
			}
			if( 'function' !== typeof Private[ service ][ action ] ) {
				throw new Error( 'Cannot apply invalid action or non-function.', service, action );
				return false;
			}
			if( 'undefined' === typeof result[ action ] ) {
				result[ action ] = {};
			}
			if( 'undefined' === typeof result[ action ][ service ] ) {
				result[ action ][ service ] = {};
			}
			if( false === revert ) {
				result[ action ][ service ] = Private[ service ][ action ]( request, connection, on_success, on_error  );
			} else {
				result[ action ][ service ] = Private[ service ][ action ].revert( request, connection, on_success, on_error  );
			}
		}
	}
	return result;
};

/* All-purpose */

Private.do = function( req, connection, revert, success, error ) {
	var own_success = function( response ) {
		console.log("ALL PURPOSE SUCCESS",response,typeof success);
		if( 'function' === typeof success ) {
			success( response );
		}
	};
	var own_error = function( err ) {
		if( 'function' === typeof error ) {
			error( err );
		}
	};
	return this.apply_actions( req, connection, revert, success, error );
};

/* Stream */

Private.stream = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'stream' ];
	return this.apply_actions( req, connection );
};


/* Favorite */

Private.favorite = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'favorite' ];
	return this.apply_actions( req, connection );
};

Private.unfavorite = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'favorite' ];
	return this.apply_actions( req, connection, true );
};

/* Archive */

Private.archive = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'archive' ];
	return this.apply_actions( req, connection );
};

Private.archive.revert = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'archive' ];
	return this.apply_actions( req, connection, true );
};

/* Watch */

Private.watch = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'watch' ];
	return this.apply_actions( req, connection );
};

Private.watch.revert = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'watch' ];
	return this.apply_actions( req, connection, true );
};

/* Read */

Private.read = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'read' ];
	return this.apply_actions( req, connection );
};

Private.read.revert = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'read' ];
	return this.apply_actions( req, connection, true );
};

/* See */

Private.view = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'view' ];
	return this.apply_actions( req, connection );
};

Private.view.revert = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'view' ];
	return this.apply_actions( req, connection, true );
};

/* Listen */

Private.listen = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'listen' ];
	return this.apply_actions( req, connection );
};

Private.listen.revert = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'listen' ];
	return this.apply_actions( req, connection, true );
};

/* Checkin */

Private.checkin = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'checkin' ];
	return this.apply_actions( req, connection );
};

Private.checkin.revert = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'checkin' ];
	return this.apply_actions( req, connection, true );
};

/* Say */

Private.post = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		req.data.id = id;
		req.data.url = url;
		console.log("ONE",req);
		console.log("IT WAS A SUCCESS");
		if( 'function' === typeof on_success ) { on_success( req ); }
	};
	req.actions = [ 'post' ];
	return this.apply_actions( req, connection, null, own_callback );
};

Private.repost = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		req.data.id = id;
		req.data.url = url;
		if( 'function' === typeof on_success ) { on_success( req ); }
	};
	req.actions = [ 'repost' ];
	return this.apply_actions( req, connection );
};

Private.edit = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		req.data.id = id;
		req.data.url = url;
		if( 'function' === typeof on_success ) { on_success( req ); }
	};
	req.actions = [ 'edit' ];
	return this.apply_actions( req, connection );
};

Private.unpost = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		req.data.id = id;
		req.data.url = url;
		if( 'function' === typeof on_success ) { on_success( req ); }
	};
	req.actions = [ 'unpost' ];
	return this.apply_actions( req, connection, true );
};

/* Trash */

Private.trash = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'trash' ];
	return this.apply_actions( req, connection );
};

Private.trash.revert = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		//console.trace();connection.emit( Private.prefix, {} );
	};
	req.actions = [ 'trash' ];
	return this.apply_actions( req, connection, true );
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
	return oauth.post( url, oauth_token, oauth_token_secret, post_body, post_content_type, callback, bypass );
};

Private.request.get = function( oauth, url, oauth_token, oauth_token_secret, callback, extra_headers ) {
	//hacky duck typing
	if( 'function' !== typeof callback && 'function' === oauth_token_secret ) {S
		//oauth2 (no secret is the feature detected, seeing callback as 3rd arg)
		return oauth.get( url, oauth_token, oauth_token_secret );
	} else {
		//oauth1.0
		return oauth.get( url, oauth_token, oauth_token_secret, callback, extra_headers );
	}
};

Private.request.put = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback ) {
	return oauth.put( url, oauth_token, oauth_token_secret, post_body, post_content_type, callback );
};

Private.request.delete = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback ) {
	//hacky duck typing
	if( 'function' !== typeof callback && 'function' === oauth_token_secret ) {
		var append_token = null;
		return oauth.delete( url, oauth_token, oauth_token_secret, post_body, post_content_type, callback, append_token );
	} else {
		//oauth1.0
		return oauth.delete( url, oauth_token, oauth_token_secret, callback );
	}

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

Private.tumblr = function( req, connection, on_success, on_error ) { return false; };

/* Stream */

Private.tumblr.stream = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
		    req.data = null;   
		}
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data.streams = {};
		}
		if( true === req.raw ) {
			req.data.streams.tumblr = data;
		} else {
			var res = [], z = 0, zitem, zlen = data.response.posts.length;
			for( z = 0; z < zlen; z += 1 ) {
				zitem = data.response.posts[ z ];
				if( 'link' === zitem.type   ) {
					//link
					res.push( Private.stream.tumblr.link.to.activity( zitem ) );
				} else if( 'text' === zitem.type ) {
					//note (text)
					res.push( Private.stream.tumblr.note.to.activity( zitem ) );
				}

			}
			req.data.streams.tumblr = res;
		}


		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			console.log("TWO",req);
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var token = req.tokens.tumblr;
	var secret = req.secrets.tumblr;
	var url = 'http://api.tumblr.com/v2/user/dashboard';	
	/*
	var query = { notes_info: true, reblog_info: true };
	var postbody = Private.request.querystring( query );
	url = url + '?' + postbody;
	*/

	var callback = function( status_code, data ) {

		console.log('tumblr return data',data);
		console.log('justincase status code',status_code);
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}
	};

	Private.request.get( Private.service.tumblr, url, token, secret, callback );

};

Private.tumblr.favorite = function( req, connection, invert ) {
	// /user/like
	//http://www.tumblr.com/docs/en/api/v2#posts
	
	var own_callback;
       if( true === invert ) {
		own_callback = function( reqdata ) {
			
			if( 'undefined' === typeof req.data.unfavorited ) {
				req.data.unfavorited = {};
			}
			//{ meta: { status: 200, msg: 'OK' },
			if( 'undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status ) {
				req.data.unfavorited.tumblr = true;
			} else {
				req.data.unfavorited.tumblr = false;
			}
			
			var x = 0, xlen = req.services.length, service;
			var complete = true;
			for( x = 0; x < xlen; x += 1 ) {
				service = req.services[ x ];
				if( 'undefined' === typeof req.data.unfavorited[ service ] ) {
					complete = false;
				}
			}
			if( complete ) {
				console.log("THREE",req);
				if( 'function' === typeof on_success ) { on_success( req ); }
			}
		};
       } else {
		own_callback = function( reqdata ) {
			
			if( 'undefined' === typeof req.data.favorited ) {
				req.data.favorited = {};
			}
			//{ meta: { status: 200, msg: 'OK' },
			if( 'undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status ) {
				req.data.favorited.tumblr = true;
			} else {
				req.data.favorited.tumblr = false;
			}
			
			var x = 0, xlen = req.services.length, service;
			var complete = true;
			for( x = 0; x < xlen; x += 1 ) {
				service = req.services[ x ];
				if( 'undefined' === typeof req.data.favorited[ service ] ) {
					complete = false;
				}
			}
			if( complete ) {
			console.log("FOUR",req);
				if( 'function' === typeof on_success ) { on_success( req ); }
			}
		};
	}
	
	var target_blog = null, target_key, target_id;
	if( 'undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog || 'undefined' === typeof req.data.target.tumblr.blog || 'undefined' === typeof req.data.target.tumblr.key ) {
		console.log("need to target a blog, have an id and key (reblog_key)");
	} else {
		target_blog = req.data.target.tumblr.blog;
		target_id = req.data.target.tumblr.id;
		target_key = req.data.target.tumblr.key;
	}

	var url;
	if( invert ) {
		url = 'http://api.tumblr.com/v2/user/unlike';
	} else {
		url = 'http://api.tumblr.com/v2/user/like';
	}
	var query = { id: target_id, reblog_key: target_key };
	var type = req.data.type;

	var token = req.tokens.tumblr;
	var secret = req.secrets.tumblr;

	var postbody = Private.request.querystring( query );
	url = url + '?' + postbody;
	var callback = function( status_code,data ) {
		if( '' === data ) {
			data = null;
		}
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}	
	};

	return Private.request.post( Private.service.tumblr, url, token, secret, postbody, null, callback );

};

Private.tumblr.unfavorite = function( req, connection, on_success, on_error ) {
	return Private.tumblr.favorite( req, connection, true );
};

Private.tumblr.archive = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.archive.revert = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.watch = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.watch.revert = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.read = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.read.revert = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.view = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.view.revert = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.listen = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.listen.revert = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.checkin = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.checkin.revert = function( req, connection, on_success, on_error ) { return false; };

//Supports note, commentTK, link types
Private.tumblr.post = function( req, connection, on_success, on_error ) { 
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.upstream_duplicates ) {
			req.data.upstream_duplicates = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates.local ) {
			req.data.upstream_duplicates.local = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates.tumblr ) {
			req.data.upstream_duplicates.tumblr = {};
		}
		req.data.upstream_duplicates.tumblr.id = id;
		if( 'undefined' !== typeof req.meta && 'undefined' !== typeof req.meta.id ) {
			req.data.upstream_duplicates.local.id = req.meta.id;
		}
		req.data.upstream_duplicates.tumblr.url = url;
		req.data.verb = ( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.verb ) ? req.data.verb : 'post';
		req.verb = 'publish';
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.upstream_duplicates[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			console.log("FIVE",req);
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};

	var own_error = function( ) {
		req.data.urls.tumblr = false;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( 'undefined' === typeof req.data.upstream_duplicates[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
		console.log("SIX",req);
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};

	//http://www.tumblr.com/docs/en/api/v2#posts
	console.log('tumblr',req.tokens.tumblr);
	console.log('action object',req.data);
	if( 'undefined' === typeof req.data.type ) {
		console.log('need to declare a type');
		return false;
	}
	if( 'undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog ) {
		console.log('missing target.tumblr.blog');
		return false;
		//todo: new 
	}
	var url, query;
	if( 'note' === req.data.type ) {
		if( 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog ) {
			console.log("need to target a id (req.data.target.tumblr.id) ");
			return false;
		}
		url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/post';
		query = Private.to.tumblr.note( req.data );
	} else if( 'comment' === req.data.type ) {
		if( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.tumblr && 'undefined' !== typeof req.data.target.tumblr.blog ) {
			url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/reblog';
			query = Private.to.tumblr.comment( req.data );
		}
	} else if( 'link' === req.data.type ) {
		if( 'undefined' !== typeof req.data.target && ( 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog ) ) {
			console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
			return false;
		}
		url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/post';
		query = Private.to.tumblr.link( req.data );
	}
	var type = req.data.type;

	var token = req.tokens.tumblr;
	var secret = req.secrets.tumblr;

	var postbody = Private.request.querystring( query );
	url = url + '?' + postbody;
	var callback = function( status_code,data ) {
		console.log("DEBUG", typeof status_code, status_code, typeof data, data );
		if( 'string' === typeof data ) {

			if( 400 == status_code || 404 === status_code ) {
				own_error();
				return;
			} else {
				data = JSON.parse( data );
			}
		}

		var item_id = data.response.id;
		var item_url = null;

		console.log("GETTING",'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/posts?id=' + item_id);
		var res2 = Private.request.get( Private.service.tumblr, 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/posts?id=' + item_id + '&api_key=' + tumblrId, token, secret, function(res2,res3) {

			//console.log("TUMBLR FISH",typeof res2,res2,typeof res3,res3);	
			var data2;
			if( 'string' === typeof res3 ) {
				data2 = JSON.parse( res3 );
			}

			if( 400 == data2.statusCode || 404 === data2.statusCode ) {
				own_error();
				return;
			} 

			console.log("KNOTS",data2);
			if( 'undefined' !== data2.meta && 404 === data2.meta.status ) {

			}
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
			if( 'function' === typeof own_callback ) {
				own_callback( item_id, item_url );
			}	


		} );
	
	};

	console.log("DOING POST",typeof Private.service.tumblr, url, token, secret, null, '', callback, false);
	var res = Private.request.post( Private.service.tumblr, url, token, secret, postbody, null, callback );
	console.log("RESSSSULT", res);

	return res;
};

Private.tumblr.unpost = function( req, connection, on_success, on_error ) {
	var own_callback = function( reqdata ) {
	
		if( 'undefined' === typeof req.data.deleted ) {
			req.data.deleted = {};
		}
		//{ meta: { status: 200, msg: 'OK' },
		if( 'undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status ) {
			req.data.deleted.tumblr = true;
		} else {
			req.data.deleted.tumblr = false;
		}
		
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.deleted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			console.log("SEVEN",req);
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var target_blog = null;
	if( 'undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog || 'udnefined' === typeof req.data.target.tumblr.blog ) {
		console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
	} else {
		target_blog = req.data.target.tumblr.blog;
		target_id = req.data.target.tumblr.id;
	}
	var url = 'http://api.tumblr.com/v2/blog/' + target_blog + '/post/delete';
	var query = { id: target_id };
	var type = req.data.type;

	var token = req.tokens.tumblr;
	var secret = req.secrets.tumblr;

	var postbody = Private.request.querystring( query );
	url = url + '?' + postbody;
	var callback = function( status_code,data ) {

		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}	
	};

	return Private.request.post( Private.service.tumblr, url, token, secret, postbody, null, callback );

};

Private.tumblr.edit = function( req, connection, on_success, on_error ) {
	console.log('action object',req.data);

	var url, query;
	if( 'note' === req.data.type ) {
		if( 'undefined' !== typeof req.data.target && ( 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog ) ) {
			console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
		}
		url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/post';
		query = Private.to.tumblr.note( req.data );
	} else if( 'comment' === req.data.type ) {
		if( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.tumblr && 'undefined' !== typeof req.data.target.tumblr.blog ) {
			url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/reblog';
			query = Private.to.tumblr.comment( req.data );
		}
	} else if( 'link' === req.data.type ) {
		if( 'undefined' !== typeof req.data.target && ( 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog ) ) {
			console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
		}
		url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/post';
		query = Private.to.tumblr.link( req.data );
	}
	var type = req.data.type;
	console.log('TUMBLR url',url);

	var token = req.tokens.tumblr;
	var secret = req.secrets.tumblr;

	var postbody = Private.request.querystring( query );
	url = url + '?' + postbody;
	var own_callback = function( reqdata ) {
	
		if( 'undefined' === typeof req.data.edited ) {
			req.data.edited = {};
		}
		//{ meta: { status: 200, msg: 'OK' },
		if( 'undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status ) {
			req.data.edited.tumblr = true;
		} else {
			req.data.edited.tumblr = false;
		}
		
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.edited[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var target_blog = null;
	if( 'undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blogd ) {
		console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
	} else {
		target_blog = req.data.target.tumblr.blog;
		target_id = req.data.target.tumblr.id;
	}
	var url = 'http://api.tumblr.com/v2/blog/' + target_blog + '/post/edit';
	query[ 'id' ]  = target_id;
	var type = req.data.type;

	var token = req.tokens.tumblr;
	var secret = req.secrets.tumblr;

	var postbody = Private.request.querystring( query );
	url = url + '?' + postbody;
	var callback = function( status_code,data ) {

		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}	
	};

	return Private.request.post( Private.service.tumblr, url, token, secret, postbody, null, callback );

};

Private.tumblr.repost = function( req, connection, on_success, on_error ) {
	var own_callback = function( reqdata ) {
	
		if( 'undefined' === typeof req.data.reposted ) {
			req.data.reposted = {};
		}
		//{ meta: { status: 200, msg: 'OK' },
		if( 'undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status ) {
			req.data.reposted.tumblr = true;
		} else {
			req.data.reposted.tumblr = false;
		}
		
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.reposted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var target_blog = null, target_key;
	if( 'undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog ) {
		console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
	} else {
		target_blog = req.data.target.tumblr.blog;
		target_id = req.data.target.tumblr.id;
		target_key = req.data.target.tumblr.key;
	}
	var url = 'http://api.tumblr.com/v2/blog/' + target_blog + '/post/reblog';
	var query = { id: target_id, reblog_key: target_key, comment: ( ( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.text ) ? req.data.text : null ) };
	var type = req.data.type;

	var token = req.tokens.tumblr;
	var secret = req.secrets.tumblr;

	var postbody = Private.request.querystring( query );
	url = url + '?' + postbody;
	var callback = function( status_code,data ) {

		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}	
	};

	return Private.request.post( Private.service.tumblr, url, token, secret, postbody, null, callback );

};

Private.tumblr.trash = function( req, connection, on_success, on_error ) { return false; };

Private.tumblr.trash.revert = function( req, connection, on_success, on_error ) { return false; };

/* Facebook */

Private.facebook = function( req, connection, on_success, on_error ) { return false; };

/* Stream */


Private.facebook.stream = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
		    req.data = null;   
		}
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data.streams = {};
		}

		if( true === req.raw ) {
			req.data.streams.facebook = data;
		} else {
			console.log( "data.data?",data.data);
			var res = [], z = 0, zitem, zlen = data.data.length;
			for( z = 0; z < zlen; z += 1 ) {
				zitem = data.data[ z ];
				if( 'link' === zitem.type   ) {
					if( -1 !== zitem.link.indexOf( 'http://www.facebook.com/notes/' ) ) {
						//note
						res.push( Private.stream.facebook.note.to.activity( zitem ) );
					} else {
						//share
						res.push( Private.stream.facebook.link.to.activity( zitem ) );
					}
				} else if( 'status' === zitem.type ) {
					//status
					res.push( Private.stream.facebook.comment.to.activity( zitem ) );
				}

			}
			req.data.streams.facebook = res;
		}

		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var query;
	var url = 'https://graph.facebook.com/me/home';	

	var token = req.tokens.facebook;
	var secret = req.secrets.facebook;
	
	var callback = function( status_code, data ) {

		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}
	};

	Private.request.get( Private.service.facebook, url, token, callback );

};



Private.facebook.ownStream = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
		    req.data = null;   
		}
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data.streams = {};
		}

		if( true === req.raw ) {
			req.data.streams.facebook = data;
		} else {
			console.log( "data.data?",data.data);
			var res = [], z = 0, zitem, zlen = data.data.length;
			for( z = 0; z < zlen; z += 1 ) {
				zitem = data.data[ z ];
				if( 'link' === zitem.type   ) {
					if( -1 !== zitem.link.indexOf( 'http://www.facebook.com/notes/' ) ) {
						//note
						res.push( Private.stream.facebook.note.to.activity( zitem ) );
					} else {
						//share
						res.push( Private.stream.facebook.link.to.activity( zitem ) );
					}
				} else if( 'status' === zitem.type ) {
					//status
					res.push( Private.stream.facebook.comment.to.activity( zitem ) );
				}

			}
			req.data.streams.facebook = res;
		}

		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var query;
	var url = 'https://graph.facebook.com/me/feed';	

	var token = req.tokens.facebook;
	var secret = req.secrets.facebook;
	
	var callback = function( status_code, data ) {

		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}
	};

	Private.request.get( Private.service.facebook, url, token, callback );

};

Private.facebook.unpost = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( 'undefined' === typeof req.data.deleted ) {
			req.data.deleted = {};
		}
		req.data.deleted.facebook = true;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( 'undefined' === typeof req.data.deleted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	console.log('facebook',req.tokens.twitter);
	console.log('action object',req.data);

	var target_id = null;
	if( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.facebook ) {
       		target_id = req.data.target.facebook.id;
	}
	var query = { 'method': 'delete' }, url = 'https://graph.facebook.com/' + target_id;

	var token = req.tokens.facebook;
	var secret = req.secrets.facebook;

	var postbody = Private.request.querystring( query );
	var callback = function( status_code, data ) {
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		console.log( "FACEBOOK DELETE", JSON.stringify( data ) );
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}	
	};

	return Private.request.post( Private.service.facebook, url, token, secret, postbody, null, callback );




};

Private.facebook.favorite = function( req, connection, invert ) {
	invert = ( true === invert ) ? true : false;
	//https://developers.facebook.com/docs/opengraph/actions/
	var own_callback = function( data ) {
		if( 'undefined' === typeof req.data.favorited ) {
			req.data.favorited = {};
		}
		req.data.favorited.facebook = true;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( 'undefined' === typeof req.data.favorited[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	console.log('facebook',req.tokens.twitter);
	console.log('action object',req.data);

	var target_id = null;
	if( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.facebook ) {
       		target_id = req.data.target.facebook.id;
	}
	var query = {}, url = 'https://graph.facebook.com/' + target_id + '/likes';

	var token = req.tokens.facebook;
	var secret = req.secrets.facebook;

	var postbody = Private.request.querystring( query );
	var callback = function( status_code, data ) {
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		console.log( "FACEBOOK LIKE", JSON.stringify( data ) );
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}	
	};

	if( invert ) {
		return Private.request.delete( Private.service.facebook, url, token, secret, postbody, null, callback );
	} else {
		return Private.request.post( Private.service.facebook, url, token, secret, postbody, null, callback );
	}

};


Private.facebook.unfavorite = function( req, connection, on_success, on_error ) { 
	return Private.facebook.favorite( req, connection, true );
};

Private.facebook.archive = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.archive.revert = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.watch = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.watch.revert = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.read = function( req, connection, on_success, on_error ) {
	var access_token = req.tokens.facebook;	
	console.log('ACCESS TOKEN',access_token);
	return false;
};
Private.facebook.read.revert = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.view = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.view.revert = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.listen = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.listen.revert = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.checkin = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.checkin.revert = function( req, connection, on_success, on_error ) { return false; };

//
Private.facebook.post = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.upstream_duplicates ) {
			req.data.upstream_duplicates = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates.facebook ) {
			req.data.upstream_duplicates.facebook = {};
		}
		req.data.upstream_duplicates.facebook.id = id;
		if( 'undefined' === typeof req.data.upstream_duplicates.local ) {
			req.data.upstream_duplicates.local = {};
		}
		if( 'undefined' !== typeof req.meta && 'undefined' !== typeof req.meta.id ) {
			req.data.upstream_duplicates.local.id = req.meta.id;
		}
		if( 'undefined' === typeof req.data.urls ) {
			req.data.urls = {};
		}
		req.data.upstream_duplicates.facebook.url = url;
		req.data.verb = 'post';
		req.verb = 'publish';
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		console.log( 'facebook checking' );
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( 'undefined' === typeof req.data.upstream_duplicates[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};

	var own_error = function( ) {
		req.data.urls.facebook = false;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( 'undefined' === typeof req.data.upstream_duplicates[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	console.log('facebook',req.tokens.twitter);
	console.log('action object',req.data);

	var target_id = ( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.facebook && 'undefined' !== typeof req.data.target.facebook.id ) ? req.data.target.facebook.id : null;
	var url, query;
	if( 'note' === req.data.type ) {
       		url = 'https://graph.facebook.com/me/notes';
		query = Private.to.facebook.note( req.data );
	} else if( 'comment' === req.data.type ) {

		query = Private.to.facebook.comment( req.data );
		if( null === target_id || 'undefined' === typeof target_id ) {
			url = 'https://graph.facebook.com/me/feed';	
		} else  {
			url = 'https://graph.facebook.com/' + target_id + '/comments';
			delete query.type;
		}


	} else if( 'link' === req.data.type ) {
       		url = 'https://graph.facebook.com/me/links';
		query = Private.to.facebook.link( req.data );
	}

	var token = req.tokens.facebook;
	var secret = req.secrets.facebook;

	console.log('facebook translated object', query );
	var postbody = Private.request.querystring( query );
	var callback = function( status_code, data ) {
		console.log('facebook return data',data);
		console.log('justincase status code',status_code);
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		//
		if( 400 == status_code ) {
			own_error();
			return;
		}	
		var item_id = null;//data.id;
		var item_url = null;//data.html_url;
		var attr, filename;
		console.log('t1',data);
		if( 'undefined' !== typeof data ) {
			console.log('t2', typeof data, data.id, data.url );

			if( 'undefined' !== typeof data.url ) {
				//none here
			}
			if( 'undefined' !== typeof data.id ) {
				var note_item_id = data.id;
				console.log("THE DATA IN t: " + JSON.stringify( data ) );

				var url = 'https://graph.facebook.com/me';	
				Private.request.get( Private.service.facebook, url, token, function( status_code_3, data_3) {

					if( 'string' === typeof data_3 ) {
						if( '' === data_3 ) {
							data_3 = null;
						} else {
							data_3 = JSON.parse( data_3 );
						}
					}
					item_id = data_3.id + '_' + note_item_id;
					if( null === item_url && null !== note_item_id && 'note' === req.data.type ) {
						item_url = 'https://www.facebook.com/note.php?note_id=' + note_item_id;
					}
					console.log( "FACEBOOK ID", item_id, item_url );
					if( 'function' === typeof own_callback ) {
						own_callback( item_id, item_url );
					}

				} );


			}
		};
	
	};

	console.log("DOING POST",typeof Private.service.facebook, url, token, secret, postbody, '', callback);
	//var res = Private.service.facebook._request( "POST", url, {}, postbody, token, callback);
	//Private.request.post = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback ) {

	var res = Private.request.post( Private.service.facebook, url, token, secret, postbody, null, callback );
	//var res = Private.request.get( Private.service.twitter, url, token, secret, callback );
	console.log("RESSSSULT");
	console.log(res);

};

Private.facebook.unpost = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( 'undefined' === typeof req.data.deleted ) {
			req.data.deleted = {};
		}
		req.data.deleted.facebook = true;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( 'undefined' === typeof req.data.deleted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	console.log('facebook',req.tokens.twitter);
	console.log('action object',req.data);

	var target_id = null;
	if( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.facebook ) {
       		target_id = req.data.target.facebook.id;
	}
	var query = { 'method': 'delete' }, url = 'https://graph.facebook.com/' + target_id;

	var token = req.tokens.facebook;
	var secret = req.secrets.facebook;

	var postbody = Private.request.querystring( query );
	var callback = function( status_code, data ) {
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		console.log( "FACEBOOK DELETE", JSON.stringify( data ) );
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}	
	};

	return Private.request.post( Private.service.facebook, url, token, secret, postbody, null, callback );


};

//
Private.facebook.edit = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.edited ) {
			req.data.edited = {};
		}
		req.data.edited.facebook = true;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( 'undefined' === typeof req.data.edited[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	console.log('action object',req.data);

	var query, url = 'https://graph.facebook.com/' + req.data.target.facebook.id;
	if( 'note' === req.data.type ) {
		query = Private.to.facebook.note( req.data );
	} else if( 'comment' === req.data.type ) {
		query = Private.to.facebook.comment( req.data );
	} else if( 'link' === req.data.type ) {
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
			console.log('t2', typeof data, data.id, data.url );
			if( 'undefined' !== typeof data.id ) {
				item_id = data.id;
			}
			if( 'undefined' !== typeof data.url ) {
				//none here
			}
		};
		if( null === item_url && null !== item_id && 'note' === req.data.type ) {
			item_url = 'https://www.facebook.com/note.php?note_id=' + item_id;
		}
		console.log( "FACEBOOK ID", item_id, item_url );
		if( 'function' === typeof own_callback ) {
			own_callback( item_id, item_url );
		}	
	};

	console.log("DOING POST",typeof Private.service.facebook, url, token, secret, postbody, '', callback);
	//var res = Private.service.facebook._request( "POST", url, {}, postbody, token, callback);
	//Private.request.post = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback ) {

	var res = Private.request.post( Private.service.facebook, url, token, secret, postbody, null, callback );
	//var res = Private.request.get( Private.service.twitter, url, token, secret, callback );
	console.log("RESSSSULT");
	console.log(res);

};


Private.facebook.trash = function( req, connection, on_success, on_error ) { return false; };
Private.facebook.trash.revert = function( req, connection, on_success, on_error ) { return false; };

/* Twitter */

/* Implemented: 
 *	- favorite (favorite)
 *	- unfavorite (unfavorite)
 *	- post (tweet) 
 *	- unpost (untweet)
 * */


Private.twitter = function( req, connection, on_success, on_error ) { return false; };

/* Stream */

Private.twitter.stream = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
			req.data = {};	
		} 
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data.streams = {};
		}

		if( true === req.raw ) {
			req.data.streams.twitter = data;
		} else {
			var res = [], z = 0, zitem, zlen = data.length;
			for( z = 0; z < zlen; z += 1 ) {
				zitem = data[ z ];
				res.push( Private.stream.twitter.comment.to.activity( zitem ) );
			}
			req.data.streams.twitter = res;
		}
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var query;
	var url = 'https://api.twitter.com/1/statuses/home_timeline.json?include_entities=true';	

	var token = req.tokens.twitter;
	var secret = req.secrets.twitter;
	
	var callback = function( status_code, data ) {
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}
	};

	Private.request.get( Private.service.twitter, url, token, secret, callback );


};

Private.twitter.favorite = function( req, connection, on_success, on_error ) {
	//https://dev.twitter.com/docs/api/1/post/favorites/create/%3Aid

	var own_callback = function( reqdata ) {
	
		if( 'undefined' === typeof req.data.favorited ) {
			req.data.favorited = {};
		}
		if( 'undefined' !== typeof reqdata.error ) {
			req.data.favorited.twitter = false;
		} else {
			req.data.favorited.twitter = true;
		}
		
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.favorited[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	if( 'comment' === req.data.type ) {
			
		var token = req.tokens.twitter;
		var secret = req.secrets.twitter;
		var target_id = null;
		if( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.twitter ) {
			target_id = req.data.target.twitter.id;
		}

		var callback = function( status_code, data ) {
			if( 'string' === typeof data ) {
				data = JSON.parse( data );
			}
			if( 'function' === typeof own_callback ) {
				own_callback( data );
			}	
		};
	
		var url = 'http://api.twitter.com/1/favorites/create/' + target_id + ".json";
		var query = { id: target_id };
		var postbody = Private.request.querystring( query );

		return Private.request.post( Private.service.twitter, url, token, secret, query, null, callback );
		
	}
};

Private.twitter.unfavorite = function( req, connection, on_success, on_error ) {
	var own_callback = function( reqdata ) {
	
		if( 'undefined' === typeof req.data.unfavorited ) {
			req.data.unfavorited = {};
		}
		if( 'undefined' !== typeof reqdata.error ) {
			req.data.unfavorited.twitter = false;
		} else {
			req.data.unfavorited.twitter = true;
		}
		
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.unfavorited[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	if( 'comment' === req.data.type ) {
			
		var token = req.tokens.twitter;
		var secret = req.secrets.twitter;
		var target_id = null;
		if( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.twitter ) {
			target_id = req.data.target.twitter.id;
		}

		var callback = function( status_code, data ) {
			if( 'string' === typeof data ) {
				data = JSON.parse( data );
			}
			if( 'function' === typeof own_callback ) {
				own_callback( data );
			}	
		};
	
		var url = 'http://api.twitter.com/1/favorites/destroy/' + target_id + ".json";
		var query = { id: target_id };
		var postbody = Private.request.querystring( query );

		return Private.request.post( Private.service.twitter, url, token, secret, query, null, callback );
		
	}

};

Private.twitter.archive = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.archive.revert = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.watch = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.watch.revert = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.read = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.read.revert = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.view = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.view.revert = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.listen = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.listen.revert = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.checkin = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.checkin.revert = function( req, connection, on_success, on_error ) { return false; };

// Supports comment, imageTK types
Private.twitter.post = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.upstream_duplicates ) {
			req.data.upstream_duplicates = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates.twitter ) {
			req.data.upstream_duplicates.twitter = {};
		}
		req.data.upstream_duplicates.twitter.id = id;
		if( 'undefined' === typeof req.data.urls ) {
			req.data.urls = {};
		}
		req.data.urls.twitter = url;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.upstream_duplicates[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	if( 'comment' === req.data.type ) {
		
		var url = 'http://api.twitter.com/1/statuses/update.json';
		
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
			if( 'function' === typeof own_callback ) {
				own_callback( item_id, item_url );
			}	
		};
	
		return Private.request.post( Private.service.twitter, url, token, secret, query, null, callback );
		
	}
};

Private.twitter.unpost = function( req, connection, on_success, on_error ) {
	//https://dev.twitter.com/docs/api/1/post/statuses/destroy/%3Aid
	var own_callback = function( reqdata ) {
	
		if( 'undefined' === typeof req.data.deleted ) {
			req.data.deleted = {};
		}
		if( 'undefined' !== typeof reqdata.error ) {
			req.data.deleted.twitter = false;
		} else {
			req.data.deleted.twitter = true;
		}
		
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.deleted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	if( 'comment' === req.data.type ) {
			
		var token = req.tokens.twitter;
		var secret = req.secrets.twitter;
		var target_id = null;
		if( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.twitter ) {
			target_id = req.data.target.twitter.id;
		}

		var callback = function( status_code, data ) {
			if( 'string' === typeof data ) {
				data = JSON.parse( data );
			}
			if( 'function' === typeof own_callback ) {
				own_callback( data );
			}	
		};
	
		var url = 'http://api.twitter.com/1/statuses/destroy/' + target_id + ".json";
		var query = { id: target_id };
		var postbody = Private.request.querystring( query );

		return Private.request.post( Private.service.twitter, url, token, secret, query, null, callback );
		
	}
};

Private.twitter.edit = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.repost = function( req, connection, on_success, on_error ) {
	//https://dev.twitter.com/docs/api/1/post/statuses/destroy/%3Aid
	var own_callback = function( reqdata ) {
	
		if( 'undefined' === typeof req.data.reposted ) {
			req.data.reposted = {};
		}
		if( 'undefined' !== typeof reqdata.error ) {
			req.data.reposted.twitter = false;
		} else {
			req.data.reposted.twitter = true;
		}
		
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.reposted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
console.log("DOING TWITTER",req.data);	
		
	var token = req.tokens.twitter;
	var secret = req.secrets.twitter;
	var target_id = null;
	if( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.twitter ) {
		target_id = req.data.target.twitter.id;
	}

	var callback = function( status_code, data ) {
		console.log("RETWEET RESPONSE",status_code,data);
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}	
	};

	var url = 'http://api.twitter.com/1/statuses/retweet/' + target_id + ".json";

	return Private.request.post( Private.service.twitter, url, token, secret, null, null, callback );
	
};

Private.twitter.trash = function( req, connection, on_success, on_error ) { return false; };

Private.twitter.trash.revert = function( req, connection, on_success, on_error ) { return false; };

/* Github */

Private.github = function( req, connection, on_success, on_error ) { return false; };

/* Stream */

Private.github.stream = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
		    req.data = null;   
		}
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data.streams = {};
		}
		req.data.streams.github = data;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};

	var query = req.data;
	if( 'undefined' === typeof req || 'undefined' === typeof req.ids || 'undefined' === typeof req.ids.yahoo ) {
		console.log( "Need to pass a data.ids.yahoo string" );
		return;
	}	

	var url_1 = 'https://api.github.com/user';
	var token = req.tokens.github;
	var secret = req.secrets.github;

	var inception = function( status_code_1, data_1 ) {
		if( 'string' === typeof data_1 ) {
			data_1 = JSON.parse( data_1 );
		}
		if( 'string' === typeof status_code_1 ) {
			status_code_1 = JSON.parse( status_code_1 );
		}
		if( 'undefined' !== typeof data_1 ) {
			status_code_1 = data_1.statusCode;
		}
		var user_id = data_1.login;
		var url = 'https://api.github.com/users/' + user_id + '/received_events';	
		var callback = function( status_code, data ) {

			if( 'string' === typeof data ) {
				data = JSON.parse( data );
			}
			if( 'string' === typeof status_code ) {
				status_code = JSON.parse( status_code );
			}
			if( 'undefined' !== typeof data ) {
				status_code = data.statusCode;
			}
			if( 'function' === typeof own_callback ) {
				own_callback( data );
			}
		};
		Private.request.get( Private.service.github, url, token, callback );
	};

	Private.request.get( Private.service.github, url_1, token, inception );


};


Private.github.favorite = function( req, connection, on_success, on_error ) {
	//http://developer.github.com/v3/gists/
	var own_callback = function() {
		if( 'undefined' === typeof req.data.favorited ) {
			req.data.favorited = {};
		}
		req.data.favorited.github = true;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.favorited[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};

	console.log('github',req.tokens.twitter);
	console.log('action object',req.data);
	var query = Private.to.github.note( req.data );
	console.log('translated object',query);
	var target_id = ( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id ) ? req.data.target.github.id : null;
	var url = 'https://api.github.com/gists/' + target_id + '/star';
	var token = req.tokens.github;
	var secret = req.secrets.github;
	var postbody = JSON.stringify( query );
	var callback = function( data ) {
		if( 'function' === typeof own_callback ) {
			own_callback();
		}	
	};

	var contenttype = 'application/json';

	return Private.request.put( Private.service.github, url, token, secret, postbody, contenttype, callback, false );


};

Private.github.unfavorite = function( req, connection, on_success, on_error ) {
	//http://developer.github.com/v3/gists/
	var own_callback = function() {
		if( 'undefined' === typeof req.data.unfavorited ) {
			req.data.unfavorited = {};
		}
		req.data.unfavorited.github = true;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.unfavorited[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};

	console.log('github',req.tokens.twitter);
	console.log('action object',req.data);
	var query = Private.to.github.note( req.data );
	console.log('translated object',query);
	var target_id = ( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id ) ? req.data.target.github.id : null;
	var url = 'https://api.github.com/gists/' + target_id + '/star';
	var token = req.tokens.github;
	var secret = req.secrets.github;
	var postbody = JSON.stringify( query );
	var callback = function( data ) {
		if( 'function' === typeof own_callback ) {
			own_callback();
		}	
	};

	var contenttype = 'application/json';
	return Private.request.delete( Private.service.github, url, token, secret, callback );


};

Private.github.archive = function( req, connection, on_success, on_error ) { return false; };

Private.github.archive.revert = function( req, connection, on_success, on_error ) { return false; };

Private.github.watch = function( req, connection, on_success, on_error ) { return false; };

Private.github.watch.revert = function( req, connection, on_success, on_error ) { return false; };

Private.github.read = function( req, connection, on_success, on_error ) { return false; };

Private.github.read.revert = function( req, connection, on_success, on_error ) { return false; };

Private.github.view = function( req, connection, on_success, on_error ) { return false; };

Private.github.view.revert = function( req, connection, on_success, on_error ) { return false; };

Private.github.listen = function( req, connection, on_success, on_error ) { return false; };

Private.github.listen.revert = function( req, connection, on_success, on_error ) { return false; };

Private.github.checkin = function( req, connection, on_success, on_error ) { return false; };

Private.github.checkin.revert = function( req, connection, on_success, on_error ) { return false; };

Private.github.post = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {

		if( 'undefined' === typeof req.data.upstream_duplicates ) {
			req.data.upstream_duplicates = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates.github ) {
			req.data.upstream_duplicates.github = {};
		}

		req.data.upstream_duplicates.github.id = id;
		req.data.upstream_duplicates.github.url = url;

		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.upstream_duplicates[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			console.log("GIT CHECKING TYPE",typeof on_success);
			if( 'function' === typeof on_success ) {
				console.log("IT WORKED",req);
				on_success( req );
			}
		}
	};

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
		if( 'function' === typeof own_callback ) {
			own_callback( item_id, item_url );
		}	
	};

	var contenttype = 'application/json';

	return Private.request.post( Private.service.github, url, token, secret, postbody, contenttype, callback, false );

};

Private.github.unpost = function( req, connection, on_success, on_error ) {
	//http://developer.github.com/v3/gists/
	var own_callback = function() {
		if( 'undefined' === typeof req.data.unposted ) {
			req.data.unposted = {};
		}
		req.data.unposted.github = true;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.unposted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			console.log("NINE",req);
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};

	console.log('github',req.tokens.twitter);
	console.log('action object',req.data);
	var query = Private.to.github.note( req.data );
	console.log('translated object',query);
	var target_id = ( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id ) ? req.data.target.github.id : null;
	var url = 'https://api.github.com/gists/' + target_id;
	var token = req.tokens.github;
	var secret = req.secrets.github;
	var postbody = JSON.stringify( query );
	var callback = function( data ) {
		if( 'function' === typeof own_callback ) {
			own_callback();
		}	
	};

	var contenttype = 'application/json';
	
	Private.request.delete( Private.service.github, url, token, secret, null, null, callback );

};


Private.github.repost = function( req, connection, on_success, on_error ) {
	//http://developer.github.com/v3/gists/
	var own_callback = function() {
		if( 'undefined' === typeof req.data.reposted ) {
			req.data.reposted = {};
		}
		req.data.reposted.github = true;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.reposted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			console.log("TEN",req);
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};

	console.log('github',req.tokens.twitter);
	console.log('action object',req.data);
	var query = Private.to.github.note( req.data );
	console.log('translated object',query);
	var target_id = ( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id ) ? req.data.target.github.id : null;
	var url = 'https://api.github.com/gists/' + target_id;
	var token = req.tokens.github;
	var secret = req.secrets.github;
	var postbody = JSON.stringify( query );
	var callback = function( data ) {
		if( 'function' === typeof own_callback ) {
			own_callback();
		}	
	};

	var contenttype = 'application/json';

	return Private.request.delete( Private.service.github, url, token, secret, postbody, contenttype, callback, false );

};

Private.github.edit = function( req, connection, on_success, on_error ) {

	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.edited ) {
			req.data.edited = {};
		}
		req.data.edited.github = id;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.edited[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			console.log("ELEVEN",req);
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};

	console.log('github',req.tokens.twitter);
	console.log('action object',req.data);
	var query = Private.to.github.note( req.data );
	console.log('translated object',query);
	var target_id = ( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id ) ? req.data.target.github.id : null; 
	var url = 'https://api.github.com/gists/' + target_id;
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
		if( 'function' === typeof own_callback ) {
			own_callback( item_id, item_url );
		}	
	};

	var contenttype = 'application/json';
	//TODO: PATCH req (lol wtf)
	return Private.request.post( Private.service.github, url, token, secret, postbody, contenttype, callback, false );

};



Private.github.trash = function( req, connection, on_success, on_error ) { return false; };

Private.github.trash.revert = function( req, connection, on_success, on_error ) { return false; };

/* Google */

Private.google = function( req, connection, on_success, on_error ) { return false; };

/* Stream */

Private.google.stream = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
		    req.data = null;   
		}
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data.streams = {};
		}
		req.data.streams.google = data;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var query = req.data;
	var url;
	if( true === query.own ) {
		url = 'https://www.googleapis.com/plus/v1/people/me/activities/public';	
	} else {
		console.log('google only supports reading ones own stream (and other users one by one, which aint going to happen)');
		return false;
	}

	var token = req.tokens.google;
	var secret = req.secrets.google;
	
	var callback = function( status_code, data ) {

		console.log('google return data',data);
		console.log('justincase status code',status_code);
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}
	};

	Private.request.get( Private.service.google, url, token, callback );


};


Private.google.favorite = function( req, connection, on_success, on_error ) { return false; };
Private.google.unfavorite = function( req, connection, on_success, on_error ) { return false; };
Private.google.archive = function( req, connection, on_success, on_error ) { return false; };
Private.google.archive.revert = function( req, connection, on_success, on_error ) { return false; };
Private.google.watch = function( req, connection, on_success, on_error ) { return false; };
Private.google.watch.revert = function( req, connection, on_success, on_error ) { return false; };
Private.google.read = function( req, connection, on_success, on_error ) { return false; };
Private.google.read.revert = function( req, connection, on_success, on_error ) { return false; };
Private.google.view = function( req, connection, on_success, on_error ) { return false; };
Private.google.view.revert = function( req, connection, on_success, on_error ) { return false; };
Private.google.listen = function( req, connection, on_success, on_error ) { return false; };
Private.google.listen.revert = function( req, connection, on_success, on_error ) { return false; };
Private.google.checkin = function( req, connection, on_success, on_error ) { return false; };
Private.google.checkin.revert = function( req, connection, on_success, on_error ) { return false; };
Private.google.post = function( req, connection, on_success, on_error ) { return false; };
Private.google.unpost = function( req, connection, on_success, on_error ) { return false; };
Private.google.edit = function( req, connection, on_success, on_error ) { return false; };
Private.google.trash = function( req, connection, on_success, on_error ) { return false; };
Private.google.trash.revert = function( req, connection, on_success, on_error ) { return false; };

/* Yahoo */

Private.yahoo = function( req, connection, on_success, on_error ) { return false; };

/* Stream */

Private.yahoo.stream = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
		    req.data = null;   
		}
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data.streams = {};
		}
		req.data.streams.yahoo = data;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var query = req.data;
	if( 'undefined' === typeof req || 'undefined' === typeof req.ids || 'undefined' === typeof req.ids.yahoo ) {
		console.log( "Need to pass a data.ids.yahoo string" );
		return false;
	}	
	var user_id = req.ids.yahoo;

	var url = 'http://social.yahooapis.com/v1/user/' + user_id + '/updates?format=json';

	var token = req.tokens.yahoo;
	var secret = req.secrets.yahoo;
	
	var callback = function( status_code, data ) {

		console.log('yahoo return data',data);
		console.log('justincase status code',status_code);
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}
	};

	Private.request.get( Private.service.yahoo, url, token, secret, callback );

};


Private.yahoo.favorite = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.unfavorite = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.archive = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.archive.revert = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.watch = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.watch.revert = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.read = function( req, connection, on_success, on_error ) {
	//http://developer.yahoo.com/social/rest_api_guide/Single-update-resource.html
	return false;
};

Private.yahoo.read.revert = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.view = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.view.revert = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.listen = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.listen.revert = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.checkin = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.checkin.revert = function( req, connection, on_success, on_error ) { return false; };

// Supports comments, links
Private.yahoo.post = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.upstream_duplicates ) {
			req.data.upstream_duplicates = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates.yahoo ) {
			req.data.upstream_duplicates.yahoo = {};
		}
		req.data.upstream_duplicates.yahoo.id = id;
		if( 'undefined' === typeof req.data.urls ) {
			req.data.urls = {};
		}
		req.data.urls.yahoo = url;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.upstream_duplicates[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	if( 'comment' === req.data.type ) {
		var query = Private.to.yahoo.comment( req.data );
		var target_id = '';
		if( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.ids ) {
			target_id = req.data.target.yahoo.id;
		} else {
			console.log('needs a user guid to post to');
			return false;
		}
		var url = 'http://social.yahooapis.com/v1/user/' + target_id + '/profile/status?format=json';
		var token = req.tokens.yahoo;
		var secret = req.secrets.yahoo;
		var postbody = JSON.stringify( query );
		var callback = function( status_code, data ) {
			
			console.log("YAHOO RESPONSE",data);
			var res = Private.request.get( Private.service.yahoo, url, token, secret, function( status2, data2 ) {
				if( 'string' === typeof data2 && '' !== data2 ) {
					console.log("PARSING",data2);
					data2 = JSON.parse( data2 );
				} else {
					if( '' === data2) {
						console.log("EMPTY DATA");
					}
				}
				var item_id2 = null;
				var item_url2 = null;
				//TODO: verify status message is the new one
				if( 'function' === typeof own_callback ) {
					own_callback( item_id2, item_url2 );
				}


			}, { 'Content-Type': 'application/json' } );
		};

		return Private.request.put( Private.service.yahoo, url, token, secret, postbody, 'application/json', callback );
	}
};

Private.yahoo.unpost = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.edit = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.trash = function( req, connection, on_success, on_error ) { return false; };

Private.yahoo.trash.revert = function( req, connection, on_success, on_error ) { return false; };

/* Windows */

Private.windows = function( req, connection, on_success, on_error ) { return false; };

/* Stream */

//not yet supported
Private.windows.stream = function( req, connection, on_success, on_error ) {
	return false;
	/*
	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
		    req.data = null;   
		}
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data.streams = {};
		}
		req.data.streams.windows = data;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var query;
	var url = 'https://graph.windows.com/me/feed';	

	var token = req.tokens.windows;
	var secret = req.secrets.windows;
	
	var callback = function( status_code, data ) {

		console.log('windows return data',data);
		console.log('justincase status code',status_code);
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}
	};

	Private.request.get( Private.service.windows, url, token, callback );
	*/

};


Private.windows.favorite = function( req, connection, on_success, on_error ) { return false; };
Private.windows.unfavorite = function( req, connection, on_success, on_error ) { return false; };
Private.windows.archive = function( req, connection, on_success, on_error ) { return false; };
Private.windows.archive.revert = function( req, connection, on_success, on_error ) { return false; };
Private.windows.watch = function( req, connection, on_success, on_error ) { return false; };
Private.windows.watch.revert = function( req, connection, on_success, on_error ) { return false; };
Private.windows.read = function( req, connection, on_success, on_error ) { return false; };
Private.windows.read.revert = function( req, connection, on_success, on_error ) { return false; };
Private.windows.view = function( req, connection, on_success, on_error ) { return false; };
Private.windows.view.revert = function( req, connection, on_success, on_error ) { return false; };
Private.windows.listen = function( req, connection, on_success, on_error ) { return false; };
Private.windows.listen.revert = function( req, connection, on_success, on_error ) { return false; };
Private.windows.checkin = function( req, connection, on_success, on_error ) { return false; };
Private.windows.checkin.revert = function( req, connection, on_success, on_error ) { return false; };
Private.windows.post = function( req, connection, on_success, on_error ) { 
	
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.upstream_duplicates ) {
			req.data.upstream_duplicates = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates.windows ) {
			req.data.upstream_duplicates.windows = {};
		}
		req.data.upstream_duplicates.windows.id = id;
		if( 'undefined' === typeof req.data.urls ) {
			req.data.urls = {};
		}
		req.data.urls.windows = url;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.upstream_duplicates[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		} else {
			console.log("INCOMPLETE (WINDOWS)",req.data);
		}
	};
	
	var query = null;
	if( 'comment' === req.data.type ) {
		query = Private.to.windows.comment( req.data );
	} else if ( 'link' === req.data.type ) {
		query = Private.to.windows.link( req.data );
	}

	var url = 'https://apis.live.net/v5.0/me/share';
	var token = req.tokens.windows;
	var secret = req.secrets.windows;

	var postbody = JSON.stringify( query );
	var callback = function( data ) {
		console.log("WINRAW",data);
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		console.log("PARSED: " + JSON.stringify( data ) );
		status_code = data.statusCode;
		data = data.data;
		var item_id = data.id;
		var item_url = null;
		console.log( 'WINDOWS',item_id,item_url);
		if( 'function' === typeof own_callback ) {
			own_callback( item_id, item_url );
		}
	};

	return Private.request.post( Private.service.windows, url, token, secret, postbody, 'application/json', callback );

};

/* can't be supported */
Private.windows.unpost = function( req, connection, on_success, on_error ) {

	var own_callback = function( reqdata ) {
	
		if( 'undefined' === typeof req.data.deleted ) {
			req.data.deleted = {};
		}
		if( 'undefined' !== typeof reqdata.error ) {
			req.data.deleted.windows = false;
		} else {
			req.data.deleted.windows = true;
		}
		
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.deleted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	own_callback( null );
	/*
	var target_id = null;
	if( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.facebook ) {
       		target_id = req.data.target.facebook.id;
	}

	var query = { id: target_id };

	var url = 'https://apis.live.net/v5.0/me/share';
	var token = req.tokens.windows;
	var secret = req.secrets.windows;

	var postbody = JSON.stringify( query );
	var callback = function( req, connection, on_success, on_error ) {
		if( 'string' === typeof req ) {
			req = JSON.parse( req, connection );
		}
		var data = req.data;
		var item_id = data.id;
		var item_url = null;
		console.log( 'WINDOWS',item_id,item_url);
		if( 'function' === typeof own_callback ) {
			own_callback( item_id, item_url );
		}
	};

	return Private.request.delete( Private.service.windows, url, token, secret, postbody, 'application/json', callback );
	*/
};
Private.windows.edit = function( req, connection, on_success, on_error ) { return false; };
Private.windows.repost = function( req, connection, on_success, on_error ) { return false; };

Private.windows.trash = function( req, connection, on_success, on_error ) { return false; };
Private.windows.trash.revert = function( req, connection, on_success, on_error ) { return false; };

/* Foursquare */

Private.foursquare = function( req, connection, on_success, on_error ) { return false; };

/* Stream */

Private.foursquare.stream = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
		    req.data = null;   
		}
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data.streams = {};
		}
		if( true === req.raw ) {
			req.data.streams.foursquare = data;
		} else {
			var res = [], z = 0, zitem, zlen = data.response.recent.length;
			for( z = 0; z < zlen; z += 1 ) {
				zitem = data.response.recent[ z ];
				console.log("ZITEM",zitem);
				if( 'checkin' === zitem.type ) {
					//checkin
					res.push( Private.stream.foursquare.checkin.to.activity( zitem ) );
				}

			}
			req.data.streams.foursquare = res;
		}

		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var query;
	var url = 'https://api.foursquare.com/v2/checkins/recent?v=20110301';

	var token = req.tokens.foursquare;
	var secret = req.secrets.foursquare;
	
	var callback = function( status_code, data ) {

		console.log('foursquare return data',data);
		console.log('justincase status code',status_code);
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}
	};

	Private.request.get( Private.service.foursquare, url, token, callback );

};


Private.foursquare.favorite = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.unfavorite = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.archive = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.archive.revert = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.watch = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.watch.revert = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.read = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.read.revert = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.view = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.view.revert = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.listen = function( req, connection, on_success, on_error ) { return false; };
Private.foursquare.listen.revert = function( req, connection, on_success, on_error ) { return false; };

Private.foursquare.checkin = function( req, connection, on_success, on_error ) {
	//https://developer.foursquare.com/docs/checkins/add
	return false;
};

Private.foursquare.checkin.revert = function( req, connection, on_success, on_error ) { return false; };

Private.foursquare.post = function( req, connection, on_success, on_error ) {
	//https://developer.foursquare.com/docs/checkins/addcomment
	//https://developer.foursquare.com/docs/tips/add
	//https://developer.foursquare.com/docs/photos/add
	return false;
};

Private.foursquare.unpost = function( req, connection, on_success, on_error ) {
	//https://developer.foursquare.com/docs/checkins/deletecomment	
	return false;
};

Private.foursquare.trash = function( req, connection, on_success, on_error ) { return false; };

Private.foursquare.trash.revert = function( req, connection, on_success, on_error ) { return false; };

/* Linkedin */

Private.linkedin = function( req, connection, on_success, on_error ) { return false; };

/* Stream */

Private.linkedin.stream = function( req, connection, on_success, on_error ) {

	var own_callback = function( data ) {
		if( null === req.data || 'undefined' === typeof req.data ) {
		    req.data = null;   
		}
		if( null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams ) {
			req.data = ( null === req.data || 'undefined' === typeof req.data ) ? {} : req.data; req.data.streams = {};
		}
		if( true === req.raw ) {
			req.data.streams.linkedin = data;
		} else {
			var res = [], z = 0, zitem, zlen = data.updates.values.length;
			for( z = 0; z < zlen; z += 1 ) {
				zitem = data.updates.values[ z ];
				if(  'undefined' !== typeof zitem.updateContent.person && 'undefined' !== typeof zitem.updateContent.person.currentShare && 'undefined' !== typeof zitem.updateContent.person.currentShare.source &&  'undefined' !== typeof zitem.updateContent.person.currentShare.source.serviceProvider && 'undefined' !== typeof zitem.updateContent.person.currentShare.source.serviceProvider.name && 'TWITTER' !== zitem.updateContent.person.currentShare.source.serviceProvider.name  ) {


					if(  'undefined' !== typeof zitem.updateContent.person && 'undefined' !== typeof zitem.updateContent.person.currentShare && 'undefined' !== typeof zitem.updateContent.person.currentShare.content && 'undefined' !== typeof zitem.updateContent.person.currentShare.content.submittedUrl  ) {
						//link
						res.push( Private.stream.linkedin.link.to.activity( zitem ) );
					} else if( 'undefined' !== typeof zitem.updateContent.person && 'undefined' !== typeof zitem.updateContent.person.currentShare && 'undefined' !== typeof zitem.updateContent.person.currentShare.comment ) {
						//comment (status)
						res.push( Private.stream.linkedin.comment.to.activity( zitem ) );
					} else {
						console.log("UFO >> UNIDTENTIFIED FUCKING OBJET",zitem);
					}
				}

			}
			req.data.streams.linkedin = res;
		}

		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log( 'checking', service );
			if( null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	
	var query;
	var url = 'http://api.linkedin.com/v1/people/~/network?type=SHAR';	

	var token = req.tokens.linkedin;
	var secret = req.secrets.linkedin;
	
	var callback = function( status_code, data ) {

		console.log('linkedin return data',data);
		console.log('justincase status code',status_code);
		if( 'string' === typeof data ) {
			data = JSON.parse( data );
		}
		if( 'string' === typeof status_code ) {
			status_code = JSON.parse( status_code );
		}
		if( 'undefined' !== typeof data ) {
			status_code = data.statusCode;
		}
		if( 'function' === typeof own_callback ) {
			own_callback( data );
		}
	};

	Private.request.get( Private.service.linkedin, url, token, secret, callback, { 'x-li-format': 'json' } );


};


//group posts and social streams
Private.linkedin.favorite = function( req, connection, on_success, on_error ) {
	//https://developer.linkedin.com/documents/groups-api
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.reposted ) {
			req.data.reposted = {};
		}
		req.data.reposted.linkedin = id;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.reposted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	//https://developer.linkedin.com/documents/share-api

	console.log('linkedin',req.tokens.linkedin);
	console.log('action object',req.data);
	var query;
	var url;
	var target_id = ( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.linkedin && 'undefined' !== typeof req.data.target.linkedin.id ) ? req.data.target.linkedin.id : null; 

	if( 'comment' === req.data.type || 'link' === req.data.type ) {
		url = 'http://api.linkedin.com/v1/posts/' + target_id + '/relation-to-viewer/is-liked';
	} else {
		return false;
	}

	query = true;

	var token = req.tokens.linkedin;
	var secret = req.secrets.linkedin;
	var postbody = JSON.stringify( query );
	
	var callback = function( status_code, data ) {
	
		if( 'string' === typeof data ) {
			if( '' === data.replace(/\s/g, '' ) ) {
				data = null;
			} else {
				if( data.match( '<error>' ) ) {
					if( 'function' === typeof own_callback ) {
						return own_callback( null, null );
					}	
				} else {
					data = JSON.parse( data );
				}
			}
		}

		if( 'function' === typeof own_callback ) {
			console.log(req.callback);
			return own_callback( item_id, item_url );
		}	

	};

	Private.request.put( Private.service.linkedin, url, token, secret, postbody, 'application/json', callback, { 'x-li-format': 'json' } );


};

Private.linkedin.unfavorite = function( req, connection, on_success, on_error ) {
	//https://developer.linkedin.com/documents/groups-api
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.reposted ) {
			req.data.reposted = {};
		}
		req.data.reposted.linkedin = id;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.reposted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	//https://developer.linkedin.com/documents/share-api

	console.log('linkedin',req.tokens.linkedin);
	console.log('action object',req.data);
	var query;
	var url;
	var target_id = ( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.linkedin && 'undefined' !== typeof req.data.target.linkedin.id ) ? req.data.target.linkedin.id : null; 

	if( 'comment' === req.data.type || 'link' === req.data.type ) {
		url = 'http://api.linkedin.com/v1/posts/' + target_id + '/relation-to-viewer/is-liked';
	} else {
		return false;
	}

	query = false;

	var token = req.tokens.linkedin;
	var secret = req.secrets.linkedin;
	var postbody = JSON.stringify( query );
	
	var callback = function( status_code, data ) {
	
		if( 'string' === typeof data ) {
			if( '' === data.replace(/\s/g, '' ) ) {
				data = null;
			} else {
				if( data.match( '<error>' ) ) {
					if( 'function' === typeof own_callback ) {
						return own_callback( null, null );
					}	
				} else {
					data = JSON.parse( data );
				}
			}
		}

		if( 'function' === typeof own_callback ) {
			console.log(req.callback);
			return own_callback( item_id, item_url );
		}	

	};

	Private.request.put( Private.service.linkedin, url, token, secret, postbody, 'application/json', callback, { 'x-li-format': 'json' } );

};

Private.linkedin.archive = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.archive.revert = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.watch = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.watch.revert = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.read = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.read.revert = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.view = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.view.revert = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.listen = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.listen.revert = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.checkin = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.checkin.revert = function( req, connection, on_success, on_error ) { return false; };


// Supports note (group post), comment (status) and link
Private.linkedin.post = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.upstream_duplicates ) {
			req.data.upstream_duplicates = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates.linkedin ) {
			req.data.upstream_duplicates.linkedin = {};
		}
		req.data.upstream_duplicates.linkedin.id = id;
		req.data.upstream_duplicates.linkedin.url = url;
		if( 'undefined' !== typeof req.meta && 'undefined' !== typeof req.meta.id ) {
			if( 'undefined' === typeof req.data.upstream_duplicates.local ) {
				req.data.upstream_duplicates.local = {};
			}
			req.data.upstream_duplicates.local.id = req.meta.id;
		}
		req.data.verb = 'post';
		req.verb = 'publish';
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		console.log("DEPS",req.data.upstream_duplicates);
		console.log("TADA SERCICES",xlen,req.services);
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			console.log('forloopchecking',x,service,req.data.upstream_duplicates[ service ] );
			console.log("YES COMPLETE? " + (( true === complete )?'yes':'no'));

			if( 'undefined' === typeof req.data.upstream_duplicates[ service ] ) {
				complete = false;
			}
		}
		console.log("FINAL COMPLETE? " + (( true === complete )?'yes':'no'));
		if( complete ) {
			var return_obj = {
				object: req.data
				, generator: {
					id: 'newsgregator'
				}
				, verb: 'publish'
			};
			if( 'function' === typeof on_success ) { on_success( return_obj ); }
		}
	};
	//https://developer.linkedin.com/documents/share-api

	//http://msdn.microsoft.com/en-us/library/hh243648.aspx#activity
	console.log('linkedin',req.tokens.linkedin);
	console.log('action object',req.data);
	var query;
	var url;

	if( 'comment' === req.data.type ) {
		query = Private.to.linkedin.comment( req.data );
		url = 'http://api.linkedin.com/v1/people/~/shares';
	} else if ( 'link' === req.data.type ) {
		query = Private.to.linkedin.link( req.data );
		url = 'http://api.linkedin.com/v1/people/~/shares';
	} else if ( 'note' === req.data.type ) {
		console.log('is there a target id?', req.data.target );
		if( 'undefined' === typeof req.data.target
		|| 'undefined' === typeof req.data.target.linkedin
		|| 'undefined' === typeof req.data.target.linkedin.group ) {
			console.log('must defined a linkedin target "group"',req);
			return false;
		}
		query = Private.to.linkedin.note( req.data );
		url = 'http://api.linkedin.com/v1/groups/' + req.data.target.linkedin.group + '/posts';
	}

	var token = req.tokens.linkedin;
	var secret = req.secrets.linkedin;
	var postbody = JSON.stringify( query );
	
	var callback = function( status_code, data ) {
		if( 'string' === typeof data ) {
			if( '' === data.replace(/\s/g, '' ) ) {
				data = null;
			} else {
				if( data.match( '<error>' ) ) {
					if( 'function' === typeof own_callback ) {
						return own_callback( null, null );
					}	
				} else {
					data = JSON.parse( data );
				}
			}
		}
		var item_id = null;
		var item_url = null;
		if ( 'note' === req.data.type ) {
			var url2 = 'http://api.linkedin.com/v1/groups/' + req.data.target.linkedin.group + '/posts:(site-group-post-url,id,creation-timestamp,title,summary,creator:(first-name,last-name,picture-url,headline),likes,attachment:(image-url,content-domain,content-url,title,summary),relation-to-viewer)?category=discussion&order=recency&count=5';
			var res2 = Private.request.get( Private.service.linkedin, url2, token, secret, function( status_code2, data2 ) {
				if( 'string' === typeof data2 ) {
					data2 = JSON.parse( data2 );
				}
				if( 400 == data2.status ) {
					console.log("ERROR",data2);
					return;
				}
				var x = 0, xlen = data2.values.length, item;
				for( x = 0; x < xlen; x += 1 ) {
					item = data2.values[ x ];
					var orig = req.data.title;;
					var newer = item.title;
					if( newer === orig ) {
						item_id = item.id;
						item_url = item.siteGroupPostUrl;
						break;
					}
				}
				console.log("LINKEDIN GROUP POST", item_id, item_url );
				if( 'function' === typeof own_callback ) {
					return own_callback( item_id, item_url );
				}	
			}, { 'x-li-format': 'json' } );
		} else {
			var url2 = 'http://api.linkedin.com/v1/people/~/network/updates?scope=self&type=SHAR';
			var res2 = Private.request.get( Private.service.linkedin, url2, token, secret, function( status_code2, data2 ) {
				if( 'string' === typeof data2 ) {
					data2 = JSON.parse( data2 );
				}
				var x = 0, xlen = data2.values.length, item;
				for( x = 0; x < xlen; x += 1 ) {
					item = data2.values[ x ];
					var orig = req.data.text.split( ' ' )[ 0 ];
					var newer = item.updateContent.person.currentShare.comment.split( ' ' )[ 0 ];
					if( newer === orig ) {
						item_id = item.updateContent.person.currentShare.id;
						break;
					}
				}
				console.log("LINKEDIN SHARE", item_id, item_url );

				if( 'function' === typeof own_callback ) {
					console.log(req.callback);
					return own_callback( item_id, item_url );
				}	
			}, { 'x-li-format': 'json' } );
		}
	};

	Private.request.post( Private.service.linkedin, url, token, secret, postbody, 'application/json', callback, { 'x-li-format': 'json' } );

};

Private.linkedin.unpost = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.repost = function( req, connection, on_success, on_error ) {
	var own_callback = function( id, url ) {
		if( 'undefined' === typeof req.data.reposted ) {
			req.data.reposted = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates ) {
			req.data.upstream_duplicates = {};
		}
		if( 'undefined' === typeof req.data.upstream_duplicates.local ) {
			req.data.upstream_duplicates.local = {};
		}
		if( 'undefined' !== typeof req.meta && 'undefined' !== typeof req.meta.id ) {
			req.data.upstream_duplicates.local.id = req.meta.id;
		}
		req.data.verb = 'repost';
		req.verb = 'publish';
		req.data.reposted.linkedin = id;
		var x = 0, xlen = req.services.length, service;
		var complete = true;
		for( x = 0; x < xlen; x += 1 ) {
			service = req.services[ x ];
			if( 'undefined' === typeof req.data.reposted[ service ] ) {
				complete = false;
			}
		}
		if( complete ) {
			if( 'function' === typeof on_success ) { on_success( req ); }
		}
	};
	//https://developer.linkedin.com/documents/share-api

	console.log('linkedin',req.tokens.linkedin);
	console.log('action object',req.data);
	var query;
	query.meta = req.meta;
	var url;

	if( 'comment' === req.data.type || 'link' === req.data.type ) {
		url = 'http://api.linkedin.com/v1/people/~/shares';
	} else {
		return false;
	}

	var target_id = ( 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.linkedin && 'undefined' !== typeof req.data.target.linkedin.id ) ? req.data.target.linkedin.id : null; 

	query.attribution = { id: target_id, comment: ( ( 'undefined' !== typeof req.data && 'undefined' !== typeof req.data.text ) ? req.data.text : null ) };

	var token = req.tokens.linkedin;
	var secret = req.secrets.linkedin;
	var postbody = JSON.stringify( query );
	
	var callback = function( status_code, data ) {
	
		if( 'string' === typeof data ) {
			if( '' === data.replace(/\s/g, '' ) ) {
				data = null;
			} else {
				if( data.match( '<error>' ) ) {
					if( 'function' === typeof own_callback ) {
						return own_callback( null, null );
					}	
				} else {
					data = JSON.parse( data );
				}
			}
		}

		if( 'function' === typeof own_callback ) {
			return own_callback( item_id, item_url );
		}	

	};

	Private.request.post( Private.service.linkedin, url, token, secret, postbody, 'application/json', callback, { 'x-li-format': 'json' } );

};

Private.linkedin.edit = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.trash = function( req, connection, on_success, on_error ) { return false; };

Private.linkedin.trash.revert = function( req, connection, on_success, on_error ) { return false; };

/* */
/* End Services */
/* */

var Public = function() {

};

Public.prototype.request = function( request, connection, type ) {

	if( 'socket' === type ) {
		var error = function( err ) {
			connection.emit( Private.prefix, { 'Error': 'Something went awry with the request' } );
		}
		var success = function( response ) {
			connection.emit( Private.prefix, response );
		}
		Private.do( request, connection, null, success, error );
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


Public.prototype.stream = function( req, connection, on_success, on_error ) {
	return Private.stream( req, connection );
};

Public.prototype.favorite = function( req, connection, on_success, on_error ) {
	return Private.favorite( req, connection );
};

Public.prototype.unfavorite = function( req, connection, on_success, on_error ) {
	return Private.favorite( req, connection, true );
};

Public.prototype.archive = function( req, connection, on_success, on_error ) {
	return Private.archive( req, connection );
};

Public.prototype.unarchive = function( req, connection, on_success, on_error ) {
	return Private.archive( req, connection, true );
};

Public.prototype.watch = function( req, connection, on_success, on_error ) {
	return Private.watch( req, connection );
};

Public.prototype.unwatch = function( req, connection, on_success, on_error ) {
	return Private.watch( req, connection, true );
};

Public.prototype.read = function( req, connection, on_success, on_error ) {
	return Private.read( req, connection );
};

Public.prototype.unread = function( req, connection, on_success, on_error ) {
	return Private.read( req, connection, true );
};

Public.prototype.view = function( req, connection, on_success, on_error ) {
	return Private.view( req, connection );
};

Public.prototype.unview = function( req, connection, on_success, on_error ) {
	return Private.view( req, connection, true );
};

Public.prototype.listen = function( req, connection, on_success, on_error ) {
	return Private.listen( req, connection );
};

Public.prototype.unlisten = function( req, connection, on_success, on_error ) {
	return Private.listen( req, connection, true );
};

Public.prototype.checkin = function( req, connection, on_success, on_error ) {
	return Private.checkin( req, connection );
};

Public.prototype.uncheckin = function( req, connection, on_success, on_error ) {
	return Private.checkin( req, connection, true );
};

Public.prototype.post = function( req, connection, on_success, on_error ) {
	return Private.post( req, connection );
};

Public.prototype.unpost = function( req, connection, on_success, on_error ) {
	return Private.post( req, connection, true );
};

Public.prototype.trash = function( req, connection, on_success, on_error ) {
	return Private.trash( req, connection );
};

Public.prototype.untrash = function( req, connection, on_success, on_error ) {
	return Private.trash( req, connection, true );
};

/* Action Stream */

Private.utils = Private.utils || {};
Private.utils.toSlug = function( value ) {
	return value.replace(/[^a-zA-Z0-9-_]+/g, "");
};

Private.stream = Private.stream || {};

Private.stream.facebook = Private.stream.facebook || {};
Private.stream.facebook.comment = Private.stream.facebook.comment || {};
Private.stream.facebook.comment.to = Private.stream.facebook.comment.to || {};

//Facebook comment (status)
Private.stream.facebook.comment.to.activity = function( data ) {

	var request = {
		//'object_url': null,
		'actor_display_name': data.from.name,
		'actor_id': data.from.id,
		'actor_image_url': 'https://graph.facebook.com/' + data.from.id + '/picture',
		'object_id': data.id,
		'object_content': data.message,
		'object_object_type': 'comment',
		'verb': 'post',
		'object_published': data.created_time,
		'object_updated': data.updated_time,
		'object_url': data.link,
		'provider_display_name': 'Facebook',
		'provider_id': 'facebook'
	};
	
	var activ = AS.activity( request );
	return activ;
};


Private.stream.facebook.link = Private.stream.facebook.link || {};
Private.stream.facebook.link.to = Private.stream.facebook.link.to || {};

Private.stream.facebook.link.to.activity = function( data ) {
	
	var request = {
		//'object_url': null,
		'actor_display_name': data.from.name,
		'actor_id': data.from.id,
		'actor_image_url': 'https://graph.facebook.com/' + data.from.id + '/picture',
		'object_id': data.id,
		'object_display_name': data.name,
		'object_summary': data.description,
		'object_content': data.message,
		'object_image_url': data.picture,
		'object_object_type': 'link',
		'verb': 'post',
		'object_published': data.created_time,
		'object_updated': data.updated_time,
		'object_url': data.link,
		'provider_display_name': 'Facebook',
		'provider_id': 'facebook'
	};
	
	var activ = AS.activity( request );
	return activ;
};


Private.stream.facebook.note = Private.stream.facebook.note || {};
Private.stream.facebook.note.to = Private.stream.facebook.note.to || {};

Private.stream.facebook.note.to.activity = function( data ) {
	
	var request = {
		//'object_url': null,
		'actor_display_name': data.from.name,
		'actor_id': data.from.id,
		'actor_image_url': 'https://graph.facebook.com/' + data.from.id + '/picture',
		'object_id': data.id,
		'object_display_name': data.name,
		'object_summary': data.description,
		'object_image_url': data.picture,
		'object_object_type': 'note',
		'verb': 'post',
		'object_published': data.created_time,
		'object_updated': data.updated_time,
		'object_url': data.link,
		'provider_display_name': 'Facebook',
		'provider_id': 'facebook'
	};
	console.log("FACEBOOK IN", request);
	var activ = AS.activity( request );
	console.log("FACEBOOK OUT",request);
	return activ;
};






Private.stream.twitter = Private.stream.twitter || {};
Private.stream.twitter.comment = Private.stream.twitter.comment || {};
Private.stream.twitter.comment.to = Private.stream.twitter.comment.to || {};

Private.stream.twitter.comment.to.activity = function( data ) {
	if( !data || "undefined" === typeof data.user || 'undefined' !== typeof data.delete && 'undefined' !== typeof data.scrub_geo || 'undefined' !== typeof data.limit ) {
		return;
	}
	var request = {
		'object_url': "http://twitter.com/#!/" + data.user.screen_name.toLowerCase() + "/status/" + data.id_str,
		'actor_display_name': data.user.name,
		'actor_id': data.user.screen_name,
		'actor_image_url': data.user.profile_image_url,
		'actor_url': data.user.url,
		'actor_summary': data.user.description,
		'object_id': data.id_str,
		'object_content': data.text,
		'object_object_type': 'comment',
		'verb': 'post',
		'object_published': data.created_at,
		'object_url': "http://twitter.com/#!/" + data.user.screen_name + "/status/" + data.id_str,
		'provider_display_name': 'Twitter',
		'provider_id': 'twitter',
		'object_entities': data.tweet_entities, //extension
	};
	
	//If a retweet or reply, add a target

	if( !!data.retweeted_status ) {
		request['verb'] = 'retweet';
		request['target_id'] = data.retweeted_status.user.screen_name;
		request['target_display_name'] = data.retweeted_status.user.name;
		request['target_image_url'] = data.retweeted_status.user.profile_image_url;
		request['target_url'] = data.retweeted_status.user.url;
		request['target_content'] = data.retweeted_status.text;
	} else if( null !== data.in_reply_to_user_id_str ) {
		request['target_id'] = data.in_reply_to_user_id_str;
		request['target_display_name'] = data.in_reply_to_user_id_str;
	}	
	var activ = AS.activity( request );
	return activ;
};


Private.stream.tumblr = Private.stream.tumblr || {};
Private.stream.tumblr.comment = Private.stream.tumblr.comment || {};
Private.stream.tumblr.comment.to = Private.stream.tumblr.comment.to || {};

//Tumblr comment (status)
Private.stream.tumblr.comment.to.activity = function( data ) {
	return false;
};

Private.stream.tumblr.image = Private.stream.tumblr.image || {};
Private.stream.tumblr.image.to = Private.stream.tumblr.image.to || {};
Private.stream.tumblr.image.to.activity = function( data ) {
	return false;//TODO: type: photo
};

Private.stream.tumblr.video = Private.stream.tumblr.image || {};
Private.stream.tumblr.video.to = Private.stream.tumblr.image.to || {};
Private.stream.tumblr.video.to.activity = function( data ) {
	return false;//TODO: type: video
};



Private.stream.tumblr.link = Private.stream.tumblr.link || {};
Private.stream.tumblr.link.to = Private.stream.tumblr.link.to || {};

Private.stream.tumblr.link.to.activity = function( data ) {
	
	var request = {
		'actor_display_name': data.blog_name,
		'actor_id': data.blog_name,
		'object_id': data.id,
		'object_attachments': [ { 'key': 'reblog_key', 'value': data.reblog_key } ],
		'object_url': data.post_url,
		'object_display_name': data.title,
		'object_summary': data.description,
		'object_object_type': 'link',
		'verb': 'post',
		'object_published': data.date,
		'provider_display_name': 'Tumblr',
		'provider_id': 'tumblr'
	};
	
	var activ = AS.activity( request );
	return activ;
};


Private.stream.tumblr.note = Private.stream.tumblr.note || {};
Private.stream.tumblr.note.to = Private.stream.tumblr.note.to || {};

//Tumblr note (text post)
Private.stream.tumblr.note.to.activity = function( data ) {
	
	var request = {
		'actor_display_name': data.blog_name,
		'actor_id': data.blog_name,
		'object_id': data.id,
		'object_attachments': [ { 'key': 'reblog_key', 'value': data.reblog_key } ],
		'object_url': data.post_url,
		'object_display_name': data.title,
		'object_content': data.body,
		'object_object_type': 'note',
		'verb': 'post',
		'object_published': data.date,
		'provider_display_name': 'Tumblr',
		'provider_id': 'tumblr'
	};

	var activ = AS.activity( request );
	return activ;
};

Private.stream.github = Private.stream.github || {};
Private.stream.github.comment = Private.stream.github.comment || {};
Private.stream.github.comment.to = Private.stream.github.comment.to || {};

Private.stream.github.comment.to.activity = function( data ) {
	if( !data || "undefined" === typeof data.user || 'undefined' !== typeof data.delete && 'undefined' !== typeof data.scrub_geo || 'undefined' !== typeof data.limit ) {
		return;
	}
	var request = {
		'object_url': "http://github.com/#!/" + data.user.screen_name.toLowerCase() + "/status/" + data.id_str,
		'actor_display_name': payload.commits[ 0 ].author.name || data.actor.login,
		'actor_id': data.actor.login,
		'actor_image_url': 'https://secure.gravatar.com/avatar/' + data.actor.gravatar_id + '?d=https://a248.e.akamai.net/assets.github.com/images/gravatars/gravatar-140.png',
		'actor_url': data.user.url,
		'actor_summary': data.user.description,
		'object_id': data.id,
		'object_summary': data.payoad.commits[ 0 ].message,
		'object_object_type': data.type,
		'verb': 'post',
		'object_published': data.created_at,
		'object_url': "http://github.com/#!/" + data.user.screen_name + "/status/" + data.id_str,
		'target_id': data.repo.id,
		'target_display_name': data.repo.name,
		'target_url': data.repo.url,
		'provider_display_name': 'Github',
		'provider_id': 'github'
	};
	
	//If a retweet or reply, add a target

	if( !!data.retweeted_status ) {
		request['verb'] = 'retweet';
		request['target_id'] = data.retweeted_status.user.screen_name;
		request['target_display_name'] = data.retweeted_status.user.name;
		request['target_image_url'] = data.retweeted_status.user.profile_image_url;
		request['target_url'] = data.retweeted_status.user.url;
		request['target_content'] = data.retweeted_status.text;
	} else if( null !== data.in_reply_to_user_id_str ) {
		request['target_id'] = data.in_reply_to_user_id_str;
		request['target_display_name'] = data.in_reply_to_user_id_str;
	}	
	var activ = AS.activity( request );
	return activ;
};


Private.stream.linkedin = Private.stream.linkedin || {};
Private.stream.linkedin.link = Private.stream.linkedin.link || {};
Private.stream.linkedin.link.to = Private.stream.linkedin.link.to || {};

Private.stream.linkedin.link.to.activity = function( data ) {
	
	var request = {
		'actor_display_name': data.updateContent.person.currentShare.author.firstName + ' ' +  data.updateContent.person.currentShare.author.lastName,
		'actor_description': data.updateContent.person.currentShare.author.headline,
		'actor_id': data.updateContent.person.currentShare.author.id,
		'author_url': data.updateContent.person.siteStandardProfileRequest.url,
		'object_id': data.updateContent.person.currentShare.id,
		'object_url': data.updateContent.person.currentShare.content.submittedUrl,
		'object_display_name': data.updateContent.person.currentShare.content.title,
		'object_description': data.updateContent.person.currentShare.content.description,
		'object_content': data.updateContent.person.currentShare.comment,
		'object_image_url': data.updateContent.person.currentShare.content.submittedImageUrl,
		'object_object_type': 'link',
		'verb': 'post',
		'object_published': data.updateContent.person.currentShare.timestamp,
		'provider_display_name': 'Linkedin',
		'provider_id': 'linkedin'
	};
	
	var activ = AS.activity( request );
	return activ;
};


Private.stream.linkedin.comment = Private.stream.linkedin.comment || {};
Private.stream.linkedin.comment.to = Private.stream.linkedin.comment.to || {};

//Linkedin comment (status update)
Private.stream.linkedin.comment.to.activity = function( data ) {
	
	var request = {
		'actor_display_name': data.updateContent.person.currentShare.author.firstName + ' ' +  data.updateContent.person.currentShare.author.lastName,
		'actor_description': data.updateContent.person.currentShare.author.headline,
		'actor_id': data.updateContent.person.currentShare.author.id,
		'actor_url': data.updateContent.person.siteStandardProfileRequest.url,
		'object_id': data.updateContent.person.currentShare.id,
		'object_content': data.updateContent.person.currentShare.comment,
		'object_object_type': 'comment',
		'verb': 'post',
		'object_published': data.updateContent.person.currentShare.timestamp,
		'provider_display_name': 'Linkedin',
		'provider_id': 'linkedin'
	};

	var activ = AS.activity( request );
	return activ;
};


Private.stream.foursquare = Private.stream.foursquare || {};
Private.stream.foursquare.checkin = Private.stream.foursquare.checkin || {};
Private.stream.foursquare.checkin.to = Private.stream.foursquare.checkin.to || {};

//Linkedin comment (status update)
Private.stream.foursquare.checkin.to.activity = function( data ) {
	
	var request = {
		'actor_display_name': data.user.firstName + ' ' +  data.user.lastName,
		'actor_description': data.user.homeCity,
		'actor_id': data.user.id,
		'actor_image_url': data.user.photo,
		'actor_url': data.user.canonicalUrl,
		'object_id': data.id,
		'object_content': data.shout,
		'target_id': data.venue.id,
		'target_display_name': data.venue.name,
		'object_object_type': 'checkin',
		'verb': 'post',
		'object_published': data.createdAt,
		'provider_display_name': 'Foursquare',
		'provider_id': 'foursquare'
	};

	var activ = AS.activity( request );
	return activ;
};

// Public API
module.exports = new Public();

var OAuth = require("oauth").OAuth,
    OAuth2 = require("oauth").OAuth2,
    OAuthUtils = require('oauth/lib/_utils.js'),
    querystring = require("querystring"),
    AS = require("node-as");

var Private = function () {

};

Private.prefix = 'press';

Private.service = function (service) {
    if ('undefined' !== typeof Private.service[service]) {
        return Private.service[service];
    }
    return null;
};

Private.to = function (type) {
    if ('undefined' !== typeof Private.to[type]) {
        return Private.to[type];
    }
    return null;
};

Private.to.facebook = {};
Private.to.twitter = {};
Private.to.google = {};
Private.to.tumblr = {};
Private.to.linkedin = {};
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

Private.to.facebook.note = function (note) {

    return {
        subject: (Private.emptyPath('title', note)) ? null : note.title,
        message: (Private.emptyPath('text', note)) ? null : note.text,
        type: 'note'
    };

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

Private.to.facebook.comment = function (comment) {

    /* comment in reply to an object (post, event, etc.)
     return {
     message: comment.text
     , type: 'comment'
     };*/
    /* xxx */
    return {
        message: (Private.emptyPath('text', comment)) ? null : comment.text,
        type: 'status'
    };


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

Private.to.facebook.link = function (link) {
    return {
        link: (Private.emptyPath('link.url', link)) ? null : link.link.url,
        name: (Private.emptyPath('title', link)) ? null : link.title,
        description: (Private.emptyPath('description', link)) ? null : link.description,
        caption: (Private.emptyPath('source.name', link)) ? null : link.source.name,
        picture: (Private.emptyPath('thumbnail.url', link)) ? null : link.thumbnail.url,
        message: (Private.emptyPath('text', link)) ? null : link.text,
        type: 'link'
    };

};


/* Facebook audio model:
 *
 * {
 *	N/A
 * }
 *
 * */

Private.to.facebook.audio = function (audio) {
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

Private.to.facebook.video = function (video) {
    return {
        name: video.title,
        description: video.description,
        picture: video.thumbnail.link.url,
        source: video.source.link.url,
        'type': video
    };

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

Private.to.facebook.image = function (image) {
    return {
        message: image.title,
        source: null //TODO: Support multipart form data
        ,
        'type': 'photo'
    };

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

Private.to.facebook.person = function (person) {
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

Private.to.facebook.organization = function (organization) {
    return {
        id: (Private.emptyPath('ids.facebook', organization)) ? null : organization.ids.facebook,
        link: (Private.emptyPath('link.url', organization)) ? null : organization.link.url,
        icon: (Private.emptyPath('thumbnail.link.url', organization)) ? null : organization.thumbnail.link.url,
        name: (Private.emptyPath('name', organization)) ? null : organization.name,
        description: (Private.emptyPath('description', organization)) ? null : organization.description
    };

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

Private.to.facebook.entity = function () {
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

Private.to.facebook.checkin = function (checkin) {
    return {
        coordinates: {
            latitude: (Private.emptyPath('location.latitude', checkin)) ? null : checkin.location.latitude,
            longitude: (Private.emptyPath('location.longitude', checkin)) ? null : checkin.location.longitude
        },
        place: (Private.emptyPath('location.ids.facebook', checkin)) ? null : checkin.location.ids.facebook,
        message: (Private.emptyPath('text', checkin)) ? null : checkin.text,
        picture: (Private.emptyPath('image.link.url', checkin)) ? null : checkin.image.link.url,
        tags: null //TODO: Allow tagging, esp own UID?
        ,
        type: 'checkin'
    };

};


/* Twitter */

/*
 * Twitter note model:
 * {
 * 	N/A
 * }
 *
 * */

Private.to.twitter.note = function (note) {
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
Private.to.twitter.comment = function (comment) {
    if ('undefined' !== typeof comment.image && null !== comment.image) {
        return false; //TODO: support update_with_media via multipart uploads
        //https://github.com/felixge/node-formidable will do the trick nicely
        //https://dev.twitter.com/docs/api/1/post/statuses/update_with_media
    } else {
        return {
            status: (Private.emptyPath('text', comment)) ? null : comment.text,
            in_reply_to_status_id: (Private.emptyPath('target.ids.twitter', comment)) ? null : comment.target.ids.twitter,
            lat: (Private.emptyPath('location.latitude', comment)) ? null : comment.location.latitude,
            long: (Private.emptyPath('location.longitude', comment)) ? null : comment.location.longitude,
            place_id: (Private.emptyPath('location.ids.twitter', comment)) ? null : comment.location.ids.twitter,
            display_coordinates: 'false' //no thanks on a pin at exact location
            ,
            trim_user: 'false' //don't return only status author's numerical id
            ,
            include_entities: 'true' //add an entities node w/tweet metadata
        }; //true/false need to be strings else broken sigs
    }
};

/* Twitter link model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.twitter.link = function (link) {
    return false;
};


/* Twitter audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.twitter.audio = function (audio) {
    return false;
};

/* Twitter video model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.twitter.video = function (video) {
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

Private.to.twitter.image = function (image) {
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

Private.to.twitter.person = function (person) {
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

Private.to.twitter.organization = function (organization) {
    return {
        id: (Private.emptyPath('ids.twitter', organization)) ? null : organization.ids.facebook,
        uri: (Private.emptyPath('link.url', organization)) ? null : organization.link.url,
        mode: "public",
        icon: (Private.emptyPath('thumbnail.link.url', organization)) ? null : organization.thumbnail.link.url,
        name: (Private.emptyPath('name', organization)) ? null : organization.name,
        description: (Private.emptyPath('description', organization)) ? null : organization.description
    };
};


/* Twitter entity (page) model:
 * {
 * 	N/A
 * }
 *
 * */

Private.to.twitter.entity = function (entity) {
    return false;
};


/* Twitter checkin model
 * {
 * 	N/A
 * }
 *
 * */

Private.to.twitter.checkin = function (checkin) {
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
Private.to.tumblr.note = function (note) {
    return {
        body: (Private.emptyPath('text', note)) ? null : note.text,
        title: (Private.emptyPath('title', note)) ? null : note.title,
        type: 'text'
    };

};

/* Tumblr comment (reblog) model:
 *
 * { id: number
 * , reblog_key: number
 * , comment: string
 * }
 *
 * */
Private.to.tumblr.comment = function (comment) {
    return {
        reblog_key: (Private.emptyPath('target.ids.tumblr', comment)) ? null : comment.target.ids.tumblr,
        comment: (Private.emptyPath('text', comment)) ? null : comment.text,
        type: (Private.emptyPath('type', comment)) ? null : comment.type
    };

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
Private.to.tumblr.link = function (link) {
    return {
        title: (Private.emptyPath('title', link)) ? null : link.title,
        url: (Private.emptyPath('url', link)) ? null : link.url,
        description: (Private.emptyPath('description', link)) ? null : link.description,
        type: 'link'
    };

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
Private.to.tumblr.audio = function (audio) {
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
Private.to.tumblr.video = function (video) {

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
Private.to.tumblr.image = function (image) {

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
Private.to.tumblr.person = function (person) {
    /* N/A: Cannot create person via API */
};


/* Tumblr organization (group) model:
 * {
 * 	N/A
 * }
 *
 * */

Private.to.tumblr.organization = function (organization) {
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

Private.to.tumblr.entity = function (entity) {
    /* N/A: Cannot create a Tumblr entity (blog) via API */
};

/* Tumblr checkin model
 * {
 * 	N/A
 * }
 *
 * */

Private.to.tumblr.checkin = function (checkin) {
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

Private.to.linkedin.note = function (note) {
    return {
        title: (Private.emptyPath('title', note)) ? null : note.title,
        summary: (Private.emptyPath('text', note)) ? null : note.text
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

Private.to.linkedin.comment = function (comment) {
    return {
        comment: (Private.emptyPath('text', comment)) ? null : comment.text,
        visibility: {
            code: 'anyone'
        } //prefer the public
    };

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

Private.to.linkedin.link = function (link) {
    return {
        comment: (Private.emptyPath('text', link)) ? null : link.text,
        content: {
            title: (Private.emptyPath('title', link)) ? null : link.title,
            submittedUrl: (Private.emptyPath('url', link)) ? null : link.url,
            submittedImageUrl: (Private.emptyPath('thumbnail.url', link)) ? null : link.thumbnail.url,
            description: (Private.emptyPath('description', link)) ? null : link.description
        },
        visibility: {
            code: 'anyone'
        } //prefer the public
    };

};


/* Linkedin audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.linkedin.audio = function (audio) {
    return false;
};

/* Linkedin video model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.linkedin.video = function (video) {
    return false;
};


/* Linkedin image model:
 * {
 *
 * 	N/A
 * }
 *
 * */

Private.to.linkedin.image = function (image) {

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

Private.to.linkedin.person = function (person) {
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

Private.to.linkedin.organization = function (organization) {
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

Private.to.linkedin.entity = function (entity) {
    /*  N/A: Can't create Linkedin entity (company) via API */
    return false;
};


/* Linkedin checkin model
 * {
 * 	N/A
 * }
 *
 * */

Private.to.linkedin.checkin = function (checkin) {
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

Private.to.github.note = function (note) {
    return {
        description: (Private.emptyPath('title', note)) ? null : note.title,
        public: true,
        files: {
            'file1.txt': {
                content: ((Private.emptyPath('text', note)) ? null : note.text)
            }
        }
    };

};


/* Github comment model:
 * {
 * 	TODO: http://developer.github.com/v3/gists/comments/
 * }
 *
 * */
Private.to.github.comment = function (comment) {
    return false;
};


/* Github link model:
 * {
 * 	N/A
 * }
 *
 * */

Private.to.github.link = function (link) {
    return false;
};


/* Github audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.github.audio = function (audio) {
    return false;
};

/* Github video model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.github.video = function (video) {
    return false;
};


/* Github image model:
 * {
 * 	N/A
 * }
 *
 * */

Private.to.github.image = function (image) {
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

Private.to.github.person = function (person) {
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

Private.to.github.organization = function (organization) {
    return {
        id: (Private.emptyPath('ids.github', organization)) ? null : organization.ids.github,
        url: (Private.emptyPath('link.url', organization)) ? null : organization.link.url,
        avatar_url: (Private.emptyPath('thumbnail.link.url', organization)) ? null : organization.thumbnail.link.url,
        name: (Private.emptyPath('name', organization)) ? null : organization.name,
        bio: (Private.emptyPath('description', organization)) ? null : organization.description,
        location: (Private.emptyPath('location.name', organization)) ? null : organization.location.name
    };

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
Private.to.github.entity = function (entity) {
    /*  N/A: Can't create Github entity (repo) via API */
    return false;
};


/* Github checkin model
 * {
 * 	N/A
 * }
 *
 * */

Private.to.github.checkin = function (checkin) {
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

Private.to.foursquare.note = function (note) {
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

Private.to.foursquare.comment = function (comment) {
    //TODO: foursquare comment mapping in reply to place
};


/* Foursquare link model:
 * {
 *
 * 	N/A
 * }
 *
 * */

Private.to.foursquare.link = function (link) {
    return false;
};


/* Foursquare audio model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.foursquare.audio = function (audio) {
    return false;
};

/* Foursquare video model:
 * {
 *	N/A
 * }
 *
 * */

Private.to.foursquare.video = function (video) {
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

Private.to.foursquare.image = function (image) {
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

Private.to.foursquare.person = function (person) {
    /* N/A: Cannot create person via API */
};


/* Foursquare organization (venue group) model:
 *
 * {
 *	TODO: https://developer.foursquare.com/docs/venuegroups/venuegroups
 * }
 *
 * */

Private.to.foursquare.organization = function (organization) {
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

Private.to.foursquare.entity = function (entity) {
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
Private.to.foursquare.checkin = function (checkin) {
    return {
        ll: (Private.emptyPath('location.latitude', checkin) || Private.emptyPath('location.longitude', checkin)) ? null : checkin.location.latitude + ',' + checkin.location.longitude,
        venueId: (Private.emptyPath('location.ids.foursquare', checkin)) ? null : checkin.location.ids.foursquare,
        venue: (Private.emptyPath('location.name', checkin)) ? null : checkin.location.name,
        shout: (Private.emptyPath('text', checkin)) ? null : checkin.text,
        broadcast: 'public',
        type: 'checkin',
        eventId: null //TODO: support events model e.g. checkin.event.ids.foursquare
    };

};

/* */
/* End Object Mapping */
/* */

/* */

Private.is_method = function (method) {
    if ('undefined' === typeof method || null === method) {
        return false;
    }
    method = method.toUpperCase();
    return !!('PUT' === method || 'GET' === method || 'DELETE' === method);

};

Private.is_action = function (action) {
    return !!('favorite' === action || 'archive' === action || 'watch' === action || 'read' === action || 'view' === action || 'listen' === action || 'post' === action || 'checkin' === action || '' === action);

};

Private.is_service = function (service) {
    if ('undefined' === typeof service || null === service) {
        return false;
    }
    service = service.toLowerCase();
    return !!('facebook' === service || 'google' === service || 'linkedin' === service || 'twitter' === service || 'windows' === service || 'foursquare' === service || 'yahoo' === service || 'github' === service || 'tumblr' === service);

};

/* Reply */

Private.is_reply = function (obj) {
    return false;
};

/* Utilities */

/* */
/* Begin Utilities */
/* */

//TODO: Real implementation w/checks for object and if so make sure it has 1+ iterable own properties.
Private.is_empty = function (obj) {
    return !!(null === obj || 'undefined' === typeof obj || ('string' === typeof obj && '' === obj) || ('undefined' !== typeof obj.length && 0 === obj.length));

};

Private.is_date = function (obj) {
    return (this.is_empty(obj)) ? false : obj instanceof Date;
};

Private.is_number = function (obj) {
    return (this.is_empty(obj)) ? false : 'number' === typeof obj;
};

Private.is_boolean = function (obj) {
    return (this.is_empty(obj)) ? false : 'boolean' === typeof obj;
};

//note that is_empty filters out empty strings, i.e. ''
Private.is_string = function (obj) {
    return (this.is_empty(obj)) ? false : 'string' === typeof obj;
};

Private.is_object = function (obj) {
    return (this.is_empty(obj)) ? false : ('object' === typeof obj && !this.is_array(obj));
};

Private.has_attributes = function (obj) {
    if (!this.is_object(obj)) {
        return false;
    }
    var attr;
    for (attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            return true;
        }
    }
    return false;
};

Private.is_array = function (obj) {
    return (this.is_empty(obj)) ? false : obj instanceof Array;
};

Private.get_model = function (type) {
    var model = null;
    switch (type) {
        case 'link':
            model = {
                url: true,
                text: false,
                image: false,
                thumbnail: false,
                source: false,
                title: false,
                description: false,
                author: false,
                publisher: false,
                clicks: false,
                views: false,
                comments_count: false,
                comments: false,
                ids: {
                    object: false
                }
            };
            break;
        case 'comment':
            model = {
                link: false,
                text: false,
                location: false,
                image: false,
                thumbnail: false,
                author: false,
                publisher: false,
                video: false,
                audio: false,
                views: false,
                comments_count: false,
                comments: false,
                ids: {
                    object: false
                }
            };
            break;
        case 'note':
            model = {
                link: false,
                text: false,
                location: false,
                image: false,
                thumbnail: false,
                vidio: false,
                audio: false,
                author: false,
                publisher: false,
                title: {
                    string: false
                },
                description: {
                    string: false
                },
                views: false,
                comments_count: false,
                comments: false,
                ids: {
                    object: false
                }
            };
            break;
        case 'audio':
            model = {
                link: true,
                source: false,
                location: false,
                image: false,
                thumbnail: false,
                author: false,
                publisher: false,
                length: {
                    'number': false
                },
                begin: {
                    'number': false
                },
                end: {
                    'number': false
                },
                title: {
                    string: false
                },
                description: {
                    string: false
                },
                views: false,
                comments_count: false,
                comments: false,
                ids: {
                    object: false
                }
            };
            break;
        case 'video':
            model = {
                link: true,
                format: {
                    'string': false
                },
                source: false,
                location: false,
                image: false,
                thumbnail: false,
                author: false,
                publisher: false,
                length: {
                    'number': false
                },
                begin: {
                    'number': false
                },
                end: {
                    'number': false
                },
                title: {
                    string: false
                },
                description: {
                    string: false
                },
                views: false,
                comments_count: false,
                comments: false,
                ids: {
                    object: false
                }
            };
            break;
        case 'image':
            model = {
                link: true,
                source: false,
                thumbnail: false,
                location: false,
                author: false,
                publisher: false,
                image: false,
                title: {
                    string: false
                },
                description: {
                    string: false
                },
                views: false,
                comments_count: false,
                comments: false,
                ids: {
                    object: false
                }
            };
            break;
        case 'place':
            model = {
                link: false,
                location: true,
                image: false,
                thumbnail: false,
                title: {
                    string: false
                },
                description: {
                    string: false
                },
                views: false,
                comments_count: false,
                comments: false,
                contents_count: false,
                contents: false,
                ids: {
                    object: false
                }
            };
            break;
        case 'stats':
            model = {
                link: false,
                location: false,
                source: false,
                title: {
                    string: false
                },
                description: {
                    string: false
                },
                data: true,
                ids: {
                    object: false
                }
            };
            break;
        case 'location':
            model = {
                link: false,
                longitude: {
                    number: true
                },
                latitude: {
                    number: true
                },
                image: false,
                thumbnail: false,
                name: {
                    string: false
                },
                description: {
                    string: false
                },
                ids: {
                    object: false
                }
            };
            break;
        case 'person':
            model = {
                link: false,
                location: false,
                image: false,
                thumbnail: false,
                name: {
                    string: true
                },
                description: {
                    string: true
                },
                views: false,
                contents_count: false,
                contents: {
                    array: false
                },
                ids: {
                    object: false
                }
            };
            break;
        case 'organization':
            model = {
                link: false,
                location: false,
                image: false,
                thumbnail: false,
                name: {
                    string: true
                },
                description: {
                    string: true
                },
                views: false,
                contents_count: false,
                contents: {
                    array: false
                },
                ids: {
                    object: false
                }
            };
            break;
        case 'source':
            model = {
                link: false,
                format: false,
                location: false,
                image: false,
                thumbnail: false,
                name: {
                    string: false
                },
                description: {
                    string: false
                },
                views: false,
                contents_count: false,
                contents: {
                    array: false
                },
                ids: {
                    object: false
                }
            };
            break;
        case 'entity':
            model = {
                link: false,
                location: false,
                image: false,
                thumbnail: false,
                name: {
                    string: true
                },
                description: {
                    string: true
                },
                contents_count: false,
                contents: {
                    array: false
                },
                ids: {
                    object: false
                }
            };
            break;
        case 'checkin':
            model = {
                link: false,
                location: true,
                image: false,
                thumbnail: false,
                text: {
                    string: false
                },
                ids: {
                    object: false
                },
                comments_count: false,
                comments: false
            };
            break;
        default:
            break;

    }
};

Private.has_model = function (attr) {
    return !!('undefined' !== attr && null !== attr && null !== this.get_model(attr));

};

Private.is_model = function (obj, model) {
    //object can't be model if there is no object or is no model
    if (!this.is_object(obj) || !this.is_object(model)) {
        return false;
    } else {
        var attr, item;
        for (attr in obj) {

            item = obj[attr];

            if (this.is_object(item)) {

                if (this.has_model(attr)) {
                    if (!this.is_model(obj, this.get_model(attr))) {
                        return false;
                    }
                }

                //not a model attribute, so enforce item level specs
                var attr2;
                for (attr2 in model[attr]) {
                    if ('undefined' !== typeof model[attr] && true === model[attr]) {
                        if (this.is_empty(obj[attr])) {
                            return false;
                        }
                    }
                    if ('function' === typeof this['is_' + attr2]) {
                        if (false === this['is_' + attr2](obj[attr])) {
                            return false;
                        }
                    }
                }

            } else if (this.is_boolean(item)) {
                if (true === item) {
                    if (this.has_model(attr)) {
                        if (!this.is_model(obj, this.get_model(attr))) {
                            return false;
                        }
                    } else {
                        if ('undefined' === typeof item || null === item) {
                            return false;
                        }
                    }
                } else if (false === item) {
                    if ('undefined' !== typeof item && null !== item) {
                        if (true === item && this.has_model(attr) && !this.is_model(obj, this.get_model(attr))) {
                            return false;
                        }
                    }
                }
            }
        }
    }

    return true;
};

Private.emptyPath = function (path, object) {
    if ('undefined' === typeof path || 'undefined' === typeof object) {
        return true;
    }
    if (-1 !== path.indexOf('.')) {
        var pieces = path.split('.');
        var piece = pieces.shift();
        if ('undefined' !== typeof piece && null !== typeof piece && 'undefined' !== typeof object[piece] && null !== object[piece]) {
            return Private.emptyPath(pieces.join('.'), object[piece]);
        } else {
            return true;
        }
    } else {
        return (!('undefined' !== typeof object[path] && null !== object[path]));
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

Private.is_link = function (obj) {
    return this.is_model(obj, this.get_model('link'));
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

Private.is_comment = function (obj) {
    return this.is_model(obj, this.get_model('comment'));
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

Private.is_note = function (obj) {
    return this.is_model(obj, this.get_model('note'));
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

Private.is_audio = function (obj) {
    return this.is_model(obj, this.get_model('audio'));
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

Private.is_video = function (obj) {
    return this.is_model(obj, this.get_model('video'));
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

Private.is_image = function (obj) {
    return this.is_model(obj, this.get_model('image'));
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

Private.is_place = function (obj) {
    return this.is_model(obj, this.get_model('place'));
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

Private.is_stats = function (obj) {
    return this.is_model(obj, this.get_model('stats'));
};

Private.is_clicks = function (obj) {
    return this.is_stats(obj);
};

Private.is_views = function (obj) {
    return this.is_stats(obj);
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

Private.is_location = function (obj) {
    return this.is_model(obj, this.get_model('location'));
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

Private.is_person = function (obj) {
    return this.is_model(obj, this.get_model('person'));
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

Private.is_organization = function (obj) {
    return this.is_model(obj, this.get_model('organization'));
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

Private.is_source = function (obj) {
    return this.is_model(obj, this.get_model('source'));
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

Private.is_entity = function (obj) {
    return this.is_model(obj, this.get_model('entity'));
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

Private.is_checkin = function (obj) {
    return this.is_model(obj, this.get_model('checkin'));
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
Private.apply_actions = function (request, connection, revert, on_success, on_error) {

    //check for service and access_token
    if ('undefined' === typeof request['tokens']) {
        throw new Error('Accessing a service requires tokens');
    }

    var services = request.services,
        actions = request.actions || request.action;

    if (this.is_empty(services) || this.is_empty(actions)) {
        throw new Error('Must pass non-empty services and action');
        return false;
    }
    ;

    var revert = (true === revert),
        x = 0,
        xlen = services.length,
        y = 0,
        ylen = ('string' === actions) ? 0 : actions.length,
        service, action, str = this.is_string(services),
        str2 = this.is_string(actions),
        result = {};

    if (!this.is_array(services) && false === str) {
        throw new Error('Cannot apply action to an empty or non-array (note: accepts single string) of services.');
        return false;
    }
    if (!this.is_array(actions) && false === str2) {
        throw new Error('Cannot apply an empty or non array action.');
        return false;
    }
    if (true === str) {
        services = [services];
    }
    if (true === str2) {
        actions = [actions];
    }

    for (y = 0; y < ylen; y += 1) {
        action = actions[y];
        for (x = 0; x < xlen; x += 1) {
            service = services[x];
            if ('undefined' === typeof Private[service]) {
                throw new Error('Cannot apply action to an invalid service.', service);
                return false;
            }
            if ('function' !== typeof Private[service][action]) {
                throw new Error('Cannot apply invalid action or non-function.', service, action);
                return false;
            }
            if ('undefined' === typeof result[action]) {
                result[action] = {};
            }
            if ('undefined' === typeof result[action][service]) {
                result[action][service] = {};
            }
            if (false === revert) {
                result[action][service] = Private[service][action](request, connection, own_callback, on_error);
            } else {
                result[action][service] = Private[service][action].revert(request, connection, own_callback, on_error);
            }
        }
    }

};

/* All-purpose */

Private.do = function (req, connection, revert, success, error) {
    var own_success = function (response) {
        if ('function' === typeof success) {
            success(response);
        }
    };
    var own_error = function (err) {
        if ('function' === typeof error) {
            error(err);
        }
    };
    return this.apply_actions(req, connection, revert, success, error);
};

/* Stream */

Private.stream = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }

    };
    req.actions = ['stream'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};


/* Favorite */

Private.favorite = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['favorite'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.unfavorite = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['favorite'];
    return this.apply_actions(req, connection, true, own_callback, on_error);
};

/* Archive */

Private.archive = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['archive'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.archive.revert = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['archive'];
    return this.apply_actions(req, connection, true, own_callback, on_error);
};

/* Watch */

Private.watch = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['watch'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.watch.revert = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['watch'];
    return this.apply_actions(req, connection, true, own_callback, on_error);
};

/* Read */

Private.read = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['read'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.read.revert = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['read'];
    return this.apply_actions(req, connection, true, own_callback, on_error);
};

/* See */

Private.view = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['view'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.view.revert = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['view'];
    return this.apply_actions(req, connection, true, own_callback, on_error);
};

/* Listen */

Private.listen = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['listen'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.listen.revert = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['listen'];
    return this.apply_actions(req, connection, true, own_callback, on_error);
};

/* Checkin */

Private.checkin = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['checkin'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.checkin.revert = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['checkin'];
    return this.apply_actions(req, connection, true, own_callback, on_error);
};

/* Say */

Private.post = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        req.data.id = id;
        req.data.url = url;
        if ('function' === typeof on_success) {
            on_success(req);
        }
    };
    req.actions = ['post'];
    return this.apply_actions(req, connection, null, own_callback);
};

Private.repost = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        req.data.id = id;
        req.data.url = url;
        if ('function' === typeof on_success) {
            on_success(req);
        }
    };
    req.actions = ['repost'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.edit = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        req.data.id = id;
        req.data.url = url;
        if ('function' === typeof on_success) {
            on_success(req);
        }
    };
    req.actions = ['edit'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.unpost = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        req.data.id = id;
        req.data.url = url;
        if ('function' === typeof on_success) {
            on_success(req);
        }
    };
    req.actions = ['unpost'];
    return this.apply_actions(req, connection, true, own_callback, on_error);
};

/* Trash */

Private.trash = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['trash'];
    return this.apply_actions(req, connection, null, own_callback, on_error);
};

Private.trash.revert = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('function' === typeof on_success) {
            on_success(id, url);
        }
    };
    req.actions = ['trash'];
    return this.apply_actions(req, connection, true, own_callback, on_error);
};

/* */
/* End Actions */
/* */

/* */
/* Request Utilities  */
/* */

Private.request = function () {

};

Private.request.post = function (oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback, bypass) {
    return oauth.post(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback, bypass);
};

Private.request.get = function (oauth, url, oauth_token, oauth_token_secret, callback, extra_headers) {
    //hacky duck typing
    if ('function' !== typeof callback && 'function' === oauth_token_secret) {
        S;
        //oauth2 (no secret is the feature detected, seeing callback as 3rd arg)
        return oauth.get(url, oauth_token, oauth_token_secret);
    } else {
        //oauth1.0
        return oauth.get(url, oauth_token, oauth_token_secret, callback, extra_headers);
    }
};

Private.request.put = function (oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    return oauth.put(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
};

Private.request.delete = function (oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    //hacky duck typing
    if ('function' !== typeof callback && 'function' === oauth_token_secret) {
        var append_token = null;
        return oauth.delete(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback, append_token);
    } else {
        //oauth1.0
        return oauth.delete(url, oauth_token, oauth_token_secret, callback);
    }

};

Private.request.querystring = function (obj) {
    return querystring.stringify(obj);
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

Private.tumblr = function (req, connection, on_success, on_error) {
    return false;
};

/* Stream */

Private.tumblr.stream = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if (null === req.data || 'undefined' === typeof req.data) {
            req.data = null;
        }
        if (null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams) {
            req.data = (null === req.data || 'undefined' === typeof req.data) ? {} : req.data;
            req.data.streams = {};
        }
        if (true === req.raw) {
            req.data.streams.tumblr = data;
        } else {
            var res = [],
                z = 0,
                zitem, zlen = data.response.posts.length;
            for (z = 0; z < zlen; z += 1) {
                zitem = data.response.posts[z];
                if ('link' === zitem.type) {
                    //link
                    res.push(Private.stream.tumblr.link.to.activity(zitem));
                } else if ('text' === zitem.type) {
                    //note (text)
                    res.push(Private.stream.tumblr.note.to.activity(zitem));
                }

            }
            req.data.streams.tumblr = res;
        }


        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if (null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
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

    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('string' === typeof status_code) {
            status_code = JSON.parse(status_code);
        }
        if ('undefined' !== typeof data) {
            status_code = data.statusCode;
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    Private.request.get(Private.service.tumblr, url, token, secret, callback);

};

Private.tumblr.favorite = function (req, connection, invert) {
    // /user/like
    //http://www.tumblr.com/docs/en/api/v2#posts

    var own_callback;
    if (true === invert) {
        own_callback = function (reqdata) {

            if ('undefined' === typeof req.data.unfavorited) {
                req.data.unfavorited = {};
            }
            //{ meta: { status: 200, msg: 'OK' },
            req.data.unfavorited.tumblr = !!('undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status);

            var x = 0,
                xlen = req.services.length,
                service;
            var complete = true;
            for (x = 0; x < xlen; x += 1) {
                service = req.services[x];
                if ('undefined' === typeof req.data.unfavorited[service]) {
                    complete = false;
                }
            }
            if (complete) {
                if ('function' === typeof on_success) {
                    on_success(req);
                }
            }
        };
    } else {
        own_callback = function (reqdata) {

            if ('undefined' === typeof req.data.favorited) {
                req.data.favorited = {};
            }
            //{ meta: { status: 200, msg: 'OK' },
            req.data.favorited.tumblr = !!('undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status);

            var x = 0,
                xlen = req.services.length,
                service;
            var complete = true;
            for (x = 0; x < xlen; x += 1) {
                service = req.services[x];
                if ('undefined' === typeof req.data.favorited[service]) {
                    complete = false;
                }
            }
            if (complete) {
                if ('function' === typeof on_success) {
                    on_success(req);
                }
            }
        };
    }

    var target_blog = null,
        target_key, target_id;
    if ('undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog || 'undefined' === typeof req.data.target.tumblr.blog || 'undefined' === typeof req.data.target.tumblr.key) {
        console.log("need to target a blog, have an id and key (reblog_key)");
    } else {
        target_blog = req.data.target.tumblr.blog;
        target_id = req.data.target.tumblr.id;
        target_key = req.data.target.tumblr.key;
    }

    var url;
    if (invert) {
        url = 'http://api.tumblr.com/v2/user/unlike';
    } else {
        url = 'http://api.tumblr.com/v2/user/like';
    }
    var query = {
        id: target_id,
        reblog_key: target_key
    };
    var type = req.data.type;

    var token = req.tokens.tumblr;
    var secret = req.secrets.tumblr;

    var postbody = Private.request.querystring(query);
    url = url + '?' + postbody;
    var callback = function (status_code, data) {
        if ('' === data) {
            data = null;
        }
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    return Private.request.post(Private.service.tumblr, url, token, secret, postbody, null, callback);

};

Private.tumblr.unfavorite = function (req, connection, on_success, on_error) {
    return Private.tumblr.favorite(req, connection, true, own_callback, on_error);
};

Private.tumblr.archive = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.archive.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.watch = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.watch.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.read = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.read.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.view = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.view.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.listen = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.listen.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.checkin = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.checkin.revert = function (req, connection, on_success, on_error) {
    return false;
};

//Supports note, commentTK, link types
Private.tumblr.post = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('undefined' === typeof req.data.upstream_duplicates) {
            req.data.upstream_duplicates = {};
        }
        if ('undefined' === typeof req.data.upstream_duplicates.local) {
            req.data.upstream_duplicates.local = {};
        }
        if ('undefined' === typeof req.data.upstream_duplicates.tumblr) {
            req.data.upstream_duplicates.tumblr = {};
        }
        req.data.upstream_duplicates.tumblr.id = id;
        if ('undefined' !== typeof req.meta && 'undefined' !== typeof req.meta.id) {
            req.data.upstream_duplicates.local.id = req.meta.id;
        }
        req.data.upstream_duplicates.tumblr.url = url;
        req.data.verb = ('undefined' !== typeof req.data && 'undefined' !== typeof req.data.verb) ? req.data.verb : 'post';
        req.verb = 'publish';
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.upstream_duplicates[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var own_error = function () {
        req.data.urls.tumblr = false;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.upstream_duplicates[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    //http://www.tumblr.com/docs/en/api/v2#posts
    if ('undefined' === typeof req.data.type) {
        return false;
    }
    if ('undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog) {
        return false;
        //todo: new
    }
    var url, query;
    if ('note' === req.data.type) {
        if ('undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog) {
            return false;
        }
        url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/post';
        query = Private.to.tumblr.note(req.data);
    } else if ('comment' === req.data.type) {
        if ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.tumblr && 'undefined' !== typeof req.data.target.tumblr.blog) {
            url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/reblog';
            query = Private.to.tumblr.comment(req.data);
        }
    } else if ('link' === req.data.type) {
        if ('undefined' !== typeof req.data.target && ('undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog)) {
            return false;
        }
        url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/post';
        query = Private.to.tumblr.link(req.data);
    }
    var type = req.data.type;

    var token = req.tokens.tumblr;
    var secret = req.secrets.tumblr;

    var postbody = Private.request.querystring(query);
    url = url + '?' + postbody;
    var callback = function (status_code, data) {
        if ('string' === typeof data) {

            if (400 == status_code || 404 === status_code) {
                own_error();
                return;
            } else {
                data = JSON.parse(data);
            }
        }

        var item_id = data.response.id;
        var item_url = null;

        var res2 = Private.request.get(Private.service.tumblr, 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/posts?id=' + item_id + '&api_key=' + tumblrId, token, secret, function (res2, res3) {

            var data2;
            if ('string' === typeof res3) {
                data2 = JSON.parse(res3);
            }

            if (400 == data2.statusCode || 404 === data2.statusCode) {
                own_error();
                return;
            }

            if ('undefined' !== data2.meta && 404 === data2.meta.status) {

            }
            var posts = data2.response.posts;
            var x = 0;
            for (x = 0; x < posts.length; x += 1) {
                if ('undefined' !== typeof posts[x]) {

                    if (null === item_url) {
                        item_url = posts[x].post_url;
                    } else if ('string' === typeof item_url) {
                        item_url = [item_url, posts[x].post_url];
                    } else {
                        item_url.push(posts[x].post_url);
                    }

                }
            }
            ;

            if ('function' === typeof own_callback) {
                own_callback(item_id, item_url);
            }


        });

    };

    var res = Private.request.post(Private.service.tumblr, url, token, secret, postbody, null, callback);

    return res;
};

Private.tumblr.unpost = function (req, connection, on_success, on_error) {
    var own_callback = function (reqdata) {

        if ('undefined' === typeof req.data.deleted) {
            req.data.deleted = {};
        }
        //{ meta: { status: 200, msg: 'OK' },
        req.data.deleted.tumblr = !!('undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status);

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.deleted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var target_blog = null,
        target_id;
    if ('undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog || 'udnefined' === typeof req.data.target.tumblr.blog) {
        console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
    } else {
        target_blog = req.data.target.tumblr.blog;
        target_id = req.data.target.tumblr.id;
    }
    var url = 'http://api.tumblr.com/v2/blog/' + target_blog + '/post/delete';
    var query = {
        id: target_id
    };
    var type = req.data.type;

    var token = req.tokens.tumblr;
    var secret = req.secrets.tumblr;

    var postbody = Private.request.querystring(query);
    url = url + '?' + postbody;
    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    return Private.request.post(Private.service.tumblr, url, token, secret, postbody, null, callback);

};

Private.tumblr.edit = function (req, connection, on_success, on_error) {

    var url, query;
    if ('note' === req.data.type) {
        if ('undefined' !== typeof req.data.target && ('undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog)) {
            console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
        }
        url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/post';
        query = Private.to.tumblr.note(req.data);
    } else if ('comment' === req.data.type) {
        if ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.tumblr && 'undefined' !== typeof req.data.target.tumblr.blog) {
            url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/reblog';
            query = Private.to.tumblr.comment(req.data);
        }
    } else if ('link' === req.data.type) {
        if ('undefined' !== typeof req.data.target && ('undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog)) {
            console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
        }
        url = 'http://api.tumblr.com/v2/blog/' + req.data.target.tumblr.blog + '/post';
        query = Private.to.tumblr.link(req.data);
    }
    var type = req.data.type;

    var token = req.tokens.tumblr;
    var secret = req.secrets.tumblr;

    var postbody = Private.request.querystring(query);
    url = url + '?' + postbody;
    var own_callback = function (reqdata) {

        if ('undefined' === typeof req.data.edited) {
            req.data.edited = {};
        }
        //{ meta: { status: 200, msg: 'OK' },
        req.data.edited.tumblr = !!('undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status);

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.edited[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var target_blog = null;
    if ('undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blogd) {
        console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
    } else {
        target_blog = req.data.target.tumblr.blog;
        target_id = req.data.target.tumblr.id;
    }
    var url = 'http://api.tumblr.com/v2/blog/' + target_blog + '/post/edit';
    query['id'] = target_id;
    var type = req.data.type;

    var token = req.tokens.tumblr;
    var secret = req.secrets.tumblr;

    var postbody = Private.request.querystring(query);
    url = url + '?' + postbody;
    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    return Private.request.post(Private.service.tumblr, url, token, secret, postbody, null, callback);

};

Private.tumblr.repost = function (req, connection, on_success, on_error) {
    var own_callback = function (reqdata) {

        if ('undefined' === typeof req.data.reposted) {
            req.data.reposted = {};
        }
        //{ meta: { status: 200, msg: 'OK' },
        req.data.reposted.tumblr = !!('undefined' !== typeof reqdata.meta && 200 == reqdata.meta.status);

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.reposted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var target_blog = null,
        target_key;
    if ('undefined' === typeof req.data || 'undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.tumblr || 'undefined' === typeof req.data.target.tumblr.blog) {
        console.log("need to target a blog (target.ids.tumblr and target.types.tumblr)");
    } else {
        target_blog = req.data.target.tumblr.blog;
        target_id = req.data.target.tumblr.id;
        target_key = req.data.target.tumblr.key;
    }
    var url = 'http://api.tumblr.com/v2/blog/' + target_blog + '/post/reblog';
    var query = {
        id: target_id,
        reblog_key: target_key,
        comment: (('undefined' !== typeof req.data && 'undefined' !== typeof req.data.text) ? req.data.text : null)
    };
    var type = req.data.type;

    var token = req.tokens.tumblr;
    var secret = req.secrets.tumblr;

    var postbody = Private.request.querystring(query);
    url = url + '?' + postbody;
    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    return Private.request.post(Private.service.tumblr, url, token, secret, postbody, null, callback);

};

Private.tumblr.trash = function (req, connection, on_success, on_error) {
    return false;
};

Private.tumblr.trash.revert = function (req, connection, on_success, on_error) {
    return false;
};

/* Facebook */

Private.facebook = function (req, connection, on_success, on_error) {
    return false;
};

/* Stream */


Private.facebook.stream = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if (null === req.data || 'undefined' === typeof req.data) {
            req.data = null;
        }
        if (null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams) {
            req.data = (null === req.data || 'undefined' === typeof req.data) ? {} : req.data;
            req.data = (null === req.data || 'undefined' === typeof req.data) ? {} : req.data;
            req.data.streams = {};
        }

        if (true === req.raw) {
            req.data.streams.facebook = data;
        } else {
            var res = [],
                z = 0,
                zitem, zlen = data.data.length;
            for (z = 0; z < zlen; z += 1) {
                zitem = data.data[z];
                if ('link' === zitem.type) {
                    if (-1 !== zitem.link.indexOf('http://www.facebook.com/notes/')) {
                        //note
                        res.push(Private.stream.facebook.note.to.activity(zitem));
                    } else {
                        //share
                        res.push(Private.stream.facebook.link.to.activity(zitem));
                    }
                } else if ('status' === zitem.type) {
                    //status
                    res.push(Private.stream.facebook.comment.to.activity(zitem));
                }

            }
            req.data.streams.facebook = res;
        }

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if (null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query;
    var url = 'https://graph.facebook.com/me/home';

    var token = req.tokens.facebook;
    var secret = req.secrets.facebook;

    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('string' === typeof status_code) {
            status_code = JSON.parse(status_code);
        }
        if ('undefined' !== typeof data) {
            status_code = data.statusCode;
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    Private.request.get(Private.service.facebook, url, token, callback);

};


Private.facebook.ownStream = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if (null === req.data || 'undefined' === typeof req.data) {
            req.data = null;
        }
        if (null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams) {
            req.data = (null === req.data || 'undefined' === typeof req.data) ? {} : req.data;
            req.data = (null === req.data || 'undefined' === typeof req.data) ? {} : req.data;
            req.data.streams = {};
        }

        if (true === req.raw) {
            req.data.streams.facebook = data;
        } else {
            var res = [],
                z = 0,
                zitem, zlen = data.data.length;
            for (z = 0; z < zlen; z += 1) {
                zitem = data.data[z];
                if ('link' === zitem.type) {
                    if (-1 !== zitem.link.indexOf('http://www.facebook.com/notes/')) {
                        //note
                        res.push(Private.stream.facebook.note.to.activity(zitem));
                    } else {
                        //share
                        res.push(Private.stream.facebook.link.to.activity(zitem));
                    }
                } else if ('status' === zitem.type) {
                    //status
                    res.push(Private.stream.facebook.comment.to.activity(zitem));
                }

            }
            req.data.streams.facebook = res;
        }

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if (null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query;
    var url = 'https://graph.facebook.com/me/feed';

    var token = req.tokens.facebook;
    var secret = req.secrets.facebook;

    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('string' === typeof status_code) {
            status_code = JSON.parse(status_code);
        }
        if ('undefined' !== typeof data) {
            status_code = data.statusCode;
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    Private.request.get(Private.service.facebook, url, token, callback);

};

Private.facebook.unpost = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if ('undefined' === typeof req.data.deleted) {
            req.data.deleted = {};
        }
        req.data.deleted.facebook = true;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.deleted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var target_id = null;
    if ('undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.facebook) {
        target_id = req.data.target.facebook.id;
    }
    var query = {
            'method': 'delete'
        },
        url = 'https://graph.facebook.com/' + target_id;

    var token = req.tokens.facebook;
    var secret = req.secrets.facebook;

    var postbody = Private.request.querystring(query);
    var callback = function (status_code, data) {
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    return Private.request.post(Private.service.facebook, url, token, secret, postbody, null, callback);


};

Private.facebook.favorite = function (req, connection, invert) {
    invert = (true === invert);
    //https://developers.facebook.com/docs/opengraph/actions/
    var own_callback = function (data) {
        if ('undefined' === typeof req.data.favorited) {
            req.data.favorited = {};
        }
        req.data.favorited.facebook = true;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.favorited[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var target_id = null;
    if ('undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.facebook) {
        target_id = req.data.target.facebook.id;
    }
    var query = {},
        url = 'https://graph.facebook.com/' + target_id + '/likes';

    var token = req.tokens.facebook;
    var secret = req.secrets.facebook;

    var postbody = Private.request.querystring(query);
    var callback = function (status_code, data) {
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    if (invert) {
        return Private.request.delete(Private.service.facebook, url, token, secret, postbody, null, callback);
    } else {
        return Private.request.post(Private.service.facebook, url, token, secret, postbody, null, callback);
    }

};


Private.facebook.unfavorite = function (req, connection, on_success, on_error) {
    return Private.facebook.favorite(req, connection, true, own_callback, on_error);
};

Private.facebook.archive = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.archive.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.watch = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.watch.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.read = function (req, connection, on_success, on_error) {
    var access_token = req.tokens.facebook;
    return false;
};
Private.facebook.read.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.view = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.view.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.listen = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.listen.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.checkin = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.checkin.revert = function (req, connection, on_success, on_error) {
    return false;
};

//
Private.facebook.post = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('undefined' === typeof req.data.upstream_duplicates) {
            req.data.upstream_duplicates = {};
        }
        if ('undefined' === typeof req.data.upstream_duplicates.facebook) {
            req.data.upstream_duplicates.facebook = {};
        }
        req.data.upstream_duplicates.facebook.id = id;
        if ('undefined' === typeof req.data.upstream_duplicates.local) {
            req.data.upstream_duplicates.local = {};
        }
        if ('undefined' !== typeof req.meta && 'undefined' !== typeof req.meta.id) {
            req.data.upstream_duplicates.local.id = req.meta.id;
        }
        if ('undefined' === typeof req.data.urls) {
            req.data.urls = {};
        }
        req.data.upstream_duplicates.facebook.url = url;
        req.data.verb = 'post';
        req.verb = 'publish';
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.upstream_duplicates[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var own_error = function () {
        req.data.urls.facebook = false;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.upstream_duplicates[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var target_id = ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.facebook && 'undefined' !== typeof req.data.target.facebook.id) ? req.data.target.facebook.id : null;
    var url, query;
    if ('note' === req.data.type) {
        url = 'https://graph.facebook.com/me/notes';
        query = Private.to.facebook.note(req.data);
    } else if ('comment' === req.data.type) {

        query = Private.to.facebook.comment(req.data);
        if (null === target_id || 'undefined' === typeof target_id) {
            url = 'https://graph.facebook.com/me/feed';
        } else {
            url = 'https://graph.facebook.com/' + target_id + '/comments';
            delete query.type;
        }


    } else if ('link' === req.data.type) {
        url = 'https://graph.facebook.com/me/links';
        query = Private.to.facebook.link(req.data);
    }

    var token = req.tokens.facebook;
    var secret = req.secrets.facebook;

    var postbody = Private.request.querystring(query);
    var callback = function (status_code, data) {
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('string' === typeof status_code) {
            status_code = JSON.parse(status_code);
        }
        if ('undefined' !== typeof data) {
            status_code = data.statusCode;
        }
        //
        if (400 == status_code) {
            own_error();
            return;
        }
        var item_id = null; //data.id;
        var item_url = null; //data.html_url;
        var attr, filename;
        if ('undefined' !== typeof data) {

            if ('undefined' !== typeof data.url) {
                //none here
            }
            if ('undefined' !== typeof data.id) {
                var note_item_id = data.id;

                var url = 'https://graph.facebook.com/me';
                Private.request.get(Private.service.facebook, url, token, function (status_code_3, data_3) {

                    if ('string' === typeof data_3) {
                        if ('' === data_3) {
                            data_3 = null;
                        } else {
                            data_3 = JSON.parse(data_3);
                        }
                    }
                    item_id = data_3.id + '_' + note_item_id;
                    if (null === item_url && null !== note_item_id && 'note' === req.data.type) {
                        item_url = 'https://www.facebook.com/note.php?note_id=' + note_item_id;
                    }
                    if ('function' === typeof own_callback) {
                        own_callback(item_id, item_url);
                    }

                });


            }
        }
        ;

    };

    var res = Private.request.post(Private.service.facebook, url, token, secret, postbody, null, callback);
    return res;
};

Private.facebook.unpost = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if ('undefined' === typeof req.data.deleted) {
            req.data.deleted = {};
        }
        req.data.deleted.facebook = true;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.deleted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var target_id = null;
    if ('undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.facebook) {
        target_id = req.data.target.facebook.id;
    }
    var query = {
            'method': 'delete'
        },
        url = 'https://graph.facebook.com/' + target_id;

    var token = req.tokens.facebook;
    var secret = req.secrets.facebook;

    var postbody = Private.request.querystring(query);
    var callback = function (status_code, data) {
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    return Private.request.post(Private.service.facebook, url, token, secret, postbody, null, callback);


};

//
Private.facebook.edit = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('undefined' === typeof req.data.edited) {
            req.data.edited = {};
        }
        req.data.edited.facebook = true;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.edited[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query, url = 'https://graph.facebook.com/' + req.data.target.facebook.id;
    if ('note' === req.data.type) {
        query = Private.to.facebook.note(req.data);
    } else if ('comment' === req.data.type) {
        query = Private.to.facebook.comment(req.data);
    } else if ('link' === req.data.type) {
        query = Private.to.facebook.link(req.data);
    }

    var token = req.tokens.facebook;
    var secret = req.secrets.facebook;

    var postbody = Private.request.querystring(query);
    var callback = function (status_code, data) {
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        status_code = data.statusCode;
        var item_id = null; //data.id;
        var item_url = null; //data.html_url;
        var attr, filename;
        if ('undefined' !== typeof data) {
            if ('undefined' !== typeof data.id) {
                item_id = data.id;
            }
            if ('undefined' !== typeof data.url) {
                //none here
            }
        }
        ;
        if (null === item_url && null !== item_id && 'note' === req.data.type) {
            item_url = 'https://www.facebook.com/note.php?note_id=' + item_id;
        }
        if ('function' === typeof own_callback) {
            own_callback(item_id, item_url);
        }
    };

    //var res = Private.service.facebook._request( "POST", url, {}, postbody, token, callback);
    //Private.request.post = function( oauth, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback ) {

    var res = Private.request.post(Private.service.facebook, url, token, secret, postbody, null, callback);
    //var res = Private.request.get( Private.service.twitter, url, token, secret, callback );

    return res;
};


Private.facebook.trash = function (req, connection, on_success, on_error) {
    return false;
};
Private.facebook.trash.revert = function (req, connection, on_success, on_error) {
    return false;
};

/* Twitter */

/* Implemented:
 *	- favorite (favorite)
 *	- unfavorite (unfavorite)
 *	- post (tweet)
 *	- unpost (untweet)
 * */


Private.twitter = function (req, connection, on_success, on_error) {
    return false;
};

/* Stream */

Private.twitter.stream = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if (null === req.data || 'undefined' === typeof req.data) {
            req.data = {};
        }
        if (null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams) {
            req.data.streams = {};
        }

        if (true === req.raw) {
            req.data.streams.twitter = data;
        } else {
            var res = [],
                z = 0,
                zitem, zlen = data.length;
            for (z = 0; z < zlen; z += 1) {
                zitem = data[z];
                res.push(Private.stream.twitter.comment.to.activity(zitem));
            }
            req.data.streams.twitter = res;
        }
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if (null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query;
    var url = 'https://api.twitter.com/1/statuses/home_timeline.json?include_entities=true';

    var token = req.tokens.twitter;
    var secret = req.secrets.twitter;

    var callback = function (status_code, data) {
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('string' === typeof status_code) {
            status_code = JSON.parse(status_code);
        }
        if ('undefined' !== typeof data) {
            status_code = data.statusCode;
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    Private.request.get(Private.service.twitter, url, token, secret, callback);


};

Private.twitter.favorite = function (req, connection, on_success, on_error) {
    //https://dev.twitter.com/docs/api/1/post/favorites/create/%3Aid

    var own_callback = function (reqdata) {

        if ('undefined' === typeof req.data.favorited) {
            req.data.favorited = {};
        }
        req.data.favorited.twitter = 'undefined' === typeof reqdata.error;

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.favorited[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    if ('comment' === req.data.type) {

        var token = req.tokens.twitter;
        var secret = req.secrets.twitter;
        var target_id = null;
        if ('undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.twitter) {
            target_id = req.data.target.twitter.id;
        }

        var callback = function (status_code, data) {
            if ('string' === typeof data) {
                data = JSON.parse(data);
            }
            if ('function' === typeof own_callback) {
                own_callback(data);
            }
        };

        var url = 'http://api.twitter.com/1/favorites/create/' + target_id + ".json";
        var query = {
            id: target_id
        };
        var postbody = Private.request.querystring(query);

        return Private.request.post(Private.service.twitter, url, token, secret, query, null, callback);

    }
};

Private.twitter.unfavorite = function (req, connection, on_success, on_error) {
    var own_callback = function (reqdata) {

        if ('undefined' === typeof req.data.unfavorited) {
            req.data.unfavorited = {};
        }
        req.data.unfavorited.twitter = 'undefined' === typeof reqdata.error;

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.unfavorited[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    if ('comment' === req.data.type) {

        var token = req.tokens.twitter;
        var secret = req.secrets.twitter;
        var target_id = null;
        if ('undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.twitter) {
            target_id = req.data.target.twitter.id;
        }

        var callback = function (status_code, data) {
            if ('string' === typeof data) {
                data = JSON.parse(data);
            }
            if ('function' === typeof own_callback) {
                own_callback(data);
            }
        };

        var url = 'http://api.twitter.com/1/favorites/destroy/' + target_id + ".json";
        var query = {
            id: target_id
        };
        var postbody = Private.request.querystring(query);

        return Private.request.post(Private.service.twitter, url, token, secret, query, null, callback);

    }

};

Private.twitter.archive = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.archive.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.watch = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.watch.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.read = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.read.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.view = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.view.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.listen = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.listen.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.checkin = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.checkin.revert = function (req, connection, on_success, on_error) {
    return false;
};

// Supports comment, imageTK types
Private.twitter.post = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('undefined' === typeof req.data.upstream_duplicates) {
            req.data.upstream_duplicates = {};
        }
        if ('undefined' === typeof req.data.upstream_duplicates.twitter) {
            req.data.upstream_duplicates.twitter = {};
        }
        req.data.upstream_duplicates.twitter.id = id;
        if ('undefined' === typeof req.data.urls) {
            req.data.urls = {};
        }
        req.data.urls.twitter = url;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.upstream_duplicates[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    if ('comment' === req.data.type) {

        var url = 'http://api.twitter.com/1/statuses/update.json';

        var token = req.tokens.twitter;
        var secret = req.secrets.twitter;

        var query = Private.to.twitter.comment(req.data);
        var postbody = Private.request.querystring(query);

        var callback = function (status_code, data) {
            if ('string' === typeof data) {
                data = JSON.parse(data);
            }
            var item_id = data.id_str;
            var item_url = 'https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str;
            if ('function' === typeof own_callback) {
                own_callback(item_id, item_url);
            }
        };

        return Private.request.post(Private.service.twitter, url, token, secret, query, null, callback);

    }
};

Private.twitter.unpost = function (req, connection, on_success, on_error) {
    //https://dev.twitter.com/docs/api/1/post/statuses/destroy/%3Aid
    var own_callback = function (reqdata) {

        if ('undefined' === typeof req.data.deleted) {
            req.data.deleted = {};
        }
        req.data.deleted.twitter = 'undefined' === typeof reqdata.error;

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.deleted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    if ('comment' === req.data.type) {

        var token = req.tokens.twitter;
        var secret = req.secrets.twitter;
        var target_id = null;
        if ('undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.twitter) {
            target_id = req.data.target.twitter.id;
        }

        var callback = function (status_code, data) {
            if ('string' === typeof data) {
                data = JSON.parse(data);
            }
            if ('function' === typeof own_callback) {
                own_callback(data);
            }
        };

        var url = 'http://api.twitter.com/1/statuses/destroy/' + target_id + ".json";
        var query = {
            id: target_id
        };
        var postbody = Private.request.querystring(query);

        return Private.request.post(Private.service.twitter, url, token, secret, query, null, callback);

    }
};

Private.twitter.edit = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.repost = function (req, connection, on_success, on_error) {
    //https://dev.twitter.com/docs/api/1/post/statuses/destroy/%3Aid
    var own_callback = function (reqdata) {

        if ('undefined' === typeof req.data.reposted) {
            req.data.reposted = {};
        }
        req.data.reposted.twitter = 'undefined' === typeof reqdata.error;

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.reposted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var token = req.tokens.twitter;
    var secret = req.secrets.twitter;
    var target_id = null;
    if ('undefined' !== typeof req.data && 'undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.twitter) {
        target_id = req.data.target.twitter.id;
    }

    var callback = function (status_code, data) {
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    var url = 'http://api.twitter.com/1/statuses/retweet/' + target_id + ".json";

    return Private.request.post(Private.service.twitter, url, token, secret, null, null, callback);

};

Private.twitter.trash = function (req, connection, on_success, on_error) {
    return false;
};

Private.twitter.trash.revert = function (req, connection, on_success, on_error) {
    return false;
};

/* Github */

Private.github = function (req, connection, on_success, on_error) {
    return false;
};

/* Stream */

Private.github.stream = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if (null === req.data || 'undefined' === typeof req.data) {
            req.data = null;
        }
        if (null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams) {
            req.data = (null === req.data || 'undefined' === typeof req.data) ? {} : req.data;
            req.data.streams = {};
        }
        req.data.streams.github = data;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if (null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query = req.data;
    if ('undefined' === typeof req || 'undefined' === typeof req.ids || 'undefined' === typeof req.ids.yahoo) {
        console.log("Need to pass a data.ids.yahoo string");
        return;
    }

    var url_1 = 'https://api.github.com/user';
    var token = req.tokens.github;
    var secret = req.secrets.github;

    var inception = function (status_code_1, data_1) {
        if ('string' === typeof data_1) {
            data_1 = JSON.parse(data_1);
        }
        if ('string' === typeof status_code_1) {
            status_code_1 = JSON.parse(status_code_1);
        }
        if ('undefined' !== typeof data_1) {
            status_code_1 = data_1.statusCode;
        }
        var user_id = data_1.login;
        var url = 'https://api.github.com/users/' + user_id + '/received_events';
        var callback = function (status_code, data) {

            if ('string' === typeof data) {
                data = JSON.parse(data);
            }
            if ('string' === typeof status_code) {
                status_code = JSON.parse(status_code);
            }
            if ('undefined' !== typeof data) {
                status_code = data.statusCode;
            }
            if ('function' === typeof own_callback) {
                own_callback(data);
            }
        };
        Private.request.get(Private.service.github, url, token, callback);
    };

    Private.request.get(Private.service.github, url_1, token, inception);


};


Private.github.favorite = function (req, connection, on_success, on_error) {
    //http://developer.github.com/v3/gists/
    var own_callback = function () {
        if ('undefined' === typeof req.data.favorited) {
            req.data.favorited = {};
        }
        req.data.favorited.github = true;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.favorited[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query = Private.to.github.note(req.data);
    var target_id = ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id) ? req.data.target.github.id : null;
    var url = 'https://api.github.com/gists/' + target_id + '/star';
    var token = req.tokens.github;
    var secret = req.secrets.github;
    var postbody = JSON.stringify(query);
    var callback = function (data) {
        if ('function' === typeof own_callback) {
            own_callback();
        }
    };

    var contenttype = 'application/json';

    return Private.request.put(Private.service.github, url, token, secret, postbody, contenttype, callback, false);


};

Private.github.unfavorite = function (req, connection, on_success, on_error) {
    //http://developer.github.com/v3/gists/
    var own_callback = function () {
        if ('undefined' === typeof req.data.unfavorited) {
            req.data.unfavorited = {};
        }
        req.data.unfavorited.github = true;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.unfavorited[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query = Private.to.github.note(req.data);
    var target_id = ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id) ? req.data.target.github.id : null;
    var url = 'https://api.github.com/gists/' + target_id + '/star';
    var token = req.tokens.github;
    var secret = req.secrets.github;
    var postbody = JSON.stringify(query);
    var callback = function (data) {
        if ('function' === typeof own_callback) {
            own_callback();
        }
    };

    var contenttype = 'application/json';
    return Private.request.delete(Private.service.github, url, token, secret, callback);


};

Private.github.archive = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.archive.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.watch = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.watch.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.read = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.read.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.view = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.view.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.listen = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.listen.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.checkin = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.checkin.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.post = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {

        if ('undefined' === typeof req.data.upstream_duplicates) {
            req.data.upstream_duplicates = {};
        }
        if ('undefined' === typeof req.data.upstream_duplicates.github) {
            req.data.upstream_duplicates.github = {};
        }

        req.data.upstream_duplicates.github.id = id;
        req.data.upstream_duplicates.github.url = url;

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.upstream_duplicates[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query = Private.to.github.note(req.data);
    var url = 'https://api.github.com/gists';
    var token = req.tokens.github;
    var secret = req.secrets.github;
    var postbody = JSON.stringify(query);
    var callback = function (data) {
        var status_code;
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        status_code = data.statusCode;
        data = data.data;
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        var item_id = null; //data.id;
        var item_url = null; //data.html_url;
        var attr, filename;
        if ('undefined' !== typeof data) {
            if ('undefined' !== typeof data.id) {
                item_id = data.id;
            }
            if ('undefined' !== typeof data.html_url) {
                item_url = data.html_url;
            }
        }
        if ('function' === typeof own_callback) {
            own_callback(item_id, item_url);
        }
    };

    var contenttype = 'application/json';

    return Private.request.post(Private.service.github, url, token, secret, postbody, contenttype, callback, false);

};

Private.github.unpost = function (req, connection, on_success, on_error) {
    //http://developer.github.com/v3/gists/
    var own_callback = function () {
        if ('undefined' === typeof req.data.unposted) {
            req.data.unposted = {};
        }
        req.data.unposted.github = true;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.unposted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query = Private.to.github.note(req.data);
    var target_id = ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id) ? req.data.target.github.id : null;
    var url = 'https://api.github.com/gists/' + target_id;
    var token = req.tokens.github;
    var secret = req.secrets.github;
    var postbody = JSON.stringify(query);
    var callback = function (data) {
        if ('function' === typeof own_callback) {
            own_callback();
        }
    };

    var contenttype = 'application/json';

    Private.request.delete(Private.service.github, url, token, secret, null, null, callback);

};


Private.github.repost = function (req, connection, on_success, on_error) {
    //http://developer.github.com/v3/gists/
    var own_callback = function () {
        if ('undefined' === typeof req.data.reposted) {
            req.data.reposted = {};
        }
        req.data.reposted.github = true;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.reposted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query = Private.to.github.note(req.data);
    var target_id = ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id) ? req.data.target.github.id : null;
    var url = 'https://api.github.com/gists/' + target_id;
    var token = req.tokens.github;
    var secret = req.secrets.github;
    var postbody = JSON.stringify(query);
    var callback = function (data) {
        if ('function' === typeof own_callback) {
            own_callback();
        }
    };

    var contenttype = 'application/json';

    return Private.request.delete(Private.service.github, url, token, secret, postbody, contenttype, callback, false);

};

Private.github.edit = function (req, connection, on_success, on_error) {

    var own_callback = function (id, url) {
        if ('undefined' === typeof req.data.edited) {
            req.data.edited = {};
        }
        req.data.edited.github = id;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.edited[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query = Private.to.github.note(req.data);
    var target_id = ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.github && 'undefined' !== typeof req.data.target.github.id) ? req.data.target.github.id : null;
    var url = 'https://api.github.com/gists/' + target_id;
    var token = req.tokens.github;
    var secret = req.secrets.github;
    var postbody = JSON.stringify(query);
    var callback = function (data) {
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        status_code = data.statusCode;
        data = data.data;
        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        var item_id = null; //data.id;
        var item_url = null; //data.html_url;
        var attr, filename;
        if ('undefined' !== typeof data) {
            if ('undefined' !== typeof data.id) {
                item_id = data.id;
            }
            if ('undefined' !== typeof data.html_url) {
                item_url = data.html_url;
            }
        }
        if ('function' === typeof own_callback) {
            own_callback(item_id, item_url);
        }
    };

    var contenttype = 'application/json';
    //TODO: PATCH req (lol wtf)
    return Private.request.post(Private.service.github, url, token, secret, postbody, contenttype, callback, false);

};


Private.github.trash = function (req, connection, on_success, on_error) {
    return false;
};

Private.github.trash.revert = function (req, connection, on_success, on_error) {
    return false;
};

/* Google */

Private.google = function (req, connection, on_success, on_error) {
    return false;
};

/* Stream */

Private.google.stream = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if (null === req.data || 'undefined' === typeof req.data) {
            req.data = null;
        }
        if (null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams) {
            req.data = (null === req.data || 'undefined' === typeof req.data) ? {} : req.data;
            req.data.streams = {};
        }
        req.data.streams.google = data;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if (null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query = req.data;
    var url;
    if (true === query.own) {
        url = 'https://www.googleapis.com/plus/v1/people/me/activities/public';
    } else {
        console.log('google only supports reading ones own stream (and other users one by one, which aint going to happen)');
        return false;
    }

    var token = req.tokens.google;
    var secret = req.secrets.google;

    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('string' === typeof status_code) {
            status_code = JSON.parse(status_code);
        }
        if ('undefined' !== typeof data) {
            status_code = data.statusCode;
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    Private.request.get(Private.service.google, url, token, callback);


};


Private.google.favorite = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.unfavorite = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.archive = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.archive.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.watch = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.watch.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.read = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.read.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.view = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.view.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.listen = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.listen.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.checkin = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.checkin.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.post = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.unpost = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.edit = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.trash = function (req, connection, on_success, on_error) {
    return false;
};
Private.google.trash.revert = function (req, connection, on_success, on_error) {
    return false;
};


/* Foursquare */

Private.foursquare = function (req, connection, on_success, on_error) {
    return false;
};

/* Stream */

Private.foursquare.stream = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if (null === req.data || 'undefined' === typeof req.data) {
            req.data = null;
        }
        if (null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams) {
            req.data = (null === req.data || 'undefined' === typeof req.data) ? {} : req.data;
            req.data.streams = {};
        }
        if (true === req.raw) {
            req.data.streams.foursquare = data;
        } else {
            var res = [],
                z = 0,
                zitem, zlen = data.response.recent.length;
            for (z = 0; z < zlen; z += 1) {
                zitem = data.response.recent[z];
                if ('checkin' === zitem.type) {
                    //checkin
                    res.push(Private.stream.foursquare.checkin.to.activity(zitem));
                }

            }
            req.data.streams.foursquare = res;
        }

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if (null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query;
    var url = 'https://api.foursquare.com/v2/checkins/recent?v=20110301';

    var token = req.tokens.foursquare;
    var secret = req.secrets.foursquare;

    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('string' === typeof status_code) {
            status_code = JSON.parse(status_code);
        }
        if ('undefined' !== typeof data) {
            status_code = data.statusCode;
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    Private.request.get(Private.service.foursquare, url, token, callback);

};


Private.foursquare.favorite = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.unfavorite = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.archive = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.archive.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.watch = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.watch.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.read = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.read.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.view = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.view.revert = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.listen = function (req, connection, on_success, on_error) {
    return false;
};
Private.foursquare.listen.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.foursquare.checkin = function (req, connection, on_success, on_error) {
    //https://developer.foursquare.com/docs/checkins/add
    return false;
};

Private.foursquare.checkin.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.foursquare.post = function (req, connection, on_success, on_error) {
    //https://developer.foursquare.com/docs/checkins/addcomment
    //https://developer.foursquare.com/docs/tips/add
    //https://developer.foursquare.com/docs/photos/add
    return false;
};

Private.foursquare.unpost = function (req, connection, on_success, on_error) {
    //https://developer.foursquare.com/docs/checkins/deletecomment
    return false;
};

Private.foursquare.trash = function (req, connection, on_success, on_error) {
    return false;
};

Private.foursquare.trash.revert = function (req, connection, on_success, on_error) {
    return false;
};

/* Linkedin */

Private.linkedin = function (req, connection, on_success, on_error) {
    return false;
};

/* Stream */

Private.linkedin.stream = function (req, connection, on_success, on_error) {

    var own_callback = function (data) {
        if (null === req.data || 'undefined' === typeof req.data) {
            req.data = null;
        }
        if (null === req.data || null === req.data.streams || 'undefined' === typeof req.data.streams) {
            req.data = (null === req.data || 'undefined' === typeof req.data) ? {} : req.data;
            req.data.streams = {};
        }
        if (true === req.raw) {
            req.data.streams.linkedin = data;
        } else {
            var res = [],
                z = 0,
                zitem, zlen = data.updates.values.length;
            for (z = 0; z < zlen; z += 1) {
                zitem = data.updates.values[z];
                if ('undefined' !== typeof zitem.updateContent.person && 'undefined' !== typeof zitem.updateContent.person.currentShare && 'undefined' !== typeof zitem.updateContent.person.currentShare.source && 'undefined' !== typeof zitem.updateContent.person.currentShare.source.serviceProvider && 'undefined' !== typeof zitem.updateContent.person.currentShare.source.serviceProvider.name && 'TWITTER' !== zitem.updateContent.person.currentShare.source.serviceProvider.name) {


                    if ('undefined' !== typeof zitem.updateContent.person && 'undefined' !== typeof zitem.updateContent.person.currentShare && 'undefined' !== typeof zitem.updateContent.person.currentShare.content && 'undefined' !== typeof zitem.updateContent.person.currentShare.content.submittedUrl) {
                        //link
                        res.push(Private.stream.linkedin.link.to.activity(zitem));
                    } else if ('undefined' !== typeof zitem.updateContent.person && 'undefined' !== typeof zitem.updateContent.person.currentShare && 'undefined' !== typeof zitem.updateContent.person.currentShare.comment) {
                        //comment (status)
                        res.push(Private.stream.linkedin.comment.to.activity(zitem));
                    }
                }

            }
            req.data.streams.linkedin = res;
        }

        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if (null === req.data || 'undefined' === typeof req.data || null === req.data.streams || 'undefined' === typeof req.data.streams[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };

    var query;
    var url = 'http://api.linkedin.com/v1/people/~/network?type=SHAR';

    var token = req.tokens.linkedin;
    var secret = req.secrets.linkedin;

    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            data = JSON.parse(data);
        }
        if ('string' === typeof status_code) {
            status_code = JSON.parse(status_code);
        }
        if ('undefined' !== typeof data) {
            status_code = data.statusCode;
        }
        if ('function' === typeof own_callback) {
            own_callback(data);
        }
    };

    Private.request.get(Private.service.linkedin, url, token, secret, callback, {
        'x-li-format': 'json'
    });


};


//group posts and social streams
Private.linkedin.favorite = function (req, connection, on_success, on_error) {
    //https://developer.linkedin.com/documents/groups-api
    var own_callback = function (id, url) {
        if ('undefined' === typeof req.data.reposted) {
            req.data.reposted = {};
        }
        req.data.reposted.linkedin = id;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.reposted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };
    //https://developer.linkedin.com/documents/share-api

    var query;
    var url;
    var target_id = ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.linkedin && 'undefined' !== typeof req.data.target.linkedin.id) ? req.data.target.linkedin.id : null;

    if ('comment' === req.data.type || 'link' === req.data.type) {
        url = 'http://api.linkedin.com/v1/posts/' + target_id + '/relation-to-viewer/is-liked';
    } else {
        return false;
    }

    query = true;

    var token = req.tokens.linkedin;
    var secret = req.secrets.linkedin;
    var postbody = JSON.stringify(query);

    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            if ('' === data.replace(/\s/g, '')) {
                data = null;
            } else {
                if (data.match('<error>')) {
                    if ('function' === typeof own_callback) {
                        return own_callback(null, null);
                    }
                } else {
                    data = JSON.parse(data);
                }
            }
        }

        if ('function' === typeof own_callback) {
            return own_callback(item_id, item_url);
        }

    };

    Private.request.put(Private.service.linkedin, url, token, secret, postbody, 'application/json', callback, {
        'x-li-format': 'json'
    });


};

Private.linkedin.unfavorite = function (req, connection, on_success, on_error) {
    //https://developer.linkedin.com/documents/groups-api
    var own_callback = function (id, url) {
        if ('undefined' === typeof req.data.reposted) {
            req.data.reposted = {};
        }
        req.data.reposted.linkedin = id;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.reposted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };
    //https://developer.linkedin.com/documents/share-api

    var query;
    var url;
    var target_id = ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.linkedin && 'undefined' !== typeof req.data.target.linkedin.id) ? req.data.target.linkedin.id : null;

    if ('comment' === req.data.type || 'link' === req.data.type) {
        url = 'http://api.linkedin.com/v1/posts/' + target_id + '/relation-to-viewer/is-liked';
    } else {
        return false;
    }

    query = false;

    var token = req.tokens.linkedin;
    var secret = req.secrets.linkedin;
    var postbody = JSON.stringify(query);

    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            if ('' === data.replace(/\s/g, '')) {
                data = null;
            } else {
                if (data.match('<error>')) {
                    if ('function' === typeof own_callback) {
                        return own_callback(null, null);
                    }
                } else {
                    data = JSON.parse(data);
                }
            }
        }

        if ('function' === typeof own_callback) {
            return own_callback(item_id, item_url);
        }

    };

    Private.request.put(Private.service.linkedin, url, token, secret, postbody, 'application/json', callback, {
        'x-li-format': 'json'
    });

};

Private.linkedin.archive = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.archive.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.watch = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.watch.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.read = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.read.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.view = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.view.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.listen = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.listen.revert = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.checkin = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.checkin.revert = function (req, connection, on_success, on_error) {
    return false;
};


// Supports note (group post), comment (status) and link
Private.linkedin.post = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('undefined' === typeof req.data.upstream_duplicates) {
            req.data.upstream_duplicates = {};
        }
        if ('undefined' === typeof req.data.upstream_duplicates.linkedin) {
            req.data.upstream_duplicates.linkedin = {};
        }
        req.data.upstream_duplicates.linkedin.id = id;
        req.data.upstream_duplicates.linkedin.url = url;
        if ('undefined' !== typeof req.meta && 'undefined' !== typeof req.meta.id) {
            if ('undefined' === typeof req.data.upstream_duplicates.local) {
                req.data.upstream_duplicates.local = {};
            }
            req.data.upstream_duplicates.local.id = req.meta.id;
        }
        req.data.verb = 'post';
        req.verb = 'publish';
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.upstream_duplicates[service]) {
                complete = false;
            }
        }
        if (complete) {
            var return_obj = {
                object: req.data,
                generator: {
                    id: 'newsgregator'
                },
                verb: 'publish'
            };
            if ('function' === typeof on_success) {
                on_success(return_obj);
            }
        }
    };
    //https://developer.linkedin.com/documents/share-api

    //http://msdn.microsoft.com/en-us/library/hh243648.aspx#activity
    var query;
    var url;

    if ('comment' === req.data.type) {
        query = Private.to.linkedin.comment(req.data);
        url = 'http://api.linkedin.com/v1/people/~/shares';
    } else if ('link' === req.data.type) {
        query = Private.to.linkedin.link(req.data);
        url = 'http://api.linkedin.com/v1/people/~/shares';
    } else if ('note' === req.data.type) {
        if ('undefined' === typeof req.data.target || 'undefined' === typeof req.data.target.linkedin || 'undefined' === typeof req.data.target.linkedin.group) {
            return false;
        }
        query = Private.to.linkedin.note(req.data);
        url = 'http://api.linkedin.com/v1/groups/' + req.data.target.linkedin.group + '/posts';
    }

    var token = req.tokens.linkedin;
    var secret = req.secrets.linkedin;
    var postbody = JSON.stringify(query);

    var callback = function (status_code, data) {
        if ('string' === typeof data) {
            if ('' === data.replace(/\s/g, '')) {
                data = null;
            } else {
                if (data.match('<error>')) {
                    if ('function' === typeof own_callback) {
                        return own_callback(null, null);
                    }
                } else {
                    data = JSON.parse(data);
                }
            }
        }
        var item_id = null;
        var item_url = null;
        if ('note' === req.data.type) {
            var url2 = 'http://api.linkedin.com/v1/groups/' + req.data.target.linkedin.group + '/posts:(site-group-post-url,id,creation-timestamp,title,summary,creator:(first-name,last-name,picture-url,headline),likes,attachment:(image-url,content-domain,content-url,title,summary),relation-to-viewer)?category=discussion&order=recency&count=5';
            var res2 = Private.request.get(Private.service.linkedin, url2, token, secret, function (status_code2, data2) {
                if ('string' === typeof data2) {
                    data2 = JSON.parse(data2);
                }
                if (400 == data2.status) {
                    return;
                }
                var x = 0,
                    xlen = data2.values.length,
                    item;
                for (x = 0; x < xlen; x += 1) {
                    item = data2.values[x];
                    var orig = req.data.title;
                    ;
                    var newer = item.title;
                    if (newer === orig) {
                        item_id = item.id;
                        item_url = item.siteGroupPostUrl;
                        break;
                    }
                }
                if ('function' === typeof own_callback) {
                    return own_callback(item_id, item_url);
                }
            }, {
                'x-li-format': 'json'
            });
        } else {
            var url2 = 'http://api.linkedin.com/v1/people/~/network/updates?scope=self&type=SHAR';
            var res2 = Private.request.get(Private.service.linkedin, url2, token, secret, function (status_code2, data2) {
                if ('string' === typeof data2) {
                    data2 = JSON.parse(data2);
                }
                var x = 0,
                    xlen = data2.values.length,
                    item;
                for (x = 0; x < xlen; x += 1) {
                    item = data2.values[x];
                    var orig = req.data.text.split(' ')[0];
                    var newer = item.updateContent.person.currentShare.comment.split(' ')[0];
                    if (newer === orig) {
                        item_id = item.updateContent.person.currentShare.id;
                        break;
                    }
                }

                if ('function' === typeof own_callback) {
                    return own_callback(item_id, item_url);
                }
            }, {
                'x-li-format': 'json'
            });
        }
    };

    Private.request.post(Private.service.linkedin, url, token, secret, postbody, 'application/json', callback, {
        'x-li-format': 'json'
    });

};

Private.linkedin.unpost = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.repost = function (req, connection, on_success, on_error) {
    var own_callback = function (id, url) {
        if ('undefined' === typeof req.data.reposted) {
            req.data.reposted = {};
        }
        if ('undefined' === typeof req.data.upstream_duplicates) {
            req.data.upstream_duplicates = {};
        }
        if ('undefined' === typeof req.data.upstream_duplicates.local) {
            req.data.upstream_duplicates.local = {};
        }
        if ('undefined' !== typeof req.meta && 'undefined' !== typeof req.meta.id) {
            req.data.upstream_duplicates.local.id = req.meta.id;
        }
        req.data.verb = 'repost';
        req.verb = 'publish';
        req.data.reposted.linkedin = id;
        var x = 0,
            xlen = req.services.length,
            service;
        var complete = true;
        for (x = 0; x < xlen; x += 1) {
            service = req.services[x];
            if ('undefined' === typeof req.data.reposted[service]) {
                complete = false;
            }
        }
        if (complete) {
            if ('function' === typeof on_success) {
                on_success(req);
            }
        }
    };
    //https://developer.linkedin.com/documents/share-api

    var query;
    query.meta = req.meta;
    var url;

    if ('comment' === req.data.type || 'link' === req.data.type) {
        url = 'http://api.linkedin.com/v1/people/~/shares';
    } else {
        return false;
    }

    var target_id = ('undefined' !== typeof req.data.target && 'undefined' !== typeof req.data.target.linkedin && 'undefined' !== typeof req.data.target.linkedin.id) ? req.data.target.linkedin.id : null;

    query.attribution = {
        id: target_id,
        comment: (('undefined' !== typeof req.data && 'undefined' !== typeof req.data.text) ? req.data.text : null)
    };

    var token = req.tokens.linkedin;
    var secret = req.secrets.linkedin;
    var postbody = JSON.stringify(query);

    var callback = function (status_code, data) {

        if ('string' === typeof data) {
            if ('' === data.replace(/\s/g, '')) {
                data = null;
            } else {
                if (data.match('<error>')) {
                    if ('function' === typeof own_callback) {
                        return own_callback(null, null);
                    }
                } else {
                    data = JSON.parse(data);
                }
            }
        }

        if ('function' === typeof own_callback) {
            return own_callback(item_id, item_url);
        }

    };

    Private.request.post(Private.service.linkedin, url, token, secret, postbody, 'application/json', callback, {
        'x-li-format': 'json'
    });

};

Private.linkedin.edit = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.trash = function (req, connection, on_success, on_error) {
    return false;
};

Private.linkedin.trash.revert = function (req, connection, on_success, on_error) {
    return false;
};

/* */
/* End Services */
/* */

var Public = function () {

};

Public.prototype.request = function (request, connection, type) {

    if ('socket' === type) {
        var error = function (err) {
            connection.emit(Private.prefix, {
                'Error': 'Something went awry with the request'
            });
        };
        var success = function (response) {
            connection.emit(Private.prefix, response);
        };
        Private.do(request, connection, null, success, error);
    }

};

Public.prototype.service = function (service) {
    return Private.service(service);
};

Public.prototype.secrets = function (path) {

    var fs = require('fs');

    if ('undefined' === typeof path || null === path) {
        throw new Error('Keypath cannot be empty');
    }

    var auth_keys = ('string' === typeof path) ? fs.readFileSync(path, 'utf8') : path,
        twitter = auth_keys.twitter,
        facebook = auth_keys.facebook,
        google = auth_keys.google,
        yahoo = auth_keys.yahoo,
        soundcloud = auth_keys.soundcloud,
        wordpress = auth_keys.wordpress,
        youtube = auth_keys.youtube,
        blogger = auth_keys.blogger,
        windows = auth_keys.windows,
        foursquare = auth_keys.foursquare,
        github = auth_keys.github,
        linkedin = auth_keys.linkedin,
        evernote = auth_keys.evernote,
        instagram = auth_keys.instagram,
        vimeo = auth_keys.vimeo,
        tumblr = auth_keys.tumblr,
        reddit = auth_keys.reddit;

    // Twitter (oAuth 1.0)
    if (!!twitter) {
        Private.service.twitter = new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", twitter.id, twitter.secret, "1.0", twitterCallbackAddress || null, "HMAC-SHA1");
    }

    // Facebook (oAuth 2)
    if (!!facebook) {
        Private.service.facebook = new OAuth2(facebook.id, facebook.secret, "https://graph.facebook.com");
    }

    // Google (oAuth 2)
    if (!!google) {
        Private.service.google = new OAuth2(google.id, google.secret, "", "https://accounts.google.com/o/oauth2/auth", "https://accounts.google.com/o/oauth2/token");
    }

    // Foursquare (oAuth 2)
    if (!!foursquare) {
        Private.service.foursquare = new OAuth2(foursquare.id, foursquare.secret, "https://foursquare.com", "/oauth2/authenticate", "/oauth2/access_token", "HMAC-SHA1");
        Private.service.foursquare.setAccessTokenName("oauth_token");
    }

    // Tumblr (oauth 1.0)
    if (!!tumblr) {
        Private.service.tumblr = new OAuth("http://www.tumblr.com/oauth/request_token", "http://www.tumblr.com/oauth/access_token", tumblr.id, tumblr.secret, "1.0", tumblr.callback || null, "HMAC-SHA1");
    }

    // Github (oAuth 2)
    if (!!github) {
        Private.service.github = new OAuth2(github.id, github.secret, "https://github.com", "/login/oauth/authorize", "/login/oauth/access_token", "HMAC-SHA1");
        Private.service.github.setAccessTokenName("access_token");
    }

    // Linkedin (oauth 1.0)
    if (!!linkedin) {
        Private.service.linkedin = new OAuth("https://api.linkedin.com/uas/oauth/requestToken", "https://api.linkedin.com/uas/oauth/accessToken", linkedin.id, linkedin.secret, "1.0", linkedin.callback || null, "HMAC-SHA1");
    }

};


Public.prototype.stream = function (req, connection, on_success, on_error) {
    return Private.stream(req, connection, null, own_callback, on_error);
};

Public.prototype.favorite = function (req, connection, on_success, on_error) {
    return Private.favorite(req, connection, null, own_callback, on_error);
};

Public.prototype.unfavorite = function (req, connection, on_success, on_error) {
    return Private.favorite(req, connection, true, own_callback, on_error);
};

Public.prototype.archive = function (req, connection, on_success, on_error) {
    return Private.archive(req, connection, null, own_callback, on_error);
};

Public.prototype.unarchive = function (req, connection, on_success, on_error) {
    return Private.archive(req, connection, true, own_callback, on_error);
};

Public.prototype.watch = function (req, connection, on_success, on_error) {
    return Private.watch(req, connection, null, own_callback, on_error);
};

Public.prototype.unwatch = function (req, connection, on_success, on_error) {
    return Private.watch(req, connection, true, own_callback, on_error);
};

Public.prototype.read = function (req, connection, on_success, on_error) {
    return Private.read(req, connection, null, own_callback, on_error);
};

Public.prototype.unread = function (req, connection, on_success, on_error) {
    return Private.read(req, connection, true, own_callback, on_error);
};

Public.prototype.view = function (req, connection, on_success, on_error) {
    return Private.view(req, connection, null, own_callback, on_error);
};

Public.prototype.unview = function (req, connection, on_success, on_error) {
    return Private.view(req, connection, true, own_callback, on_error);
};

Public.prototype.listen = function (req, connection, on_success, on_error) {
    return Private.listen(req, connection, null, own_callback, on_error);
};

Public.prototype.unlisten = function (req, connection, on_success, on_error) {
    return Private.listen(req, connection, true, own_callback, on_error);
};

Public.prototype.checkin = function (req, connection, on_success, on_error) {
    return Private.checkin(req, connection, null, own_callback, on_error);
};

Public.prototype.uncheckin = function (req, connection, on_success, on_error) {
    return Private.checkin(req, connection, true, own_callback, on_error);
};

Public.prototype.post = function (req, connection, on_success, on_error) {
    return Private.post(req, connection, null, own_callback, on_error);
};

Public.prototype.unpost = function (req, connection, on_success, on_error) {
    return Private.post(req, connection, true, own_callback, on_error);
};

Public.prototype.trash = function (req, connection, on_success, on_error) {
    return Private.trash(req, connection, null, own_callback, on_error);
};

Public.prototype.untrash = function (req, connection, on_success, on_error) {
    return Private.trash(req, connection, true, own_callback, on_error);
};

/* Action Stream */

Private.utils = Private.utils || {};
Private.utils.toSlug = function (value) {
    return value.replace(/[^a-zA-Z0-9-_]+/g, "");
};

Private.stream = Private.stream || {};

Private.stream.facebook = Private.stream.facebook || {};
Private.stream.facebook.comment = Private.stream.facebook.comment || {};
Private.stream.facebook.comment.to = Private.stream.facebook.comment.to || {};

//Facebook comment (status)
Private.stream.facebook.comment.to.activity = function (data) {

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

    var activ = AS.activity(request);
    return activ;
};


Private.stream.facebook.link = Private.stream.facebook.link || {};
Private.stream.facebook.link.to = Private.stream.facebook.link.to || {};

Private.stream.facebook.link.to.activity = function (data) {

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

    var activ = AS.activity(request);
    return activ;
};


Private.stream.facebook.note = Private.stream.facebook.note || {};
Private.stream.facebook.note.to = Private.stream.facebook.note.to || {};

Private.stream.facebook.note.to.activity = function (data) {

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
    var activ = AS.activity(request);
    return activ;
};


Private.stream.twitter = Private.stream.twitter || {};
Private.stream.twitter.comment = Private.stream.twitter.comment || {};
Private.stream.twitter.comment.to = Private.stream.twitter.comment.to || {};

Private.stream.twitter.comment.to.activity = function (data) {
    if (!data || "undefined" === typeof data.user || 'undefined' !== typeof data.delete && 'undefined' !== typeof data.scrub_geo || 'undefined' !== typeof data.limit) {
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

    if (!!data.retweeted_status) {
        request['verb'] = 'retweet';
        request['target_id'] = data.retweeted_status.user.screen_name;
        request['target_display_name'] = data.retweeted_status.user.name;
        request['target_image_url'] = data.retweeted_status.user.profile_image_url;
        request['target_url'] = data.retweeted_status.user.url;
        request['target_content'] = data.retweeted_status.text;
    } else if (null !== data.in_reply_to_user_id_str) {
        request['target_id'] = data.in_reply_to_user_id_str;
        request['target_display_name'] = data.in_reply_to_user_id_str;
    }
    var activ = AS.activity(request);
    return activ;
};


Private.stream.tumblr = Private.stream.tumblr || {};
Private.stream.tumblr.comment = Private.stream.tumblr.comment || {};
Private.stream.tumblr.comment.to = Private.stream.tumblr.comment.to || {};

//Tumblr comment (status)
Private.stream.tumblr.comment.to.activity = function (data) {
    return false;
};

Private.stream.tumblr.image = Private.stream.tumblr.image || {};
Private.stream.tumblr.image.to = Private.stream.tumblr.image.to || {};
Private.stream.tumblr.image.to.activity = function (data) {
    return false; //TODO: type: photo
};

Private.stream.tumblr.video = Private.stream.tumblr.image || {};
Private.stream.tumblr.video.to = Private.stream.tumblr.image.to || {};
Private.stream.tumblr.video.to.activity = function (data) {
    return false; //TODO: type: video
};


Private.stream.tumblr.link = Private.stream.tumblr.link || {};
Private.stream.tumblr.link.to = Private.stream.tumblr.link.to || {};

Private.stream.tumblr.link.to.activity = function (data) {

    var request = {
        'actor_display_name': data.blog_name,
        'actor_id': data.blog_name,
        'object_id': data.id,
        'object_attachments': [{
            'key': 'reblog_key',
            'value': data.reblog_key
        }],
        'object_url': data.post_url,
        'object_display_name': data.title,
        'object_summary': data.description,
        'object_object_type': 'link',
        'verb': 'post',
        'object_published': data.date,
        'provider_display_name': 'Tumblr',
        'provider_id': 'tumblr'
    };

    var activ = AS.activity(request);
    return activ;
};


Private.stream.tumblr.note = Private.stream.tumblr.note || {};
Private.stream.tumblr.note.to = Private.stream.tumblr.note.to || {};

//Tumblr note (text post)
Private.stream.tumblr.note.to.activity = function (data) {

    var request = {
        'actor_display_name': data.blog_name,
        'actor_id': data.blog_name,
        'object_id': data.id,
        'object_attachments': [{
            'key': 'reblog_key',
            'value': data.reblog_key
        }],
        'object_url': data.post_url,
        'object_display_name': data.title,
        'object_content': data.body,
        'object_object_type': 'note',
        'verb': 'post',
        'object_published': data.date,
        'provider_display_name': 'Tumblr',
        'provider_id': 'tumblr'
    };

    return AS.activity(request);
};

Private.stream.github = Private.stream.github || {};
Private.stream.github.comment = Private.stream.github.comment || {};
Private.stream.github.comment.to = Private.stream.github.comment.to || {};

Private.stream.github.comment.to.activity = function (data) {
    if (!data || "undefined" === typeof data.user || 'undefined' !== typeof data.delete && 'undefined' !== typeof data.scrub_geo || 'undefined' !== typeof data.limit) {
        return;
    }
    var request = {
        'object_url': "http://github.com/#!/" + data.user.screen_name.toLowerCase() + "/status/" + data.id_str,
        'actor_display_name': payload.commits[0].author.name || data.actor.login,
        'actor_id': data.actor.login,
        'actor_image_url': 'https://secure.gravatar.com/avatar/' + data.actor.gravatar_id + '?d=https://a248.e.akamai.net/assets.github.com/images/gravatars/gravatar-140.png',
        'actor_url': data.user.url,
        'actor_summary': data.user.description,
        'object_id': data.id,
        'object_summary': data.payoad.commits[0].message,
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

    if (!!data.retweeted_status) {
        request['verb'] = 'retweet';
        request['target_id'] = data.retweeted_status.user.screen_name;
        request['target_display_name'] = data.retweeted_status.user.name;
        request['target_image_url'] = data.retweeted_status.user.profile_image_url;
        request['target_url'] = data.retweeted_status.user.url;
        request['target_content'] = data.retweeted_status.text;
    } else if (null !== data.in_reply_to_user_id_str) {
        request['target_id'] = data.in_reply_to_user_id_str;
        request['target_display_name'] = data.in_reply_to_user_id_str;
    }
    var activ = AS.activity(request);
    return activ;
};


Private.stream.linkedin = Private.stream.linkedin || {};
Private.stream.linkedin.link = Private.stream.linkedin.link || {};
Private.stream.linkedin.link.to = Private.stream.linkedin.link.to || {};

Private.stream.linkedin.link.to.activity = function (data) {

    var request = {
        'actor_display_name': data.updateContent.person.currentShare.author.firstName + ' ' + data.updateContent.person.currentShare.author.lastName,
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

    var activ = AS.activity(request);
    return activ;
};


Private.stream.linkedin.comment = Private.stream.linkedin.comment || {};
Private.stream.linkedin.comment.to = Private.stream.linkedin.comment.to || {};

//Linkedin comment (status update)
Private.stream.linkedin.comment.to.activity = function (data) {

    var request = {
        'actor_display_name': data.updateContent.person.currentShare.author.firstName + ' ' + data.updateContent.person.currentShare.author.lastName,
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

    var activ = AS.activity(request);
    return activ;
};


Private.stream.foursquare = Private.stream.foursquare || {};
Private.stream.foursquare.checkin = Private.stream.foursquare.checkin || {};
Private.stream.foursquare.checkin.to = Private.stream.foursquare.checkin.to || {};

//Linkedin comment (status update)
Private.stream.foursquare.checkin.to.activity = function (data) {

    var request = {
        'actor_display_name': data.user.firstName + ' ' + data.user.lastName,
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

    return AS.activity(request);
};

// Public API
module.exports = new Public();
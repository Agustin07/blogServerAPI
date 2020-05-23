"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlDeleteComment = exports.sqlUpdateComment = exports.queryExistComment = exports.sqlInsertComment = exports.queryCommentsByPostId = exports.queryAllComments = exports.queryPostById = exports.sqlDeletePost = exports.sqlUpdatePost = exports.sqlInsertPost = exports.queryExistPost = exports.queryAllPost = exports.connectpg = void 0;
// ---- external modules
const pg_1 = require("pg");
exports.connectpg = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'blogDB',
    port: 5432
});
//     ----------------  BLOG POSTS SCRIPTS   ----------------   //
exports.queryAllPost = " SELECT P.ID_POST AS POST_ID, P.TITLE_TEXT AS POST_TITLE, P.BODY_TEXT AS POST_CONTENT, P.AUTHOR AS POST_AUTHOR, P.DATE_POSTED AS POSTED_DATE "
    + " FROM BLOG_POST P "
    + " WHERE P.ISDELETED=FALSE ORDER BY P.DATE_POSTED DESC;";
exports.queryExistPost = ' SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST=$1 AND ISDELETED=FALSE LIMIT 1;';
exports.sqlInsertPost = " INSERT INTO BLOG_POST (TITLE_TEXT, BODY_TEXT, AUTHOR) "
    + " VALUES ($1,$2,$3); ";
exports.sqlUpdatePost = " UPDATE BLOG_POST SET TITLE_TEXT=$1, BODY_TEXT=$2 "
    + " WHERE ID_POST=$3 AND ISDELETED=FALSE;";
exports.sqlDeletePost = " UPDATE BLOG_POST SET ISDELETED=TRUE WHERE ID_POST=$1 ; ";
exports.queryPostById = " SELECT P.ID_POST AS POST_ID, P.TITLE_TEXT AS POST_TITLE, "
    + " P.BODY_TEXT AS POST_CONTENT, P.AUTHOR AS POST_AUTHOR, P.DATE_POSTED AS POSTED_DATE "
    + " FROM BLOG_POST P WHERE ID_POST=$1 AND P.ISDELETED=FALSE;";
//     --------------- POST COMMENTS SCRIPTS  ----------------  //
exports.queryAllComments = " SELECT C.ID_POST AS POST_ID, C.ID_COMMENT AS COMMENT_ID, C.COMMENT AS COMMENT_CONTENT,  C.USERNAME AS COMMENT_USERNAME, C.DATE_POSTED AS POSTED_DATE "
    + " FROM POST_COMMENT C JOIN BLOG_POST P ON P.ID_POST=C.ID_POST "
    + " WHERE P.ISDELETED=FALSE AND C.ISDELETED=FALSE ORDER BY C.DATE_POSTED ASC; ";
exports.queryCommentsByPostId = " SELECT C.ID_POST AS POST_ID, C.ID_COMMENT AS COMMENT_ID, C.COMMENT AS COMMENT_CONTENT, "
    + " C.USERNAME AS COMMENT_USERNAME, C.DATE_POSTED AS POSTED_DATE  "
    + " FROM POST_COMMENT C WHERE C.ID_POST=$1 AND C.ISDELETED=FALSE;";
exports.sqlInsertComment = " INSERT INTO POST_COMMENT (ID_POST, COMMENT, USERNAME) "
    + " VALUES ($1,$2,$3); ";
exports.queryExistComment = " SELECT COUNT(C.*) AS FOUND FROM POST_COMMENT C JOIN BLOG_POST P ON P.ID_POST=C.ID_POST "
    + " WHERE C.ID_COMMENT=$1 AND P.ISDELETED=FALSE AND C.ISDELETED=FALSE;";
exports.sqlUpdateComment = " UPDATE POST_COMMENT SET COMMENT=$1, USERNAME=$2  WHERE ID_COMMENT=$3 AND ISDELETED=FALSE;";
exports.sqlDeleteComment = "UPDATE POST_COMMENT SET ISDELETED=TRUE WHERE ID_COMMENT=$1 ;";

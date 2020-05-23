import { Pool } from 'pg'

export const connectpg = new Pool({
    user:'postgres',
    host:'localhost',
    password:'postgres',
    database: 'blogDB',
    port: 5432
});


//     ----------------  BLOG POSTS SCRIPTS   ----------------   //


export const queryAllPost = " SELECT P.ID_POST AS POST_ID, P.TITLE_TEXT AS POST_TITLE, P.BODY_TEXT AS POST_CONTENT, P.AUTHOR AS POST_AUTHOR, P.DATE_POSTED AS POSTED_DATE "
                          + " FROM BLOG_POST P "
                          + " WHERE P.ISDELETED=FALSE ORDER BY P.DATE_POSTED DESC;"


export const queryExistPost = ' SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST=$1 AND ISDELETED=FALSE LIMIT 1;'


export const sqlInsertPost = " INSERT INTO BLOG_POST (TITLE_TEXT, BODY_TEXT, AUTHOR) "
                           + " VALUES ($1,$2,$3); ";


export const sqlUpdatePost = " UPDATE BLOG_POST SET TITLE_TEXT=$1, BODY_TEXT=$2 "
                           + " WHERE ID_POST=$3 AND ISDELETED=FALSE;";


export const sqlDeletePost = " UPDATE BLOG_POST SET ISDELETED=TRUE WHERE ID_POST=$1 ; ";


export const queryPostById = " SELECT P.ID_POST AS POST_ID, P.TITLE_TEXT AS POST_TITLE, " 
                           + " P.BODY_TEXT AS POST_CONTENT, P.AUTHOR AS POST_AUTHOR, P.DATE_POSTED AS POSTED_DATE " 
                           + " FROM BLOG_POST P WHERE ID_POST=$1 AND P.ISDELETED=FALSE;";



//     --------------- POST COMMENTS SCRIPTS  ----------------  //


export const queryAllComments = " SELECT C.ID_POST AS POST_ID, C.ID_COMMENT AS COMMENT_ID, C.COMMENT AS COMMENT_CONTENT,  C.USERNAME AS COMMENT_USERNAME, C.DATE_POSTED AS POSTED_DATE "
                              + " FROM POST_COMMENT C JOIN BLOG_POST P ON P.ID_POST=C.ID_POST "
                              + " WHERE P.ISDELETED=FALSE AND C.ISDELETED=FALSE ORDER BY C.DATE_POSTED ASC; "


export const queryCommentsByPostId = " SELECT C.ID_POST AS POST_ID, C.ID_COMMENT AS COMMENT_ID, C.COMMENT AS COMMENT_CONTENT, "
                                   + " C.USERNAME AS COMMENT_USERNAME, C.DATE_POSTED AS POSTED_DATE  "
                                   + " FROM POST_COMMENT C WHERE C.ID_POST=$1 AND C.ISDELETED=FALSE;";

export const sqlInsertComment = " INSERT INTO POST_COMMENT (ID_POST, COMMENT, USERNAME) "
                              + " VALUES ($1,$2,$3); ";


export const queryExistComment = " SELECT COUNT(C.*) AS FOUND FROM POST_COMMENT C JOIN BLOG_POST P ON P.ID_POST=C.ID_POST "
                               + " WHERE C.ID_COMMENT=$1 AND P.ISDELETED=FALSE AND C.ISDELETED=FALSE;"


export const sqlUpdateComment = " UPDATE POST_COMMENT SET COMMENT=$1, USERNAME=$2  WHERE ID_COMMENT=$3 AND ISDELETED=FALSE;";


export const sqlDeleteComment = "UPDATE POST_COMMENT SET ISDELETED=TRUE WHERE ID_COMMENT=$1 ;";
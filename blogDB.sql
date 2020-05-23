/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     18/5/2020 12:51:43                           */
/*==============================================================*/

/*
drop index BLOG_POST_PK;

drop table BLOG_POST;

drop index MAY_BE_ADDED_TO_FK;

drop index POST_COMMENT_PK;

drop table POST_COMMENT; 

*/

CREATE DATABASE blogDB;

\l;

\c blogDB;

/*==============================================================*/
/* Table: BLOG_POST                                             */
/*==============================================================*/
create table BLOG_POST (
   ID_POST              SERIAL               not null,
   TITLE_TEXT           VARCHAR(150)         not null,
   BODY_TEXT            VARCHAR(1000)        not null,
   AUTHOR               VARCHAR(50)          not null,
   ISDELETED            BOOLEAN         default false,
   DATE_POSTED          TIMESTAMP       default now(), 
   constraint PK_BLOG_POST primary key (ID_POST)
);

/*==============================================================*/
/* Index: BLOG_POST_PK                                          */
/*==============================================================*/
create unique index BLOG_POST_PK on BLOG_POST (
ID_POST
);

/*==============================================================*/
/* Table: POST_COMMENT                                          */
/*==============================================================*/
create table POST_COMMENT (
   ID_COMMENT           SERIAL               not null,
   ID_POST              INT4                 not null,
   COMMENT              VARCHAR(500)         not null,
   USERNAME             VARCHAR(50)          null,
   ISDELETED            BOOLEAN         default false,
   DATE_POSTED          TIMESTAMP       default now(), 
   constraint PK_POST_COMMENT primary key (ID_COMMENT, ID_POST)
);

/*==============================================================*/
/* Index: POST_COMMENT_PK                                       */
/*==============================================================*/
create unique index POST_COMMENT_PK on POST_COMMENT (
ID_COMMENT,
ID_POST
);

/*==============================================================*/
/* Index: MAY_BE_ADDED_TO_FK                                    */
/*==============================================================*/
create  index MAY_BE_ADDED_TO_FK on POST_COMMENT (
ID_POST
);

alter table POST_COMMENT
   add constraint FK_POST_COM_MAY_BE_AD_BLOG_POS foreign key (ID_POST)
      references BLOG_POST (ID_POST);


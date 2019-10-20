import React from 'react';
import { IArticle } from '../../types';
import { Link } from '@reach/router';
import { ALT_IMAGE_URL } from '../../utils';

type ArticleAvatarProps = {
  article: IArticle;
}

export default function ArticleAvatar({
  article: { author, createdAt },
}: ArticleAvatarProps) {
  return (
    <>
      <Link to={`/${author.username}`}>
        <img src={author.image || ALT_IMAGE_URL} alt={author.username} />
      </Link>

      <div className='info'>
        <Link className='author' to={`/${author.username}`}>
          {author.username}
        </Link>
        <span className='date'>{new Date(createdAt).toDateString()}</span>
      </div>
    </>
  )
}
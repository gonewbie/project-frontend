import React from 'react';
import { editorReducer, initialState } from '../reducers/editor';
import { RouteComponentProps, navigate } from '@reach/router';
import { getArticle, updateArticle, createArticle } from '../api/ArticlesAPI';
import ListErrors from './common/ListErrors';

export default function Editor({
  slug = '',
}: RouteComponentProps<{ slug: string }>) {
  const [state, dispatch] = React.useReducer(editorReducer, initialState);

  React.useEffect(() => {
    let ignore = false;
    
    const fetchArticle = async () => {
      try {
        const payload = await getArticle(slug);
        const { title, description, body, tagList } = payload.data.article;
        if (!ignore) {
          dispatch({
            type: 'SET_FORM',
            form: { title, description, body, tag: '' },
          });
          dispatch({ type: 'SET_TAGS', tagList });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (slug) {
      fetchArticle();
    }

    return () => {
      ignore = true;
    };
  }, [slug]);

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // @ts-ignore
    dispatch({
      type: 'UPDATE_FORM',
      field: {
        key: event.currentTarget.name,
        value: event.currentTarget.value,
      },
    });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      dispatch({ type: 'ADD_TAG', tag: event.currentTarget.value });
      dispatch({ type: 'UPDATE_FORM', field: { key: 'tag', value: '' } });
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const { title, description, body } = state.form;
      const article = { title, description, body, tagList: state.tagList };
      let payload;
      if (slug) {
        payload = await updateArticle({ slug, ...article });
      } else {
        payload = await createArticle(article);
        console.log(article);
      }
      navigate(`/article/${payload.data.article.slug}`);
    } catch (error) {
      console.error(error);
      if (error.status === 422) {
        dispatch({ type: 'SET_ERRORS', errors: error.data.errors });
      }
    }
  };
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={state.errors} />

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  name="title"
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Article Title"
                  value={state.form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input
                  name="description"
                  className="form-control"
                  type="text"
                  placeholder="What's this article about?"
                  value={state.form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <textarea
                  name="body"
                  className="form-control"
                  rows={8}
                  placeholder="Write your article (in markdown)"
                  value={state.form.body}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input
                  name="tag"
                  className="form-control"
                  type="text"
                  placeholder="Enter tags"
                  value={state.form.tag}
                  onChange={handleChange}
                  onKeyUp={handleKeyUp}
                />

                <div className="tag-list">
                  {state.tagList.map((tag) => {
                    return (
                      <span className="tag-default tag-pill" key={tag}>
                        <i
                          className="ion-close-round"
                          onClick={() => dispatch({ type: 'REMOVE_TAG', tag })}
                        />
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              <button
                className="btn btn-lg pull-xs-right btn-primary"
                type="submit"
              >
                Publish Article
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}